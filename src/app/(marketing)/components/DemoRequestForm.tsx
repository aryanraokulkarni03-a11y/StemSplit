'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { demoRequestSchema, type DemoRequestInput } from '@/lib/validations';
import { useState } from 'react';

interface DemoRequestFormProps {
    className?: string;
}

/**
 * Demo Request Form Component
 * Uses react-hook-form with Zod validation
 * 
 * TODO: Integrate user's custom skeuomorphic design
 * TODO: Connect to /api/demo-request endpoint
 */
export function DemoRequestForm({ className }: DemoRequestFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<DemoRequestInput>({
        resolver: zodResolver(demoRequestSchema),
    });

    const onSubmit = async (data: DemoRequestInput) => {
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/demo-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to submit demo request');
            }

            setSubmitStatus('success');
            reset();
        } catch (error) {
            console.error('Demo request error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={className} data-section="demo-request">
            <h2>Request a Demo</h2>
            <p className="section-description">
                See how our platform can transform your music workflow. Fill out the form below and we'll get in touch.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="demo-form">
                <div className="form-field">
                    <label htmlFor="name">Name *</label>
                    <input
                        id="name"
                        type="text"
                        {...register('name')}
                        aria-invalid={errors.name ? 'true' : 'false'}
                        disabled={isSubmitting}
                    />
                    {errors.name && (
                        <span className="error-message" role="alert">
                            {errors.name.message}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="email">Email *</label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        aria-invalid={errors.email ? 'true' : 'false'}
                        disabled={isSubmitting}
                    />
                    {errors.email && (
                        <span className="error-message" role="alert">
                            {errors.email.message}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="company">Company (Optional)</label>
                    <input
                        id="company"
                        type="text"
                        {...register('company')}
                        aria-invalid={errors.company ? 'true' : 'false'}
                        disabled={isSubmitting}
                    />
                    {errors.company && (
                        <span className="error-message" role="alert">
                            {errors.company.message}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="message">Message *</label>
                    <textarea
                        id="message"
                        rows={5}
                        {...register('message')}
                        aria-invalid={errors.message ? 'true' : 'false'}
                        disabled={isSubmitting}
                    />
                    {errors.message && (
                        <span className="error-message" role="alert">
                            {errors.message.message}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting ? 'Sending...' : 'Request Demo'}
                </button>

                {submitStatus === 'success' && (
                    <div className="success-message" role="status">
                        Thank you! We'll be in touch soon.
                    </div>
                )}

                {submitStatus === 'error' && (
                    <div className="error-message" role="alert">
                        Something went wrong. Please try again.
                    </div>
                )}
            </form>
        </section>
    );
}
