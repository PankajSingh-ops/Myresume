import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Lightbulb, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SeverityLevel = 'Critical' | 'Moderate' | 'Minor';

interface ImprovementCardProps {
    title: string;
    description: string;
    suggestion?: string;
    severity?: SeverityLevel;
    how_to_address?: string;
    className?: string;
}

export function ImprovementCard({
    title,
    description,
    suggestion,
    severity,
    how_to_address,
    className
}: ImprovementCardProps) {

    // Maps severity to a distinct color representation
    const severityBadgeClass = {
        Critical: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
        Moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
        Minor: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    };

    // Unique key for accordion item since it can't be empty
    const itemId = `item-${title.replace(/\s+/g, '-').toLowerCase()}`;

    // If there's no actionable suggestion, we can render it as a static card
    // rather than a collapsible item to avoid user clicking with empty content.
    const hasActionableContent = suggestion || how_to_address;

    // The main layout of the card body (the collapsed trigger or fully expanded)
    const renderHeaderLayout = () => (
        <div className="flex w-full items-start gap-3 text-left">
            <AlertCircle className={cn(
                "h-5 w-5 shrink-0 mt-0.5",
                severity === 'Critical' ? 'text-red-500' :
                    severity === 'Moderate' ? 'text-yellow-500' :
                        'text-blue-500'
            )} />
            <div className="flex flex-1 flex-col gap-1 pr-4">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{title}</span>
                    {severity && (
                        <Badge
                            variant="outline"
                            className={cn("px-2 py-0 h-5 text-[10px] uppercase font-bold", severityBadgeClass[severity])}
                        >
                            {severity}
                        </Badge>
                    )}
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed mr-1">
                    {description}
                </p>
            </div>
        </div>
    );

    return (
        <div className={cn(
            "rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden",
            severity === 'Critical' ? 'border-l-4 border-l-red-500' :
                severity === 'Moderate' ? 'border-l-4 border-l-yellow-500' :
                    'border-l-4 border-l-blue-500',
            className
        )}>
            {!hasActionableContent ? (
                <div className="p-4">
                    {renderHeaderLayout()}
                </div>
            ) : (
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={itemId} className="border-b-0">
                        <AccordionTrigger className="p-4 hover:bg-muted/30 hover:no-underline [&[data-state=open]]:bg-muted/30">
                            {renderHeaderLayout()}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-1">
                            <div className="pl-8 pt-3 mt-1 border-t space-y-4">
                                {suggestion && (
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <Lightbulb className="h-4 w-4 text-yellow-500" />
                                            Suggestion
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                                            {suggestion}
                                        </p>
                                    </div>
                                )}

                                {how_to_address && (
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <PenLine className="h-4 w-4 text-green-500" />
                                            How to Address
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed pl-6 whitespace-pre-wrap">
                                            {how_to_address}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
        </div>
    );
}
