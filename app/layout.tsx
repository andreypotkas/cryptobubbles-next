import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "@/app/ui/globals.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/md-dark-deeppurple/theme.css";
import { PrimeReactProviders } from "./providers";
import Header from "./ui/Header";

const inter = Poppins({ subsets: ["latin"], weight: ["400"] });

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? `${process.env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "CryptoBubbles | Interactive visualization using Pixi.js!",
    template: `%s | CryptoBubbles`,
  },
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
        <PrimeReactProviders>{children}</PrimeReactProviders>{" "}
      </body>
    </html>
  );
}
