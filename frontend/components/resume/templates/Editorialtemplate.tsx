import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface EditorialTemplateProps {
    resume: Resume;
}

export function EditorialTemplate({ resume }: EditorialTemplateProps) {
    const { content, settings } = resume;
    const {
        personalInfo,
        experience,
        education,
        skills,
        projects,
        certifications,
        languages
    } = content || {};

    const accentColor = settings?.colors?.primary || '#c8f135'; // electric lime

    const spacingClass =
        settings?.spacing === 'compact' ? 'mb-5' :
            settings?.spacing === 'relaxed' ? 'mb-12' :
                'mb-8';

    const textClass =
        settings?.fontSize === 'small' ? 'text-[8.5pt]' :
            settings?.fontSize === 'large' ? 'text-[11pt]' :
                'text-[9.5pt]';

    return (
        <div
            className={cn("w-[794px]  bg-zinc-950 text-zinc-100 font-sans box-border mx-auto shadow-2xl flex flex-col", textClass)}
            style={{ fontFamily: "'DM Mono', 'Courier New', monospace" }}
        >
            {/* TOP BAR — accent strip */}
            <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />

            {/* HEADER — full-width dark panel */}
            {personalInfo && (
                <div className="px-12 pt-10 pb-8 border-b border-zinc-800">
                    <div className="flex justify-between items-start gap-8">
                        {/* Name + Title */}
                        <div className="flex-1">
                            <div
                                className="text-[0.65em] font-bold uppercase tracking-[0.3em] mb-3"
                                style={{ color: accentColor }}
                            >
                                Curriculum Vitae
                            </div>
                            <h1
                                className="font-black leading-none tracking-tighter text-zinc-50 mb-3"
                                style={{ fontSize: '3.4em', letterSpacing: '-0.03em' }}
                            >
                                {personalInfo.fullName || 'Your Name'}
                            </h1>
                            {personalInfo.title && (
                                <p className="text-[1.05em] font-normal text-zinc-400 tracking-wider uppercase">
                                    {personalInfo.title}
                                </p>
                            )}
                        </div>

                        {/* Contact grid */}
                        <div className="text-[0.82em] space-y-2 text-zinc-400 pt-8 min-w-[200px]">
                            {personalInfo.email && (
                                <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 hover:text-zinc-100 transition-colors">
                                    <Mail className="h-3 w-3 shrink-0" style={{ color: accentColor }} />
                                    {personalInfo.email}
                                </a>
                            )}
                            {personalInfo.phone && (
                                <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-2 hover:text-zinc-100 transition-colors">
                                    <Phone className="h-3 w-3 shrink-0" style={{ color: accentColor }} />
                                    {personalInfo.phone}
                                </a>
                            )}
                            {personalInfo.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3 shrink-0" style={{ color: accentColor }} />
                                    {personalInfo.location}
                                </div>
                            )}
                            {personalInfo.website && (
                                <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-zinc-100 transition-colors">
                                    <Globe className="h-3 w-3 shrink-0" style={{ color: accentColor }} />
                                    {personalInfo.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                            {personalInfo.linkedin && (
                                <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-zinc-100 transition-colors">
                                    <Linkedin className="h-3 w-3 shrink-0" style={{ color: accentColor }} />
                                    {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                                </a>
                            )}
                            {personalInfo.github && (
                                <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-zinc-100 transition-colors">
                                    <Github className="h-3 w-3 shrink-0" style={{ color: accentColor }} />
                                    {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Summary — full width below name row */}
                    {personalInfo.summary && (
                        <div
                            className="mt-6 pt-6 border-t border-zinc-800 text-[0.95em] text-zinc-400 leading-relaxed max-w-[520px]"
                            dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
                        />
                    )}
                </div>
            )}

            {/* BODY — two-column layout */}
            <div className="flex flex-1">
                {/* LEFT SIDEBAR — dark tinted */}
                <div className="w-[210px] shrink-0 bg-zinc-900 border-r border-zinc-800 px-7 py-8 space-y-8">

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <div className={spacingClass}>
                            <SidebarHeading accentColor={accentColor}>Skills</SidebarHeading>
                            <div className="space-y-4">
                                {skills.map(skill => (
                                    <div key={skill.id}>
                                        <div
                                            className="text-[0.72em] font-bold uppercase tracking-[0.2em] mb-1.5"
                                            style={{ color: accentColor }}
                                        >
                                            {skill.category}
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {skill.items.map((item, i) => (
                                                <span
                                                    key={i}
                                                    className="text-[0.78em] text-zinc-300 bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded-sm"
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

                    {/* Education */}
                    {education && education.length > 0 && (
                        <div className={spacingClass}>
                            <SidebarHeading accentColor={accentColor}>Education</SidebarHeading>
                            <div className="space-y-5">
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <h3 className="font-bold text-[0.88em] text-zinc-100 leading-snug">
                                            {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                                        </h3>
                                        <div className="text-[0.8em] font-bold mt-0.5" style={{ color: accentColor }}>
                                            {edu.institution}
                                        </div>
                                        <div className="text-[0.75em] text-zinc-500 mt-1 tracking-wider">
                                            {edu.startDate} – {edu.endDate || 'Expected'}
                                        </div>
                                        {edu.gpa && (
                                            <div className="text-[0.72em] text-zinc-500 mt-0.5">GPA: {edu.gpa}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <div className={spacingClass}>
                            <SidebarHeading accentColor={accentColor}>Certifications</SidebarHeading>
                            <div className="space-y-4">
                                {certifications.map(cert => (
                                    <div key={cert.id}>
                                        <h3 className="font-bold text-[0.85em] text-zinc-200 leading-snug">{cert.name}</h3>
                                        <div className="text-[0.78em] text-zinc-400 mt-0.5">{cert.issuer}</div>
                                        <div className="text-[0.72em] text-zinc-600 mt-0.5 uppercase tracking-wider">{cert.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <div className={spacingClass}>
                            <SidebarHeading accentColor={accentColor}>Languages</SidebarHeading>
                            <div className="space-y-2">
                                {languages.map(lang => (
                                    <div key={lang.id} className="flex justify-between items-center">
                                        <span className="font-bold text-[0.85em] text-zinc-200">{lang.language}</span>
                                        <span
                                            className="text-[0.7em] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded-sm"
                                            style={{ color: accentColor, backgroundColor: `${accentColor}18`, border: `1px solid ${accentColor}40` }}
                                        >
                                            {lang.proficiency}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT MAIN CONTENT */}
                <div className="flex-1 px-10 py-8">

                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <div className={spacingClass}>
                            <MainHeading accentColor={accentColor}>Experience</MainHeading>
                            <div className="space-y-7">
                                {experience.map((exp, idx) => (
                                    <div key={exp.id} className="relative pl-4" style={{ borderLeft: `2px solid ${idx === 0 ? accentColor : '#3f3f46'}` }}>
                                        <div className="flex justify-between items-baseline mb-0.5 gap-4">
                                            <h3 className="font-black text-[1.05em] text-zinc-50 tracking-tight">
                                                {exp.position}
                                            </h3>
                                            <span className="shrink-0 text-[0.72em] font-bold text-zinc-500 uppercase tracking-widest">
                                                {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                            </span>
                                        </div>
                                        <div className="text-[0.85em] font-bold mb-2" style={{ color: accentColor }}>
                                            {exp.company}
                                        </div>
                                        {exp.description && (
                                            <div
                                                className="text-[0.88em] text-zinc-400 leading-relaxed mb-2"
                                                dangerouslySetInnerHTML={{ __html: exp.description }}
                                            />
                                        )}
                                        {exp.bullets && exp.bullets.length > 0 && (
                                            <ul className="space-y-1.5">
                                                {exp.bullets.map((b, i) => (
                                                    <li key={i} className="flex gap-2.5 items-start text-[0.88em] text-zinc-400">
                                                        <span className="mt-1.5 text-[0.6em] font-black" style={{ color: accentColor }}>▶</span>
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

                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <div className={spacingClass}>
                            <MainHeading accentColor={accentColor}>Projects</MainHeading>
                            <div className="space-y-5">
                                {projects.map(proj => (
                                    <div
                                        key={proj.id}
                                        className="p-5 rounded-lg border border-zinc-800 bg-zinc-900/60"
                                        style={{ borderLeftWidth: '3px', borderLeftColor: accentColor }}
                                    >
                                        <div className="flex justify-between items-start mb-2 gap-4">
                                            <h3 className="font-black text-[1em] text-zinc-50">{proj.name}</h3>
                                            {proj.url && (
                                                <a
                                                    href={proj.url}
                                                    className="text-[0.75em] font-bold text-zinc-400 hover:text-zinc-100 transition-colors shrink-0 underline underline-offset-2"
                                                >
                                                    {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
                                                </a>
                                            )}
                                        </div>
                                        {proj.description && (
                                            <div
                                                className="text-[0.88em] text-zinc-400 leading-relaxed mb-2"
                                                dangerouslySetInnerHTML={{ __html: proj.description }}
                                            />
                                        )}
                                        {proj.bullets && proj.bullets.length > 0 && (
                                            <ul className="space-y-1 text-[0.85em] text-zinc-500 mb-3">
                                                {proj.bullets.map((b, i) => (
                                                    <li key={i} className="flex gap-2 items-start">
                                                        <span className="mt-1.5 text-[0.55em] font-black" style={{ color: accentColor }}>▶</span>
                                                        <span>{b}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {proj.technologies && proj.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {proj.technologies.map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-[0.72em] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm"
                                                        style={{ color: accentColor, backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}35` }}
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="h-1 w-full" style={{ backgroundColor: accentColor, opacity: 0.4 }} />
        </div>
    );
}

/* ── Small helper components ── */

function SidebarHeading({ children, accentColor }: { children: React.ReactNode; accentColor: string }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-none rotate-45 shrink-0" style={{ backgroundColor: accentColor }} />
            <h2 className="text-[0.72em] font-black uppercase tracking-[0.25em] text-zinc-300">{children}</h2>
        </div>
    );
}

function MainHeading({ children, accentColor }: { children: React.ReactNode; accentColor: string }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <h2 className="text-[0.72em] font-black uppercase tracking-[0.3em] text-zinc-300">{children}</h2>
            <div className="flex-1 h-px" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
        </div>
    );
}
