"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-16 h-8 rounded-full bg-[var(--input)] border border-[var(--border)] animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="relative flex items-center h-8 w-16 p-1 rounded-full bg-[var(--input)] border border-[var(--border)] hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer shadow-inner"
    >
      {/* Sliding pill indicator */}
      <span
        className={`absolute top-1 w-6 h-6 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-sm flex items-center justify-center transition-all duration-200 ease-out ${
          isDark ? "left-9" : "left-1"
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-slate-200" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-600" />
        )}
      </span>

      {/* Background icons */}
      <div className="w-full flex justify-between px-1.5 text-slate-400 pointer-events-none">
        <Sun className="w-3 h-3 opacity-60" />
        <Moon className="w-3 h-3 opacity-60" />
      </div>
    </button>
  );
}
