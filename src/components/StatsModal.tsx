/**
 * StatsModal Component
 * 
 * Statistics modal showing player progress across difficulties
 */

import React from 'react';
import { Modal } from './Modal';
import type { Statistics } from '../utils/storage';
import './StatsModal.css';

interface StatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    statistics: Statistics;
}

export const StatsModal: React.FC<StatsModalProps> = ({
    isOpen,
    onClose,
    statistics,
}) => {
    const formatTime = (ms: number | null): string => {
        if (ms === null) return '—';
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const totalGamesPlayed =
        statistics.easy.gamesPlayed +
        statistics.medium.gamesPlayed +
        statistics.hard.gamesPlayed;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Statistics">
            <div className="stats-modal">
                <div className="stats-modal__overview">
                    <div className="stats-modal__overview-item">
                        <span className="stats-modal__overview-value">{totalGamesPlayed}</span>
                        <span className="stats-modal__overview-label">Played</span>
                    </div>
                    <div className="stats-modal__overview-item">
                        <span className="stats-modal__overview-value">{statistics.currentStreak}</span>
                        <span className="stats-modal__overview-label">Current Streak</span>
                    </div>
                    <div className="stats-modal__overview-item">
                        <span className="stats-modal__overview-value">{statistics.maxStreak}</span>
                        <span className="stats-modal__overview-label">Max Streak</span>
                    </div>
                    <div className="stats-modal__overview-item">
                        <span className="stats-modal__overview-value stats-modal__overview-value--stars">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            {statistics.totalStars}
                        </span>
                        <span className="stats-modal__overview-label">Total Stars</span>
                    </div>
                </div>

                <div className="stats-modal__divider" />

                <div className="stats-modal__breakdown">
                    <h3 className="stats-modal__breakdown-title">By Difficulty</h3>

                    {(['easy', 'medium', 'hard'] as const).map((difficulty) => {
                        const diffStats = statistics[difficulty];
                        const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

                        return (
                            <div key={difficulty} className="stats-modal__difficulty">
                                <div className="stats-modal__difficulty-header">
                                    <span className="stats-modal__difficulty-label">{label}</span>
                                    <span className="stats-modal__difficulty-count">
                                        {diffStats.gamesPlayed} played
                                    </span>
                                </div>
                                <div className="stats-modal__difficulty-times">
                                    <div className="stats-modal__time-item">
                                        <span className="stats-modal__time-label">Best</span>
                                        <span className="stats-modal__time-value">{formatTime(diffStats.bestTime)}</span>
                                    </div>
                                    <div className="stats-modal__time-item">
                                        <span className="stats-modal__time-label">Average</span>
                                        <span className="stats-modal__time-value">{formatTime(diffStats.averageTime)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
};
