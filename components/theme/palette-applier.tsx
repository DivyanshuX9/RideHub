"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { COLOR_PALETTES, DEFAULT_PALETTE_ID } from "@/lib/palette";

const STORAGE_KEY = "ridehub_palette_id";

function applyPalette(paletteId: string, theme: string) {
  const palette = COLOR_PALETTES.find(item => item.id === paletteId) ?? COLOR_PALETTES[0];
  const root = document.documentElement;
  if (theme === 'dark') {
    // Dark mode: only apply palette to charts, keep everything else from CSS
    root.style.removeProperty("--primary");
    root.style.removeProperty("--secondary");
    root.style.removeProperty("--accent");
    root.style.removeProperty("--ring");
  } else {
    // Light mode: apply full palette
    root.style.setProperty("--primary", palette.primary);
    root.style.setProperty("--secondary", palette.secondary);
    root.style.setProperty("--accent", palette.accent);
    root.style.setProperty("--ring", palette.ring);
  }
  root.style.setProperty("--chart-1", palette.chart[0]);
  root.style.setProperty("--chart-2", palette.chart[1]);
  root.style.setProperty("--chart-3", palette.chart[2]);
  root.style.setProperty("--chart-4", palette.chart[3]);
  root.style.setProperty("--chart-5", palette.chart[4]);
}

export function PaletteApplier() {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const currentTheme = resolvedTheme ?? theme ?? 'dark';
    const syncPalette = () => {
      const storedPalette = window.localStorage.getItem(STORAGE_KEY);
      const paletteId = storedPalette && COLOR_PALETTES.some(item => item.id === storedPalette)
        ? storedPalette
        : DEFAULT_PALETTE_ID;
      applyPalette(paletteId, currentTheme);
    };

    syncPalette();
    window.addEventListener("storage", syncPalette);
    return () => window.removeEventListener("storage", syncPalette);
  }, [theme, resolvedTheme]);

  return null;
}
