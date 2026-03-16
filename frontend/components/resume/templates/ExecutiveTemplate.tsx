import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface ExecutiveTemplateProps {
    resume: Resume;
}

export function ExecutiveTemplate({ resume }: ExecutiveTemplateProps) {
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

    const headerColor = settings?.colors?.primary || '#334155'; // slate-700

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9pt]' :
            settings?.fontSize === 'large' ? 'text-[12pt]' :
                'text-[10.5pt]';

    return (
        <div className={cn("w-[794px]  bg-white text-gray-800 font-serif flex flex-col  box-border", textClass)}>

            {/* Dark Header */}
            {personalInfo && (
                <div className="w-full text-white p-10 text-center" style={{ backgroundColor: headerColor }}>
                    <h1 className="text-4xl font-bold uppercase tracking-widest mb-2 font-sans">
                        {personalInfo.fullName || 'Your Name'}
                    </h1>
                    {personalInfo.title && (
                        <p className="text-xl font-medium tracking-wide opacity-90 mb-4">{personalInfo.title}</p>
                    )}

                    <div className="flex flex-wrap justify-center items-center gap-4 text-[0.85em] font-sans opacity-90">
                        {personalInfo.location && <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {personalInfo.location}</div>}
                        {personalInfo.email && <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-300 hover:underline">{personalInfo.email}</a></div>}
                        {personalInfo.phone && <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> <a href={`tel:${personalInfo.phone}`} className="hover:text-blue-300 hover:underline">{personalInfo.phone}</a></div>}
                        {personalInfo.website && <div className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 hover:underline">{personalInfo.website.replace(/^https?:\/\//, '')}</a></div>}
                        {personalInfo.linkedin && <div className="flex items-center gap-1.5"><Linkedin className="h-3.5 w-3.5" /> <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 hover:underline">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a></div>}
                        {personalInfo.github && <div className="flex items-center gap-1.5"><Github className="h-3.5 w-3.5" /> <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 hover:underline">{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</a></div>}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="p-10 space-y-6 flex-1 bg-[#fafafa]">

                {/* Summary */}
                {personalInfo?.summary && (
                    <div className="text-[1.05em] leading-relaxed italic text-gray-700 text-center px-8 border-b border-gray-300 pb-6">
                        <div dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
                    </div>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 shrink-0 font-sans">Professional Experience</h2>
                            <div className="h-px bg-gray-300 flex-1"></div>
                        </div>
                        <div className="space-y-6">
                            {experience.map(exp => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-[1.15em] text-gray-900">{exp.position}</h3>
                                        <span className="font-sans text-[0.9em] text-gray-600 font-semibold uppercase tracking-wider">
                                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                        </span>
                                    </div>
                                    <div className="text-[1.05em] font-medium text-gray-800 mb-2 italic">{exp.company}</div>
                                    {exp.description && (
                                        <div className="mb-2 text-[0.95em] text-gray-700" dangerouslySetInnerHTML={{ __html: exp.description }} />
                                    )}
                                    {exp.bullets && exp.bullets.length > 0 && (
                                        <ul className="list-disc pl-5 space-y-1.5 text-[0.95em] text-gray-700">
                                            {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education & Skills Split */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Education */}
                    {education && education.length > 0 && (
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 shrink-0 font-sans">Education</h2>
                                <div className="h-px bg-gray-300 flex-1"></div>
                            </div>
                            <div className="space-y-4">
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                                        <div className="text-gray-800">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</div>
                                        <div className="font-sans text-[0.85em] text-gray-500 font-semibold mt-0.5">{edu.startDate} – {edu.endDate || 'Expected'}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 shrink-0 font-sans">Core Competencies</h2>
                                <div className="h-px bg-gray-300 flex-1"></div>
                            </div>
                            <div className="space-y-2">
                                {skills.map(skill => (
                                    <div key={skill.id} className="flex">
                                        <span className="font-bold w-1/3 shrink-0 text-gray-900 font-sans text-[0.9em]">{skill.category}</span>
                                        <span className="text-gray-700">{skill.items.join(', ')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                    <div className="mb-6 mt-6">
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 shrink-0 font-sans">Certifications</h2>
                            <div className="h-px bg-gray-300 flex-1"></div>
                        </div>
                        <div className="space-y-3">
                            {certifications.map(cert => (
                                <div key={cert.id} className="flex justify-between items-baseline">
                                    <div>
                                        <span className="font-bold text-gray-900">{cert.name}</span>
                                        <span className="text-gray-700 ml-2 italic">{cert.issuer}</span>
                                    </div>
                                    <span className="font-sans text-[0.85em] text-gray-500 font-semibold">{cert.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages */}
                {languages && languages.length > 0 && (
                    <div className="mb-6 mt-6">
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 shrink-0 font-sans">Languages</h2>
                            <div className="h-px bg-gray-300 flex-1"></div>
                        </div>
                        <div className="flex flex-wrap gap-x-8 gap-y-2">
                            {languages.map(lang => (
                                <div key={lang.id} className="text-[0.95em]">
                                    <span className="font-bold text-gray-900">{lang.language}</span>
                                    <span className="text-gray-600 ml-1.5 capitalize">({lang.proficiency})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
