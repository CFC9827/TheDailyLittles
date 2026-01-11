/**
 * LetterTile Component
 * 
 * Individual letter tile showing cipher letter and player's guess
 * - Single click: select the tile
 * - Double click: clear the guess
 * - Swipe/drag off: clear the guess
 */

import React, { useRef, useCallback } from 'react';
import './LetterTile.css';

interface LetterTileProps {
    cipherLetter: string;
    guessedLetter?: string;
    isSelected: boolean;
    isHighlighted: boolean;
    isCorrect: boolean;
    isIncorrect?: boolean;
    onClick: () => void;
    onClear: () => void;
}

export const LetterTile: React.FC<LetterTileProps> = ({
    cipherLetter,
    guessedLetter,
    isSelected,
    isHighlighted,
    isCorrect,
    isIncorrect = false,
    onClick,
    onClear,
}) => {
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const lastClickRef = useRef<number>(0);

    const classNames = [
        'letter-tile',
        isSelected && 'letter-tile--selected',
        isHighlighted && !isSelected && 'letter-tile--highlighted',
        guessedLetter && 'letter-tile--filled',
        isCorrect && 'letter-tile--correct',
        isIncorrect && 'letter-tile--incorrect',
    ].filter(Boolean).join(' ');

    const handleClick = useCallback(() => {
        const now = Date.now();
        const timeSinceLastClick = now - lastClickRef.current;

        // Double-click detection (within 300ms)
        if (timeSinceLastClick < 300 && guessedLetter) {
            onClear();
            lastClickRef.current = 0; // Reset to prevent triple-click issues
        } else {
            onClick();
            lastClickRef.current = now;
        }
    }, [onClick, onClear, guessedLetter]);

    // Swipe/drag detection for mobile
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (!touchStartRef.current || !guessedLetter) return;

        const touch = e.changedTouches[0];
        const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
        const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

        // If swiped more than 30px in any direction, clear the letter
        if (deltaX > 30 || deltaY > 30) {
            onClear();
        }

        touchStartRef.current = null;
    }, [guessedLetter, onClear]);

    return (
        <button
            className={classNames}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            type="button"
            aria-label={`Cipher letter ${cipherLetter}${guessedLetter ? `, guessed ${guessedLetter}` : ''}`}
        >
            <span className="letter-tile__cipher">{cipherLetter}</span>
            <span className="letter-tile__guess">{guessedLetter || ''}</span>
        </button>
    );
};
