import type { LetterData, FindWordsInput, FindWordsResult } from 'server/types'
import { MAX_LETTERS, MAX_WORD_LENGTH, MIN_WORD_LENGTH } from 'server/types'
import { loadDictionary } from './dictionary'
import { countLetters, loadLetterData } from './letters'

/**
 * Removes non-alphabetic characters from a string.
 */
function sanitizeAlpha(str: string): string {
  return str.replace(/[^a-zA-Z]/g, '').toUpperCase()
}

/**
 * Returns true if the word length is valid.
 * Basic word length is usually between 2 and 15 letters.
 */
function isValidWordLength(word: string): boolean {
  return word.length >= MIN_WORD_LENGTH && word.length <= MAX_WORD_LENGTH
}

/**
 * Returns true if the word can be formed using only letters from the rack.
 * Rack counts use uppercase keys (A–Z).
 */
function isFormableFromRack(
  word: string,
  rackCounts: Map<string, number>,
): boolean {
  const wordCounts = countLetters(word)
  for (const [letter, count] of wordCounts) {
    const available = rackCounts.get(letter) ?? 0
    if (count > available) return false
  }
  return true
}

/**
 * Calculates the score of a word based on the letter data.
 */
function calculateWordScore(word: string, letterData: LetterData): number {
  return [...word].reduce((sum, char) => sum + letterData[char].score, 0)
}

/**
 * Returns the letters needed from the rack to form the full word around the starter.
 * The starter is a mandatory substring that must appear in the word. Returns null
 * if the starter is not found in the word.
 */
function extractLettersNeededFromRack(
  fullWord: string,
  starter: string,
): string | null {
  const idx = fullWord.indexOf(starter)
  if (idx === -1) return null

  return fullWord.slice(0, idx) + fullWord.slice(idx + starter.length)
}

/**
 * Returns true if the word can be formed using only letters from the rack.
 */
function canFormWord(
  dictWord: string,
  starter: string,
  rackCounts: Map<string, number>,
): boolean {
  const lettersNeededFromRack = starter
    ? extractLettersNeededFromRack(dictWord, starter)
    : dictWord
  return (
    !!lettersNeededFromRack &&
    isFormableFromRack(lettersNeededFromRack, rackCounts)
  )
}

/**
 * Returns a message if rack + starter exceed any tile count from the game, null otherwise.
 */
function checkTileDistribution(
  rackCounts: Map<string, number>,
  starterCounts: Map<string, number>,
  letterData: LetterData,
): string | null {
  const allLetters = new Set([...rackCounts.keys(), ...starterCounts.keys()])
  for (const letter of allLetters) {
    const rack = rackCounts.get(letter) ?? 0
    const starter = starterCounts.get(letter) ?? 0
    const total = rack + starter
    const limit = letterData[letter].count

    if (total > limit) {
      return `Letter "${letter}" exceeds usage limit: ${total} used, ${limit} available`
    }
  }

  return null
}

/**
 * Finds Scrabble words formable from the given letters, optionally containing a
 * mandatory substring (starter). Returns words sorted by score (highest first).
 */
export function findWords(data: FindWordsInput): FindWordsResult {
  const letters = sanitizeAlpha(data.letters)
  const starter = sanitizeAlpha(data.word ?? '')

  if (!letters) throw new Error('Provide letters parameter')
  if (letters.length > MAX_LETTERS) {
    throw new Error(`You cannot exceed ${MAX_LETTERS} letters in your rack`)
  }

  const letterData = loadLetterData()
  const dictionary = loadDictionary()
  const rackCounts = countLetters(letters)

  if (starter) {
    const starterCounts = countLetters(starter)
    const tileError = checkTileDistribution(
      rackCounts,
      starterCounts,
      letterData,
    )
    if (tileError) throw new Error(tileError)
  }

  const words = dictionary
    .filter(
      (dictWord) =>
        isValidWordLength(dictWord) &&
        canFormWord(dictWord, starter, rackCounts),
    )
    .map((dictWord) => ({
      word: dictWord,
      score: calculateWordScore(dictWord, letterData),
    }))
    .sort((a, b) => b.score - a.score || a.word.localeCompare(b.word))

  if (words.length === 0) throw new Error('No words available')

  return { words }
}
