import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface ClassicTemplateProps {
    resume: Resume;
}

export function ClassicTemplate({ resume }: ClassicTemplateProps) {
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

    // Use settings for basic theming later, for now we stick to standard classic styling.
    const primaryColor = settings?.colors?.primary || '#2563eb'; // standard blue

    // Spacing utility multiplier
    const spacingClass =
        settings?.spacing === 'compact' ? 'space-y-2 mb-3' :
            settings?.spacing === 'relaxed' ? 'space-y-4 mb-6' :
                'space-y-3 mb-4';

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9pt]' :
            settings?.fontSize === 'large' ? 'text-[12pt]' :
                'text-[10.5pt]';

    return (
        <div className={cn("w-[794px]  bg-white text-black font-sans leading-snug p-10 mx-auto  box-border", textClass)}>

            {/* Header: Personal Info */}
            {personalInfo && (
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold uppercase tracking-tight" style={{ color: primaryColor }}>
                        {personalInfo.fullName || 'Your Name'}
                    </h1>
                    {personalInfo.title && (
                        <p className="text-lg mt-1 font-medium text-gray-700">{personalInfo.title}</p>
                    )}

                    <div className="flex flex-wrap justify-center items-center gap-3 mt-3 text-[0.85em] text-gray-600">
                        {personalInfo.email && (
                            <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" /> <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600 hover:underline">{personalInfo.email}</a>
                            </div>
                        )}
                        {personalInfo.phone && (
                            <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" /> <a href={`tel:${personalInfo.phone}`} className="hover:text-blue-600 hover:underline">{personalInfo.phone}</a>
                            </div>
                        )}
                        {personalInfo.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {personalInfo.location}
                            </div>
                        )}
                        {personalInfo.website && (
                            <div className="flex items-center gap-1">
                                <Globe className="h-3 w-3" /> <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.website.replace(/^https?:\/\//, '')}</a>
                            </div>
                        )}
                        {personalInfo.linkedin && (
                            <div className="flex items-center gap-1">
                                <Linkedin className="h-3 w-3" /> <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a>
                            </div>
                        )}
                        {personalInfo.github && (
                            <div className="flex items-center gap-1">
                                <Github className="h-3 w-3" /> <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</a>
                            </div>
                        )}
                    </div>

                    {personalInfo.summary && (
                        <div
                            className="mt-4 text-[0.95em] text-gray-800 text-left"
                            dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
                        />
                    )}
                </div>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <div className={spacingClass}>
                    <h2 className="text-lg font-bold border-b-2 uppercase mb-2" style={{ borderBottomColor: primaryColor, color: primaryColor }}>
                        Experience
                    </h2>
                    <div className="space-y-4">
                        {experience.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-[1.05em]">{exp.position}</h3>
                                    <span className="font-medium text-[0.9em] whitespace-nowrap text-gray-600">
                                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                    </span>
                                </div>
                                <div className="font-medium text-[0.95em] text-gray-700 italic mb-1">{exp.company}</div>

                                {exp.description && (
                                    <div
                                        className="mb-1 text-[0.95em]"
                                        dangerouslySetInnerHTML={{ __html: exp.description }}
                                    />
                                )}

                                {exp.bullets && exp.bullets.length > 0 && (
                                    <ul className="list-disc pl-5 mt-1 space-y-0.5 text-[0.95em]">
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

            {/* Education */}
            {education && education.length > 0 && (
                <div className={spacingClass}>
                    <h2 className="text-lg font-bold border-b-2 uppercase mb-2 mt-4" style={{ borderBottomColor: primaryColor, color: primaryColor }}>
                        Education
                    </h2>
                    <div className="space-y-3">
                        {education.map(edu => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-[1.05em]">{edu.institution}</h3>
                                    <span className="font-medium text-[0.9em] whitespace-nowrap text-gray-600">
                                        {edu.startDate} – {edu.endDate || 'Expected'}
                                    </span>
                                </div>
                                <div className="font-medium text-[0.95em] text-gray-700">
                                    {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
                <div className={spacingClass}>
                    <h2 className="text-lg font-bold border-b-2 uppercase mb-2 mt-4" style={{ borderBottomColor: primaryColor, color: primaryColor }}>
                        Projects
                    </h2>
                    <div className="space-y-3">
                        {projects.map(proj => (
                            <div key={proj.id}>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <h3 className="font-bold text-[1.05em]">{proj.name}</h3>
                                    {proj.url && (
                                        <a href={proj.url} className="text-[0.85em] text-blue-600 underline truncate max-w-[200px]">{proj.url}</a>
                                    )}
                                </div>

                                {proj.technologies && proj.technologies.length > 0 && (
                                    <div className="text-[0.85em] font-medium text-gray-600 italic mb-1">
                                        Technologies: {proj.technologies.join(', ')}
                                    </div>
                                )}

                                {proj.description && (
                                    <div
                                        className="mb-1 text-[0.95em]"
                                        dangerouslySetInnerHTML={{ __html: proj.description }}
                                    />
                                )}

                                {proj.bullets && proj.bullets.length > 0 && (
                                    <ul className="list-disc pl-5 mt-1 space-y-0.5 text-[0.95em]">
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

            {/* Skills */}
            {skills && skills.length > 0 && (
                <div className={spacingClass}>
                    <h2 className="text-lg font-bold border-b-2 uppercase mb-2 mt-4" style={{ borderBottomColor: primaryColor, color: primaryColor }}>
                        Skills
                    </h2>
                    <div className="space-y-1.5">
                        {skills.map(skill => (
                            <div key={skill.id} className="flex">
                                <span className="font-bold w-1/4 shrink-0 text-[0.95em]">{skill.category}:</span>
                                <span className="text-[0.95em]">{skill.items.join(', ')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
                <div className={spacingClass}>
                    <h2 className="text-lg font-bold border-b-2 uppercase mb-2 mt-4" style={{ borderBottomColor: primaryColor, color: primaryColor }}>
                        Certifications
                    </h2>
                    <div className="space-y-2">
                        {certifications.map(cert => (
                            <div key={cert.id} className="flex justify-between items-baseline">
                                <div>
                                    <span className="font-bold text-[0.95em]">{cert.name}</span>
                                    <span className="text-[0.9em] text-gray-600 ml-2">— {cert.issuer}</span>
                                </div>
                                <span className="text-[0.85em] text-gray-500 whitespace-nowrap">{cert.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
                <div className={spacingClass}>
                    <h2 className="text-lg font-bold border-b-2 uppercase mb-2 mt-4" style={{ borderBottomColor: primaryColor, color: primaryColor }}>
                        Languages
                    </h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                        {languages.map(lang => (
                            <div key={lang.id} className="text-[0.95em]">
                                <span className="font-bold">{lang.language}</span>
                                <span className="text-gray-600 ml-1 capitalize">({lang.proficiency})</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
