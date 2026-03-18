# RideHub - Frontend

RideHub is a modern ride aggregation platform that allows users to search, compare, and book rides across multiple services like Uber, Ola, Rapido, Metro, Bus, and more, all through one seamless and beautifully designed interface.

Whether you are looking for the fastest, cheapest, eco-friendly, or public transport option, RideHub makes mobility smarter and simpler.

---

## Features

- **Unified Ride Search** - Enter pickup and drop locations to compare price, ETA, and environmental impact across major ride services.
- **Categorized Ride Filters** - Instantly sort by Fastest, Cheapest, Eco, and Public ride types.
- **Public Transport Integration** - View buses and metro options alongside private rides with clear icons and dedicated styling.
- **Live Location Autocomplete** - Powered by Nominatim (OpenStreetMap) with debounced search and abort-on-stale requests.
- **Real Road Routing** - Map traces actual roads using OSRM, with accurate distance and ETA from the backend.
- **Smart History Fallback** - Haven't searched yet? See your recent rides and suggestions as helpful defaults.
- **Custom Loading Effects** - Each screen features tailored shimmer loaders and animated spinners for a sleek native-app feel.
- **Responsive and Accessible** - Fully responsive across mobile and desktop with smooth Framer Motion transitions.
- **Guest Login** - Try the app instantly without creating an account.

---

## Tech Stack

- **Next.js 15 (App Router)**
- **React 18**
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations and transitions
- **Lucide React** - Icon library
- **Leaflet + react-leaflet** - Interactive maps with OpenStreetMap tiles
- **Nominatim API** - Free location autocomplete and reverse geocoding
- **OSRM** - Open Source Routing Machine for real road distance and polylines

---

## Getting Started

1. Clone the repo:

   ```bash
   git clone https://github.com/your-username/ridehub-frontend.git
   cd ridehub-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment file and fill in values:

   ```bash
   cp .env.example .env
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   Visit http://localhost:3000 in your browser.

---

## Environment Variables

See `.env.example` for all required variables.

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
```

---

## Project Structure

```
ridehub-frontend/
├── app/          # App Router routes and layouts
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks (useNominatim, etc.)
├── lib/          # Utilities and mock data
├── public/       # Static assets
└── types/        # TypeScript type definitions
```

---

## Contribution Guidelines

Contributions are welcome. To get started:

1. Fork the repo and create a feature branch.
2. Follow the existing code style (TypeScript + Tailwind + Framer Motion).
3. Submit a pull request with a clear explanation of your changes.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

Divyanshu Sharma
divyanshu88999@gmail.com
