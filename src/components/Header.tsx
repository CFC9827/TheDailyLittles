/**
 * Header Component
 * 
 * Game header with title and action buttons
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    showBack = false,
    onOpenAuth,
}) => {
    const { isAuthenticated, isGuest, displayName, guestUsername } = useAuth();

    return (
        <header className="header">
            <div className="header__left">
                {showBack ? (
                    <Link to="/" className="header__back" title="Back to Hub">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </Link>
                ) : (
                    <nav className="header__nav">
                        {/* Simplified nav - only Logo/Back and Title */}
                    </nav>
                )}
            </div>

            <div className="header__center">
                <Link to="/" className="header__logo-link">
                    <h1 className="header__title">{title}</h1>
                </Link>
            </div>

            <div className="header__right">
                <div className="header__actions">
                    {isAuthenticated && !isGuest ? (
                        <Link to="/profile" className="header__profile" title="Your Profile">
                            <div className="header__avatar">
                                {(displayName || guestUsername).charAt(0).toUpperCase()}
                            </div>
                        </Link>
                    ) : (
                        <button className="header__auth-btn" onClick={onOpenAuth}>
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
