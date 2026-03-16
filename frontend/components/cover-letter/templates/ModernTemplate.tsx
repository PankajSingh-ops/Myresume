import { CoverLetter } from '@/types/coverLetter';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface ModernTemplateProps {
    coverLetter: CoverLetter;
}

export function ModernTemplate({ coverLetter }: ModernTemplateProps) {
    const { content, settings } = coverLetter;
    const { personalInfo, letterDetails, body } = content || {};

    const primaryColor = settings?.colors?.primary || '#8b5cf6'; // violet-500

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9pt]' :
            settings?.fontSize === 'large' ? 'text-[12pt]' :
                'text-[10.5pt]';

    return (
        <div className={cn("w-[794px]  bg-white text-gray-800 font-sans leading-relaxed flex flex-col mx-auto  box-border", textClass)}>

            {/* Header: Personal Info */}
            <header className="p-12 text-white" style={{ backgroundColor: primaryColor }}>
                <h1 className="text-4xl font-light tracking-wide mb-2">
                    {personalInfo?.fullName || 'Your Name'}
                </h1>
                {personalInfo?.title && (
                    <p className="text-xl font-medium opacity-90">{personalInfo.title}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-6 text-[0.85em] opacity-80">
                    {personalInfo?.email && (
                        <div className="flex items-center gap-1.5">
                            <Mail className="h-4 w-4" />
                            <span>{personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo?.phone && (
                        <div className="flex items-center gap-1.5">
                            <Phone className="h-4 w-4" />
                            <span>{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo?.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {personalInfo.location}
                        </div>
                    )}
                </div>
            </header>

            <div className="p-12 flex-1 flex flex-col">
                {/* Letter Details */}
                <div className="mb-10 text-gray-600">
                    <div className="mb-8 font-medium">
                        {letterDetails?.date || new Date().toLocaleDateString()}
                    </div>

                    <div className="mb-8 border-l-4 pl-4" style={{ borderColor: primaryColor }}>
                        {letterDetails?.recipientName && <div className="font-semibold text-gray-900">{letterDetails.recipientName}</div>}
                        {letterDetails?.recipientTitle && <div>{letterDetails.recipientTitle}</div>}
                        {letterDetails?.companyName && <div className="font-medium text-gray-800">{letterDetails.companyName}</div>}
                        {letterDetails?.companyAddress && (
                            <div className="whitespace-pre-line mt-1">{letterDetails.companyAddress}</div>
                        )}
                    </div>

                    {letterDetails?.reference && (
                        <div className="font-bold text-gray-900">
                            {letterDetails.reference}
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 text-gray-800 leading-loose whitespace-pre-wrap text-justify">
                    {body || 'Dear Hiring Manager,\n\nI am writing to express my interest in the position...'}
                </div>
            </div>
        </div>
    );
}
