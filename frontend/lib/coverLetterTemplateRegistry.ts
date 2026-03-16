import { CoverLetterContent } from '@/types/coverLetter';

export type CoverLetterTemplateCategory = 'professional' | 'creative' | 'minimal' | 'modern';

export interface CoverLetterTemplateInfo {
    id: string;
    name: string;
    description: string;
    categories: CoverLetterTemplateCategory[];
    gradient: string;
    accentColor: string;
}

export const COVER_LETTER_TEMPLATES: CoverLetterTemplateInfo[] = [
    {
        id: 'classic',
        name: 'Classic',
        description: 'Clean and professional, traditional cover letter layout',
        categories: ['professional'],
        gradient: 'from-blue-500 to-blue-700',
        accentColor: '#2563eb', // blue-600
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'A sleek, contemporary layout with a stylish header',
        categories: ['professional', 'creative', 'modern'],
        gradient: 'from-violet-500 to-purple-700',
        accentColor: '#8b5cf6', // violet-500
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Ultra-clean, whitespace-heavy layout',
        categories: ['minimal', 'professional'],
        gradient: 'from-gray-300 to-gray-500',
        accentColor: '#4b5563', // gray-600
    },
    {
        id: 'executive',
        name: 'Executive',
        description: 'Polished, authoritative design with accent bars and split header',
        categories: ['professional', 'modern'],
        gradient: 'from-teal-600 to-teal-800',
        accentColor: '#0f766e', // teal-700
    },
    {
        id: 'clean',
        name: 'Clean',
        description: 'Elegant serif typography with decorative accents and refined layout',
        categories: ['professional', 'minimal'],
        gradient: 'from-slate-700 to-slate-900',
        accentColor: '#1a1a2e',
    },
    {
        id: 'management',
        name: 'Management',
        description: 'Sidebar layout with monogram initials, ideal for senior roles',
        categories: ['professional', 'creative'],
        gradient: 'from-blue-900 to-slate-900',
        accentColor: '#0f2040',
    },
];

export const COVER_LETTER_TEMPLATE_CATEGORIES: { id: CoverLetterTemplateCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'professional', label: 'Professional' },
    { id: 'creative', label: 'Creative' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'modern', label: 'Modern' },
];

export function getCoverLetterTemplateById(id: string): CoverLetterTemplateInfo {
    return COVER_LETTER_TEMPLATES.find((t) => t.id === id) || COVER_LETTER_TEMPLATES[0];
}

export const SAMPLE_COVER_LETTER_CONTENT: CoverLetterContent = {
    personalInfo: {
        fullName: 'Alex Morgan',
        title: 'Senior Full Stack Engineer',
        email: 'alex.morgan@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        website: 'https://alexmorgan.dev',
        linkedin: 'https://linkedin.com/in/alexmorgan',
        github: 'https://github.com/alexmorgan',
    },
    letterDetails: {
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        recipientName: 'Hiring Manager',
        recipientTitle: 'Director of Engineering',
        companyName: 'TechFlow Solutions',
        companyAddress: '123 Innovation Drive\nSan Francisco, CA 94107',
        reference: 'Re: Application for Senior Full Stack Engineer Role',
    },
    body: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Full Stack Engineer position at TechFlow Solutions. With over 8 years of experience building scalable web applications and leading cross-functional teams, I am confident in my ability to make an immediate impact on your engineering objectives.

In my recent role at InnovateHub, I spearheaded the migration of a legacy monolithic application to a micro-frontend architecture using React and Next.js, which resulted in a 40% reduction in build times. I am passionate about modernizing infrastructure and scaling platforms efficiently, which aligns perfectly with TechFlow Solutions' commitment to technical excellence.

I look forward to the possibility of discussing how my background, skills, and certifications will be beneficial to your team. Thank you for your time and consideration.

Sincerely,

Alex Morgan`,
};
