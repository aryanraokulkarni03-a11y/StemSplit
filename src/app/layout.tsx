import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StemSplit - AI Audio Separation",
  description: "Free AI-powered audio stem separation. Extract vocals, drums, bass, and instruments from any song. Perfect for music education, remixing, and practice.",
  keywords: ["audio separation", "stem splitter", "vocal remover", "AI music", "Demucs", "music education"],
  authors: [{ name: "StemSplit Team" }],
  openGraph: {
    title: "StemSplit - AI Audio Separation",
    description: "Free AI-powered audio stem separation for music education and creativity.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased gradient-bg min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
