import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface ElegantTemplateProps {
    resume: Resume;
}

export function ElegantTemplate({ resume }: ElegantTemplateProps) {
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

    const accentColor = settings?.colors?.primary || '#0f172a'; // slate-900

    const spacingClass =
        settings?.spacing === 'compact' ? 'space-y-5 mb-6' :
            settings?.spacing === 'relaxed' ? 'space-y-10 mb-12' :
                'space-y-8 mb-10';

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9.5pt]' :
            settings?.fontSize === 'large' ? 'text-[12.5pt]' :
                'text-[11pt]';

    return (
        <div className={cn("w-[794px]  bg-[#faf9f6] text-slate-900 font-serif leading-relaxed p-[70px] mx-auto  box-border", textClass)}>

            {/* Header Area */}
            {personalInfo && (
                <div className="text-center mb-12 flex flex-col items-center">
                    <h1 className="text-5xl font-light tracking-widest uppercase text-slate-900 mb-3" style={{ color: accentColor }}>
                        {personalInfo.fullName || 'Your Name'}
                    </h1>
                    {personalInfo.title && (
                        <p className="text-xl italic text-slate-600 mb-6">{personalInfo.title}</p>
                    )}

                    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[0.8em] tracking-widest uppercase text-slate-500 w-full max-w-2xl border-y border-slate-300 py-3">
                        {personalInfo.location && <span>{personalInfo.location}</span>}
                        {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="hover:text-slate-900 transition-colors">{personalInfo.email}</a>}
                        {personalInfo.phone && <a href={`tel:${personalInfo.phone}`} className="hover:text-slate-900 transition-colors">{personalInfo.phone}</a>}
                        {personalInfo.website && <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">{personalInfo.website.replace(/^https?:\/\//, '')}</a>}
                        {personalInfo.linkedin && <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'in/')}</a>}
                        {personalInfo.github && <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</a>}
                    </div>
                </div>
            )}

            {/* Summary */}
            {personalInfo?.summary && (
                <div className={cn("text-[1.1em] font-light text-slate-700 leading-[1.8] text-center px-8", spacingClass)} dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
            )}

            <div className="space-y-10">
                {/* Experience */}
                {experience && experience.length > 0 && (
                    <div className={spacingClass}>
                        <h2 className="text-xl font-medium tracking-[0.2em] uppercase text-center mb-8 pb-4 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-px after:bg-slate-400" style={{ color: accentColor }}>
                            Professional Experience
                        </h2>
                        <div className="space-y-8">
                            {experience.map(exp => (
                                <div key={exp.id}>
                                    <div className="flex flex-col items-center mb-4 text-center">
                                        <h3 className="font-semibold text-[1.2em] text-slate-900">{exp.position}</h3>
                                        <div className="italic text-slate-600 my-1">{exp.company}</div>
                                        <div className="text-[0.8em] tracking-widest uppercase text-slate-500">
                                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                        </div>
                                    </div>

                                    {exp.description && (
                                        <div className="mb-4 text-slate-700 leading-relaxed font-light text-center" dangerouslySetInnerHTML={{ __html: exp.description }} />
                                    )}

                                    {exp.bullets && exp.bullets.length > 0 && (
                                        <ul className="list-disc leading-relaxed text-slate-700 font-light max-w-[90%] mx-auto marker:text-slate-400">
                                            {exp.bullets.map((b, i) => (
                                                <li key={i} className="pl-2 mb-1.5">{b}</li>
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
                        <h2 className="text-xl font-medium tracking-[0.2em] uppercase text-center mb-8 pb-4 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-px after:bg-slate-400" style={{ color: accentColor }}>
                            Selected Works
                        </h2>
                        <div className="grid grid-cols-2 gap-8">
                            {projects.map(proj => (
                                <div key={proj.id} className="text-center bg-white p-6 border border-slate-200">
                                    <h3 className="font-semibold text-[1.1em] text-slate-900 mb-1">{proj.name}</h3>
                                    {proj.url && (
                                        <a href={proj.url} className="text-[0.8em] tracking-widest uppercase text-slate-500 hover:text-slate-900 transition-colors block mb-3">{proj.url.replace(/^https?:\/\/(www\.)?/, '')}</a>
                                    )}

                                    {proj.description && (
                                        <div className="mb-3 text-[0.95em] text-slate-700 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: proj.description }} />
                                    )}

                                    {proj.bullets && proj.bullets.length > 0 && (
                                        <ul className="text-left list-none space-y-2 text-[0.9em] text-slate-600 font-light mb-4">
                                            {proj.bullets.map((b, i) => (
                                                <li key={i} className="relative pl-4 before:content-['—'] before:absolute before:left-0 before:text-slate-300">
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {proj.technologies && proj.technologies.length > 0 && (
                                        <div className="text-[0.75em] tracking-[0.15em] uppercase text-slate-400 mt-auto pt-4 border-t border-slate-100">
                                            {proj.technologies.join(' • ')}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-12">
                    {/* Education */}
                    {education && education.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-xl font-medium tracking-[0.2em] uppercase text-center mb-8 pb-4 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-px after:bg-slate-400" style={{ color: accentColor }}>
                                Education
                            </h2>
                            <div className="space-y-6">
                                {education.map(edu => (
                                    <div key={edu.id} className="text-center">
                                        <h3 className="font-semibold text-[1.05em] text-slate-900 mb-1">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                                        <div className="italic text-slate-600">{edu.institution}</div>
                                        <div className="text-[0.8em] tracking-widest uppercase text-slate-500 mt-2">
                                            {edu.startDate} – {edu.endDate || 'Expected'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-xl font-medium tracking-[0.2em] uppercase text-center mb-8 pb-4 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-px after:bg-slate-400" style={{ color: accentColor }}>
                                Expertise
                            </h2>
                            <div className="space-y-4 text-center">
                                {skills.map(skill => (
                                    <div key={skill.id}>
                                        <div className="font-semibold text-slate-900 mb-1">{skill.category}</div>
                                        <div className="text-[0.95em] text-slate-600 font-light leading-relaxed">
                                            {skill.items.join('   /   ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Certifications & Languages */}
                <div className="grid grid-cols-2 gap-12">
                    {certifications && certifications.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-xl font-medium tracking-[0.2em] uppercase text-center mb-8 pb-4 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-px after:bg-slate-400" style={{ color: accentColor }}>
                                Certifications
                            </h2>
                            <div className="space-y-4 text-center">
                                {certifications.map(cert => (
                                    <div key={cert.id}>
                                        <div className="font-semibold text-[1.05em] text-slate-900">{cert.name}</div>
                                        <div className="italic text-slate-600">{cert.issuer}</div>
                                        <div className="text-[0.8em] tracking-widest uppercase text-slate-500 mt-1">{cert.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {languages && languages.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-xl font-medium tracking-[0.2em] uppercase text-center mb-8 pb-4 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-px after:bg-slate-400" style={{ color: accentColor }}>
                                Languages
                            </h2>
                            <div className="space-y-3 text-center">
                                {languages.map(lang => (
                                    <div key={lang.id}>
                                        <span className="font-semibold text-slate-900">{lang.language}</span>
                                        <span className="text-slate-500 ml-2 capitalize">— {lang.proficiency}</span>
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
