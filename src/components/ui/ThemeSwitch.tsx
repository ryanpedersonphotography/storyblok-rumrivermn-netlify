"use client";

import { useEffect, useMemo, useState } from "react";

type ThemeChoice = "light" | "dark" | "system";

const STORAGE_KEY = "theme";
const isBrowser = typeof window !== "undefined";

function getSystemTheme(): "light" | "dark" {
  if (!isBrowser) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(choice: ThemeChoice) {
  if (!isBrowser) return;
  const root = document.documentElement;

  // Compute effective theme
  const effective = choice === "system" ? getSystemTheme() : choice;

  // Reflect on <html>
  root.setAttribute("data-theme", effective);
  // Let the UA widgets (scrollbars, form controls) match
  root.style.setProperty("color-scheme", effective === "dark" ? "dark" : "light");

  // Optional: set an attribute so CSS can show current mode
  root.setAttribute("data-theme-choice", choice);
}

export function useTheme() {
  const [choice, setChoice] = useState<ThemeChoice>(() => {
    if (!isBrowser) return "system";
    return (localStorage.getItem(STORAGE_KEY) as ThemeChoice) || "system";
  });

  const effective = useMemo(() => (choice === "system" ? getSystemTheme() : choice), [choice]);

  useEffect(() => {
    // Apply immediately and persist
    applyTheme(choice);
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {}
  }, [choice]);

  // Keep in sync with OS when in "system"
  useEffect(() => {
    if (!isBrowser) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (choice === "system") applyTheme("system");
    };
    mql.addEventListener?.("change", onChange);
    // Fallback for very old Safari:
    // @ts-ignore
    mql.addListener?.(onChange);
    return () => {
      mql.removeEventListener?.("change", onChange);
      // @ts-ignore
      mql.removeListener?.(onChange);
    };
  }, [choice]);

  const cycle = () => {
    setChoice(prev => (prev === "light" ? "dark" : prev === "dark" ? "system" : "light"));
  };

  const set = (next: ThemeChoice) => setChoice(next);

  return { choice, effective, cycle, set };
}

export default function ThemeSwitch() {
  const { choice, effective, cycle, set } = useTheme();

  return (
    <div className="cluster" style={{ gap: "var(--space-12)", alignItems: "center" }}>
      <button
        type="button"
        className="button"
        data-variant="ghost"
        aria-label="Toggle theme"
        title="Toggle theme (Light → Dark → System)"
        onClick={cycle}
      >
        {choice === "light" && "☀️ Light"}
        {choice === "dark" && "🌒 Dark"}
        {choice === "system" && `🖥️ System (${effective})`}
      </button>

      <div className="inline" style={{ ["--gap" as any]: "var(--space-8)" }}>
        <button type="button" className="button" data-size="sm" onClick={() => set("light")} aria-pressed={choice==="light"}>
          Light
        </button>
        <button type="button" className="button" data-size="sm" onClick={() => set("dark")} aria-pressed={choice==="dark"}>
          Dark
        </button>
        <button type="button" className="button" data-size="sm" onClick={() => set("system")} aria-pressed={choice==="system"}>
          System
        </button>
      </div>
    </div>
  );
}
