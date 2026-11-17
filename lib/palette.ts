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
  { id: 'aurora', name: 'Aurora', description: 'Cool energetic blue with clean slate accents', primary: '221.2 83.2% 53.3%', secondary: '210 40% 96.1%', accent: '210 40% 96.1%', ring: '221.2 83.2% 53.3%', chart: ['221.2 83.2% 53.3%', '199 89% 48%', '142 76% 36%', '262 83% 58%', '24 95% 53%'] },
  { id: 'sunset', name: 'Sunset', description: 'Warm coral and amber tones', primary: '14 85% 44%', secondary: '24 50% 96%', accent: '24 50% 96%', ring: '14 85% 44%', chart: ['14 85% 44%', '36 100% 62%', '320 82% 78%', '280 65% 64%', '198 92% 70%'] },
  { id: 'ocean', name: 'Ocean', description: 'Deep teal and sea glass', primary: '196 85% 42%', secondary: '190 40% 96%', accent: '190 40% 96%', ring: '196 85% 42%', chart: ['196 85% 42%', '175 60% 58%', '152 55% 66%', '210 70% 70%', '92 48% 58%'] },
  { id: 'mint', name: 'Mint', description: 'Fresh green with soft cyan', primary: '155 60% 38%', secondary: '150 35% 96%', accent: '150 35% 96%', ring: '155 60% 38%', chart: ['155 60% 38%', '168 62% 62%', '186 85% 72%', '120 45% 65%', '198 88% 76%'] },
  { id: 'berry', name: 'Berry', description: 'Rich berry and magenta', primary: '324 72% 50%', secondary: '324 25% 96%', accent: '324 25% 96%', ring: '324 72% 50%', chart: ['324 72% 50%', '350 80% 68%', '18 100% 79%', '280 65% 63%', '342 78% 75%'] },
  { id: 'forest', name: 'Forest', description: 'Grounded green and moss', primary: '130 42% 36%', secondary: '130 25% 96%', accent: '130 25% 96%', ring: '130 42% 36%', chart: ['130 42% 36%', '92 30% 56%', '44 82% 68%', '155 45% 58%', '24 72% 60%'] },
  { id: 'midnight', name: 'Midnight', description: 'Blue-black with cyan highlights', primary: '222 82% 54%', secondary: '222 25% 96%', accent: '222 25% 96%', ring: '222 82% 54%', chart: ['222 82% 54%', '184 85% 56%', '210 28% 58%', '268 62% 66%', '338 78% 66%'] },
  { id: 'lavender', name: 'Lavender', description: 'Soft lilac and orchid', primary: '267 65% 50%', secondary: '267 25% 96%', accent: '267 25% 96%', ring: '267 65% 50%', chart: ['267 65% 50%', '285 54% 70%', '323 76% 79%', '245 90% 75%', '188 75% 74%'] },
  { id: 'copper', name: 'Copper', description: 'Earthy copper and clay', primary: '22 78% 50%', secondary: '22 30% 96%', accent: '22 30% 96%', ring: '22 78% 50%', chart: ['22 78% 50%', '28 42% 62%', '12 82% 72%', '40 76% 66%', '164 40% 58%'] },
  { id: 'lime', name: 'Lime', description: 'Bright lime with citrus energy', primary: '84 80% 32%', secondary: '84 30% 96%', accent: '84 30% 96%', ring: '84 80% 32%', chart: ['84 80% 32%', '60 82% 64%', '24 92% 72%', '150 62% 58%', '195 86% 66%'] },
  { id: 'rose', name: 'Rose', description: 'Soft pink with punchy red', primary: '344 80% 46%', secondary: '344 30% 96%', accent: '344 30% 96%', ring: '344 80% 46%', chart: ['344 80% 46%', '350 82% 70%', '14 100% 76%', '290 68% 68%', '200 90% 70%'] },
  { id: 'indigo', name: 'Indigo', description: 'Classic indigo and azure', primary: '230 72% 54%', secondary: '230 30% 96%', accent: '230 30% 96%', ring: '230 72% 54%', chart: ['230 72% 54%', '255 54% 68%', '200 92% 72%', '265 60% 64%', '190 84% 62%'] },
  { id: 'amber', name: 'Amber', description: 'Golden amber and honey', primary: '36 95% 38%', secondary: '38 40% 96%', accent: '38 40% 96%', ring: '36 95% 38%', chart: ['36 95% 38%', '46 100% 64%', '18 92% 72%', '320 74% 70%', '190 84% 68%'] },
  { id: 'sky', name: 'Sky', description: 'Light blue and powder tones', primary: '199 90% 40%', secondary: '199 35% 96%', accent: '199 35% 96%', ring: '199 90% 40%', chart: ['199 90% 40%', '203 100% 68%', '186 92% 76%', '220 70% 72%', '155 55% 70%'] },
  { id: 'plum', name: 'Plum', description: 'Deep plum and mauve', primary: '280 66% 50%', secondary: '280 25% 96%', accent: '280 25% 96%', ring: '280 66% 50%', chart: ['280 66% 50%', '304 42% 70%', '322 76% 76%', '244 82% 72%', '14 90% 70%'] },
  { id: 'emerald', name: 'Emerald', description: 'Bright emerald and jade', primary: '156 64% 38%', secondary: '156 30% 96%', accent: '156 30% 96%', ring: '156 64% 38%', chart: ['156 64% 38%', '160 52% 60%', '140 80% 68%', '186 85% 68%', '32 92% 64%'] },
  { id: 'coral', name: 'Coral', description: 'Playful coral and peach', primary: '10 85% 44%', secondary: '10 35% 96%', accent: '10 35% 96%', ring: '10 85% 44%', chart: ['10 85% 44%', '24 100% 66%', '345 78% 74%', '38 100% 68%', '186 84% 70%'] },
  { id: 'violet', name: 'Violet', description: 'Royal violet and blue', primary: '263 75% 52%', secondary: '263 25% 96%', accent: '263 25% 96%', ring: '263 75% 52%', chart: ['263 75% 52%', '284 64% 72%', '223 92% 72%', '322 78% 74%', '178 76% 68%'] },
  { id: 'charcoal', name: 'Charcoal', description: 'Muted modern charcoal with neon accents', primary: '220 15% 22%', secondary: '220 14% 96%', accent: '220 14% 96%', ring: '220 15% 22%', chart: ['220 15% 22%', '177 70% 58%', '38 96% 58%', '339 78% 66%', '265 70% 66%'] },
  { id: 'peach', name: 'Peach', description: 'Soft peach and apricot', primary: '24 85% 42%', secondary: '24 35% 96%', accent: '24 35% 96%', ring: '24 85% 42%', chart: ['24 85% 42%', '32 100% 70%', '350 78% 78%', '195 88% 72%', '142 62% 66%'] },
];

export const DEFAULT_PALETTE_ID = 'aurora';
