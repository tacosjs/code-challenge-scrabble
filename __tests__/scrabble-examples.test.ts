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
    expect(result.words.map((x) => x.word)).toEqual(
      expect.arrayContaining(['draw', 'ward', 'wood']),
    )
  })

  it('Should throw about Z tile limit because Z appears in both rack and board word (exceeds single Z tile)', () => {
    expect(() =>
      findWords({
        letters: 'AIDOORZ',
        word: 'QUIZ',
      }),
    ).toThrow(/Z.*exceed.*limit/i)
  })

  it('Should throw about maximum because rack has 8 letters (exceeds 7-letter limit)', () => {
    expect(() =>
      findWords({
        letters: 'AIDOORWZ',
      }),
    ).toThrow(/7.*exceed|exceed.*7|rack/i)
  })

  it('Should throw about no words available if no words can be formed', () => {
    expect(() =>
      findWords({
        letters: 'AIDOORW',
        word: 'XYZ',
      }),
    ).toThrow(/no words available/i)
  })

})
