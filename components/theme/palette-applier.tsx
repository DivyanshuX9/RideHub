"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

const STORAGE_KEY = "ridehub_palette_id";

const COLOR_PALETTES = [
  { id: 'aurora', primary: '246 80% 60%', secondary: '291 64% 82%', accent: '18 100% 80%', ring: '246 80% 60%', chart: ['246 80% 60%', '291 64% 70%', '18 100% 80%', '340 82% 85%', '142 71% 70%'] as [string,string,string,string,string] },
  { id: 'sunset', primary: '14 90% 58%', secondary: '36 100% 78%', accent: '320 82% 78%', ring: '14 90% 58%', chart: ['14 90% 58%', '36 100% 62%', '320 82% 78%', '280 65% 64%', '198 92% 70%'] as [string,string,string,string,string] },
  { id: 'ocean', primary: '196 85% 42%', secondary: '175 60% 76%', accent: '152 55% 66%', ring: '196 85% 42%', chart: ['196 85% 42%', '175 60% 58%', '152 55% 66%', '210 70% 70%', '92 48% 58%'] as [string,string,string,string,string] },
];

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
