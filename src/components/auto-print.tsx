"use client";

import { useEffect, useRef } from "react";

let firedForPath: string | null = null;

export function AutoPrint({ enabled = false }: { enabled?: boolean }) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (firedRef.current) return;
    if (firedForPath === window.location.pathname) return;
    firedRef.current = true;
    firedForPath = window.location.pathname;

    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search.replace(/[?&]print=1/, "").replace(/^&/, "?")
    );

    window.print();
  }, [enabled]);

  return null;
}
