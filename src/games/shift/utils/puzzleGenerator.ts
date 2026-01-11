/**
 * SHIFT Puzzle Generator
 * 
 * Solution-first approach: generate valid grid, then scramble
 * Guarantees every puzzle is solvable
 */

import { getRandomWords, isValidWord, getEasyWords } from '../../../utils/dictionary';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ShiftPuzzle {
    grid: string[][];
    solution: string[][];
    size: number;
    difficulty: Difficulty;
    seed: number;
    puzzleNumber: number;
}

// Seeded random number generator
function seededRandom(seed: number): () => number {
    return () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
    };
}

// Shift a row left or right (wrapping)
export function shiftRow(grid: string[][], row: number, direction: 'left' | 'right'): string[][] {
    const newGrid = grid.map(r => [...r]);
    const rowData = newGrid[row];

    if (direction === 'left') {
        const first = rowData.shift()!;
        rowData.push(first);
    } else {
        const last = rowData.pop()!;
        rowData.unshift(last);
    }

    newGrid[row] = rowData;
    return newGrid;
}

// Shift a column up or down (wrapping)
export function shiftColumn(grid: string[][], col: number, direction: 'up' | 'down'): string[][] {
    const newGrid = grid.map(r => [...r]);
    const colData = newGrid.map(r => r[col]);

    if (direction === 'up') {
        const first = colData.shift()!;
        colData.push(first);
    } else {
        const last = colData.pop()!;
        colData.unshift(last);
    }

    colData.forEach((letter, i) => {
        newGrid[i][col] = letter;
    });

    return newGrid;
}

// Check if all rows are valid words
export function checkAllRowsValid(grid: string[][]): boolean {
    return grid.every(row => isValidWord(row.join('')));
}

// Get row as word
export function getRowWord(grid: string[][], row: number): string {
    return grid[row].join('');
}

// Check if specific row is valid
export function isRowValid(grid: string[][], row: number): boolean {
    return isValidWord(getRowWord(grid, row));
}

// Scramble a grid with random moves
function scrambleGrid(
    grid: string[][],
    depth: number,
    random: () => number,
    difficulty?: Difficulty
): string[][] {
    let scrambled = grid.map(r => [...r]);
    const size = grid.length;

    // For Easy mode, ensure specific structure: 4 moves with at least 2 column shifts
    if (difficulty === 'easy') {
        // First 2 moves: guaranteed column shifts
        for (let i = 0; i < 2; i++) {
            const index = Math.floor(random() * size);
            const direction = random() > 0.5 ? 'up' : 'down';
            scrambled = shiftColumn(scrambled, index, direction);
        }
        // Next 2 moves: row shifts
        for (let i = 0; i < 2; i++) {
            const index = Math.floor(random() * size);
            const direction = random() > 0.5 ? 'left' : 'right';
            scrambled = shiftRow(scrambled, index, direction);
        }
        return scrambled;
    }

    // Default scrambling for medium/hard
    for (let i = 0; i < depth; i++) {
        const isRowMove = random() > 0.5;
        const index = Math.floor(random() * size);

        if (isRowMove) {
            const direction = random() > 0.5 ? 'left' : 'right';
            scrambled = shiftRow(scrambled, index, direction);
        } else {
            const direction = random() > 0.5 ? 'up' : 'down';
            scrambled = shiftColumn(scrambled, index, direction);
        }
    }

    return scrambled;
}

// Generate a valid solution grid
function generateSolutionGrid(size: number, random: () => number): string[][] {
    // Use curated easy words for 4x4 grids (Easy mode)
    const words = size === 4
        ? getEasyWords(size, random)
        : getRandomWords(size, size, random);
    return words.map(word => word.split(''));
}

// Get scramble depth for difficulty
function getScrambleDepth(difficulty: Difficulty): number {
    switch (difficulty) {
        case 'easy': return 4; // Fixed 4 moves (2 column + 2 row)
        case 'medium': return 6 + Math.floor(Math.random() * 5); // 6-10
        case 'hard': return 12 + Math.floor(Math.random() * 7); // 12-18
    }
}

// Get grid size for difficulty
function getGridSize(difficulty: Difficulty): number {
    return difficulty === 'easy' ? 4 : 5;
}

// Generate daily puzzle
export function getDailyPuzzle(difficulty: Difficulty, date: Date = new Date()): ShiftPuzzle {
    const dateStr = date.toISOString().split('T')[0];
    let seed = 0;
    for (let i = 0; i < dateStr.length; i++) {
        seed = ((seed << 5) - seed) + dateStr.charCodeAt(i);
        seed = seed & seed;
    }
    // Add difficulty to seed for unique puzzles per difficulty
    seed = Math.abs(seed + difficulty.charCodeAt(0) * 1000);

    const random = seededRandom(seed);
    const size = getGridSize(difficulty);
    const depth = getScrambleDepth(difficulty);

    // Generate solution first
    const solution = generateSolutionGrid(size, random);

    // Scramble it
    const grid = scrambleGrid(solution, depth, random, difficulty);

    // Calculate puzzle number (days since epoch)
    const epoch = new Date('2026-01-11');
    const puzzleNumber = Math.floor((date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));

    return {
        grid,
        solution,
        size,
        difficulty,
        seed,
        puzzleNumber,
    };
}
