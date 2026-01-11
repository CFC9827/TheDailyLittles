/**
 * DifficultySelector Component
 * 
 * Clean tabs for selecting difficulty level
 */

import React from 'react';
import type { Difficulty } from '../data/phrases';
import './DifficultySelector.css';

interface DifficultySelectorProps {
    currentDifficulty: Difficulty;
    onSelectDifficulty: (difficulty: Difficulty) => void;
    completedToday: Record<Difficulty, boolean>;
}

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
    currentDifficulty,
    onSelectDifficulty,
    completedToday,
}) => {
    return (
        <div className="difficulty-selector" role="tablist">
            {DIFFICULTIES.map(({ value, label }) => {
                const isActive = currentDifficulty === value;
                const isCompleted = completedToday[value];

                return (
                    <button
                        key={value}
                        className={`difficulty-selector__tab ${isActive ? 'difficulty-selector__tab--active' : ''} ${isCompleted ? 'difficulty-selector__tab--completed' : ''}`}
                        onClick={() => onSelectDifficulty(value)}
                        role="tab"
                        aria-selected={isActive}
                        type="button"
                    >
                        <span className="difficulty-selector__label">{label}</span>
                        {isCompleted && (
                            <svg className="difficulty-selector__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        )}
                    </button>
                );
            })}
        </div>
    );
};
