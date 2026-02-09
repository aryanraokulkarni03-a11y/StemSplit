import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Outfit } from 'next/font/google';
import { Header, Footer } from '@/components/layout';
import './globals.css';
import { CookieConsent } from '@/components/CookieConsent';
import { defaultMetadata, generateOrganizationSchema, generateWebsiteSchema } from '@/lib/seo';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = defaultMetadata;

// Check if Clerk is configured
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function LayoutContent({ children }: { children: React.ReactNode }) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en" className="dark">
      <head>
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${outfit.variable} antialiased gradient-bg min-h-screen flex flex-col font-sans`}>
        <Header />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If Clerk is not configured, render without ClerkProvider to avoid loading errors
  if (!isClerkConfigured) {
    return <LayoutContent>{children}</LayoutContent>;
  }

  return (
    <ClerkProvider>
      <LayoutContent>{children}</LayoutContent>
    </ClerkProvider>
  );
}
