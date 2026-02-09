'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Client-side Providers Wrapper
 * 
 * Wraps the app with NextAuth SessionProvider
 * Must be a client component to use React Context
 */
export function Providers({ children }: ProvidersProps) {
    return <SessionProvider>{children}</SessionProvider>;
}
