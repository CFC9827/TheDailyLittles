/**
 * Header Component
 * 
 * Game header with title and action buttons
 */

import React, { useState } from 'react';
import './Header.css';

interface HeaderProps {
    onOpenStats: () => void;
    onOpenLeaderboard: () => void;
    onOpenSettings: () => void;
    onOpenRules: () => void;
    streak: number;
}

export const Header: React.FC<HeaderProps> = ({
    onOpenStats,
    onOpenLeaderboard,
    onOpenSettings,
    onOpenRules,
    streak,
}) => {
    const [showStreakTooltip, setShowStreakTooltip] = useState(false);

    return (
        <header className="header">
            <div className="header__left">
                <button
                    className="header__button"
                    onClick={onOpenLeaderboard}
                    aria-label="Leaderboard"
                    type="button"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                    </svg>
                </button>
            </div>

            <div className="header__center">
                <h1 className="header__title">
                    <span className="header__title-text">CIPHER</span>
                </h1>
            </div>

            <div className="header__right">
                {streak > 0 && (
                    <div
                        className="header__streak-container"
                        onMouseEnter={() => setShowStreakTooltip(true)}
                        onMouseLeave={() => setShowStreakTooltip(false)}
                    >
                        <div className="header__streak">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            <span>{streak}</span>
                        </div>
                        {showStreakTooltip && (
                            <div className="header__streak-tooltip">
                                <span className="header__streak-tooltip-icon">🔥</span>
                                <span className="header__streak-tooltip-text">
                                    {streak} {streak === 1 ? 'Day' : 'Days'} Streak
                                </span>
                            </div>
                        )}
                    </div>
                )}
                <button
                    className="header__button"
                    onClick={onOpenStats}
                    aria-label="Statistics"
                    type="button"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                </button>
                <button
                    className="header__button"
                    onClick={onOpenRules}
                    aria-label="How to Play"
                    type="button"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
                    </svg>
                </button>
                <button
                    className="header__button"
                    onClick={onOpenSettings}
                    aria-label="Settings"
                    type="button"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                </button>
            </div>
        </header>
    );
};
