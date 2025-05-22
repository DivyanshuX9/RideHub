'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userProfile } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { Zap, Bell, Wallet } from 'lucide-react';

const formSchema = z.object({
  defaultRideType: z.string(),
  preferEcoFriendly: z.boolean(),
  notificationsEnabled: z.boolean(),
  autoTip: z.number().min(0).max(25),
  preferredPaymentMethod: z.string(),
});

type PreferencesFormValues = z.infer<typeof formSchema>;

export function PreferencesForm() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize form with user preferences
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultRideType: userProfile.preferences.defaultRideType,
      preferEcoFriendly: userProfile.preferences.preferEcoFriendly,
      notificationsEnabled: userProfile.preferences.notificationsEnabled,
      autoTip: userProfile.preferences.autoTip,
      preferredPaymentMethod: userProfile.preferences.preferredPaymentMethod,
    },
  });
  
  function onSubmit(values: PreferencesFormValues) {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved successfully.",
      });
    }, 1000);
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="defaultRideType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Ride Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a ride type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="UberX">UberX</SelectItem>
                  <SelectItem value="UberXL">UberXL</SelectItem>
                  <SelectItem value="Ola Mini">Ola Mini</SelectItem>
                  <SelectItem value="Rapido">Rapido</SelectItem>
                  <SelectItem value="Metro">Metro</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This will be your default ride type when searching.
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="preferEcoFriendly"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Zap className="mr-2 h-4 w-4 text-primary" />
                  <FormLabel className="font-medium">Prefer Eco-Friendly Options</FormLabel>
                </div>
                <FormDescription>
                  Prioritize electric and eco-friendly vehicles when available.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notificationsEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Bell className="mr-2 h-4 w-4 text-primary" />
                  <FormLabel className="font-medium">Ride Notifications</FormLabel>
                </div>
                <FormDescription>
                  Receive notifications about your rides and promotions.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="autoTip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Tip Percentage</FormLabel>
              <div className="flex items-center space-x-4">
                <FormControl>
                  <Slider
                    min={0}
                    max={25}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(values) => field.onChange(values[0])}
                  />
                </FormControl>
                <div className="w-12 text-center font-medium">
                  {field.value}%
                </div>
              </div>
              <FormDescription>
                Automatically apply this tip percentage to your rides.
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="preferredPaymentMethod"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <Wallet className="mr-2 h-4 w-4 text-primary" />
                <FormLabel>Default Payment Method</FormLabel>
              </div>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="card_1">Visa •••• 4242</SelectItem>
                  <SelectItem value="card_2">Mastercard •••• 8123</SelectItem>
                  <SelectItem value="upi_1">Google Pay (alex@okbank)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This will be selected by default when booking rides.
              </FormDescription>
            </FormItem>
          )}
        />
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}