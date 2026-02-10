import { z, ZodError } from 'zod';

/**
 * Validation Schemas
 * All form validation schemas using Zod
 */

// Sign Up Schema
export const signUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

// Demo Request Schema
export const demoRequestSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
    email: z.string().email('Invalid email address'),
    company: z.string().max(200, 'Company name must be less than 200 characters').optional(),
    message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
});

export type DemoRequestInput = z.infer<typeof demoRequestSchema>;

// Contact Schema
export const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(3, 'Subject must be at least 3 characters').max(200, 'Subject must be less than 200 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
});

export type ContactInput = z.infer<typeof contactSchema>;

// Profile Update Schema
export const profileUpdateSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters').optional(),
    preferences: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// HTML Sanitization Helper
// NOTE: For production, consider using DOMPurify library for comprehensive sanitization
export function sanitizeHtml(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}
