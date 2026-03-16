import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin } from 'lucide-react';

interface HRTemplateProps {
    resume: Resume;
}

export function HRTemplate({ resume }: HRTemplateProps) {
    const { content, settings } = resume;
    const {
        personalInfo,
        experience,
        education,
        skills,
        projects,
        certifications,
        languages,
    } = content || {};

    const primaryColor = settings?.colors?.primary || '#7c5c3e'; // warm brown

    // Derive a very light tint (used for sidebar bg) from primary
    const sidebarBg = `${primaryColor}12`; // ~7% opacity tint

    const gap =
        settings?.spacing === 'compact' ? 'mb-4' :
            settings?.spacing === 'relaxed' ? 'mb-9' :
                'mb-6';

    const textBase =
        settings?.fontSize === 'small' ? 'text-[8.5pt]' :
            settings?.fontSize === 'large' ? 'text-[11pt]' :
                'text-[9.5pt]';

    // ── Sidebar section heading ───────────────────────────────────────────────
    const SideHeading = ({ title }: { title: string }) => (
        <div className="mb-3">
            <div
                className="text-[6.5pt] font-black uppercase tracking-[0.3em] pb-1.5 border-b"
                style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
                {title}
            </div>
        </div>
    );

    // ── Main section heading ──────────────────────────────────────────────────
    const MainHeading = ({ title }: { title: string }) => (
        <div className="flex items-center gap-2 mb-4">
            <div className="w-[3px] h-4 rounded-full" style={{ background: primaryColor }} />
            <span
                className="text-[7pt] font-black uppercase tracking-[0.28em]"
                style={{ color: primaryColor }}
            >
                {title}
            </span>
        </div>
    );

    return (
        <div
            className={cn(
                'w-[794px]  bg-white text-gray-800 leading-snug mx-auto  box-border flex flex-row',
                textBase
            )}
            style={{ fontFamily: "'Trebuchet MS', 'Gill Sans', 'Century Gothic', sans-serif" }}
        >
            {/* ════════════════════════════════════════════════════════════════════
                LEFT SIDEBAR
            ════════════════════════════════════════════════════════════════════ */}
            <div
                className="w-[230px] shrink-0 flex flex-col pt-10 pb-8 px-6"
                style={{ background: sidebarBg, borderRight: `1px solid ${primaryColor}18` }}
            >
                {/* Avatar */}
                <div className="flex flex-col items-center mb-7">
                    <div
                        className="w-[88px] h-[88px] rounded-full overflow-hidden border-[3px]  mb-3"
                        style={{ borderColor: primaryColor }}
                    >
                        {personalInfo?.profileImage ? (
                            <img
                                src={personalInfo.profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div
                                className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
                                style={{ background: primaryColor }}
                            >
                                {personalInfo?.fullName?.charAt(0) || '?'}
                            </div>
                        )}
                    </div>
                    <h1
                        className="text-[13pt] font-bold text-center leading-tight text-gray-900"
                        style={{ fontFamily: "'Trebuchet MS', sans-serif" }}
                    >
                        {personalInfo?.fullName || 'Your Name'}
                    </h1>
                    {personalInfo?.title && (
                        <p
                            className="text-[8pt] text-center mt-1 font-medium leading-snug"
                            style={{ color: primaryColor }}
                        >
                            {personalInfo.title}
                        </p>
                    )}
                </div>

                {/* Contact */}
                {personalInfo && (
                    <div className={gap}>
                        <SideHeading title="Contact" />
                        <div className="space-y-2 text-[8.5pt] text-gray-600">
                            {personalInfo.email && (
                                <div className="flex items-start gap-2">
                                    <Mail className="w-3 h-3 mt-[2px] shrink-0" style={{ color: primaryColor }} />
                                    <a href={`mailto:${personalInfo.email}`} className="break-all leading-tight hover:text-gray-900">{personalInfo.email}</a>
                                </div>
                            )}
                            {personalInfo.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-3 h-3 shrink-0" style={{ color: primaryColor }} />
                                    <a href={`tel:${personalInfo.phone}`}>{personalInfo.phone}</a>
                                </div>
                            )}
                            {personalInfo.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3 h-3 shrink-0" style={{ color: primaryColor }} />
                                    <span>{personalInfo.location}</span>
                                </div>
                            )}
                            {personalInfo.linkedin && (
                                <div className="flex items-start gap-2">
                                    <Linkedin className="w-3 h-3 mt-[2px] shrink-0" style={{ color: primaryColor }} />
                                    <a
                                        href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="break-all leading-tight hover:text-gray-900"
                                    >
                                        {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                                    </a>
                                </div>
                            )}
                            {personalInfo.website && (
                                <div className="flex items-start gap-2">
                                    <Globe className="w-3 h-3 mt-[2px] shrink-0" style={{ color: primaryColor }} />
                                    <a
                                        href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="break-all leading-tight hover:text-gray-900"
                                    >
                                        {personalInfo.website.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <div className={gap}>
                        <SideHeading title="Skills" />
                        <div className="space-y-3">
                            {skills.map(skill => (
                                <div key={skill.id}>
                                    <div
                                        className="text-[7.5pt] font-bold uppercase tracking-wide mb-1.5"
                                        style={{ color: primaryColor }}
                                    >
                                        {skill.category}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {skill.items.map((item, i) => (
                                            <span
                                                key={i}
                                                className="text-[7.5pt] px-2 py-0.5 rounded-sm text-gray-700 border"
                                                style={{
                                                    borderColor: `${primaryColor}30`,
                                                    background: `${primaryColor}08`,
                                                }}
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages */}
                {languages && languages.length > 0 && (
                    <div className={gap}>
                        <SideHeading title="Languages" />
                        <div className="space-y-2">
                            {languages.map(lang => (
                                <div key={lang.id}>
                                    <div className="flex justify-between items-center text-[8.5pt]">
                                        <span className="font-semibold text-gray-800">{lang.language}</span>
                                        <span className="text-[7.5pt] capitalize text-gray-500">{lang.proficiency}</span>
                                    </div>
                                    {/* Proficiency bar */}
                                    <div className="mt-1 h-[3px] rounded-full bg-gray-200 overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                background: primaryColor,
                                                width:
                                                    lang.proficiency === 'native' ? '100%' :
                                                        lang.proficiency === 'fluent' ? '85%' :
                                                            lang.proficiency === 'conversational' ? '70%' :
                                                                lang.proficiency === 'basic' ? '50%' :
                                                                    '30%',
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                    <div className={gap}>
                        <SideHeading title="Certifications" />
                        <div className="space-y-3">
                            {certifications.map(cert => (
                                <div key={cert.id}>
                                    <div className="font-semibold text-[8.5pt] text-gray-900 leading-tight">{cert.name}</div>
                                    <div className="text-[7.5pt] text-gray-500 mt-0.5">{cert.issuer}</div>
                                    <div className="text-[7pt] mt-0.5" style={{ color: primaryColor }}>{cert.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ════════════════════════════════════════════════════════════════════
                MAIN CONTENT
            ════════════════════════════════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col pt-10 pb-8 px-8">

                {/* Profile / Summary */}
                {personalInfo?.summary && (
                    <div className={gap}>
                        <MainHeading title="Profile" />
                        <div
                            className="text-[9pt] text-gray-600 leading-[1.8] text-justify"
                            dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
                        />
                    </div>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <div className={gap}>
                        <MainHeading title="Work Experience" />
                        <div className="space-y-5">
                            {experience.map((exp, idx) => (
                                <div key={exp.id} className="relative">
                                    {/* Timeline dot + line */}
                                    <div className="flex gap-4 items-start">
                                        {/* Dot column */}
                                        <div className="flex flex-col items-center shrink-0 mt-[5px]">
                                            <div
                                                className="w-2.5 h-2.5 rounded-full border-2 bg-white"
                                                style={{ borderColor: primaryColor }}
                                            />
                                            {idx < experience.length - 1 && (
                                                <div
                                                    className="w-[1.5px] flex-1 mt-1"
                                                    style={{
                                                        background: `linear-gradient(to bottom, ${primaryColor}50, transparent)`,
                                                        minHeight: '32px',
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 pb-1">
                                            <div className="flex justify-between items-start gap-3 flex-wrap">
                                                <div>
                                                    <h3 className="font-bold text-[10pt] text-gray-900 leading-tight">{exp.position}</h3>
                                                    <div className="text-[8.5pt] font-semibold mt-0.5" style={{ color: primaryColor }}>{exp.company}</div>
                                                </div>
                                                <span
                                                    className="text-[7.5pt] text-gray-500 whitespace-nowrap mt-0.5 px-2 py-0.5 rounded-sm"
                                                    style={{ background: `${primaryColor}10`, border: `1px solid ${primaryColor}20` }}
                                                >
                                                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                                </span>
                                            </div>

                                            {exp.description && (
                                                <div
                                                    className="mt-1.5 text-[8.5pt] text-gray-600 leading-relaxed"
                                                    dangerouslySetInnerHTML={{ __html: exp.description }}
                                                />
                                            )}

                                            {exp.bullets && exp.bullets.length > 0 && (
                                                <ul className="mt-2 space-y-1">
                                                    {exp.bullets.map((b, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-[8.5pt] text-gray-700 leading-snug">
                                                            <span
                                                                className="mt-[5px] w-1 h-1 rounded-full shrink-0"
                                                                style={{ background: primaryColor }}
                                                            />
                                                            {b}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <div className={gap}>
                        <MainHeading title="Education" />
                        <div className="space-y-4">
                            {education.map(edu => (
                                <div
                                    key={edu.id}
                                    className="flex gap-4 p-3 rounded-md"
                                    style={{ background: `${primaryColor}07`, border: `1px solid ${primaryColor}15` }}
                                >
                                    {/* Year badge */}
                                    <div
                                        className="shrink-0 w-10 text-center pt-0.5"
                                    >
                                        <div
                                            className="text-[7pt] font-black leading-tight"
                                            style={{ color: primaryColor }}
                                        >
                                            {edu.endDate || edu.startDate}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-[9.5pt] text-gray-900 leading-tight">
                                            {edu.degree} <span className="font-normal text-gray-500">in</span> {edu.field}
                                        </h3>
                                        <div className="text-[8.5pt] font-semibold mt-0.5" style={{ color: primaryColor }}>{edu.institution}</div>
                                        <div className="text-[7.5pt] text-gray-400 mt-0.5">{edu.startDate} – {edu.endDate || 'Present'}</div>
                                        {edu.gpa && (
                                            <div className="text-[7.5pt] text-gray-500 mt-0.5">GPA: <span className="font-semibold text-gray-700">{edu.gpa}</span></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <div className={gap}>
                        <MainHeading title="Projects" />
                        <div className="space-y-3.5">
                            {projects.map(proj => (
                                <div key={proj.id} className="border-l-2 pl-3" style={{ borderColor: `${primaryColor}50` }}>
                                    <div className="flex items-baseline justify-between gap-3">
                                        <h3 className="font-bold text-[9.5pt] text-gray-900">{proj.name}</h3>
                                        {proj.url && (
                                            <a
                                                href={proj.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[7.5pt] text-gray-400 hover:text-gray-700 whitespace-nowrap"
                                            >
                                                {proj.url.replace(/^https?:\/\//, '')}
                                            </a>
                                        )}
                                    </div>
                                    {proj.technologies && proj.technologies.length > 0 && (
                                        <div className="text-[7.5pt] text-gray-500 mt-0.5 mb-1">
                                            <span className="font-semibold">Stack:</span> {proj.technologies.join(' · ')}
                                        </div>
                                    )}
                                    {proj.description && (
                                        <div
                                            className="text-[8.5pt] text-gray-600 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: proj.description }}
                                        />
                                    )}
                                    {proj.bullets && proj.bullets.length > 0 && (
                                        <ul className="mt-1.5 space-y-1">
                                            {proj.bullets.map((b, i) => (
                                                <li key={i} className="flex items-start gap-2 text-[8.5pt] text-gray-700 leading-snug">
                                                    <span className="mt-[5px] w-1 h-1 rounded-full shrink-0" style={{ background: primaryColor }} />
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
