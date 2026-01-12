/**
 * Profile Page
 * 
 * User profile with stats, settings, and account management
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFollows } from '../hooks/useSocial';
import { useGameStats, formatTime } from '../hooks/useGameStats';
import { AuthModal } from '../components/AuthModal';
import { NotificationSettings } from '../components/NotificationSettings';
import './Profile.css';

export const Profile: React.FC = () => {
    const {
        isAuthenticated,
        isGuest,
        displayName,
        profile,
        guestUsername,
        signOut
    } = useAuth();
    const { stats } = useFollows();
    const gameStats = useGameStats();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <div className="profile-page">
            <header className="profile-page__header">
                <Link to="/" className="profile-page__back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="profile-page__title">Profile</h1>
            </header>

            <main className="profile-page__main">
                {/* User card */}
                <div className="profile-page__card">
                    <div className="profile-page__avatar">
                        {(displayName || guestUsername).charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-page__info">
                        <h2 className="profile-page__name">
                            {displayName || guestUsername}
                        </h2>
                        {profile?.username && (
                            <span className="profile-page__username">@{profile.username}</span>
                        )}
                        {isGuest && (
                            <span className="profile-page__guest">Guest Account</span>
                        )}
                    </div>
                </div>

                {/* Friends stat */}
                {isAuthenticated && (
                    <div className="profile-page__stats">
                        <div className="profile-page__stat profile-page__stat--mutuals">
                            <span className="profile-page__stat-value">{stats.mutualsCount}</span>
                            <span className="profile-page__stat-label">Friends</span>
                        </div>
                    </div>
                )}

                {/* Game Stats */}
                <div className="profile-page__game-stats">
                    <h3 className="profile-page__section-title">Your Stats</h3>
                    <div className="profile-page__game-stats-overview">
                        <div className="profile-page__game-stat-item">
                            <span className="profile-page__game-stat-value">{gameStats.totalGamesPlayed}</span>
                            <span className="profile-page__game-stat-label">Games Played</span>
                        </div>
                        <div className="profile-page__game-stat-item">
                            <span className="profile-page__game-stat-value">{gameStats.currentStreak}</span>
                            <span className="profile-page__game-stat-label">Day Streak</span>
                        </div>
                        <div className="profile-page__game-stat-item">
                            <span className="profile-page__game-stat-value">{gameStats.maxStreak}</span>
                            <span className="profile-page__game-stat-label">Best Streak</span>
                        </div>
                    </div>
                    <div className="profile-page__game-breakdown">
                        {gameStats.perGame.map((game) => (
                            <div key={game.name} className="profile-page__game-row" style={{ '--game-color': game.color } as React.CSSProperties}>
                                <span className="profile-page__game-name">{game.name}</span>
                                <span className="profile-page__game-played">{game.played} plays</span>
                                {game.bestTime !== undefined && game.bestTime !== null && (
                                    <span className="profile-page__game-best">{formatTime(game.bestTime)}</span>
                                )}
                                {game.bestMoves !== undefined && game.bestMoves !== null && (
                                    <span className="profile-page__game-best">{game.bestMoves} moves</span>
                                )}
                                {game.bestScore !== undefined && game.bestScore !== null && (
                                    <span className="profile-page__game-best">{game.bestScore} pts</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="profile-page__actions">
                    {!isAuthenticated && (
                        <button
                            className="profile-page__action profile-page__action--primary"
                            onClick={() => setShowAuthModal(true)}
                        >
                            Create Account
                        </button>
                    )}

                    <Link to="/leaderboard" className="profile-page__action">
                        View Leaderboard
                    </Link>

                    <Link to="/groups" className="profile-page__action">
                        My Groups
                    </Link>

                    {isAuthenticated && (
                        <button
                            className="profile-page__action"
                            onClick={() => setShowNotifications(true)}
                        >
                            Notification Settings
                        </button>
                    )}

                    {isAuthenticated && (
                        <button
                            className="profile-page__action profile-page__action--signout"
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </button>
                    )}
                </div>
            </main>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />



            <NotificationSettings
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
            />
        </div>
    );
};
