import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface StartupTemplateProps {
    resume: Resume;
}

export function StartupTemplate({ resume }: StartupTemplateProps) {
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

    const accentColor = settings?.colors?.primary || '#f97316'; // orange-500

    const spacingClass =
        settings?.spacing === 'compact' ? 'space-y-4 mb-5' :
            settings?.spacing === 'relaxed' ? 'space-y-8 mb-10' :
                'space-y-6 mb-8';

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9pt]' :
            settings?.fontSize === 'large' ? 'text-[12pt]' :
                'text-[10.5pt]';

    return (
        <div className={cn("w-[794px]  bg-white text-zinc-900 font-sans leading-relaxed p-12 mx-auto  box-border", textClass)}>

            {/* Header Area */}
            {personalInfo && (
                <div className="flex flex-col mb-10">
                    <div className="flex justify-between items-end mb-4 border-b-4 pb-4" style={{ borderColor: accentColor }}>
                        <div>
                            <h1 className="text-5xl font-black tracking-tight text-zinc-900 leading-none mb-2">
                                {personalInfo.fullName || 'Your Name'}
                            </h1>
                            {personalInfo.title && (
                                <p className="text-2xl font-bold text-zinc-500 tracking-wide">{personalInfo.title}</p>
                            )}
                        </div>
                        <div className="text-right text-[0.85em] font-medium space-y-1 text-zinc-500">
                            {personalInfo.email && <div className="flex items-center justify-end gap-2"><a href={`mailto:${personalInfo.email}`} className="hover:text-zinc-900 hover:underline">{personalInfo.email}</a> <Mail className="h-3.5 w-3.5" /></div>}
                            {personalInfo.phone && <div className="flex items-center justify-end gap-2"><a href={`tel:${personalInfo.phone}`} className="hover:text-zinc-900 hover:underline">{personalInfo.phone}</a> <Phone className="h-3.5 w-3.5" /></div>}
                            {personalInfo.location && <div className="flex items-center justify-end gap-2">{personalInfo.location} <MapPin className="h-3.5 w-3.5" /></div>}
                        </div>
                    </div>

                    {/* Web Links Row */}
                    <div className="flex gap-6 text-[0.85em] font-bold text-zinc-400">
                        {personalInfo.website && <div className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors"><Globe className="h-4 w-4" /> <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer">{personalInfo.website.replace(/^https?:\/\//, '')}</a></div>}
                        {personalInfo.linkedin && <div className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors"><Linkedin className="h-4 w-4" /> <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a></div>}
                        {personalInfo.github && <div className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors"><Github className="h-4 w-4" /> <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer">{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</a></div>}
                    </div>
                </div>
            )}

            {/* Summary */}
            {personalInfo?.summary && (
                <div className={cn("text-[1.1em] font-medium text-zinc-600 leading-relaxed", spacingClass)} dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
            )}

            <div className="grid grid-cols-[1fr_200px] gap-10">
                {/* Main Content Column */}
                <div>
                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-2xl font-black uppercase tracking-widest text-zinc-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-1 rounded-full" style={{ backgroundColor: accentColor }}></span>
                                Experience
                            </h2>
                            <div className="space-y-8">
                                {experience.map(exp => (
                                    <div key={exp.id} className="relative">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-[1.2em] text-zinc-900">{exp.position}</h3>
                                            <span className="font-bold text-[0.85em] text-zinc-400 uppercase tracking-widest bg-zinc-100 px-3 py-1 rounded-full">
                                                {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                            </span>
                                        </div>
                                        <div className="font-black text-[1.05em] mb-3" style={{ color: accentColor }}>{exp.company}</div>

                                        {exp.description && (
                                            <div className="mb-3 text-[0.95em] text-zinc-600 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: exp.description }} />
                                        )}

                                        {exp.bullets && exp.bullets.length > 0 && (
                                            <ul className="space-y-2 text-[0.95em] text-zinc-600 font-medium">
                                                {exp.bullets.map((b, i) => (
                                                    <li key={i} className="flex gap-3 items-start">
                                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }}></span>
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
                            <h2 className="text-2xl font-black uppercase tracking-widest text-zinc-900 mb-6 flex items-center gap-3 mt-10">
                                <span className="w-8 h-1 rounded-full" style={{ backgroundColor: accentColor }}></span>
                                Projects
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                {projects.map(proj => (
                                    <div key={proj.id} className="bg-zinc-50 border-2 border-zinc-100 p-6 rounded-2xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-black text-[1.15em] text-zinc-900">{proj.name}</h3>
                                            {proj.url && (
                                                <a href={proj.url} className="text-[0.85em] font-bold py-1 px-3 rounded-full bg-white border border-zinc-200 hover:border-zinc-400 transition-colors  text-zinc-600">{proj.url.replace(/^https?:\/\/(www\.)?/, '')}</a>
                                            )}
                                        </div>

                                        {proj.description && (
                                            <div className="mb-3 text-[0.95em] text-zinc-600 font-medium" dangerouslySetInnerHTML={{ __html: proj.description }} />
                                        )}

                                        {proj.bullets && proj.bullets.length > 0 && (
                                            <ul className="space-y-1.5 text-[0.9em] text-zinc-500 font-medium mb-3">
                                                {proj.bullets.map((b, i) => (
                                                    <li key={i} className="flex gap-2 items-start">
                                                        <span className="mt-1.5 text-zinc-300 font-black">›</span>
                                                        <span>{b}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {proj.technologies && proj.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {proj.technologies.map((tech, i) => (
                                                    <span key={i} className="text-[0.75em] font-black uppercase tracking-wider text-zinc-500 bg-white px-2 py-1 rounded-md border border-zinc-200">
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

                {/* Right Column / Sidebar Info */}
                <div>
                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-black uppercase tracking-widest text-zinc-900 mb-4 border-b-2 border-zinc-100 pb-2">Skills</h2>
                            <div className="space-y-5">
                                {skills.map(skill => (
                                    <div key={skill.id}>
                                        <div className="font-bold text-[0.85em] uppercase tracking-wider text-zinc-400 mb-2">{skill.category}</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {skill.items.map((item, i) => (
                                                <span key={i} className="font-bold text-[0.85em] text-zinc-800 bg-zinc-100 px-2 py-1 rounded-md">
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
                            <h2 className="text-lg font-black uppercase tracking-widest text-zinc-900 mb-4 border-b-2 border-zinc-100 pb-2">Education</h2>
                            <div className="space-y-5">
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <h3 className="font-black text-[0.95em] text-zinc-900 leading-tight mb-1">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                                        <div className="font-bold text-[0.85em]" style={{ color: accentColor }}>{edu.institution}</div>
                                        <div className="font-medium text-[0.8em] text-zinc-400 mt-1 uppercase tracking-wider">
                                            {edu.startDate} – {edu.endDate || 'Expected'}
                                        </div>
                                        {edu.gpa && <div className="font-bold text-[0.8em] text-zinc-500 mt-0.5 border border-zinc-200 inline-block px-1 rounded-sm">GPA {edu.gpa}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-black uppercase tracking-widest text-zinc-900 mb-4 border-b-2 border-zinc-100 pb-2">Certifications</h2>
                            <div className="space-y-4">
                                {certifications.map(cert => (
                                    <div key={cert.id}>
                                        <h3 className="font-bold text-[0.9em] text-zinc-900">{cert.name}</h3>
                                        <div className="font-medium text-[0.85em] text-zinc-500">{cert.issuer}</div>
                                        <div className="font-bold text-[0.75em] text-zinc-400 uppercase tracking-widest mt-0.5">{cert.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-black uppercase tracking-widest text-zinc-900 mb-4 border-b-2 border-zinc-100 pb-2">Languages</h2>
                            <div className="space-y-2">
                                {languages.map(lang => (
                                    <div key={lang.id} className="flex justify-between items-end border-b border-dashed border-zinc-200 pb-1">
                                        <span className="font-bold text-[0.9em] text-zinc-800">{lang.language}</span>
                                        <span className="font-bold text-[0.75em] uppercase tracking-widest text-zinc-400">{lang.proficiency}</span>
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
