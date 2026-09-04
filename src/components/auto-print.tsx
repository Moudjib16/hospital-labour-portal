"use client";

import { useEffect, useRef } from "react";

let firedForPath: string | null = null;

export function AutoPrint({
  enabled = false,
  documentTitle,
}: {
  enabled?: boolean;
  documentTitle?: string;
}) {
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

    const originalTitle = document.title;
    if (documentTitle) document.title = documentTitle;
    window.print();
    document.title = originalTitle;
  }, [enabled, documentTitle]);

  return null;
}
