# RideHub — Commit Roadmap

100 commits you can make across **Frontend** (`RideHub`) and **Backend** (`RideHub_Backend`), each with the exact git commands to run.

---

## Frontend Commits (`RideHub`)

> Run all commands from `c:\webdeb\RideHub\RideHub`

---

### 🔐 Auth & Security

**1. Password strength indicator on signup**
```bash
git add components/auth/auth-context.tsx app/login/page.tsx
git commit -m "feat: add password strength indicator on signup form"
git push origin master
```

**2. Confirm password field with match validation**
```bash
git add app/login/page.tsx
git commit -m "feat: add confirm password field on signup with match validation"
git push origin master
```

**3. Inline error messages for login failures**
```bash
git add app/login/page.tsx
git commit -m "feat: show inline error messages for login failures instead of alert"
git push origin master
```

**4. Forgot password placeholder page**
```bash
git add app/forgot-password/page.tsx
git commit -m "feat: add forgot password placeholder page with coming soon state"
git push origin master
```

**5. Auto-redirect logged-in users away from /login**
```bash
git add app/login/page.tsx
git commit -m "feat: auto-redirect logged-in users away from /login to home"
git push origin master
```

**6. Persist guest session across browser tabs**
```bash
git add components/auth/auth-context.tsx
git commit -m "feat: persist guest session across browser tabs using storage event"
git push origin master
```

**7. Logout confirmation dialog**
```bash
git add components/auth/auth-context.tsx components/layout/navbar.tsx
git commit -m "feat: add logout confirmation dialog before clearing session"
git push origin master
```

**8. Clear stale user on 401 response**
```bash
git add components/auth/auth-context.tsx lib/api.ts
git commit -m "fix: clear stale ridehub_user from localStorage on 401 response"
git push origin master
```

**9. Username avatar initials in navbar**
```bash
git add components/layout/navbar.tsx
git commit -m "feat: show username avatar initials in navbar when logged in"
git push origin master
```

**10. Session expiry toast**
```bash
git add components/auth/auth-context.tsx
git commit -m "feat: add session expiry notice toast when session_token is invalid"
git push origin master
```

---

### 🔍 Search & Location

**11. Debounce Nominatim search to 400ms**
```bash
git add hooks/use-nominatim.ts
git commit -m "feat: debounce nominatim search to 400ms to reduce API calls"
git push origin master
```

**12. Swap from/to locations button**
```bash
git add components/home/search-bar.tsx
git commit -m "feat: add swap from/to locations button between inputs"
git push origin master
```

**13. Remember last 3 searched locations**
```bash
git add components/home/search-bar.tsx hooks/use-nominatim.ts
git commit -m "feat: remember last 3 searched locations in localStorage"
git push origin master
```

**14. Recent searches dropdown**
```bash
git add components/home/search-bar.tsx
git commit -m "feat: show recent searches dropdown when input is focused and empty"
git push origin master
```

**15. Loading skeleton for search suggestions**
```bash
git add components/home/search-bar.tsx
git commit -m "feat: add loading skeleton to search bar while fetching suggestions"
git push origin master
```

**16. Clear To field coords on manual edit**
```bash
git add components/home/search-bar.tsx
git commit -m "fix: clear To field coordinates when user manually edits To input"
git push origin master
```

**17. Keyboard navigation in suggestion dropdown**
```bash
git add components/home/search-bar.tsx
git commit -m "feat: add keyboard navigation (arrow keys + enter) in suggestion dropdown"
git push origin master
```

**18. Highlight matching text in suggestions**
```bash
git add components/home/search-bar.tsx
git commit -m "feat: highlight matching text in autocomplete suggestions"
git push origin master
```

**19. Distance badge on each suggestion**
```bash
git add components/home/search-bar.tsx hooks/use-nominatim.ts
git commit -m "feat: show distance badge on each suggestion item"
git push origin master
```

**20. Prevent submit with one field empty**
```bash
git add components/home/search-bar.tsx
git commit -m "fix: prevent search form submit when only one field is filled"
git push origin master
```

---

### 🗺️ Map & Results

**21. Animated polyline draw on map load**
```bash
git add components/results/leaflet-map.tsx
git commit -m "feat: add animated polyline draw on map when route loads"
git push origin master
```

**22. Custom start/end markers on map**
```bash
git add components/results/leaflet-map.tsx
git commit -m "feat: show start and end markers with custom icons on leaflet map"
git push origin master
```

**23. Recenter map button**
```bash
git add components/results/leaflet-map.tsx components/results/map-view.tsx
git commit -m "feat: add recenter map button when user pans away from route"
git push origin master
```

**24. Collapse map on mobile by default**
```bash
git add components/results/map-view.tsx app/results/page.tsx
git commit -m "feat: collapse map on mobile by default, add toggle button"
git push origin master
```

**25. ETA and distance summary bar**
```bash
git add app/results/page.tsx
git commit -m "feat: show ETA and distance summary bar above ride cards"
git push origin master
```

**26. Skeleton loaders for ride cards**
```bash
git add components/results/results-list.tsx
git commit -m "feat: add skeleton loaders for ride cards while fetching"
git push origin master
```

**27. Empty state when no rides match filter**
```bash
git add components/results/results-list.tsx
git commit -m "feat: add empty state illustration when no rides match filter"
git push origin master
```

**28. Sort by rating filter option**
```bash
git add components/results/filter-bar.tsx components/results/results-list.tsx
git commit -m "feat: add sort by rating filter option to filter bar"
git push origin master
```

**29. Fare breakdown tooltip on price hover**
```bash
git add components/results/results-list.tsx
git commit -m "feat: show fare breakdown tooltip on hover over price"
git push origin master
```

**30. Share route button**
```bash
git add components/results/results-list.tsx app/results/page.tsx
git commit -m "feat: add share route button that copies URL to clipboard"
git push origin master
```

---

### 📅 Bookings

**31. Cancel booking confirmation dialog**
```bash
git add components/bookings/bookings-list.tsx
git commit -m "feat: add cancel booking confirmation dialog"
git push origin master
```

**32. Cancel booking API call**
```bash
git add components/bookings/bookings-list.tsx lib/api.ts
git commit -m "feat: implement cancel booking API call on confirm"
git push origin master
```

**33. Booking status badge**
```bash
git add components/bookings/bookings-list.tsx components/bookings/booking-details.tsx
git commit -m "feat: add booking status badge (Upcoming / Completed / Canceled)"
git push origin master
```

**34. Book Again prefills search**
```bash
git add components/bookings/bookings-list.tsx components/bookings/booking-details.tsx
git commit -m "feat: add Book Again functionality that prefills search from booking"
git push origin master
```

**35. Booking count badge on nav**
```bash
git add components/layout/navbar.tsx
git commit -m "feat: show booking count badge on Bookings nav link"
git push origin master
```

**36. Date filter on booking history**
```bash
git add components/bookings/bookings-list.tsx app/bookings/page.tsx
git commit -m "feat: add date filter to booking history (this week / this month / all)"
git push origin master
```

**37. Empty state for bookings with CTA**
```bash
git add components/bookings/bookings-list.tsx
git commit -m "feat: add empty state for bookings with CTA to search rides"
git push origin master
```

**38. Booking receipt modal**
```bash
git add components/bookings/booking-details.tsx
git commit -m "feat: show booking receipt modal with full details on card click"
git push origin master
```

**39. Booking confirmation toast**
```bash
git add components/results/results-list.tsx
git commit -m "feat: add booking confirmation toast after successful book"
git push origin master
```

**40. Paginate booking list**
```bash
git add components/bookings/bookings-list.tsx
git commit -m "feat: paginate booking list (10 per page)"
git push origin master
```

---

### 👤 Profile

**41. Update username from profile page**
```bash
git add components/profile/profile-info.tsx
git commit -m "feat: allow user to update username from profile page"
git push origin master
```

**42. Profile avatar upload placeholder**
```bash
git add components/profile/profile-info.tsx
git commit -m "feat: add profile avatar upload placeholder (UI only)"
git push origin master
```

**43. Total rides and distance on profile stats**
```bash
git add components/profile/profile-info.tsx app/profile/page.tsx
git commit -m "feat: show total rides count and total distance on profile stats"
git push origin master
```

**44. Favourite routes section**
```bash
git add components/profile/profile-info.tsx app/profile/page.tsx
git commit -m "feat: add favourite routes section to profile"
git push origin master
```

**45. Notification preferences toggle**
```bash
git add components/profile/preferences-form.tsx
git commit -m "feat: add notification preferences toggle (UI only)"
git push origin master
```

**46. Theme toggle on profile page**
```bash
git add app/profile/page.tsx
git commit -m "feat: add dark/light mode toggle directly on profile page"
git push origin master
```

**47. Account creation date on profile**
```bash
git add components/profile/profile-info.tsx
git commit -m "feat: show account creation date on profile"
git push origin master
```

**48. Delete account button with dialog**
```bash
git add components/profile/profile-info.tsx app/profile/page.tsx
git commit -m "feat: add delete account button with confirmation dialog (UI only)"
git push origin master
```

**49. Preferred ride type selector**
```bash
git add components/profile/preferences-form.tsx
git commit -m "feat: add preferred ride type selector on profile"
git push origin master
```

**50. Animate profile stats counters**
```bash
git add components/profile/profile-info.tsx app/profile/page.tsx
git commit -m "feat: animate profile stats counters on page load"
git push origin master
```

---

### 🎨 UI / UX

**51. Page transition animations between routes**
```bash
git add app/layout.tsx components/layout/app-main.tsx
git commit -m "feat: add page transition animations between routes"
git push origin master
```

**52. Scroll-to-top button**
```bash
git add components/ui/scroll-to-top.tsx app/layout.tsx
git commit -m "feat: add scroll-to-top button on long pages"
git push origin master
```

**53. Mobile search bar layout fix**
```bash
git add components/home/search-bar.tsx app/globals.css
git commit -m "feat: improve mobile search bar layout for small screens"
git push origin master
```

**54. Dropdowns close on outside click**
```bash
git add components/home/search-bar.tsx
git commit -m "fix: ensure dropdowns close on outside click across all components"
git push origin master
```

**55. Ripple effect on Book Now button**
```bash
git add components/results/results-list.tsx
git commit -m "feat: add ripple effect on Book Now button click"
git push origin master
```

**56. Confetti on first booking**
```bash
git add components/results/results-list.tsx
git commit -m "feat: add confetti animation on first successful booking"
git push origin master
```

**57. Tooltips on eco and public badges**
```bash
git add components/results/results-list.tsx
git commit -m "feat: add tooltips to eco-friendly and public transport badges"
git push origin master
```

**58. Promotions slider autoplay**
```bash
git add components/home/promotions-slider.tsx
git commit -m "feat: improve promotions slider with autoplay and pause on hover"
git push origin master
```

**59. Custom 404 page**
```bash
git add app/not-found.tsx
git commit -m "feat: add 404 page with navigation back to home"
git push origin master
```

**60. Loading spinner on hydration**
```bash
git add app/layout.tsx app/providers.tsx
git commit -m "feat: add loading spinner on initial app hydration"
git push origin master
```

---

### ⚡ Performance & Quality

**61. Lazy load Leaflet map**
```bash
git add components/results/map-view.tsx
git commit -m "perf: lazy load Leaflet map component with dynamic import"
git push origin master
```

**62. Memoize ride filter functions**
```bash
git add components/results/results-list.tsx
git commit -m "perf: memoize ride filter functions with useMemo"
git push origin master
```

**63. React.memo on BookingCard**
```bash
git add components/bookings/bookings-list.tsx
git commit -m "perf: add React.memo to BookingCard to prevent unnecessary re-renders"
git push origin master
```

**64. Fix hydration mismatch in ThemeProvider**
```bash
git add app/layout.tsx
git commit -m "fix: resolve hydration mismatch in ThemeProvider defaultTheme"
git push origin master
```

**65. Update caniuse-lite**
```bash
git add package.json package-lock.json
git commit -m "chore: update caniuse-lite database"
git push origin master
```

**66. Add alt text to all images**
```bash
git add components/home/hero-section.tsx components/logos/OlaLogo.tsx components/logos/UberLogo.tsx components/logos/RapidoLogo.tsx
git commit -m "fix: add missing alt text to all img elements for accessibility"
git push origin master
```

**67. Keyboard focus ring styles**
```bash
git add app/globals.css
git commit -m "feat: add keyboard focus ring styles to all interactive elements"
git push origin master
```

**68. Compress hero images to WebP**
```bash
git add public/images/pexels-photo-city.webp public/images/pexels-photo-street.webp components/home/hero-section.tsx
git commit -m "perf: compress hero images and convert to WebP format"
git push origin master
```

**69. Remove unused imports**
```bash
git add components/home/search-bar.tsx components/results/results-list.tsx components/bookings/bookings-list.tsx
git commit -m "chore: remove unused imports across all component files"
git push origin master
```

**70. Smoke test for auth context**
```bash
git add __tests__/auth-context.test.tsx
git commit -m "test: add basic smoke test for auth context login flow"
git push origin master
```

---

### 📱 Mobile / Android

**71. Pull-to-refresh on bookings**
```bash
git add app/bookings/page.tsx components/bookings/bookings-list.tsx
git commit -m "feat: add pull-to-refresh on bookings page for mobile"
git push origin master
```

**72. Prevent double-tap zoom on inputs**
```bash
git add app/globals.css
git commit -m "fix: prevent double-tap zoom on search input on iOS"
git push origin master
```

**73. Haptic feedback on Book Now**
```bash
git add components/results/results-list.tsx capacitor.config.ts
git commit -m "feat: add haptic feedback on Book Now button for Capacitor"
git push origin master
```

**74. Android status bar color**
```bash
git add android/app/src/main/res/values/styles.xml capacitor.config.ts
git commit -m "feat: set Android status bar color to match app theme"
git push origin master
```

**75. README Android build instructions**
```bash
git add README.md
git commit -m "docs: update README with Android build instructions for M1 Mac"
git push origin master
```

---

## Backend Commits (`RideHub_Backend`)

> Run all commands from `c:\webdeb\RideHub\backend`

---

### 🔐 Auth & Security

**76. Token expiry in session tokens**
```bash
git add app/routes/auth.py
git commit -m "feat: add token expiry to session tokens (24h TTL in HMAC payload)"
git push origin master
```

**77. POST /auth/logout endpoint**
```bash
git add app/routes/auth.py main.py
git commit -m "feat: add POST /auth/logout endpoint that invalidates token server-side"
git push origin master
```

**78. Email field to users table**
```bash
git add migrations/003_add_email_to_users.sql app/models/schemas.py app/routes/auth.py
git commit -m "feat: add email field to users table for password reset flow"
git push origin master
```

**79. Validate username characters**
```bash
git add app/models/schemas.py app/routes/auth.py
git commit -m "feat: validate username characters (alphanumeric + underscore only)"
git push origin master
```

**80. PATCH /auth/username endpoint**
```bash
git add app/routes/auth.py
git commit -m "feat: add PATCH /auth/username endpoint to update username"
git push origin master
```

**81. Consistent error shape for all 4xx**
```bash
git add app/routes/auth.py app/routes/bookings.py app/routes/rides.py app/routes/route.py
git commit -m "fix: return consistent error shape for all 4xx responses"
git push origin master
```

**82. X-Request-ID header on all responses**
```bash
git add main.py
git commit -m "feat: add X-Request-ID header to all responses for tracing"
git push origin master
```

**83. Log failed login attempts**
```bash
git add app/routes/auth.py
git commit -m "feat: log failed login attempts with IP address (no passwords)"
git push origin master
```

**84. Sanitize username input**
```bash
git add app/routes/auth.py app/models/schemas.py
git commit -m "fix: sanitize username input to prevent SQL injection via REST params"
git push origin master
```

**85. POST /auth/refresh endpoint**
```bash
git add app/routes/auth.py
git commit -m "feat: add POST /auth/refresh to reissue session token"
git push origin master
```

---

### 📦 Bookings & Rides

**86. PATCH /bookings/{id}/cancel**
```bash
git add app/routes/bookings.py app/models/schemas.py
git commit -m "feat: add PATCH /bookings/{id}/cancel endpoint"
git push origin master
```

**87. GET /bookings/{id} single booking**
```bash
git add app/routes/bookings.py
git commit -m "feat: add GET /bookings/{id} single booking endpoint"
git push origin master
```

**88. created_at timestamp on bookings**
```bash
git add migrations/003_add_created_at_to_bookings.sql app/models/schemas.py
git commit -m "feat: add created_at timestamp to bookings table and schema"
git push origin master
```

**89. ride_date and ride_time columns**
```bash
git add migrations/004_add_ride_datetime_to_bookings.sql app/models/schemas.py app/routes/bookings.py
git commit -m "feat: add ride_date and ride_time columns to bookings"
git push origin master
```

**90. Validate booking price range**
```bash
git add app/routes/bookings.py
git commit -m "feat: validate that booking price is within expected fare range"
git push origin master
```

**91. GET /rides/catalog endpoint**
```bash
git add app/routes/rides.py
git commit -m "feat: add GET /rides/catalog endpoint to expose RIDE_CATALOG"
git push origin master
```

**92. Surge multiplier on ride options**
```bash
git add app/routes/rides.py app/models/schemas.py
git commit -m "feat: add surge multiplier field to ride options (1.0x default)"
git push origin master
```

**93. Handle OSRM timeout with fallback**
```bash
git add app/routes/route.py
git commit -m "fix: handle OSRM timeout gracefully with fallback haversine distance"
git push origin master
```

**94. Cache OSRM results in memory**
```bash
git add app/routes/route.py
git commit -m "feat: cache OSRM route results in memory for same coord pairs (5min TTL)"
git push origin master
```

**95. Paginate bookings with Supabase range**
```bash
git add app/routes/bookings.py
git commit -m "perf: switch bookings GET to use Supabase range header for pagination"
git push origin master
```

---

### 🛠️ DevOps & Infra

**96. Dockerfile for local dev**
```bash
git add Dockerfile .dockerignore
git commit -m "chore: add Dockerfile for containerised local development"
git push origin master
```

**97. GitHub Actions CI for flake8**
```bash
git add .github/workflows/lint.yml
git commit -m "chore: add GitHub Actions CI to run flake8 lint on push"
git push origin master
```

**98. /metrics endpoint**
```bash
git add app/routes/metrics.py main.py
git commit -m "feat: add /metrics endpoint exposing request count per route"
git push origin master
```

**99. API changelog in README**
```bash
git add README.md
git commit -m "docs: add API changelog to README (v1.0 to current)"
git push origin master
```

**100. Pin dependencies and add dependabot**
```bash
git add requirements.txt .github/dependabot.yml
git commit -m "chore: pin all dependency versions and add dependabot config"
git push origin master
```

---

## Quick Reference

| Prefix | Meaning |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `perf:` | Performance improvement |
| `chore:` | Maintenance / tooling |
| `docs:` | Documentation only |
| `test:` | Tests only |

---

*RideHub — github.com/DivyanshuX9/RideHub*
