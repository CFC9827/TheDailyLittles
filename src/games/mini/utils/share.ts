/**
 * Mini Crossword Share
 * 
 * Generate spoiler-free share text
 */

interface ShareData {
    puzzleNumber: number;
    solveTime: number;
}

/**
 * Generate shareable result text
 */
export function generateShareText(data: ShareData): string {
    const { puzzleNumber, solveTime } = data;

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return [
        `The Daily Littles — Mini`,
        `Little #${puzzleNumber}`,
        '',
        `⏱ ${formatTime(solveTime)}`,
    ].join('\n');
}

/**
 * Share result
 */
export async function shareResult(data: ShareData): Promise<{ success: boolean; method: 'share' | 'copy' }> {
    const text = generateShareText(data);

    if (navigator.share) {
        try {
            await navigator.share({ text });
            return { success: true, method: 'share' };
        } catch (e) {
            // Fall through to clipboard
        }
    }

    try {
        await navigator.clipboard.writeText(text);
        return { success: true, method: 'copy' };
    } catch (e) {
        console.error('Failed to copy:', e);
        return { success: false, method: 'copy' };
    }
}
