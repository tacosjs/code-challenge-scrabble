import type { LetterData, FindWordsInput, FindWordsResult } from 'server/types'
import { MAX_LETTERS, MAX_WORD_LENGTH, MIN_WORD_LENGTH } from 'server/types'
import { loadDictionary } from './dictionary'
import { countLetters, loadLetterData } from './letters'

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

function calculateWordScore(word: string, letterData: LetterData): number {
  return word
    .toUpperCase()
    .split('')
    .reduce((sum, char) => sum + letterData[char].score, 0)
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
  const letters = data.letters.replace(/[^a-zA-Z]/g, '')
  const starter = (data.word ?? '').replace(/[^a-zA-Z]/g, '').toLowerCase()

  if (letters.length > MAX_LETTERS) {
    throw new Error(`You cannot exceed ${MAX_LETTERS} letters in your rack`)
  }

  if (!letters || letters.length === 0) {
    throw new Error('Provide letters parameter')
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
    if (tileError) {
      throw new Error(tileError)
    }
  }

  const results: FindWordsResult['words'] = []

  for (const dictWord of dictionary) {
    if (dictWord.length < MIN_WORD_LENGTH) continue
    if (dictWord.length > MAX_WORD_LENGTH) continue

    const lettersNeededFromRack = starter
      ? extractLettersNeededFromRack(dictWord, starter)
      : dictWord

    if (!lettersNeededFromRack) continue
    if (isFormableFromRack(lettersNeededFromRack, rackCounts)) {
      results.push({
        word: dictWord,
        score: calculateWordScore(dictWord, letterData),
      })
    }
  }

  results.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word))

  if (results.length === 0) {
    throw new Error('No words available')
  }

  return { words: results }
}
