/**
 * Letter data is a record of letters and their scores and counts.
 */
export type LetterData = Record<string, { score: number; count: number }>

/**
 * Inputs for the find words API.
 */
export type FindWordsInput = {
  letters: string
  word?: string
}

/**
 * Result of the find words API.
 * It can contain an array of words and their scores, or a message if there is an error.
 */
export type FindWordsResult = {
  words: { word: string; score: number }[]
}

/**
 * Maximum number of letters in a rack.
 */
export const MAX_LETTERS = 7

/**
 * Minimum length of a word.
 */
export const MIN_WORD_LENGTH = 2

/**
 * Maximum length of a word.
 */
export const MAX_WORD_LENGTH = 15
