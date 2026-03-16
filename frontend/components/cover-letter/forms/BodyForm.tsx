'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCoverLetterStore } from '@/store/coverLetterStore';
import { AIImproveButton } from '@/components/resume/AIImproveButton';
import { useImproveCoverLetter } from '@/hooks/useAI';

export function BodyForm() {
    const currentCoverLetter = useCoverLetterStore(s => s.currentCoverLetter);
    const updateCurrentCoverLetter = useCoverLetterStore(s => s.updateCurrentCoverLetter);

    if (!currentCoverLetter) return null;
    const bodyContent = currentCoverLetter.content?.body || '';

    const improveMutation = useImproveCoverLetter();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateCurrentCoverLetter({
            content: {
                ...currentCoverLetter.content,
                body: e.target.value,
            },
        });
    };

    const handleImprove = async () => {
        if (!bodyContent) return;

        const role = currentCoverLetter.content?.letterDetails?.recipientTitle || '';
        const company = currentCoverLetter.content?.letterDetails?.companyName || '';

        try {
            const improvedText = await improveMutation.mutateAsync({
                body: bodyContent,
                role,
                company
            });
            updateCurrentCoverLetter({
                content: {
                    ...currentCoverLetter.content,
                    body: improvedText,
                },
            });
        } catch (error) {
            throw error; // Handled by AIImproveButton toast
        }
    };

    return (
        <div className="space-y-4 flex flex-col h-full min-h-[500px]">
            <div className="flex justify-between items-center">
                <Label htmlFor="body">Letter Body</Label>
                <AIImproveButton
                    label="✨ Improve Letter (2 credits)"
                    cost={2}
                    onImprove={handleImprove}
                    disabled={!bodyContent || bodyContent.length < 10}
                />
            </div>
            <div className="flex-1">
                <Textarea
                    id="body"
                    name="body"
                    value={bodyContent}
                    onChange={handleChange}
                    className="min-h-[400px] h-full resize-none p-4 text-sm leading-relaxed"
                    placeholder="Dear Hiring Manager,&#10;&#10;I am writing to express my interest in..."
                />
            </div>
        </div>
    );
}
