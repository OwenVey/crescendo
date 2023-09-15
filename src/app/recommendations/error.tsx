'use client'; // Error components must be Client Components

import type { ErrorProps } from '@/types';
import { useEffect } from 'react';

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="h-full w-full p-8">
      <div className="grid h-full w-full place-items-center rounded-lg border-2 border-dashed border-red-400 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
        <div className="text-center text-red-600 dark:text-red-300">
          <div>{error.name}</div>
          <div>{error.message}</div>
        </div>
      </div>
    </div>
  );
}
