/**
 * Leaderboard Page
 * 
 * Displays daily challenge scores with filtering by scope
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLeaderboard } from '../hooks/useSocial';
import './Leaderboard.css';

type Scope = 'global' | 'mutuals';

export const Leaderboard: React.FC = () => {
    const { isAuthenticated, displayName } = useAuth();
    const [scope, setScope] = useState<Scope>('global');
    const { entries, isLoading } = useLeaderboard(scope);

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="leaderboard-page">
            <header className="leaderboard-page__header">
                <Link to="/" className="leaderboard-page__back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="leaderboard-page__title">Leaderboard</h1>
            </header>

            <main className="leaderboard-page__main">
                {/* Scope tabs */}
                <div className="leaderboard-page__tabs">
                    <button
                        className={`leaderboard-page__tab ${scope === 'global' ? 'leaderboard-page__tab--active' : ''}`}
                        onClick={() => setScope('global')}
                    >
                        Global
                    </button>
                    <button
                        className={`leaderboard-page__tab ${scope === 'mutuals' ? 'leaderboard-page__tab--active' : ''}`}
                        onClick={() => setScope('mutuals')}
                        disabled={!isAuthenticated}
                    >
                        Friends
                    </button>
                </div>

                {/* Leaderboard content */}
                <div className="leaderboard">
                    {isLoading ? (
                        <div className="leaderboard__loading">Loading...</div>
                    ) : entries.length === 0 ? (
                        <div className="leaderboard__empty">
                            <p>No completions yet today.</p>
                            <p>Be the first to finish the Daily Challenge!</p>
                        </div>
                    ) : (
                        <div className="leaderboard__list">
                            {entries.map((entry) => (
                                <div
                                    key={entry.userId}
                                    className={`leaderboard__entry ${entry.displayName === displayName ? 'leaderboard__entry--you' : ''}`}
                                >
                                    <div className="leaderboard__rank">
                                        {entry.rank <= 3 ? (
                                            <span className={`leaderboard__medal leaderboard__medal--${entry.rank}`}>
                                                {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                                            </span>
                                        ) : (
                                            <span className="leaderboard__rank-num">{entry.rank}</span>
                                        )}
                                    </div>
                                    <div className="leaderboard__user">
                                        <span className="leaderboard__name">
                                            {entry.displayName}
                                            {entry.isMutual && <span className="leaderboard__mutual">👥</span>}
                                            {entry.displayName === displayName && <span className="leaderboard__you">(you)</span>}
                                        </span>
                                        <span className="leaderboard__username">@{entry.username}</span>
                                    </div>
                                    <div className="leaderboard__stats">
                                        <span className="leaderboard__score">{entry.score} pts</span>
                                        <span className="leaderboard__time">{formatTime(entry.timeSeconds)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
