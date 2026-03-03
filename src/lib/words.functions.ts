import { createServerFn } from '@tanstack/react-start'
import { findWords } from 'server/lib/words'
import type { FindWordsInput } from 'server/types'

export const getWords = createServerFn({ method: 'GET' })
  .inputValidator((data: FindWordsInput) => ({
    letters: String(data.letters).trim(),
    word: data.word ? String(data.word).trim() : undefined,
  }))
  .handler(async ({ data }) => {
    return findWords(data)
  })
