import { describe, it, expect, vi } from 'vitest'
import { findWords } from 'server/utils/words'

let mockDictionary: string[] = []

vi.mock('server/utils/dictionary', () => ({
  loadDictionary: () => mockDictionary,
}))

describe('Scrabble word length', () => {
  it('Should skip words too short (less than 2 letters) and return valid words', () => {
    mockDictionary = ['a', 'ab']
    const result = findWords({ letters: 'AB' })
    expect(result.words.map((w) => w.word)).toContain('ab')
    expect(result.words.map((w) => w.word)).not.toContain('a')
  })

  it('Should skip words too long (exceeds 15 letters) and return valid words', () => {
    mockDictionary = ['abcdefghijklmnop', 'ab']
    const result = findWords({ letters: 'AB' })
    expect(result.words.map((w) => w.word)).toContain('ab')
    expect(result.words.map((w) => w.word)).not.toContain('abcdefghijklmnop')
  })

  it('Should throw no words available when all dictionary words are invalid length', () => {
    mockDictionary = ['a', 'abcdefghijklmnop']
    expect(() => findWords({ letters: 'AB' })).toThrow(/no words available/i)
  })
})
