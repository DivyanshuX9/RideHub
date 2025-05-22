export type RideService = 'uber' | 'ola' | 'rapido' | 'metro' | 'bus' | 'train';

export type RideStatus = 'scheduled' | 'completed' | 'canceled' | 'in-progress';

export type BookingType = 'upcoming' | 'past' | 'canceled';

export interface Booking {
  id: string;
  from: string;
  to: string;
  service: RideService;
  status: RideStatus;
  date: string;
  time: string;
  price: number;
  distance: number;
  duration: number;
  driverName?: string;
  driverRating?: number;
  vehicleDetails?: string;
}