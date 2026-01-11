/**
 * CIPHER - Monoalphabetic Substitution Cipher Engine
 * 
 * Generates and validates cipher puzzles with the following constraints:
 * - Every letter maps to a different letter
 * - No letter maps to itself
 * - Mapping is consistent across the entire phrase
 */

export type CipherMapping = Record<string, string>;

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Seeded random number generator for deterministic cipher generation
 */
export function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

/**
 * Shuffles an array using Fisher-Yates algorithm with optional seeded RNG
 */
function shuffleArray<T>(array: T[], random: () => number = Math.random): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generates a valid cipher mapping where no letter maps to itself
 * Uses derangement algorithm to ensure this constraint
 */
export function generateCipherMapping(seed?: number): CipherMapping {
  const random = seed !== undefined ? seededRandom(seed) : Math.random;
  const letters = ALPHABET.split('');
  
  // Generate a derangement (permutation where no element appears in its original position)
  let shuffled: string[];
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    shuffled = shuffleArray(letters, typeof random === 'function' ? random : Math.random);
    attempts++;
    // Check if any letter maps to itself
    const isValidDerangement = shuffled.every((letter, index) => letter !== letters[index]);
    if (isValidDerangement) break;
  } while (attempts < maxAttempts);
  
  // If we couldn't find a valid derangement, fix any self-mappings
  for (let i = 0; i < shuffled.length; i++) {
    if (shuffled[i] === letters[i]) {
      // Swap with next position (wrap around)
      const swapIndex = (i + 1) % shuffled.length;
      [shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
    }
  }
  
  // Create the mapping
  const mapping: CipherMapping = {};
  letters.forEach((letter, index) => {
    mapping[letter] = shuffled[index];
  });
  
  return mapping;
}

/**
 * Encodes a phrase using the given cipher mapping
 */
export function encodePhrase(phrase: string, mapping: CipherMapping): string {
  return phrase
    .toUpperCase()
    .split('')
    .map(char => {
      if (ALPHABET.includes(char)) {
        return mapping[char];
      }
      return char; // Keep spaces and punctuation
    })
    .join('');
}

/**
 * Decodes a phrase using the given cipher mapping
 */
export function decodePhrase(encoded: string, mapping: CipherMapping): string {
  // Create reverse mapping
  const reverseMapping: CipherMapping = {};
  Object.entries(mapping).forEach(([plain, cipher]) => {
    reverseMapping[cipher] = plain;
  });
  
  return encoded
    .toUpperCase()
    .split('')
    .map(char => {
      if (ALPHABET.includes(char)) {
        return reverseMapping[char];
      }
      return char;
    })
    .join('');
}

/**
 * Validates if a player's guesses correctly decode the phrase
 */
export function validateSolution(
  encodedPhrase: string,
  originalPhrase: string,
  playerGuesses: Record<string, string>
): boolean {
  const decodedWithGuesses = encodedPhrase
    .toUpperCase()
    .split('')
    .map(char => {
      if (ALPHABET.includes(char)) {
        return playerGuesses[char] || '';
      }
      return char;
    })
    .join('');
  
  return decodedWithGuesses === originalPhrase.toUpperCase();
}

/**
 * Gets the unique letters in a phrase
 */
export function getUniqueLetters(phrase: string): string[] {
  const letters = new Set<string>();
  phrase.toUpperCase().split('').forEach(char => {
    if (ALPHABET.includes(char)) {
      letters.add(char);
    }
  });
  return Array.from(letters).sort();
}

/**
 * Counts the unique letters in a phrase
 */
export function countUniqueLetters(phrase: string): number {
  return getUniqueLetters(phrase).length;
}

/**
 * Gets letter frequency in a phrase
 */
export function getLetterFrequency(phrase: string): Record<string, number> {
  const frequency: Record<string, number> = {};
  phrase.toUpperCase().split('').forEach(char => {
    if (ALPHABET.includes(char)) {
      frequency[char] = (frequency[char] || 0) + 1;
    }
  });
  return frequency;
}

/**
 * Creates a player's guess mapping from individual letter assignments
 */
export function createGuessMapping(guesses: Array<{ cipher: string; plain: string }>): Record<string, string> {
  const mapping: Record<string, string> = {};
  guesses.forEach(({ cipher, plain }) => {
    if (cipher && plain) {
      mapping[cipher.toUpperCase()] = plain.toUpperCase();
    }
  });
  return mapping;
}

/**
 * Checks if a guess would create a conflict (same plain letter assigned to different cipher letters)
 */
export function checkForConflict(
  currentGuesses: Record<string, string>,
  cipherLetter: string,
  plainLetter: string
): string | null {
  const cipherUpper = cipherLetter.toUpperCase();
  const plainUpper = plainLetter.toUpperCase();
  
  // Check if this plain letter is already assigned to a different cipher letter
  for (const [cipher, plain] of Object.entries(currentGuesses)) {
    if (plain === plainUpper && cipher !== cipherUpper) {
      return cipher; // Return the conflicting cipher letter
    }
  }
  
  return null;
}
