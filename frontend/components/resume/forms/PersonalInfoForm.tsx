'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { personalInfoSchema } from '@/types/resume'; // from backend Zod schemas, mirrored
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PersonalInfoForm() {
    const currentResume = useResumeStore((s) => s.currentResume);
    const updateCurrentResume = useResumeStore((s) => s.updateCurrentResume);

    const defaultValues = currentResume?.content?.personalInfo || {};

    const {
        register,
        watch,
        setValue,
        formState: { errors },
        reset
    } = useForm<z.infer<typeof personalInfoSchema>>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues,
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400;
                const MAX_HEIGHT = 400;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                setValue('profileImage', dataUrl, { shouldDirty: true });
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);

        // Reset input so same file can be selected again
        e.target.value = '';
    };

    const removeImage = () => {
        setValue('profileImage', '', { shouldDirty: true });
    };

    // Auto-update store on form changes
    useEffect(() => {
        const subscription = watch((value) => {
            // Validate before updating Store to prevent dirtying with completely broken data,
            // though Zod resolver handles strict validation on submit.
            // For live-preview, we update store optimistically.
            updateCurrentResume({
                content: {
                    ...currentResume?.content,
                    personalInfo: value as z.infer<typeof personalInfoSchema>
                }
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, currentResume, updateCurrentResume]);

    // Reset when resume changes (e.g., loaded from server)
    useEffect(() => {
        if (currentResume?.content?.personalInfo) {
            reset(currentResume.content.personalInfo, { keepDefaultValues: false });
        }
    }, [currentResume?.id, reset]); // Only run when ID changes so we don't fight user input

    return (
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Profile Image Upload */}
            <div className="space-y-3">
                <Label>Profile Picture</Label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-muted bg-muted flex items-center justify-center">
                        {watch('profileImage') ? (
                            <img src={watch('profileImage')} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-8 w-8 text-muted-foreground" />
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="picture-upload" className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                <Upload className="h-4 w-4 mr-2" /> Upload Photo
                            </Label>
                            <Input
                                id="picture-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            {watch('profileImage') && (
                                <Button type="button" variant="destructive" size="sm" onClick={removeImage}>
                                    <X className="h-4 w-4 mr-1" /> Remove
                                </Button>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">Recommended size: 400x400px. Standard formats only (JPG, PNG).</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                    <Label htmlFor="pi-fullName">Full Name</Label>
                    <Input id="pi-fullName" placeholder="John Doe" {...register('fullName')} className={errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""} />
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                    <Label htmlFor="pi-title">Professional Title</Label>
                    <Input id="pi-title" placeholder="Software Engineer" {...register('title')} className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""} />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <Label htmlFor="pi-email">Email</Label>
                    <Input id="pi-email" type="email" placeholder="john@example.com" {...register('email')} className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                    <Label htmlFor="pi-phone">Phone</Label>
                    <Input id="pi-phone" type="tel" placeholder="+1 (555) 123-4567" {...register('phone')} className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""} />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                    <Label htmlFor="pi-location">Location</Label>
                    <Input id="pi-location" placeholder="San Francisco, CA" {...register('location')} className={errors.location ? "border-destructive focus-visible:ring-destructive" : ""} />
                    {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
                </div>

                {/* Website */}
                <div className="space-y-1.5">
                    <Label htmlFor="pi-website">Website</Label>
                    <Input id="pi-website" type="url" placeholder="https://johndoe.com" {...register('website')} className={errors.website ? "border-destructive focus-visible:ring-destructive" : ""} />
                    {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
                </div>

                {/* LinkedIn */}
                <div className="space-y-1.5">
                    <Label htmlFor="pi-linkedin">LinkedIn</Label>
                    <Input id="pi-linkedin" type="url" placeholder="https://linkedin.com/in/johndoe" {...register('linkedin')} className={errors.linkedin ? "border-destructive focus-visible:ring-destructive" : ""} />
                    {errors.linkedin && <p className="text-xs text-destructive">{errors.linkedin.message}</p>}
                </div>

                {/* GitHub */}
                <div className="space-y-1.5">
                    <Label htmlFor="pi-github">GitHub / Portfolio</Label>
                    <Input id="pi-github" type="url" placeholder="https://github.com/johndoe" {...register('github')} className={errors.github ? "border-destructive focus-visible:ring-destructive" : ""} />
                    {errors.github && <p className="text-xs text-destructive">{errors.github.message}</p>}
                </div>
            </div>
        </form>
    );
}
