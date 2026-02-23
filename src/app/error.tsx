"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // TODO: Log the error to an error reporting service
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Try Again
      </button>
    </main>
  );
}
