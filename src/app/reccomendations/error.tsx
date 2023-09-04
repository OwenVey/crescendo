'use client'; // Error components must be Client Components

import type { ErrorProps } from '@/types';
import { useEffect } from 'react';

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="grid h-full place-items-center rounded-lg border-2 border-dashed border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950">
      <div className="text-center text-red-500 dark:text-red-300">
        <div>{error.name}</div>
        <div>{error.message}</div>
      </div>
    </div>
  );
}
