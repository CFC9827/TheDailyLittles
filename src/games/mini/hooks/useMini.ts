/**
 * Mini Crossword Game State
 * 
 * Handles grid state, navigation, input, and completion detection
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { getDailyPuzzle, getCellNumbers, type MiniPuzzle, type ClueData } from '../data/puzzles';
import { loadProgress, saveProgress, updateStats } from '../utils/storage';

export type Direction = 'across' | 'down';

export interface CellPosition {
    row: number;
    col: number;
}

export interface MiniGameState {
    puzzle: MiniPuzzle;
    playerGrid: string[][];
    selectedCell: CellPosition | null;
    direction: Direction;
    isComplete: boolean;
    isStarted: boolean;
    elapsedTime: number;
    currentClue: ClueData | null;
    cellNumbers: Map<string, number>;
}

export function useMini() {
    const puzzle = useMemo(() => getDailyPuzzle(), []);
    const cellNumbers = useMemo(() => getCellNumbers(puzzle), [puzzle]);

    // Initialize empty player grid matching puzzle size
    const [playerGrid, setPlayerGrid] = useState<string[][]>(() => {
        return puzzle.grid.map(row =>
            row.map(cell => cell === null ? '' : '')
        );
    });

    const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
    const [direction, setDirection] = useState<Direction>('across');
    const [isComplete, setIsComplete] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    const timerRef = useRef<number | null>(null);

    // Load saved progress
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const saved = loadProgress(today);

        if (saved) {
            setPlayerGrid(saved.playerGrid);
            setElapsedTime(saved.elapsedTime);
            setIsComplete(saved.isComplete);
            if (!saved.isComplete) {
                // Find first empty cell to select
                for (let row = 0; row < 5; row++) {
                    for (let col = 0; col < 5; col++) {
                        if (puzzle.grid[row][col] !== null && saved.playerGrid[row][col] === '') {
                            setSelectedCell({ row, col });
                            setIsStarted(true);
                            return;
                        }
                    }
                }
            }
        }
    }, [puzzle.grid]);

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
                playerGrid,
                elapsedTime,
                isComplete,
            });
        }
    }, [playerGrid, elapsedTime, isComplete, isStarted]);

    // Check completion
    useEffect(() => {
        if (!isStarted) return;

        let complete = true;
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (puzzle.grid[row][col] !== null) {
                    if (playerGrid[row][col].toUpperCase() !== puzzle.solution[row][col]) {
                        complete = false;
                        break;
                    }
                }
            }
            if (!complete) break;
        }

        if (complete && !isComplete) {
            setIsComplete(true);
            if (timerRef.current) clearInterval(timerRef.current);
            updateStats(elapsedTime);
        }
    }, [playerGrid, puzzle, isStarted, isComplete, elapsedTime]);

    // Get current clue based on selected cell and direction
    const currentClue = useMemo((): ClueData | null => {
        if (!selectedCell) return null;

        const { row, col } = selectedCell;
        const clues = direction === 'across' ? puzzle.clues.across : puzzle.clues.down;

        // Find clue that contains this cell
        for (const clue of clues) {
            if (direction === 'across') {
                if (clue.row === row && col >= clue.col && col < clue.col + clue.length) {
                    return clue;
                }
            } else {
                if (clue.col === col && row >= clue.row && row < clue.row + clue.length) {
                    return clue;
                }
            }
        }

        return null;
    }, [selectedCell, direction, puzzle.clues]);

    // Get cells for current word
    const currentWordCells = useMemo((): CellPosition[] => {
        if (!currentClue) return [];

        const cells: CellPosition[] = [];
        if (direction === 'across') {
            for (let c = currentClue.col; c < currentClue.col + currentClue.length; c++) {
                cells.push({ row: currentClue.row, col: c });
            }
        } else {
            for (let r = currentClue.row; r < currentClue.row + currentClue.length; r++) {
                cells.push({ row: r, col: currentClue.col });
            }
        }
        return cells;
    }, [currentClue, direction]);

    // Select cell
    const selectCell = useCallback((row: number, col: number) => {
        if (puzzle.grid[row][col] === null) return;
        if (!isStarted) setIsStarted(true);

        // If clicking same cell, toggle direction
        if (selectedCell?.row === row && selectedCell?.col === col) {
            setDirection(d => d === 'across' ? 'down' : 'across');
        } else {
            setSelectedCell({ row, col });
        }
    }, [selectedCell, puzzle.grid, isStarted]);

    // Input letter
    const inputLetter = useCallback((letter: string) => {
        if (!selectedCell || isComplete) return;
        if (!isStarted) setIsStarted(true);

        const { row, col } = selectedCell;
        if (puzzle.grid[row][col] === null) return;

        setPlayerGrid(prev => {
            const newGrid = prev.map(r => [...r]);
            newGrid[row][col] = letter.toUpperCase();
            return newGrid;
        });

        // Move to next cell
        moveToNextCell();
    }, [selectedCell, isComplete, puzzle.grid, isStarted]);

    // Delete letter (backspace)
    const deleteLetter = useCallback(() => {
        if (!selectedCell || isComplete) return;

        const { row, col } = selectedCell;

        // If current cell has a letter, delete it
        if (playerGrid[row][col]) {
            setPlayerGrid(prev => {
                const newGrid = prev.map(r => [...r]);
                newGrid[row][col] = '';
                return newGrid;
            });
        } else {
            // Move to previous cell and delete
            moveToPrevCell();
        }
    }, [selectedCell, isComplete, playerGrid]);

    // Move to next cell in current direction
    const moveToNextCell = useCallback(() => {
        if (!selectedCell) return;

        let { row, col } = selectedCell;

        if (direction === 'across') {
            col++;
            while (col < 5 && puzzle.grid[row][col] === null) col++;
            if (col < 5) {
                setSelectedCell({ row, col });
            }
        } else {
            row++;
            while (row < 5 && puzzle.grid[row]?.[col] === null) row++;
            if (row < 5) {
                setSelectedCell({ row, col });
            }
        }
    }, [selectedCell, direction, puzzle.grid]);

    // Move to previous cell in current direction
    const moveToPrevCell = useCallback(() => {
        if (!selectedCell) return;

        let { row, col } = selectedCell;

        if (direction === 'across') {
            col--;
            while (col >= 0 && puzzle.grid[row][col] === null) col--;
            if (col >= 0) {
                setSelectedCell({ row, col });
                // Delete the letter at the new position
                setPlayerGrid(prev => {
                    const newGrid = prev.map(r => [...r]);
                    newGrid[row][col] = '';
                    return newGrid;
                });
            }
        } else {
            row--;
            while (row >= 0 && puzzle.grid[row]?.[col] === null) row--;
            if (row >= 0) {
                setSelectedCell({ row, col });
                setPlayerGrid(prev => {
                    const newGrid = prev.map(r => [...r]);
                    newGrid[row][col] = '';
                    return newGrid;
                });
            }
        }
    }, [selectedCell, direction, puzzle.grid]);

    // Arrow key navigation
    const moveSelection = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
        if (!selectedCell) return;

        let { row, col } = selectedCell;

        switch (dir) {
            case 'up':
                row--;
                while (row >= 0 && puzzle.grid[row]?.[col] === null) row--;
                if (row >= 0) setSelectedCell({ row, col });
                setDirection('down');
                break;
            case 'down':
                row++;
                while (row < 5 && puzzle.grid[row]?.[col] === null) row++;
                if (row < 5) setSelectedCell({ row, col });
                setDirection('down');
                break;
            case 'left':
                col--;
                while (col >= 0 && puzzle.grid[row][col] === null) col--;
                if (col >= 0) setSelectedCell({ row, col });
                setDirection('across');
                break;
            case 'right':
                col++;
                while (col < 5 && puzzle.grid[row][col] === null) col++;
                if (col < 5) setSelectedCell({ row, col });
                setDirection('across');
                break;
        }
    }, [selectedCell, puzzle.grid]);

    // Jump to clue
    const jumpToClue = useCallback((clue: ClueData, dir: Direction) => {
        setSelectedCell({ row: clue.row, col: clue.col });
        setDirection(dir);
        if (!isStarted) setIsStarted(true);
    }, [isStarted]);

    // Reveal letter (helper)
    const revealLetter = useCallback(() => {
        if (!selectedCell) return;
        const { row, col } = selectedCell;
        if (puzzle.grid[row][col] === null) return;

        const letter = puzzle.solution[row][col];
        if (letter === null) return;

        setPlayerGrid(prev => {
            const newGrid = prev.map(r => [...r]);
            newGrid[row][col] = letter;
            return newGrid;
        });
    }, [selectedCell, puzzle]);

    // Clear puzzle
    const clearPuzzle = useCallback(() => {
        setPlayerGrid(puzzle.grid.map(row =>
            row.map(cell => cell === null ? '' : '')
        ));
        setIsComplete(false);
        setElapsedTime(0);
        setIsStarted(false);
        setSelectedCell(null);
    }, [puzzle.grid]);

    return {
        puzzle,
        playerGrid,
        selectedCell,
        direction,
        isComplete,
        isStarted,
        elapsedTime,
        currentClue,
        currentWordCells,
        cellNumbers,

        selectCell,
        inputLetter,
        deleteLetter,
        moveSelection,
        jumpToClue,
        revealLetter,
        clearPuzzle,
        setDirection,
    };
}
