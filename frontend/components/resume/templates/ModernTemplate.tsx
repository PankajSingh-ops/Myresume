import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface ModernTemplateProps {
    resume: Resume;
}

export function ModernTemplate({ resume }: ModernTemplateProps) {
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

    const accentColor = settings?.colors?.primary || '#8b5cf6';

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9pt]' :
            settings?.fontSize === 'large' ? 'text-[12pt]' :
                'text-[10.5pt]';

    return (
        <div className={cn("w-[794px]  bg-white text-gray-800 font-sans flex  box-border", textClass)}>

            {/* Left Sidebar */}
            <div className="w-[32%] text-white p-8" style={{ backgroundColor: accentColor }}>
                {personalInfo && (
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2 leading-tight">
                            {personalInfo.fullName || 'Your Name'}
                        </h1>
                        {personalInfo.title && (
                            <p className="text-lg opacity-90 font-medium">{personalInfo.title}</p>
                        )}
                    </div>
                )}

                <div className="space-y-6 text-[0.9em]">
                    {/* Contact */}
                    {personalInfo && (
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-white/30 pb-1">Contact</h2>
                            <div className="space-y-2 opacity-90">
                                {personalInfo.email && <div className="flex items-center gap-2 max-w-full"><Mail className="h-4 w-4 shrink-0" /> <a href={`mailto:${personalInfo.email}`} className="truncate hover:underline">{personalInfo.email}</a></div>}
                                {personalInfo.phone && <div className="flex items-center gap-2 max-w-full"><Phone className="h-4 w-4 shrink-0" /> <a href={`tel:${personalInfo.phone}`} className="truncate hover:underline">{personalInfo.phone}</a></div>}
                                {personalInfo.location && <div className="flex items-center gap-2 max-w-full"><MapPin className="h-4 w-4 shrink-0" /> <span className="truncate">{personalInfo.location}</span></div>}
                                {personalInfo.website && <div className="flex items-center gap-2 max-w-full"><Globe className="h-4 w-4 shrink-0" /> <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">{personalInfo.website.replace(/^https?:\/\//, '')}</a></div>}
                                {personalInfo.linkedin && <div className="flex items-center gap-2 max-w-full"><Linkedin className="h-4 w-4 shrink-0" /> <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a></div>}
                                {personalInfo.github && <div className="flex items-center gap-2 max-w-full"><Github className="h-4 w-4 shrink-0" /> <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</a></div>}
                            </div>
                        </div>
                    )}

                    {/* Education Sidebar */}
                    {education && education.length > 0 && (
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-white/30 pb-1">Education</h2>
                            <div className="space-y-3 opacity-90">
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <h3 className="font-bold">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                                        <div className="text-[0.9em]">{edu.institution}</div>
                                        <div className="text-[0.85em] opacity-80">{edu.startDate} - {edu.endDate || 'Expected'}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills Sidebar */}
                    {skills && skills.length > 0 && (
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-white/30 pb-1">Skills</h2>
                            <div className="space-y-3 opacity-90">
                                {skills.map(skill => (
                                    <div key={skill.id}>
                                        <h3 className="font-bold mb-1">{skill.category}</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {skill.items.map((item, i) => (
                                                <span key={i} className="bg-white/20 px-2 py-0.5 rounded text-[0.85em]">{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages Sidebar */}
                    {languages && languages.length > 0 && (
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-white/30 pb-1">Languages</h2>
                            <div className="space-y-1 opacity-90">
                                {languages.map(lang => (
                                    <div key={lang.id} className="flex justify-between">
                                        <span>{lang.language}</span>
                                        <span className="opacity-80 text-[0.9em]">{lang.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Main Area */}
            <div className="w-[68%] p-8 overflow-hidden bg-white">

                {/* Summary */}
                {personalInfo?.summary && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-gray-800 border-b pb-1" style={{ borderColor: accentColor }}>Profile</h2>
                        <div
                            className="text-[0.95em] text-gray-600 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
                        />
                    </div>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-gray-800 border-b pb-1" style={{ borderColor: accentColor }}>Experience</h2>
                        <div className="space-y-5">
                            {experience.map(exp => (
                                <div key={exp.id}>
                                    <h3 className="font-bold text-[1.1em] text-gray-900">{exp.position}</h3>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="font-semibold text-gray-700" style={{ color: accentColor }}>{exp.company}</span>
                                        <span className="text-[0.85em] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                        </span>
                                    </div>
                                    {exp.description && (
                                        <div className="mb-2 text-[0.95em] text-gray-600" dangerouslySetInnerHTML={{ __html: exp.description }} />
                                    )}
                                    {exp.bullets && exp.bullets.length > 0 && (
                                        <ul className="list-disc pl-4 space-y-1 text-[0.9em] text-gray-600">
                                            {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-gray-800 border-b pb-1" style={{ borderColor: accentColor }}>Projects</h2>
                        <div className="space-y-4">
                            {projects.map(proj => (
                                <div key={proj.id}>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <h3 className="font-bold text-[1.1em] text-gray-900">{proj.name}</h3>
                                        {proj.url && <a href={proj.url} className="text-[0.85em] text-blue-500 hover:underline truncate">{proj.url}</a>}
                                    </div>
                                    {proj.description && (
                                        <div className="mb-1 text-[0.95em] text-gray-600" dangerouslySetInnerHTML={{ __html: proj.description }} />
                                    )}
                                    {proj.bullets && proj.bullets.length > 0 && (
                                        <ul className="list-disc pl-4 space-y-1 text-[0.9em] text-gray-600">
                                            {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-gray-800 border-b pb-1" style={{ borderColor: accentColor }}>Certifications</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {certifications.map(cert => (
                                <div key={cert.id} className="text-[0.9em]">
                                    <div className="font-bold text-gray-900">{cert.name}</div>
                                    <div className="text-gray-600">{cert.issuer} • {cert.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
