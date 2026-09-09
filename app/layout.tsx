import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter, SiteNav } from "./components/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://danzalab.com"),
  title: {
    default: "Danza Lab | Artes del movimiento",
    template: "%s | Danza Lab",
  },
  description:
    "Danza Lab conecta laboratorios de danza, salas de ensayo, composición escénica y formación artística en Buenos Aires.",
  keywords: [
    "Danza Lab",
    "salas de ensayo",
    "laboratorios de danza",
    "composición escénica",
    "artes del movimiento",
    "Buenos Aires",
    "formación en danza",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Danza Lab | Artes del movimiento",
    description:
      "Laboratorios, salas de ensayo y formación artística para explorar y crear desde la danza en Buenos Aires.",
    url: "https://danzalab.com",
    siteName: "Danza Lab",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Danza Lab",
    description:
      "Salas de ensayo, laboratorios de danza y composición escénica en Buenos Aires.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body><SiteNav />{children}<SiteFooter /></body>
    </html>
  );
}
