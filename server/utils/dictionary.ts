import { readFileSync } from 'node:fs'

const root = process.cwd()
const DATA_DIR = `${root}/server/data`
const DICTIONARY_FILE = 'dictionary.txt'

export function loadDictionary(): string[] {
  const path = `${DATA_DIR}/${DICTIONARY_FILE}`
  const content = readFileSync(path, 'utf-8')
  return content.split('\n').map((line) => line.trim().toLowerCase())
}
