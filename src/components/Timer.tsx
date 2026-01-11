/**
 * Timer Component
 * 
 * Elegant timer display with MM:SS format
 */

import React from 'react';
import './Timer.css';

interface TimerProps {
    elapsedTime: number; // in milliseconds
    isRunning: boolean;
    isComplete: boolean;
}

export const Timer: React.FC<TimerProps> = ({ elapsedTime, isRunning, isComplete }) => {
    const formatTime = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const classNames = [
        'timer',
        isRunning && 'timer--running',
        isComplete && 'timer--complete',
    ].filter(Boolean).join(' ');

    return (
        <div className={classNames}>
            <svg className="timer__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="timer__time">{formatTime(elapsedTime)}</span>
        </div>
    );
};
