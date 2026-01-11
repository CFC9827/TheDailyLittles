/**
 * Keyboard Component
 * 
 * On-screen QWERTY keyboard for letter input
 */

import React, { useEffect, useCallback } from 'react';
import './Keyboard.css';

interface KeyboardProps {
    usedLetters: Set<string>;
    onKeyPress: (letter: string) => void;
    onBackspace: () => void;
    disabled?: boolean;
}

const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export const Keyboard: React.FC<KeyboardProps> = ({
    usedLetters,
    onKeyPress,
    onBackspace,
    disabled = false,
}) => {
    // Handle physical keyboard input
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (disabled) return;

        const key = event.key.toUpperCase();

        if (key === 'BACKSPACE' || key === 'DELETE') {
            event.preventDefault();
            onBackspace();
            return;
        }

        if (/^[A-Z]$/.test(key)) {
            event.preventDefault();
            onKeyPress(key);
        }
    }, [disabled, onKeyPress, onBackspace]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="keyboard" role="group" aria-label="Keyboard">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard__row">
                    {rowIndex === 2 && (
                        <button
                            className="keyboard__key keyboard__key--wide keyboard__key--backspace"
                            onClick={onBackspace}
                            disabled={disabled}
                            type="button"
                            aria-label="Backspace"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                                <line x1="18" y1="9" x2="12" y2="15" />
                                <line x1="12" y1="9" x2="18" y2="15" />
                            </svg>
                        </button>
                    )}
                    {row.map((letter) => {
                        const isUsed = usedLetters.has(letter);

                        return (
                            <button
                                key={letter}
                                className={`keyboard__key ${isUsed ? 'keyboard__key--used' : ''}`}
                                onClick={() => onKeyPress(letter)}
                                disabled={disabled}
                                type="button"
                                aria-label={letter}
                            >
                                {letter}
                            </button>
                        );
                    })}
                    {rowIndex === 2 && (
                        <div className="keyboard__spacer keyboard__spacer--wide" />
                    )}
                </div>
            ))}
        </div>
    );
};
