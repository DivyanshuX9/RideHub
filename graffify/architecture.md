# RideHub — Architecture & Component Reference

## Page Map

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Home: hero, search bar, ride options, promotions, recent rides |
| `/login` | `app/login/page.tsx` | Auth: guest / Google / username+password |
| `/results` | `app/results/page.tsx` | Ride results with Leaflet map, filter tabs, ride cards |
| `/bookings` | `app/bookings/page.tsx` | Booking history (requires auth) |
| `/profile` | `app/profile/page.tsx` | Profile dashboard (real user or guest mock) |

---

## Component Tree

```
app/layout.tsx
└── ThemeProvider (next-themes)
    └── Providers (QueryClientProvider + AuthProvider)
        ├── Navbar (components/layout/navbar.tsx)
        │   ├── Desktop nav links
        │   └── Mobile floating pill nav
        └── <page children>

app/page.tsx (Home)
├── HeroSection
├── SearchBar          ← useNominatim hook, geolocation, date picker
├── RideOptions
├── PromotionsSlider
└── RecentRides

app/results/page.tsx
├── Filter tabs (Fastest / Cheapest / Eco / Public)
├── Leaflet Map        ← road polyline overlay
└── Ride Cards         ← per provider (Uber, Ola, Rapido, Metro, Bus)

app/login/page.tsx
├── Guest login button
├── Google OAuth button
└── Username/Password form  ← react-hook-form + zod

app/bookings/page.tsx
└── Booking list       ← fetches GET /bookings/{uid}

app/profile/page.tsx
├── ProfileInfo
├── PreferencesForm
└── PaymentMethods
```

---

## Data Flow: Ride Search

```
SearchBar (app/page.tsx)
  │  User enters From/To, optional schedule time
  │  useNominatim → GET Nominatim API (browser, proximity-biased)
  │
  ▼
/results page (app/results/page.tsx)
  │
  ├── POST /route/  (backend → OSRM)
  │     → { distance_km, duration_min, polyline }
  │
  ├── POST /rides/search  (backend → fare engine)
  │     → [ { service, type, price, eta, distance } ]
  │
  ├── Leaflet map renders polyline
  └── Ride cards rendered + filter tabs applied
```

---

## Data Flow: Booking

```
/results page
  │  User clicks "Book" on a ride card
  ▼
POST /bookings/  (backend → Supabase)
  → { booking_id }
  │
  ▼
/bookings page
  GET /bookings/{uid}
  → [ Booking[] ]
```

---

## Auth Context API (`components/auth/auth-context.tsx`)

```ts
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

Usage in any component:
```ts
import { useAuth } from '@/components/auth/auth-context';
const { user, login, logout } = useAuth();
```

---

## Hooks

### `use-nominatim.ts`
Debounced location search using the OpenStreetMap Nominatim API.
- Accepts a query string and optional user coordinates for proximity bias.
- Returns `{ results, isLoading }` where results are sorted by distance to the user.

### `use-toast.ts`
Wrapper around the shadcn/ui toast system. Returns `{ toast }`.

---

## Key Library Utilities

### `lib/utils.ts`
```ts
cn(...inputs): string   // clsx + tailwind-merge — use for all conditional class strings
```

### `lib/api.ts`
```ts
const API: string       // = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
```

### `lib/animations.ts`
Shared Framer Motion animation variants (fadeIn, slideUp, stagger, etc.) — import and apply via `variants` prop.

### `lib/mock-data.tsx`
Fallback ride options used in guest mode or when the backend is unavailable.

---

## Mobile (Capacitor)

- `capacitor.config.ts` — app ID `com.ridehub.app`, webDir `out`.
- `BUILD_TARGET=mobile` triggers static export in `next.config.js`.
- Google OAuth does **not** work in the Capacitor in-app browser — use username/password or guest mode on Android.

---

## Configuration Files

| File | Purpose |
|---|---|
| `next.config.js` | Next.js config; static export when `BUILD_TARGET=mobile` |
| `tailwind.config.ts` | Theme tokens, dark mode class, shadcn/ui content paths |
| `tsconfig.json` | `@/` alias → repo root |
| `capacitor.config.ts` | Capacitor app settings |
| `.eslintrc.json` | ESLint rules (extends next/core-web-vitals) |
| `components.json` | shadcn/ui component configuration |
