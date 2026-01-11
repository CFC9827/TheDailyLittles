/**
 * PhraseDisplay Component
 * 
 * Displays the encoded phrase as letter tiles grouped by words
 */

import React from 'react';
import { LetterTile } from './LetterTile';
import './PhraseDisplay.css';

interface PhraseDisplayProps {
    encodedPhrase: string;
    guesses: Record<string, string>;
    selectedCipherLetter: string | null;
    selectedTileIndex: number | null;
    isComplete: boolean;
    onSelectLetter: (letter: string, tileIndex: number) => void;
    onClearLetter: (letter: string) => void;
}

export const PhraseDisplay: React.FC<PhraseDisplayProps> = ({
    encodedPhrase,
    guesses,
    selectedCipherLetter,
    selectedTileIndex,
    isComplete,
    onSelectLetter,
    onClearLetter,
}) => {
    const isLetter = (char: string) => /[A-Z]/.test(char);

    // Calculate absolute indices correctly by keeping track of position in encodedPhrase
    let absoluteIndex = 0;

    return (
        <div className="phrase-display">
            <div className="phrase-display__words">
                {encodedPhrase.split(' ').map((word, wordIndex, wordsArray) => {
                    const wordElement = (
                        <div key={wordIndex} className="phrase-display__word">
                            {word.split('').map((char, charIndex) => {
                                const currentIndex = absoluteIndex++;
                                if (!isLetter(char)) {
                                    return (
                                        <span key={charIndex} className="phrase-display__punctuation">
                                            {char}
                                        </span>
                                    );
                                }

                                return (
                                    <LetterTile
                                        key={charIndex}
                                        cipherLetter={char}
                                        guessedLetter={guesses[char]}
                                        isSelected={selectedTileIndex === currentIndex}
                                        isHighlighted={selectedCipherLetter !== null && char === selectedCipherLetter}
                                        isCorrect={isComplete}
                                        onClick={() => onSelectLetter(char, currentIndex)}
                                        onClear={() => onClearLetter(char)}
                                    />
                                );
                            })}
                        </div>
                    );

                    // Increment for the space after the word, unless it's the last word
                    if (wordIndex < wordsArray.length - 1) {
                        absoluteIndex++;
                    }

                    return wordElement;
                })}
            </div>
        </div>
    );
};
