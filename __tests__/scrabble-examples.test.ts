import { describe, it, expect } from 'vitest'
import { findWords } from 'server/utils/words'

describe('Scrabble examples', () => {
  it('Should return wizard with 19 points because rack AIDOORW and board word WIZ form WIZARD', () => {
    const result = findWords({
      letters: 'AIDOORW',
      word: 'WIZ',
    })

    expect(result.words.length).toBeGreaterThan(0)
    expect(result.words[0]).toEqual({ word: 'wizard', score: 19 })
  })

  it('Should return dowar first (highest score) and include draw because rack-only AIDOORW yields valid words ordered by score', () => {
    const result = findWords({
      letters: 'AIDOORW',
    })

    expect(result.words.length).toBeGreaterThan(0)
    expect(result.words[0].word).toBe('dowar')
    expect(result.words.map((x) => x.word)).toEqual(expect.arrayContaining(['draw', 'ward', 'wood']))
  })

  it('Should return no words and a message about Z tile limit because Z appears in both rack and board word (exceeds single Z tile)', () => {
    const result = findWords({
      letters: 'AIDOORZ',
      word: 'QUIZ',
    })

    expect(result.words).toHaveLength(0)
    expect(result.message).toBeDefined()
    expect(result.message).toMatch(/(?=.*Z)(?=.*exceed)(?=.*limit)/i)
  })

  it('Should return no words and a message about maximum because rack has 8 letters (exceeds 7-letter limit)', () => {
    const result = findWords({
      letters: 'AIDOORWZ',
    })

    expect(result.words).toHaveLength(0)
    expect(result.message).toBeDefined()
    expect(result.message).toMatch(/(?=.*7)(?=.*exceed)(?=.*rack)/i)
  })
})
