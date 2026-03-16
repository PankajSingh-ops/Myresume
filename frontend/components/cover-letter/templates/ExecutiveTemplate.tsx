import { CoverLetter } from '@/types/coverLetter';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin } from 'lucide-react';

interface ExecutiveTemplateProps {
    coverLetter: CoverLetter;
}

export function ExecutiveTemplate({ coverLetter }: ExecutiveTemplateProps) {
    const { content, settings } = coverLetter;
    const { personalInfo, letterDetails, body } = content || {};

    const primaryColor = settings?.colors?.primary || '#0f766e'; // teal-700

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9pt]' :
            settings?.fontSize === 'large' ? 'text-[12pt]' :
                'text-[10.5pt]';

    return (
        <div className={cn("w-[794px] bg-white text-gray-900 font-sans leading-relaxed mx-auto box-border flex flex-col", textClass)}>

            {/* Top accent bar */}
            <div className="h-2 w-full" style={{ backgroundColor: primaryColor }} />

            {/* Header */}
            <header className="px-12 pt-10 pb-8 flex items-end justify-between border-b border-gray-200">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight" style={{ color: primaryColor }}>
                        {personalInfo?.fullName || 'Your Name'}
                    </h1>
                    {personalInfo?.title && (
                        <p className="text-base mt-1 font-medium text-gray-500 uppercase tracking-wider">
                            {personalInfo.title}
                        </p>
                    )}
                </div>

                <div className="flex flex-col items-end gap-1.5 text-[0.8em] text-gray-600">
                    {personalInfo?.email && (
                        <div className="flex items-center gap-1.5">
                            <span>{personalInfo.email}</span>
                            <Mail className="h-3.5 w-3.5" style={{ color: primaryColor }} />
                        </div>
                    )}
                    {personalInfo?.phone && (
                        <div className="flex items-center gap-1.5">
                            <span>{personalInfo.phone}</span>
                            <Phone className="h-3.5 w-3.5" style={{ color: primaryColor }} />
                        </div>
                    )}
                    {personalInfo?.location && (
                        <div className="flex items-center gap-1.5">
                            <span>{personalInfo.location}</span>
                            <MapPin className="h-3.5 w-3.5" style={{ color: primaryColor }} />
                        </div>
                    )}
                    {personalInfo?.website && (
                        <div className="flex items-center gap-1.5">
                            <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
                            <Globe className="h-3.5 w-3.5" style={{ color: primaryColor }} />
                        </div>
                    )}
                    {personalInfo?.linkedin && (
                        <div className="flex items-center gap-1.5">
                            <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                            <Linkedin className="h-3.5 w-3.5" style={{ color: primaryColor }} />
                        </div>
                    )}
                </div>
            </header>

            {/* Content area */}
            <div className="px-12 py-8 flex-1 flex flex-col">

                {/* Date & Recipient — two-column layout */}
                <div className="flex justify-between mb-8">
                    <div className="text-gray-700">
                        {letterDetails?.recipientName && <div className="font-semibold text-gray-900">{letterDetails.recipientName}</div>}
                        {letterDetails?.recipientTitle && <div>{letterDetails.recipientTitle}</div>}
                        {letterDetails?.companyName && <div className="font-medium">{letterDetails.companyName}</div>}
                        {letterDetails?.companyAddress && (
                            <div className="whitespace-pre-line mt-1">{letterDetails.companyAddress}</div>
                        )}
                    </div>
                    <div className="text-gray-500 text-right font-medium">
                        {letterDetails?.date || new Date().toLocaleDateString()}
                    </div>
                </div>

                {/* Reference / Subject line */}
                {letterDetails?.reference && (
                    <div
                        className="mb-8 py-3 px-4 rounded font-semibold text-white"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {letterDetails.reference}
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {body || 'Dear Hiring Manager,\n\nI am writing to express my interest in the position...'}
                </div>
            </div>

            {/* Bottom accent bar */}
            <div className="h-1 w-full" style={{ backgroundColor: primaryColor }} />
        </div>
    );
}
