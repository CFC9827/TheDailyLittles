/**
 * Auth Context
 * 
 * Provides authentication state throughout the app.
 * Handles guest → registered user flow.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, type User, type Session } from '../services/supabase';
import type { Profile } from '../services/database.types';


export interface AuthState {
    // Auth state
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    isLoading: boolean;

    // Guest state
    isGuest: boolean;
    guestId: string;
    guestUsername: string;

    // Computed
    isAuthenticated: boolean;
    isPremium: boolean;
    displayName: string;

    // Actions
    signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUpWithEmail: (email: string, password: string, username: string) => Promise<{ error: Error | null }>;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    updateUsername: (username: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load profile when user changes
    const loadProfile = useCallback(async (userId: string) => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (data) {
            setProfile(data);
        }
    }, []);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await loadProfile(session.user.id);
            }

            setIsLoading(false);
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await loadProfile(session.user.id);
                } else {
                    setProfile(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [loadProfile]);

    // Sign in with email/password
    const signInWithEmail = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error as Error | null };
    };

    // Sign up with email/password
    const signUpWithEmail = async (email: string, password: string, username: string) => {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) return { error: error as Error };

        // Create profile
        if (data.user) {
            const { error: profileError } = await supabase.from('profiles').insert({
                id: data.user.id,
                username,
                display_name: username,
            } as never);

            if (profileError) return { error: profileError as Error };
        }

        return { error: null };
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin },
        });
        return { error: error as Error | null };
    };


    // Sign in with magic link
    const signInWithMagicLink = async (email: string) => {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: window.location.origin },
        });
        return { error: error as Error | null };
    };

    // Sign out
    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
        // Navigate to home
        window.location.href = '/';
    };

    // Update username
    const updateUsername = async (username: string) => {
        if (!user) return { error: new Error('Not authenticated') };

        const { error } = await supabase
            .from('profiles')
            .update({ username } as never)
            .eq('id', user.id);

        if (!error && profile) {
            setProfile({ ...profile, username });
        }

        return { error: error as Error | null };
    };

    const value: AuthState = {
        user,
        session,
        profile,
        isLoading,

        isGuest: !user,
        guestId: '',
        guestUsername: 'Guest',

        isAuthenticated: !!user,
        isPremium: profile?.is_premium ?? false,
        displayName: profile?.display_name || profile?.username || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest',

        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithMagicLink,
        signOut,
        updateUsername,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(): AuthState {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
