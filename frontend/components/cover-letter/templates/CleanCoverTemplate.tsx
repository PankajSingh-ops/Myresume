import { CoverLetter } from '@/types/coverLetter';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail } from 'lucide-react';

interface CleanTemplateProps {
    coverLetter: CoverLetter;
}

export function CleanTemplate({ coverLetter }: CleanTemplateProps) {
    const { content, settings } = coverLetter;
    const { personalInfo, letterDetails, body } = content || {};

    const accentColor = settings?.colors?.primary || '#1a1a2e';

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9pt]' :
            settings?.fontSize === 'large' ? 'text-[12pt]' :
                'text-[10.5pt]';

    return (
        <div
            className={cn(
                'w-[794px] min-h-[1123px] bg-white text-gray-800 font-serif leading-relaxed flex flex-col mx-auto box-border',
                textClass
            )}
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
            {/* Top accent line */}
            <div className="h-[3px] w-full" style={{ backgroundColor: accentColor }} />

            {/* Header */}
            <header className="px-16 pt-12 pb-8 border-b border-gray-100">
                <div className="flex items-end justify-between gap-8">
                    {/* Name & Title */}
                    <div>
                        <h1
                            className="text-[32pt] font-normal tracking-tight text-gray-900 leading-none mb-2"
                            style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.01em' }}
                        >
                            {personalInfo?.fullName || 'Your Name'}
                        </h1>
                        {personalInfo?.title && (
                            <p
                                className="text-[10.5pt] font-normal tracking-[0.18em] uppercase mt-2"
                                style={{ color: accentColor }}
                            >
                                {personalInfo.title}
                            </p>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div
                        className="flex flex-col items-end gap-1.5 text-[8.5pt] text-gray-500 shrink-0"
                        style={{ fontFamily: "'Georgia', serif" }}
                    >
                        {personalInfo?.email && (
                            <div className="flex items-center gap-1.5">
                                <span>{personalInfo.email}</span>
                                <Mail className="h-3 w-3 text-gray-400" />
                            </div>
                        )}
                        {personalInfo?.phone && (
                            <div className="flex items-center gap-1.5">
                                <span>{personalInfo.phone}</span>
                                <Phone className="h-3 w-3 text-gray-400" />
                            </div>
                        )}
                        {personalInfo?.location && (
                            <div className="flex items-center gap-1.5">
                                <span>{personalInfo.location}</span>
                                <MapPin className="h-3 w-3 text-gray-400" />
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Body */}
            <main className="px-16 py-10 flex-1 flex flex-col">

                {/* Date */}
                <div
                    className="text-[9pt] text-gray-400 mb-8 tracking-wide"
                    style={{ fontFamily: "'Georgia', serif" }}
                >
                    {letterDetails?.date || new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </div>

                {/* Recipient Block */}
                <div className="mb-8 text-[10pt] leading-relaxed text-gray-700" style={{ fontFamily: "'Georgia', serif" }}>
                    {letterDetails?.recipientName && (
                        <div className="font-semibold text-gray-900">{letterDetails.recipientName}</div>
                    )}
                    {letterDetails?.recipientTitle && (
                        <div className="text-gray-600">{letterDetails.recipientTitle}</div>
                    )}
                    {letterDetails?.companyName && (
                        <div className="text-gray-700">{letterDetails.companyName}</div>
                    )}
                    {letterDetails?.companyAddress && (
                        <div className="whitespace-pre-line text-gray-500 text-[9pt] mt-1">
                            {letterDetails.companyAddress}
                        </div>
                    )}
                </div>

                {/* Reference Line */}
                {letterDetails?.reference && (
                    <div
                        className="mb-6 text-[10pt] font-semibold text-gray-900 pb-3 border-b border-gray-100"
                        style={{ fontFamily: "'Georgia', serif" }}
                    >
                        {letterDetails.reference}
                    </div>
                )}

                {/* Thin decorative rule before body */}
                <div className="flex items-center gap-3 mb-7">
                    <div className="h-px flex-1 bg-gray-100" />
                    <div className="h-1 w-1 rounded-full" style={{ backgroundColor: accentColor }} />
                    <div className="h-px w-6 bg-gray-200" />
                </div>

                {/* Letter Body */}
                <div
                    className="flex-1 text-[10.5pt] text-gray-700 leading-[1.9] whitespace-pre-wrap text-justify"
                    style={{ fontFamily: "'Georgia', serif" }}
                >
                    {body || 'Dear Hiring Manager,\n\nI am writing to express my interest in the position...'}
                </div>
            </main>

            {/* Footer accent */}
            <footer className="px-16 pb-10 pt-4">
                <div className="flex items-center gap-3">
                    <div className="h-px w-6 bg-gray-200" />
                    <div className="h-1 w-1 rounded-full bg-gray-300" />
                    <div className="h-px flex-1 bg-gray-100" />
                </div>
                <div
                    className="mt-3 text-[8pt] text-gray-300 text-right tracking-widest uppercase"
                    style={{ fontFamily: "'Georgia', serif" }}
                >
                    {personalInfo?.fullName || ''}
                </div>
            </footer>

            {/* Bottom accent line */}
            <div className="h-[3px] w-full" style={{ backgroundColor: accentColor }} />
        </div>
    );
}