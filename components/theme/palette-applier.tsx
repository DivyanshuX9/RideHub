"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { COLOR_PALETTES, DEFAULT_PALETTE_ID } from "@/lib/palette";

const STORAGE_KEY = "ridehub_palette_id";

function applyPalette(paletteId: string, theme: string) {
  const palette = COLOR_PALETTES.find(item => item.id === paletteId) ?? COLOR_PALETTES[0];
  const root = document.documentElement;
  // Only override accent colors — never touch background/foreground/card
  // so dark mode black palette is always preserved
  root.style.setProperty("--primary", palette.primary);
  root.style.setProperty("--ring", palette.ring);
  root.style.setProperty("--chart-1", palette.chart[0]);
  root.style.setProperty("--chart-2", palette.chart[1]);
  root.style.setProperty("--chart-3", palette.chart[2]);
  root.style.setProperty("--chart-4", palette.chart[3]);
  root.style.setProperty("--chart-5", palette.chart[4]);
  // In light mode also apply secondary/accent; in dark keep them neutral
  if (theme !== 'dark') {
    root.style.setProperty("--secondary", palette.secondary);
    root.style.setProperty("--accent", palette.accent);
  } else {
    root.style.removeProperty("--secondary");
    root.style.removeProperty("--accent");
  }
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
