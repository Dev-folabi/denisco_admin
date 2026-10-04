"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useState that persists to localStorage. Reads the stored value after mount
 * (avoiding SSR hydration mismatches), then keeps it in sync on every change.
 */
export function usePersistedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!loaded.current) {
        loaded.current = true;
        try {
          const raw = window.localStorage.getItem(key);
          if (raw && !cancelled) setValue(JSON.parse(raw) as T);
        } catch {
          // ignore corrupt/ unavailable storage
        }
        return;
      }
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // ignore quota/ unavailable storage
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key, value]);

  return [value, setValue] as const;
}
