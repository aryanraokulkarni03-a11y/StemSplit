'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type SignInInput = z.infer<typeof signInSchema>;

/**
 * Sign In Page Component
 * 
 * Features:
 * - Email/Password sign-in
 * - OAuth providers (Google, GitHub)
 * - Form validation with Zod
 * - Error handling
 * - Redirect after sign-in
 * - Link to sign-up page
 * 
 * TODO: Integrate user's custom skeuomorphic design
 */
export default function SignInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInInput>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInInput) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
                return;
            }

            router.push(callbackUrl);
            router.refresh();
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthSignIn = async (provider: 'google' | 'github') => {
        setIsLoading(true);
        await signIn(provider, { callbackUrl });
    };

    return (
        <div className="sign-in-page" data-page="sign-in">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>Sign In</h1>
                    <p>Welcome back to AI Music Platform</p>
                </div>

                {error && (
                    <div className="error-banner" role="alert">
                        {error}
                    </div>
                )}

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="form-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            disabled={isLoading}
                            aria-invalid={errors.email ? 'true' : 'false'}
                        />
                        {errors.email && (
                            <span className="error-message" role="alert">
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            disabled={isLoading}
                            aria-invalid={errors.password ? 'true' : 'false'}
                        />
                        {errors.password && (
                            <span className="error-message" role="alert">
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    <div className="form-actions">
                        <a href="/forgot-password" className="forgot-password-link">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isLoading}
                        aria-busy={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* OAuth Providers */}
                <div className="oauth-divider">
                    <span>Or continue with</span>
                </div>

                <div className="oauth-buttons">
                    <button
                        onClick={() => handleOAuthSignIn('google')}
                        className="oauth-button"
                        data-provider="google"
                        disabled={isLoading}
                    >
                        <span className="oauth-icon">{/* Google icon */}</span>
                        Google
                    </button>

                    <button
                        onClick={() => handleOAuthSignIn('github')}
                        className="oauth-button"
                        data-provider="github"
                        disabled={isLoading}
                    >
                        <span className="oauth-icon">{/* GitHub icon */}</span>
                        GitHub
                    </button>
                </div>

                {/* Sign Up Link */}
                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <a href="/sign-up" className="sign-up-link">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
