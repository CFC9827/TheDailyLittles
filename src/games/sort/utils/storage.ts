/**
 * SORT Game Storage
 * 
 * Handles saving/loading game progress and statistics
 */

import type { SolvedGroup } from '../hooks/useSort';

const STORAGE_PREFIX = 'sort_';

export interface SortProgress {
    date: string;
    solvedGroups: SolvedGroup[];
    mistakes: number;
    elapsedTime: number;
    isComplete: boolean;
}

export interface SortStats {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    perfectGames: number; // No mistakes
    averageMistakes: number;
    lastPlayedDate: string | null;
}

/**
 * Save game progress
 */
export function saveProgress(progress: SortProgress): void {
    try {
        localStorage.setItem(
            `${STORAGE_PREFIX}progress_${progress.date}`,
            JSON.stringify(progress)
        );
    } catch (e) {
        console.error('Failed to save SORT progress:', e);
    }
}

/**
 * Load game progress for a date
 */
export function loadProgress(date: string): SortProgress | null {
    try {
        const saved = localStorage.getItem(`${STORAGE_PREFIX}progress_${date}`);
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        console.error('Failed to load SORT progress:', e);
        return null;
    }
}

/**
 * Load statistics
 */
export function loadStats(): SortStats {
    try {
        const saved = localStorage.getItem(`${STORAGE_PREFIX}stats`);
        if (saved) return JSON.parse(saved);
    } catch (e) {
        console.error('Failed to load SORT stats:', e);
    }

    return {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        perfectGames: 0,
        averageMistakes: 0,
        lastPlayedDate: null,
    };
}

/**
 * Update statistics after game completion
 */
export function updateStats(mistakes: number, _elapsedTime: number): SortStats {
    const stats = loadStats();
    const today = new Date().toISOString().split('T')[0];
    const won = mistakes < 4;

    // Update stats
    stats.gamesPlayed++;

    if (won) {
        stats.gamesWon++;

        // Update streak
        if (stats.lastPlayedDate) {
            const lastDate = new Date(stats.lastPlayedDate);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                stats.currentStreak++;
            } else if (diffDays > 1) {
                stats.currentStreak = 1;
            }
        } else {
            stats.currentStreak = 1;
        }

        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);

        if (mistakes === 0) {
            stats.perfectGames++;
        }
    } else {
        stats.currentStreak = 0;
    }

    // Update average mistakes
    stats.averageMistakes = (
        (stats.averageMistakes * (stats.gamesPlayed - 1) + mistakes) /
        stats.gamesPlayed
    );

    stats.lastPlayedDate = today;

    // Save
    try {
        localStorage.setItem(`${STORAGE_PREFIX}stats`, JSON.stringify(stats));
    } catch (e) {
        console.error('Failed to save SORT stats:', e);
    }

    return stats;
}
