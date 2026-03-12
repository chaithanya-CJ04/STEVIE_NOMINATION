import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteShell } from "./SiteShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Stevie Awards Recommendation System",
  description: "Find your perfect Stevie Award with an AI-guided conversation.",
  icons: {
    icon: "/stevies-logo.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-[#0A0A0A] text-white`}
      >
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
