/**
 * Daily Puzzle Seeding System
 * 
 * Generates deterministic puzzles based on the current date,
 * ensuring all users get the same puzzle each day.
 */

import { generateCipherMapping, encodePhrase, type CipherMapping } from './cipher';
import { getRandomPhrase, type Difficulty, type PhraseData } from '../data/phrases';

// Epoch date for puzzle numbering (start of CIPHER)
const EPOCH_DATE = new Date('2026-01-11T00:00:00Z');

export interface DailyPuzzle {
    puzzleNumber: number;
    difficulty: Difficulty;
    originalPhrase: string;
    encodedPhrase: string;
    cipherMapping: CipherMapping;
    date: string; // ISO date string
    hint: string; // Crossword-style clue
}

/**
 * Gets the current puzzle number (days since epoch)
 */
export function getPuzzleNumber(date: Date = new Date()): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffMs = date.getTime() - EPOCH_DATE.getTime();
    return Math.floor(diffMs / msPerDay) + 1;
}

/**
 * Gets a date string in YYYY-MM-DD format for the local timezone
 */
export function getDateString(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
}

/**
 * Generates a seed from date and difficulty
 */
function generateSeed(date: Date, difficulty: Difficulty): number {
    const dateStr = getDateString(date);
    const difficultyMultiplier = { easy: 1, medium: 2, hard: 3 }[difficulty];

    // Generate a hash from the date string
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        const char = dateStr.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash * difficultyMultiplier) + 20260111; // Offset for new puzzles
}

/**
 * Gets today's puzzle for a given difficulty
 */
export function getDailyPuzzle(difficulty: Difficulty, date: Date = new Date()): DailyPuzzle {
    const seed = generateSeed(date, difficulty);
    const puzzleNumber = getPuzzleNumber(date);

    // Get phrase using seeded selection
    const phraseData: PhraseData = getRandomPhrase(difficulty, seed);
    const originalPhrase = phraseData.phrase;

    // Generate cipher mapping using a different seed
    const cipherSeed = seed * 31337; // Use a modified seed for cipher
    const cipherMapping = generateCipherMapping(cipherSeed);

    // Encode the phrase
    const encodedPhrase = encodePhrase(originalPhrase, cipherMapping);

    return {
        puzzleNumber,
        difficulty,
        originalPhrase,
        encodedPhrase,
        cipherMapping,
        date: getDateString(date),
        hint: phraseData.hint,
    };
}

/**
 * Checks if a puzzle is still valid for today
 */
export function isPuzzleFromToday(puzzle: DailyPuzzle): boolean {
    return puzzle.date === getDateString(new Date());
}

/**
 * Gets milliseconds until the next puzzle refresh (midnight local time)
 */
export function getTimeUntilNextPuzzle(): number {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
}

/**
 * Formats remaining time as HH:MM:SS
 */
export function formatTimeRemaining(ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0'),
    ].join(':');
}
