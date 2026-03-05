import { readFileSync } from 'node:fs'
import type { LetterData } from 'server/types'

const root = process.cwd()
const DATA_DIR = `${root}/server/data`
const LETTER_DATA_FILE = 'letter_data.json'

/**
 * Loads the letter data from the data directory.
 */
export function loadLetterData(): LetterData {
  const path = `${DATA_DIR}/${LETTER_DATA_FILE}`
  return JSON.parse(readFileSync(path, 'utf-8')) as LetterData
}

/**
 * Counts the letters in a string.
 */
export function countLetters(str: string): Map<string, number> {
  return [...str]
    .map((char) => char.toUpperCase())
    .filter((upper) => /[A-Z]/.test(upper))
    .reduce(
      (counts, upper) => counts.set(upper, (counts.get(upper) ?? 0) + 1),
      new Map<string, number>(),
    )
}
