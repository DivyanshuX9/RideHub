'use client';

import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
      {/* Background with parallax effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/40 z-0"
      >
        <div className="absolute inset-0 bg-[url('/images/pexels-photo-city.jpeg')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        {/* City pattern overlay */}
        <div className="absolute inset-0 bg-[url('/images/pexels-photo-street.jpeg')] bg-cover bg-center opacity-10" />
      </div>
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          >
            One App, All Your Rides
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
          >
            Compare prices, ETAs, and book rides across all services in seconds.
            Your one-stop solution for seamless urban mobility.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-md mx-auto">
              {['Uber', 'Ola', 'Rapido','Metro','Bus','Trams'].map((service, index) => (
                <motion.div
                  key={service}
                  className="flex flex-col items-center justify-center p-3 md:p-4 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <span className="font-medium text-sm md:text-base">{service}</span>
                </motion.div>
              ))}
            </div> */}
          </motion.div>
        </motion.div>
      </div>
      {/* Wave overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-auto"
          style={{ top: 1.1, right: 0 }}
        >
          <path
            fill="hsl(var(--background))"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,224C672,224,768,192,864,170.7C960,149,1056,139,1152,149.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}