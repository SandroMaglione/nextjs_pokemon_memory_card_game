import { matchExhaustive } from '@practical-fp/union-types';
import { MemoryCardState } from 'app-types';
import { ReactElement } from 'react';

interface ComponentProps {
  cardState: MemoryCardState;
  handleClick: () => void;
}

export default function MemoryCard({
  cardState,
  handleClick,
}: ComponentProps): ReactElement {
  return (
    <div className="flex items-center justify-center py-6 border border-gray-200 shadow bg-gray-50">
      <button type="button" onClick={handleClick}>
        <span className="block w-full h-full text-lg font-bold">
          {matchExhaustive(cardState, {
            hidden: () => '???',
            showing: (pokemon) => pokemon,
            revealed: (pokemon) => pokemon,
          })}
        </span>
      </button>
    </div>
  );
}
