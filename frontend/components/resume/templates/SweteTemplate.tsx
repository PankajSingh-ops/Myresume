import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface SWETemplateProps {
    resume: Resume;
}

export function SWETemplate({ resume }: SWETemplateProps) {
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

    const primaryColor = settings?.colors?.primary || '#0a0a0a';

    const gap =
        settings?.spacing === 'compact' ? 'mb-3' :
            settings?.spacing === 'relaxed' ? 'mb-8' :
                'mb-5';

    const textBase =
        settings?.fontSize === 'small' ? 'text-[8pt]' :
            settings?.fontSize === 'large' ? 'text-[11pt]' :
                'text-[9.5pt]';

    const SectionHeading = ({ title }: { title: string }) => (
        <div className="flex items-center gap-0 mb-3">
            <h2
                className="text-[8.5pt] font-black uppercase tracking-[0.22em] pr-3"
                style={{ color: primaryColor }}
            >
                {title}
            </h2>
            <div className="flex-1 h-[1px] bg-gray-300" />
        </div>
    );

    return (
        <div
            className={cn(
                'w-[794px]  bg-white text-gray-900 mx-auto box-border px-12 pt-10 pb-12',
                textBase
            )}
            style={{ fontFamily: "'Calibri', 'Carlito', 'Liberation Sans', sans-serif" }}
        >
            {/* ── HEADER ──────────────────────────────────────────────────────── */}
            {personalInfo && (
                <div className="text-center mb-5">
                    <h1
                        className="text-[22pt] font-black tracking-tight text-gray-900 leading-none"
                        style={{ letterSpacing: '-0.02em' }}
                    >
                        {personalInfo.fullName || 'Your Name'}
                    </h1>

                    {personalInfo.title && (
                        <p
                            className="text-[9.5pt] font-semibold mt-1.5 tracking-wide uppercase"
                            style={{ color: primaryColor, letterSpacing: '0.12em' }}
                        >
                            {personalInfo.title}
                        </p>
                    )}

                    {/* Contact row */}
                    <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 mt-3 text-[8pt] text-gray-500">
                        {personalInfo.email && (
                            <>
                                <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1 hover:text-gray-900">
                                    <Mail className="w-3 h-3" />
                                    {personalInfo.email}
                                </a>
                                <span className="text-gray-300">|</span>
                            </>
                        )}
                        {personalInfo.phone && (
                            <>
                                <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-1 hover:text-gray-900">
                                    <Phone className="w-3 h-3" />
                                    {personalInfo.phone}
                                </a>
                                <span className="text-gray-300">|</span>
                            </>
                        )}
                        {personalInfo.location && (
                            <>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {personalInfo.location}
                                </span>
                                <span className="text-gray-300">|</span>
                            </>
                        )}
                        {personalInfo.linkedin && (
                            <>
                                <a
                                    href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1 hover:text-gray-900"
                                >
                                    <Linkedin className="w-3 h-3" />
                                    {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                                </a>
                                <span className="text-gray-300">|</span>
                            </>
                        )}
                        {personalInfo.website && (
                            <a
                                href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-gray-900"
                            >
                                <Globe className="w-3 h-3" />
                                {personalInfo.website.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* ── SUMMARY ─────────────────────────────────────────────────────── */}
            {personalInfo?.summary && (
                <div className={gap}>
                    <SectionHeading title="Summary" />
                    <div
                        className="text-[9pt] text-gray-600 leading-[1.7]"
                        dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
                    />
                </div>
            )}

            {/* ── SKILLS ──────────────────────────────────────────────────────── */}
            {skills && skills.length > 0 && (
                <div className={gap}>
                    <SectionHeading title="Technical Skills" />
                    <div className="space-y-1.5">
                        {skills.map(skill => (
                            <div key={skill.id} className="flex gap-2 text-[9pt] leading-snug">
                                <span className="font-bold text-gray-900 shrink-0 min-w-[110px]">
                                    {skill.category}:
                                </span>
                                <span className="text-gray-700">{skill.items.join(', ')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── EXPERIENCE ──────────────────────────────────────────────────── */}
            {experience && experience.length > 0 && (
                <div className={gap}>
                    <SectionHeading title="Experience" />
                    <div className="space-y-4">
                        {experience.map(exp => (
                            <div key={exp.id}>
                                {/* Row 1: Position + Dates */}
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-[10pt] text-gray-900">{exp.position}</h3>
                                    <span className="text-[8pt] text-gray-500 tabular-nums whitespace-nowrap">
                                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                    </span>
                                </div>
                                {/* Row 2: Company + Location */}
                                <div className="flex justify-between items-baseline mt-0.5">
                                    <span className="font-semibold text-[9pt] italic text-gray-600">{exp.company}</span>
                                </div>

                                {exp.description && (
                                    <div
                                        className="mt-1.5 text-[9pt] text-gray-600 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: exp.description }}
                                    />
                                )}

                                {exp.bullets && exp.bullets.length > 0 && (
                                    <ul className="mt-1.5 space-y-1 list-disc pl-5 marker:text-gray-400">
                                        {exp.bullets.map((b, i) => (
                                            <li key={i} className="text-[9pt] text-gray-700 leading-snug pl-0.5">{b}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── PROJECTS ────────────────────────────────────────────────────── */}
            {projects && projects.length > 0 && (
                <div className={gap}>
                    <SectionHeading title="Projects" />
                    <div className="space-y-4">
                        {projects.map(proj => (
                            <div key={proj.id}>
                                <div className="flex justify-between items-baseline">
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="font-bold text-[10pt] text-gray-900">{proj.name}</h3>
                                        {proj.technologies && proj.technologies.length > 0 && (
                                            <span className="text-[8pt] font-normal text-gray-500 italic">
                                                {proj.technologies.join(', ')}
                                            </span>
                                        )}
                                    </div>
                                    {proj.url && (
                                        <a
                                            href={proj.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[8pt] text-gray-400 hover:text-gray-700 whitespace-nowrap"
                                        >
                                            {proj.url.replace(/^https?:\/\//, '')}
                                        </a>
                                    )}
                                </div>

                                {proj.description && (
                                    <div
                                        className="mt-1 text-[9pt] text-gray-600 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: proj.description }}
                                    />
                                )}

                                {proj.bullets && proj.bullets.length > 0 && (
                                    <ul className="mt-1.5 space-y-1 list-disc pl-5 marker:text-gray-400">
                                        {proj.bullets.map((b, i) => (
                                            <li key={i} className="text-[9pt] text-gray-700 leading-snug pl-0.5">{b}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── EDUCATION ───────────────────────────────────────────────────── */}
            {education && education.length > 0 && (
                <div className={gap}>
                    <SectionHeading title="Education" />
                    <div className="space-y-3">
                        {education.map(edu => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-[10pt] text-gray-900">{edu.institution}</h3>
                                    <span className="text-[8pt] text-gray-500 tabular-nums whitespace-nowrap">
                                        {edu.startDate} – {edu.endDate || 'Present'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline mt-0.5">
                                    <span className="font-semibold text-[9pt] italic text-gray-600">
                                        {edu.degree} in {edu.field}
                                    </span>
                                    {edu.gpa && (
                                        <span className="text-[8.5pt] text-gray-500">GPA: {edu.gpa}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── CERTIFICATIONS + LANGUAGES (inline row) ─────────────────────── */}
            {((certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
                <div className={gap}>
                    {certifications && certifications.length > 0 && (
                        <div className="mb-4">
                            <SectionHeading title="Certifications" />
                            <div className="space-y-1.5">
                                {certifications.map(cert => (
                                    <div key={cert.id} className="flex justify-between items-baseline text-[9pt]">
                                        <span>
                                            <span className="font-semibold text-gray-900">{cert.name}</span>
                                            <span className="text-gray-500"> — {cert.issuer}</span>
                                        </span>
                                        <span className="text-gray-400 text-[8pt] whitespace-nowrap">{cert.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {languages && languages.length > 0 && (
                        <div>
                            <SectionHeading title="Languages" />
                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-[9pt]">
                                {languages.map(lang => (
                                    <span key={lang.id} className="text-gray-700">
                                        <span className="font-semibold">{lang.language}</span>
                                        <span className="text-gray-400"> ({lang.proficiency})</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
