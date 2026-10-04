"use client";

import { TriangleAlert } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-cream-deep px-6 py-16 text-center">
      <div className="w-full max-w-[420px] rounded-[18px] border border-line bg-white p-8 shadow-[var(--shadow-default)]">
        <span className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-badge-red-bg text-danger">
          <TriangleAlert size={24} />
        </span>
        <h1 className="m-0 mb-2 font-heading text-[26px] font-semibold text-forest">
          Something Went Wrong
        </h1>
        <p className="mb-6 text-sm text-muted">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="mb-4 text-[11px] text-muted">Ref: {error.digest}</p>
        )}
        <button
          type="button"
          onClick={reset}
          className="inline-block cursor-pointer rounded-full bg-forest px-6 py-[11px] text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-olive"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
