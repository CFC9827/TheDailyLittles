/**
 * Daily Challenge Manager
 * 
 * Manages the rotating 3-game daily challenge with gating logic.
 * - Games rotate daily based on date seed
 * - Game 1: Free for all
 * - Games 2-3: Require account
 * - Completion tracking and streak management
 */

import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface ChallengeGame {
    id: string;
    name: string;
    path: string;
    icon: string;
    position: 1 | 2 | 3; // Position in today's challenge
    requiresAuth: boolean;
    isLocked: boolean;
    isCompleted: boolean;
}

export interface DailyChallenge {
    date: string; // YYYY-MM-DD
    puzzleNumber: number;
    games: [ChallengeGame, ChallengeGame, ChallengeGame];
    isFullyCompleted: boolean;
    completedCount: number;
    unlockTime: Date;
}

// All available games in the platform
const ALL_GAMES = [
    { id: 'cipher', name: 'CIPHER', path: '/cipher', icon: '🔐' },
    { id: 'sort', name: 'SORT', path: '/sort', icon: '📊' },
    { id: 'gridgram', name: 'GRIDGRAM', path: '/gridgram', icon: '🧩' },
    { id: 'shift', name: 'SHIFT', path: '/shift', icon: '⬅️' },
    { id: 'mini', name: 'MINI', path: '/mini', icon: '➕' },
];

// Storage keys
const STORAGE_KEY_COMPLETIONS = 'daily_challenge_completions';
const STORAGE_KEY_STREAK = 'daily_challenge_streak';

// Challenge unlocks at 10:00 AM
const UNLOCK_HOUR = 10;

/**
 * Get the effective challenge date (before 10 AM = yesterday's challenge)
 */
export function getEffectiveDate(now: Date = new Date()): Date {
    const d = new Date(now);
    if (d.getHours() < UNLOCK_HOUR) {
        d.setDate(d.getDate() - 1);
    }
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get puzzle number (days since epoch)
 */
export function getPuzzleNumber(date: Date = new Date()): number {
    const epoch = new Date('2026-01-11');
    return Math.floor((date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Select 3 games for the day using seeded random
 */
function selectDailyGames(dateKey: string): typeof ALL_GAMES {
    // Create seed from date
    let seed = 0;
    for (let i = 0; i < dateKey.length; i++) {
        seed = ((seed << 5) - seed) + dateKey.charCodeAt(i);
        seed = seed & seed;
    }
    seed = Math.abs(seed);

    // Seeded shuffle
    const shuffled = [...ALL_GAMES];
    for (let i = shuffled.length - 1; i > 0; i--) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        const j = seed % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 3);
}

/**
 * Get completions from storage
 */
function getCompletions(): Record<string, Record<string, boolean>> {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_COMPLETIONS);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

/**
 * Mark a game as completed
 */
export function markGameCompleted(gameId: string, dateKey: string): void {
    const completions = getCompletions();
    if (!completions[dateKey]) {
        completions[dateKey] = {};
    }
    completions[dateKey][gameId] = true;
    localStorage.setItem(STORAGE_KEY_COMPLETIONS, JSON.stringify(completions));
}

/**
 * Check if a game is completed
 */
export function isGameCompleted(gameId: string, dateKey: string): boolean {
    const completions = getCompletions();
    return completions[dateKey]?.[gameId] ?? false;
}

/**
 * Get streak info
 */
export function getStreakInfo(): { current: number; longest: number } {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_STREAK);
        return stored ? JSON.parse(stored) : { current: 0, longest: 0 };
    } catch {
        return { current: 0, longest: 0 };
    }
}

/**
 * Update streak after completing all 3 games
 */
export function updateStreak(dateKey: string): void {
    const streak = getStreakInfo();
    const lastCompleted = localStorage.getItem('daily_challenge_last_completed');

    // Check if we completed yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = formatDateKey(yesterday);

    if (lastCompleted === yesterdayKey) {
        // Extend streak
        streak.current += 1;
    } else if (lastCompleted !== dateKey) {
        // Start new streak
        streak.current = 1;
    }

    // Update longest
    if (streak.current > streak.longest) {
        streak.longest = streak.current;
    }

    localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(streak));
    localStorage.setItem('daily_challenge_last_completed', dateKey);
}

/**
 * Hook to get today's daily challenge
 */
export function useDailyChallenge(): DailyChallenge {
    const { isAuthenticated } = useAuth();

    return useMemo(() => {
        const effectiveDate = getEffectiveDate();
        const dateKey = formatDateKey(effectiveDate);
        const puzzleNumber = getPuzzleNumber(effectiveDate);
        const selectedGames = selectDailyGames(dateKey);

        // Build challenge games with gating and completion status
        const games = selectedGames.map((game, index) => {
            const position = (index + 1) as 1 | 2 | 3;
            const requiresAuth = position > 1;
            const isLocked = requiresAuth && !isAuthenticated;
            const isCompleted = isGameCompleted(game.id, dateKey);

            return {
                ...game,
                position,
                requiresAuth,
                isLocked,
                isCompleted,
            };
        }) as [ChallengeGame, ChallengeGame, ChallengeGame];

        const completedCount = games.filter(g => g.isCompleted).length;
        const isFullyCompleted = completedCount === 3;

        // Calculate next unlock time
        const now = new Date();
        const unlockTime = new Date(now);
        if (now.getHours() >= UNLOCK_HOUR) {
            unlockTime.setDate(unlockTime.getDate() + 1);
        }
        unlockTime.setHours(UNLOCK_HOUR, 0, 0, 0);

        return {
            date: dateKey,
            puzzleNumber,
            games,
            isFullyCompleted,
            completedCount,
            unlockTime,
        };
    }, [isAuthenticated]);
}

/**
 * Get gate type for a specific game position
 */
export function getGateType(position: 1 | 2 | 3, isAuthenticated: boolean): 'none' | 'account' {
    if (position === 1) return 'none';
    if (!isAuthenticated) return 'account';
    return 'none';
}
