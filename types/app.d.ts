declare module 'app-types' {
  import('@practical-fp/union-types');
  import { Variant } from '@practical-fp/union-types';

  type ErrorMessage = string;
  type Pokemon = string;

  type PokemonState = {
    id: number;
    pokemon: Pokemon;
  };

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
