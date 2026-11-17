'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COOKIE_CONSENT_KEY = 'ridehub_cookie_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        // Small delay so it doesn't pop up abruptly on initial load
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage disabled / private mode
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'all');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'essential');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 p-5 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl text-card-foreground"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <Cookie className="h-5 w-5" />
            </div>
            <div className="flex-1 pr-6">
              <h3 className="text-sm font-semibold flex items-center gap-1.5">
                We value your privacy
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                RideHub uses essential cookies and local storage to keep your session authenticated, remember route preferences, and provide accurate real-time transit comparisons across Uber, Ola, Rapido, Buses and Metro.
              </p>
            </div>
            <button
              type="button"
              onClick={handleEssentialOnly}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
              aria-label="Dismiss cookie notice with essential cookies only"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleEssentialOnly}
              className="text-xs h-8 px-3"
            >
              Essential Only
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleAcceptAll}
              className="text-xs h-8 px-4"
            >
              Accept All
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
