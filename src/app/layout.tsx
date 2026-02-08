import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
        className={`${outfit.variable} antialiased gradient-bg min-h-screen flex flex-col font-sans`}
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
