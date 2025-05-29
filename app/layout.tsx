import AppMain from '@/components/layout/app-main';
import { Navbar } from '@/components/layout/navbar';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RideHub - Your One-Stop Ride Solution',
  description: 'Aggregated ride-sharing and public transport in one seamless platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        inter.className,
        'min-h-screen bg-background antialiased'
      )}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <Providers>
            <AppMain>
              {children}
            </AppMain>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}