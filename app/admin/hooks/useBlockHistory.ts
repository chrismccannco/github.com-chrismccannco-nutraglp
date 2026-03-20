"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Block } from "@/lib/types/blocks";

interface HistoryState {
  past: Block[][];
  present: Block[];
  future: Block[][];
}

const MAX_HISTORY = 50;

export function useBlockHistory(initial: Block[]) {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initial,
    future: [],
  });

  // Sync when external data arrives (initial load)
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current && initial.length > 0) {
      initialized.current = true;
      setHistory({ past: [], present: initial, future: [] });
    }
  }, [initial]);

  const set = useCallback((next: Block[]) => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present].slice(-MAX_HISTORY),
      present: next,
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const newPast = [...prev.past];
      const previous = newPast.pop()!;
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future].slice(0, MAX_HISTORY),
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const newFuture = [...prev.future];
      const next = newFuture.shift()!;
      return {
        past: [...prev.past, prev.present].slice(-MAX_HISTORY),
        present: next,
        future: newFuture,
      };
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  return {
    blocks: history.present,
    set,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    historyLength: history.past.length,
  };
}
