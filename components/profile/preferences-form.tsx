'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Zap, Bell } from 'lucide-react';
import { COLOR_PALETTES, DEFAULT_PALETTE_ID } from '@/lib/palette';

const formSchema = z.object({
  defaultRideType: z.string(),
  preferEcoFriendly: z.boolean(),
  notificationsEnabled: z.boolean(),
  paletteId: z.string(),
});

type PreferencesFormValues = z.infer<typeof formSchema>;

const PALETTE_STORAGE_KEY = 'ridehub_palette_id';

const PALETTE_PREVIEW_CLASSES = [
  ['bg-[hsl(246_80%_60%)]', 'bg-[hsl(291_64%_82%)]', 'bg-[hsl(18_100%_80%)]', 'bg-[hsl(340_82%_85%)]', 'bg-[hsl(142_71%_70%)]'],
  ['bg-[hsl(14_90%_58%)]', 'bg-[hsl(36_100%_78%)]', 'bg-[hsl(320_82%_78%)]', 'bg-[hsl(280_65%_64%)]', 'bg-[hsl(198_92%_70%)]'],
  ['bg-[hsl(196_85%_42%)]', 'bg-[hsl(175_60%_76%)]', 'bg-[hsl(152_55%_66%)]', 'bg-[hsl(210_70%_70%)]', 'bg-[hsl(92_48%_58%)]'],
  ['bg-[hsl(155_60%_38%)]', 'bg-[hsl(168_62%_80%)]', 'bg-[hsl(186_85%_72%)]', 'bg-[hsl(120_45%_65%)]', 'bg-[hsl(198_88%_76%)]'],
  ['bg-[hsl(324_72%_52%)]', 'bg-[hsl(350_80%_80%)]', 'bg-[hsl(18_100%_79%)]', 'bg-[hsl(280_65%_63%)]', 'bg-[hsl(342_78%_75%)]'],
  ['bg-[hsl(130_42%_36%)]', 'bg-[hsl(92_30%_74%)]', 'bg-[hsl(44_82%_68%)]', 'bg-[hsl(155_45%_58%)]', 'bg-[hsl(24_72%_60%)]'],
  ['bg-[hsl(222_82%_56%)]', 'bg-[hsl(184_85%_68%)]', 'bg-[hsl(210_28%_72%)]', 'bg-[hsl(268_62%_66%)]', 'bg-[hsl(338_78%_66%)]'],
  ['bg-[hsl(267_70%_62%)]', 'bg-[hsl(285_54%_84%)]', 'bg-[hsl(323_76%_79%)]', 'bg-[hsl(245_90%_75%)]', 'bg-[hsl(188_75%_74%)]'],
  ['bg-[hsl(22_78%_54%)]', 'bg-[hsl(28_42%_78%)]', 'bg-[hsl(12_82%_72%)]', 'bg-[hsl(40_76%_66%)]', 'bg-[hsl(164_40%_58%)]'],
  ['bg-[hsl(84_70%_46%)]', 'bg-[hsl(60_82%_78%)]', 'bg-[hsl(24_92%_72%)]', 'bg-[hsl(150_62%_58%)]', 'bg-[hsl(195_86%_66%)]'],
  ['bg-[hsl(344_82%_58%)]', 'bg-[hsl(350_82%_84%)]', 'bg-[hsl(14_100%_76%)]', 'bg-[hsl(290_68%_68%)]', 'bg-[hsl(200_90%_70%)]'],
  ['bg-[hsl(230_72%_56%)]', 'bg-[hsl(255_54%_80%)]', 'bg-[hsl(200_92%_72%)]', 'bg-[hsl(265_60%_64%)]', 'bg-[hsl(190_84%_62%)]'],
  ['bg-[hsl(38_96%_54%)]', 'bg-[hsl(46_100%_80%)]', 'bg-[hsl(18_92%_72%)]', 'bg-[hsl(320_74%_70%)]', 'bg-[hsl(190_84%_68%)]'],
  ['bg-[hsl(199_90%_54%)]', 'bg-[hsl(203_100%_82%)]', 'bg-[hsl(186_92%_76%)]', 'bg-[hsl(220_70%_72%)]', 'bg-[hsl(155_55%_70%)]'],
  ['bg-[hsl(280_66%_54%)]', 'bg-[hsl(304_42%_80%)]', 'bg-[hsl(322_76%_76%)]', 'bg-[hsl(244_82%_72%)]', 'bg-[hsl(14_90%_70%)]'],
  ['bg-[hsl(156_64%_38%)]', 'bg-[hsl(160_52%_80%)]', 'bg-[hsl(140_80%_68%)]', 'bg-[hsl(186_85%_68%)]', 'bg-[hsl(32_92%_64%)]'],
  ['bg-[hsl(10_92%_60%)]', 'bg-[hsl(24_100%_82%)]', 'bg-[hsl(345_78%_78%)]', 'bg-[hsl(38_100%_68%)]', 'bg-[hsl(186_84%_70%)]'],
  ['bg-[hsl(263_82%_62%)]', 'bg-[hsl(284_64%_84%)]', 'bg-[hsl(223_92%_72%)]', 'bg-[hsl(322_78%_74%)]', 'bg-[hsl(178_76%_68%)]'],
  ['bg-[hsl(220_15%_22%)]', 'bg-[hsl(177_70%_58%)]', 'bg-[hsl(38_96%_58%)]', 'bg-[hsl(339_78%_66%)]', 'bg-[hsl(265_70%_66%)]'],
  ['bg-[hsl(24_88%_62%)]', 'bg-[hsl(32_100%_84%)]', 'bg-[hsl(350_78%_78%)]', 'bg-[hsl(195_88%_72%)]', 'bg-[hsl(142_62%_66%)]'],
] as const;

function buildPalettePreviewClasses(index: number) {
  return PALETTE_PREVIEW_CLASSES[index] ?? PALETTE_PREVIEW_CLASSES[0];
}

export function PreferencesForm() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [paletteId, setPaletteId] = useState(DEFAULT_PALETTE_ID);

  const selectedPalette = useMemo(
    () => COLOR_PALETTES.find(item => item.id === paletteId) ?? COLOR_PALETTES[0],
    [paletteId]
  );

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultRideType: 'UberX',
      preferEcoFriendly: false,
      notificationsEnabled: true,
      paletteId: DEFAULT_PALETTE_ID,
    },
  });

  useEffect(() => {
    const storedPalette = window.localStorage.getItem(PALETTE_STORAGE_KEY);
    const nextPalette = storedPalette && COLOR_PALETTES.some(item => item.id === storedPalette)
      ? storedPalette
      : DEFAULT_PALETTE_ID;

    setPaletteId(nextPalette);
    form.setValue('paletteId', nextPalette);
  }, [form]);

  function onSubmit(values: PreferencesFormValues) {
    setIsSaving(true);
    window.localStorage.setItem(PALETTE_STORAGE_KEY, values.paletteId);
    setPaletteId(values.paletteId);
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: 'Preferences saved', description: `${selectedPalette.name} palette applied` });
    }, 800);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="defaultRideType" render={({ field }) => (
          <FormItem>
            <FormLabel>Default Ride Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Select a ride type" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="UberX">UberX</SelectItem>
                <SelectItem value="UberXL">UberXL</SelectItem>
                <SelectItem value="Ola Mini">Ola Mini</SelectItem>
                <SelectItem value="Rapido">Rapido</SelectItem>
                <SelectItem value="Metro">Metro</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )} />

        <FormField control={form.control} name="preferEcoFriendly" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Zap className="mr-2 h-4 w-4 text-primary" />
                <FormLabel className="font-medium">Prefer Eco-Friendly</FormLabel>
              </div>
              <FormDescription>Prioritize electric and eco-friendly vehicles.</FormDescription>
            </div>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />

        <FormField control={form.control} name="notificationsEnabled" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Bell className="mr-2 h-4 w-4 text-primary" />
                <FormLabel className="font-medium">Ride Notifications</FormLabel>
              </div>
              <FormDescription>Receive notifications about your rides.</FormDescription>
            </div>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />

        <FormField control={form.control} name="paletteId" render={({ field }) => (
          <FormItem>
            <FormLabel>Color Palette</FormLabel>
            <FormDescription>Choose from 20 curated color palettes for the entire app.</FormDescription>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {COLOR_PALETTES.map((palette, index) => {
                const isSelected = field.value === palette.id;
                const previewClasses = buildPalettePreviewClasses(index);
                return (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() => {
                      field.onChange(palette.id);
                      setPaletteId(palette.id);
                      window.localStorage.setItem(PALETTE_STORAGE_KEY, palette.id);
                    }}
                    className={`group rounded-xl border p-2 text-left transition-all ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'}`}
                  >
                    <div className="mb-2 flex gap-1">
                      {previewClasses.map((className, swatchIndex) => (
                        <span
                          key={`${palette.id}-${swatchIndex}`}
                          className={`h-5 flex-1 rounded-full ${className}`}
                        />
                      ))}
                    </div>
                    <div className="text-sm font-semibold leading-none">{palette.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{palette.description}</div>
                  </button>
                );
              })}
            </div>
          </FormItem>
        )} />

        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </form>
    </Form>
  );
}
