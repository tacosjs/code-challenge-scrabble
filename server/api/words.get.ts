import { defineEventHandler, getQuery } from 'nitro/h3'
import { findWords } from '../lib/words'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const letters = String(query.letters ?? '').replace(/[^a-zA-Z]/g, '')
  const word = String(query.word ?? '')
    .replace(/[^a-zA-Z]/g, '')
    .toLowerCase()

  return findWords({ letters, word: word || undefined })
})
