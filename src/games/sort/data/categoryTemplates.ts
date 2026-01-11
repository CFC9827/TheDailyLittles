/**
 * SORT Category Templates
 * 
 * Category definitions with word pools for puzzle generation.
 * Each category has a difficulty (1-4) and a pool of valid words.
 */

export interface CategoryTemplate {
    id: string;
    category: string;
    difficulty: 1 | 2 | 3 | 4;
    words: string[];
}

// ============================================================
// DIFFICULTY 1 — Straightforward, obvious connections
// ============================================================

export const SYNONYMS_HAPPY: CategoryTemplate = {
    id: 'synonyms_happy',
    category: 'Synonyms for happy',
    difficulty: 1,
    words: ['GLAD', 'JOYFUL', 'PLEASED', 'CHEERFUL', 'CONTENT', 'MERRY', 'ELATED', 'UPBEAT']
};

export const SYNONYMS_SAD: CategoryTemplate = {
    id: 'synonyms_sad',
    category: 'Synonyms for sad',
    difficulty: 1,
    words: ['GLOOMY', 'SOMBER', 'MELANCHOLY', 'DEJECTED', 'DOWNCAST', 'BLUE', 'GLUM', 'MOURNFUL']
};

export const SYNONYMS_FAST: CategoryTemplate = {
    id: 'synonyms_fast',
    category: 'Synonyms for fast',
    difficulty: 1,
    words: ['QUICK', 'RAPID', 'SWIFT', 'SPEEDY', 'BRISK', 'HASTY', 'FLEET', 'NIMBLE']
};

export const SYNONYMS_BIG: CategoryTemplate = {
    id: 'synonyms_big',
    category: 'Synonyms for big',
    difficulty: 1,
    words: ['LARGE', 'HUGE', 'VAST', 'GIANT', 'MASSIVE', 'ENORMOUS', 'IMMENSE', 'COLOSSAL']
};

export const SYNONYMS_SMALL: CategoryTemplate = {
    id: 'synonyms_small',
    category: 'Synonyms for small',
    difficulty: 1,
    words: ['TINY', 'LITTLE', 'MINI', 'PETITE', 'MINUTE', 'COMPACT', 'SLIGHT', 'WEE']
};

export const RHYMES_AKE: CategoryTemplate = {
    id: 'rhymes_ake',
    category: 'Rhymes with CAKE',
    difficulty: 1,
    words: ['LAKE', 'MAKE', 'STAKE', 'BRAKE', 'SHAKE', 'WAKE', 'BAKE', 'FAKE']
};

export const RHYMES_AY: CategoryTemplate = {
    id: 'rhymes_ay',
    category: 'Rhymes with DAY',
    difficulty: 1,
    words: ['WAY', 'SAY', 'PLAY', 'STAY', 'CLAY', 'GRAY', 'SWAY', 'PRAY']
};

export const RHYMES_OW: CategoryTemplate = {
    id: 'rhymes_ow',
    category: 'Rhymes with SHOW',
    difficulty: 1,
    words: ['FLOW', 'GLOW', 'GROW', 'KNOW', 'SLOW', 'SNOW', 'THROW', 'BLOW']
};

export const COLORS: CategoryTemplate = {
    id: 'colors',
    category: 'Colors',
    difficulty: 1,
    words: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'PURPLE', 'PINK', 'BROWN', 'BLACK', 'WHITE', 'GRAY', 'TEAL']
};

export const FRUITS: CategoryTemplate = {
    id: 'fruits',
    category: 'Fruits',
    difficulty: 1,
    words: ['APPLE', 'BANANA', 'CHERRY', 'GRAPE', 'LEMON', 'MANGO', 'ORANGE', 'PEACH', 'PEAR', 'PLUM', 'MELON', 'BERRY']
};

// ============================================================
// DIFFICULTY 2 — Requires a bit more thought
// ============================================================

export const COMPOUND_FIRE: CategoryTemplate = {
    id: 'compound_fire',
    category: '___FIRE or FIRE___',
    difficulty: 2,
    words: ['FIREMAN', 'FIREPLACE', 'FIREFLY', 'FIREWORK', 'CAMPFIRE', 'BONFIRE', 'WILDFIRE', 'GUNFIRE']
};

export const COMPOUND_WATER: CategoryTemplate = {
    id: 'compound_water',
    category: '___WATER or WATER___',
    difficulty: 2,
    words: ['WATERFALL', 'WATERMELON', 'UNDERWATER', 'RAINWATER', 'WATERPROOF', 'WATERTIGHT', 'WATERCOLOR', 'WATERSHED']
};

export const COMPOUND_BALL: CategoryTemplate = {
    id: 'compound_ball',
    category: '___BALL',
    difficulty: 2,
    words: ['FOOTBALL', 'BASKETBALL', 'BASEBALL', 'VOLLEYBALL', 'SNOWBALL', 'FIREBALL', 'EYEBALL', 'MEATBALL']
};

export const COMPOUND_BOOK: CategoryTemplate = {
    id: 'compound_book',
    category: '___BOOK or BOOK___',
    difficulty: 2,
    words: ['NOTEBOOK', 'TEXTBOOK', 'BOOKMARK', 'BOOKWORM', 'HANDBOOK', 'YEARBOOK', 'COOKBOOK', 'FACEBOOK']
};

export const COMPOUND_HOUSE: CategoryTemplate = {
    id: 'compound_house',
    category: '___HOUSE or HOUSE___',
    difficulty: 2,
    words: ['GREENHOUSE', 'LIGHTHOUSE', 'WAREHOUSE', 'FIREHOUSE', 'HOUSEHOLD', 'HOUSEBOAT', 'TREEHOUSE', 'PENTHOUSE']
};

export const DOUBLE_LETTERS: CategoryTemplate = {
    id: 'double_letters',
    category: 'Words with double letters',
    difficulty: 2,
    words: ['BOOK', 'COOL', 'KEEN', 'FLEE', 'PEER', 'BUZZ', 'JAZZ', 'FIZZ', 'ZOOM', 'BOOM', 'ROOM', 'MOON']
};

export const SILENT_LETTERS: CategoryTemplate = {
    id: 'silent_letters',
    category: 'Words with silent letters',
    difficulty: 2,
    words: ['KNIGHT', 'KNIFE', 'KNOCK', 'KNOW', 'GNOME', 'GNAT', 'WRECK', 'WRIST', 'WRITE', 'WRONG', 'LAMB', 'COMB']
};

export const BODY_PARTS: CategoryTemplate = {
    id: 'body_parts',
    category: 'Body parts',
    difficulty: 2,
    words: ['HAND', 'FOOT', 'HEAD', 'KNEE', 'ELBOW', 'WRIST', 'ANKLE', 'THUMB', 'CHEST', 'SPINE', 'BRAIN', 'HEART']
};

export const MUSICAL_INSTRUMENTS: CategoryTemplate = {
    id: 'musical_instruments',
    category: 'Musical instruments',
    difficulty: 2,
    words: ['PIANO', 'GUITAR', 'VIOLIN', 'DRUMS', 'FLUTE', 'TRUMPET', 'CELLO', 'HARP', 'BASS', 'HORN', 'ORGAN', 'BANJO']
};

export const WEATHER: CategoryTemplate = {
    id: 'weather',
    category: 'Weather words',
    difficulty: 2,
    words: ['RAIN', 'SNOW', 'WIND', 'STORM', 'CLOUD', 'SUNNY', 'FOGGY', 'HAIL', 'SLEET', 'FROST', 'HUMID', 'BREEZE']
};

// ============================================================
// DIFFICULTY 3 — Subtle patterns, requires insight
// ============================================================

export const HOMOPHONES_NUMBERS: CategoryTemplate = {
    id: 'homophones_numbers',
    category: 'Homophones of numbers',
    difficulty: 3,
    words: ['WON', 'TOO', 'ATE', 'FORE', 'SEW', 'SICKS', 'WAIT', 'KNIGHT']
};

export const WORDS_IN_WORDS: CategoryTemplate = {
    id: 'words_in_words',
    category: 'Words containing HAND',
    difficulty: 3,
    words: ['HANDLE', 'HANDED', 'HANDY', 'HANDSOME', 'HANDBALL', 'HANDMADE', 'HANDBOOK', 'HANDSHAKE']
};

export const STARTS_WITH_BODY: CategoryTemplate = {
    id: 'starts_with_body',
    category: 'Start with body part',
    difficulty: 3,
    words: ['HEADACHE', 'HEADLINE', 'HANDBOOK', 'FOOTSTEP', 'FOOTNOTE', 'ARMCHAIR', 'EYEBROW', 'LEGROOM']
};

export const GREEK_LETTERS: CategoryTemplate = {
    id: 'greek_letters',
    category: 'Greek letters',
    difficulty: 3,
    words: ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'THETA', 'SIGMA', 'OMEGA', 'KAPPA', 'LAMBDA', 'EPSILON', 'PI', 'PHI']
};

export const TYPES_OF_DANCE: CategoryTemplate = {
    id: 'types_of_dance',
    category: 'Types of dance',
    difficulty: 3,
    words: ['WALTZ', 'TANGO', 'SALSA', 'BALLET', 'SWING', 'DISCO', 'POLKA', 'FOXTROT', 'RUMBA', 'MAMBO', 'HIP HOP', 'TAP']
};

export const CARD_GAMES: CategoryTemplate = {
    id: 'card_games',
    category: 'Card games',
    difficulty: 3,
    words: ['POKER', 'BRIDGE', 'HEARTS', 'SPADES', 'RUMMY', 'BLACKJACK', 'SOLITAIRE', 'WAR', 'UNO', 'CANASTA', 'GIN', 'CRAZY EIGHTS']
};

export const PALINDROMES: CategoryTemplate = {
    id: 'palindromes',
    category: 'Palindromes',
    difficulty: 3,
    words: ['RADAR', 'LEVEL', 'CIVIC', 'KAYAK', 'REFER', 'MADAM', 'ROTOR', 'TENET', 'NOON', 'MOM', 'DAD', 'POP']
};

export const WORDS_WITH_Q: CategoryTemplate = {
    id: 'words_with_q',
    category: 'Words containing Q',
    difficulty: 3,
    words: ['QUEEN', 'QUEST', 'QUICK', 'QUOTE', 'QUILT', 'QUIET', 'SQUID', 'SQUAD', 'QUIT', 'QUIZ', 'QUAKE', 'SQUASH']
};

// ============================================================
// DIFFICULTY 4 — Tricky, misdirecting, requires lateral thinking
// ============================================================

export const ALSO_NAMES: CategoryTemplate = {
    id: 'also_names',
    category: 'Words that are also names',
    difficulty: 4,
    words: ['ROSE', 'VIOLET', 'DAISY', 'LILY', 'IRIS', 'FERN', 'CLIFF', 'FRANK', 'GRANT', 'BILL', 'MARK', 'PENNY']
};

export const ANAGRAMS_EACH_OTHER: CategoryTemplate = {
    id: 'anagrams_each_other',
    category: 'Anagrams of EARTH',
    difficulty: 4,
    words: ['HEART', 'HATER', 'RATHE']
};

export const SILENT_FIRST_LETTER: CategoryTemplate = {
    id: 'silent_first_letter',
    category: 'Silent first letter',
    difficulty: 4,
    words: ['KNIGHT', 'KNIFE', 'KNOCK', 'KNOW', 'GNOME', 'GNAT', 'WRONG', 'WRITE', 'WRAP', 'WRECK', 'WRIST', 'PSALM']
};

export const DOUBLE_MEANING: CategoryTemplate = {
    id: 'double_meaning',
    category: 'Words that are also verbs',
    difficulty: 4,
    words: ['WATCH', 'PLANT', 'PARK', 'LIGHT', 'MATCH', 'FILM', 'TRAIN', 'DUCK', 'NAIL', 'WAVE', 'SCALE', 'RING']
};

export const ENDS_IN_IGHT: CategoryTemplate = {
    id: 'ends_in_ight',
    category: 'End in -IGHT',
    difficulty: 4,
    words: ['LIGHT', 'NIGHT', 'RIGHT', 'SIGHT', 'MIGHT', 'FIGHT', 'TIGHT', 'BRIGHT', 'SLIGHT', 'FLIGHT', 'FRIGHT', 'HEIGHT']
};

export const THREE_VOWELS: CategoryTemplate = {
    id: 'three_vowels',
    category: 'Words with 3+ vowels',
    difficulty: 4,
    words: ['AUDIO', 'QUEUE', 'ADIEU', 'SEQUOIA', 'COOKIE', 'MOVIE', 'LOUIE', 'AVENUE', 'AMOEBA', 'IONAIRE', 'AWESOME', 'BANANA']
};

export const ANIMAL_VERBS: CategoryTemplate = {
    id: 'animal_verbs',
    category: 'Animals that are also verbs',
    difficulty: 4,
    words: ['DUCK', 'FISH', 'SNAKE', 'WEASEL', 'BADGER', 'HOUND', 'RAM', 'CROW', 'PARROT', 'APE', 'WOLF', 'BUFFALO']
};

export const FOOD_SLANG: CategoryTemplate = {
    id: 'food_slang',
    category: 'Foods used as slang',
    difficulty: 4,
    words: ['BREAD', 'CHEESE', 'BACON', 'BEEF', 'TOAST', 'JAM', 'PICKLE', 'BEANS', 'CREAM', 'SAUCE', 'GRAVY', 'NUTS']
};

// ============================================================
// ALL TEMPLATES ARRAY
// ============================================================

export const ALL_CATEGORY_TEMPLATES: CategoryTemplate[] = [
    // Difficulty 1
    SYNONYMS_HAPPY, SYNONYMS_SAD, SYNONYMS_FAST, SYNONYMS_BIG, SYNONYMS_SMALL,
    RHYMES_AKE, RHYMES_AY, RHYMES_OW, COLORS, FRUITS,
    // Difficulty 2
    COMPOUND_FIRE, COMPOUND_WATER, COMPOUND_BALL, COMPOUND_BOOK, COMPOUND_HOUSE,
    DOUBLE_LETTERS, SILENT_LETTERS, BODY_PARTS, MUSICAL_INSTRUMENTS, WEATHER,
    // Difficulty 3
    HOMOPHONES_NUMBERS, WORDS_IN_WORDS, STARTS_WITH_BODY, GREEK_LETTERS,
    TYPES_OF_DANCE, CARD_GAMES, PALINDROMES, WORDS_WITH_Q,
    // Difficulty 4
    ALSO_NAMES, SILENT_FIRST_LETTER, DOUBLE_MEANING, ENDS_IN_IGHT,
    THREE_VOWELS, ANIMAL_VERBS, FOOD_SLANG
];

/**
 * Get templates by difficulty
 */
export function getTemplatesByDifficulty(difficulty: 1 | 2 | 3 | 4): CategoryTemplate[] {
    return ALL_CATEGORY_TEMPLATES.filter(t => t.difficulty === difficulty);
}
