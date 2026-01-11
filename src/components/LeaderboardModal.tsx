/**
 * LeaderboardModal Component
 * 
 * Daily leaderboard display
 */

import React from 'react';
import { Modal } from './Modal';
import type { LeaderboardEntry } from '../utils/storage';
import type { Difficulty } from '../data/phrases';
import './LeaderboardModal.css';

interface LeaderboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    entries: LeaderboardEntry[];
    currentDifficulty: Difficulty;
    onChangeDifficulty: (difficulty: Difficulty) => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
    isOpen,
    onClose,
    entries,
    currentDifficulty,
    onChangeDifficulty,
}) => {
    const formatTime = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Leaderboard">
            <div className="leaderboard-modal">
                <div className="leaderboard-modal__tabs">
                    {difficulties.map((diff) => (
                        <button
                            key={diff}
                            className={`leaderboard-modal__tab ${currentDifficulty === diff ? 'leaderboard-modal__tab--active' : ''}`}
                            onClick={() => onChangeDifficulty(diff)}
                            type="button"
                        >
                            {diff.charAt(0).toUpperCase() + diff.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="leaderboard-modal__list">
                    {entries.length === 0 ? (
                        <div className="leaderboard-modal__empty">
                            <p>No entries yet today.</p>
                            <p className="leaderboard-modal__empty-hint">Complete a puzzle to see your ranking!</p>
                        </div>
                    ) : (
                        entries.slice(0, 10).map((entry, index) => (
                            <div key={index} className="leaderboard-modal__entry">
                                <div className="leaderboard-modal__rank">
                                    {index === 0 && <span className="leaderboard-modal__medal">🥇</span>}
                                    {index === 1 && <span className="leaderboard-modal__medal">🥈</span>}
                                    {index === 2 && <span className="leaderboard-modal__medal">🥉</span>}
                                    {index > 2 && <span>{index + 1}</span>}
                                </div>
                                <div className="leaderboard-modal__details">
                                    <span className="leaderboard-modal__time">{formatTime(entry.time)}</span>
                                    {entry.streak > 1 && (
                                        <span className="leaderboard-modal__streak" title={`${entry.streak} day streak`}>
                                            🔥 {entry.streak}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <p className="leaderboard-modal__info">
                    Today's leaderboard • Little #{entries[0]?.puzzleNumber || '—'}
                </p>
            </div>
        </Modal>
    );
};
