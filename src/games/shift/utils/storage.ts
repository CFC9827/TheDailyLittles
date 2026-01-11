/**
 * SHIFT Game Storage
 */

import type { Difficulty } from './puzzleGenerator';

const STORAGE_PREFIX = 'shift_';

export interface ShiftGameProgress {
    grid: string[][];
    moves: number;
    elapsedTime: number;
    completed: boolean;
    date: string;
    difficulty: Difficulty;
}

export interface ShiftStats {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    bestTime: Record<Difficulty, number | null>;
    bestMoves: Record<Difficulty, number | null>;
    lastPlayedDate: string | null;
}

const DEFAULT_STATS: ShiftStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    bestTime: { easy: null, medium: null, hard: null },
    bestMoves: { easy: null, medium: null, hard: null },
    lastPlayedDate: null,
};

function getDateString(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
}

export function saveGameProgress(progress: ShiftGameProgress): void {
    const key = `${STORAGE_PREFIX}progress_${progress.date}_${progress.difficulty}`;
    localStorage.setItem(key, JSON.stringify(progress));
}

export function loadGameProgress(date: string, difficulty: Difficulty): ShiftGameProgress | null {
    const key = `${STORAGE_PREFIX}progress_${date}_${difficulty}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

export function loadStats(): ShiftStats {
    const data = localStorage.getItem(`${STORAGE_PREFIX}stats`);
    return data ? { ...DEFAULT_STATS, ...JSON.parse(data) } : DEFAULT_STATS;
}

export function saveStats(stats: ShiftStats): void {
    localStorage.setItem(`${STORAGE_PREFIX}stats`, JSON.stringify(stats));
}

export function updateStatsOnWin(
    difficulty: Difficulty,
    time: number,
    moves: number
): ShiftStats {
    const stats = loadStats();
    const today = getDateString();

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
    stats.lastPlayedDate = today;

    // Update bests
    if (stats.bestTime[difficulty] === null || time < stats.bestTime[difficulty]!) {
        stats.bestTime[difficulty] = time;
    }
    if (stats.bestMoves[difficulty] === null || moves < stats.bestMoves[difficulty]!) {
        stats.bestMoves[difficulty] = moves;
    }

    saveStats(stats);
    return stats;
}
