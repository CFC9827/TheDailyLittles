/**
 * Daily Challenge Component
 * 
 * Shows current progress for the daily 3 games
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    getEffectiveDate,
    getDailyGames,
    loadChallengeState,
    loadGlobalStats,
} from '../utils/dailyChallenge';
import type { DailyChallengeState, GlobalStats, Game } from '../utils/dailyChallenge';

export const DailyChallenge: React.FC = () => {
    const [date, setDate] = useState(getEffectiveDate());
    const [state, setState] = useState<DailyChallengeState | null>(null);
    const [stats, setStats] = useState<GlobalStats | null>(null);

    useEffect(() => {
        const d = getEffectiveDate();
        setDate(d);
        setState(loadChallengeState(d));
        setStats(loadGlobalStats());
    }, []);

    if (!state || !stats) return null;

    const dailyGames = getDailyGames(date);

    return (
        <section className={`daily-challenge ${state.isFullyCompleted ? 'daily-challenge--completed' : ''}`}>
            <div className="daily-challenge__header">
                <div className="daily-challenge__info">
                    <h2>The Daily Challenge</h2>
                    <span className="daily-challenge__date">
                        {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
                <div className="daily-challenge__stats">
                    {stats.currentStreak > 0 && (
                        <div className="stat-badge stat-badge--streak" title="Daily Streak">
                            🔥 {stats.currentStreak}
                        </div>
                    )}
                    <div className="stat-badge stat-badge--stars" title="Total Stars">
                        ⭐ {stats.totalStars}
                    </div>
                </div>
            </div>

            <div className="daily-challenge__games">
                {dailyGames.map((game: Game) => {
                    const completion = state.completions[game.id];
                    const isCompleted = completion?.completed;

                    return (
                        <Link
                            key={game.id}
                            to={game.path}
                            className={`daily-game-btn ${isCompleted ? 'daily-game-btn--completed' : ''}`}
                            style={{ '--game-color': game.id === 'cipher' ? '#538d4e' : game.id === 'gridgram' ? '#6366f1' : '#10b981' } as React.CSSProperties}
                        >
                            <div className="daily-game-btn__status">
                                {isCompleted ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    <span style={{ fontSize: '10px' }}>?</span>
                                )}
                            </div>
                            <span className="daily-game-btn__name">{game.name}</span>
                        </Link>
                    );
                })}
            </div>

            {state.isFullyCompleted && (
                <div className="daily-challenge__footer">
                    <button className="share-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
                        </svg>
                        Share Your Challenge
                    </button>
                </div>
            )}
        </section>
    );
};
