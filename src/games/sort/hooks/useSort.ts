/**
 * SORT Game State Management
 * 
 * Handles selection, submission, and game completion logic
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
    getDailyPuzzle,
    getShuffledWords,
    checkGuess,
    getPuzzleNumber,
    type SortPuzzle,
    type SortGroup
} from '../data/puzzles';
import { loadProgress, saveProgress, updateStats } from '../utils/storage';

export interface SolvedGroup extends SortGroup {
    solvedOrder: number;
}

export interface SortGameState {
    puzzle: SortPuzzle;
    puzzleNumber: number;
    words: string[];
    selectedWords: string[];
    solvedGroups: SolvedGroup[];
    mistakes: number;
    maxMistakes: number;
    isComplete: boolean;
    isStarted: boolean;
    elapsedTime: number;
    lastGuessCorrect: boolean | null;
    shakeWords: boolean;
}

export function useSort() {
    const [puzzle] = useState<SortPuzzle>(() => getDailyPuzzle());
    const puzzleNumber = useMemo(() => getPuzzleNumber(), []);

    const [words, setWords] = useState<string[]>(() => {
        const seed = puzzleNumber * 31337;
        return getShuffledWords(puzzle, seed);
    });

    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [solvedGroups, setSolvedGroups] = useState<SolvedGroup[]>([]);
    const [mistakes, setMistakes] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [lastGuessCorrect, setLastGuessCorrect] = useState<boolean | null>(null);
    const [shakeWords, setShakeWords] = useState(false);

    const timerRef = useRef<number | null>(null);
    const maxMistakes = 4;

    // Load saved progress
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const saved = loadProgress(today);

        if (saved) {
            setSolvedGroups(saved.solvedGroups);
            setMistakes(saved.mistakes);
            setElapsedTime(saved.elapsedTime);
            setIsComplete(saved.isComplete);
            if (saved.solvedGroups.length > 0 || saved.mistakes > 0) {
                setIsStarted(true);
            }

            // Remove solved words from grid
            const solvedWords = new Set(saved.solvedGroups.flatMap(g => g.words));
            setWords(prev => prev.filter(w => !solvedWords.has(w)));
        }
    }, []);

    // Timer
    useEffect(() => {
        if (isStarted && !isComplete) {
            timerRef.current = window.setInterval(() => {
                setElapsedTime(t => t + 1);
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isStarted, isComplete]);

    // Save progress
    useEffect(() => {
        if (isStarted) {
            const today = new Date().toISOString().split('T')[0];
            saveProgress({
                date: today,
                solvedGroups,
                mistakes,
                elapsedTime,
                isComplete,
            });
        }
    }, [solvedGroups, mistakes, elapsedTime, isComplete, isStarted]);

    // Check for completion
    useEffect(() => {
        if (solvedGroups.length === 4 && !isComplete) {
            setIsComplete(true);
            if (timerRef.current) clearInterval(timerRef.current);
            updateStats(mistakes, elapsedTime);
        }
    }, [solvedGroups, isComplete, mistakes, elapsedTime]);

    // Select/deselect a word
    const toggleWord = useCallback((word: string) => {
        if (!isStarted) setIsStarted(true);

        setSelectedWords(prev => {
            if (prev.includes(word)) {
                return prev.filter(w => w !== word);
            }
            if (prev.length >= 4) {
                return prev; // Max 4 selected
            }
            return [...prev, word];
        });

        // Clear feedback state
        setLastGuessCorrect(null);
    }, [isStarted]);

    // Clear all selections
    const clearSelection = useCallback(() => {
        setSelectedWords([]);
        setLastGuessCorrect(null);
    }, []);

    // Submit guess
    const submitGuess = useCallback(() => {
        if (selectedWords.length !== 4) return;

        const matchedGroup = checkGuess(puzzle, selectedWords);

        if (matchedGroup) {
            // Correct!
            setLastGuessCorrect(true);

            const solvedGroup: SolvedGroup = {
                ...matchedGroup,
                solvedOrder: solvedGroups.length + 1,
            };

            setSolvedGroups(prev => [...prev, solvedGroup]);

            // Remove solved words from grid
            setWords(prev => prev.filter(w => !selectedWords.includes(w)));
            setSelectedWords([]);
        } else {
            // Incorrect
            setLastGuessCorrect(false);
            setMistakes(prev => prev + 1);
            setShakeWords(true);

            setTimeout(() => {
                setShakeWords(false);
            }, 500);
        }
    }, [selectedWords, puzzle, solvedGroups.length]);

    // Shuffle remaining words
    const shuffleWords = useCallback(() => {
        setWords(prev => {
            const shuffled = [...prev];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        });
    }, []);

    // Check if game is lost
    const isLost = mistakes >= maxMistakes && !isComplete;

    // Reveal remaining groups when lost
    useEffect(() => {
        if (isLost && solvedGroups.length < 4) {
            // Auto-reveal remaining groups
            const solvedCategories = new Set(solvedGroups.map(g => g.category));
            const remaining = puzzle.groups
                .filter(g => !solvedCategories.has(g.category))
                .map((g, i) => ({
                    ...g,
                    solvedOrder: solvedGroups.length + i + 1,
                }));

            setSolvedGroups(prev => [...prev, ...remaining]);
            setWords([]);
            setIsComplete(true);
        }
    }, [isLost, puzzle.groups, solvedGroups]);

    return {
        // State
        puzzle,
        puzzleNumber,
        words,
        selectedWords,
        solvedGroups,
        mistakes,
        maxMistakes,
        isComplete,
        isStarted,
        elapsedTime,
        lastGuessCorrect,
        shakeWords,
        isLost,

        // Actions
        toggleWord,
        clearSelection,
        submitGuess,
        shuffleWords,
    };
}
