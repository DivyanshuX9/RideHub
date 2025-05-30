import { OlaLogo } from '@/components/logos/OlaLogo';
import { RapidoLogo } from '@/components/logos/RapidoLogo';
import { UberLogo } from '@/components/logos/UberLogo';
import { Booking } from '@/types/booking';
import { Location, RideOption, RideRecommendation } from '@/types/location';
import { Bike, Bus, Car, Train, Zap } from 'lucide-react';

// Frequently used locations
export const popularLocations: Location[] = [
  {
    id: '1',
    name: 'Downtown Metro Station',
    address: '123 Main St, Downtown',
    coordinates: { lat: 40.7128, lng: -74.006 }
  },
  {
    id: '2',
    name: 'Central Park',
    address: '5th Ave, Midtown',
    coordinates: { lat: 40.7812, lng: -73.9665 }
  },
  {
    id: '3',
    name: 'Business District',
    address: '456 Commerce Ave',
    coordinates: { lat: 40.7551, lng: -73.9884 }
  },
  {
    id: '4',
    name: 'Airport Terminal',
    address: 'International Airport',
    coordinates: { lat: 40.6413, lng: -73.7781 }
  },
  {
    id: '5',
    name: 'University Campus',
    address: '789 College Blvd',
    coordinates: { lat: 40.7291, lng: -73.9965 }
  }
];

// Function to get ride recommendations based on locations
export const getRideRecommendations = (from: string, to: string): RideRecommendation[] => {
  // Calculate a mock distance based on location strings
  const mockDistance = (Math.random() * 10 + 5).toFixed(1);
  const mockDuration = Math.floor(Math.random() * 30 + 15);

  return [
    {
      service: 'uber',
      type: 'UberX',
      estimatedPrice: 25.50,
      estimatedTime: 15,
      distance: parseFloat(mockDistance),
      available: true
    },
    {
      service: 'uber',
      type: 'UberXL',
      estimatedPrice: 35.75,
      estimatedTime: 20,
      distance: parseFloat(mockDistance),
      available: true
    },
    {
      service: 'ola',
      type: 'Mini',
      estimatedPrice: 22.30,
      estimatedTime: 18,
      distance: parseFloat(mockDistance),
      available: true
    },
    {
      service: 'ola',
      type: 'Sedan',
      estimatedPrice: 28.50,
      estimatedTime: 16,
      distance: parseFloat(mockDistance),
      available: true
    },
    {
      service: 'rapido',
      type: 'Bike',
      estimatedPrice: 15.00,
      estimatedTime: 12,
      distance: parseFloat(mockDistance),
      available: true
    },
    {
      service: 'metro',
      type: 'Public',
      estimatedPrice: 5.50,
      estimatedTime: mockDuration,
      distance: parseFloat(mockDistance),
      available: true
    },
    {
      service: 'bus',
      type: 'Public',
      estimatedPrice: 3.75,
      estimatedTime: mockDuration + 10,
      distance: parseFloat(mockDistance),
      available: true
    }
  ];
};

// Recent user searches
export const recentSearches = [
  { from: 'Home', to: 'Office' },
  { from: 'Downtown Metro', to: 'Shopping Mall' },
  { from: 'Airport', to: 'Hotel Grand' }
];

// Available ride options
export const rideOptions: RideOption[] = [
  {
    id: '1',
    service: 'Uber',
    type: 'UberX',
    estimatedTime: 15,
    estimatedPrice: 25.50,
    distance: 7.2,
    ecoFriendly: false,
    icon: 'car-front'
  },
  {
    id: '2',
    service: 'Uber',
    type: 'UberXL',
    estimatedTime: 17,
    estimatedPrice: 35.75,
    distance: 7.2,
    ecoFriendly: false,
    icon: 'car-front'
  },
  {
    id: '3',
    service: 'Ola',
    type: 'Mini',
    estimatedTime: 12,
    estimatedPrice: 22.30,
    distance: 7.2,
    ecoFriendly: false,
    icon: 'car-front'
  },
  {
    id: '4',
    service: 'Rapido',
    type: 'Bike',
    estimatedTime: 10,
    estimatedPrice: 15.00,
    distance: 7.2,
    ecoFriendly: true,
    icon: 'bike'
  },
  {
    id: '5',
    service: 'Metro',
    type: 'Public',
    estimatedTime: 25,
    estimatedPrice: 5.50,
    distance: 8.5,
    ecoFriendly: true,
    icon: 'train'
  },
  {
    id: '6',
    service: 'Bus',
    type: 'Public',
    estimatedTime: 35,
    estimatedPrice: 3.75,
    distance: 8.0,
    ecoFriendly: true,
    icon: 'bus'
  },
  {
    id: '7',
    service: 'Uber',
    type: 'Green',
    estimatedTime: 18,
    estimatedPrice: 28.50,
    distance: 7.2,
    ecoFriendly: true,
    icon: 'zap'
  }
];

// Promotional offers
export const promotions = [
  {
    id: '1',
    title: '50% Off First Ride',
    description: 'New users get 50% off their first ride (up to $10)',
    code: 'FIRST50',
    validUntil: '2025-05-30',
    image: 'https://images.pexels.com/photos/1444256/pexels-photo-1444256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    title: 'Weekend Special',
    description: '20% off all rides this weekend with code WKND20',
    code: 'WKND20',
    validUntil: '2025-04-30',
    image: 'https://images.pexels.com/photos/1051075/pexels-photo-1051075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '3',
    title: 'Eco-Friendly Discount',
    description: '15% off when you choose green transportation options',
    code: 'GOGREEN',
    validUntil: '2025-06-15',
    image: 'https://images.pexels.com/photos/3621344/pexels-photo-3621344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

// User's recent rides
export const recentRides: Booking[] = [
  {
    id: '1',
    from: 'Home',
    to: 'Office',
    service: 'uber',
    status: 'completed',
    date: '2025-03-21',
    time: '09:15 AM',
    price: 24.50,
    distance: 7.2,
    duration: 18,
    driverName: 'Michael S.',
    driverRating: 4.8,
    vehicleDetails: 'Toyota Camry (ABC 123)'
  },
  {
    id: '2',
    from: 'Office',
    to: 'Shopping Mall',
    service: 'ola',
    status: 'completed',
    date: '2025-03-19',
    time: '06:30 PM',
    price: 18.75,
    distance: 5.8,
    duration: 15,
    driverName: 'Sarah J.',
    driverRating: 4.9,
    vehicleDetails: 'Honda Civic (XYZ 789)'
  },
  {
    id: '3',
    from: 'Shopping Mall',
    to: 'Home',
    service: 'metro',
    status: 'completed',
    date: '2025-03-19',
    time: '08:45 PM',
    price: 4.50,
    distance: 6.2,
    duration: 22,
  }
];

// User's bookings
export const userBookings: Booking[] = [
  // Upcoming bookings
  {
    id: '101',
    from: 'Home',
    to: 'Airport',
    service: 'uber',
    status: 'scheduled',
    date: '2025-04-15',
    time: '06:30 AM',
    price: 45.00,
    distance: 18.5,
    duration: 35,
    driverName: 'Pending Assignment',
    driverRating: 0,
    vehicleDetails: 'Pending Assignment'
  },
  {
    id: '102',
    from: 'Office',
    to: 'Client Meeting',
    service: 'ola',
    status: 'scheduled',
    date: '2025-04-08',
    time: '02:00 PM',
    price: 22.50,
    distance: 8.2,
    duration: 20,
    driverName: 'Pending Assignment',
    driverRating: 0,
    vehicleDetails: 'Pending Assignment'
  },
  
  // Past bookings
  {
    id: '201',
    from: 'Home',
    to: 'Office',
    service: 'uber',
    status: 'completed',
    date: '2025-03-15',
    time: '08:45 AM',
    price: 23.75,
    distance: 7.2,
    duration: 19,
    driverName: 'Robert K.',
    driverRating: 4.7,
    vehicleDetails: 'Hyundai Sonata (DEF 456)'
  },
  {
    id: '202',
    from: 'Gym',
    to: 'Home',
    service: 'rapido',
    status: 'completed',
    date: '2025-03-12',
    time: '07:30 PM',
    price: 12.50,
    distance: 3.5,
    duration: 10,
    driverName: 'David L.',
    driverRating: 4.9,
    vehicleDetails: 'Honda CBR (MNO 789)'
  },
  {
    id: '203',
    from: 'Office',
    to: 'Restaurant',
    service: 'ola',
    status: 'completed',
    date: '2025-03-10',
    time: '01:15 PM',
    price: 14.25,
    distance: 4.8,
    duration: 12,
    driverName: 'Lisa P.',
    driverRating: 4.8,
    vehicleDetails: 'Maruti Swift (GHI 123)'
  },
  {
    id: '204',
    from: 'Restaurant',
    to: 'Office',
    service: 'metro',
    status: 'completed',
    date: '2025-03-10',
    time: '02:30 PM',
    price: 4.75,
    distance: 5.2,
    duration: 18,
  },
  {
    id: '205',
    from: 'Friend\'s House',
    to: 'Home',
    service: 'bus',
    status: 'completed',
    date: '2025-03-08',
    time: '11:45 PM',
    price: 3.50,
    distance: 7.8,
    duration: 30,
  },
  
  // Canceled bookings
  {
    id: '301',
    from: 'Home',
    to: 'Mall',
    service: 'uber',
    status: 'canceled',
    date: '2025-03-18',
    time: '11:30 AM',
    price: 18.25,
    distance: 6.4,
    duration: 15,
  },
  {
    id: '302',
    from: 'Office',
    to: 'Conference Center',
    service: 'ola',
    status: 'canceled',
    date: '2025-03-05',
    time: '09:00 AM',
    price: 26.50,
    distance: 9.2,
    duration: 22,
  }
];

// User profile and preferences
export const userProfile = {
  id: '12345',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  memberSince: '2023-11-15',
  totalRides: 42,
  savedLocations: [
    { id: 'home', name: 'Home', address: '123 Residence Ave, Apt 4B', coordinates: { lat: 40.7128, lng: -74.006 } },
    { id: 'work', name: 'Office', address: '456 Corporate Plaza, 12th Floor', coordinates: { lat: 40.7551, lng: -73.9884 } },
    { id: 'gym', name: 'Gym', address: '789 Fitness Blvd', coordinates: { lat: 40.7392, lng: -73.9903 } }
  ],
  preferences: {
    defaultRideType: 'UberX',
    preferEcoFriendly: true,
    notificationsEnabled: true,
    autoTip: 15,
    preferredPaymentMethod: 'card_1'
  }
};

// Payment methods
export const paymentMethods = [
  { 
    id: 'card_1', 
    type: 'credit', 
    provider: 'visa', 
    last4: '4242', 
    expiryMonth: 11, 
    expiryYear: 2026, 
    isDefault: true 
  },
  { 
    id: 'card_2', 
    type: 'credit', 
    provider: 'mastercard', 
    last4: '8123', 
    expiryMonth: 3, 
    expiryYear: 2025, 
    isDefault: false 
  },
  { 
    id: 'upi_1', 
    type: 'upi', 
    provider: 'googlepay', 
    upiId: 'alex@okbank', 
    isDefault: false 
  }
];

// Helper function to get icon component by name
export const getIconByName = (iconName: string): JSX.Element => {
  switch (iconName) {
    case 'uber':
      return <UberLogo className="h-10 w-10" />;
    case 'ola':
      return <OlaLogo className="h-12 w-12" />;
    case 'rapido':
      return <RapidoLogo className="h-9 w-9" />;
    case 'train':
      return <Train className="h-10 w-10" />;
    case 'bus':
      return <Bus className="h-10 w-10" />;
    case 'car-front':
      return <Car className="h-8 w-8" />;
    case 'bike':
      return <Bike className="h-8 w-8" />;
    case 'zap':
      return <Zap className="h-8 w-8" />;
    default:
      return <Car className="h-8 w-8" />;
  }
};

// Helper function to get bookings by type
export const getBookingsByType = (type: 'upcoming' | 'past' | 'canceled'): Booking[] => {
  switch (type) {
    case 'upcoming':
      return userBookings.filter(booking => booking.status === 'scheduled' || booking.status === 'in-progress');
    case 'past':
      return userBookings.filter(booking => booking.status === 'completed');
    case 'canceled':
      return userBookings.filter(booking => booking.status === 'canceled');
    default:
      return [];
  }
};

// Helper function to filter ride options
export const filterRideOptions = (filter: 'fastest' | 'cheapest' | 'eco'): RideOption[] => {
  switch (filter) {
    case 'fastest':
      return [...rideOptions].sort((a, b) => a.estimatedTime - b.estimatedTime);
    case 'cheapest':
      return [...rideOptions].sort((a, b) => a.estimatedPrice - b.estimatedPrice);
    case 'eco':
      return rideOptions.filter(option => option.ecoFriendly);
    default:
      return rideOptions;
  }
};