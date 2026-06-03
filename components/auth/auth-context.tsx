"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  provider?: "password" | "google";
}

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  loginAsGuest: () => void;
  loginWithGoogle: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const isStoredGuest = localStorage.getItem("ridehub_guest") === "1";
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsGuest(false);
        } else if (isStoredGuest) {
          setUser({ id: "guest", name: "Guest", email: "guest@ridehub.local", provider: "password" });
          setIsGuest(true);
        } else {
          setUser(null);
          setIsGuest(false);
        }
      } catch {
        if (localStorage.getItem("ridehub_guest") === "1") {
          setUser({ id: "guest", name: "Guest", email: "guest@ridehub.local", provider: "password" });
          setIsGuest(true);
        }
      } finally {
        setHydrated(true);
      }
    };

    hydrate();
  }, []);

  const loginWithGoogle = (nextUser: User) => {
    setUser(nextUser);
    setIsGuest(false);
  };

  const loginAsGuest = () => {
    const guest: User = { id: "guest", name: "Guest", email: "guest@ridehub.local", provider: "password" };
    setUser(guest);
    setIsGuest(true);
    localStorage.setItem("ridehub_guest", "1");
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) return false;
      if (data?.user) {
        setUser(data.user);
        setIsGuest(false);
      }
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) return false;
      if (data?.user) {
        setUser(data.user);
        setIsGuest(false);
      }
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // ignore network failures on logout
    }
    setUser(null);
    setIsGuest(false);
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
