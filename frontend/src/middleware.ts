import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware for Route Protection
 * 
 * Protected Routes:
 * - /dashboard/* - Requires authentication
 * - /api/user/* - Requires authentication
 * 
 * Public Routes:
 * - / (marketing pages)
 * - /sign-in
 * - /sign-up
 * - /forgot-password
 * - /reset-password
 * - /api/auth/*
 * 
 * Redirects:
 * - Unauthenticated users trying to access protected routes → /sign-in
 * - Authenticated users trying to access auth pages → /dashboard
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get the token (user session)
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuthenticated = !!token;

    // Define route patterns
    const isAuthPage = pathname.startsWith('/sign-in') ||
        pathname.startsWith('/sign-up') ||
        pathname.startsWith('/forgot-password') ||
        pathname.startsWith('/reset-password');

    const isProtectedRoute = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/api/user');

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauthenticated users away from protected routes
    if (!isAuthenticated && isProtectedRoute) {
        const signInUrl = new URL('/sign-in', request.url);
        signInUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
