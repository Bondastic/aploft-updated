import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteName = "AP Klar";
const siteUrl = "https://apklar.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Træn Almen Sprogforståelse og latin`,
    template: `%s | ${siteName}`,
  },
  description:
    "Gratis øvelsesapp til Almen Sprogforståelse (AP): ordklasser, sætningsled, tempus, kasus, syntaks og latin. Din progression gemmes lokalt — ingen login, ingen tredjepartscookies.",
  applicationName: siteName,
  keywords: [
    "almen sprogforståelse",
    "AP",
    "AP-forløb",
    "ordklasser",
    "sætningsled",
    "latin",
    "kasus",
    "tempus",
    "gymnasium",
    "STX",
    "HHX",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "da_DK",
    url: siteUrl,
    siteName,
    title: `${siteName} — Træn Almen Sprogforståelse og latin`,
    description:
      "Øv ordklasser, sætningsled, tempus, kasus, syntaks og latin. Ingen login, ingen tracking.",
    images: [
      {
        url: "/og-image.png", // 1200×630
        width: 1200,
        height: 630,
        alt: "AP Klar — øvelsesapp til Almen Sprogforståelse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Træn Almen Sprogforståelse og latin`,
    description:
      "Øv ordklasser, sætningsled, tempus, kasus, syntaks og latin. Ingen login, ingen tracking.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  category: "education",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// Lille inline-script der sætter "dark"-klassen på <html>, FØR React
// hydrerer siden. Det undgår et hvidt "flash" ved indlæsning, hvis
// brugeren allerede har slået nattetilstand til.
const DARK_MODE_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("aploft.darkmode");
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = stored === "on" || (stored === null && false);
    if (isDark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="da" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: DARK_MODE_INIT_SCRIPT }} />
      </head>
      <body className="bg-[#faf8ff] text-ink antialiased transition-colors dark:bg-[#171225] dark:text-ink-dark" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
