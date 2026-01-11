/**
 * Mini Crossword Storage
 * 
 * Saves/loads game progress and statistics
 */

const STORAGE_PREFIX = 'mini_';

export interface MiniProgress {
    date: string;
    playerGrid: string[][];
    elapsedTime: number;
    isComplete: boolean;
}

export interface MiniStats {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    bestTime: number | null;
    averageTime: number;
    lastPlayedDate: string | null;
}

/**
 * Save game progress
 */
export function saveProgress(progress: MiniProgress): void {
    try {
        localStorage.setItem(
            `${STORAGE_PREFIX}progress_${progress.date}`,
            JSON.stringify(progress)
        );
    } catch (e) {
        console.error('Failed to save Mini progress:', e);
    }
}

/**
 * Load game progress
 */
export function loadProgress(date: string): MiniProgress | null {
    try {
        const saved = localStorage.getItem(`${STORAGE_PREFIX}progress_${date}`);
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        console.error('Failed to load Mini progress:', e);
        return null;
    }
}

/**
 * Load statistics
 */
export function loadStats(): MiniStats {
    try {
        const saved = localStorage.getItem(`${STORAGE_PREFIX}stats`);
        if (saved) return JSON.parse(saved);
    } catch (e) {
        console.error('Failed to load Mini stats:', e);
    }

    return {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        bestTime: null,
        averageTime: 0,
        lastPlayedDate: null,
    };
}

/**
 * Update statistics on completion
 */
export function updateStats(solveTime: number): MiniStats {
    const stats = loadStats();
    const today = new Date().toISOString().split('T')[0];

    stats.gamesPlayed++;
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

    // Update times
    if (stats.bestTime === null || solveTime < stats.bestTime) {
        stats.bestTime = solveTime;
    }

    stats.averageTime = (
        (stats.averageTime * (stats.gamesWon - 1) + solveTime) /
        stats.gamesWon
    );

    stats.lastPlayedDate = today;

    // Save
    try {
        localStorage.setItem(`${STORAGE_PREFIX}stats`, JSON.stringify(stats));
    } catch (e) {
        console.error('Failed to save Mini stats:', e);
    }

    return stats;
}
