'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { PackagePlus } from 'lucide-react';

import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Badge } from '@/components/ui/badge';
import { COVER_LETTER_TEMPLATES, SAMPLE_COVER_LETTER_CONTENT } from '@/lib/coverLetterTemplateRegistry';
import { TemplateRenderer } from '@/components/cover-letter/templates/TemplateRenderer';
import { CoverLetter } from '@/types/coverLetter';

const RESUME_W = 794;
const RESUME_H = 1123;
const MINI_SCALE = 0.25;

function MiniPreview({ templateId }: { templateId: string }) {
    const mockCoverLetter: CoverLetter = {
        id: 'mock',
        userId: 'mock',
        title: 'Mock Cover Letter',
        slug: 'mock',
        content: SAMPLE_COVER_LETTER_CONTENT,
        settings: {
            templateId,
            spacing: 'normal',
            fontSize: 'medium',
        },
        isPublic: false,
        currentVersion: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    return (
        <div
            className="origin-top-left"
            style={{ transform: `scale(${MINI_SCALE})`, width: `${RESUME_W}px`, height: `${RESUME_H}px` }}
        >
            <TemplateRenderer coverLetter={mockCoverLetter} />
        </div>
    );
}

function TemplateCard({ template }: { template: (typeof COVER_LETTER_TEMPLATES)[number] }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.35);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            const w = entry.contentRect.width;
            setScale(w / RESUME_W);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const previewCoverLetter: CoverLetter = {
        id: 'preview',
        userId: 'preview',
        title: 'Preview',
        slug: 'preview',
        content: SAMPLE_COVER_LETTER_CONTENT,
        settings: {
            templateId: template.id,
            spacing: 'normal',
            fontSize: 'medium',
        },
        isPublic: false,
        currentVersion: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    return (
        <div
            ref={cardRef}
            className="group relative flex flex-col rounded-xl overflow-hidden border bg-card/50 transition-all duration-300 hover:shadow-xl hover:border-primary/50"
        >
            {/* ── Default card content ─────────────────────────────────── */}
            <div className="p-6 bg-muted/30 flex items-center justify-center rounded-t-xl transition-colors group-hover:bg-muted/50">
                <div
                    className="overflow-hidden relative shadow-sm ring-1 ring-black/5 bg-white mx-auto"
                    style={{ width: `${RESUME_W * MINI_SCALE}px`, height: `${RESUME_H * MINI_SCALE}px` }}
                >
                    <MiniPreview templateId={template.id} />
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <div className="flex flex-wrap gap-1 justify-end">
                        {template.categories.map(cat => (
                            <Badge key={cat} variant="secondary" className="capitalize text-[10px] px-1.5 py-0 font-medium">{cat}</Badge>
                        ))}
                    </div>
                </div>
                <p className="text-sm text-muted-foreground flex-1">{template.description}</p>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full bg-linear-to-br ${template.gradient}`} />
                        <span className="text-xs font-medium text-muted-foreground">Color Theme</span>
                    </div>
                    <Link
                        href="/register"
                        className="md:hidden inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                        <PackagePlus className="h-3.5 w-3.5" />
                        Use This
                    </Link>
                </div>
            </div>

            {/* ── Hover overlay: full-card expanded preview ────────── */}
            <div className="absolute inset-0 z-20 hidden md:block opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 rounded-xl overflow-hidden bg-white ring-1 ring-black/10">
                <div className="w-full h-full overflow-hidden relative">
                    <div
                        className="absolute top-0 left-0 origin-top-left"
                        style={{
                            width: `${RESUME_W}px`,
                            height: `${RESUME_H}px`,
                            transform: `scale(${scale})`,
                        }}
                    >
                        <TemplateRenderer coverLetter={previewCoverLetter} />
                    </div>
                </div>

                {/* Bottom gradient bar */}
                <div className="absolute bottom-0 inset-x-0 px-4 py-3.5 bg-linear-to-t from-black/80 via-black/50 to-transparent flex items-end justify-between">
                    <div>
                        <h3 className="font-bold text-white text-base drop-shadow-sm">{template.name}</h3>
                        <div className="flex gap-1.5 mt-0.5">
                            {template.categories.map((cat, i) => (
                                <span key={cat} className="text-[10px] capitalize text-white/70">
                                    {cat}{i < template.categories.length - 1 ? ' ·' : ''}
                                </span>
                            ))}
                        </div>
                    </div>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md shadow-xl hover:opacity-90 transition-opacity shrink-0"
                    >
                        <PackagePlus className="h-3.5 w-3.5" />
                        Use This
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function CoverTemplatesPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PublicHeader />

            <main className="flex-1 py-20 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Cover Letter Templates</h1>
                        <p className="text-lg text-muted-foreground">
                            Choose from our collection of professionally designed cover letter templates. All templates are fully customizable.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                        {COVER_LETTER_TEMPLATES.map((template) => (
                            <TemplateCard key={template.id} template={template} />
                        ))}
                    </div>

                    <div className="mt-20 text-center bg-muted/30 border rounded-2xl p-12">
                        <h2 className="text-3xl font-bold mb-4">Ready to write your cover letter?</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            Sign up for free and start creating professional cover letters with AI-powered writing assistance.
                            Customize any template to match your style.
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 font-medium text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
