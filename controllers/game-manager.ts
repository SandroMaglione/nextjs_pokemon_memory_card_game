import { matchExhaustive } from '@practical-fp/union-types';
import { MemoryCardState, MemoryGameState } from 'app-types';
import { memoryCardState } from 'types/impl';

export const handleClickOnCard = ({
  cardState,
  gameState,
}: {
  gameState: MemoryGameState;
  cardState: MemoryCardState;
}): MemoryCardState =>
  matchExhaustive(cardState, {
    hidden: (pokemon): MemoryCardState =>
      matchExhaustive(gameState, {
        all_hidden: (): MemoryCardState => memoryCardState.showing(pokemon),
        one_showing: (): MemoryCardState => cardState,
        all_revealed: (): MemoryCardState => cardState,
      }),
    showing: memoryCardState.showing,
    revealed: (): MemoryCardState => cardState,
  });
