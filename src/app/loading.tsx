export default function Loading() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-cream-deep">
      <span
        className="size-9 animate-spin rounded-full border-[3px] border-line border-t-forest"
        aria-label="Loading"
      />
    </main>
  );
}
