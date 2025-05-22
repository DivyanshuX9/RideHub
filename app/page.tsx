import { HeroSection } from '@/components/home/hero-section';
import { SearchBar } from '@/components/home/search-bar';
import { RideOptions } from '@/components/home/ride-options';
import { RecentRides } from '@/components/home/recent-rides';
import { PromotionsSlider } from '@/components/home/promotions-slider';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      <section className="relative z-10 px-4 md:px-6 lg:px-8 -mt-20">
        <div className="max-w-7xl mx-auto">
          <SearchBar />
        </div>
      </section>
      
      <section className="px-4 md:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Available Ride Options</h2>
          <RideOptions />
        </div>
      </section>
      
      <section className="px-4 md:px-6 lg:px-8 py-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Special Offers</h2>
          <PromotionsSlider />
        </div>
      </section>
      
      <section className="px-4 md:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Recent Rides</h2>
          <RecentRides />
        </div>
      </section>
    </div>
  );
}