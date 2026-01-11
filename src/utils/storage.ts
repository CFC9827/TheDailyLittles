/**
 * Local Storage Utilities
 * 
 * Handles persistence of game state, statistics, and settings
 */

import type { Difficulty } from '../data/phrases';

// Storage Keys
const STORAGE_KEYS = {
    GAME_STATE: 'cipher_game_state',
    STATISTICS: 'cipher_statistics',
    SETTINGS: 'cipher_settings',
    LEADERBOARD: 'cipher_leaderboard',
} as const;

// Types
export interface GameProgress {
    date: string;
    difficulty: Difficulty;
    puzzleNumber: number;
    guesses: Record<string, string>; // cipher letter -> guessed letter
    startTime: number; // timestamp when started
    endTime?: number; // timestamp when completed
    completed: boolean;
    timeElapsed: number; // in milliseconds
}

export interface DifficultyStats {
    gamesPlayed: number;
    gamesWon: number;
    totalTime: number; // in milliseconds
    bestTime: number | null; // in milliseconds
    averageTime: number | null; // in milliseconds
    lastPlayed: string | null; // date string
}

export interface Statistics {
    easy: DifficultyStats;
    medium: DifficultyStats;
    hard: DifficultyStats;
    currentStreak: number;
    maxStreak: number;
    lastPlayedDate: string | null;
    totalStars: number;
}

export interface Settings {
    theme: 'light' | 'dark' | 'system';
    showTimer: boolean;
    highlightLinkedLetters: boolean;
    soundEnabled: boolean;
}

export interface LeaderboardEntry {
    date: string;
    difficulty: Difficulty;
    time: number;
    puzzleNumber: number;
    streak: number;
}

// Default values
const defaultDifficultyStats: DifficultyStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    totalTime: 0,
    bestTime: null,
    averageTime: null,
    lastPlayed: null,
};

const defaultStatistics: Statistics = {
    easy: { ...defaultDifficultyStats },
    medium: { ...defaultDifficultyStats },
    hard: { ...defaultDifficultyStats },
    currentStreak: 0,
    maxStreak: 0,
    lastPlayedDate: null,
    totalStars: 0,
};

const defaultSettings: Settings = {
    theme: 'light',
    showTimer: true,
    highlightLinkedLetters: true,
    soundEnabled: true,
};

// Storage helpers
function getItem<T>(key: string, defaultValue: T): T {
    try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item) as T;
    } catch {
        return defaultValue;
    }
}

function setItem<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Game Progress
export function saveGameProgress(progress: GameProgress): void {
    const allProgress = getItem<Record<string, GameProgress>>(STORAGE_KEYS.GAME_STATE, {});
    const key = `${progress.date}_${progress.difficulty}`;
    allProgress[key] = progress;
    setItem(STORAGE_KEYS.GAME_STATE, allProgress);
}

export function loadGameProgress(date: string, difficulty: Difficulty): GameProgress | null {
    const allProgress = getItem<Record<string, GameProgress>>(STORAGE_KEYS.GAME_STATE, {});
    const key = `${date}_${difficulty}`;
    return allProgress[key] || null;
}

export function hasPlayedToday(date: string, difficulty: Difficulty): boolean {
    const progress = loadGameProgress(date, difficulty);
    return progress !== null && progress.completed;
}

// Statistics
export function loadStatistics(): Statistics {
    return getItem(STORAGE_KEYS.STATISTICS, defaultStatistics);
}

export function saveStatistics(stats: Statistics): void {
    setItem(STORAGE_KEYS.STATISTICS, stats);
}

export function updateStatisticsAfterGame(
    difficulty: Difficulty,
    timeElapsed: number,
    date: string
): Statistics {
    const stats = loadStatistics();
    const diffStats = stats[difficulty];

    // Update difficulty-specific stats
    diffStats.gamesPlayed += 1;
    diffStats.gamesWon += 1;
    diffStats.totalTime += timeElapsed;
    diffStats.lastPlayed = date;

    // Update best time
    if (diffStats.bestTime === null || timeElapsed < diffStats.bestTime) {
        diffStats.bestTime = timeElapsed;
    }

    // Update average time
    diffStats.averageTime = Math.round(diffStats.totalTime / diffStats.gamesWon);

    // Update streak
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (stats.lastPlayedDate === yesterday || stats.lastPlayedDate === today) {
        if (stats.lastPlayedDate !== today) {
            stats.currentStreak += 1;
        }
    } else {
        stats.currentStreak = 1;
    }

    stats.lastPlayedDate = today;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);

    // Calculate stars earned
    const starsEarned = calculateStarsEarned(difficulty, timeElapsed);
    stats.totalStars += starsEarned;

    saveStatistics(stats);
    return stats;
}

// Star calculation based on performance
export function calculateStarsEarned(difficulty: Difficulty, timeElapsed: number): number {
    // Time thresholds in milliseconds
    const thresholds = {
        easy: { three: 30000, two: 60000, one: 120000 },
        medium: { three: 120000, two: 240000, one: 480000 },
        hard: { three: 300000, two: 600000, one: 900000 },
    };

    const threshold = thresholds[difficulty];

    if (timeElapsed <= threshold.three) return 3;
    if (timeElapsed <= threshold.two) return 2;
    if (timeElapsed <= threshold.one) return 1;
    return 1; // Minimum 1 star for completion
}

// Settings
export function loadSettings(): Settings {
    return getItem(STORAGE_KEYS.SETTINGS, defaultSettings);
}

export function saveSettings(settings: Settings): void {
    setItem(STORAGE_KEYS.SETTINGS, settings);
}

// Leaderboard
export function loadLeaderboard(): LeaderboardEntry[] {
    return getItem<LeaderboardEntry[]>(STORAGE_KEYS.LEADERBOARD, []);
}

export function addToLeaderboard(entry: LeaderboardEntry): void {
    const leaderboard = loadLeaderboard();
    leaderboard.push(entry);

    // Keep only last 100 entries
    const sorted = leaderboard
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 100);

    setItem(STORAGE_KEYS.LEADERBOARD, sorted);
}

export function getLeaderboardForDate(date: string, difficulty: Difficulty): LeaderboardEntry[] {
    const leaderboard = loadLeaderboard();
    return leaderboard
        .filter(entry => entry.date === date && entry.difficulty === difficulty)
        .sort((a, b) => a.time - b.time);
}

// Clear all data (for testing/reset)
export function clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}
