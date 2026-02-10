import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Outfit } from 'next/font/google';
import { Header, Footer } from '@/components/layout';
import { CookieConsent } from '@/components/CookieConsent';
import { defaultMetadata, generateOrganizationSchema, generateWebsiteSchema } from '@/lib/seo';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = defaultMetadata();

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
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

function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ErrorBoundary>
        <LayoutContent>{children}</LayoutContent>
      </ErrorBoundary>
    </SessionProvider>
  );
}

export default RootLayout;