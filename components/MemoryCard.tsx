import { MemoryCardState } from 'app-types';
import { ReactElement } from 'react';

interface ComponentProps {
  memoryCardState: MemoryCardState;
}

export default function MemoryCard({
  memoryCardState,
}: ComponentProps): ReactElement {
  return (
    <div className="border border-gray-200 shadow bg-gray-50">
      {memoryCardState.value}
    </div>
  );
}
