'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, User, Calendar, Map, Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinks = [
    { name: 'Home', href: '/', icon: <Car className="h-4 w-4 mr-2" /> },
    { name: 'Search', href: '/results', icon: <Map className="h-4 w-4 mr-2" /> },
    { name: 'Bookings', href: '/bookings', icon: <Calendar className="h-4 w-4 mr-2" /> },
    { name: 'Profile', href: '/profile', icon: <User className="h-4 w-4 mr-2" /> },
  ];
  
  const NavbarContent = () => (
    <>
      <div className="flex items-center space-x-1">
        <Car className="h-6 w-6" />
        <span className="font-bold text-lg">RideHub</span>
      </div>
      
      <div className="hidden md:flex items-center space-x-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <Link key={link.href} href={link.href} passHref>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className="relative"
              >
                <span className="flex items-center">
                  {link.icon}
                  {link.name}
                </span>
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-primary w-full"
                    layoutId="navbar-underline"
                  />
                )}
              </Button>
            </Link>
          );
        })}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
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
        </Button>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col">
            <div className="flex flex-col space-y-4 mt-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                
                return (
                  <Link key={link.href} href={link.href} passHref>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="lg"
                      className="justify-start w-full"
                    >
                      {link.icon}
                      {link.name}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
  
  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-md border-b shadow-sm" : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="h-16 md:h-20 flex items-center justify-between">
          <NavbarContent />
        </div>
      </div>
    </motion.header>
  );
}