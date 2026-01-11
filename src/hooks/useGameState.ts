/**
 * useGameState Hook
 * 
 * Central game state management for CIPHER
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { getDailyPuzzle, getDateString, type DailyPuzzle } from '../utils/dailySeed';
import { validateSolution, checkForConflict, getUniqueLetters } from '../utils/cipher';
import {
    saveGameProgress,
    loadGameProgress,
    updateStatisticsAfterGame,
    addToLeaderboard,
    loadStatistics,
    type GameProgress,
    type Statistics,
} from '../utils/storage';
import type { Difficulty } from '../data/phrases';
import { getLetterFrequency } from '../utils/cipher';
import { registerCompletion } from '../utils/dailyChallenge';

export interface GameState {
    puzzle: DailyPuzzle;
    guesses: Record<string, string>; // cipher letter -> guessed letter
    selectedCipherLetter: string | null;
    selectedTileIndex: number | null;
    isComplete: boolean;
    isStarted: boolean;
    startTime: number | null;
    elapsedTime: number;
    statistics: Statistics;
}

export interface GameActions {
    selectCipherLetter: (letter: string, tileIndex?: number) => void;
    assignLetter: (plainLetter: string) => void;
    clearLetter: (cipherLetter?: string) => void;
    resetPuzzle: () => void;
    changeDifficulty: (difficulty: Difficulty) => void;
    checkProgress: () => void;
}

export function useGameState(initialDifficulty: Difficulty = 'easy') {
    const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
    const [puzzle, setPuzzle] = useState<DailyPuzzle>(() => getDailyPuzzle(initialDifficulty));
    const [guesses, setGuesses] = useState<Record<string, string>>({});
    const [selectedCipherLetter, setSelectedCipherLetter] = useState<string | null>(null);
    const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [statistics, setStatistics] = useState<Statistics>(() => loadStatistics());
    const [incorrectGuesses, setIncorrectGuesses] = useState<Set<string>>(new Set());

    // Get unique cipher letters in the encoded phrase
    const uniqueCipherLetters = useMemo(() => {
        return getUniqueLetters(puzzle.encodedPhrase);
    }, [puzzle.encodedPhrase]);

    // Calculate letter frequency in the encoded phrase
    const cipherFrequencies = useMemo(() => {
        return getLetterFrequency(puzzle.encodedPhrase);
    }, [puzzle.encodedPhrase]);

    // Load saved progress on mount or difficulty change
    useEffect(() => {
        const today = getDateString();
        const savedProgress = loadGameProgress(today, difficulty);

        if (savedProgress) {
            setGuesses(savedProgress.guesses);
            setIsComplete(savedProgress.completed);
            setIsStarted(true);
            setElapsedTime(savedProgress.timeElapsed);
            if (savedProgress.completed) {
                setStartTime(null);
            } else {
                // Resume timer from where we left off
                setStartTime(Date.now() - savedProgress.timeElapsed);
            }
        } else {
            // New puzzle
            setGuesses({});
            setIsComplete(false);
            setIsStarted(false);
            setStartTime(null);
            setElapsedTime(0);
            setSelectedCipherLetter(null);
            setSelectedTileIndex(null);
        }
    }, [difficulty, puzzle]);

    // Timer effect
    useEffect(() => {
        if (!isStarted || isComplete) return;

        const interval = setInterval(() => {
            if (startTime) {
                setElapsedTime(Date.now() - startTime);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isStarted, isComplete, startTime]);

    // Save progress when guesses change
    useEffect(() => {
        if (!isStarted) return;

        const progress: GameProgress = {
            date: puzzle.date,
            difficulty,
            puzzleNumber: puzzle.puzzleNumber,
            guesses,
            startTime: startTime || Date.now(),
            completed: isComplete,
            timeElapsed: elapsedTime,
        };

        saveGameProgress(progress);
    }, [guesses, isComplete, elapsedTime, puzzle, difficulty, isStarted, startTime]);

    // Check for completion
    useEffect(() => {
        if (isComplete) return;

        const allFilled = uniqueCipherLetters.every(letter => guesses[letter]);
        if (!allFilled) return;

        const solved = validateSolution(puzzle.encodedPhrase, puzzle.originalPhrase, guesses);

        if (solved) {
            setIsComplete(true);
            const finalTime = Date.now() - (startTime || Date.now());
            setElapsedTime(finalTime);

            // Update statistics
            const updatedStats = updateStatisticsAfterGame(difficulty, finalTime, puzzle.date);
            setStatistics(updatedStats);

            // Add to leaderboard
            addToLeaderboard({
                date: puzzle.date,
                difficulty,
                time: finalTime,
                puzzleNumber: puzzle.puzzleNumber,
                streak: updatedStats.currentStreak,
            });

            // Register daily challenge completion
            // Score = 1000 - (seconds / 2), min 100
            const timeSeconds = Math.floor(finalTime / 1000);
            const normalizedScore = Math.max(100, 1000 - Math.floor(timeSeconds / 2));
            registerCompletion('cipher', normalizedScore, finalTime);
        }
    }, [guesses, puzzle, isComplete, startTime, difficulty, uniqueCipherLetters]);

    // Actions
    const selectCipherLetter = useCallback((letter: string, tileIndex?: number) => {
        if (isComplete) return;

        // Start the game on first interaction
        if (!isStarted) {
            setIsStarted(true);
            setStartTime(Date.now());
        }

        const upperLetter = letter.toUpperCase();
        setSelectedCipherLetter(upperLetter);

        if (tileIndex !== undefined) {
            setSelectedTileIndex(tileIndex);
        }
    }, [isComplete, isStarted]);

    const assignLetter = useCallback((plainLetter: string) => {
        if (isComplete || !selectedCipherLetter) return;

        const upperPlain = plainLetter.toUpperCase();
        const conflict = checkForConflict(guesses, selectedCipherLetter, upperPlain);

        // If there's a conflict, clear the conflicting assignment
        if (conflict) {
            setGuesses(prev => {
                const newGuesses = { ...prev };
                delete newGuesses[conflict];
                newGuesses[selectedCipherLetter] = upperPlain;
                return newGuesses;
            });
        } else {
            setGuesses(prev => ({
                ...prev,
                [selectedCipherLetter]: upperPlain,
            }));
        }

        // Auto-advance to the next tile to the right
        if (selectedTileIndex !== null) {
            const encoded = puzzle.encodedPhrase;
            let nextIndex = selectedTileIndex + 1;
            let found = false;

            // Search for the next letter tile to the right (skip spaces/punctuation)
            while (nextIndex < encoded.length) {
                const char = encoded[nextIndex];
                if (/[A-Z]/.test(char.toUpperCase())) {
                    setSelectedTileIndex(nextIndex);
                    setSelectedCipherLetter(char.toUpperCase());
                    found = true;
                    break;
                }
                nextIndex++;
            }

            if (!found) {
                // If we reached the end, we can either clear selection or stay on current
                // For now, let's clear it to signal the end of a "streak"
                setSelectedTileIndex(null);
                setSelectedCipherLetter(null);
            }
        } else {
            // Fallback for legacy selection logic (keyboard only assignment without selection)
            // Move to next unassigned letter
            const currentIndex = uniqueCipherLetters.indexOf(selectedCipherLetter);
            const nextLetter = uniqueCipherLetters.find((letter, index) =>
                index > currentIndex && !guesses[letter]
            ) || uniqueCipherLetters.find(letter =>
                !guesses[letter] && letter !== selectedCipherLetter
            );

            setSelectedCipherLetter(nextLetter || null);
        }

        // Clear incorrect state for the letter we just assigned
        if (incorrectGuesses.has(selectedCipherLetter)) {
            setIncorrectGuesses(prev => {
                const next = new Set(prev);
                next.delete(selectedCipherLetter);
                return next;
            });
        }
    }, [isComplete, selectedCipherLetter, selectedTileIndex, guesses, uniqueCipherLetters, incorrectGuesses, puzzle.encodedPhrase]);

    const clearLetter = useCallback((cipherLetter?: string) => {
        const letterToClear = cipherLetter?.toUpperCase() || selectedCipherLetter;
        if (!letterToClear) return;

        setGuesses(prev => {
            const newGuesses = { ...prev };
            delete newGuesses[letterToClear];
            return newGuesses;
        });

        // Clear incorrect state for this letter
        if (incorrectGuesses.has(letterToClear)) {
            setIncorrectGuesses(prev => {
                const next = new Set(prev);
                next.delete(letterToClear);
                return next;
            });
        }

        // Auto-reverse to previous tile (left) when backspacing from keyboard
        // Only do this if no specific letter was passed (meaning it was keyboard backspace)
        if (!cipherLetter && selectedTileIndex !== null) {
            const encoded = puzzle.encodedPhrase;
            let prevIndex = selectedTileIndex - 1;
            let found = false;

            // Search for the previous letter tile to the left (skip spaces/punctuation)
            while (prevIndex >= 0) {
                const char = encoded[prevIndex];
                if (/[A-Z]/.test(char.toUpperCase())) {
                    setSelectedTileIndex(prevIndex);
                    setSelectedCipherLetter(char.toUpperCase());
                    found = true;
                    break;
                }
                prevIndex--;
            }

            // If we're at the beginning, stay on current tile
            if (!found) {
                // Keep current selection
            }
        }
    }, [selectedCipherLetter, selectedTileIndex, incorrectGuesses, puzzle.encodedPhrase]);

    const resetPuzzle = useCallback(() => {
        setGuesses({});
        setSelectedCipherLetter(null);
        setSelectedTileIndex(null);
        setIsComplete(false);
        setIsStarted(false);
        setStartTime(null);
        setElapsedTime(0);
    }, []);

    const changeDifficulty = useCallback((newDifficulty: Difficulty) => {
        setDifficulty(newDifficulty);
        setPuzzle(getDailyPuzzle(newDifficulty));
        setSelectedCipherLetter(null);
        setSelectedTileIndex(null);
        setIncorrectGuesses(new Set());
    }, []);

    const checkProgress = useCallback(() => {
        const incorrect = new Set<string>();

        // Reverse mapping of original phrase to find correct letters
        const correctMapping: Record<string, string> = {};
        const originalUpper = puzzle.originalPhrase.toUpperCase();
        const encodedUpper = puzzle.encodedPhrase.toUpperCase();

        for (let i = 0; i < encodedUpper.length; i++) {
            const char = encodedUpper[i];
            if (/[A-Z]/.test(char)) {
                correctMapping[char] = originalUpper[i];
            }
        }

        Object.entries(guesses).forEach(([cipher, guess]) => {
            if (correctMapping[cipher] && correctMapping[cipher] !== guess) {
                incorrect.add(cipher);
            }
        });

        setIncorrectGuesses(incorrect);

        // Clear incorrect highlights after 3 seconds
        setTimeout(() => {
            setIncorrectGuesses(new Set());
        }, 3000);
    }, [guesses, puzzle]);

    // Get used plain letters (for keyboard highlighting)
    const usedPlainLetters = useMemo(() => {
        return new Set(Object.values(guesses));
    }, [guesses]);

    // Get reverse mapping (plain -> cipher) for conflict detection
    const reverseMappingDisplay = useMemo(() => {
        const reverse: Record<string, string> = {};
        Object.entries(guesses).forEach(([cipher, plain]) => {
            reverse[plain] = cipher;
        });
        return reverse;
    }, [guesses]);

    return {
        // State
        difficulty,
        puzzle,
        guesses,
        selectedCipherLetter,
        selectedTileIndex,
        isComplete,
        isStarted,
        elapsedTime,
        statistics,
        uniqueCipherLetters,
        usedPlainLetters,
        reverseMappingDisplay,
        cipherFrequencies,
        incorrectGuesses,

        // Actions
        selectCipherLetter,
        assignLetter,
        clearLetter,
        resetPuzzle,
        changeDifficulty,
        checkProgress,
    };
}
