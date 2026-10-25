import { Navbar } from '@/components/layout/navbar';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { Providers } from './providers';
import { Suspense } from 'react';

const inter = { className: 'font-sans' };

export const metadata: Metadata = {
  metadataBase: new URL('https://ride-hub-rho.vercel.app'),
  title: {
    default: 'RideHub | Compare & Book Cabs, Autos & Public Transport',
    template: '%s | RideHub',
  },
  description:
    'Compare real-time prices, ETAs, and routes across Uber, Ola, Rapido, Metro, and Buses. Book the fastest or cheapest ride in seconds.',
  keywords: [
    'RideHub',
    'ride aggregator',
    'compare cabs India',
    'Uber vs Ola',
    'Rapido bike taxi',
    'metro routes',
    'bus booking',
    'fare comparison',
    'Delhi rides',
    'Gurugram cabs',
    'public transport aggregator',
  ],
  authors: [{ name: 'RideHub Team', url: 'https://ride-hub-rho.vercel.app' }],
  creator: 'RideHub',
  publisher: 'RideHub',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://ride-hub-rho.vercel.app',
    siteName: 'RideHub',
    title: 'RideHub - Compare & Book Cabs, Autos & Public Transport',
    description:
      'Compare real-time fares and ETAs across Uber, Ola, Rapido, Metro, and public transit in one app.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RideHub Urban Mobility Aggregator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RideHub - One App, All Your Rides',
    description: 'Compare fares and ETAs across Uber, Ola, Rapido, and public transport in seconds.',
    images: ['/og-image.png'],
    creator: '@ridehub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='black'/><g transform='translate(4,4)'><path d='M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><circle cx='7' cy='17' r='2' fill='none' stroke='white' stroke-width='2'/><path d='M9 17h6' fill='none' stroke='white' stroke-width='2' stroke-linecap='round'/><circle cx='17' cy='17' r='2' fill='none' stroke='white' stroke-width='2'/></g></svg>",
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'RideHub',
  url: 'https://ride-hub-rho.vercel.app',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
  description:
    'Aggregated ride-sharing and public transit platform to compare prices and ETAs across Uber, Ola, Rapido, Metro, and Buses.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className + ' min-h-screen bg-background antialiased'}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Providers>
            <Navbar />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
              {children}
            </Suspense>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
