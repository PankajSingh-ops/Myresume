import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface ModernLineTemplateProps {
    resume: Resume;
}

export function ModernLineTemplate({ resume }: ModernLineTemplateProps) {
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

    const primaryColor = settings?.colors?.primary || '#0f4c75';

    const sectionGap =
        settings?.spacing === 'compact' ? 'mb-4' :
            settings?.spacing === 'relaxed' ? 'mb-10' :
                'mb-7';

    const textBase =
        settings?.fontSize === 'small' ? 'text-[8.5pt]' :
            settings?.fontSize === 'large' ? 'text-[11.5pt]' :
                'text-[10pt]';

    // ── Reusable section heading ──────────────────────────────────────────────
    const SectionHeading = ({ title }: { title: string }) => (
        <div className="flex items-center gap-3 mb-4">
            <span
                className="text-[7pt] font-black uppercase tracking-[0.25em] whitespace-nowrap"
                style={{ color: primaryColor }}
            >
                {title}
            </span>
            <div className="flex-1 h-[1.5px]" style={{ background: `linear-gradient(to right, ${primaryColor}55, transparent)` }} />
        </div>
    );

    return (
        <div
            className={cn(
                'w-[794px]  bg-white text-black font-serif leading-relaxed mx-auto  box-border',
                textBase
            )}
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
            {/* ── TOP ACCENT BAR ─────────────────────────────────────────────────── */}
            <div className="h-[6px] w-full" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}88)` }} />

            {/* ── HEADER ─────────────────────────────────────────────────────────── */}
            {personalInfo && (
                <div className="px-12 pt-8 pb-6 border-b border-gray-200">
                    <div className="flex items-start justify-between gap-6">
                        {/* Name + Title */}
                        <div className="flex-1">
                            <h1
                                className="text-[28pt] font-bold leading-none tracking-tight text-gray-900"
                                style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.01em' }}
                            >
                                {personalInfo.fullName || 'Your Name'}
                            </h1>
                            {personalInfo.title && (
                                <p
                                    className="text-[11.5pt] mt-1 font-normal tracking-wide"
                                    style={{ color: primaryColor, fontFamily: "'Georgia', serif" }}
                                >
                                    {personalInfo.title}
                                </p>
                            )}
                        </div>

                        {/* Avatar (if present) */}
                        {personalInfo.profileImage && (
                            <div
                                className="w-20 h-20 rounded-sm overflow-hidden border-2 shrink-0"
                                style={{ borderColor: primaryColor }}
                            >
                                <img
                                    src={personalInfo.profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Contact Row */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-[8.5pt] text-gray-500">
                        {personalInfo.email && (
                            <span className="flex items-center gap-1.5">
                                <Mail className="w-3 h-3 shrink-0" style={{ color: primaryColor }} />
                                <a href={`mailto:${personalInfo.email}`} className="hover:text-gray-800 transition-colors">{personalInfo.email}</a>
                            </span>
                        )}
                        {personalInfo.phone && (
                            <span className="flex items-center gap-1.5">
                                <Phone className="w-3 h-3 shrink-0" style={{ color: primaryColor }} />
                                <a href={`tel:${personalInfo.phone}`} className="hover:text-gray-800 transition-colors">{personalInfo.phone}</a>
                            </span>
                        )}
                        {personalInfo.location && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 shrink-0" style={{ color: primaryColor }} />
                                {personalInfo.location}
                            </span>
                        )}
                        {personalInfo.linkedin && (
                            <span className="flex items-center gap-1.5">
                                <Linkedin className="w-3 h-3 shrink-0" style={{ color: primaryColor }} />
                                <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 transition-colors">
                                    {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                                </a>
                            </span>
                        )}
                        {personalInfo.website && (
                            <span className="flex items-center gap-1.5">
                                <Globe className="w-3 h-3 shrink-0" style={{ color: primaryColor }} />
                                <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 transition-colors">
                                    {personalInfo.website.replace(/^https?:\/\//, '')}
                                </a>
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* ── BODY ───────────────────────────────────────────────────────────── */}
            <div className="px-12 py-7 flex flex-col">

                {/* Summary / Profile */}
                {personalInfo?.summary && (
                    <div className={sectionGap}>
                        <SectionHeading title="Profile" />
                        <div
                            className="text-[9.5pt] text-gray-700 leading-[1.75] text-justify"
                            style={{ fontFamily: "'Georgia', serif" }}
                            dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
                        />
                    </div>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <div className={sectionGap}>
                        <SectionHeading title="Work Experience" />
                        <div className="space-y-5">
                            {experience.map((exp, idx) => (
                                <div key={exp.id} className="grid grid-cols-[1fr_auto] gap-x-4 items-start">
                                    {/* Left: role details */}
                                    <div>
                                        <div className="flex items-baseline gap-2 flex-wrap">
                                            <h3 className="font-bold text-[10.5pt] text-gray-900">{exp.position}</h3>
                                            <span className="text-[9pt] font-normal text-gray-400">·</span>
                                            <span className="text-[9.5pt] font-semibold" style={{ color: primaryColor }}>{exp.company}</span>
                                        </div>

                                        {exp.description && (
                                            <div className="mt-1 text-[9pt] text-gray-600 leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: exp.description }} />
                                        )}

                                        {exp.bullets && exp.bullets.length > 0 && (
                                            <ul className="mt-1.5 space-y-1 text-[9pt] text-gray-700">
                                                {exp.bullets.map((b, i) => (
                                                    <li key={i} className="flex gap-2 items-start leading-snug">
                                                        <span className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: primaryColor }} />
                                                        <span>{b}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Right: dates */}
                                    <div className="text-right mt-[2px]">
                                        <span className="text-[8pt] text-gray-400 whitespace-nowrap tabular-nums">
                                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <div className={sectionGap}>
                        <SectionHeading title="Education" />
                        <div className="space-y-3.5">
                            {education.map(edu => (
                                <div key={edu.id} className="grid grid-cols-[1fr_auto] gap-x-4 items-start">
                                    <div>
                                        <h3 className="font-bold text-[10pt] text-gray-900">
                                            {edu.degree} <span className="font-normal text-gray-600">in</span> {edu.field}
                                        </h3>
                                        <div className="text-[9pt] font-semibold mt-0.5" style={{ color: primaryColor }}>{edu.institution}</div>
                                        {edu.gpa && (
                                            <div className="text-[8.5pt] text-gray-500 mt-0.5">GPA: {edu.gpa}</div>
                                        )}
                                    </div>
                                    <div className="text-right mt-[2px]">
                                        <span className="text-[8pt] text-gray-400 whitespace-nowrap tabular-nums">
                                            {edu.startDate} – {edu.endDate || 'Present'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <div className={sectionGap}>
                        <SectionHeading title="Skills" />
                        <div className="space-y-2.5">
                            {skills.map(skill => (
                                <div key={skill.id} className="flex gap-3 items-start text-[9pt]">
                                    <span className="font-bold text-gray-800 whitespace-nowrap min-w-[90px] pt-[1px]" style={{ color: primaryColor }}>
                                        {skill.category}
                                    </span>
                                    <span className="text-gray-700 leading-snug">{skill.items.join('  ·  ')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <div className={sectionGap}>
                        <SectionHeading title="Projects" />
                        <div className="space-y-4">
                            {projects.map(proj => (
                                <div key={proj.id}>
                                    <div className="flex items-baseline justify-between gap-4">
                                        <h3 className="font-bold text-[10pt] text-gray-900">{proj.name}</h3>
                                        {proj.url && (
                                            <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-[8pt] text-gray-400 hover:text-gray-700 transition-colors whitespace-nowrap">
                                                {proj.url.replace(/^https?:\/\//, '')}
                                            </a>
                                        )}
                                    </div>
                                    {proj.technologies && proj.technologies.length > 0 && (
                                        <div className="text-[8.5pt] text-gray-500 mt-0.5 mb-1">
                                            <span className="font-semibold text-gray-700">Stack:</span> {proj.technologies.join(' · ')}
                                        </div>
                                    )}
                                    {proj.description && (
                                        <div className="text-[9pt] text-gray-600 leading-snug"
                                            dangerouslySetInnerHTML={{ __html: proj.description }} />
                                    )}
                                    {proj.bullets && proj.bullets.length > 0 && (
                                        <ul className="mt-1.5 space-y-1 text-[9pt] text-gray-700">
                                            {proj.bullets.map((b, i) => (
                                                <li key={i} className="flex gap-2 items-start leading-snug">
                                                    <span className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: primaryColor }} />
                                                    <span>{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications + Languages row */}
                {((certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
                    <div className={cn('grid gap-8', certifications?.length && languages?.length ? 'grid-cols-2' : 'grid-cols-1', sectionGap)}>
                        {/* Certifications */}
                        {certifications && certifications.length > 0 && (
                            <div>
                                <SectionHeading title="Certifications" />
                                <div className="space-y-2.5">
                                    {certifications.map(cert => (
                                        <div key={cert.id}>
                                            <div className="font-semibold text-[9.5pt] text-gray-900">{cert.name}</div>
                                            <div className="text-[8.5pt] text-gray-500">{cert.issuer} · {cert.date}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {languages && languages.length > 0 && (
                            <div>
                                <SectionHeading title="Languages" />
                                <div className="space-y-1.5">
                                    {languages.map(lang => (
                                        <div key={lang.id} className="flex justify-between items-center text-[9pt]">
                                            <span className="font-semibold text-gray-800">{lang.language}</span>
                                            <span className="capitalize text-gray-400">{lang.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── BOTTOM ACCENT BAR ──────────────────────────────────────────────── */}
            <div className="h-[3px] w-full mt-auto" style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}44)` }} />
        </div>
    );
}
