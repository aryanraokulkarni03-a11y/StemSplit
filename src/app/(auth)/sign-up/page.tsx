'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpInput } from '@/lib/validations';

/**
 * Sign Up Page Component
 * 
 * Features:
 * - Email/Password registration
 * - Form validation with Zod
 * - Password strength requirements
 * - Error handling
 * - Redirect to sign-in after registration
 * - Link to sign-in page
 * 
 * TODO: Integrate user's custom skeuomorphic design
 */
export default function SignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpInput) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Registration failed');
                return;
            }

            setSuccess(true);

            // Redirect to sign-in after 2 seconds
            setTimeout(() => {
                router.push('/sign-in?registered=true');
            }, 2000);
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="sign-up-page" data-page="sign-up">
                <div className="auth-container">
                    <div className="success-message" role="status">
                        <h2>Account Created!</h2>
                        <p>Redirecting to sign in...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sign-up-page" data-page="sign-up">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join AI Music Platform today</p>
                </div>

                {error && (
                    <div className="error-banner" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="form-field">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            {...register('name')}
                            disabled={isLoading}
                            aria-invalid={errors.name ? 'true' : 'false'}
                        />
                        {errors.name && (
                            <span className="error-message" role="alert">
                                {errors.name.message}
                            </span>
                        )}
                    </div>

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
                        <p className="field-hint">
                            Must be at least 8 characters with uppercase, lowercase, and number
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isLoading}
                        aria-busy={isLoading}
                    >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                {/* Sign In Link */}
                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <a href="/sign-in" className="sign-in-link">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
