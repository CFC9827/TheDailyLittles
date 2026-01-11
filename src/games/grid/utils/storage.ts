/**
 * GRIDGRAM Game Storage
 */

const STORAGE_PREFIX = 'gridgram_';

export interface GridGameProgress {
    letters: (string | null)[];
    gridPositions: { row: number; col: number; letter: string }[];
    elapsedTime: number;
    completed: boolean;
    date: string;
}

export interface GridStats {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    bestScore: number | null;
    totalScore: number;
    lastPlayedDate: string | null;
}

const DEFAULT_STATS: GridStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    bestScore: null,
    totalScore: 0,
    lastPlayedDate: null,
};

function getDateString(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
}

export function saveGameProgress(progress: GridGameProgress): void {
    const key = `${STORAGE_PREFIX}progress_${progress.date}`;
    localStorage.setItem(key, JSON.stringify(progress));
}

export function loadGameProgress(date: string): GridGameProgress | null {
    const key = `${STORAGE_PREFIX}progress_${date}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

export function loadStats(): GridStats {
    const data = localStorage.getItem(`${STORAGE_PREFIX}stats`);
    return data ? { ...DEFAULT_STATS, ...JSON.parse(data) } : DEFAULT_STATS;
}

export function saveStats(stats: GridStats): void {
    localStorage.setItem(`${STORAGE_PREFIX}stats`, JSON.stringify(stats));
}

export function updateStatsOnWin(score: number): GridStats {
    const stats = loadStats();
    const today = getDateString();

    stats.gamesPlayed++;
    stats.gamesWon++;
    stats.totalScore += score;

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
    stats.lastPlayedDate = today;

    // Update bests
    if (stats.bestScore === null || score > stats.bestScore) {
        stats.bestScore = score;
    }

    saveStats(stats);
    return stats;
}
