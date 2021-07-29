declare module 'app-types' {
  import('@practical-fp/union-types');
  import { Variant } from '@practical-fp/union-types';

  type ErrorMessage = string;

  type Pokemon = string;

  type MemoryGameState =
    | Variant<'all_hidden'>
    | Variant<'all_revealed'>
    | Variant<'one_showing'>;

  type MemoryCardState =
    | Variant<'hidden', Pokemon>
    | Variant<'showing', Pokemon>
    | Variant<'revealed', Pokemon>;
}
