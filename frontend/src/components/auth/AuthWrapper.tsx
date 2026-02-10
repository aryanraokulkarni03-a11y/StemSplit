'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, React, ReactNode } from 'react';

interface AuthWrapperProps {
    children: ReactNode;
    fallback?: ReactNode;
    requireAuth?: boolean;
}

export const AuthWrapper = React.memo(function AuthWrapper({ 
    children, 
    fallback = <div>Loading...</div>,
    requireAuth = true 
}: AuthWrapperProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    // Public paths that don't require authentication
    const publicPaths = ['/', '/sign-in', '/sign-up'];
    const isPublicPath = publicPaths.includes(pathname);

    useEffect(() => {
        // If authentication is required and user is not authenticated, redirect to sign-in
        if (requireAuth && status === 'unauthenticated' && !isPublicPath) {
            router.push('/sign-in?callbackUrl=' + encodeURIComponent(pathname));
        }
    }, [requireAuth, status, router, pathname, isPublicPath]);

    // If not authenticated and auth is required, show fallback
    if (requireAuth && status === 'unauthenticated' && !isPublicPath) {
        return fallback;
    }

    // If loading, show fallback
    if (status === 'loading') {
        return fallback;
    }

    return <>{children}</>;
});

export default AuthWrapper;