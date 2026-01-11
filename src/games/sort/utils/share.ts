/**
 * SORT Share Functionality
 * 
 * Generate spoiler-free share text for results
 */

import type { SolvedGroup } from '../hooks/useSort';

interface ShareData {
    puzzleNumber: number;
    solvedGroups: SolvedGroup[];
    mistakes: number;
    elapsedTime: number;
    won: boolean;
}

// Emoji colors by difficulty (matching NYT Connections)
const DIFFICULTY_EMOJI: Record<number, string> = {
    1: '🟨', // Yellow - easiest
    2: '🟩', // Green
    3: '🟦', // Blue
    4: '🟪', // Purple - hardest
};

/**
 * Generate shareable result text
 */
export function generateShareText(data: ShareData): string {
    const { puzzleNumber, solvedGroups, mistakes, won } = data;

    // Sort groups by the order they were solved
    const sortedGroups = [...solvedGroups].sort((a, b) => a.solvedOrder - b.solvedOrder);

    // Generate emoji grid (4 rows of 4 emojis)
    const emojiGrid = sortedGroups
        .map(group => DIFFICULTY_EMOJI[group.difficulty].repeat(4))
        .join('\n');

    const statusEmoji = won ? '✅' : '❌';
    const mistakeText = mistakes === 0 ? 'Perfect! 🎯' : `${mistakes}/4 mistakes`;

    return [
        `The Daily Littles — Sort`,
        `Little #${puzzleNumber} ${statusEmoji}`,
        '',
        emojiGrid,
        '',
        mistakeText,
    ].join('\n');
}

/**
 * Share result to clipboard or share API
 */
export async function shareResult(data: ShareData): Promise<{ success: boolean; method: 'share' | 'copy' }> {
    const text = generateShareText(data);

    if (navigator.share) {
        try {
            await navigator.share({ text });
            return { success: true, method: 'share' };
        } catch (e) {
            // User cancelled or error - fall through to clipboard
        }
    }

    try {
        await navigator.clipboard.writeText(text);
        return { success: true, method: 'copy' };
    } catch (e) {
        console.error('Failed to copy to clipboard:', e);
        return { success: false, method: 'copy' };
    }
}
