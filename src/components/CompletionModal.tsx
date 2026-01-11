/**
 * CompletionModal Component
 * 
 * Victory modal showing solve time, streak, and share option
 */

import React from 'react';
import { Modal } from './Modal';
import { calculateStarsEarned } from '../utils/storage';
import type { Difficulty } from '../data/phrases';
import './CompletionModal.css';

interface CompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    difficulty: Difficulty;
    timeElapsed: number;
    streak: number;
    puzzleNumber: number;
    phrase: string;
    onShare: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
    isOpen,
    onClose,
    difficulty,
    timeElapsed,
    streak,
    puzzleNumber,
    phrase,
    onShare,
}) => {
    const formatTime = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const stars = calculateStarsEarned(difficulty, timeElapsed);
    const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="small">
            <div className="completion-modal">
                <div className="completion-modal__celebration">
                    <div className="completion-modal__stars">
                        {[1, 2, 3].map((star) => (
                            <svg
                                key={star}
                                className={`completion-modal__star ${star <= stars ? 'completion-modal__star--filled' : ''}`}
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill={star <= stars ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        ))}
                    </div>
                    <h2 className="completion-modal__title">Solved!</h2>
                </div>

                <div className="completion-modal__phrase">
                    <p className="completion-modal__phrase-text">"{phrase}"</p>
                </div>

                <div className="completion-modal__stats">
                    <div className="completion-modal__stat">
                        <span className="completion-modal__stat-value">{formatTime(timeElapsed)}</span>
                        <span className="completion-modal__stat-label">Time</span>
                    </div>
                    <div className="completion-modal__stat">
                        <span className="completion-modal__stat-value">{difficultyLabel}</span>
                        <span className="completion-modal__stat-label">Difficulty</span>
                    </div>
                    <div className="completion-modal__stat">
                        <span className="completion-modal__stat-value">{streak}</span>
                        <span className="completion-modal__stat-label">Streak</span>
                    </div>
                </div>

                <div className="completion-modal__actions">
                    <button
                        className="completion-modal__share-btn"
                        onClick={onShare}
                        type="button"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                        Share Result
                    </button>
                    <button
                        className="completion-modal__close-btn"
                        onClick={onClose}
                        type="button"
                    >
                        Continue
                    </button>
                </div>

                <p className="completion-modal__puzzle-info">
                    Little #{puzzleNumber}
                </p>
            </div>
        </Modal>
    );
};
