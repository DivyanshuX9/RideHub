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
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='black'/><g transform='translate(4,4)'><path d='M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><circle cx='7' cy='17' r='2' fill='none' stroke='white' stroke-width='2'/><path d='M9 17h6' fill='none' stroke='white' stroke-width='2' stroke-linecap='round'/><circle cx='17' cy='17' r='2' fill='none' stroke='white' stroke-width='2'/></g></svg>",
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
