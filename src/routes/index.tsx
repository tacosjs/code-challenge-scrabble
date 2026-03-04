import { useGetWordsMutation } from '#/services/words.services'
import { createFileRoute } from '@tanstack/react-router'
import type { FindWordsInput } from 'server/types'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { mutate, data, isPending, isError, error } = useGetWordsMutation()

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const input: FindWordsInput = {
      letters: formData.get('letters') as string,
      word: formData.get('word') as string,
    }

    mutate(input)
  }

  return (
    <main className="py-8 max-w-prose mx-auto">
      <h1>Coding Challenge - Scrabble</h1>
      <p>This is a coding challenge for Scrabble.</p>

      <form onSubmit={handleSubmit}>
        <input type="text" name="letters" placeholder="Letters" />
        <input type="text" name="word" placeholder="Word" />
        <button type="submit">Submit</button>
      </form>

      {isPending && <div>Loading...</div>}
      {isError ||
        (data?.message && (
          <div className="text-red-500">Error: {data.message}</div>
        ))}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </main>
  )
}
