/**
 * Letter data is a record of letters and their scores and counts
 */
export type LetterData = Record<string, { score: number; count: number }>

/**
 * Find words input is the input for the find words function
 */
export type FindWordsInput = {
  letters: string
  word?: string
}

/**
 * Find words result is the result of the find words function
 * It can contain a message and an array of words and their scores
 */
export type FindWordsResult = {
  words: { word: string; score: number }[]
  message?: string
}


export const MAX_LETTERS = 7