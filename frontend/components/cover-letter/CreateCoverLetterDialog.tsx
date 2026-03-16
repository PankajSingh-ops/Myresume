'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, FileText, PaperclipIcon } from 'lucide-react';
import { toast } from 'sonner';

import { COVER_LETTER_TEMPLATES } from '@/lib/coverLetterTemplateRegistry';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateCoverLetter } from '@/hooks/useCoverLetter';
import { useDeductCredits } from '@/hooks/useCredits';
import { CREDIT_COSTS } from '@/types/credits';
import { cn } from '@/lib/utils';

interface CreateCoverLetterDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultTemplateId?: string;
}

export function CreateCoverLetterDialog({ open, onOpenChange, defaultTemplateId = 'classic' }: CreateCoverLetterDialogProps) {
    const router = useRouter();
    const createCoverLetter = useCreateCoverLetter();
    const { withOptimisticDeduction } = useDeductCredits();

    const [title, setTitle] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplateId);

    useEffect(() => {
        if (open) {
            setSelectedTemplate(defaultTemplateId);
        }
    }, [open, defaultTemplateId]);
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        const trimmed = title.trim();
        if (!trimmed) {
            toast.error('Please enter a cover letter title');
            return;
        }

        setIsCreating(true);
        try {
            const coverLetter = await withOptimisticDeduction(
                CREDIT_COSTS.COVER_LETTER_CREATE,
                () =>
                    createCoverLetter.mutateAsync({
                        title: trimmed,
                        templateId: selectedTemplate,
                    }),
            );
            toast.success('Cover Letter created!');
            onOpenChange(false);
            setTitle('');
            setSelectedTemplate('classic');
            router.push(`/cover-letters/${coverLetter.id}/edit`);
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            if (status !== 402) {
                toast.error('Failed to create cover letter. Please try again.');
            }
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <PaperclipIcon className="h-5 w-5 text-primary" />
                        Create Cover Letter
                    </DialogTitle>
                    <DialogDescription>
                        Give your cover letter a name and choose a template to get started.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="cl-title">Cover Letter Title</Label>
                        <Input
                            id="cl-title"
                            placeholder="e.g. Application for Google"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            disabled={isCreating}
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Template</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[45vh] overflow-y-auto px-1 pb-1">
                            {COVER_LETTER_TEMPLATES.map((tmpl) => (
                                <button
                                    key={tmpl.id}
                                    type="button"
                                    disabled={isCreating}
                                    onClick={() => setSelectedTemplate(tmpl.id)}
                                    className={cn(
                                        'group relative flex flex-col items-center rounded-lg border-2 p-3 text-center transition-all hover:shadow-md',
                                        selectedTemplate === tmpl.id
                                            ? 'border-primary bg-primary/5 shadow-sm'
                                            : 'border-transparent bg-muted/50 hover:border-muted-foreground/20',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'mb-2 flex h-16 w-full items-center justify-center rounded-md bg-linear-to-br',
                                            tmpl.gradient,
                                        )}
                                    >
                                        <FileText className="h-6 w-6 text-white/80" />
                                    </div>
                                    <span className="text-sm font-medium">{tmpl.name}</span>
                                    <span className="text-[11px] text-muted-foreground">
                                        {tmpl.description}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:space-x-2 sm:gap-0 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isCreating}
                        className="w-full sm:w-auto cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={isCreating || !title.trim()} className="w-full sm:w-auto cursor-pointer">
                        {isCreating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating…
                            </>
                        ) : (
                            'Create — 20 credits'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
