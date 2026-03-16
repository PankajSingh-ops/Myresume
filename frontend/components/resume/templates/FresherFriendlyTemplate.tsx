import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface FresherTemplateProps {
    resume: Resume;
}

export function FresherTemplate({ resume }: FresherTemplateProps) {
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

    const primaryColor = settings?.colors?.primary || '#2d6a4f'; // fresh forest green

    const gap =
        settings?.spacing === 'compact' ? 'mb-3' :
            settings?.spacing === 'relaxed' ? 'mb-8' :
                'mb-5';

    const textBase =
        settings?.fontSize === 'small' ? 'text-[8pt]' :
            settings?.fontSize === 'large' ? 'text-[11pt]' :
                'text-[9.5pt]';

    const SectionHeading = ({ title }: { title: string }) => (
        <div className="flex items-center gap-2 mb-3">
            <div
                className="w-1 h-4 rounded-full"
                style={{ background: primaryColor }}
            />
            <h2
                className="text-[8pt] font-black uppercase tracking-[0.25em]"
                style={{ color: primaryColor }}
            >
                {title}
            </h2>
            <div className="flex-1 h-[1px]" style={{ background: `${primaryColor}25` }} />
        </div>
    );

    return (
        <div
            className={cn(
                'w-[794px]  bg-white text-gray-900 mx-auto box-border flex flex-col',
                textBase
            )}
            style={{ fontFamily: "'Verdana', 'Geneva', 'Tahoma', sans-serif" }}
        >

            {/* ── HEADER BAND ─────────────────────────────────────────────────── */}
            <div
                className="w-full px-10 pt-8 pb-7 relative overflow-hidden"
                style={{ background: primaryColor }}
            >
                {/* Decorative circles */}
                <div
                    className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
                    style={{ background: 'white' }}
                />
                <div
                    className="absolute bottom-0 right-24 w-20 h-20 rounded-full opacity-10"
                    style={{ background: 'white' }}
                />
                <div
                    className="absolute -bottom-4 left-1/3 w-28 h-28 rounded-full opacity-[0.07]"
                    style={{ background: 'white' }}
                />

                <div className="relative flex items-center gap-7">
                    {/* Avatar */}
                    <div className="shrink-0">
                        <div
                            className="w-[84px] h-[84px] rounded-full overflow-hidden border-[3px] border-white "
                        >
                            {personalInfo?.profileImage ? (
                                <img
                                    src={personalInfo.profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center text-3xl font-black"
                                    style={{ background: `${primaryColor}cc`, color: 'white' }}
                                >
                                    {personalInfo?.fullName?.charAt(0) || '?'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Name + title + contacts */}
                    <div className="flex-1">
                        <h1 className="text-[24pt] font-black text-white leading-none tracking-tight">
                            {personalInfo?.fullName || 'Your Name'}
                        </h1>
                        {personalInfo?.title && (
                            <p className="text-[9.5pt] font-semibold mt-1 text-white opacity-80 tracking-widest uppercase">
                                {personalInfo.title}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[8pt] text-white opacity-90">
                            {personalInfo?.email && (
                                <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 hover:opacity-100">
                                    <Mail className="w-3 h-3" />{personalInfo.email}
                                </a>
                            )}
                            {personalInfo?.phone && (
                                <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-1.5 hover:opacity-100">
                                    <Phone className="w-3 h-3" />{personalInfo.phone}
                                </a>
                            )}
                            {personalInfo?.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-3 h-3" />{personalInfo.location}
                                </span>
                            )}
                            {personalInfo?.linkedin && (
                                <a
                                    href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 hover:opacity-100"
                                >
                                    <Linkedin className="w-3 h-3" />
                                    {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                                </a>
                            )}
                            {personalInfo?.website && (
                                <a
                                    href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 hover:opacity-100"
                                >
                                    <Globe className="w-3 h-3" />
                                    {personalInfo.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── BODY ────────────────────────────────────────────────────────── */}
            <div className="flex flex-1 flex-row">

                {/* ── LEFT MAIN (wider) ──────────────────────────────────────── */}
                <div className="flex-[3] px-9 pt-7 pb-8 flex flex-col">

                    {/* Summary */}
                    {personalInfo?.summary && (
                        <div className={gap}>
                            <SectionHeading title="About Me" />
                            <div
                                className="text-[9pt] text-gray-600 leading-[1.8]"
                                dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
                            />
                        </div>
                    )}

                    {/* Education — TOP for freshers */}
                    {education && education.length > 0 && (
                        <div className={gap}>
                            <SectionHeading title="Education" />
                            <div className="space-y-4">
                                {education.map(edu => (
                                    <div
                                        key={edu.id}
                                        className="relative pl-4"
                                        style={{ borderLeft: `2px solid ${primaryColor}30` }}
                                    >
                                        {/* dot */}
                                        <div
                                            className="absolute -left-[5px] top-[5px] w-2 h-2 rounded-full border-2 bg-white"
                                            style={{ borderColor: primaryColor }}
                                        />
                                        <div className="flex justify-between items-start gap-2 flex-wrap">
                                            <div>
                                                <h3 className="font-bold text-[10pt] text-gray-900 leading-tight">
                                                    {edu.degree} <span className="font-normal text-gray-500 text-[9pt]">in</span> {edu.field}
                                                </h3>
                                                <div
                                                    className="text-[9pt] font-semibold mt-0.5"
                                                    style={{ color: primaryColor }}
                                                >
                                                    {edu.institution}
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span
                                                    className="text-[7.5pt] font-semibold px-2 py-0.5 rounded-full"
                                                    style={{
                                                        color: primaryColor,
                                                        background: `${primaryColor}15`,
                                                    }}
                                                >
                                                    {edu.startDate} – {edu.endDate || 'Present'}
                                                </span>
                                                {edu.gpa && (
                                                    <div className="text-[7.5pt] text-gray-500 mt-1">
                                                        GPA: <span className="font-bold text-gray-700">{edu.gpa}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects — second most important for freshers */}
                    {projects && projects.length > 0 && (
                        <div className={gap}>
                            <SectionHeading title="Projects" />
                            <div className="space-y-4">
                                {projects.map(proj => (
                                    <div
                                        key={proj.id}
                                        className="p-3 rounded-lg"
                                        style={{
                                            background: `${primaryColor}07`,
                                            border: `1px solid ${primaryColor}20`,
                                        }}
                                    >
                                        <div className="flex justify-between items-start gap-3 flex-wrap">
                                            <h3 className="font-bold text-[10pt] text-gray-900">{proj.name}</h3>
                                            {proj.url && (
                                                <a
                                                    href={proj.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[7.5pt] font-medium hover:underline whitespace-nowrap"
                                                    style={{ color: primaryColor }}
                                                >
                                                    {proj.url.replace(/^https?:\/\//, '')}
                                                </a>
                                            )}
                                        </div>

                                        {proj.technologies && proj.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1.5 mb-2">
                                                {proj.technologies.map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-[7pt] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide"
                                                        style={{
                                                            color: primaryColor,
                                                            background: `${primaryColor}18`,
                                                        }}
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
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
                                                        <span
                                                            className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0"
                                                            style={{ background: primaryColor }}
                                                        />
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

                    {/* Experience (internships etc) */}
                    {experience && experience.length > 0 && (
                        <div className={gap}>
                            <SectionHeading title="Internships & Experience" />
                            <div className="space-y-4">
                                {experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline gap-2 flex-wrap">
                                            <h3 className="font-bold text-[10pt] text-gray-900">{exp.position}</h3>
                                            <span className="text-[7.5pt] text-gray-400 tabular-nums whitespace-nowrap">
                                                {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                            </span>
                                        </div>
                                        <div
                                            className="text-[9pt] font-semibold mt-0.5"
                                            style={{ color: primaryColor }}
                                        >
                                            {exp.company}
                                        </div>

                                        {exp.description && (
                                            <div
                                                className="mt-1.5 text-[8.5pt] text-gray-600 leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: exp.description }}
                                            />
                                        )}

                                        {exp.bullets && exp.bullets.length > 0 && (
                                            <ul className="mt-1.5 space-y-1">
                                                {exp.bullets.map((b, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-[8.5pt] text-gray-700 leading-snug">
                                                        <span
                                                            className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0"
                                                            style={{ background: primaryColor }}
                                                        />
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

                {/* ── RIGHT SIDEBAR (narrower) ───────────────────────────────── */}
                <div
                    className="w-[210px] shrink-0 px-6 pt-7 pb-8 flex flex-col"
                    style={{ borderLeft: `1px solid ${primaryColor}15` }}
                >
                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <div className={gap}>
                            <SectionHeading title="Skills" />
                            <div className="space-y-3">
                                {skills.map(skill => (
                                    <div key={skill.id}>
                                        <div
                                            className="text-[7pt] font-black uppercase tracking-wider mb-1.5"
                                            style={{ color: primaryColor }}
                                        >
                                            {skill.category}
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {skill.items.map((item, i) => (
                                                <span
                                                    key={i}
                                                    className="text-[7.5pt] px-2 py-0.5 rounded-full font-medium text-gray-700"
                                                    style={{
                                                        background: `${primaryColor}12`,
                                                        border: `1px solid ${primaryColor}25`,
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

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <div className={gap}>
                            <SectionHeading title="Certifications" />
                            <div className="space-y-3">
                                {certifications.map(cert => (
                                    <div
                                        key={cert.id}
                                        className="pl-2.5"
                                        style={{ borderLeft: `2px solid ${primaryColor}40` }}
                                    >
                                        <div className="font-bold text-[8.5pt] text-gray-900 leading-snug">{cert.name}</div>
                                        <div className="text-[7.5pt] text-gray-500 mt-0.5">{cert.issuer}</div>
                                        <div
                                            className="text-[7pt] font-semibold mt-0.5"
                                            style={{ color: primaryColor }}
                                        >
                                            {cert.date}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <div className={gap}>
                            <SectionHeading title="Languages" />
                            <div className="space-y-2.5">
                                {languages.map(lang => (
                                    <div key={lang.id}>
                                        <div className="flex justify-between items-center text-[8.5pt]">
                                            <span className="font-semibold text-gray-800">{lang.language}</span>
                                            <span className="text-[7.5pt] capitalize text-gray-400">{lang.proficiency}</span>
                                        </div>
                                        <div
                                            className="mt-1 h-[3px] rounded-full overflow-hidden"
                                            style={{ background: `${primaryColor}18` }}
                                        >
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    background: primaryColor,
                                                    width:
                                                        lang.proficiency === 'native' ? '100%' :
                                                            lang.proficiency === 'fluent' ? '85%' :
                                                                lang.proficiency === 'conversational' ? '60%' :
                                                                    lang.proficiency === 'basic' ? '35%' :
                                                                        '50%',
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
