"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

export default function AppMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full mb-4" />
          ))}
        </div>
      </div>
    }>
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </Suspense>
  );
} 