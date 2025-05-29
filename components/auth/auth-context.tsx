"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(storedUser);
  }, []);

  const login = async (username: string, password: string) => {
    // For demo: accept any username/password, or check against localStorage
    const stored = localStorage.getItem(`user:${username}`);
    if (stored && stored === password) {
      setUser(username);
      localStorage.setItem("user", username);
      return true;
    }
    return false;
  };

  const signup = async (username: string, password: string) => {
    if (localStorage.getItem(`user:${username}`)) return false;
    localStorage.setItem(`user:${username}`, password);
    setUser(username);
    localStorage.setItem("user", username);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}; 