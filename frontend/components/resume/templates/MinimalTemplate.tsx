import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

export function MinimalTemplate({ resume }: { resume: Resume }) {
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

    const accentColor = settings?.colors?.primary || '#4b5563'; // gray-600

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9pt]' :
            settings?.fontSize === 'large' ? 'text-[12pt]' :
                'text-[10pt]';

    return (
        <div className={cn("w-[794px]  bg-white text-neutral-800 font-sans p-16  box-border", textClass)}>

            {/* Header */}
            {personalInfo && (
                <div className="mb-12">
                    <h1 className="text-4xl font-light tracking-tight mb-3 text-neutral-900">
                        {personalInfo.fullName || 'Your Name'}
                    </h1>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.85em] text-neutral-500 font-medium tracking-wide">
                        {personalInfo.location && <span>{personalInfo.location}</span>}
                        {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600 hover:underline">{personalInfo.email}</a>}
                        {personalInfo.phone && <a href={`tel:${personalInfo.phone}`} className="hover:text-blue-600 hover:underline">{personalInfo.phone}</a>}
                        {personalInfo.website && <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.website.replace(/^https?:\/\//, '')}</a>}
                        {personalInfo.linkedin && <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-blue-600 hover:underline">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'in/')}</a>}
                        {personalInfo.github && <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</a>}
                    </div>

                    {personalInfo.summary && (
                        <div className="mt-8 text-[1.1em] leading-relaxed text-neutral-600 font-light max-w-2xl" dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
                    )}
                </div>
            )}

            <div className="space-y-12">

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section>
                        <h2 className="text-[0.75em] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6">Experience</h2>
                        <div className="space-y-8">
                            {experience.map(exp => (
                                <div key={exp.id} className="grid grid-cols-12 gap-8">
                                    <div className="col-span-3 text-[0.85em] text-neutral-500 font-medium">
                                        {exp.startDate} <br /><span className="text-neutral-400">— {exp.current ? 'Present' : exp.endDate || ''}</span>
                                    </div>
                                    <div className="col-span-9">
                                        <h3 className="font-medium text-[1.1em] text-neutral-900">{exp.company}</h3>
                                        <div className="text-neutral-500 mb-3" style={{ color: accentColor }}>{exp.position}</div>
                                        {exp.description && (
                                            <div className="mb-3 text-[0.95em] text-neutral-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: exp.description }} />
                                        )}
                                        {exp.bullets && exp.bullets.length > 0 && (
                                            <ul className="list-disc pl-4 space-y-1.5 text-[0.95em] text-neutral-600">
                                                {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <section>
                        <h2 className="text-[0.75em] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6 border-t border-neutral-100 pt-12">Education</h2>
                        <div className="space-y-6">
                            {education.map(edu => (
                                <div key={edu.id} className="grid grid-cols-12 gap-8">
                                    <div className="col-span-3 text-[0.85em] text-neutral-500 font-medium">
                                        {edu.startDate} <br /><span className="text-neutral-400">— {edu.endDate || 'Expected'}</span>
                                    </div>
                                    <div className="col-span-9">
                                        <h3 className="font-medium text-[1.05em] text-neutral-900">{edu.institution}</h3>
                                        <div className="text-neutral-600 mt-1">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <section>
                        <h2 className="text-[0.75em] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6 border-t border-neutral-100 pt-12">Skills</h2>
                        <div className="grid grid-cols-12 gap-8">
                            <div className="col-span-3"></div>
                            <div className="col-span-9 space-y-4">
                                {skills.map(skill => (
                                    <div key={skill.id} className="flex">
                                        <span className="w-1/4 font-medium text-neutral-900 shrink-0">{skill.category}</span>
                                        <span className="text-neutral-600">{skill.items.join(', ')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                    <section>
                        <h2 className="text-[0.75em] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6 border-t border-neutral-100 pt-12">Certifications</h2>
                        <div className="space-y-4">
                            {certifications.map(cert => (
                                <div key={cert.id} className="grid grid-cols-12 gap-8">
                                    <div className="col-span-3 text-[0.85em] text-neutral-500 font-medium">
                                        {cert.date}
                                    </div>
                                    <div className="col-span-9">
                                        <h3 className="font-medium text-[1.05em] text-neutral-900">{cert.name}</h3>
                                        <div className="text-neutral-600 mt-0.5">{cert.issuer}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Languages */}
                {languages && languages.length > 0 && (
                    <section>
                        <h2 className="text-[0.75em] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6 border-t border-neutral-100 pt-12">Languages</h2>
                        <div className="grid grid-cols-12 gap-8">
                            <div className="col-span-3"></div>
                            <div className="col-span-9 space-y-2">
                                {languages.map(lang => (
                                    <div key={lang.id} className="flex justify-between">
                                        <span className="font-medium text-neutral-900">{lang.language}</span>
                                        <span className="text-neutral-500 capitalize">{lang.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
}
