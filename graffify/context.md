# RideHub — Repository Context

## What is RideHub?

RideHub is a **ride aggregation platform** (frontend only in this repo). Users can search, compare, and book rides across Uber, Ola, Rapido, Metro, and Bus — all from one interface. The backend is a separate **private** FastAPI + Supabase repository.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui (Radix UI primitives) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Maps | Leaflet + react-leaflet |
| Location Search | Nominatim (OpenStreetMap) |
| Road Routing | OSRM (via backend proxy) |
| Auth | Custom username/password + Google OAuth + Guest mode |
| Auth State | React Context (`AuthContext`) with hydration guard |
| Theme | next-themes with View Transition API ripple |
| Mobile | Capacitor (Android APK) |
| Forms | react-hook-form + zod |
| Data fetching | @tanstack/react-query |

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the RideHub FastAPI backend (default: `http://localhost:8000`) |

Set in `.env.local` (copy from `.env.example`).

---

## NPM Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start Next.js dev server with Turbopack |
| `npm run build` | Production build |
| `npm run build:mobile` | Mobile build (`BUILD_TARGET=mobile`) |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run cap:sync` | Build + sync to Capacitor |
| `npm run cap:android` | Build + open in Android Studio |

---

## Project Structure

```
RideHub/
├── graffify/               ← Agent context hub (this folder)
├── app/
│   ├── layout.tsx          # Root layout: Navbar, ThemeProvider, Providers
│   ├── page.tsx            # Home page (HeroSection, SearchBar, RideOptions, Promotions, RecentRides)
│   ├── providers.tsx       # Wraps children with QueryClientProvider + AuthProvider
│   ├── globals.css         # Global Tailwind CSS
│   ├── login/
│   │   └── page.tsx        # Auth page: guest / Google OAuth / username+password
│   ├── results/
│   │   └── page.tsx        # Ride results: map, filter tabs, ride cards
│   ├── bookings/
│   │   └── page.tsx        # Booking history list
│   └── profile/
│       └── page.tsx        # Profile dashboard (real user or guest mock)
├── components/
│   ├── auth/
│   │   └── auth-context.tsx    # AuthContext: login, signup, loginWithGoogle, loginAsGuest, logout
│   ├── home/
│   │   ├── hero-section.tsx
│   │   ├── search-bar.tsx      # From/To inputs, date picker, Nominatim suggestions
│   │   ├── ride-options.tsx
│   │   ├── promotions-slider.tsx
│   │   └── recent-rides.tsx
│   ├── layout/
│   │   └── navbar.tsx          # Top nav (desktop) + floating bottom pill nav (mobile)
│   ├── results/                # Ride result cards, Leaflet map, filter tabs
│   ├── bookings/               # Booking list UI components
│   ├── profile/                # ProfileInfo, PreferencesForm, PaymentMethods
│   └── ui/                     # shadcn/ui primitives (button, card, dialog, etc.)
├── hooks/
│   ├── use-nominatim.ts        # Debounced Nominatim location search with proximity bias
│   └── use-toast.ts            # Toast notification hook
├── lib/
│   ├── api.ts                  # Exports `API` base URL from NEXT_PUBLIC_API_URL
│   ├── mock-data.tsx           # Fallback/mock ride recommendations for guest mode
│   ├── animations.ts           # Shared Framer Motion variants
│   └── utils.ts                # cn() (clsx + tailwind-merge) and misc helpers
├── types/
│   ├── location.ts             # Location, RideOption, RideRecommendation
│   └── booking.ts              # Booking, RideStatus, BookingType
├── public/                     # Static assets
├── android/                    # Capacitor Android project
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── capacitor.config.ts
└── package.json
```

---

## Key Conventions

- **Path alias**: `@/` maps to the repo root (configured in `tsconfig.json`).
- **Styling**: Always use Tailwind utility classes. Use `cn()` from `lib/utils.ts` for conditional classes.
- **Components**: Use shadcn/ui primitives from `components/ui/`. New components go in `components/<feature>/`.
- **Auth**: Use `useAuth()` hook (from `AuthContext`) to access user state and auth methods.
- **API calls**: Import base URL from `lib/api.ts` (`import API from '@/lib/api'`).
- **Types**: Always import types from `types/` — never inline type definitions in component files.
- **Animations**: Use shared variants from `lib/animations.ts` with Framer Motion.
- **Routing**: Next.js App Router — all routes are `app/<route>/page.tsx`.

---

## Backend API Endpoints (called from frontend)

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Wake/ping backend |
| POST | `/auth/login` | Username+password login |
| POST | `/auth/signup` | Username+password signup |
| GET | `/auth/google` | Start Google OAuth flow |
| GET | `/auth/google/callback` | Google OAuth callback |
| POST | `/route/` | Real road routing (OSRM) → distance, duration, polyline |
| POST | `/rides/search` | Fare calculation for all providers |
| POST | `/bookings/` | Create a booking (saved to Supabase) |
| GET | `/bookings/{uid}` | Fetch user's booking history |

---

## Auth Flow Summary

- **Guest**: instant access, mock profile, no backend calls, stored as `ridehub_guest` in localStorage.
- **Username/Password**: POST `/auth/login` or `/auth/signup` → JWT-free session stored in `ridehub_user` in localStorage. Parsed in `try/catch` to guard against corrupt JSON (resets auth state on parse error).
- **Google OAuth**: redirect to `/auth/google` (backend) → Google consent → callback → redirect to `/login?google_id=...` → `loginWithGoogle()` → stored in context → redirect to `/profile`.
- **Cross-tab sync**: `storage` event listener keeps auth state consistent across tabs.
- **Hydration guard**: profile page waits for localStorage hydration before deciding to redirect.
