"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import API from "@/lib/api";

const STORAGE_KEY = "ridehub_user";
const GUEST_KEY = "ridehub_guest";

export interface User {
  id: string;
  username: string;
  sessionToken: string;
}

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
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
      if (localStorage.getItem(GUEST_KEY) === "1") setIsGuest(true);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(GUEST_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    const handle = (e: StorageEvent) => {
      if (e.key === null) { setUser(null); setIsGuest(false); return; }
      if (e.key === STORAGE_KEY) {
        if (!e.newValue) { setUser(null); return; }
        try { setUser(JSON.parse(e.newValue)); } catch { setUser(null); }
      }
      if (e.key === GUEST_KEY) setIsGuest(e.newValue === "1");
    };
    window.addEventListener("storage", handle);
    return () => window.removeEventListener("storage", handle);
  }, []);

  const persist = (u: User) => {
    setUser(u);
    setIsGuest(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    localStorage.removeItem(GUEST_KEY);
  };

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      persist({ id: data.id, username: data.username, sessionToken: data.session_token });
      return true;
    } catch { return false; }
  };

  const signup = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      persist({ id: data.id, username: data.username, sessionToken: data.session_token });
      return true;
    } catch { return false; }
  };

  const loginAsGuest = () => {
    const guest: User = { id: "guest", username: "Guest", sessionToken: "" };
    setUser(guest);
    setIsGuest(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guest));
    localStorage.setItem(GUEST_KEY, "1");
  };

  const loginWithGoogle = (id: string, username: string, sessionToken: string) => {
    persist({ id, username, sessionToken });
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(GUEST_KEY);
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
