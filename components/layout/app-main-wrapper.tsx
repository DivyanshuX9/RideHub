"use client";
import dynamic from "next/dynamic";

const AppMain = dynamic(() => import("./app-main"), { ssr: false });

export default function AppMainWrapper({ children }: { children: React.ReactNode }) {
  return <AppMain>{children}</AppMain>;
} 