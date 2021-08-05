import * as TE from 'fp-ts/TaskEither';
import * as IO from 'fp-ts/IO';
import { shuffle } from '@utils/array';
import {
  Pokemon,
  PokemonState,
  PokeApiResponse,
  MemoryCardState,
} from 'app-types';
import { map, mapWithIndex } from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';
import { memoryCardState } from '@lib/pokeapi/impl';
import {
  pokeApiResponse,
  pokemon,
} from '../../types/validation/poke_api_response';
import { ValidationError } from 'io-ts';
import axios, { AxiosResponse } from 'axios';

/**
 * Make api request to fetch list of pokemon
 * @param numberOfPokemons Number of pokemon to request
 * @returns `AxiosResponse` if the request is successful, `ValidationError` otherwise
 */
const pokemonListRequest =
  (numberOfPokemons: number) =>
  (
    offsetIO: IO.IO<number>
  ): TE.TaskEither<ValidationError, AxiosResponse<unknown>> =>
    pipe(
      offsetIO,
      TE.fromIO,
      TE.chain((offset) =>
        TE.tryCatch(
          async () =>
            axios.get(
              `https://pokeapi.co/api/v2/pokemon/?limit=${numberOfPokemons}&offset=${offset}`
            ),
          (error): ValidationError => ({
            context: [],
            value: error,
            message: 'Error while fetching list of pokemon, please try again',
          })
        )
      )
    );

/**
 * Fetch and validate list of pokemon requested to the api
 * @param numberOfPokemons Number of pokemon to request
 * @returns List of `PokeApiResponse` if request and validation is successful, `ValidationError` otherwise
 */
const validatePokemonListRequest =
  (numberOfPokemons: number) =>
  (offsetIO: IO.IO<number>): TE.TaskEither<ValidationError, PokeApiResponse> =>
    pipe(
      offsetIO,
      pokemonListRequest(numberOfPokemons),
      TE.chain(({ data }) =>
        pipe(
          pokeApiResponse.decode(data),
          TE.fromEither,
          TE.mapLeft(
            (errors): ValidationError => ({
              context: [],
              value: errors,
              message: 'Unexpected pokemon list format, impossible to continue',
            })
          )
        )
      )
    );

/**
 * Try to make async request to pokemon api
 * @param url Url where to fetch pokemon details
 * @param pokemonName Name of the pokemon to fetch data
 * @returns Response from axios of type `AxiosResponse` if the response is valid, `ValidationError` otherwise
 */
const pokemonImageRequest = (
  url: string,
  pokemonName: string
): TE.TaskEither<ValidationError, AxiosResponse<unknown>> =>
  TE.tryCatch(
    async () => axios.get(url),
    (error): ValidationError => ({
      context: [],
      value: error,
      message: `Error while fetching image image for pokemon '${pokemonName}', please try again`,
    })
  );

/**
 * Fetch and validate pokemon from api
 * @param url Url where to fetch pokemon details
 * @param pokemonName Name of the pokemon to fetch data
 * @returns Value of type `Pokemon` if the response is valid, `ValidationError` otherwise
 */
const validatePokemonImageRequest = (
  url: string,
  pokemonName: string
): TE.TaskEither<ValidationError, Pokemon> =>
  pipe(
    pokemonImageRequest(url, pokemonName),
    TE.chain(({ data }) =>
      pipe(
        pokemon.decode(data),
        TE.fromEither,
        TE.mapLeft(
          (errors): ValidationError => ({
            context: [],
            value: errors,
            message: `Pokemon ${pokemonName} unexpected format, impossible to continue`,
          })
        )
      )
    )
  );

/** PUBLIC API BELOW 👇 */

/**
 * Fetch list of pokemon to display in the card game
 * @returns `TaskEither` which calls the Poke API to fetch the list of pokemon
 */
export const getPokemonList =
  (numberOfPokemons: number) =>
  (
    offsetIO: IO.IO<number>
  ): TE.TaskEither<ValidationError, readonly Pokemon[]> =>
    pipe(
      offsetIO,
      validatePokemonListRequest(numberOfPokemons),
      TE.chain(({ results }) =>
        TE.sequenceArray(
          pipe(
            results,
            map(({ url, name }) => validatePokemonImageRequest(url, name))
          )
        )
      )
    );

/**
 * Take list of pokemon, duplicate the list, map it to `MemoryCardState`, and shuffle
 * @param pokemonList List of pokemon
 * @returns List of `MemoryCardState` ready for the card game
 */
export const convertPokemonListToCards = (
  pokemonList: readonly Pokemon[]
): IO.IO<MemoryCardState[]> =>
  pipe(
    [...pokemonList, ...pokemonList],
    mapWithIndex<Pokemon, PokemonState>((id, pokemon) => ({
      pokemon,
      id,
    })),
    map(memoryCardState.hidden),
    shuffle
  );
