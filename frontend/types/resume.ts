import { z } from 'zod';

// ── Section sub-types (mirrors backend Zod schemas) ──────────────────

export interface PersonalInfo {
    fullName?: string;
    title?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary?: string;
    profileImage?: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
    bullets: string[];
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
    description?: string;
}

export interface Skill {
    id: string;
    category: string;
    items: string[];
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    url?: string;
    technologies: string[];
    bullets: string[];
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
}

export interface Language {
    id: string;
    language: string;
    proficiency: 'native' | 'fluent' | 'conversational' | 'basic';
}

export interface CustomSectionItem {
    [key: string]: unknown;
}

export interface CustomSection {
    id: string;
    title: string;
    items: CustomSectionItem[];
}

// ── Composite types ──────────────────────────────────────────────────

export interface ResumeContent {
    personalInfo?: PersonalInfo;
    experience?: Experience[];
    education?: Education[];
    skills?: Skill[];
    projects?: Project[];
    certifications?: Certification[];
    languages?: Language[];
    customSections?: CustomSection[];
}

export interface ResumeColors {
    primary: string;
    secondary: string;
    text: string;
    background: string;
}

export interface ResumeFonts {
    heading: string;
    body: string;
}

export interface ResumeSettings {
    templateId: string;
    colors?: ResumeColors;
    fonts?: ResumeFonts;
    spacing: 'compact' | 'normal' | 'relaxed';
    fontSize: 'small' | 'medium' | 'large';
}

// ── Full resume (DB row) ─────────────────────────────────────────────

export interface Resume {
    id: string;
    userId: string;
    title: string;
    slug: string;
    content: ResumeContent;
    settings: ResumeSettings;
    isPublic: boolean;
    thumbnail?: string;
    currentVersion: number;
    createdAt: string;
    updatedAt: string;
}

export interface ResumeVersion {
    id: string;
    resumeId: string;
    versionNumber: number;
    content: ResumeContent;
    settings: ResumeSettings;
    createdAt: string;
}

// ── DTOs ─────────────────────────────────────────────────────────────

export interface CreateResumeDTO {
    title: string;
    templateId?: string;
    content?: ResumeContent;
    settings?: Partial<ResumeSettings>;
}

export interface UpdateResumeDTO {
    title?: string;
    content?: ResumeContent;
    settings?: Partial<ResumeSettings>;
    isPublic?: boolean;
}

// ── Zod Schemas for Frontend Validation ──────────────────────────────

export const personalInfoSchema = z.object({
    fullName: z.string().optional(),
    title: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
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
    url: z.string().url().optional().or(z.literal('')),
    technologies: z.array(z.string()).default([]),
    bullets: z.array(z.string()).max(10).default([]),
});
