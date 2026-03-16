import { z } from 'zod';

/** Accept empty strings or valid URLs */
const optionalUrl = z.string().refine(
    (val) => val === '' || /^https?:\/\/.+/.test(val),
    { message: 'Must be a valid URL (starting with http:// or https://) or empty' }
).optional();

export const personalInfoSchema = z.object({
    fullName: z.string().optional(),
    title: z.string().optional(),
    email: z.string().refine(
        (val) => val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        { message: 'Must be a valid email or empty' }
    ).optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: optionalUrl,
    linkedin: optionalUrl,
    github: optionalUrl,
    summary: z.string().optional(),
    profileImage: z.string().optional(),
});

export const experienceSchema = z.object({
    id: z.string(),
    company: z.string(),
    position: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    description: z.string().optional(),
    bullets: z.array(z.string()).max(10).default([]),
});

export const educationSchema = z.object({
    id: z.string(),
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    gpa: z.string().optional(),
    description: z.string().optional(),
});

export const skillsSchema = z.object({
    id: z.string(),
    category: z.string(),
    items: z.array(z.string()).default([]),
});

export const projectsSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    url: optionalUrl,
    technologies: z.array(z.string()).default([]),
    bullets: z.array(z.string()).max(10).default([]),
});

export const certificationsSchema = z.object({
    id: z.string(),
    name: z.string(),
    issuer: z.string(),
    date: z.string(),
    url: optionalUrl,
});

export const languagesSchema = z.object({
    id: z.string(),
    language: z.string(),
    proficiency: z.enum(['native', 'fluent', 'conversational', 'basic']),
});

export const customSectionItemSchema = z.any(); // We can keep this loose or narrow it down based on requirements

export const customSectionSchema = z.object({
    id: z.string(),
    title: z.string(),
    items: z.array(customSectionItemSchema).default([]),
});

export const resumeContentSchema = z.object({
    personalInfo: personalInfoSchema.optional(),
    experience: z.array(experienceSchema).optional(),
    education: z.array(educationSchema).optional(),
    skills: z.array(skillsSchema).optional(),
    projects: z.array(projectsSchema).optional(),
    certifications: z.array(certificationsSchema).optional(),
    languages: z.array(languagesSchema).optional(),
    customSections: z.array(customSectionSchema).optional(),
});

export const resumeSettingsSchema = z.object({
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

export const createResumeSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
    templateId: z.string().optional(),
    content: resumeContentSchema.optional(),
    settings: resumeSettingsSchema.optional(),
});

export const updateResumeSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    content: resumeContentSchema.optional(),
    settings: resumeSettingsSchema.optional(),
    isPublic: z.boolean().optional(),
});

// Infer types from Zod schemas
export type ResumeContent = z.infer<typeof resumeContentSchema>;
export type ResumeSettings = z.infer<typeof resumeSettingsSchema>;
export type CreateResumeDTO = z.infer<typeof createResumeSchema>;
export type UpdateResumeDTO = z.infer<typeof updateResumeSchema>;
