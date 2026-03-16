import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { CoverLetter } from '@/types/coverLetter';
import { TemplateRenderer } from '@/components/cover-letter/templates/TemplateRenderer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchPublicCoverLetter(slug: string): Promise<CoverLetter | null> {
    try {
        const res = await fetch(`${API_URL}/cover-letters/c/${slug}`, {
            next: { revalidate: 0 },
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
    const coverLetter = await fetchPublicCoverLetter(slug);

    if (!coverLetter) {
        return { title: 'Cover Letter Not Found' };
    }

    const name = coverLetter.content?.personalInfo?.fullName || 'Cover Letter';
    const title = coverLetter.content?.personalInfo?.title || '';
    const summary = coverLetter.content?.personalInfo?.summary || '';
    const description = title
        ? `${name} — ${title}`
        : summary
            ? `${name}: ${summary.slice(0, 150)}`
            : `Cover Letter by ${name}`;

    return {
        title: `${name} | Cover Letter`,
        description,
        openGraph: {
            title: `${name} | Cover Letter`,
            description,
            type: 'profile',
        },
    };
}

export default async function PublicCoverLetterPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const coverLetter = await fetchPublicCoverLetter(slug);

    if (!coverLetter) {
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
                {/* Cover letter content centered */}
                <div className="mx-auto max-w-[850px] py-8 px-4">
                    <div className="bg-white shadow-xl ring-1 ring-black/5 rounded-sm">
                        <TemplateRenderer coverLetter={coverLetter} />
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
