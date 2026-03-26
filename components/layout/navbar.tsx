'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, User, Calendar, Map, Moon, Sun, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Search', href: '/results', icon: Map },
  { name: 'Bookings', href: '/bookings', icon: Calendar },
  { name: 'Profile', href: '/profile', icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // x/y come directly from the click event — always the exact button position
  const toggleTheme = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const style = document.createElement('style');
    style.textContent = `
      ::view-transition-old(root) { animation: none; }
      ::view-transition-new(root) {
        animation: theme-ripple 0.6s ease-in-out forwards;
        clip-path: circle(0px at ${x}px ${y}px);
      }
      @keyframes theme-ripple {
        to { clip-path: circle(200vmax at ${x}px ${y}px); }
      }
    `;
    document.head.appendChild(style);
    document.startViewTransition(() => {
      setTheme(nextTheme);
    }).finished.finally(() => style.remove());
  }, [theme, setTheme]);

  const ThemeIcon = () => (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={theme}
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        exit={{ opacity: 0, rotate: 90 }}
        transition={{ duration: 0.2 }}
      >
        {mounted && theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <>
      {/* Desktop top navbar */}
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:block',
          scrolled ? 'bg-background/80 backdrop-blur-md border-b shadow-sm' : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-16 md:h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-1 hover:opacity-80 transition-opacity">
              <Car className="h-6 w-6" />
              <span className="font-bold text-lg">RideHub</span>
            </Link>

            <div className="flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href} passHref>
                    <Button variant={isActive ? 'default' : 'ghost'} size="sm" className="relative">
                      <span className="flex items-center">
                        <Icon className="h-4 w-4 mr-2" />
                        {link.name}
                      </span>
                      {isActive && (
                        <motion.div className="absolute bottom-0 left-0 h-0.5 bg-primary w-full" layoutId="navbar-underline" />
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>

            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              <ThemeIcon />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile top bar */}
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:hidden',
          scrolled ? 'bg-background/80 backdrop-blur-md border-b shadow-sm' : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-1 hover:opacity-80 transition-opacity">
            <Car className="h-5 w-5" />
            <span className="font-bold">RideHub</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            <ThemeIcon />
          </Button>
        </div>
      </motion.header>

      {/* Mobile floating bottom nav */}
      <div className="fixed bottom-5 left-0 right-0 z-50 md:hidden flex justify-center pointer-events-none">
        <nav className="pointer-events-auto flex items-center gap-1 px-3 py-2 rounded-full bg-background/80 backdrop-blur-xl border border-border shadow-2xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center justify-center px-4 py-1.5 rounded-xl transition-all duration-200 gap-0.5',
                  isActive ? 'bg-primary/10' : 'hover:bg-accent'
                )}
              >
                <motion.div
                  animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -1 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-muted-foreground')} />
                </motion.div>
                <span className={cn('text-[10px] leading-none', isActive ? 'text-primary font-semibold' : 'text-muted-foreground')}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
