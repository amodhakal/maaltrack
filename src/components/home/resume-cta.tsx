"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "maaltrack:game:v1";

function hasStartedGame() {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { started?: boolean; players?: unknown[] };
    return parsed.started === true && Array.isArray(parsed.players) && parsed.players.length >= 2;
  } catch {
    return false;
  }
}

export function ResumeCta() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read local browser state after mount
    setStarted(hasStartedGame());
  }, []);

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <Link
        href="/play"
        className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {started ? "Resume game" : "Play now"}
      </Link>
      <a
        href="#how-it-works"
        className="inline-flex h-12 items-center justify-center rounded-md border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        How it works
      </a>
    </div>
  );
}
