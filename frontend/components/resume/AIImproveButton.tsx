'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCreditsStore } from '@/store/creditsStore';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface AIImproveButtonProps {
    label: string;
    cost: number;
    onImprove: () => Promise<void>;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    disabled?: boolean;
}

export function AIImproveButton({
    label,
    cost,
    onImprove,
    variant = 'secondary',
    size = 'sm',
    className,
    disabled = false,
}: AIImproveButtonProps) {
    const [isImproving, setIsImproving] = useState(false);
    const balance = useCreditsStore((s) => s.balance);
    const deductOptimistic = useCreditsStore((s) => s.deductOptimistic);
    const revertOptimistic = useCreditsStore((s) => s.revertOptimistic);
    const openInsufficientModal = useCreditsStore((s) => s.openInsufficientModal);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (balance === null) return;

        if (balance < cost) {
            openInsufficientModal(cost);
            return;
        }

        try {
            setIsImproving(true);
            deductOptimistic(cost);
            await onImprove();
            // On success, the API hook should ideally refetch balance or we trust the next query.
            // E.g., The caller handles setting the form value and Sonner toast.
        } catch (error) {
            revertOptimistic(cost);
            console.error('AI improvement failed:', error);
            toast.error('AI improvement failed. Credits have been refunded.');
        } finally {
            setIsImproving(false);
        }
    };

    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant={variant}
                        size={size}
                        className={className}
                        disabled={disabled || isImproving}
                        onClick={handleClick}
                    >
                        {isImproving ? (
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-3.5 w-3.5 text-blue-500" />
                        )}
                        {label}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Costs {cost} credits. You have {balance ?? 0} credits.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
