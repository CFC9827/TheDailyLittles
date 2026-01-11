/**
 * Auth Modal
 * 
 * Sign-in/sign-up modal with multiple auth providers.
 * Supports soft prompt (dismissable) and hard gate (required) modes.
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

type AuthMode = 'signin' | 'signup' | 'magic';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: 'soft' | 'hard'; // soft = dismissable, hard = required
    title?: string;
    subtitle?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
    isOpen,
    onClose,
    mode = 'soft',
    title = 'Join The Daily Littles',
    subtitle = 'Track your streaks, compete with friends, and unlock all puzzles.',
}) => {
    const {
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithApple,
        signInWithMagicLink
    } = useAuth();

    const [authMode, setAuthMode] = useState<AuthMode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [magicLinkSent, setMagicLinkSent] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (authMode === 'magic') {
                const { error } = await signInWithMagicLink(email);
                if (error) throw error;
                setMagicLinkSent(true);
            } else if (authMode === 'signup') {
                if (!username.trim()) {
                    throw new Error('Username is required');
                }
                const { error } = await signUpWithEmail(email, password, username);
                if (error) throw error;
                onClose();
            } else {
                const { error } = await signInWithEmail(email, password);
                if (error) throw error;
                onClose();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError(null);
        const { error } = await signInWithGoogle();
        if (error) setError(error.message);
    };

    const handleApple = async () => {
        setError(null);
        const { error } = await signInWithApple();
        if (error) setError(error.message);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (mode === 'soft' && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="auth-modal__overlay" onClick={handleBackdropClick}>
            <div className="auth-modal">
                {mode === 'soft' && (
                    <button className="auth-modal__close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                )}

                <div className="auth-modal__header">
                    <h2 className="auth-modal__title">{title}</h2>
                    <p className="auth-modal__subtitle">{subtitle}</p>
                </div>

                {magicLinkSent ? (
                    <div className="auth-modal__success">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <h3>Check your email!</h3>
                        <p>We sent a magic link to <strong>{email}</strong></p>
                        <button
                            className="auth-modal__btn auth-modal__btn--secondary"
                            onClick={() => setMagicLinkSent(false)}
                        >
                            Use different email
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Social login buttons */}
                        <div className="auth-modal__social">
                            <button
                                className="auth-modal__social-btn auth-modal__social-btn--google"
                                onClick={handleGoogle}
                                disabled={isLoading}
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </button>

                            <button
                                className="auth-modal__social-btn auth-modal__social-btn--apple"
                                onClick={handleApple}
                                disabled={isLoading}
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                Continue with Apple
                            </button>
                        </div>

                        <div className="auth-modal__divider">
                            <span>or</span>
                        </div>

                        {/* Email form */}
                        <form className="auth-modal__form" onSubmit={handleSubmit}>
                            {error && (
                                <div className="auth-modal__error">{error}</div>
                            )}

                            <div className="auth-modal__field">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            {authMode !== 'magic' && (
                                <div className="auth-modal__field">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            )}

                            {authMode === 'signup' && (
                                <div className="auth-modal__field">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="puzzlemaster"
                                        required
                                        minLength={3}
                                        maxLength={20}
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                className="auth-modal__btn auth-modal__btn--primary"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : (
                                    authMode === 'signin' ? 'Sign In' :
                                        authMode === 'signup' ? 'Create Account' :
                                            'Send Magic Link'
                                )}
                            </button>
                        </form>

                        {/* Mode switcher */}
                        <div className="auth-modal__footer">
                            {authMode === 'signin' ? (
                                <>
                                    <button
                                        className="auth-modal__link"
                                        onClick={() => setAuthMode('magic')}
                                    >
                                        Sign in with magic link
                                    </button>
                                    <span className="auth-modal__separator">•</span>
                                    <button
                                        className="auth-modal__link"
                                        onClick={() => setAuthMode('signup')}
                                    >
                                        Create account
                                    </button>
                                </>
                            ) : authMode === 'signup' ? (
                                <button
                                    className="auth-modal__link"
                                    onClick={() => setAuthMode('signin')}
                                >
                                    Already have an account? Sign in
                                </button>
                            ) : (
                                <button
                                    className="auth-modal__link"
                                    onClick={() => setAuthMode('signin')}
                                >
                                    Sign in with password
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
