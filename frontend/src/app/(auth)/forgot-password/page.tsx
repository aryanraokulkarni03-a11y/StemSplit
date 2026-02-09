'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Forgot Password Page Component
 * 
 * Features:
 * - Email input for password reset
 * - Form validation
 * - API call to send reset email
 * - Success/error states
 * - Link back to sign-in
 * 
 * TODO: Integrate user's custom skeuomorphic design
 */
export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordInput) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const result = await response.json();
                setError(result.error || 'Failed to send reset email');
                return;
            }

            setSuccess(true);
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="forgot-password-page" data-page="forgot-password">
                <div className="auth-container">
                    <div className="success-message" role="status">
                        <h2>Check Your Email</h2>
                        <p>
                            We've sent password reset instructions to your email address.
                            Please check your inbox and follow the link to reset your password.
                        </p>
                        <a href="/sign-in" className="back-link">
                            Back to Sign In
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="forgot-password-page" data-page="forgot-password">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>Forgot Password</h1>
                    <p>Enter your email to receive reset instructions</p>
                </div>

                {error && (
                    <div className="error-banner" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="form-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            disabled={isLoading}
                            aria-invalid={errors.email ? 'true' : 'false'}
                            placeholder="your@email.com"
                        />
                        {errors.email && (
                            <span className="error-message" role="alert">
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isLoading}
                        aria-busy={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Remember your password?{' '}
                        <a href="/sign-in" className="sign-in-link">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
