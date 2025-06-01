# 🚗 RideHub

**RideHub** is a modern ride aggregation platform that allows users to search, compare, and book rides across multiple services like Uber, Ola, Rapido, Metro, Bus, and more—all through one seamless, beautifully designed interface.

Whether you're looking for the **fastest**, **cheapest**, **eco-friendly**, or **public transport** option, RideHub makes mobility smarter and simpler.

---

## ✨ Features

* 🔍 **Unified Ride Search**
  Enter pickup and drop locations to compare price, ETA, and environmental impact across major ride services.

* 🧏 **Categorized Ride Filters**
  Instantly sort by **Fastest**, **Cheapest**, **Eco**, and **Public** ride types.

* 🚉 **Public Transport Integration**
  View buses and metro options alongside private rides with clear icons and dedicated styling.

* 🕘 **Smart History Fallback**
  Haven’t searched yet? See your recent rides and suggestions as helpful defaults.

* ⚡ **Custom Loading Effects**
  Each screen features tailored shimmer loaders and animated spinners for a sleek native-app feel.

* 📱 **Responsive & Accessible**
  Built with accessibility in mind and fully responsive across mobile and desktop, with smooth Framer Motion transitions.

* ✅ **Zero Hydration Errors**
  Optimized with Next.js App Router best practices for flawless hydration and rendering.

---

## 🛠 Tech Stack

* **Next.js 13+ (App Router)**
* **React 18**
* **Tailwind CSS** – Utility-first styling
* **Framer Motion** – Smooth, delightful animations
* **Lucide React** – Modern and minimal icon library

Backend being a private repo , which is having some updation right now
* Node.js
* Express.js
* AWS

---

## 🚀 Getting Started

1. **Clone the repo:**

   ```bash
   git clone https://github.com/your-username/ridehub.git
   cd ridehub
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Visit [http://ride-hub-rho.vercel.app] in your browser.

---

## 🔐 Environment Variables

For upcoming features and api keys for all riding services , maps, autofill services like Google Places Autocomplete, add the following to a `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_api_key
```

---

## 🗂 Project Structure

```
ridehub/
├── app/          # App Router routes and layouts
├── components/   # Reusable UI components (SearchBar, RideCard, etc.)
├── lib/          # Utilities, mock data, and API logic
├── public/       # Static assets (images, icons, logos)
└── styles/       # Global styles 
```

---

## 🤝 Contribution Guidelines

We welcome contributions! To get started:

1. Fork the repo and create a feature branch.
2. Follow the existing code style (TypeScript + Tailwind + Framer Motion).
3. Submit a pull request with a clear explanation of your changes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## Author

Divyanshu Sharma
divyanshu88999@gmail.com
