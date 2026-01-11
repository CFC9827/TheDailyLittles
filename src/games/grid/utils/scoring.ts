/**
 * Scoring system for GRID game
 */

export interface ScoreResult {
    totalScore: number;
    wordScores: { word: string; score: number }[];
    longestWord: string;
    wordCount: number;
    bonuses: { type: string; amount: number }[];
}

export function calculateScore(words: string[]): ScoreResult {
    if (words.length === 0) {
        return {
            totalScore: 0,
            wordScores: [],
            longestWord: '',
            wordCount: 0,
            bonuses: [],
        };
    }

    const wordScores: { word: string; score: number }[] = [];
    const bonuses: { type: string; amount: number }[] = [];

    // Calculate word scores
    for (const word of words) {
        let score = word.length * 10; // Base: 10 points per letter

        // Length bonuses
        if (word.length >= 5) score += 20;
        if (word.length >= 6) score += 30;
        if (word.length >= 7) score += 50;

        wordScores.push({ word, score });
    }

    // Find longest word
    const longestWord = words.reduce((a, b) => a.length >= b.length ? a : b, '');

    // Efficiency bonus (fewer words is better)
    if (words.length <= 3) {
        bonuses.push({ type: 'Efficiency', amount: 50 });
    } else if (words.length <= 4) {
        bonuses.push({ type: 'Efficiency', amount: 25 });
    }

    // Longest word bonus
    if (longestWord.length >= 6) {
        bonuses.push({ type: 'Long Word', amount: 30 });
    }

    // Calculate total
    const wordTotal = wordScores.reduce((sum, ws) => sum + ws.score, 0);
    const bonusTotal = bonuses.reduce((sum, b) => sum + b.amount, 0);

    return {
        totalScore: wordTotal + bonusTotal,
        wordScores,
        longestWord,
        wordCount: words.length,
        bonuses,
    };
}
