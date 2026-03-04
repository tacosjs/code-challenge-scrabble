import { getWords } from "#/utils/words.functions"
import { useMutation } from "@tanstack/react-query"
import type { FindWordsInput } from "server/types"

const WORDS_QUERY_KEY = ['words']


/**
 * Query to get words from a rack and the starter word.
 */
export const useGetWordsMutation = () =>
  useMutation({
    mutationKey: [...WORDS_QUERY_KEY],
    mutationFn: (input: FindWordsInput) => getWords({ data: input }),
  })