# RideHub — Commit Roadmap

A list of 100 meaningful commits you can make across the **Frontend** (`RideHub`) and **Backend** (`RideHub_Backend`) repositories to keep the project growing, polished, and production-ready.

---

## Frontend Commits (`RideHub`)

### 🔐 Auth & Security
1. `feat: add password strength indicator on signup form`
2. `feat: add confirm password field on signup with match validation`
3. `feat: show inline error messages for login failures instead of alert`
4. `feat: add "forgot password" placeholder page with coming soon state`
5. `feat: auto-redirect logged-in users away from /login to home`
6. `feat: persist guest session across browser tabs using storage event`
7. `feat: add logout confirmation dialog before clearing session`
8. `fix: clear stale ridehub_user from localStorage on 401 response`
9. `feat: show username avatar initials in navbar when logged in`
10. `feat: add session expiry notice toast when session_token is invalid`

### 🔍 Search & Location
11. `feat: debounce nominatim search to 400ms to reduce API calls`
12. `feat: add "swap from/to locations" button between inputs`
13. `feat: remember last 3 searched locations in localStorage`
14. `feat: show recent searches dropdown when input is focused and empty`
15. `feat: add loading skeleton to search bar while fetching suggestions`
16. `fix: clear To field coordinates when user manually edits To input`
17. `feat: add keyboard navigation (arrow keys + enter) in suggestion dropdown`
18. `feat: highlight matching text in autocomplete suggestions`
19. `feat: show distance badge on each suggestion item`
20. `fix: prevent search form submit when only one field is filled`

### 🗺️ Map & Results
21. `feat: add animated polyline draw on map when route loads`
22. `feat: show start and end markers with custom icons on leaflet map`
23. `feat: add "recenter map" button when user pans away from route`
24. `feat: collapse map on mobile by default, add toggle button`
25. `feat: show ETA and distance summary bar above ride cards`
26. `feat: add skeleton loaders for ride cards while fetching`
27. `feat: add empty state illustration when no rides match filter`
28. `feat: add "sort by rating" filter option to filter bar`
29. `feat: show fare breakdown tooltip on hover over price`
30. `feat: add share route button that copies URL to clipboard`

### 📅 Bookings
31. `feat: add cancel booking confirmation dialog`
32. `feat: implement cancel booking API call on confirm`
33. `feat: add booking status badge (Upcoming / Completed / Canceled)`
34. `feat: add "Book Again" functionality that prefills search from booking`
35. `feat: show booking count badge on Bookings nav link`
36. `feat: add date filter to booking history (this week / this month / all)`
37. `feat: add empty state for bookings with CTA to search rides`
38. `feat: show booking receipt modal with full details on card click`
39. `feat: add booking confirmation toast after successful book`
40. `feat: paginate booking list (10 per page)`

### 👤 Profile
41. `feat: allow user to update username from profile page`
42. `feat: add profile avatar upload placeholder (UI only)`
43. `feat: show total rides count and total distance on profile stats`
44. `feat: add favourite routes section to profile`
45. `feat: add notification preferences toggle (UI only)`
46. `feat: add dark/light mode toggle directly on profile page`
47. `feat: show account creation date on profile`
48. `feat: add delete account button with confirmation dialog (UI only)`
49. `feat: add preferred ride type selector on profile`
50. `feat: animate profile stats counters on page load`

### 🎨 UI / UX
51. `feat: add page transition animations between routes`
52. `feat: add scroll-to-top button on long pages`
53. `feat: improve mobile search bar layout for small screens`
54. `fix: ensure dropdowns close on outside click across all components`
55. `feat: add ripple effect on Book Now button click`
56. `feat: add confetti animation on first successful booking`
57. `feat: add tooltips to eco-friendly and public transport badges`
58. `feat: improve promotions slider with autoplay and pause on hover`
59. `feat: add 404 page with navigation back to home`
60. `feat: add loading spinner on initial app hydration`

### ⚡ Performance & Quality
61. `perf: lazy load Leaflet map component with dynamic import`
62. `perf: memoize ride filter functions with useMemo`
63. `perf: add React.memo to BookingCard to prevent unnecessary re-renders`
64. `fix: resolve hydration mismatch in ThemeProvider defaultTheme`
65. `chore: update caniuse-lite database`
66. `fix: add missing alt text to all img elements for accessibility`
67. `feat: add keyboard focus ring styles to all interactive elements`
68. `perf: compress hero images and convert to WebP format`
69. `chore: remove unused imports across all component files`
70. `test: add basic smoke test for auth context login flow`

### 📱 Mobile / Android
71. `feat: add pull-to-refresh on bookings page for mobile`
72. `fix: prevent double-tap zoom on search input on iOS`
73. `feat: add haptic feedback on Book Now button for Capacitor`
74. `feat: set Android status bar color to match app theme`
75. `docs: update README with Android build instructions for M1 Mac`

---

## Backend Commits (`RideHub_Backend`)

### 🔐 Auth & Security
76. `feat: add token expiry to session tokens (24h TTL in HMAC payload)`
77. `feat: add POST /auth/logout endpoint that invalidates token server-side`
78. `feat: add email field to users table for password reset flow`
79. `feat: validate username characters (alphanumeric + underscore only)`
80. `feat: add PATCH /auth/username endpoint to update username`
81. `fix: return consistent error shape for all 4xx responses`
82. `feat: add X-Request-ID header to all responses for tracing`
83. `feat: log failed login attempts with IP address (no passwords)`
84. `fix: sanitize username input to prevent SQL injection via REST params`
85. `feat: add POST /auth/refresh to reissue session token`

### 📦 Bookings & Rides
86. `feat: add PATCH /bookings/{id}/cancel endpoint`
87. `feat: add GET /bookings/{id} single booking endpoint`
88. `feat: add created_at timestamp to bookings table and schema`
89. `feat: add ride_date and ride_time columns to bookings`
90. `feat: validate that booking price is within expected fare range`
91. `feat: add GET /rides/catalog endpoint to expose RIDE_CATALOG`
92. `feat: add surge multiplier field to ride options (1.0x default)`
93. `fix: handle OSRM timeout gracefully with fallback haversine distance`
94. `feat: cache OSRM route results in memory for same coord pairs (5min TTL)`
95. `perf: switch bookings GET to use Supabase range header for pagination`

### 🛠️ DevOps & Infra
96. `chore: add Dockerfile for containerised local development`
97. `chore: add GitHub Actions CI to run flake8 lint on push`
98. `feat: add /metrics endpoint exposing request count per route`
99. `docs: add API changelog to README (v1.0 → current)`
100. `chore: pin all dependency versions and add dependabot config`

---

## How to use this list

Each item maps directly to one `git commit`. Work through them in any order — pick what adds the most value for your current milestone.

**Suggested priority order:**
1. Start with `fix:` commits — they improve stability immediately
2. Then `feat:` commits that users will notice (auth UX, booking flow)
3. Then `perf:` and `chore:` commits before each production release
4. Save `test:` and `docs:` commits for quieter periods

---

*Generated for RideHub — github.com/DivyanshuX9/RideHub*
