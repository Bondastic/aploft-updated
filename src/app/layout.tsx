import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "APLOFT — Træn Almen Sprogforståelse og Latin",
  description:
    "APLOFT er en øvelsesapp til Almen Sprogforståelse (AP): ordklasser, sætningsled, tempus, kasus, syntaks og latin. Lokal progression, ingen login, ingen tredjepartscookies.",
  icons: { icon: "/favicon.png" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="da">
      <body className="bg-[#faf8ff] text-ink antialiased">{children}</body>
    </html>
  );
}
