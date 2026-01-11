/**
 * Game Gate Component
 * 
 * Controls access to games based on authentication status.
 * - Game 1 of Daily Challenge: Free for all
 * - Games 2-3: Require account
 * - Premium games: Require subscription
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import './GameGate.css';

export type GateType = 'none' | 'account' | 'premium';

interface GameGateProps {
    gateType: GateType;
    gameNumber?: number; // 1, 2, or 3 for Daily Challenge
    children: React.ReactNode;
}

export const GameGate: React.FC<GameGateProps> = ({
    gateType,
    gameNumber,
    children
}) => {
    const { isAuthenticated, isPremium } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    // No gate required
    if (gateType === 'none') {
        return <>{children}</>;
    }

    // Account gate
    if (gateType === 'account' && !isAuthenticated) {
        return (
            <>
                <div className="game-gate">
                    <div className="game-gate__content">
                        <div className="game-gate__icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <h2 className="game-gate__title">
                            {gameNumber
                                ? `Game ${gameNumber} of Today's Challenge`
                                : 'Account Required'
                            }
                        </h2>
                        <p className="game-gate__message">
                            Create a free account to continue the Daily Challenge,
                            track your streaks, and compete with friends.
                        </p>
                        <button
                            className="game-gate__btn"
                            onClick={() => setShowAuthModal(true)}
                        >
                            Create Free Account
                        </button>
                        <p className="game-gate__subtext">
                            Already have an account? <button onClick={() => setShowAuthModal(true)}>Sign in</button>
                        </p>
                    </div>
                </div>

                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                    mode="hard"
                    title={gameNumber ? `Continue Today's Challenge` : 'Create Account'}
                    subtitle="Free accounts unlock the full Daily Challenge and streak tracking."
                />
            </>
        );
    }

    // Premium gate
    if (gateType === 'premium' && !isPremium) {
        return (
            <div className="game-gate">
                <div className="game-gate__content game-gate__content--premium">
                    <div className="game-gate__badge">Premium</div>
                    <h2 className="game-gate__title">Unlock Full Library</h2>
                    <p className="game-gate__message">
                        Get Premium to access all puzzles, past challenges,
                        and expanded features.
                    </p>
                    <button className="game-gate__btn game-gate__btn--premium">
                        Get Premium
                    </button>
                    <p className="game-gate__price">
                        $4.99/month or $39.99/year
                    </p>
                </div>
            </div>
        );
    }

    // User has access
    return <>{children}</>;
};

/**
 * Soft Prompt Component
 * 
 * Shown after completing Game 1 to encourage sign-up
 */
interface SoftPromptProps {
    onDismiss: () => void;
    onSignUp: () => void;
}

export const SoftPrompt: React.FC<SoftPromptProps> = ({ onDismiss, onSignUp }) => {
    return (
        <div className="soft-prompt">
            <div className="soft-prompt__content">
                <button className="soft-prompt__close" onClick={onDismiss}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
                <h3 className="soft-prompt__title">Nice work! 🎉</h3>
                <p className="soft-prompt__message">
                    Create a free account to save your progress, track streaks,
                    and continue today's challenge.
                </p>
                <div className="soft-prompt__actions">
                    <button className="soft-prompt__btn soft-prompt__btn--primary" onClick={onSignUp}>
                        Create Free Account
                    </button>
                    <button className="soft-prompt__btn soft-prompt__btn--secondary" onClick={onDismiss}>
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
};
