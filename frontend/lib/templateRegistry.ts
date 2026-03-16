import { ResumeContent } from '@/types/resume';

export type TemplateCategory = 'professional' | 'creative' | 'minimal' | 'management' | 'engineering' | 'student' | 'hr';

export interface TemplateInfo {
    id: string;
    name: string;
    description: string;
    categories: TemplateCategory[];
    gradient: string;
    accentColor: string;
}

export const TEMPLATES: TemplateInfo[] = [
    {
        id: 'avatar',
        name: 'Avatar',
        description: 'Modern profile-focused design featuring a prominent circular photo',
        categories: ['creative', 'professional'],
        gradient: 'from-fuchsia-500 to-pink-600',
        accentColor: '#d946ef', // fuchsia-500
    },
    {
        id: 'classic',
        name: 'Classic',
        description: 'Clean and professional, traditional layout',
        categories: ['professional'],
        gradient: 'from-blue-500 to-blue-700',
        accentColor: '#2563eb', // blue-600
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'Two-column design with a sleek sidebar',
        categories: ['professional', 'creative'],
        gradient: 'from-violet-500 to-purple-700',
        accentColor: '#8b5cf6', // violet-500
    },
    {
        id: 'executive',
        name: 'Executive',
        description: 'Bold header, formal and authoritative',
        categories: ['professional', 'management'],
        gradient: 'from-slate-600 to-slate-900',
        accentColor: '#334155', // slate-700
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Colorful sidebar with playful section layouts',
        categories: ['creative'],
        gradient: 'from-teal-400 to-emerald-600',
        accentColor: '#0d9488', // teal-600
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
        id: 'professional',
        name: 'Professional',
        description: 'Horizontal sections, ATS-friendly structure',
        categories: ['professional', 'engineering'],
        gradient: 'from-amber-500 to-orange-700',
        accentColor: '#d97706', // amber-600
    },
    {
        id: 'corporate',
        name: 'Corporate',
        description: 'Traditional two-column elegant serif layout',
        categories: ['professional', 'management'],
        gradient: 'from-blue-800 to-blue-950',
        accentColor: '#1e3a8a', // blue-900
    },
    {
        id: 'technical',
        name: 'Technical',
        description: 'Monospaced terminal-inspired layout for engineers',
        categories: ['creative', 'engineering'],
        gradient: 'from-green-500 to-green-800',
        accentColor: '#16a34a', // green-600
    },
    {
        id: 'startup',
        name: 'Startup',
        description: 'Bold, high-contrast modern template for tech and design',
        categories: ['creative', 'engineering'],
        gradient: 'from-orange-500 to-rose-600',
        accentColor: '#f97316', // orange-500
    },
    {
        id: 'elegant',
        name: 'Elegant',
        description: 'Sophisticated editorial serif design with distinct spacing',
        categories: ['professional', 'management'],
        gradient: 'from-slate-800 to-black',
        accentColor: '#0f172a', // slate-900
    },
    {
        id: 'tech',
        name: 'Developer',
        description: 'Github/Modern-dashboard inspired dark look',
        categories: ['creative', 'engineering'],
        gradient: 'from-blue-600 to-indigo-900',
        accentColor: '#3b82f6', // blue-500
    },
    {
        id: 'editorial',
        name: 'Editorial',
        description: 'High-contrast, striking design with modern typography',
        categories: ['creative'],
        gradient: 'from-zinc-800 to-zinc-950',
        accentColor: '#c8f135', // electric lime
    },
    {
        id: 'luxury',
        name: 'Luxury',
        description: 'Premium elegant design with gold accents and serif typography',
        categories: ['professional', 'management'],
        gradient: 'from-amber-700 to-stone-900',
        accentColor: '#b8986a', // gold
    },
    {
        id: 'fresher',
        name: 'Fresher',
        description: 'Vibrant and modern design perfect for recent graduates',
        categories: ['creative', 'student'],
        gradient: 'from-indigo-500 to-pink-500',
        accentColor: '#6c63ff', // primary color
    },
    {
        id: 'management',
        name: 'Management',
        description: 'Executive navy sidebar with gold accents for leadership roles',
        categories: ['professional', 'management'],
        gradient: 'from-blue-900 to-amber-700',
        accentColor: '#0f2a4a', // deep navy
    },
    {
        id: 'faang',
        name: 'FAANG',
        description: 'Clean ATS-optimized layout inspired by top tech company standards',
        categories: ['engineering', 'professional', 'minimal'],
        gradient: 'from-blue-500 to-blue-800',
        accentColor: '#1a6cf0', // bright blue
    },
    {
        id: 'techstudent',
        name: 'Tech Student',
        description: 'Developer-themed template with code-inspired elements for CS students',
        categories: ['student', 'engineering', 'creative'],
        gradient: 'from-sky-400 to-slate-800',
        accentColor: '#0ea5e9', // sky blue
    },
    {
        id: 'hr',
        name: 'HR',
        description: 'Warm and approachable design tailored for human resources professionals',
        categories: ['hr', 'professional'],
        gradient: 'from-rose-400 to-orange-400',
        accentColor: '#c05a7a', // deep rose
    },
    {
        id: 'hr-latest',
        name: 'HR Latest',
        description: 'Refined sidebar layout with warm brown accents and timeline-based experience',
        categories: ['hr', 'professional'],
        gradient: 'from-amber-600 to-stone-700',
        accentColor: '#7c5c3e', // warm brown
    },
    {
        id: 'modern-line',
        name: 'Modern Line',
        description: 'Editorial serif design with gradient line dividers and clean grid layout',
        categories: ['professional', 'minimal'],
        gradient: 'from-sky-600 to-blue-900',
        accentColor: '#0f4c75', // navy blue
    },
    {
        id: 'swe',
        name: 'SWE',
        description: 'Clean ATS-friendly single-column layout optimized for software engineers',
        categories: ['engineering', 'minimal', 'professional'],
        gradient: 'from-gray-800 to-gray-950',
        accentColor: '#0a0a0a', // near black
    },
    {
        id: 'fresher-friendly',
        name: 'Fresher Friendly',
        description: 'Vibrant header with sidebar skills layout, ideal for recent graduates',
        categories: ['student', 'creative'],
        gradient: 'from-emerald-500 to-green-800',
        accentColor: '#2d6a4f', // forest green
    },
];

export const TEMPLATE_CATEGORIES: { id: TemplateCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'professional', label: 'Professional' },
    { id: 'creative', label: 'Creative' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'management', label: 'Management' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'student', label: 'Student' },
    { id: 'hr', label: 'HR' },
];

export function getTemplateById(id: string): TemplateInfo {
    return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}

export const SAMPLE_RESUME_CONTENT: ResumeContent = {
    personalInfo: {
        fullName: 'Alex Morgan',
        title: 'Senior Full Stack Engineer',
        email: 'alex.morgan@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        website: 'https://alexmorgan.dev',
        linkedin: 'https://linkedin.com/in/alexmorgan',
        github: 'https://github.com/alexmorgan',
        summary: 'Passionate and results-driven Senior Full Stack Engineer with over 8 years of experience building scalable web applications. Expertise in React, Node.js, and cloud architecture. Proven track record of leading cross-functional teams to deliver high-impact products on time.',
    },
    experience: [
        {
            id: 'exp1',
            company: 'TechFlow Solutions',
            position: 'Senior Software Engineer',
            startDate: 'Jan 2021',
            endDate: '',
            current: true,
            description: 'Leading the frontend infrastructure team to modernize the core SaaS platform.',
            bullets: [
                'Spearheaded the migration of a legacy monolithic application to a micro-frontend architecture using React and Next.js, reducing build times by 40%.',
                'Mentored a team of 5 junior engineers, conducting weekly code reviews and pair programming sessions.',
                'Implemented comprehensive CI/CD pipelines using GitHub Actions, increasing deployment frequency by 3x.',
                'Optimized core database queries in PostgreSQL, reducing average API response times from 400ms to 120ms.'
            ],
        },
        {
            id: 'exp2',
            company: 'InnovateHub',
            position: 'Software Engineer',
            startDate: 'Mar 2017',
            endDate: 'Dec 2020',
            current: false,
            description: 'Developed and maintained robust backend services for a high-traffic e-commerce platform.',
            bullets: [
                'Designed and implemented RESTful APIs using Node.js and Express, serving over 1M active users.',
                'Integrated multiple third-party payment gateways including Stripe and PayPal, ensuring PCI compliance.',
                'Led the transition to containerized deployments using Docker and Kubernetes, improving system resilience.'
            ],
        }
    ],
    education: [
        {
            id: 'edu1',
            institution: 'University of California, Berkeley',
            degree: 'Master of Science',
            field: 'Computer Science',
            startDate: 'Aug 2015',
            endDate: 'May 2017',
            gpa: '3.8/4.0',
            description: 'Specialization in Software Engineering and Distributed Systems.',
        },
        {
            id: 'edu2',
            institution: 'University of Washington',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: 'Sep 2011',
            endDate: 'Jun 2015',
            gpa: '3.9/4.0',
            description: '',
        }
    ],
    skills: [
        {
            id: 'skill1',
            category: 'Frontend',
            items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux'],
        },
        {
            id: 'skill2',
            category: 'Backend',
            items: ['Node.js', 'Express', 'Python', 'Go', 'GraphQL'],
        },
        {
            id: 'skill3',
            category: 'Infrastructure',
            items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'PostgreSQL'],
        }
    ],
    projects: [
        {
            id: 'proj1',
            name: 'CloudSync Open Source',
            description: 'A lightning-fast, decentralized file synchronization tool.',
            url: 'https://github.com/alexmorgan/cloudsync',
            technologies: ['Go', 'gRPC', 'React'],
            bullets: [
                'Gained over 2,000 stars on GitHub and adopted by several startups.',
                'Implemented an efficient delta-compression algorithm reducing bandwidth usage by 60%.'
            ],
        }
    ],
    certifications: [
        {
            id: 'cert1',
            name: 'AWS Solutions Architect – Professional',
            issuer: 'Amazon Web Services',
            date: 'Mar 2023',
            url: 'https://aws.amazon.com/certification/',
        },
        {
            id: 'cert2',
            name: 'Google Cloud Professional Cloud Architect',
            issuer: 'Google Cloud',
            date: 'Nov 2022',
            url: '',
        }
    ],
    languages: [
        {
            id: 'lang1',
            language: 'English',
            proficiency: 'native',
        },
        {
            id: 'lang2',
            language: 'Spanish',
            proficiency: 'conversational',
        }
    ]
};
