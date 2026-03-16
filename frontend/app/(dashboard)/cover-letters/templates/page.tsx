'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, PackagePlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { COVER_LETTER_TEMPLATES, getCoverLetterTemplateById, SAMPLE_COVER_LETTER_CONTENT } from '@/lib/coverLetterTemplateRegistry';
import { TemplateRenderer } from '@/components/cover-letter/templates/TemplateRenderer';
import { CreateCoverLetterDialog } from '@/components/cover-letter/CreateCoverLetterDialog';
import { CoverLetter } from '@/types/coverLetter';
import { useCreditsStore } from '@/store/creditsStore';
import { CREDIT_COSTS } from '@/types/credits';

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
        <div className="w-[198.5px] h-[280.75px] overflow-hidden relative shadow-sm ring-1 ring-black/5 bg-white mx-auto theme-zinc isolate">
            <div className="origin-top-left" style={{ transform: `scale(${MINI_SCALE})`, width: `${RESUME_W}px`, height: `${RESUME_H}px` }}>
                <TemplateRenderer coverLetter={mockCoverLetter} />
            </div>
        </div>
    );
}

function TemplateCard({
    template,
    onUse,
}: {
    template: (typeof COVER_LETTER_TEMPLATES)[number];
    onUse: (id: string) => void;
}) {
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
                    className="overflow-hidden relative shadow-sm ring-1 ring-black/5 bg-white mx-auto theme-zinc isolate"
                    style={{ width: `${RESUME_W * MINI_SCALE}px`, height: `${RESUME_H * MINI_SCALE}px` }}
                >
                    <MiniPreview templateId={template.id} />
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <div className="flex flex-wrap gap-1">
                        {template.categories.map(cat => (
                            <Badge key={cat} variant="secondary" className="capitalize text-xs font-medium">{cat}</Badge>
                        ))}
                    </div>
                </div>
                <p className="text-sm text-muted-foreground flex-1">{template.description}</p>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full bg-linear-to-br ${template.gradient}`} />
                        <span className="text-xs font-medium text-muted-foreground">Color Theme</span>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => onUse(template.id)}>
                        Select <ArrowLeft className="ml-1 h-3 w-3 rotate-180" />
                    </Button>
                </div>
            </div>

            {/* ── Hover overlay: full-card expanded preview ────────── */}
            <div className="absolute inset-0 z-20 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 rounded-xl overflow-hidden bg-white ring-1 ring-black/10 theme-zinc isolate">
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
                    <Button size="sm" className="shadow-xl cursor-pointer shrink-0" onClick={() => onUse(template.id)}>
                        <PackagePlus className="mr-1.5 h-3.5 w-3.5" />
                        Use This
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function TemplateGalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('classic');

    const balance = useCreditsStore((s) => s.balance);
    const openInsufficientModal = useCreditsStore((s) => s.openInsufficientModal);

    const filteredTemplates = selectedCategory === 'all'
        ? COVER_LETTER_TEMPLATES
        : COVER_LETTER_TEMPLATES.filter(t => t.categories.includes(selectedCategory as any));

    const categories = ['all', ...Array.from(new Set(COVER_LETTER_TEMPLATES.flatMap(t => t.categories)))];

    const handleUseTemplate = useCallback((id: string) => {
        if (balance !== null && balance < CREDIT_COSTS.COVER_LETTER_CREATE) {
            openInsufficientModal(CREDIT_COSTS.COVER_LETTER_CREATE);
            return;
        }
        setSelectedTemplateId(id);
        setCreateDialogOpen(true);
    }, [balance, openInsufficientModal]);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col space-y-4 md:flex-row md:items-end md:justify-between md:space-y-0">
                <div>
                    <div className="mb-2">
                        <Link href="/cover-letters">
                            <Button variant="ghost" size="sm" className="gap-1 -ml-3 text-muted-foreground">
                                <ArrowLeft className="h-4 w-4" /> Back to My Cover Letters
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Template Gallery</h1>
                    <p className="text-muted-foreground mt-1 max-w-xl">
                        Choose a professionally designed cover letter template to get started. You can always change your template later without losing any content.
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        className="capitalize rounded-full px-6 cursor-pointer"
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-4">
                {filteredTemplates.map(template => (
                    <TemplateCard key={template.id} template={template} onUse={handleUseTemplate} />
                ))}
            </div>

            <CreateCoverLetterDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                defaultTemplateId={selectedTemplateId}
            />
        </div>
    );
}
