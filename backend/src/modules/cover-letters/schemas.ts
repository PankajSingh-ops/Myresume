import { z } from 'zod';

export const personalInfoSchema = z.object({
    fullName: z.string().optional(),
    title: z.string().optional(),
    email: z.string().refine(
        (val) => val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        { message: 'Must be a valid email or empty' }
    ).optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().refine(
        (val) => val === '' || /^https?:\/\/.+/.test(val),
        { message: 'Must be a valid URL (starting with http:// or https://) or empty' }
    ).optional(),
});

export const letterDetailsSchema = z.object({
    date: z.string().optional(),
    reference: z.string().optional(),
    recipientName: z.string().optional(),
    recipientTitle: z.string().optional(),
    companyName: z.string().optional(),
    companyAddress: z.string().optional(),
});

export const coverLetterContentSchema = z.object({
    personalInfo: personalInfoSchema.optional(),
    letterDetails: letterDetailsSchema.optional(),
    body: z.string().optional(), // HTML content
});

export const coverLetterSettingsSchema = z.object({
    templateId: z.string().default('classic'),
    colors: z.object({
        primary: z.string(),
        secondary: z.string(),
        text: z.string(),
        background: z.string(),
    }).optional(),
    fonts: z.object({
        heading: z.string(),
        body: z.string(),
    }).optional(),
    spacing: z.enum(['compact', 'normal', 'relaxed']).default('normal'),
    fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
});

export const createCoverLetterSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
    templateId: z.string().optional(),
    content: coverLetterContentSchema.optional(),
    settings: coverLetterSettingsSchema.optional(),
});

export const updateCoverLetterSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    content: coverLetterContentSchema.optional(),
    settings: coverLetterSettingsSchema.optional(),
    isPublic: z.boolean().optional(),
});

// Infer types from Zod schemas
export type CoverLetterContent = z.infer<typeof coverLetterContentSchema>;
export type CoverLetterSettings = z.infer<typeof coverLetterSettingsSchema>;
export type CreateCoverLetterDTO = z.infer<typeof createCoverLetterSchema>;
export type UpdateCoverLetterDTO = z.infer<typeof updateCoverLetterSchema>;
