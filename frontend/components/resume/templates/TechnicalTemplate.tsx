import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github, Terminal } from 'lucide-react';

interface TechnicalTemplateProps {
    resume: Resume;
}

export function TechnicalTemplate({ resume }: TechnicalTemplateProps) {
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

    const primaryColor = settings?.colors?.primary || '#16a34a'; // green-600

    const spacingClass =
        settings?.spacing === 'compact' ? 'space-y-4 mb-5' :
            settings?.spacing === 'relaxed' ? 'space-y-8 mb-10' :
                'space-y-6 mb-8';

    const textClass =
        settings?.fontSize === 'small' ? 'text-[8.5pt]' :
            settings?.fontSize === 'large' ? 'text-[11pt]' :
                'text-[9.5pt]';

    return (
        <div className={cn("w-[794px]  bg-slate-50 text-slate-900 font-mono leading-relaxed p-10 mx-auto  box-border", textClass)}>

            <div className="border-4 border-slate-900 p-8 h-full bg-white relative">

                {/* Decorative Terminal Header */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-slate-900 flex items-center px-3 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="text-[0.7em] text-slate-400 ml-2">resume.sh</div>
                </div>

                <div className="pt-4">
                    {/* Header */}
                    {personalInfo && (
                        <div className="mb-8 border-b-2 border-dashed border-slate-300 pb-6">
                            <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 mb-2">
                                <span className="text-slate-400 mr-2">~/</span>{personalInfo.fullName || 'User'}
                            </h1>
                            {personalInfo.title && (
                                <p className="text-xl font-bold" style={{ color: primaryColor }}>{`> ${personalInfo.title}`}</p>
                            )}

                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-[0.9em] text-slate-600">
                                {personalInfo.location && <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {personalInfo.location}</span>}
                                {personalInfo.email && <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600 hover:underline">{personalInfo.email}</a></span>}
                                {personalInfo.phone && <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> <a href={`tel:${personalInfo.phone}`} className="hover:text-blue-600 hover:underline">{personalInfo.phone}</a></span>}
                                {personalInfo.website && <span className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.website.replace(/^https?:\/\//, '')}</a></span>}
                                {personalInfo.github && <span className="flex items-center gap-2"><Github className="h-3.5 w-3.5" /> <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</a></span>}
                                {personalInfo.linkedin && <span className="flex items-center gap-2"><Linkedin className="h-3.5 w-3.5" /> <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a></span>}
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    {personalInfo?.summary && (
                        <div className={spacingClass}>
                            <div className="text-[1.05em] text-slate-700 bg-slate-100 p-4 rounded-sm border border-slate-200" dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
                        </div>
                    )}

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2 text-slate-900">
                                <Terminal className="h-5 w-5" /> Config.Skills
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {skills.map(skill => (
                                    <div key={skill.id} className="text-[0.9em]">
                                        <div className="font-bold text-slate-900 mb-1" style={{ color: primaryColor }}>[{skill.category}]</div>
                                        <div className="text-slate-600 leading-snug">{skill.items.join(', ')}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2 text-slate-900 mt-8">
                                <Terminal className="h-5 w-5" /> Exec.Experience
                            </h2>
                            <div className="space-y-6">
                                {experience.map((exp, index) => (
                                    <div key={exp.id} className="relative pl-6 border-l-2 border-slate-200">
                                        <div className="absolute w-3 h-3 bg-white border-2 border-slate-300 rounded-full -left-[7px] top-1.5" />

                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-[1.1em] text-slate-900">{exp.position}</h3>
                                            <span className="font-bold text-[0.85em] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                                                {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                            </span>
                                        </div>
                                        <div className="font-bold text-[0.95em] mb-2" style={{ color: primaryColor }}>@ {exp.company}</div>

                                        {exp.description && (
                                            <div className="mb-2 text-[0.95em] text-slate-700" dangerouslySetInnerHTML={{ __html: exp.description }} />
                                        )}

                                        {exp.bullets && exp.bullets.length > 0 && (
                                            <ul className="list-none space-y-1 text-[0.95em] text-slate-600">
                                                {exp.bullets.map((b, i) => (
                                                    <li key={i} className="flex gap-2">
                                                        <span className="text-slate-400">{'>'}</span>
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
                            <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2 text-slate-900 mt-8">
                                <Terminal className="h-5 w-5" /> Run.Projects
                            </h2>
                            <div className="space-y-6">
                                {projects.map(proj => (
                                    <div key={proj.id} className="bg-slate-50 border border-slate-200 p-4 rounded-sm">
                                        <div className="flex items-baseline justify-between mb-2">
                                            <h3 className="font-bold text-[1.05em] text-slate-900">{proj.name}</h3>
                                            {proj.url && (
                                                <a href={proj.url} className="text-[0.85em] text-slate-500 hover:text-blue-600 hover:underline">{proj.url.replace(/^https?:\/\/(www\.)?/, '')}</a>
                                            )}
                                        </div>

                                        {proj.technologies && proj.technologies.length > 0 && (
                                            <div className="text-[0.85em] font-bold text-slate-400 mb-2 border-b border-dashed border-slate-200 pb-2">
                                                Tech: {proj.technologies.join(' | ')}
                                            </div>
                                        )}

                                        {proj.description && (
                                            <div className="mb-2 text-[0.95em] text-slate-700" dangerouslySetInnerHTML={{ __html: proj.description }} />
                                        )}

                                        {proj.bullets && proj.bullets.length > 0 && (
                                            <ul className="list-none space-y-1 text-[0.95em] text-slate-600">
                                                {proj.bullets.map((b, i) => (
                                                    <li key={i} className="flex gap-2">
                                                        <span style={{ color: primaryColor }}>$</span>
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

                    {/* Education */}
                    {education && education.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2 text-slate-900 mt-8">
                                <Terminal className="h-5 w-5" /> Init.Education
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <h3 className="font-bold text-[0.95em] text-slate-900">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                                        <div className="text-[0.9em] font-bold" style={{ color: primaryColor }}>{edu.institution}</div>
                                        <div className="text-[0.85em] text-slate-500 mt-1">
                                            [{edu.startDate} – {edu.endDate || 'Expected'}] {edu.gpa && `| GPA: ${edu.gpa}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2 text-slate-900 mt-8">
                                <Terminal className="h-5 w-5" /> Config.Certifications
                            </h2>
                            <div className="space-y-3">
                                {certifications.map(cert => (
                                    <div key={cert.id} className="bg-slate-50 border border-slate-200 p-3 rounded-sm">
                                        <div className="font-bold text-[0.95em] text-slate-900">{cert.name}</div>
                                        <div className="text-[0.85em] text-slate-600">{cert.issuer}</div>
                                        <div className="text-[0.8em] text-slate-500 mt-1" style={{ color: primaryColor }}>[{cert.date}]</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2 text-slate-900 mt-8">
                                <Terminal className="h-5 w-5" /> Config.Languages
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {languages.map(lang => (
                                    <div key={lang.id} className="flex justify-between text-[0.9em] bg-slate-50 border border-slate-200 px-3 py-2 rounded-sm">
                                        <span className="font-bold text-slate-900">{lang.language}</span>
                                        <span className="text-slate-500 capitalize">{lang.proficiency}</span>
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
