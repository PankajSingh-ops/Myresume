import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, Loader2, FileText, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ResumeUploadZoneProps {
    onFileSelect: (file: File) => void;
    isLoading?: boolean;
    accept?: Record<string, string[]>;
    className?: string;
    maxSizeMB?: number;
}

// Default ATS accepted types matching backend
const DEFAULT_ACCEPTS = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/msword': ['.doc'],
    'text/plain': ['.txt'],
};

export function ResumeUploadZone({
    onFileSelect,
    isLoading = false,
    accept = DEFAULT_ACCEPTS,
    className,
    maxSizeMB = 5
}: ResumeUploadZoneProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Convert MB to bytes for react-dropzone
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        // Handle rejected files
        if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            if (rejection.errors[0]?.code === 'file-too-large') {
                toast.error(`File is larger than ${maxSizeMB}MB.`);
            } else if (rejection.errors[0]?.code === 'file-invalid-type') {
                toast.error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
            } else {
                toast.error('Invalid file selected.');
            }
            return;
        }

        // Handle accepted file
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    }, [maxSizeMB, onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles: 1,
        maxSize: maxSizeBytes,
        disabled: isLoading,
    });

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent clicking the dropzone
        setSelectedFile(null);
    };

    // Format the file size nicely (e.g., "1.2 MB" or "840 KB")
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Helper to pick an icon based on extension
    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return <FileText className="h-8 w-8 text-red-500" />;
        if (ext === 'doc' || ext === 'docx') return <FileDown className="h-8 w-8 text-blue-500" />;
        if (ext === 'txt') return <FileText className="h-8 w-8 text-gray-500" />;
        return <File className="h-8 w-8 text-primary" />;
    };

    return (
        <div className={cn("w-full transition-all duration-200", className)}>
            {!selectedFile ? (
                <div
                    {...getRootProps()}
                    className={cn(
                        "relative flex flex-col items-center justify-center w-full h-56 px-6 py-10 transition-colors border-2 border-dashed rounded-lg cursor-pointer",
                        isDragActive
                            ? "border-primary bg-primary/5 "
                            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/10",
                        isLoading && "opacity-50 cursor-not-allowed border-muted-foreground/30"
                    )}
                >
                    <input {...getInputProps()} />

                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                            <UploadCloud className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-base">
                                {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                or click to browse from your computer
                            </p>
                        </div>
                        <div className="flex flex-col pt-2 items-center gap-1.5 text-xs text-muted-foreground">
                            <span>Supports: PDF, DOCX, TXT</span>
                            <span>Maximum size: {maxSizeMB}MB</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative overflow-hidden border rounded-lg bg-card shadow-sm p-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-secondary/50 border">
                            {getFileIcon(selectedFile.name)}
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-semibold text-sm truncate" title={selectedFile.name}>
                                {selectedFile.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {formatFileSize(selectedFile.size)}
                            </span>
                        </div>

                        <div className="shrink-0 pl-2">
                            {isLoading ? (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-medium">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Scanning</span>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={clearFile}
                                    className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                                    aria-label="Remove uploaded file"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
