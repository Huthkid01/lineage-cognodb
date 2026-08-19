"use client";

import { ErrorPanel } from "@/components/work-card";

export default function ErrorView({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <ErrorPanel message={error.message || "Unexpected error."} />
      <button
        type="button"
        onClick={reset}
        className="w-fit rounded-full border border-line px-4 py-2 text-sm"
      >
        Try again
      </button>
    </div>
  );
}
