# RideHub : Frontend Repository

RideHub is a ride aggregation platform that lets users search, compare, and book rides across Uber, Ola, Rapido, Metro, and Bus — all from one interface. It uses real road routing via OSRM, live location autocomplete via Nominatim, and a FastAPI backend with Supabase for persistence.

---

## Flow Diagram

```
User opens RideHub
        │
        ▼
┌───────────────────┐
│   Auth Check      │  localStorage → ridehub_user
└───────┬───────────┘
        │
   ┌────┴─────┐
   │          │
Not logged   Logged in
   │          │
   ▼          ▼
/login      Home Page
   │
   ├── Guest  ──────────────────────────────────────────┐
   │   (instant, no backend, mock profile data)         │
   │                                                    │
   ├── Google OAuth ──► /auth/google (backend) ─────────┤
   │                    Google consent screen           │
   │                    /auth/google/callback           │
   │                    redirect → /login?google_id=... │
   │                    loginWithGoogle() → context     │
   │                    redirect → /profile             │
   │                                                    │
   └── Username/Password                                │
       wakeBackend() ping /health                       │
       POST /auth/login or /auth/signup                 │
       JWT-free session stored in localStorage          │
       redirect → /profile                             │
                                                        │
                    ┌───────────────────────────────────┘
                    ▼
             /profile (dashboard)
                    │
                    ▼
              Home Page (/)
                    │
                    ▼
        ┌───────────────────────┐
        │      Search Bar       │
        │  From: [input]  📍    │  ← Nominatim autocomplete
        │  To:   [input]        │    proximity-biased to user coords
        │  [Now / Schedule]     │    sorted by distance client-side
        │  [Search →]           │
        └──────────┬────────────┘
                   │
                   ▼
           GET browser geolocation
           (silent, for proximity bias)
                   │
                   ▼
        ┌──────────────────────┐
        │   /results page      │
        │                      │
        │  POST /route/        │  ← OSRM real road routing
        │  → distance_km       │    polyline coordinates
        │  → duration_min      │    interstate detection
        │  → polyline          │
        │                      │
        │  POST /rides/search  │  ← Fare calculation
        │  → Uber, Ola,        │    based on real distance
        │    Rapido, Metro, Bus│
        │                      │
        │  [Filter tabs]       │  Fastest / Cheapest / Eco / Public
        │  [Leaflet Map]       │  Road polyline overlay
        │  [Ride Cards]        │
        └──────────┬───────────┘
                   │
              Click "Book"
                   │
                   ▼
        ┌──────────────────────┐
        │  POST /bookings/     │  ← Saved to Supabase
        │  → booking_id        │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │   /bookings page     │
        │  GET /bookings/{uid} │  ← Fetched from Supabase
        └──────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| Icons | Lucide React |
| Maps | Leaflet + react-leaflet |
| Location Search | Nominatim (OpenStreetMap) |
| Road Routing | OSRM (via backend) |
| Auth | Custom username/password + Google OAuth + Guest mode |
| Auth State | React Context (AuthContext) with hydration guard |
| Theme | next-themes with View Transition API ripple |
| Mobile | Capacitor (Android) |

---

## Features

- **Unified ride search** — compare Uber, Ola, Rapido, Metro, Bus side by side
- **Real road routing** — actual road distance and ETA via OSRM, not straight-line
- **Proximity-biased autocomplete** — Nominatim results sorted by distance to user
- **My location** — one-tap geolocation fill for the From field
- **Guest mode** — instant access with mock profile data, zero backend calls
- **Google OAuth** — sign in with Google via backend redirect flow → redirects to `/profile`
- **Username/Password auth** — signup and login with bcrypt-hashed passwords
- **Hydration-safe auth guard** — profile page waits for localStorage hydration before redirecting
- **Theme ripple** — light/dark toggle expands as a circle from the button using View Transition API
- **Floating bottom nav** — pill-shaped dynamic island nav on mobile
- **Scheduled rides** — pick a future date and time for later bookings
- **Booking history** — persisted per user in Supabase
- **Android app** — Capacitor wraps the web app into a native Android APK

---

## Project Structure

```
RideHub/
├── app/
│   ├── layout.tsx          # Root layout, Navbar, ThemeProvider
│   ├── page.tsx            # Home page with SearchBar
│   ├── login/page.tsx      # Auth page (guest / Google / username)
│   ├── results/page.tsx    # Ride results, map, filters
│   ├── bookings/page.tsx   # Booking history
│   └── profile/page.tsx    # Profile (real or guest mock)
├── components/
│   ├── auth/
│   │   └── auth-context.tsx    # Auth state, login, signup, guest, logout
│   ├── home/
│   │   └── search-bar.tsx      # From/To inputs, date picker, suggestions
│   ├── layout/
│   │   └── navbar.tsx          # Top nav (desktop) + floating bottom nav (mobile)
│   ├── results/                # Ride cards, map, filter tabs
│   ├── bookings/               # Booking list components
│   └── profile/                # ProfileInfo, PreferencesForm, PaymentMethods
├── hooks/
│   └── use-nominatim.ts        # Debounced location search with proximity bias
├── lib/
│   ├── mock-data.tsx           # Fallback ride recommendations
│   └── utils.ts                # cn() and helpers
└── types/
    ├── location.ts             # RideRecommendation, LocationResult types
    └── booking.ts              # Booking type
```

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/DivyanshuX9/RideHub.git
cd RideHub/RideHub

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000

# 4. Run
npm run dev
# → http://localhost:3000
```

> Make sure the backend is running at the URL set in `NEXT_PUBLIC_API_URL`.

---

## Mobile (Android)

The app is wrapped with Capacitor for Android.

```bash
# Build static export and open in Android Studio
npm run cap:android
```

**Prerequisites:** Android Studio + JDK 17+

> Google OAuth does not work inside the Capacitor in-app browser. Use username/password or guest login in the mobile app.

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the RideHub backend API |

See `.env.example` for the template.

> For Google OAuth locally, also set `BACKEND_URL=http://localhost:8000` and `FRONTEND_URL=http://localhost:3000` in the backend `.env`, and register `http://localhost:8000/auth/google/callback` in Google Cloud Console.

---

## Contribution Guidelines

1. Fork the repo and create a feature branch off `master`
2. Follow existing code style — TypeScript, Tailwind, Framer Motion
3. Keep components small and colocated with their page where possible
4. Submit a pull request with a clear description

---

## License

MIT License — see [LICENSE](LICENSE)

---

## Author

Divyanshu Sharma — divyanshu88999@gmail.com
