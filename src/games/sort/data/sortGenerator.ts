/**
 * SORT Puzzle Generator
 * 
 * Generates valid SORT puzzles by selecting 4 categories with no word overlaps.
 * Each puzzle has one category per difficulty level (1-4).
 */

import {
    getTemplatesByDifficulty,
    type CategoryTemplate
} from './categoryTemplates';

// Define own types to avoid circular dependency
type Difficulty = 1 | 2 | 3 | 4;

interface GeneratedGroup {
    category: string;
    words: [string, string, string, string];
    difficulty: Difficulty;
}

interface GeneratedPuzzle {
    puzzleNumber: number;
    groups: [GeneratedGroup, GeneratedGroup, GeneratedGroup, GeneratedGroup];
}

// Seeded random for deterministic generation
function seededRandom(seed: number): () => number {
    return () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
    };
}

// Shuffle array using seeded random
function shuffle<T>(array: T[], random: () => number): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Select 4 words from a category that don't exist in usedWords
 */
function selectWordsFromCategory(
    template: CategoryTemplate,
    usedWords: Set<string>,
    random: () => number
): [string, string, string, string] | null {
    const availableWords = template.words.filter(w => !usedWords.has(w.toUpperCase()));

    if (availableWords.length < 4) {
        return null; // Not enough unique words
    }

    const shuffled = shuffle(availableWords, random);
    const selected = shuffled.slice(0, 4).map(w => w.toUpperCase());
    return [selected[0], selected[1], selected[2], selected[3]];
}

/**
 * Generate a puzzle with one category from each difficulty level
 */
export function generatePuzzle(seed: number): GeneratedPuzzle | null {
    const random = seededRandom(seed);

    const selectedCategories: CategoryTemplate[] = [];
    const usedWords = new Set<string>();
    const groups: GeneratedGroup[] = [];

    // Select one category from each difficulty (1, 2, 3, 4)
    for (let difficulty = 1; difficulty <= 4; difficulty++) {
        const templates = getTemplatesByDifficulty(difficulty as Difficulty);
        const shuffledTemplates = shuffle(templates, random);

        let found = false;
        for (const template of shuffledTemplates) {
            // Skip if we already used this category
            if (selectedCategories.some(c => c.id === template.id)) continue;

            const words = selectWordsFromCategory(template, usedWords, random);
            if (words) {
                selectedCategories.push(template);
                words.forEach(w => usedWords.add(w));

                groups.push({
                    category: template.category,
                    words: words,
                    difficulty: difficulty as Difficulty
                });

                found = true;
                break;
            }
        }

        if (!found) {
            // Couldn't find a valid category for this difficulty
            return null;
        }
    }

    if (groups.length !== 4) return null;

    return {
        puzzleNumber: 0, // Will be set by caller
        groups: [groups[0], groups[1], groups[2], groups[3]]
    };
}

/**
 * Generate puzzle for a specific date
 */
export function generateDailyPuzzle(date: Date = new Date()): GeneratedPuzzle {
    const epoch = new Date('2026-01-11');
    const daysSinceEpoch = Math.floor((date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
    const puzzleNumber = daysSinceEpoch + 1;

    // Try multiple seeds until we get a valid puzzle
    for (let attempt = 0; attempt < 100; attempt++) {
        const seed = puzzleNumber * 1000 + attempt;
        const puzzle = generatePuzzle(seed);

        if (puzzle) {
            return {
                ...puzzle,
                puzzleNumber
            };
        }
    }

    // Fallback puzzle
    console.warn('Failed to generate puzzle, using fallback');
    return {
        puzzleNumber,
        groups: [
            { category: 'Colors', words: ['RED', 'BLUE', 'GREEN', 'YELLOW'], difficulty: 1 },
            { category: 'Fruits', words: ['APPLE', 'BANANA', 'CHERRY', 'GRAPE'], difficulty: 2 },
            { category: 'Body parts', words: ['HAND', 'FOOT', 'HEAD', 'KNEE'], difficulty: 3 },
            { category: 'Also names', words: ['ROSE', 'VIOLET', 'LILY', 'IRIS'], difficulty: 4 }
        ]
    };
}

/**
 * Generate N puzzles for pre-validation
 */
export function generatePuzzleBatch(count: number, startSeed: number = 1): GeneratedPuzzle[] {
    const puzzles: GeneratedPuzzle[] = [];

    for (let i = 0; i < count; i++) {
        const seed = startSeed + i * 1000;
        const puzzle = generatePuzzle(seed);

        if (puzzle) {
            puzzles.push({
                ...puzzle,
                puzzleNumber: i + 1
            });
        }
    }

    return puzzles;
}

/**
 * Validate that a puzzle has no overlapping words between categories
 */
export function validatePuzzle(puzzle: GeneratedPuzzle): boolean {
    const allWords = new Set<string>();

    for (const group of puzzle.groups) {
        for (const word of group.words) {
            if (allWords.has(word)) {
                return false; // Duplicate word
            }
            allWords.add(word);
        }
    }

    return puzzle.groups.length === 4 && allWords.size === 16;
}
