'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCreditsStore } from '@/store/creditsStore';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface ExportButtonProps {
    coverLetterId: string;
    className?: string;
}

const EXPORT_COST = 5;

export function ExportButton({ coverLetterId, className }: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);
    const balance = useCreditsStore((s) => s.balance);
    const setBalance = useCreditsStore((s) => s.setBalance);
    const deductOptimistic = useCreditsStore((s) => s.deductOptimistic);
    const revertOptimistic = useCreditsStore((s) => s.revertOptimistic);
    const openInsufficientModal = useCreditsStore((s) => s.openInsufficientModal);

    const handleExport = async () => {
        if (balance === null) return;

        if (balance < EXPORT_COST) {
            openInsufficientModal(EXPORT_COST);
            return;
        }

        try {
            setIsExporting(true);
            deductOptimistic(EXPORT_COST);

            // Assuming backend endpoint /export/pdf/cover-letter/:id exists or we'll create it
            const response = await api.post(
                `/export/pdf/cover-letter/${coverLetterId}`,
                {},
                { responseType: 'blob' }
            );

            // Check HTTP header for updated balance
            const newBalanceStr = response.headers['x-credits-balance'];
            if (newBalanceStr) {
                setBalance(parseInt(newBalanceStr, 10));
            }

            // Create download link
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cover-letter-${coverLetterId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            toast.success('PDF downloaded successfully!');
        } catch (err: unknown) {
            revertOptimistic(EXPORT_COST);
            console.error('Export failed:', err);
            // If it's a blob error, we need to read it as text
            const error = err as any;
            if (error.response?.data instanceof Blob) {
                try {
                    const text = await error.response.data.text();
                    const json = JSON.parse(text);
                    toast.error(json.detail || 'Export failed. Credits refunded.');
                } catch {
                    toast.error('Failed to export PDF. Credits refunded.');
                }
            } else {
                toast.error('Failed to export PDF. Credits refunded.');
            }
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={isExporting}
            className={className}
            variant="default"
        >
            {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Download className="mr-2 h-4 w-4" />
            )}
            {isExporting ? 'Generating PDF... (~5s)' : `Export PDF — ${EXPORT_COST} credits`}
        </Button>
    );
}
