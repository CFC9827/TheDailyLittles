/**
 * Profile Page
 * 
 * User profile with stats, settings, and account management
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFollows } from '../hooks/useSocial';
import { AuthModal } from '../components/AuthModal';
import { PaywallModal } from '../components/PaywallModal';
import './Profile.css';

export const Profile: React.FC = () => {
    const {
        isAuthenticated,
        isGuest,
        isPremium,
        displayName,
        profile,
        guestUsername,
        signOut
    } = useAuth();
    const { stats } = useFollows();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);

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
                            {isPremium && <span className="profile-page__premium">Premium</span>}
                        </h2>
                        {profile?.username && (
                            <span className="profile-page__username">@{profile.username}</span>
                        )}
                        {isGuest && (
                            <span className="profile-page__guest">Guest Account</span>
                        )}
                    </div>
                </div>

                {/* Stats */}
                {isAuthenticated && (
                    <div className="profile-page__stats">
                        <div className="profile-page__stat">
                            <span className="profile-page__stat-value">{stats.followersCount}</span>
                            <span className="profile-page__stat-label">Followers</span>
                        </div>
                        <div className="profile-page__stat">
                            <span className="profile-page__stat-value">{stats.followingCount}</span>
                            <span className="profile-page__stat-label">Following</span>
                        </div>
                        <div className="profile-page__stat">
                            <span className="profile-page__stat-value">{stats.mutualsCount}</span>
                            <span className="profile-page__stat-label">Mutuals</span>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="profile-page__actions">
                    {!isAuthenticated ? (
                        <button
                            className="profile-page__action profile-page__action--primary"
                            onClick={() => setShowAuthModal(true)}
                        >
                            Create Account
                        </button>
                    ) : !isPremium ? (
                        <button
                            className="profile-page__action profile-page__action--premium"
                            onClick={() => setShowPaywall(true)}
                        >
                            Get Premium
                        </button>
                    ) : null}

                    <Link to="/leaderboard" className="profile-page__action">
                        View Leaderboard
                    </Link>

                    <Link to="/groups" className="profile-page__action">
                        My Groups
                    </Link>

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

            <PaywallModal
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
            />
        </div>
    );
};
