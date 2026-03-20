'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Zap, Bell } from 'lucide-react';

const formSchema = z.object({
  defaultRideType: z.string(),
  preferEcoFriendly: z.boolean(),
  notificationsEnabled: z.boolean(),
});

type PreferencesFormValues = z.infer<typeof formSchema>;

export function PreferencesForm() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultRideType: 'UberX',
      preferEcoFriendly: false,
      notificationsEnabled: true,
    },
  });

  function onSubmit(_values: PreferencesFormValues) {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: 'Preferences saved' });
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

        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </form>
    </Form>
  );
}
