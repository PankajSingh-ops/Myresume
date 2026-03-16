import { z } from 'zod';
import { PersonalInfo, personalInfoSchema } from './resume';

export interface LetterDetails {
    date?: string;
    reference?: string;
    recipientName?: string;
    recipientTitle?: string;
    companyName?: string;
    companyAddress?: string;
}

export interface CoverLetterContent {
    personalInfo?: PersonalInfo;
    letterDetails?: LetterDetails;
    body?: string;
}

export interface CoverLetterColors {
    primary: string;
    secondary: string;
    text: string;
    background: string;
}

export interface CoverLetterFonts {
    heading: string;
    body: string;
}

export interface CoverLetterSettings {
    templateId: string;
    colors?: CoverLetterColors;
    fonts?: CoverLetterFonts;
    spacing: 'compact' | 'normal' | 'relaxed';
    fontSize: 'small' | 'medium' | 'large';
}

export interface CoverLetter {
    id: string;
    userId: string;
    title: string;
    slug: string;
    content: CoverLetterContent;
    settings: CoverLetterSettings;
    isPublic: boolean;
    thumbnail?: string;
    currentVersion: number;
    createdAt: string;
    updatedAt: string;
}

export interface CoverLetterVersion {
    id: string;
    coverLetterId: string;
    versionNumber: number;
    content: CoverLetterContent;
    settings: CoverLetterSettings;
    createdAt: string;
}

export interface CreateCoverLetterDTO {
    title: string;
    templateId?: string;
    content?: CoverLetterContent;
    settings?: Partial<CoverLetterSettings>;
}

export interface UpdateCoverLetterDTO {
    title?: string;
    content?: CoverLetterContent;
    settings?: Partial<CoverLetterSettings>;
    isPublic?: boolean;
}

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
    body: z.string().optional(),
});
