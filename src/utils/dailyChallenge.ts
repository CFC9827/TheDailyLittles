/**
 * Daily Challenge Manager
 * 
 * Handles the daily curation, unlock logic (10:00 AM),
 * completion tracking, streaks, and composite scoring.
 */

export interface Game {
    id: string;
    name: string;
    path: string;
}

export interface GameCompletion {
    gameId: string;
    completed: boolean;
    score: number;
    time: number;
    moves?: number;
    timestamp?: number;
}

export interface DailyChallengeState {
    date: string; // YYYY-MM-DD
    completions: Record<string, GameCompletion>;
    isFullyCompleted: boolean;
    finalCompletionTimestamp?: number;
    compositeScore: number;
}

export interface GlobalStats {
    currentStreak: number;
    longestStreak: number;
    totalChallengesCompleted: number;
    totalStars: number;
    lastCompletedDate?: string;
}

const CHALLENGE_UNLOCK_HOUR = 10; // 10:00 AM
const STORAGE_KEY_CHALLENGE = 'puzzle_central_daily_challenge';
const STORAGE_KEY_STATS = 'puzzle_central_global_stats';

/**
 * Returns the effective challenge date based on 10:00 AM cutoff
 */
export const getEffectiveDate = (now: Date = new Date()): string => {
    const d = new Date(now);
    if (d.getHours() < CHALLENGE_UNLOCK_HOUR) {
        d.setDate(d.getDate() - 1);
    }
    // Use local date components to avoid UTC shift issues
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Game definitions in the system
 */
export const ALL_GAMES = [
    { id: 'cipher', name: 'CIPHER', path: '/cipher' },
    { id: 'gridgram', name: 'GRIDGRAM', path: '/gridgram' },
    { id: 'shift', name: 'SHIFT', path: '/shift' }
];

/**
 * Get the 3 games for a specific date
 */
export const getDailyGames = (_date: string): Game[] => {
    return ALL_GAMES;
};

/**
 * Load global stats
 */
export const loadGlobalStats = (): GlobalStats => {
    const saved = localStorage.getItem(STORAGE_KEY_STATS);
    if (saved) return JSON.parse(saved);
    return {
        currentStreak: 0,
        longestStreak: 0,
        totalChallengesCompleted: 0,
        totalStars: 0
    };
};

/**
 * Load current challenge state
 */
export const loadChallengeState = (date: string): DailyChallengeState => {
    const saved = localStorage.getItem(STORAGE_KEY_CHALLENGE);
    if (saved) {
        const state: DailyChallengeState = JSON.parse(saved);
        if (state.date === date) return state;
    }

    // Initialize new state for the date
    return {
        date,
        completions: {},
        isFullyCompleted: false,
        compositeScore: 0
    };
};

/**
 * Update completion for a game
 */
export const registerCompletion = (
    gameId: string,
    score: number,
    time: number,
    moves?: number
): { challengeState: DailyChallengeState, globalStats: GlobalStats } => {
    const date = getEffectiveDate();
    const state = loadChallengeState(date);
    const stats = loadGlobalStats();

    // Update game completion
    state.completions[gameId] = {
        gameId,
        completed: true,
        score,
        time,
        moves,
        timestamp: Date.now()
    };

    // Check if challenge is fully completed
    const dailyGames = getDailyGames(date);
    const completedCount = Object.values(state.completions).filter(c => c.completed).length;

    const wasJustFinished = !state.isFullyCompleted && completedCount === dailyGames.length;

    if (wasJustFinished) {
        state.isFullyCompleted = true;
        state.finalCompletionTimestamp = Date.now();

        // Calculate composite score (normalized average)
        const avgScore = Object.values(state.completions).reduce((acc, c) => acc + c.score, 0) / dailyGames.length;
        state.compositeScore = Math.floor(avgScore);

        // Update streaks and stats
        stats.totalChallengesCompleted += 1;
        stats.totalStars += 10; // Base completion stars

        // Streak logic
        const yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (stats.lastCompletedDate === yesterdayStr) {
            stats.currentStreak += 1;
        } else if (stats.lastCompletedDate !== date) {
            stats.currentStreak = 1;
        }

        if (stats.currentStreak > stats.longestStreak) {
            stats.longestStreak = stats.currentStreak;
        }

        stats.lastCompletedDate = date;
    }

    // Save everything
    localStorage.setItem(STORAGE_KEY_CHALLENGE, JSON.stringify(state));
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));

    return { challengeState: state, globalStats: stats };
};

/**
 * Get composite score components (for sharing or breakdown)
 */
export const getScoreBreakdown = (state: DailyChallengeState) => {
    return Object.values(state.completions).map(c => ({
        id: c.gameId,
        name: ALL_GAMES.find(g => g.id === c.gameId)?.name || c.gameId,
        score: c.score,
        completed: c.completed
    }));
};
