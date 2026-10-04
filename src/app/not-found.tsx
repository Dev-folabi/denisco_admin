import Link from "next/link";
import { Signpost } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-cream-deep px-6 py-16 text-center">
      <div className="w-full max-w-[420px] rounded-[18px] border border-line bg-white p-8 shadow-[var(--shadow-default)]">
        <span className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-cream-deep text-forest">
          <Signpost size={24} />
        </span>
        <h1 className="m-0 mb-2 font-heading text-[26px] font-semibold text-forest">
          Page Not Found
        </h1>
        <p className="mb-6 text-sm text-muted">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-full bg-forest px-6 py-[11px] text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-olive"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
