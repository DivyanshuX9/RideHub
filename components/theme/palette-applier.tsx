"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import { COLOR_PALETTES } from "@/lib/palette";

const STORAGE_KEY = "ridehub_palette_id";

function applyPalette(paletteId: string, theme: string) {
  const palette = COLOR_PALETTES.find(p => p.id === paletteId) ?? COLOR_PALETTES[0];
  const root = document.documentElement;
  if (theme === 'dark') {
    // Dark mode: remove all overrides, let globals.css dark vars take full control
    ['--primary','--secondary','--accent','--ring','--chart-1','--chart-2','--chart-3','--chart-4','--chart-5']
      .forEach(v => root.style.removeProperty(v));
  } else {
    root.style.setProperty('--primary', palette.primary);
    root.style.setProperty('--secondary', palette.secondary);
    root.style.setProperty('--accent', palette.accent);
    root.style.setProperty('--ring', palette.ring);
    palette.chart.forEach((c, i) => root.style.setProperty(`--chart-${i + 1}`, c));
  }
}

export function PaletteApplier() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const sync = () => {
      const stored = window.localStorage.getItem(STORAGE_KEY) ?? 'aurora';
      applyPalette(stored, resolvedTheme ?? 'dark');
    };
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [resolvedTheme]);

  return null;
}
