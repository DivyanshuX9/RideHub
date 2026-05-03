# RideHub — TypeScript Types & Interfaces

All types live in `types/`. Always import from there rather than defining inline.

---

## `types/booking.ts`

```ts
type RideStatus = 'scheduled' | 'completed' | 'canceled' | 'in-progress';

type BookingType = 'upcoming' | 'past' | 'canceled';

interface Booking {
  id: string;
  user_id?: string;
  from_location: string;
  to_location: string;
  service: string;          // "Uber" | "Ola" | "Rapido" | "Metro" | "Bus"
  ride_type: string;        // e.g. "UberGo", "OlaMini", "Rapido Bike"
  price: number;
  distance: number;         // km
  duration: number;         // minutes
  status: RideStatus;
  // Prototype display-only fields (not stored in backend):
  date?: string;
  time?: string;
  driverName?: string;
  driverRating?: number;
  vehicleDetails?: string;
}
```

---

## `types/location.ts`

```ts
interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface RideOption {
  id: string;
  service: string;
  type: string;
  estimatedTime: number;    // minutes
  estimatedPrice: number;   // INR
  distance: number;         // km
  ecoFriendly: boolean;
  icon: string;             // emoji or icon identifier
}

interface RideRecommendation {
  service: string;
  type: string;
  estimatedPrice: number;
  estimatedTime: number;
  distance: number;
  available: boolean;
}
```

---

## Auth-related types (inferred from `components/auth/auth-context.tsx`)

```ts
interface User {
  id: string;
  username?: string;
  google_id?: string;
  email?: string;
  // additional profile fields as returned by backend /auth/login or /auth/signup
}

interface AuthContextValue {
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  login(username: string, password: string): Promise<void>;
  signup(username: string, password: string): Promise<void>;
  loginWithGoogle(google_id: string): void;
  loginAsGuest(): void;
  logout(): void;
}
```

---

## Backend API Response shapes (inferred from usage)

### `POST /route/` response
```ts
interface RouteResponse {
  distance_km: number;
  duration_min: number;
  polyline: [number, number][];   // array of [lat, lng] coordinate pairs
}
```

### `POST /rides/search` response
```ts
// Returns an array of RideRecommendation[]
```

### `POST /bookings/` response
```ts
interface CreateBookingResponse {
  booking_id: string;
}
```

---

## Nominatim result shape (from `hooks/use-nominatim.ts`)

```ts
interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  // additional OSM fields omitted
}
```

---

## CSS module declaration (`types/css.d.ts`)

Declares `*.module.css` as `{ [key: string]: string }` for TypeScript compatibility.
