'use client';

import { useCreditsStore } from '@/store/creditsStore';
import { formatCredits } from '@/lib/utils';
import { CREDIT_COSTS } from '@/types/credits';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const costReference = [
    { label: 'New Resume', cost: CREDIT_COSTS.RESUME_CREATE },
    { label: 'PDF Export', cost: CREDIT_COSTS.PDF_EXPORT },
    { label: 'AI Suggestion', cost: CREDIT_COSTS.AI_SUGGESTION },
    { label: 'AI Full Rewrite', cost: CREDIT_COSTS.AI_FULL_REWRITE },
];

export function InsufficientCreditsModal() {
    const showModal = useCreditsStore((s) => s.showModal);
    const modalRequired = useCreditsStore((s) => s.modalRequired);
    const balance = useCreditsStore((s) => s.balance);
    const closeModal = useCreditsStore((s) => s.closeModal);

    return (
        <Dialog open={showModal} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Not Enough Credits</DialogTitle>
                    <DialogDescription>
                        You need{' '}
                        <span className="font-semibold text-foreground">
                            {formatCredits(modalRequired)}
                        </span>{' '}
                        for this action.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <p className="text-sm text-muted-foreground">
                        Your current balance:{' '}
                        <span className="font-semibold text-foreground">
                            {formatCredits(balance ?? 0)}
                        </span>
                    </p>

                    {/* Cost reference table */}
                    <div className="rounded-lg border p-3">
                        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Credit Cost Reference
                        </p>
                        <ul className="space-y-1">
                            {costReference.map(({ label, cost }) => (
                                <li
                                    key={label}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span>{label}</span>
                                    <span className="font-medium">{formatCredits(cost)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 md:gap-4">
                    <Button variant="outline" onClick={closeModal}>
                        Maybe Later
                    </Button>
                    <Button disabled title="Coming Soon">
                        Buy Credits
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
