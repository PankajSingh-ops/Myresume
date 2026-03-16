'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDebounce } from 'react-use';
import { Loader2, ArrowLeft, Save, AlertCircle, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Link from 'next/link';

import { useCoverLetterStore } from '@/store/coverLetterStore';
import { useCoverLetter, useUpdateCoverLetter } from '@/hooks/useCoverLetter';
import { SectionNavigator, DEFAULT_CL_SECTIONS } from '@/components/cover-letter/SectionNavigator';
import { ExportButton } from '@/components/cover-letter/ExportButton';
import { TemplateSelector } from '@/components/cover-letter/TemplateSelector';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { PersonalInfoForm } from '@/components/cover-letter/forms/PersonalInfoForm';
import { LetterDetailsForm } from '@/components/cover-letter/forms/LetterDetailsForm';
import { BodyForm } from '@/components/cover-letter/forms/BodyForm';
import { LivePreview } from '@/components/cover-letter/LivePreview';

function EditorCenterPanel() {
    return (
        <div className="flex h-full flex-col bg-muted/10 p-4 md:p-8 overflow-y-auto scroll-smooth">
            <div className="mx-auto w-full max-w-3xl space-y-8 pb-32">
                {DEFAULT_CL_SECTIONS.map((section) => {
                    const Form = (() => {
                        switch (section.id) {
                            case 'personalInfo': return <PersonalInfoForm />;
                            case 'letterDetails': return <LetterDetailsForm />;
                            case 'body': return <BodyForm />;
                            default: return <div className="text-muted-foreground p-8 text-center border border-dashed rounded-lg bg-background">Form for {section.label} is under construction...</div>;
                        }
                    })();

                    return (
                        <div key={section.id} id={`section-${section.id}`} className="scroll-mt-8 rounded-xl border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-5 border-b bg-muted/30 rounded-t-xl">
                                <h3 className="font-semibold leading-none tracking-tight text-lg uppercase text-muted-foreground">{section.label}</h3>
                            </div>
                            <div className="p-6">
                                {Form}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function LivePreviewPanel() {
    return (
        <div className="flex h-full flex-col bg-muted/30">
            <div className="flex-1 overflow-auto p-4 flex justify-center">
                <LivePreview />
            </div>
        </div>
    );
}

export default function CoverLetterEditorPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [activeSection, setActiveSection] = useState('personalInfo');
    const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    const { data: serverCoverLetter, isLoading, isError } = useCoverLetter(id);
    const updateCoverLetter = useUpdateCoverLetter(id);

    const currentCoverLetter = useCoverLetterStore((s) => s.currentCoverLetter);
    const setCurrentCoverLetter = useCoverLetterStore((s) => s.setCurrentCoverLetter);
    const isDirty = useCoverLetterStore((s) => s.isDirty);
    const markClean = useCoverLetterStore((s) => s.markClean);

    useEffect(() => {
        if (serverCoverLetter && !currentCoverLetter) {
            setCurrentCoverLetter(serverCoverLetter);
        }
    }, [serverCoverLetter, currentCoverLetter, setCurrentCoverLetter]);

    useEffect(() => {
        return () => setCurrentCoverLetter(null);
    }, [setCurrentCoverLetter]);

    useDebounce(
        () => {
            if (isDirty && currentCoverLetter) {
                setSaveState('saving');
                updateCoverLetter.mutate(
                    {
                        content: currentCoverLetter.content,
                        settings: currentCoverLetter.settings,
                        title: currentCoverLetter.title
                    },
                    {
                        onSuccess: () => {
                            setSaveState('saved');
                            markClean();
                            setTimeout(() => setSaveState('idle'), 2000);
                        },
                        onError: () => {
                            setSaveState('error');
                            toast.error('Failed to auto-save cover letter');
                        }
                    }
                );
            }
        },
        1500,
        [currentCoverLetter, isDirty]
    );

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !currentCoverLetter) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <h2 className="text-2xl font-bold">Cover letter not found</h2>
                <Button onClick={() => router.push('/cover-letters')} variant="outline">Back to My Cover Letters</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <div className="flex flex-col md:flex-row md:h-14 shrink-0 md:items-center justify-between border-b bg-background px-4 py-3 md:py-0 gap-3 md:gap-0">
                <div className="flex items-center gap-4">
                    <Link href="/cover-letters">
                        <Button variant="ghost" size="icon" className="shrink-0" title="Back to Dashboard">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>

                    <div className="hidden lg:flex h-6 w-px bg-border" />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden lg:flex shrink-0"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                    >
                        {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                    </Button>

                    <div className="flex flex-col min-w-0 md:ml-2">
                        <span className="font-semibold text-sm truncate">{currentCoverLetter.title}</span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                            {saveState === 'saving' && <><Loader2 className="h-3 w-3 animate-spin" /> Saving...</>}
                            {saveState === 'saved' && <><Save className="h-3 w-3" /> Saved</>}
                            {saveState === 'error' && <><AlertCircle className="h-3 w-3 text-destructive" /> Save failed</>}
                            {saveState === 'idle' && isDirty && <span className="italic">Unsaved changes...</span>}
                            {saveState === 'idle' && !isDirty && <span>All changes saved</span>}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                    <div className="flex lg:hidden bg-muted/50 p-1 rounded-md">
                        <Button
                            variant={mobileView === 'editor' ? 'default' : 'ghost'}
                            size="sm"
                            className={cn("h-8 px-4", mobileView === 'editor' && "shadow-sm")}
                            onClick={() => setMobileView('editor')}
                        >
                            <span className="text-xs">Editor</span>
                        </Button>
                        <Button
                            variant={mobileView === 'preview' ? 'default' : 'ghost'}
                            size="sm"
                            className={cn("h-8 px-4", mobileView === 'preview' && "shadow-sm")}
                            onClick={() => setMobileView('preview')}
                        >
                            <span className="text-xs">Preview</span>
                        </Button>
                    </div>

                    <TemplateSelector />
                    <ExportButton coverLetterId={id} />
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex relative">
                {sidebarOpen && (
                    <div className={cn(
                        "w-64 border-r bg-background shrink-0",
                        "hidden lg:block"
                    )}>
                        <SectionNavigator
                            activeSection={activeSection}
                            onSectionSelect={(id) => {
                                setActiveSection(id);
                                const el = document.getElementById(`section-${id}`);
                                if (el) {
                                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }}
                        />
                    </div>
                )}

                <div className={cn(
                    "flex-1 flex-col overflow-hidden min-w-0 lg:border-r",
                    mobileView === 'editor' ? 'flex' : 'hidden lg:flex'
                )}>
                    <EditorCenterPanel />
                </div>

                <div className={cn(
                    "w-full lg:w-[45%] xl:w-[50%] shrink-0 flex-col overflow-hidden bg-muted/30",
                    mobileView === 'preview' ? 'flex' : 'hidden lg:flex'
                )}>
                    <LivePreviewPanel />
                </div>
            </div>
        </div>
    );
}
