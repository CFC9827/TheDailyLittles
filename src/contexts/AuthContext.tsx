/**
 * Auth Context
 * 
 * Provides authentication state throughout the app.
 * Handles guest → registered user flow.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, type User, type Session } from '../services/supabase';
import type { Profile } from '../services/database.types';

// Generate a random guest username
function generateGuestUsername(): string {
    const adjectives = ['Happy', 'Clever', 'Swift', 'Bright', 'Lucky', 'Calm', 'Bold', 'Keen'];
    const nouns = ['Puzzle', 'Player', 'Solver', 'Thinker', 'Gamer', 'Mind', 'Star', 'Pro'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 9000) + 1000;
    return `${adj}${noun}${num}`;
}

// Get or create guest identity
function getGuestIdentity(): { guestId: string; guestUsername: string } {
    const stored = localStorage.getItem('puzzle_guest_identity');
    if (stored) {
        return JSON.parse(stored);
    }
    const identity = {
        guestId: crypto.randomUUID(),
        guestUsername: generateGuestUsername(),
    };
    localStorage.setItem('puzzle_guest_identity', JSON.stringify(identity));
    return identity;
}

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
    signInWithApple: () => Promise<{ error: Error | null }>;
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

    const guestIdentity = getGuestIdentity();

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

    // Sign in with Apple
    const signInWithApple = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'apple',
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
        guestId: guestIdentity.guestId,
        guestUsername: guestIdentity.guestUsername,

        isAuthenticated: !!user,
        isPremium: profile?.is_premium ?? false,
        displayName: profile?.display_name || profile?.username || guestIdentity.guestUsername,

        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithApple,
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
