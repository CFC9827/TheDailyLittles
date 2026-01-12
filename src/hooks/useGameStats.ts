/**
 * useGameStats Hook
 * 
 * Aggregates stats from all games into a unified structure for the Profile page.
 */

import { useMemo } from 'react';
import { loadStatistics } from '../utils/storage';
import { loadStats as loadShiftStats } from '../games/shift/utils/storage';
import { loadStats as loadGridStats } from '../games/grid/utils/storage';

export interface GameStat {
    name: string;
    played: number;
    bestTime?: number | null;
    bestMoves?: number | null;
    bestScore?: number | null;
    color: string;
}

export interface AggregatedGameStats {
    totalGamesPlayed: number;
    totalGamesWon: number;
    currentStreak: number;
    maxStreak: number;
    perGame: GameStat[];
}

export function formatTime(ms: number | null): string {
    if (ms === null) return '—';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function useGameStats(): AggregatedGameStats {
    return useMemo(() => {
        // Load stats from each game
        const cipherStats = loadStatistics();
        const shiftStats = loadShiftStats();
        const gridStats = loadGridStats();

        // Calculate totals
        const cipherPlayed = cipherStats.easy.gamesPlayed + cipherStats.medium.gamesPlayed + cipherStats.hard.gamesPlayed;
        const totalGamesPlayed = cipherPlayed + shiftStats.gamesPlayed + gridStats.gamesPlayed;
        const cipherWon = cipherStats.easy.gamesWon + cipherStats.medium.gamesWon + cipherStats.hard.gamesWon;
        const totalGamesWon = cipherWon + shiftStats.gamesWon + gridStats.gamesWon;

        // Get best streak across all games
        const currentStreak = Math.max(
            cipherStats.currentStreak,
            shiftStats.currentStreak,
            gridStats.currentStreak
        );
        const maxStreak = Math.max(
            cipherStats.maxStreak,
            shiftStats.maxStreak,
            gridStats.maxStreak
        );

        // Get best times across difficulties for Cipher
        const cipherBestTimes = [
            cipherStats.easy.bestTime,
            cipherStats.medium.bestTime,
            cipherStats.hard.bestTime
        ].filter((t): t is number => t !== null);
        const cipherBestTime = cipherBestTimes.length > 0 ? Math.min(...cipherBestTimes) : null;

        // Get best moves for Shift (use easy as default display)
        const shiftBestMoves = shiftStats.bestMoves?.easy ?? null;

        const perGame: GameStat[] = [
            {
                name: 'Cipher',
                played: cipherPlayed,
                bestTime: cipherBestTime,
                color: '#538d4e',
            },
            {
                name: 'Shift',
                played: shiftStats.gamesPlayed,
                bestMoves: shiftBestMoves,
                color: '#10b981',
            },
            {
                name: 'Gridgram',
                played: gridStats.gamesPlayed,
                bestScore: gridStats.bestScore,
                color: '#6366f1',
            },
        ];

        return {
            totalGamesPlayed,
            totalGamesWon,
            currentStreak,
            maxStreak,
            perGame,
        };
    }, []);
}
