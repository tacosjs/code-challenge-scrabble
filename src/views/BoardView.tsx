import { useGetWordsMutation } from '#/services/words.services'
import { TilesRow } from '#/components/Tiles'
import { useState } from 'react'
import type { FindWordsInput } from 'server/types'
import { BoardSection } from '#/components/BoardSection'

export const BoardView = () => {
  const [tableWord, setTableWord] = useState<string | undefined>(undefined)
  const [rackInput, setRackInput] = useState<string | undefined>(undefined)

  const {
    mutate: mutateWords,
    data,
    isPending,
    isError,
    error,
  } = useGetWordsMutation()

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()

    const rackLetters =
      rackInput
        ?.replace(/[^a-zA-Z]/g, '')
        .toUpperCase()
        .slice(0, 7) ?? ''

    if (!rackLetters.trim()) return

    const input: FindWordsInput = {
      letters: rackLetters,
      word: tableWord,
    }

    mutateWords(input)
  }

  return (
    <main className="py-8 px-4 max-w-xl mx-auto flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold text-center mb-1">
          Scrabble Word Builder
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Extend the table word with your rack letters to score points
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <BoardSection
          label="Table word"
          value={tableWord}
          setValueFn={setTableWord}
        />
        <BoardSection
          label="Your rack"
          value={rackInput}
          setValueFn={setRackInput}
          maxLength={7}
        />
        <button
          type="submit"
          disabled={!rackInput || isPending}
          className="w-full py-2.5 px-4 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isPending ? 'Checking…' : 'Validate'}
        </button>
      </form>

      <section className="flex flex-col gap-4">
        {isError && (
          <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm">
            {error instanceof Error ? error.message : String(error)}
          </div>
        )}
        {data && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Words you can make
            </p>
            <ul className="flex flex-col gap-2">
              {data.words.map(({ word, score }) => (
                <li
                  key={word}
                  className="flex items-center justify-between gap-4 py-2 px-3 rounded-md bg-muted/50"
                >
                  <TilesRow letters={word.split('')} />
                  <span className="font-semibold text-primary shrink-0">
                    {score} pts
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  )
}
