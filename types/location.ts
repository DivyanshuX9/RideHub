export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface RideOption {
  id: string;
  service: string;
  type: string;
  estimatedTime: number;
  estimatedPrice: number;
  distance: number;
  ecoFriendly: boolean;
  icon: string;
}

export interface RideRecommendation {
  service: string;
  type: string;
  estimatedPrice: number;
  estimatedTime: number;
  distance: number;
  available: boolean;
}