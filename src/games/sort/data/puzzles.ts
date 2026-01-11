/**
 * SORT Puzzle Data
 * 
 * Daily grouping puzzles - 16 words sorted into 4 groups of 4
 * Categories are fair, non-trivia, discoverable through language knowledge
 */

export type Difficulty = 1 | 2 | 3 | 4;

export interface SortGroup {
    category: string;
    words: [string, string, string, string]; // Exactly 4 words
    difficulty: Difficulty; // 1 = easiest (yellow), 4 = hardest (purple)
}

export interface SortPuzzle {
    puzzleNumber: number;
    groups: [SortGroup, SortGroup, SortGroup, SortGroup]; // Exactly 4 groups
}

// Hand-crafted puzzles with fair, non-trivia categories
export const puzzles: SortPuzzle[] = [
    {
        puzzleNumber: 1,
        groups: [
            { category: "Synonyms for FAST", words: ["QUICK", "RAPID", "SWIFT", "SPEEDY"], difficulty: 1 },
            { category: "Words with double letters", words: ["COFFEE", "BALLOON", "TOFFEE", "BUFFALO"], difficulty: 2 },
            { category: "___LIGHT", words: ["DAY", "FLASH", "MOON", "SPOT"], difficulty: 3 },
            { category: "Rhymes with CAKE", words: ["LAKE", "BAKE", "STAKE", "FLAKE"], difficulty: 4 }
        ]
    },
    {
        puzzleNumber: 2,
        groups: [
            { category: "Things that are COLD", words: ["ICE", "SNOW", "FROST", "SLEET"], difficulty: 1 },
            { category: "Start with UN-", words: ["UNDO", "UNLOCK", "UNWIND", "UNFOLD"], difficulty: 2 },
            { category: "WATER___", words: ["FALL", "FRONT", "PROOF", "MELON"], difficulty: 3 },
            { category: "Homophones of numbers", words: ["WON", "TOO", "ATE", "FORE"], difficulty: 4 }
        ]
    },
    {
        puzzleNumber: 3,
        groups: [
            { category: "Body parts", words: ["HAND", "FOOT", "HEAD", "KNEE"], difficulty: 1 },
            { category: "End with -LY", words: ["QUICKLY", "SLOWLY", "KINDLY", "SOFTLY"], difficulty: 2 },
            { category: "BLACK___", words: ["BIRD", "BOARD", "SMITH", "BERRY"], difficulty: 3 },
            { category: "Can follow FIRE", words: ["TRUCK", "FLY", "PLACE", "WORK"], difficulty: 4 }
        ]
    },
    {
        puzzleNumber: 4,
        groups: [
            { category: "Colors", words: ["BLUE", "GREEN", "YELLOW", "ORANGE"], difficulty: 1 },
            { category: "Compound with HOUSE", words: ["DOG", "LIGHT", "GREEN", "WARE"], difficulty: 2 },
            { category: "Silent letters", words: ["KNIGHT", "GNOME", "WRITE", "DOUBT"], difficulty: 3 },
            { category: "Anagrams of POTS", words: ["SPOT", "STOP", "TOPS", "POST"], difficulty: 4 }
        ]
    },
    {
        puzzleNumber: 5,
        groups: [
            { category: "Kitchen items", words: ["SPOON", "FORK", "KNIFE", "PLATE"], difficulty: 1 },
            { category: "Rhymes with NIGHT", words: ["LIGHT", "SIGHT", "MIGHT", "FLIGHT"], difficulty: 2 },
            { category: "___BALL", words: ["BASE", "BASKET", "FOOT", "SNOW"], difficulty: 3 },
            { category: "Palindromes", words: ["RADAR", "LEVEL", "CIVIC", "KAYAK"], difficulty: 4 }
        ]
    },
    {
        puzzleNumber: 6,
        groups: [
            { category: "Weather phenomena", words: ["RAIN", "WIND", "STORM", "CLOUD"], difficulty: 1 },
            { category: "Start with RE-", words: ["REDO", "RETURN", "REPLAY", "REWIND"], difficulty: 2 },
            { category: "SUN___", words: ["RISE", "SET", "BURN", "FLOWER"], difficulty: 3 },
            { category: "Silent K", words: ["KNEE", "KNIFE", "KNOCK", "KNOW"], difficulty: 4 }
        ]
    },
    {
        puzzleNumber: 7,
        groups: [
            { category: "Fruits", words: ["APPLE", "GRAPE", "PEACH", "MANGO"], difficulty: 1 },
            { category: "End with -TION", words: ["NATION", "MOTION", "POTION", "ACTION"], difficulty: 2 },
            { category: "BOOK___", words: ["WORM", "CASE", "MARK", "SHELF"], difficulty: 3 },
            { category: "Words spelled same forwards/backwards", words: ["NOON", "DEED", "PEEP", "TOOT"], difficulty: 4 }
        ]
    },
    {
        puzzleNumber: 8,
        groups: [
            { category: "Emotions", words: ["HAPPY", "ANGRY", "SCARED", "PROUD"], difficulty: 1 },
            { category: "Start with OUT-", words: ["OUTSIDE", "OUTRUN", "OUTLAST", "OUTLOOK"], difficulty: 2 },
            { category: "___HAND", words: ["BACK", "SHORT", "FIRST", "FREE"], difficulty: 3 },
            { category: "Contain all vowels A,E,I,O,U...", words: ["SEQUOIA", "EQUATION", "AUTHORIZE", "FACETIOUS"], difficulty: 4 }
        ]
    },
    {
        puzzleNumber: 9,
        groups: [
            { category: "Musical instruments", words: ["PIANO", "GUITAR", "VIOLIN", "DRUMS"], difficulty: 1 },
            { category: "Words with QU", words: ["QUEEN", "QUIET", "QUEST", "QUICK"], difficulty: 2 },
            { category: "AIR___", words: ["PORT", "PLANE", "LINE", "CRAFT"], difficulty: 3 },
            { category: "Heteronyms (same spelling, different pronunciation)", words: ["LEAD", "WIND", "TEAR", "BOW"], difficulty: 4 }
        ]
    },
    {
        puzzleNumber: 10,
        groups: [
            { category: "Animals with tails", words: ["DOG", "CAT", "HORSE", "MOUSE"], difficulty: 1 },
            { category: "End with -NESS", words: ["KINDNESS", "DARKNESS", "SADNESS", "MADNESS"], difficulty: 2 },
            { category: "TOOTH___", words: ["BRUSH", "PASTE", "PICK", "ACHE"], difficulty: 3 },
            { category: "Words where Y sounds like I", words: ["GYM", "MYTH", "HYMN", "LYNX"], difficulty: 4 }
        ]
    },
    {
        puzzleNumber: 11,
        groups: [
            { category: "Things in a classroom", words: ["DESK", "CHAIR", "BOARD", "PENCIL"], difficulty: 1 },
            { category: "Start with PRE-", words: ["PREFIX", "PREVIEW", "PREDICT", "PREPARE"], difficulty: 2 },
            { category: "FIRE___", words: ["FIGHTER", "PLACE", "WORKS", "FLY"], difficulty: 3 },
            { category: "One-syllable past tenses", words: ["RAN", "SAW", "WENT", "THOUGHT"], difficulty: 4 }
        ]
    },
    {
        puzzleNumber: 12,
        groups: [
            { category: "Types of trees", words: ["OAK", "PINE", "MAPLE", "BIRCH"], difficulty: 1 },
            { category: "Words with PH making F sound", words: ["PHONE", "PHOTO", "GRAPH", "SPHERE"], difficulty: 2 },
            { category: "HEAD___", words: ["LINE", "PHONE", "LIGHT", "ACHE"], difficulty: 3 },
            { category: "Words that lose a letter when pluralized", words: ["GOOSE", "MOUSE", "LOUSE", "TOOTH"], difficulty: 4 }
        ]
    },
    {
        puzzleNumber: 13,
        groups: [
            { category: "Vegetables", words: ["CARROT", "POTATO", "ONION", "PEPPER"], difficulty: 1 },
            { category: "End with -FUL", words: ["HELPFUL", "CAREFUL", "HOPEFUL", "HANDFUL"], difficulty: 2 },
            { category: "BACK___", words: ["YARD", "PACK", "BONE", "GROUND"], difficulty: 3 },
            { category: "Words where C sounds like S", words: ["CELL", "CITY", "CYCLE", "CIDER"], difficulty: 4 }
        ]
    },
    {
        puzzleNumber: 14,
        groups: [
            { category: "Office supplies", words: ["STAPLER", "PAPER", "TAPE", "CLIP"], difficulty: 1 },
            { category: "Start with MIS-", words: ["MISTAKE", "MISREAD", "MISLEAD", "MISFIRE"], difficulty: 2 },
            { category: "SEA___", words: ["SHORE", "FOOD", "SHELL", "WEED"], difficulty: 3 },
            { category: "Words with silent B", words: ["CLIMB", "THUMB", "LAMB", "COMB"], difficulty: 4 }
        ]
    },
    {
        puzzleNumber: 15,
        groups: [
            { category: "Tools", words: ["HAMMER", "WRENCH", "DRILL", "PLIERS"], difficulty: 1 },
            { category: "Words with double O", words: ["MOON", "BOOK", "FOOD", "COOL"], difficulty: 2 },
            { category: "RAIN___", words: ["BOW", "DROP", "COAT", "FOREST"], difficulty: 3 },
            { category: "Words ending in -GH that sounds like F", words: ["COUGH", "TOUGH", "ROUGH", "ENOUGH"], difficulty: 4 }
        ]
    }
];

/**
 * Get a puzzle by number
 */
export function getPuzzle(puzzleNumber: number): SortPuzzle | undefined {
    return puzzles.find(p => p.puzzleNumber === puzzleNumber);
}

/**
 * Get daily puzzle based on date
 * Cycles through hand-crafted puzzles with correct puzzle number
 */
export function getDailyPuzzle(date: Date = new Date()): SortPuzzle {
    const puzzleNumber = getPuzzleNumber(date);
    const index = ((puzzleNumber - 1) % puzzles.length + puzzles.length) % puzzles.length;

    return {
        ...puzzles[index],
        puzzleNumber
    };
}

/**
 * Get all words from a puzzle in shuffled order
 */
export function getShuffledWords(puzzle: SortPuzzle, seed: number): string[] {
    const allWords = puzzle.groups.flatMap(g => g.words);

    // Seeded shuffle
    const shuffled = [...allWords];
    let s = seed;
    for (let i = shuffled.length - 1; i > 0; i--) {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        const j = s % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

/**
 * Check if 4 words form a valid group
 */
export function checkGuess(puzzle: SortPuzzle, guess: string[]): SortGroup | null {
    if (guess.length !== 4) return null;

    const guessSet = new Set(guess.map(w => w.toUpperCase()));

    for (const group of puzzle.groups) {
        const groupSet = new Set(group.words.map(w => w.toUpperCase()));

        // Check if all 4 guessed words match this group exactly
        if (guessSet.size === groupSet.size &&
            [...guessSet].every(w => groupSet.has(w))) {
            return group;
        }
    }

    return null;
}

/**
 * Calculate puzzle number (days since epoch)
 */
export function getPuzzleNumber(date: Date = new Date()): number {
    const epoch = new Date('2026-01-11');
    return Math.floor((date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}
