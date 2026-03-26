"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Wake up Render backend if sleeping (free tier spins down after inactivity)
async function wakeBackend() {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    await fetch(`${API}/health`, { signal: ctrl.signal });
    clearTimeout(t);
  } catch {}
}

interface User { id: string; username: string; }

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ridehub_user");
    if (stored) setUser(JSON.parse(stored));
    if (localStorage.getItem("ridehub_guest") === "1") setIsGuest(true);
  }, []);

  // Listen for storage changes (from Google OAuth redirect or other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("ridehub_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const loginAsGuest = () => {
    const guest: User = { id: "guest", username: "Guest" };
    setUser(guest);
    setIsGuest(true);
    localStorage.setItem("ridehub_user", JSON.stringify(guest));
    localStorage.setItem("ridehub_guest", "1");
  };

  const login = async (username: string, password: string) => {
    try {
      await wakeBackend();
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 10000);
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (!res.ok) return false;
      const data: User = await res.json();
      setUser(data);
      localStorage.setItem("ridehub_user", JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      await wakeBackend();
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 10000);
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (!res.ok) return false;
      const data: User = await res.json();
      setUser(data);
      localStorage.setItem("ridehub_user", JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem("ridehub_user");
    localStorage.removeItem("ridehub_guest");
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, login, signup, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
