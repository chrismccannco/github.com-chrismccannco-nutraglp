"use client";

import { useRef, useEffect, useState, useCallback } from "react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutosave(
  saveFn: () => Promise<void>,
  deps: unknown[],
  delay = 2000
) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRender = useRef(true);

  const save = useCallback(async () => {
    setStatus("saving");
    try {
      await saveFn();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }, [saveFn]);

  useEffect(() => {
    // Skip autosave on first render (initial load)
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(save, delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return status;
}
