import { readFileSync } from 'node:fs'
import type { LetterData } from 'server/types'

const root = process.cwd()
const DATA_DIR = `${root}/server/data`
const LETTER_DATA_FILE = 'letter_data.json'

export function loadLetterData(): LetterData {
  const path = `${DATA_DIR}/${LETTER_DATA_FILE}`
  return JSON.parse(readFileSync(path, 'utf-8')) as LetterData
}

export function countLetters(str: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const char of str) {
    const upper = char.toUpperCase()
    if (/[A-Z]/.test(upper)) {
      counts.set(upper, (counts.get(upper) ?? 0) + 1)
    }
  }

  return counts
}
