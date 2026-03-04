import { createServerFn } from '@tanstack/react-start'
import { findWords } from 'server/utils/words'
import type { FindWordsInput } from 'server/types'

/**
 * API function to find words from a rack and the starter word.
 */
export const getWords = createServerFn({ method: 'GET' })
  .inputValidator((data: FindWordsInput) => ({
    letters: String(data.letters).trim(),
    word: data.word ? String(data.word).trim() : undefined,
  }))
  .handler(async ({ data }) => {
    return findWords(data)
  })
