'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, FileText, PaperclipIcon, ArrowRight, ArrowLeft, Plus, Upload, File, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { TEMPLATES } from '@/lib/templateRegistry';

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
import { useCreateResume } from '@/hooks/useResume';
import { useParseResume } from '@/hooks/useParseResume';
import { useDeductCredits } from '@/hooks/useCredits';
import { CREDIT_COSTS } from '@/types/credits';
import { cn } from '@/lib/utils';

interface CreateResumeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultTemplateId?: string;
}

const ACCEPTED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function CreateResumeDialog({ open, onOpenChange, defaultTemplateId = 'classic' }: CreateResumeDialogProps) {
    const router = useRouter();
    const createResume = useCreateResume();
    const parseResume = useParseResume();
    const { withOptimisticDeduction } = useDeductCredits();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [title, setTitle] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplateId);
    const [isCreating, setIsCreating] = useState(false);

    // File upload state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset state when dialog opens
    useEffect(() => {
        if (open) {
            setStep(1);
            setSelectedTemplate(defaultTemplateId);
            setTitle('');
            setSelectedFile(null);
            setUploadProgress('');
        }
    }, [open, defaultTemplateId]);

    const handleNext = () => {
        const trimmed = title.trim();
        if (!trimmed) {
            toast.error('Please enter a resume title');
            return;
        }
        setStep(2);
    };

    const handleCreateNew = async () => {
        setIsCreating(true);
        try {
            const resume = await withOptimisticDeduction(
                CREDIT_COSTS.RESUME_CREATE,
                () =>
                    createResume.mutateAsync({
                        title: title.trim(),
                        templateId: selectedTemplate,
                    }),
            );
            toast.success('Resume created!');
            onOpenChange(false);
            router.push(`/resumes/${resume.id}/edit`);
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            if (status !== 402) {
                toast.error('Failed to create resume. Please try again.');
            }
        } finally {
            setIsCreating(false);
        }
    };

    const handleUseExisting = () => {
        setStep(3);
    };

    // ── File handling ────────────────────────────────────────────────────

    const validateFile = (file: File): boolean => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            toast.error('Invalid file type. Please upload a PDF or DOCX file.');
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error('File too large. Maximum size is 5MB.');
            return false;
        }
        return true;
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && validateFile(file)) {
            setSelectedFile(file);
        }
        e.target.value = '';
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && validateFile(file)) {
            setSelectedFile(file);
        }
    }, []);

    const handleUploadAndParse = async () => {
        if (!selectedFile) {
            toast.error('Please select a file first.');
            return;
        }

        setIsCreating(true);
        setUploadProgress('Uploading your resume...');

        try {
            // Small delay for UX
            await new Promise(r => setTimeout(r, 500));
            setUploadProgress('AI is analyzing your resume...');

            const resume = await parseResume.mutateAsync({
                file: selectedFile,
                title: title.trim(),
                templateId: selectedTemplate,
            });

            setUploadProgress('');
            toast.success('Resume imported successfully! Your data has been pre-filled.');
            onOpenChange(false);
            router.push(`/resumes/${resume.id}/edit`);
        } catch (err: unknown) {
            setUploadProgress('');
            const status = (err as { response?: { status?: number } })?.response?.status;
            if (status === 402) {
                // Insufficient credits handled by global interceptor
            } else if (status === 400) {
                const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
                toast.error(msg || 'Could not parse the file. Please try a different resume.');
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } finally {
            setIsCreating(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                {step === 1 ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <PaperclipIcon className="h-5 w-5 text-primary" />
                                Create Resume
                            </DialogTitle>
                            <DialogDescription>
                                Give your resume a name and choose a template to get started.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-5 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="resume-title">Resume Title</Label>
                                <Input
                                    id="resume-title"
                                    placeholder="e.g. Software Engineer 2026"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                    disabled={isCreating}
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Template</Label>
                                {defaultTemplateId !== 'classic' ? (
                                    (() => {
                                        const tmpl = TEMPLATES.find(t => t.id === selectedTemplate);
                                        return tmpl ? (
                                            <div className="flex items-center gap-3 rounded-lg border-2 border-primary bg-primary/5 p-3">
                                                <div
                                                    className={cn(
                                                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-linear-to-br',
                                                        tmpl.gradient,
                                                    )}
                                                >
                                                    <FileText className="h-5 w-5 text-white/80" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{tmpl.name}</p>
                                                    <p className="text-xs text-muted-foreground">{tmpl.description}</p>
                                                </div>
                                            </div>
                                        ) : null;
                                    })()
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[45vh] overflow-y-auto px-1 pb-1">
                                        {TEMPLATES.map((tmpl) => (
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
                                )}
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:space-x-2 sm:gap-0 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="w-full sm:w-auto cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleNext}
                                disabled={!title.trim()}
                                className="w-full sm:w-auto cursor-pointer gap-1.5"
                            >
                                Next <ArrowRight className="h-4 w-4" />
                            </Button>
                        </DialogFooter>
                    </>
                ) : step === 2 ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <PaperclipIcon className="h-5 w-5 text-primary" />
                                How would you like to start?
                            </DialogTitle>
                            <DialogDescription>
                                Create a fresh resume or upload an existing one.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                            <button
                                type="button"
                                disabled={isCreating}
                                onClick={handleCreateNew}
                                className="group flex flex-col items-center gap-3 rounded-xl border-2 border-transparent bg-muted/50 p-6 text-center transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md cursor-pointer"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                                    {isCreating ? (
                                        <Loader2 className="h-7 w-7 text-primary animate-spin" />
                                    ) : (
                                        <Plus className="h-7 w-7 text-primary" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold">Create New Resume</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Start fresh with a blank template
                                    </p>
                                </div>
                                <span className="text-xs font-medium text-primary">20 credits</span>
                            </button>

                            <button
                                type="button"
                                disabled={isCreating}
                                onClick={handleUseExisting}
                                className="group flex flex-col items-center gap-3 rounded-xl border-2 border-transparent bg-muted/50 p-6 text-center transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md cursor-pointer"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                                    <Upload className="h-7 w-7 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold">Upload Existing Resume</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Upload a PDF or Word file
                                    </p>
                                </div>
                                <span className="text-xs font-medium text-primary">20 credits</span>
                            </button>
                        </div>

                        <DialogFooter className="gap-2 sm:space-x-2 sm:gap-0 mt-2">
                            <Button
                                variant="outline"
                                onClick={() => setStep(1)}
                                disabled={isCreating}
                                className="w-full sm:w-auto cursor-pointer gap-1.5"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isCreating}
                                className="w-full sm:w-auto cursor-pointer"
                            >
                                Cancel
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    /* Step 3: File Upload */
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5 text-primary" />
                                Upload Your Resume
                            </DialogTitle>
                            <DialogDescription>
                                Upload a PDF or DOCX file. AI will extract and structure your data automatically.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4 space-y-4">
                            {/* Drag & Drop Zone */}
                            {!selectedFile && !uploadProgress && (
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={cn(
                                        'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all cursor-pointer',
                                        isDragging
                                            ? 'border-primary bg-primary/5 scale-[1.02]'
                                            : 'border-muted-foreground/25 bg-muted/30 hover:border-primary/50 hover:bg-muted/50',
                                    )}
                                >
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                        <Upload className="h-8 w-8 text-primary" />
                                    </div>
                                    <p className="font-medium text-sm">
                                        {isDragging ? 'Drop your file here' : 'Drag & drop your resume here'}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1.5">
                                        or <span className="text-primary font-medium underline">click to browse</span>
                                    </p>
                                    <p className="text-[11px] text-muted-foreground mt-3">
                                        PDF or DOCX • Max 5MB
                                    </p>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.docx,.doc"
                                className="hidden"
                                onChange={handleFileSelect}
                            />

                            {/* Selected File Preview */}
                            {selectedFile && !uploadProgress && (
                                <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                        <File className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                                        <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 text-muted-foreground hover:text-destructive"
                                        onClick={() => setSelectedFile(null)}
                                        disabled={isCreating}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Processing State */}
                            {uploadProgress && (
                                <div className="flex flex-col items-center gap-4 py-8">
                                    <div className="relative">
                                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                                        </div>
                                        <Loader2 className="absolute -top-1 -left-1 h-[72px] w-[72px] text-primary/30 animate-spin" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium text-sm">{uploadProgress}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            This may take 15-30 seconds
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Info Callout */}
                            {!uploadProgress && (
                                <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3">
                                    <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                                        <strong>How it works:</strong> AI will extract your personal info, experience,
                                        education, skills, and projects from your resume and fill them into the editor.
                                        You can review and edit everything afterwards.
                                    </p>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="gap-2 sm:space-x-2 sm:gap-0 mt-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setUploadProgress('');
                                    setStep(2);
                                }}
                                disabled={isCreating}
                                className="w-full sm:w-auto cursor-pointer gap-1.5"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back
                            </Button>
                            <Button
                                onClick={handleUploadAndParse}
                                disabled={!selectedFile || isCreating}
                                className="w-full sm:w-auto cursor-pointer gap-1.5"
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing…
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4" />
                                        Import & Create — 20 credits
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
