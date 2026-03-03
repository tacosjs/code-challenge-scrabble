import { createServerFn } from '@tanstack/react-start'
import { findWords } from './words.server'

export type FindWordsInput = {
  letters: string
  word?: string
}

export const getWords = createServerFn({ method: 'GET' })
  .inputValidator((data: FindWordsInput) => ({
    letters: String(data.letters).trim(),
    word: data.word ? String(data.word).trim() : undefined,
  }))
  .handler(async ({ data }) => {
    return findWords(data)
  })
