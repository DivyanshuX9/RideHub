"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

import API from "@/lib/api";

async function wakeBackend() {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    await fetch(`${API}/health`, { signal: ctrl.signal });
    clearTimeout(t);
  } catch {}
}

interface User { id: string; username: string; sessionToken: string; }

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  hydrated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  loginAsGuest: () => void;
  loginWithGoogle: (id: string, username: string, sessionToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ridehub_user");
      if (stored) setUser(JSON.parse(stored));
      if (localStorage.getItem("ridehub_guest") === "1") setIsGuest(true);
    } catch {
      localStorage.removeItem("ridehub_user");
      localStorage.removeItem("ridehub_guest");
    }
    setHydrated(true);
  }, []);

  // Listen for storage changes (other tabs / windows only — same-tab updates use context directly)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === null) {
        setUser(null);
        setIsGuest(false);
        return;
      }
      if (e.key === "ridehub_user") {
        if (!e.newValue) {
          setUser(null);
          return;
        }
        try {
          setUser(JSON.parse(e.newValue));
        } catch {
          localStorage.removeItem("ridehub_user");
          localStorage.removeItem("ridehub_guest");
          setUser(null);
          setIsGuest(false);
        }
      }
      if (e.key === "ridehub_guest") {
        setIsGuest(e.newValue === "1");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const loginWithGoogle = (id: string, username: string, sessionToken: string) => {
    const userData: User = { id, username, sessionToken };
    setUser(userData);
    setIsGuest(false);
    localStorage.setItem("ridehub_user", JSON.stringify(userData));
  };

  const loginAsGuest = () => {
    const guest: User = { id: "guest", username: "Guest", sessionToken: "" };
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
      const data = await res.json();
      const userData: User = { id: data.id, username: data.username, sessionToken: data.session_token };
      setUser(userData);
      localStorage.setItem("ridehub_user", JSON.stringify(userData));
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
      const data = await res.json();
      const userData: User = { id: data.id, username: data.username, sessionToken: data.session_token };
      setUser(userData);
      localStorage.setItem("ridehub_user", JSON.stringify(userData));
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
    <AuthContext.Provider value={{ user, isGuest, hydrated, login, signup, loginAsGuest, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
