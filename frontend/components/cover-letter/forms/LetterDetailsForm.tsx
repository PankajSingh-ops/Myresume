'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCoverLetterStore } from '@/store/coverLetterStore';

export function LetterDetailsForm() {
    const currentCoverLetter = useCoverLetterStore(s => s.currentCoverLetter);
    const updateCurrentCoverLetter = useCoverLetterStore(s => s.updateCurrentCoverLetter);

    if (!currentCoverLetter) return null;
    const details = currentCoverLetter.content?.letterDetails || {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        updateCurrentCoverLetter({
            content: {
                ...currentCoverLetter.content,
                letterDetails: {
                    ...currentCoverLetter.content?.letterDetails,
                    [name]: value,
                },
            },
        });
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" value={details.date || ''} onChange={handleChange} placeholder="e.g. October 12, 2024" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="recipientName">Hiring Manager Name</Label>
                    <Input id="recipientName" name="recipientName" value={details.recipientName || ''} onChange={handleChange} placeholder="Jane Smith" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="recipientTitle">Hiring Manager Title</Label>
                    <Input id="recipientTitle" name="recipientTitle" value={details.recipientTitle || ''} onChange={handleChange} placeholder="Director of HR" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" name="companyName" value={details.companyName || ''} onChange={handleChange} placeholder="Google" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Textarea id="companyAddress" name="companyAddress" value={details.companyAddress || ''} onChange={handleChange} rows={3} className="resize-none" placeholder="1600 Amphitheatre Parkway&#10;Mountain View, CA 94043" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="reference">Reference / Subject / Job ID (Optional)</Label>
                <Input id="reference" name="reference" value={details.reference || ''} onChange={handleChange} placeholder="Re: Application for Software Engineer Role" />
            </div>
        </div>
    );
}
