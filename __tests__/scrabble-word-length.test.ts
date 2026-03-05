import { describe, it, expect, vi } from 'vitest'
import { findWords } from 'server/utils/words'

let mockDictionary: string[] = []

vi.mock('server/utils/dictionary', () => ({
  loadDictionary: () => mockDictionary,
}))

describe('Scrabble word length', () => {
  it('Should skip words too short (less than 2 letters) and return valid words', () => {
    mockDictionary = ['A', 'AB']
    const result = findWords({ letters: 'AB' })
    expect(result.words.map((x) => x.word)).toContain('AB')
    expect(result.words.map((x) => x.word)).not.toContain('a')
  })

  it('Should skip words too long (exceeds 15 letters) and return valid words', () => {
    mockDictionary = ['ABCDEFGHIJKLMNOP', 'AB']
    const result = findWords({ letters: 'AB' })
    expect(result.words.map((x) => x.word)).toContain('AB')
    expect(result.words.map((x) => x.word)).not.toContain('abcdefghijklmnop')
  })

  it('Should throw no words available when all dictionary words are invalid length', () => {
    mockDictionary = ['A', 'ABCDEFGHIJKLMNOP']
    expect(() => findWords({ letters: 'AB' })).toThrow(/no words available/i)
  })
})
