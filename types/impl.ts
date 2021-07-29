import { impl } from '@practical-fp/union-types';
import { MemoryCardState, MemoryGameState } from 'app-types';

export const memoryCardState = impl<MemoryCardState>();
export const memoryGameState = impl<MemoryGameState>();
