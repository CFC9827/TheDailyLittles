import { isValidWord } from '../../../utils/dictionary';

export interface GridPosition {
    row: number;
    col: number;
    letter: string;
}

export interface ValidationResult {
    isValid: boolean;
    words: string[];
    invalidWords: string[];
    isConnected: boolean;
    allLettersUsed: boolean;
}

// Extract all horizontal words from grid
function getHorizontalWords(positions: GridPosition[]): string[] {
    const grid = new Map<string, string>();
    positions.forEach(p => grid.set(`${p.row},${p.col}`, p.letter));

    const rows = new Map<number, number[]>();
    positions.forEach(p => {
        if (!rows.has(p.row)) rows.set(p.row, []);
        rows.get(p.row)!.push(p.col);
    });

    const words: string[] = [];

    rows.forEach((cols, row) => {
        cols.sort((a, b) => a - b);
        let word = '';
        let lastCol = -2;

        for (const col of cols) {
            if (col === lastCol + 1) {
                word += grid.get(`${row},${col}`) || '';
            } else {
                if (word.length >= 2) words.push(word);
                word = grid.get(`${row},${col}`) || '';
            }
            lastCol = col;
        }
        if (word.length >= 2) words.push(word);
    });

    return words;
}

// Extract all vertical words from grid
function getVerticalWords(positions: GridPosition[]): string[] {
    const grid = new Map<string, string>();
    positions.forEach(p => grid.set(`${p.row},${p.col}`, p.letter));

    const cols = new Map<number, number[]>();
    positions.forEach(p => {
        if (!cols.has(p.col)) cols.set(p.col, []);
        cols.get(p.col)!.push(p.row);
    });

    const words: string[] = [];

    cols.forEach((rows, col) => {
        rows.sort((a, b) => a - b);
        let word = '';
        let lastRow = -2;

        for (const row of rows) {
            if (row === lastRow + 1) {
                word += grid.get(`${row},${col}`) || '';
            } else {
                if (word.length >= 2) words.push(word);
                word = grid.get(`${row},${col}`) || '';
            }
            lastRow = row;
        }
        if (word.length >= 2) words.push(word);
    });

    return words;
}

// Check if grid is connected using BFS
function isGridConnected(positions: GridPosition[]): boolean {
    if (positions.length === 0) return true;

    const posSet = new Set(positions.map(p => `${p.row},${p.col}`));
    const visited = new Set<string>();
    const queue = [`${positions[0].row},${positions[0].col}`];

    while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current)) continue;
        visited.add(current);

        const [row, col] = current.split(',').map(Number);
        const neighbors = [
            `${row - 1},${col}`,
            `${row + 1},${col}`,
            `${row},${col - 1}`,
            `${row},${col + 1}`,
        ];

        for (const neighbor of neighbors) {
            if (posSet.has(neighbor) && !visited.has(neighbor)) {
                queue.push(neighbor);
            }
        }
    }

    return visited.size === positions.length;
}

// Validate a player's grid
export function validateGrid(
    positions: GridPosition[],
    availableLetters: string[]
): ValidationResult {
    if (positions.length === 0) {
        return {
            isValid: false,
            words: [],
            invalidWords: [],
            isConnected: true,
            allLettersUsed: false,
        };
    }

    // Get all words
    const horizontalWords = getHorizontalWords(positions);
    const verticalWords = getVerticalWords(positions);
    const allWords = [...horizontalWords, ...verticalWords];

    // Validate each word
    const validWords: string[] = [];
    const invalidWords: string[] = [];

    for (const word of allWords) {
        if (isValidWord(word)) {
            validWords.push(word);
        } else {
            invalidWords.push(word);
        }
    }

    // Check connectivity
    const connected = isGridConnected(positions);

    // Check if all letters used
    const usedLetters = positions.map(p => p.letter).sort().join('');
    const available = [...availableLetters].sort().join('');
    const allUsed = usedLetters === available;

    return {
        isValid: invalidWords.length === 0 && connected && allUsed && allWords.length > 0,
        words: validWords,
        invalidWords,
        isConnected: connected,
        allLettersUsed: allUsed,
    };
}
