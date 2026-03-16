import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface CorporateTemplateProps {
    resume: Resume;
}

export function CorporateTemplate({ resume }: CorporateTemplateProps) {
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

    const primaryColor = settings?.colors?.primary || '#1e3a8a'; // blue-900

    const spacingClass =
        settings?.spacing === 'compact' ? 'space-y-3 mb-4' :
            settings?.spacing === 'relaxed' ? 'space-y-6 mb-8' :
                'space-y-4 mb-6';

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9pt]' :
            settings?.fontSize === 'large' ? 'text-[11.5pt]' :
                'text-[10pt]';

    return (
        <div className={cn("w-[794px]  bg-white text-gray-900 font-serif leading-relaxed p-12 mx-auto  box-border", textClass)}>

            {/* Header */}
            {personalInfo && (
                <div className="border-b-4 pb-4 mb-6" style={{ borderColor: primaryColor }}>
                    <h1 className="text-4xl font-extrabold uppercase tracking-widest text-center" style={{ color: primaryColor }}>
                        {personalInfo.fullName || 'Your Name'}
                    </h1>
                    {personalInfo.title && (
                        <p className="text-xl mt-2 font-medium text-center uppercase tracking-wide text-gray-600">{personalInfo.title}</p>
                    )}

                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-[0.9em] font-sans font-medium text-gray-600">
                        {personalInfo.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600 hover:underline">{personalInfo.email}</a></span>}
                        {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> <a href={`tel:${personalInfo.phone}`} className="hover:text-blue-600 hover:underline">{personalInfo.phone}</a></span>}
                        {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {personalInfo.location}</span>}
                        {personalInfo.website && <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.website.replace(/^https?:\/\//, '')}</a></span>}
                        {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="h-3 w-3" /> <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a></span>}
                        {personalInfo.github && <span className="flex items-center gap-1"><Github className="h-3 w-3" /> <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</a></span>}
                    </div>
                </div>
            )}

            {/* Summary */}
            {personalInfo?.summary && (
                <div className={spacingClass}>
                    <p className="text-[1.05em] leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
                </div>
            )}

            {/* Two Column Layout for the rest */}
            <div className="grid grid-cols-[1fr_2fr] gap-8">

                {/* Left Column: Sidebar-ish info */}
                <div>
                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b-2" style={{ color: primaryColor, borderBottomColor: primaryColor }}>
                                Core Competencies
                            </h2>
                            <div className="space-y-3 font-sans">
                                {skills.map(skill => (
                                    <div key={skill.id}>
                                        <div className="font-bold text-[0.9em] text-gray-800 mb-1">{skill.category}</div>
                                        <div className="text-[0.9em] text-gray-600 leading-snug">{skill.items.join(' • ')}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b-2" style={{ color: primaryColor, borderBottomColor: primaryColor }}>
                                Education
                            </h2>
                            <div className="space-y-4 font-sans">
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <h3 className="font-bold text-[0.95em] text-gray-900">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                                        <div className="text-[0.9em] text-gray-700 font-medium">{edu.institution}</div>
                                        <div className="text-[0.85em] text-gray-500 mt-0.5">
                                            {edu.startDate} – {edu.endDate || 'Expected'}
                                        </div>
                                        {edu.gpa && <div className="text-[0.85em] text-gray-500 mt-0.5">GPA: {edu.gpa}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b-2" style={{ color: primaryColor, borderBottomColor: primaryColor }}>
                                Certifications
                            </h2>
                            <div className="space-y-3 font-sans">
                                {certifications.map(cert => (
                                    <div key={cert.id}>
                                        <h3 className="font-bold text-[0.9em] text-gray-900">{cert.name}</h3>
                                        <div className="text-[0.85em] text-gray-600 italic">{cert.issuer}</div>
                                        <div className="text-[0.8em] text-gray-500 mt-0.5">{cert.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b-2" style={{ color: primaryColor, borderBottomColor: primaryColor }}>
                                Languages
                            </h2>
                            <div className="space-y-1.5 font-sans">
                                {languages.map(lang => (
                                    <div key={lang.id} className="flex justify-between text-[0.9em]">
                                        <span className="font-semibold text-gray-800">{lang.language}</span>
                                        <span className="text-gray-500 capitalize">{lang.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Main content */}
                <div>
                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b-2" style={{ color: primaryColor, borderBottomColor: primaryColor }}>
                                Professional Experience
                            </h2>
                            <div className="space-y-6 flex-1">
                                {experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-[1.1em] text-gray-900">{exp.position}</h3>
                                            <span className="font-sans font-medium text-[0.85em] text-gray-500 uppercase tracking-wide whitespace-nowrap">
                                                {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                            </span>
                                        </div>
                                        <div className="font-sans font-bold text-[0.95em] text-gray-700 uppercase tracking-widest mb-2" style={{ color: primaryColor }}>{exp.company}</div>

                                        {exp.description && (
                                            <div className="mb-2 text-[0.95em]" dangerouslySetInnerHTML={{ __html: exp.description }} />
                                        )}

                                        {exp.bullets && exp.bullets.length > 0 && (
                                            <ul className="list-disc pl-5 font-sans space-y-1 text-[0.95em] text-gray-700 marker:text-gray-400">
                                                {exp.bullets.map((b, i) => (
                                                    <li key={i}>{b}</li>
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
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b-2" style={{ color: primaryColor, borderBottomColor: primaryColor }}>
                                Selected Projects
                            </h2>
                            <div className="space-y-5 flex-1">
                                {projects.map(proj => (
                                    <div key={proj.id}>
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <h3 className="font-bold text-[1.05em] text-gray-900">{proj.name}</h3>
                                            {proj.url && (
                                                <a href={proj.url} className="font-sans text-[0.85em] text-blue-600 hover:underline">{proj.url.replace(/^https?:\/\/(www\.)?/, '')}</a>
                                            )}
                                        </div>

                                        {proj.technologies && proj.technologies.length > 0 && (
                                            <div className="font-sans text-[0.85em] font-medium text-gray-500 mb-1.5">
                                                {proj.technologies.join(' • ')}
                                            </div>
                                        )}

                                        {proj.description && (
                                            <div className="mb-1.5 text-[0.95em]" dangerouslySetInnerHTML={{ __html: proj.description }} />
                                        )}

                                        {proj.bullets && proj.bullets.length > 0 && (
                                            <ul className="list-disc pl-5 font-sans space-y-1 text-[0.95em] text-gray-700 marker:text-gray-400">
                                                {proj.bullets.map((b, i) => (
                                                    <li key={i}>{b}</li>
                                                ))}
                                            </ul>
                                        )}
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
