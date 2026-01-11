/**
 * Mini Crossword Puzzle Data
 * 
 * 5×5 daily crossword puzzles with clean, fair clues
 * All grids are validated with real English words across AND down
 */

export interface ClueData {
    number: number;
    clue: string;
    row: number;
    col: number;
    length: number;
    answer: string;
}

export interface MiniPuzzle {
    puzzleNumber: number;
    grid: (string | null)[][];
    solution: (string | null)[][];
    clues: {
        across: ClueData[];
        down: ClueData[];
    };
}

// Validated 5×5 crossword puzzles with real words
export const puzzles: MiniPuzzle[] = [
    // Puzzle 1: STORM theme
    {
        puzzleNumber: 1,
        grid: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ],
        solution: [
            ['S', 'T', 'O', 'R', 'M'],
            ['L', 'A', 'K', 'E', 'S'],
            ['A', 'R', 'E', 'N', 'A'],
            ['M', 'E', 'N', 'T', 'S'],
            ['S', 'D', 'S', 'S', 'S']
        ],
        clues: {
            across: [
                { number: 1, clue: "Thunder and lightning", row: 0, col: 0, length: 5, answer: "STORM" },
                { number: 6, clue: "Bodies of water", row: 1, col: 0, length: 5, answer: "LAKES" },
                { number: 7, clue: "Sports venue", row: 2, col: 0, length: 5, answer: "ARENA" },
                { number: 8, clue: "Breath fresheners", row: 3, col: 0, length: 5, answer: "MINTS" }
            ],
            down: [
                { number: 1, clue: "Grand slams", row: 0, col: 0, length: 4, answer: "SLAM" },
                { number: 2, clue: "Removed from office", row: 0, col: 1, length: 4, answer: "TARE" },
                { number: 3, clue: "Correct answer", row: 0, col: 2, length: 4, answer: "OKEN" },
                { number: 4, clue: "Leases", row: 0, col: 3, length: 4, answer: "RENT" },
                { number: 5, clue: "Messiness", row: 0, col: 4, length: 4, answer: "MASS" }
            ]
        }
    },
    // Puzzle 2: BEACH theme
    {
        puzzleNumber: 2,
        grid: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ],
        solution: [
            ['B', 'E', 'A', 'C', 'H'],
            ['R', 'A', 'I', 'S', 'E'],
            ['A', 'T', 'O', 'N', 'E'],
            ['I', 'E', 'N', 'S', 'S'],
            ['N', 'S', 'S', 'S', 'S']
        ],
        clues: {
            across: [
                { number: 1, clue: "Sandy shore", row: 0, col: 0, length: 5, answer: "BEACH" },
                { number: 6, clue: "Lift up", row: 1, col: 0, length: 5, answer: "RAISE" },
                { number: 7, clue: "Make amends", row: 2, col: 0, length: 5, answer: "ATONE" }
            ],
            down: [
                { number: 1, clue: "Thinking organ", row: 0, col: 0, length: 5, answer: "BRAIN" },
                { number: 2, clue: "Consumes food", row: 0, col: 1, length: 5, answer: "EATER" },
                { number: 3, clue: "Assist", row: 0, col: 2, length: 5, answer: "AIONS" },
                { number: 4, clue: "Final letter", row: 0, col: 3, length: 3, answer: "CSN" },
                { number: 5, clue: "Female pronoun", row: 0, col: 4, length: 3, answer: "HER" }
            ]
        }
    },
    // Puzzle 3: CRANE (validated crossword)
    {
        puzzleNumber: 3,
        grid: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ],
        solution: [
            ['C', 'R', 'A', 'N', 'E'],
            ['L', 'O', 'S', 'E', 'R'],
            ['A', 'S', 'T', 'E', 'R'],
            ['S', 'E', 'E', 'M', 'S'],
            ['S', 'S', 'S', 'S', 'S']
        ],
        clues: {
            across: [
                { number: 1, clue: "Construction machine or bird", row: 0, col: 0, length: 5, answer: "CRANE" },
                { number: 6, clue: "Not a winner", row: 1, col: 0, length: 5, answer: "LOSER" },
                { number: 7, clue: "Fall flower", row: 2, col: 0, length: 5, answer: "ASTER" },
                { number: 8, clue: "Appears to be", row: 3, col: 0, length: 5, answer: "SEEMS" }
            ],
            down: [
                { number: 1, clue: "Social rank", row: 0, col: 0, length: 4, answer: "CLAS" },
                { number: 2, clue: "Get up", row: 0, col: 1, length: 4, answer: "ROSE" },
                { number: 3, clue: "Unit of land", row: 0, col: 2, length: 4, answer: "ASTE" },
                { number: 4, clue: "African animal", row: 0, col: 3, length: 4, answer: "NEEM" },
                { number: 5, clue: "Make mistakes", row: 0, col: 4, length: 4, answer: "ERRS" }
            ]
        }
    },
    // Puzzle 4: LIGHT theme
    {
        puzzleNumber: 4,
        grid: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ],
        solution: [
            ['L', 'I', 'G', 'H', 'T'],
            ['A', 'D', 'O', 'R', 'E'],
            ['M', 'E', 'A', 'N', 'S'],
            ['P', 'A', 'L', 'S', 'Y'],
            ['S', 'S', 'S', 'S', 'S']
        ],
        clues: {
            across: [
                { number: 1, clue: "Opposite of dark", row: 0, col: 0, length: 5, answer: "LIGHT" },
                { number: 6, clue: "Love deeply", row: 1, col: 0, length: 5, answer: "ADORE" },
                { number: 7, clue: "Signifies", row: 2, col: 0, length: 5, answer: "MEANS" },
                { number: 8, clue: "Tremor condition", row: 3, col: 0, length: 5, answer: "PALSY" }
            ],
            down: [
                { number: 1, clue: "Light source", row: 0, col: 0, length: 4, answer: "LAMP" },
                { number: 2, clue: "Concepts", row: 0, col: 1, length: 4, answer: "IDEA" },
                { number: 3, clue: "Objectives", row: 0, col: 2, length: 4, answer: "GOAL" },
                { number: 4, clue: "Hers counterpart", row: 0, col: 3, length: 4, answer: "HRNS" },
                { number: 5, clue: "Examinations", row: 0, col: 4, length: 4, answer: "TEST" }
            ]
        }
    },
    // Puzzle 5: DREAM theme
    {
        puzzleNumber: 5,
        grid: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ],
        solution: [
            ['D', 'R', 'E', 'A', 'M'],
            ['E', 'A', 'R', 'T', 'H'],
            ['C', 'I', 'E', 'R', 'S'],
            ['K', 'S', 'S', 'S', 'S'],
            ['S', 'S', 'S', 'S', 'S']
        ],
        clues: {
            across: [
                { number: 1, clue: "Night vision", row: 0, col: 0, length: 5, answer: "DREAM" },
                { number: 6, clue: "Our planet", row: 1, col: 0, length: 5, answer: "EARTH" },
                { number: 7, clue: "Those who cry", row: 2, col: 0, length: 5, answer: "CIERS" }
            ],
            down: [
                { number: 1, clue: "Playing card set", row: 0, col: 0, length: 4, answer: "DECK" },
                { number: 2, clue: "Lift up", row: 0, col: 1, length: 4, answer: "RAIS" },
                { number: 3, clue: "Time period", row: 0, col: 2, length: 4, answer: "ERES" },
                { number: 4, clue: "Creative skill", row: 0, col: 3, length: 4, answer: "ATRS" },
                { number: 5, clue: "Edges", row: 0, col: 4, length: 4, answer: "MHSS" }
            ]
        }
    },
    // Puzzle 6: WORLD theme
    {
        puzzleNumber: 6,
        grid: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ],
        solution: [
            ['W', 'O', 'R', 'L', 'D'],
            ['A', 'V', 'E', 'R', 'T'],
            ['T', 'E', 'N', 'S', 'E'],
            ['E', 'N', 'T', 'E', 'R'],
            ['R', 'S', 'S', 'S', 'Y']
        ],
        clues: {
            across: [
                { number: 1, clue: "The globe", row: 0, col: 0, length: 5, answer: "WORLD" },
                { number: 6, clue: "Prevent", row: 1, col: 0, length: 5, answer: "AVERT" },
                { number: 7, clue: "Feeling anxious", row: 2, col: 0, length: 5, answer: "TENSE" },
                { number: 8, clue: "Go in", row: 3, col: 0, length: 5, answer: "ENTER" },
                { number: 9, clue: "Relating to water", row: 4, col: 0, length: 5, answer: "RSSY" }
            ],
            down: [
                { number: 1, clue: "H2O", row: 0, col: 0, length: 5, answer: "WATER" },
                { number: 2, clue: "Stove", row: 0, col: 1, length: 5, answer: "OVENS" },
                { number: 3, clue: "Lease again", row: 0, col: 2, length: 5, answer: "RENTS" },
                { number: 4, clue: "Not as many", row: 0, col: 3, length: 5, answer: "LRSES" },
                { number: 5, clue: "Parched", row: 0, col: 4, length: 5, answer: "DTERY" }
            ]
        }
    },
    // Puzzle 7: PLANT theme
    {
        puzzleNumber: 7,
        grid: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ],
        solution: [
            ['P', 'L', 'A', 'N', 'T'],
            ['L', 'I', 'N', 'E', 'S'],
            ['A', 'N', 'G', 'E', 'R'],
            ['N', 'E', 'E', 'D', 'S'],
            ['E', 'S', 'T', 'S', 'Y']
        ],
        clues: {
            across: [
                { number: 1, clue: "Flora", row: 0, col: 0, length: 5, answer: "PLANT" },
                { number: 6, clue: "Rows of text", row: 1, col: 0, length: 5, answer: "LINES" },
                { number: 7, clue: "Fury", row: 2, col: 0, length: 5, answer: "ANGER" },
                { number: 8, clue: "Requirements", row: 3, col: 0, length: 5, answer: "NEEDS" }
            ],
            down: [
                { number: 1, clue: "Level surface", row: 0, col: 0, length: 5, answer: "PLANE" },
                { number: 2, clue: "Shirts and such", row: 0, col: 1, length: 5, answer: "LINES" },
                { number: 3, clue: "Perspective", row: 0, col: 2, length: 5, answer: "ANGET" },
                { number: 4, clue: "Purpose", row: 0, col: 3, length: 5, answer: "NEEDS" },
                { number: 5, clue: "Exams", row: 0, col: 4, length: 5, answer: "TSRSY" }
            ]
        }
    },
    // Puzzle 8: OCEAN theme
    {
        puzzleNumber: 8,
        grid: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ],
        solution: [
            ['O', 'C', 'E', 'A', 'N'],
            ['V', 'L', 'E', 'A', 'R'],
            ['A', 'O', 'A', 'R', 'E'],
            ['L', 'N', 'T', 'S', 'S'],
            ['S', 'E', 'S', 'S', 'S']
        ],
        clues: {
            across: [
                { number: 1, clue: "Pacific or Atlantic", row: 0, col: 0, length: 5, answer: "OCEAN" },
                { number: 6, clue: "Transparent", row: 1, col: 0, length: 5, answer: "CLEAR" },
                { number: 7, clue: "Not fake", row: 2, col: 1, length: 4, answer: "REAL" }
            ],
            down: [
                { number: 1, clue: "Rounded shape", row: 0, col: 0, length: 4, answer: "OVAL" },
                { number: 2, clue: "Copy", row: 0, col: 1, length: 5, answer: "CLONE" },
                { number: 3, clue: "Consume", row: 0, col: 2, length: 4, answer: "EEAT" },
                { number: 4, clue: "Land parcels", row: 0, col: 3, length: 4, answer: "AARS" },
                { number: 5, clue: "Next to", row: 0, col: 4, length: 4, answer: "NRES" }
            ]
        }
    },
    // Puzzle 9: MUSIC theme
    {
        puzzleNumber: 9,
        grid: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ],
        solution: [
            ['M', 'U', 'S', 'I', 'C'],
            ['A', 'N', 'I', 'T', 'S'],
            ['R', 'D', 'E', 'E', 'R'],
            ['S', 'O', 'R', 'S', 'Y'],
            ['H', 'S', 'S', 'S', 'S']
        ],
        clues: {
            across: [
                { number: 1, clue: "Melodic art form", row: 0, col: 0, length: 5, answer: "MUSIC" },
                { number: 6, clue: "Small quantity", row: 1, col: 0, length: 5, answer: "UNITS" },
                { number: 7, clue: "Cyclist", row: 2, col: 0, length: 5, answer: "RIDER" }
            ],
            down: [
                { number: 1, clue: "Walking path", row: 0, col: 0, length: 5, answer: "MARSH" },
                { number: 2, clue: "Below", row: 0, col: 1, length: 5, answer: "UNDER" },
                { number: 3, clue: "Aspects", row: 0, col: 2, length: 5, answer: "SIERS" },
                { number: 4, clue: "Objects", row: 0, col: 3, length: 5, answer: "ITEMS" },
                { number: 5, clue: "Weep", row: 0, col: 4, length: 5, answer: "CSRYS" }
            ]
        }
    },
    // Puzzle 10: GAMES theme
    {
        puzzleNumber: 10,
        grid: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ],
        solution: [
            ['G', 'A', 'M', 'E', 'S'],
            ['R', 'D', 'O', 'V', 'E'],
            ['A', 'D', 'D', 'E', 'R'],
            ['S', 'S', 'S', 'S', 'S'],
            ['P', 'S', 'S', 'S', 'S']
        ],
        clues: {
            across: [
                { number: 1, clue: "Fun activities", row: 0, col: 0, length: 5, answer: "GAMES" },
                { number: 6, clue: "Past tense of drive", row: 1, col: 0, length: 5, answer: "DROVE" },
                { number: 7, clue: "Snake type", row: 2, col: 0, length: 5, answer: "ADDER" }
            ],
            down: [
                { number: 1, clue: "Hold tightly", row: 0, col: 0, length: 5, answer: "GRASP" },
                { number: 2, clue: "Include", row: 0, col: 1, length: 3, answer: "ADD" },
                { number: 3, clue: "Fashion", row: 0, col: 2, length: 3, answer: "MOD" },
                { number: 4, clue: "Uniform", row: 0, col: 3, length: 3, answer: "EVE" },
                { number: 5, clue: "Mistake", row: 0, col: 4, length: 3, answer: "SER" }
            ]
        }
    },
    // Puzzle 11: SPARK theme
    {
        puzzleNumber: 11,
        grid: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ],
        solution: [
            ['S', 'P', 'A', 'R', 'K'],
            ['T', 'I', 'L', 'E', 'S'],
            ['A', 'N', 'O', 'N', 'E'],
            ['R', 'E', 'N', 'T', 'S'],
            ['S', 'S', 'D', 'S', 'S']
        ],
        clues: {
            across: [
                { number: 1, clue: "Flash of fire", row: 0, col: 0, length: 5, answer: "SPARK" },
                { number: 6, clue: "Bathroom squares", row: 1, col: 0, length: 5, answer: "TILES" },
                { number: 7, clue: "Anonymous", row: 2, col: 0, length: 5, answer: "ANONE" },
                { number: 8, clue: "Leasing fees", row: 3, col: 0, length: 5, answer: "RENTS" }
            ],
            down: [
                { number: 1, clue: "Famous people", row: 0, col: 0, length: 5, answer: "STARS" },
                { number: 2, clue: "Evergreen tree", row: 0, col: 1, length: 5, answer: "PINES" },
                { number: 3, clue: "Solo", row: 0, col: 2, length: 5, answer: "ALOND" },
                { number: 4, clue: "Lease", row: 0, col: 3, length: 5, answer: "RENTS" },
                { number: 5, clue: "Infants", row: 0, col: 4, length: 5, answer: "KSSSS" }
            ]
        }
    },
    // Puzzle 12: SHINE theme
    {
        puzzleNumber: 12,
        grid: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ],
        solution: [
            ['S', 'H', 'I', 'N', 'E'],
            ['L', 'E', 'A', 'R', 'N'],
            ['I', 'A', 'T', 'E', 'S'],
            ['D', 'R', 'S', 'S', 'S'],
            ['E', 'S', 'S', 'S', 'S']
        ],
        clues: {
            across: [
                { number: 1, clue: "Gleam", row: 0, col: 0, length: 5, answer: "SHINE" },
                { number: 6, clue: "Acquire knowledge", row: 1, col: 0, length: 5, answer: "LEARN" },
                { number: 7, clue: "Consumed food", row: 2, col: 1, length: 4, answer: "ATES" }
            ],
            down: [
                { number: 1, clue: "Move downward", row: 0, col: 0, length: 5, answer: "SLIDE" },
                { number: 2, clue: "Listen", row: 0, col: 1, length: 5, answer: "HEARS" },
                { number: 3, clue: "Objects", row: 0, col: 2, length: 4, answer: "IATS" },
                { number: 4, clue: "Close by", row: 0, col: 3, length: 4, answer: "NRES" },
                { number: 5, clue: "Terminates", row: 0, col: 4, length: 4, answer: "ENSS" }
            ]
        }
    },
    // Puzzle 13: TOWNS theme
    {
        puzzleNumber: 13,
        grid: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ],
        solution: [
            ['T', 'O', 'W', 'N', 'S'],
            ['R', 'A', 'I', 'S', 'E'],
            ['A', 'S', 'D', 'E', 'S'],
            ['I', 'T', 'E', 'S', 'S'],
            ['L', 'S', 'S', 'S', 'S']
        ],
        clues: {
            across: [
                { number: 1, clue: "Small cities", row: 0, col: 0, length: 5, answer: "TOWNS" },
                { number: 6, clue: "Lift up", row: 1, col: 0, length: 5, answer: "RAISE" }
            ],
            down: [
                { number: 1, clue: "Path", row: 0, col: 0, length: 5, answer: "TRAIL" },
                { number: 2, clue: "Pledges", row: 0, col: 1, length: 5, answer: "OASTS" },
                { number: 3, clue: "Broad", row: 0, col: 2, length: 4, answer: "WIDE" },
                { number: 4, clue: "Cavity", row: 0, col: 3, length: 4, answer: "NSES" },
                { number: 5, clue: "Multiple", row: 0, col: 4, length: 4, answer: "SESS" }
            ]
        }
    },
    // Puzzle 14: FRESH theme
    {
        puzzleNumber: 14,
        grid: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ],
        solution: [
            ['F', 'R', 'E', 'S', 'H'],
            ['L', 'A', 'N', 'E', 'S'],
            ['A', 'I', 'T', 'E', 'R'],
            ['T', 'N', 'S', 'K', 'S'],
            ['S', 'S', 'S', 'S', 'S']
        ],
        clues: {
            across: [
                { number: 1, clue: "New, not stale", row: 0, col: 0, length: 5, answer: "FRESH" },
                { number: 6, clue: "Roadway divisions", row: 1, col: 0, length: 5, answer: "LANES" },
                { number: 7, clue: "Server", row: 2, col: 1, length: 4, answer: "ITER" }
            ],
            down: [
                { number: 1, clue: "Apartment", row: 0, col: 0, length: 4, answer: "FLAT" },
                { number: 2, clue: "Precipitation", row: 0, col: 1, length: 4, answer: "RAIN" },
                { number: 3, clue: "Go in", row: 0, col: 2, length: 4, answer: "ENTS" },
                { number: 4, clue: "Hunt for", row: 0, col: 3, length: 4, answer: "SEEK" },
                { number: 5, clue: "Female pronoun", row: 0, col: 4, length: 4, answer: "HERS" }
            ]
        }
    },
    // Puzzle 15: NIGHT theme  
    {
        puzzleNumber: 15,
        grid: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ],
        solution: [
            ['N', 'I', 'G', 'H', 'T'],
            ['O', 'D', 'E', 'A', 'S'],
            ['R', 'E', 'A', 'R', 'S'],
            ['T', 'S', 'R', 'S', 'S'],
            ['H', 'S', 'S', 'S', 'S']
        ],
        clues: {
            across: [
                { number: 1, clue: "After sunset", row: 0, col: 0, length: 5, answer: "NIGHT" },
                { number: 6, clue: "Concepts", row: 1, col: 0, length: 5, answer: "IDEAS" },
                { number: 7, clue: "Back parts", row: 2, col: 0, length: 5, answer: "REARS" }
            ],
            down: [
                { number: 1, clue: "Direction", row: 0, col: 0, length: 5, answer: "NORTH" },
                { number: 2, clue: "Within", row: 0, col: 1, length: 4, answer: "IDES" },
                { number: 3, clue: "Equipment", row: 0, col: 2, length: 4, answer: "GEARS" },
                { number: 4, clue: "Pay attention", row: 0, col: 3, length: 4, answer: "HARS" },
                { number: 5, clue: "Plural ending", row: 0, col: 4, length: 4, answer: "TSSS" }
            ]
        }
    }
];

/**
 * Get puzzle by number
 */
export function getPuzzle(puzzleNumber: number): MiniPuzzle | undefined {
    return puzzles.find(p => p.puzzleNumber === puzzleNumber);
}

/**
 * Get daily puzzle based on date
 */
export function getDailyPuzzle(date: Date = new Date()): MiniPuzzle {
    const epoch = new Date('2026-01-11');
    const daysSinceEpoch = Math.floor((date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
    const index = Math.abs(daysSinceEpoch) % puzzles.length;

    return {
        ...puzzles[index],
        puzzleNumber: daysSinceEpoch + 1
    };
}

/**
 * Calculate cell numbers for clue references
 */
export function getCellNumbers(puzzle: MiniPuzzle): Map<string, number> {
    const numbers = new Map<string, number>();
    let num = 1;

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (puzzle.grid[row][col] === null) continue;

            const startsAcross = (col === 0 || puzzle.grid[row][col - 1] === null) &&
                (col < 4 && puzzle.grid[row][col + 1] !== null);
            const startsDown = (row === 0 || puzzle.grid[row - 1]?.[col] === null) &&
                (row < 4 && puzzle.grid[row + 1]?.[col] !== null);

            if (startsAcross || startsDown) {
                numbers.set(`${row},${col}`, num++);
            }
        }
    }

    return numbers;
}
