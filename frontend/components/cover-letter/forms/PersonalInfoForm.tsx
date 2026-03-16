'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCoverLetterStore } from '@/store/coverLetterStore';

export function PersonalInfoForm() {
    const currentCoverLetter = useCoverLetterStore(s => s.currentCoverLetter);
    const updateCurrentCoverLetter = useCoverLetterStore(s => s.updateCurrentCoverLetter);

    if (!currentCoverLetter) return null;
    const info = currentCoverLetter.content?.personalInfo || {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        updateCurrentCoverLetter({
            content: {
                ...currentCoverLetter.content,
                personalInfo: {
                    ...currentCoverLetter.content?.personalInfo,
                    [name]: value,
                },
            },
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" value={info.fullName || ''} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input id="title" name="title" value={info.title || ''} onChange={handleChange} placeholder="Software Engineer" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={info.email || ''} onChange={handleChange} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={info.phone || ''} onChange={handleChange} placeholder="+1 234 567 8900" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={info.location || ''} onChange={handleChange} placeholder="City, State" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="website" value={info.website || ''} onChange={handleChange} placeholder="https://johndoe.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input id="linkedin" name="linkedin" value={info.linkedin || ''} onChange={handleChange} placeholder="https://linkedin.com/in/johndoe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input id="github" name="github" value={info.github || ''} onChange={handleChange} placeholder="https://github.com/johndoe" />
                </div>
            </div>
            {/* Some templates might not use summary for cover letters, but we keep it available */}
            <div className="space-y-2">
                <Label htmlFor="summary">Brief Summary (Optional)</Label>
                <Textarea id="summary" name="summary" value={info.summary || ''} onChange={handleChange} rows={4} className="resize-none" placeholder="A brief professional summary..." />
            </div>
        </div>
    );
}
