"use client";
import { useAuth } from "@/components/auth/auth-context";
import { PaymentMethods } from '@/components/profile/payment-methods';
import { PreferencesForm } from '@/components/profile/preferences-form';
import { ProfileInfo } from '@/components/profile/profile-info';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Zap, CreditCard, Bell } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MOCK_RIDES = [
  { from: 'Connaught Place', to: 'Indira Gandhi International Airport', service: 'Uber', price: '₹487', time: '32 min', date: 'Today, 9:15 AM', rating: 5 },
  { from: 'Hauz Khas', to: 'Cyber City, Gurugram', service: 'Ola', price: '₹312', time: '28 min', date: 'Yesterday, 6:40 PM', rating: 4 },
  { from: 'Lajpat Nagar', to: 'Saket Select Citywalk', service: 'Rapido', price: '₹89', time: '14 min', date: 'Mon, 2:10 PM', rating: 5 },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

function GuestProfile() {
  const { logout } = useAuth();
  const router = useRouter();
  const handleLogout = () => { logout(); router.replace("/login"); };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Guest Profile</h1>
              <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 dark:bg-amber-900/20">
                <Zap className="h-3 w-3 mr-1" /> Guest
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">Preview mode — sign up to save your data</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left — avatar + stats */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                  <Zap className="h-10 w-10 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Guest User</h3>
                  <p className="text-sm text-muted-foreground">Exploring RideHub</p>
                </div>
                <div className="w-full grid grid-cols-3 gap-2 mt-2">
                  {[{ label: 'Rides', value: '3' }, { label: 'Rating', value: '4.8' }, { label: 'km', value: '47' }].map(s => (
                    <div key={s.label} className="rounded-lg bg-muted p-2">
                      <div className="font-bold text-lg">{s.value}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right — tabs */}
          <div className="md:col-span-2">
            <Tabs defaultValue="rides">
              <TabsList className="mb-6">
                <TabsTrigger value="rides">Recent Rides</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
              </TabsList>

              <TabsContent value="rides">
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                  {MOCK_RIDES.map((ride, i) => (
                    <motion.div key={i} variants={item}>
                      <Card className="hover:bg-accent/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 text-sm font-medium truncate">
                                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                                {ride.from}
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground truncate mt-0.5">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                {ride.to}
                              </div>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ride.time}</span>
                                <span>{ride.date}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-semibold">{ride.price}</div>
                              <div className="text-xs text-muted-foreground">{ride.service}</div>
                              <div className="flex items-center justify-end gap-0.5 mt-1">
                                {Array.from({ length: ride.rating }).map((_, j) => (
                                  <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  <motion.div variants={item}>
                    <Card className="border-dashed border-primary/40 bg-primary/5">
                      <CardContent className="p-4 text-center text-sm text-muted-foreground">
                        <Zap className="h-4 w-4 mx-auto mb-1 text-primary" />
                        Sign up to see your real ride history
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </TabsContent>

              <TabsContent value="preferences">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4" />Preferences</CardTitle></CardHeader>
                  <CardContent>
                    <PreferencesForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-4 w-4" />Payment Methods</CardTitle></CardHeader>
                  <CardContent>
                    <PaymentMethods />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, isGuest, hydrated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [user, hydrated, router]);

  if (!hydrated) return null;
  if (!user) return null;
  if (isGuest) return <GuestProfile />;

  const handleLogout = () => { logout(); router.replace("/login"); };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
              <CardContent><ProfileInfo /></CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Tabs defaultValue="preferences" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="payment">Payment Methods</TabsTrigger>
              </TabsList>
              <TabsContent value="preferences">
                <Card>
                  <CardHeader><CardTitle>Your Preferences</CardTitle></CardHeader>
                  <CardContent><PreferencesForm /></CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="payment">
                <Card>
                  <CardHeader><CardTitle>Payment Methods</CardTitle></CardHeader>
                  <CardContent><PaymentMethods /></CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
