/**
 * Email Service
 * 
 * Email sending utilities using Resend
 * 
 * Setup:
 * 1. Sign up at https://resend.com
 * 2. Get API key
 * 3. Add to .env: RESEND_API_KEY=re_xxxxx
 * 4. Verify domain (optional, for production)
 * 
 * For development, emails will be sent from onboarding@resend.dev
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(to: string, name: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: 'Welcome to AI Music Platform',
            html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for signing up for AI Music Platform.</p>
        <p>Get started by exploring our interactive demo and features.</p>
        <p><a href="${process.env.NEXTAUTH_URL}/dashboard">Go to Dashboard</a></p>
      `,
        });

        if (error) {
            console.error('Welcome email error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Welcome email error:', error);
        return { success: false, error };
    }
}

/**
 * Send demo confirmation email
 */
export async function sendDemoConfirmationEmail(to: string, name: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: 'Demo Request Received - AI Music Platform',
            html: `
        <h1>Thank you for your interest, ${name}!</h1>
        <p>We've received your demo request and will get back to you within 24-48 hours.</p>
        <p>In the meantime, feel free to explore our <a href="${process.env.NEXTAUTH_URL}">interactive demo</a>.</p>
      `,
        });

        if (error) {
            console.error('Demo confirmation email error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Demo confirmation email error:', error);
        return { success: false, error };
    }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
    to: string,
    name: string,
    resetUrl: string
) {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: 'Password Reset Request - AI Music Platform',
            html: `
        <h1>Password Reset Request</h1>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
        });

        if (error) {
            console.error('Password reset email error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Password reset email error:', error);
        return { success: false, error };
    }
}

/**
 * Send contact form notification to admin
 */
export async function sendContactNotification(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
}) {
    try {
        const { data: emailData, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            replyTo: data.email,
            subject: `Contact Form: ${data.subject}`,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
        });

        if (error) {
            console.error('Contact notification email error:', error);
            return { success: false, error };
        }

        return { success: true, data: emailData };
    } catch (error) {
        console.error('Contact notification email error:', error);
        return { success: false, error };
    }
}
