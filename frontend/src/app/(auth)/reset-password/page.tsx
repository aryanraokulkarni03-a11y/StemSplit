'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordInput) => {
        if (!token) {
            setError('Invalid or missing reset token');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password: data.password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Failed to reset password');
                return;
            }

            setSuccess(true);

            // Redirect to sign-in after 2 seconds
            setTimeout(() => {
                router.push('/sign-in?reset=true');
            }, 2000);
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="reset-password-page" data-page="reset-password">
                <div className="auth-container">
                    <div className="error-message" role="alert">
                        <h2>Invalid Reset Link</h2>
                        <p>This password reset link is invalid or has expired.</p>
                        <a href="/forgot-password" className="back-link">
                            Request a new reset link
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="reset-password-page" data-page="reset-password">
                <div className="auth-container">
                    <div className="success-message" role="status">
                        <h2>Password Reset Successful</h2>
                        <p>Your password has been reset. Redirecting to sign in...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password-page" data-page="reset-password">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>Reset Password</h1>
                    <p>Enter your new password</p>
                </div>

                {error && (
                    <div className="error-banner" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="form-field">
                        <label htmlFor="password">New Password</label>
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
                        <p className="field-hint">
                            Must be at least 8 characters with uppercase, lowercase, and number
                        </p>
                    </div>

                    <div className="form-field">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register('confirmPassword')}
                            disabled={isLoading}
                            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                        />
                        {errors.confirmPassword && (
                            <span className="error-message" role="alert">
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isLoading}
                        aria-busy={isLoading}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
