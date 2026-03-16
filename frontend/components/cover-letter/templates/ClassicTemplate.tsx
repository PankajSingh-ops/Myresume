import { CoverLetter } from '@/types/coverLetter';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface ClassicTemplateProps {
    coverLetter: CoverLetter;
}

export function ClassicTemplate({ coverLetter }: ClassicTemplateProps) {
    const { content, settings } = coverLetter;
    const { personalInfo, letterDetails, body } = content || {};

    const primaryColor = settings?.colors?.primary || '#2563eb'; // standard blue

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9pt]' :
            settings?.fontSize === 'large' ? 'text-[12pt]' :
                'text-[10.5pt]';

    return (
        <div className={cn("w-[794px]  bg-white text-black font-sans leading-snug p-12 mx-auto  box-border flex flex-col", textClass)}>

            {/* Header: Personal Info */}
            <header className="border-b-2 pb-6 mb-8" style={{ borderBottomColor: primaryColor }}>
                <h1 className="text-3xl font-bold uppercase tracking-tight" style={{ color: primaryColor }}>
                    {personalInfo?.fullName || 'Your Name'}
                </h1>
                {personalInfo?.title && (
                    <p className="text-lg mt-1 font-medium text-gray-700">{personalInfo.title}</p>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-4 text-[0.85em] text-gray-600">
                    {personalInfo?.email && (
                        <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo?.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {personalInfo.location}
                        </div>
                    )}
                    {personalInfo?.website && (
                        <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
                        </div>
                    )}
                    {personalInfo?.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin className="h-3 w-3" />
                            <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Letter Details */}
            <div className="mb-8">
                <div className="mb-6 text-gray-800">
                    {letterDetails?.date || new Date().toLocaleDateString()}
                </div>

                <div className="mb-6 text-gray-800 font-medium">
                    {letterDetails?.recipientName && <div>{letterDetails.recipientName}</div>}
                    {letterDetails?.recipientTitle && <div>{letterDetails.recipientTitle}</div>}
                    {letterDetails?.companyName && <div>{letterDetails.companyName}</div>}
                    {letterDetails?.companyAddress && (
                        <div className="whitespace-pre-line">{letterDetails.companyAddress}</div>
                    )}
                </div>

                {letterDetails?.reference && (
                    <div className="mb-6 font-semibold" style={{ color: primaryColor }}>
                        {letterDetails.reference}
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex-1 text-gray-800 leading-relaxed whitespace-pre-wrap">
                {body || 'Dear Hiring Manager,\n\nI am writing to express my interest in the position...'}
            </div>
        </div>
    );
}
