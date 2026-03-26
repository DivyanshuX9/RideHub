import { Navbar } from '@/components/layout/navbar';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RideHub - Your One-Stop Ride Solution',
  description: 'Aggregated ride-sharing and public transport in one seamless platform',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚗</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + ' min-h-screen bg-background antialiased'}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Navbar />
          <Providers>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
              {children}
            </Suspense>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
