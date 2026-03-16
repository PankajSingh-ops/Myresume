'use client';

import { Check, FileText } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';
import { TEMPLATES } from '@/lib/templateRegistry';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function TemplateSelector() {
    const currentResume = useResumeStore((s) => s.currentResume);
    const updateCurrentResume = useResumeStore((s) => s.updateCurrentResume);

    if (!currentResume) return null;

    const currentTemplateId = currentResume.settings?.templateId || 'classic';
    const currentTemplate = TEMPLATES.find((t) => t.id === currentTemplateId) || TEMPLATES[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex h-8 gap-2 border-dashed">
                    <span
                        className={cn(
                            'block w-3 h-3 rounded-full bg-gradient-to-br',
                            currentTemplate.gradient
                        )}
                    />
                    <span className="font-medium text-xs">Template: {currentTemplate.name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                    {TEMPLATES.map((tmpl) => (
                        <DropdownMenuItem
                            key={tmpl.id}
                            className="flex items-center gap-3 cursor-pointer py-2"
                            onClick={() => {
                                if (tmpl.id === currentTemplateId) return;

                                updateCurrentResume({
                                    settings: {
                                        ...currentResume.settings,
                                        templateId: tmpl.id,
                                    },
                                });
                                toast.success(`Changed to ${tmpl.name} template`);
                            }}
                        >
                            <div
                                className={cn(
                                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br',
                                    tmpl.gradient
                                )}
                            >
                                <FileText className="h-3.5 w-3.5 text-white/80" />
                            </div>
                            <div className="flex flex-col flex-1">
                                <span className="text-sm font-medium leading-none">{tmpl.name}</span>
                                <span className="text-[10px] text-muted-foreground mt-1">
                                    {tmpl.categories.join(', ')}
                                </span>
                            </div>
                            {currentTemplateId === tmpl.id && (
                                <Check className="h-4 w-4 shrink-0 text-primary animate-in fade-in zoom-in" />
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
