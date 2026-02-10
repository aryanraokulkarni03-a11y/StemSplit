import { NextAuthOptions, DefaultSession, DefaultUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';

// Extend the built-in types
declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: string;
        } & DefaultSession['user'];
        accessToken?: string;
    }

    interface User extends DefaultUser {
        role: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: string;
        accessToken?: string;
    }
}

/**
 * NextAuth Configuration
 * 
 * Providers:
 * - Credentials (Email/Password)
 * - Google OAuth
 * - GitHub OAuth
 * 
 * Features:
 * - Prisma adapter for database sessions
 * - Custom sign-in page
 * - JWT strategy
 * - Session callbacks for user data
 */
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        // Email/Password Provider
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error('Invalid credentials');
                }

                const isPasswordValid = await verifyPassword(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error('Invalid credentials');
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),

        // Google OAuth Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),

        // GitHub OAuth Provider
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        }),
    ],

    pages: {
        signIn: '/sign-in',
        signOut: '/sign-out',
        error: '/sign-in',
        verifyRequest: '/verify-request',
        newUser: '/dashboard',
    },

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role || 'user';
                // Add the raw token as accessToken for API calls
                token.accessToken = token.jti || '';
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.accessToken = token.accessToken;
            }
            return session;
        },
    },

    secret: (() => {
        const secret = process.env.NEXTAUTH_SECRET;
        if (!secret) {
            throw new Error('NEXTAUTH_SECRET is not defined');
        }
        return secret;
    })(),
    debug: process.env.NODE_ENV === 'development',
};
