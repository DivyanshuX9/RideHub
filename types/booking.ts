export type RideStatus = 'scheduled' | 'completed' | 'canceled' | 'in-progress';

export type BookingType = 'upcoming' | 'past' | 'canceled';

export interface Booking {
  id: string;
  user_id?: string;
  from_location: string;
  to_location: string;
  service: string;
  ride_type: string;
  price: number;
  distance: number;
  duration: number;
  status: RideStatus;
  // prototype display fields
  date?: string;
  time?: string;
  driverName?: string;
  driverRating?: number;
  vehicleDetails?: string;
}