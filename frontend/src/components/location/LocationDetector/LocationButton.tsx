import React from 'react';
import { Compass } from 'lucide-react';

interface LocationButtonProps {
  onClick: () => void;
  isDetecting: boolean;
}

export function LocationButton({ onClick, isDetecting }: LocationButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDetecting}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Compass className={`h-5 w-5 ${isDetecting ? 'animate-spin' : ''}`} />
      {isDetecting ? 'Detecting location...' : 'Use my current location'}
    </button>
  );
}