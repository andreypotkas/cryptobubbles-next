import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "@/app/ui/globals.css";
import Header from "./ui/Header";

const inter = Poppins({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "CryptoBubbles | Interactive visualization using Pixi.js.",
  description: "General info about more than 10000 cryptocurrencies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className + " bg-zinc-900 text-white"}>
        <Header />
        {children}
      </body>
    </html>
  );
}
