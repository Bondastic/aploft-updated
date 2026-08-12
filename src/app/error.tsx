"use client";

import { ErrorFallback } from "../components/ErrorBoundary";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <ErrorFallback onReset={reset} />
    </div>
  );
}
