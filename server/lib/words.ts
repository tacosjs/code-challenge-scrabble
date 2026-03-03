import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { LetterData, FindWordsInput, FindWordsResult } from 'server/types'
import { MAX_LETTERS } from 'server/types'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'data')

function loadLetterData(): LetterData {
  const path = join(DATA_DIR, 'letter_data.json')
  return JSON.parse(readFileSync(path, 'utf-8')) as LetterData
}

function loadDictionary(): string[] {
  const path = join(DATA_DIR, 'dictionary.txt')
  const content = readFileSync(path, 'utf-8')

  return content.split('\n').map((line) => line.trim().toLowerCase())
}

function getLetterCounts(str: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const char of str) {
    if (/[A-Z]/.test(char)) {
      counts.set(char, (counts.get(char) ?? 0) + 1)
    }
  }
  return counts
}

function canFormWord(word: string, rackCounts: Map<string, number>): boolean {
  const wordCounts = getLetterCounts(word)
  for (const [letter, count] of wordCounts) {
    const available = rackCounts.get(letter) ?? 0
    if (count > available) return false
  }
  return true
}

function getWordScore(word: string, letterData: LetterData): number {
  return word
    .toUpperCase()
    .split('')
    .reduce((sum, char) => sum + letterData[char].score, 0)
}

function getRemainingLetters(fullWord: string, starter: string): string | null {
  const idx = fullWord.indexOf(starter)
  if (idx === -1) return null
  return fullWord.slice(0, idx) + fullWord.slice(idx + starter.length)
}



export function findWords(data: FindWordsInput): FindWordsResult {
  const letters = data.letters.replace(/[^a-zA-Z]/g, '')
  const starter = (data.word ?? '')
    .replace(/[^a-zA-Z]/g, '')
    .toLowerCase()

  if (letters.length > MAX_LETTERS) {
    return { words: [], message: `Max word length is ${MAX_LETTERS} characters` }
  }

  if (!letters || letters.length === 0) {
    return { words: [], message: 'Provide letters parameter' }
  }

  const letterData = loadLetterData()
  const dictionary = loadDictionary()
  const rackCounts = getLetterCounts(letters)
  const results: FindWordsResult['words'] = []

  for (const dictWord of dictionary) {
    const toForm = starter
      ? getRemainingLetters(dictWord, starter)
      : dictWord

    if (!toForm) continue
    if (canFormWord(toForm, rackCounts)) {
      results.push({ word: dictWord, score: getWordScore(dictWord, letterData) })
    }
  }

  results.sort((a, b) => b.score - a.score)
  
  return { words: results }
}
