export type ColorPalette = {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  ring: string;
  chart: [string, string, string, string, string];
};

export const COLOR_PALETTES: ColorPalette[] = [
  { id: 'aurora', name: 'Aurora', description: 'Cool electric blue with violet accents', primary: '246 80% 60%', secondary: '291 64% 82%', accent: '18 100% 80%', ring: '246 80% 60%', chart: ['246 80% 60%', '291 64% 70%', '18 100% 80%', '340 82% 85%', '142 71% 70%'] },
  { id: 'sunset', name: 'Sunset', description: 'Warm coral and amber tones', primary: '14 90% 58%', secondary: '36 100% 78%', accent: '320 82% 78%', ring: '14 90% 58%', chart: ['14 90% 58%', '36 100% 62%', '320 82% 78%', '280 65% 64%', '198 92% 70%'] },
  { id: 'ocean', name: 'Ocean', description: 'Deep teal and sea glass', primary: '196 85% 42%', secondary: '175 60% 76%', accent: '152 55% 66%', ring: '196 85% 42%', chart: ['196 85% 42%', '175 60% 58%', '152 55% 66%', '210 70% 70%', '92 48% 58%'] },
  { id: 'mint', name: 'Mint', description: 'Fresh green with soft cyan', primary: '155 60% 38%', secondary: '168 62% 80%', accent: '186 85% 72%', ring: '155 60% 38%', chart: ['155 60% 38%', '168 62% 62%', '186 85% 72%', '120 45% 65%', '198 88% 76%'] },
  { id: 'berry', name: 'Berry', description: 'Rich berry and magenta', primary: '324 72% 52%', secondary: '350 80% 80%', accent: '18 100% 79%', ring: '324 72% 52%', chart: ['324 72% 52%', '350 80% 68%', '18 100% 79%', '280 65% 63%', '342 78% 75%'] },
  { id: 'forest', name: 'Forest', description: 'Grounded green and moss', primary: '130 42% 36%', secondary: '92 30% 74%', accent: '44 82% 68%', ring: '130 42% 36%', chart: ['130 42% 36%', '92 30% 56%', '44 82% 68%', '155 45% 58%', '24 72% 60%'] },
  { id: 'midnight', name: 'Midnight', description: 'Blue-black with cyan highlights', primary: '222 82% 56%', secondary: '210 28% 72%', accent: '184 85% 68%', ring: '222 82% 56%', chart: ['222 82% 56%', '184 85% 56%', '210 28% 58%', '268 62% 66%', '338 78% 66%'] },
  { id: 'lavender', name: 'Lavender', description: 'Soft lilac and orchid', primary: '267 70% 62%', secondary: '285 54% 84%', accent: '323 76% 79%', ring: '267 70% 62%', chart: ['267 70% 62%', '285 54% 70%', '323 76% 79%', '245 90% 75%', '188 75% 74%'] },
  { id: 'copper', name: 'Copper', description: 'Earthy copper and clay', primary: '22 78% 54%', secondary: '28 42% 78%', accent: '12 82% 72%', ring: '22 78% 54%', chart: ['22 78% 54%', '28 42% 62%', '12 82% 72%', '40 76% 66%', '164 40% 58%'] },
  { id: 'lime', name: 'Lime', description: 'Bright lime with citrus energy', primary: '84 70% 46%', secondary: '60 82% 78%', accent: '24 92% 72%', ring: '84 70% 46%', chart: ['84 70% 46%', '60 82% 64%', '24 92% 72%', '150 62% 58%', '195 86% 66%'] },
  { id: 'rose', name: 'Rose', description: 'Soft pink with punchy red', primary: '344 82% 58%', secondary: '350 82% 84%', accent: '14 100% 76%', ring: '344 82% 58%', chart: ['344 82% 58%', '350 82% 70%', '14 100% 76%', '290 68% 68%', '200 90% 70%'] },
  { id: 'indigo', name: 'Indigo', description: 'Classic indigo and azure', primary: '230 72% 56%', secondary: '255 54% 80%', accent: '200 92% 72%', ring: '230 72% 56%', chart: ['230 72% 56%', '255 54% 68%', '200 92% 72%', '265 60% 64%', '190 84% 62%'] },
  { id: 'amber', name: 'Amber', description: 'Golden amber and honey', primary: '38 96% 54%', secondary: '46 100% 80%', accent: '18 92% 72%', ring: '38 96% 54%', chart: ['38 96% 54%', '46 100% 64%', '18 92% 72%', '320 74% 70%', '190 84% 68%'] },
  { id: 'sky', name: 'Sky', description: 'Light blue and powder tones', primary: '199 90% 54%', secondary: '203 100% 82%', accent: '186 92% 76%', ring: '199 90% 54%', chart: ['199 90% 54%', '203 100% 68%', '186 92% 76%', '220 70% 72%', '155 55% 70%'] },
  { id: 'plum', name: 'Plum', description: 'Deep plum and mauve', primary: '280 66% 54%', secondary: '304 42% 80%', accent: '322 76% 76%', ring: '280 66% 54%', chart: ['280 66% 54%', '304 42% 70%', '322 76% 76%', '244 82% 72%', '14 90% 70%'] },
  { id: 'emerald', name: 'Emerald', description: 'Bright emerald and jade', primary: '156 64% 38%', secondary: '160 52% 80%', accent: '140 80% 68%', ring: '156 64% 38%', chart: ['156 64% 38%', '160 52% 60%', '140 80% 68%', '186 85% 68%', '32 92% 64%'] },
  { id: 'coral', name: 'Coral', description: 'Playful coral and peach', primary: '10 92% 60%', secondary: '24 100% 82%', accent: '345 78% 74%', ring: '10 92% 60%', chart: ['10 92% 60%', '24 100% 66%', '345 78% 74%', '38 100% 68%', '186 84% 70%'] },
  { id: 'violet', name: 'Violet', description: 'Royal violet and blue', primary: '263 82% 62%', secondary: '284 64% 84%', accent: '223 92% 72%', ring: '263 82% 62%', chart: ['263 82% 62%', '284 64% 72%', '223 92% 72%', '322 78% 74%', '178 76% 68%'] },
  { id: 'charcoal', name: 'Charcoal', description: 'Muted modern charcoal with neon accents', primary: '220 15% 22%', secondary: '220 14% 76%', accent: '177 70% 58%', ring: '220 15% 22%', chart: ['220 15% 22%', '177 70% 58%', '38 96% 58%', '339 78% 66%', '265 70% 66%'] },
  { id: 'peach', name: 'Peach', description: 'Soft peach and apricot', primary: '24 88% 62%', secondary: '32 100% 84%', accent: '350 78% 78%', ring: '24 88% 62%', chart: ['24 88% 62%', '32 100% 70%', '350 78% 78%', '195 88% 72%', '142 62% 66%'] },
];

export const DEFAULT_PALETTE_ID = 'aurora';
