'use client'; // Error components must be Client Components

import { useEffect } from 'react';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="border-2 border-dashed border-red-400 bg-red-50 rounded-lg h-full grid place-items-center">
      <div className="text-center">
        <div className="text-red-500">{error.name}</div>
        <div className="text-red-500">{error.message}</div>
      </div>
    </div>
  );
}