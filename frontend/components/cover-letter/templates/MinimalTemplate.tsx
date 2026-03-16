import { CoverLetter } from '@/types/coverLetter';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface MinimalTemplateProps {
    coverLetter: CoverLetter;
}

export function MinimalTemplate({ coverLetter }: MinimalTemplateProps) {
    const { content, settings } = coverLetter;
    const { personalInfo, letterDetails, body } = content || {};

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9pt]' :
            settings?.fontSize === 'large' ? 'text-[12pt]' :
                'text-[10.5pt]';

    return (
        <div className={cn("w-[794px]  bg-white text-gray-900 font-serif leading-loose p-16 mx-auto  box-border flex flex-col", textClass)}>

            <header className="mb-12 text-center">
                <h1 className="text-2xl font-bold tracking-[0.2em] uppercase mb-4 text-gray-800">
                    {personalInfo?.fullName || 'Your Name'}
                </h1>

                <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2 text-[0.8em] text-gray-500 uppercase tracking-widest">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>•</span>}
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo?.location && <span>•</span>}
                    {personalInfo?.location && <span>{personalInfo.location}</span>}
                </div>
            </header>

            <div className="mb-10 text-[0.95em]">
                <div className="mb-8">{letterDetails?.date || new Date().toLocaleDateString()}</div>

                <div className="mb-8">
                    {letterDetails?.recipientName && <div>{letterDetails.recipientName}</div>}
                    {letterDetails?.recipientTitle && <div>{letterDetails.recipientTitle}</div>}
                    {letterDetails?.companyName && <div>{letterDetails.companyName}</div>}
                    {letterDetails?.companyAddress && <div className="whitespace-pre-line">{letterDetails.companyAddress}</div>}
                </div>

                {letterDetails?.reference && (
                    <div className="mb-8 italic text-gray-600">
                        {letterDetails.reference}
                    </div>
                )}
            </div>

            <div className="flex-1 whitespace-pre-wrap text-justify text-[0.95em]">
                {body || 'Dear Hiring Manager,\n\nI am writing to express my interest in the position...'}
            </div>
        </div>
    );
}
