"use client";

import { PrimeReactProvider } from "primereact/api";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function PrimeReactProviders({ children }: RootLayoutProps) {
  return <PrimeReactProvider>{children}</PrimeReactProvider>;
}
