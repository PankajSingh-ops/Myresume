'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    MoreHorizontal,
    Pencil,
    Copy,
    Globe,
    Lock,
    Link2,
    Trash2,
    FileText,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useDeleteResume, useDuplicateResume, useUpdateResume } from '@/hooks/useResume';
import { useDeductCredits } from '@/hooks/useCredits';
import { useCreditsStore } from '@/store/creditsStore';
import { CREDIT_COSTS } from '@/types/credits';
import { formatDate, cn } from '@/lib/utils';
import type { Resume } from '@/types/resume';

import { getTemplateById } from '@/lib/templateRegistry';
import { TemplateRenderer } from '@/components/resume/templates/TemplateRenderer';

interface ResumeCardProps {
    resume: Resume;
}

const RESUME_W = 794;
const RESUME_H = 1123;
const MINI_SCALE = 0.25;

function MiniPreview({ resume }: { resume: Resume }) {
    return (
        <div className="w-[198.5px] h-[280.75px] overflow-hidden relative bg-white mx-auto theme-zinc isolate">
            <div className="origin-top-left" style={{ transform: `scale(${MINI_SCALE})`, width: `${RESUME_W}px`, height: `${RESUME_H}px` }}>
                <TemplateRenderer resume={resume} />
            </div>
        </div>
    );
}

export function ResumeCard({ resume }: ResumeCardProps) {
    const isPublic = resume.isPublic ?? (resume as any).is_public;
    const router = useRouter();
    const deleteResume = useDeleteResume();
    const duplicateResume = useDuplicateResume();
    const updateResume = useUpdateResume(resume.id);
    const { withOptimisticDeduction } = useDeductCredits();
    const openInsufficientModal = useCreditsStore((s) => s.openInsufficientModal);
    const balance = useCreditsStore((s) => s.balance);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
    const [scale, setScale] = useState(0.35);

    const cardRef = useRef<HTMLDivElement>(null);

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

    const previewTemplate = getTemplateById(resume.settings?.templateId || 'classic');
    const gradient = previewTemplate.gradient;

    const handleEdit = () => router.push(`/resumes/${resume.id}/edit`);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteResume.mutateAsync(resume.id);
            toast.success('Resume deleted');
            setShowDeleteDialog(false);
        } catch {
            toast.error('Failed to delete resume');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDuplicate = async () => {
        if (balance !== null && balance < CREDIT_COSTS.RESUME_CREATE) {
            openInsufficientModal(CREDIT_COSTS.RESUME_CREATE);
            setShowDuplicateDialog(false);
            return;
        }

        setIsDuplicating(true);
        try {
            await withOptimisticDeduction(CREDIT_COSTS.RESUME_CREATE, () =>
                duplicateResume.mutateAsync(resume.id),
            );
            toast.success('Resume duplicated!');
            setShowDuplicateDialog(false);
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            if (status !== 402) {
                toast.error('Failed to duplicate resume');
            }
            setShowDuplicateDialog(false);
        } finally {
            setIsDuplicating(false);
        }
    };

    const handleTogglePublic = async () => {
        setIsTogglingVisibility(true);
        try {
            await updateResume.mutateAsync({ isPublic: !isPublic });
            toast.success(isPublic ? 'Resume set to private' : 'Resume is now public');
        } catch {
            toast.error('Failed to update visibility');
        } finally {
            setIsTogglingVisibility(false);
        }
    };

    const handleCopyLink = () => {
        const url = `${window.location.origin}/r/${resume.slug}`;
        navigator.clipboard.writeText(url);
        toast.success('Share link copied to clipboard');
    };

    return (
        <>
            <div
                ref={cardRef}
                className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/50 cursor-pointer"
                onClick={handleEdit}
            >
                {/* ── Default card content ─────────────────────────────────── */}
                <div className="p-6 bg-muted/30 flex items-center justify-center rounded-t-xl transition-colors group-hover:bg-muted/50">
                    <div
                        className="overflow-hidden relative shadow-sm ring-1 ring-black/5 bg-white mx-auto theme-zinc isolate"
                        style={{ width: `${RESUME_W * MINI_SCALE}px`, height: `${RESUME_H * MINI_SCALE}px` }}
                    >
                        <MiniPreview resume={resume} />
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col relative z-20 bg-card">
                    <h3 className="truncate font-semibold text-lg">{resume.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] capitalize">
                            {resume.settings?.templateId || 'classic'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            {formatDate(resume.updatedAt, 'relative')}
                        </span>
                    </div>

                    {/* Share / Visibility Footer */}
                    <div className="mt-4 pt-4 border-t flex flex-col gap-3">
                        {isPublic ? (
                            <div 
                                className="flex flex-col gap-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-green-600 flex items-center gap-1.5">
                                        <Globe className="h-3.5 w-3.5" /> Public Link
                                    </span>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTogglePublic();
                                        }}
                                        disabled={isTogglingVisibility}
                                    >
                                        <Lock className="h-3 w-3 mr-1" /> Make Private
                                    </Button>
                                </div>
                                <div className="flex gap-2 w-full">
                                    <div className="min-w-0 flex-1 bg-muted/50 rounded-md border border-border/50 px-2 py-1.5 flex items-center overflow-hidden">
                                        <span className="text-xs font-mono text-muted-foreground truncate w-full">
                                            {window?.location?.origin}/r/{resume.slug}
                                        </span>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="h-auto py-1 px-3 shrink-0 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopyLink();
                                        }}
                                    >
                                        <Copy className="h-3 w-3 mr-1.5" /> Copy
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div 
                                className="flex items-center justify-between"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Lock className="h-3.5 w-3.5" />
                                    <span className="text-xs font-medium">Private Listing</span>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 text-xs px-2 gap-1.5 cursor-pointer bg-blue-50/50 hover:bg-blue-100/50 border-blue-200 text-blue-700 hover:text-blue-800 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-400"
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       handleTogglePublic();
                                    }}
                                    disabled={isTogglingVisibility}
                                >
                                    <Globe className="h-3 w-3" />
                                    Make Public
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Hover overlay: full-card expanded preview ────────── */}
                <div className="absolute inset-x-0 bottom-[140px] top-0 z-10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 overflow-hidden bg-white ring-1 ring-black/10 origin-bottom theme-zinc isolate">
                    <div className="w-full h-full overflow-hidden relative">
                        <div
                            className="absolute top-0 left-0 origin-top-left"
                            style={{
                                width: `${RESUME_W}px`,
                                height: `${RESUME_H}px`,
                                transform: `scale(${scale})`,
                            }}
                        >
                            <TemplateRenderer resume={resume} />
                        </div>
                    </div>
                    
                    {/* Top action bar overlay inside preview */}
                    <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/60 to-transparent flex justify-end gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 w-8 p-0 shadow-lg"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <DropdownMenuItem onClick={handleEdit}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setShowDuplicateDialog(true)}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate (20 credits)
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleTogglePublic} disabled={isTogglingVisibility}>
                                    {isPublic ? (
                                        <><Lock className="mr-2 h-4 w-4" /> Make Private</>
                                    ) : (
                                        <><Globe className="mr-2 h-4 w-4" /> Make Public</>
                                    )}
                                </DropdownMenuItem>
                                {isPublic && (
                                    <DropdownMenuItem onClick={handleCopyLink}>
                                        <Link2 className="mr-2 h-4 w-4" /> Copy Share Link
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setShowDeleteDialog(true)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Delete confirmation */}
            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Resume"
                description="This cannot be undone. Your resume and all its versions will be permanently deleted."
                confirmLabel="Delete"
                variant="destructive"
                loading={isDeleting}
                onConfirm={handleDelete}
            />

            {/* Duplicate confirmation */}
            <ConfirmDialog
                open={showDuplicateDialog}
                onOpenChange={setShowDuplicateDialog}
                title="Duplicate Resume"
                description={`This will create a copy of "${resume.title}" and cost 20 credits.`}
                confirmLabel={isDuplicating ? 'Duplicating…' : 'Duplicate — 20 credits'}
                loading={isDuplicating}
                onConfirm={handleDuplicate}
            />
        </>
    );
}
