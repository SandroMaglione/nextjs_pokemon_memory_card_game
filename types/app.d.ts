declare module 'app-types' {
  import('@practical-fp/union-types');
  import('./validation/poke_api_response');
  import('io-ts');
  import * as t from 'io-ts';
  import { pokeApiResponse, pokemon } from './validation/poke_api_response';
  import { Variant } from '@practical-fp/union-types';

  type ErrorMessage = string;

  type Pokemon = t.TypeOf<typeof pokemon>;
  type PokeApiResponse = t.TypeOf<typeof pokeApiResponse>;

  interface PokemonState {
    id: number;
    pokemon: Pokemon;
  }

  type MemoryCardState =
    | Variant<'hidden', PokemonState>
    | Variant<'showing', PokemonState>
    | Variant<'revealed', PokemonState>;

  type MemoryGameState =
    | Variant<'all_hidden'>
    | Variant<'all_revealed'>
    | Variant<'one_showing', PokemonState>
    | Variant<'two_showing', [PokemonState, PokemonState]>;
}
