import { CoverLetter } from '@/types/coverLetter';
import { cn } from '@/lib/utils';

interface ManagementTemplateProps {
    coverLetter: CoverLetter;
}

export function ManagementTemplate({ coverLetter }: ManagementTemplateProps) {
    const { content, settings } = coverLetter;
    const { personalInfo, letterDetails, body } = content || {};

    const accentColor = settings?.colors?.primary || '#0f2040';

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9pt]' :
            settings?.fontSize === 'large' ? 'text-[12pt]' :
                'text-[10.5pt]';

    return (
        <div
            className={cn(
                'w-[794px] min-h-[1123px] bg-white text-gray-900 flex flex-col mx-auto box-border',
                textClass
            )}
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
            {/* Left sidebar + main content layout */}
            <div className="flex flex-1 min-h-[1123px]">

                {/* Left Sidebar */}
                <aside
                    className="w-[200px] shrink-0 flex flex-col px-7 py-12"
                    style={{ backgroundColor: accentColor }}
                >
                    {/* Monogram / Initials */}
                    <div className="mb-10">
                        <div
                            className="text-[28pt] font-light text-white leading-none tracking-tight"
                            style={{ fontFamily: "'Georgia', serif" }}
                        >
                            {personalInfo?.fullName
                                ? personalInfo.fullName
                                    .split(' ')
                                    .map((n: string) => n[0])
                                    .slice(0, 2)
                                    .join('')
                                : 'YN'}
                        </div>
                        <div className="mt-2 h-[1px] w-8 bg-white opacity-40" />
                    </div>

                    {/* Contact Details */}
                    <div className="flex flex-col gap-5 text-white">
                        {personalInfo?.email && (
                            <div>
                                <div className="text-[6.5pt] tracking-[0.2em] uppercase opacity-50 mb-1">Email</div>
                                <div className="text-[8pt] opacity-80 leading-snug break-all">{personalInfo.email}</div>
                            </div>
                        )}
                        {personalInfo?.phone && (
                            <div>
                                <div className="text-[6.5pt] tracking-[0.2em] uppercase opacity-50 mb-1">Phone</div>
                                <div className="text-[8pt] opacity-80">{personalInfo.phone}</div>
                            </div>
                        )}
                        {personalInfo?.location && (
                            <div>
                                <div className="text-[6.5pt] tracking-[0.2em] uppercase opacity-50 mb-1">Location</div>
                                <div className="text-[8pt] opacity-80 leading-snug">{personalInfo.location}</div>
                            </div>
                        )}
                    </div>

                    {/* Bottom fill */}
                    <div className="flex-1" />

                    {/* Sidebar footer label */}
                    <div
                        className="text-[6.5pt] tracking-[0.25em] uppercase opacity-30 text-white"
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                        Cover Letter
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col px-12 py-12">

                    {/* Name & Title */}
                    <header className="mb-10 pb-8 border-b border-gray-200">
                        <h1
                            className="text-[28pt] font-normal text-gray-900 leading-none tracking-tight mb-3"
                            style={{ fontFamily: "'Georgia', serif" }}
                        >
                            {personalInfo?.fullName || 'Your Name'}
                        </h1>
                        {personalInfo?.title && (
                            <p
                                className="text-[9pt] tracking-[0.22em] uppercase font-normal"
                                style={{ color: accentColor, fontFamily: "'Georgia', serif" }}
                            >
                                {personalInfo.title}
                            </p>
                        )}
                    </header>

                    {/* Date */}
                    <div
                        className="text-[9pt] text-gray-400 mb-8 tracking-wide"
                        style={{ fontFamily: "'Georgia', serif" }}
                    >
                        {letterDetails?.date ||
                            new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                    </div>

                    {/* Recipient Block */}
                    <div
                        className="mb-8 text-[10pt] leading-relaxed"
                        style={{ fontFamily: "'Georgia', serif" }}
                    >
                        {letterDetails?.recipientName && (
                            <div className="font-semibold text-gray-900">{letterDetails.recipientName}</div>
                        )}
                        {letterDetails?.recipientTitle && (
                            <div className="text-gray-600">{letterDetails.recipientTitle}</div>
                        )}
                        {letterDetails?.companyName && (
                            <div className="text-gray-800">{letterDetails.companyName}</div>
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
                            className="mb-7 text-[10pt] font-semibold text-gray-900 pb-4 border-b border-gray-100"
                            style={{ fontFamily: "'Georgia', serif" }}
                        >
                            {letterDetails.reference}
                        </div>
                    )}

                    {/* Letter Body */}
                    <div
                        className="flex-1 text-[10.5pt] text-gray-700 leading-[1.95] whitespace-pre-wrap text-justify"
                        style={{ fontFamily: "'Georgia', serif" }}
                    >
                        {body ||
                            'Dear Hiring Manager,\n\nI am writing to express my interest in the position...'}
                    </div>

                    {/* Footer */}
                    <footer className="mt-10 pt-5 border-t border-gray-100 flex items-center justify-between">
                        <div
                            className="text-[7.5pt] tracking-[0.18em] uppercase text-gray-300"
                            style={{ fontFamily: "'Georgia', serif" }}
                        >
                            {personalInfo?.fullName || ''}
                        </div>
                        <div className="flex gap-1.5 items-center">
                            <div className="h-px w-6 bg-gray-200" />
                            <div
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: accentColor, opacity: 0.3 }}
                            />
                            <div className="h-px w-3 bg-gray-100" />
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}