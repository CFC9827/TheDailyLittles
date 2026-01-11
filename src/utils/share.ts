/**
 * Share Utilities
 * 
 * Generate and copy shareable result text
 */

import type { Difficulty } from '../data/phrases';
import { calculateStarsEarned } from './storage';

export interface ShareData {
    puzzleNumber: number;
    difficulty: Difficulty;
    timeElapsed: number;
    streak: number;
}

/**
 * Generate share text for the result
 */
export function generateShareText(data: ShareData): string {
    const { puzzleNumber, difficulty, timeElapsed, streak } = data;

    const formatTime = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const stars = calculateStarsEarned(difficulty, timeElapsed);
    const starEmojis = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

    let text = `The Daily Littles — Cipher\nLittle #${puzzleNumber}\n`;
    text += `${starEmojis}\n`;
    text += `⏱️ ${formatTime(timeElapsed)}`;

    if (streak > 1) {
        text += ` • 🔥 ${streak} day streak`;
    }

    text += `\n\nhttps://cipher.game`;

    return text;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand('copy');
            textArea.remove();
            return success;
        }
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}

/**
 * Share using Web Share API if available, otherwise copy to clipboard
 */
export async function shareResult(data: ShareData): Promise<{ success: boolean; method: 'share' | 'copy' }> {
    const text = generateShareText(data);

    // Try Web Share API first (mobile)
    if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        try {
            await navigator.share({
                title: 'CIPHER',
                text: text,
            });
            return { success: true, method: 'share' };
        } catch (error) {
            // User cancelled or share failed, fall back to clipboard
            if ((error as Error).name === 'AbortError') {
                return { success: false, method: 'share' };
            }
        }
    }

    // Fallback to clipboard
    const copied = await copyToClipboard(text);
    return { success: copied, method: 'copy' };
}
