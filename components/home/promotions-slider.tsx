'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { promotions } from '@/lib/mock-data';
import { fadeInUp } from '@/lib/animations';

export function PromotionsSlider() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true); // Ensure client-only rendering for dynamic content

    const carouselElement = carouselRef.current;
    if (carouselElement) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fadeInUp(carouselElement);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(carouselElement);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div ref={carouselRef} className="py-4">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {promotions.map((promo) => (
            <CarouselItem key={promo.id} className="sm:basis-1/2 lg:basis-1/3">
              <div className="p-2">
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <Card className="overflow-hidden border-0 shadow-md">
                    <div className="relative h-48 w-full">
                      <Image
                        src={promo.image}
                        alt={promo.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <Badge
                        className="absolute top-4 right-4"
                        variant="secondary"
                      >
                        {promo.code}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">
                        {promo.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {promo.description}
                      </p>
                      <div className="flex justify-between items-center w-full">
                        {hydrated ? (
                          <span className="text-xs text-muted-foreground">
                            Valid until{' '}
                            {new Date(promo.validUntil).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Loading...</span>
                        )}
                        <Button size="sm" variant="outline">
                          Apply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
