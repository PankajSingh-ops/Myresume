import { z } from 'zod';

export const improveBulletsSchema = z.object({
    bullets: z.array(z.string()).min(1).max(10),
    role: z.string().max(100),
    industry: z.string().max(100).optional()
});

export const improveSummarySchema = z.object({
    summary: z.string().max(2000),
    role: z.string().max(100),
    experienceYears: z.number().int().min(0).max(50).optional()
});

export const improveCoverLetterSchema = z.object({
    body: z.string().max(5000),
    role: z.string().max(100).optional(),
    company: z.string().max(200).optional()
});

export const generateBulletsSchema = z.object({
    role: z.string().max(100),
    company: z.string().max(200),
    responsibilities: z.string().max(1000)
});

export const suggestSkillsSchema = z.object({
    role: z.string().max(100),
    currentSkills: z.array(z.string()).max(50)
});

export const rewriteSectionSchema = z.object({
    sectionType: z.enum(['summary', 'experience', 'skills']),
    content: z.string().max(3000),
    instruction: z.string().max(500)
});

export type ImproveBulletsDTO = z.infer<typeof improveBulletsSchema>;
export type ImproveSummaryDTO = z.infer<typeof improveSummarySchema>;
export type ImproveCoverLetterDTO = z.infer<typeof improveCoverLetterSchema>;
export type GenerateBulletsDTO = z.infer<typeof generateBulletsSchema>;
export type SuggestSkillsDTO = z.infer<typeof suggestSkillsSchema>;
export type RewriteSectionDTO = z.infer<typeof rewriteSectionSchema>;
