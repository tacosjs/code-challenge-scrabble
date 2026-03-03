import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { LetterData, FindWordsInput, FindWordsResult } from 'server/types'
import { MAX_LETTERS } from 'server/types'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'data')
const LETTER_DATA_FILE = 'letter_data.json'
const DICTIONARY_FILE = 'dictionary.txt'

function loadLetterData(): LetterData {
  const path = join(DATA_DIR, LETTER_DATA_FILE)
  return JSON.parse(readFileSync(path, 'utf-8')) as LetterData
}

function loadDictionary(): string[] {
  const path = join(DATA_DIR, DICTIONARY_FILE)
  const content = readFileSync(path, 'utf-8')

  return content.split('\n').map((line) => line.trim().toLowerCase())
}

function countLetters(str: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const char of str) {
    const upper = char.toUpperCase()
    if (/[A-Z]/.test(upper)) {
      counts.set(upper, (counts.get(upper) ?? 0) + 1)
    }
  }

  return counts
}

/**
 * Returns true if the word can be formed using only letters from the rack.
 * Rack counts use uppercase keys (A–Z).
 */
function isFormableFromRack(word: string, rackCounts: Map<string, number>): boolean {
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
function extractLettersNeededFromRack(fullWord: string, starter: string): string | null {
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
  letterData: LetterData
): string | null {
  const allLetters = new Set([...rackCounts.keys(), ...starterCounts.keys()])
  for (const letter of allLetters) {
    const rack = rackCounts.get(letter) ?? 0
    const starter = starterCounts.get(letter) ?? 0
    const total = rack + starter
    const limit = letterData[letter].count

    if (total > limit) {
      return `Letter "${letter}" appears ${total} time(s) (rack + board word) but only ${limit} tile(s) exist in the game`
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
  const starter = (data.word ?? '')
    .replace(/[^a-zA-Z]/g, '')
    .toLowerCase()

  if (letters.length > MAX_LETTERS) {
    return { words: [], message: `You cannot exceed ${MAX_LETTERS} letters` }
  }

  if (!letters || letters.length === 0) {
    return { words: [], message: 'Provide letters parameter' }
  }

  const letterData = loadLetterData()
  const dictionary = loadDictionary()
  const rackCounts = countLetters(letters)

  if (starter) {
    const starterCounts = countLetters(starter)
    const tileError = checkTileDistribution(rackCounts, starterCounts, letterData)
    if (tileError) {
      return { words: [], message: tileError }
    }
  }

  const results: FindWordsResult['words'] = []

  for (const dictWord of dictionary) {
    const lettersNeededFromRack = starter
      ? extractLettersNeededFromRack(dictWord, starter)
      : dictWord

    if (!lettersNeededFromRack) continue
    if (isFormableFromRack(lettersNeededFromRack, rackCounts)) {
      results.push({ word: dictWord, score: calculateWordScore(dictWord, letterData) })
    }
  }

  results.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word))
  
  return { words: results }
}
