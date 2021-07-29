import { shuffle } from '@utils/array';
import { ErrorMessage, MemoryCardState, Pokemon } from 'app-types';
import { map } from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import { memoryCardState } from 'types/impl';

/**
 * Fetch list of pokemon to display in the card game
 * @returns `TaskEither` which calls the Poke API to fetch the list of pokemon
 */
export const getPokemonList = (): TE.TaskEither<ErrorMessage, Pokemon[]> =>
  TE.of(['a', 'b', 'c', 'd']);

/**
 * Take list of pokemon, duplicate the list, map it to `MemoryCardState`, and shuffle
 * @param pokemonList List of pokemon
 * @returns List of `MemoryCardState` ready for the card game
 */
export const convertPokemonListToCards = (
  pokemonList: Pokemon[]
): MemoryCardState[] =>
  pipe([...pokemonList, ...pokemonList], map(memoryCardState.hidden), shuffle);
