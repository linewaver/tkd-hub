"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

// Temporary: use the first studio found. Will be replaced with auth-based studio selection.
export function useStudioId() {
  const [studioId, setStudioId] = useState<string | null>(null);

  useEffect(() => {
    // Get studio ID from localStorage or fallback
    const stored = localStorage.getItem("tkdhub_studio_id");
    if (stored) {
      setStudioId(stored);
    }
  }, []);

  const setAndPersist = (id: string) => {
    localStorage.setItem("tkdhub_studio_id", id);
    setStudioId(id);
  };

  return { studioId, setStudioId: setAndPersist };
}
