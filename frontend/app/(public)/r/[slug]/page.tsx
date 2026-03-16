import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Resume } from '@/types/resume';
import { TemplateRenderer } from '@/components/resume/templates/TemplateRenderer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchPublicResume(slug: string): Promise<Resume | null> {
    try {
        const res = await fetch(`${API_URL}/resumes/r/${slug}`, {
            next: { revalidate: 0 }, // no cache
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data;
    } catch {
        return null;
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const resume = await fetchPublicResume(slug);

    if (!resume) {
        return { title: 'Resume Not Found' };
    }

    const name = resume.content?.personalInfo?.fullName || 'Resume';
    const title = resume.content?.personalInfo?.title || '';
    const summary = resume.content?.personalInfo?.summary || '';
    const description = title
        ? `${name} — ${title}`
        : summary
            ? `${name}: ${summary.slice(0, 150)}`
            : `Resume by ${name}`;

    return {
        title: `${name} | Resume`,
        description,
        openGraph: {
            title: `${name} | Resume`,
            description,
            type: 'profile',
        },
    };
}

export default async function PublicResumePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const resume = await fetchPublicResume(slug);

    if (!resume) {
        notFound();
    }

    return (
        <>
            {/* Print styles */}
            <style>{`
                @media print {
                    .watermark-bar { display: none !important; }
                    body { margin: 0; padding: 0; }
                    @page { size: A4; margin: 0; }
                }
            `}</style>

            <div className="min-h-screen bg-gray-100">
                {/* Resume content centered */}
                <div className="mx-auto max-w-[850px] py-8 px-4">
                    <div className="bg-white shadow-xl ring-1 ring-black/5 rounded-sm">
                        <TemplateRenderer resume={resume} />
                    </div>
                </div>

                {/* Watermark bar */}
                <div className="watermark-bar fixed bottom-0 inset-x-0 z-50 border-t bg-white/95 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-[850px] items-center justify-between px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                            Made with{' '}
                            <span className="font-semibold text-foreground">
                                Resume Builder
                            </span>
                        </span>
                        <a
                            href="/"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Create yours free →
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
