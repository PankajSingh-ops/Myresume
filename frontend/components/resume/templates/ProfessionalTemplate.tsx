import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

export function ProfessionalTemplate({ resume }: { resume: Resume }) {
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

    const accentColor = settings?.colors?.primary || '#d97706'; // amber-600

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9pt]' :
            settings?.fontSize === 'large' ? 'text-[12pt]' :
                'text-[10pt]';

    return (
        <div className={cn("w-[794px]  bg-white text-gray-900 font-sans p-10  box-border", textClass)}>

            {/* Header */}
            {personalInfo && (
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1" style={{ color: accentColor }}>
                        {personalInfo.fullName || 'Your Name'}
                    </h1>

                    <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 mt-2 text-[0.9em] font-medium text-gray-600">
                        {personalInfo.location && <span>{personalInfo.location}</span>}
                        {personalInfo.phone && <><span className="text-gray-300">•</span><a href={`tel:${personalInfo.phone}`} className="hover:text-blue-600 hover:underline">{personalInfo.phone}</a></>}
                        {personalInfo.email && <><span className="text-gray-300">•</span><a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600 hover:underline">{personalInfo.email}</a></>}
                        {personalInfo.website && <><span className="text-gray-300">•</span><a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.website.replace(/^https?:\/\//, '')}</a></>}
                        {personalInfo.linkedin && <><span className="text-gray-300">•</span><a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'in/')}</a></>}
                        {personalInfo.github && <><span className="text-gray-300">•</span><a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</a></>}
                    </div>
                </div>
            )}

            {/* Summary */}
            {personalInfo?.summary && (
                <div className="mb-5">
                    <div className="text-[0.95em] text-gray-700 leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
                </div>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b-2 mb-2 pb-0.5" style={{ borderBottomColor: accentColor }}>
                        Technical Skills
                    </h2>
                    <div className="space-y-1">
                        {skills.map(skill => (
                            <div key={skill.id} className="text-[0.95em]">
                                <span className="font-bold text-gray-800 mr-2">{skill.category}:</span>
                                <span className="text-gray-700">{skill.items.join(', ')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b-2 mb-3 pb-0.5" style={{ borderBottomColor: accentColor }}>
                        Professional Experience
                    </h2>
                    <div className="space-y-4">
                        {experience.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-[1.05em] text-gray-900">{exp.position}</h3>
                                    <span className="font-semibold text-[0.9em] text-gray-600">
                                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                    </span>
                                </div>
                                <div className="font-medium text-[0.95em] text-gray-800 italic mb-1.5">{exp.company}</div>
                                {exp.description && (
                                    <div className="mb-1.5 text-[0.95em] text-gray-700" dangerouslySetInnerHTML={{ __html: exp.description }} />
                                )}
                                {exp.bullets && exp.bullets.length > 0 && (
                                    <ul className="list-disc pl-5 mt-1 space-y-1 text-[0.95em] text-gray-700">
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
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b-2 mb-3 pb-0.5" style={{ borderBottomColor: accentColor }}>
                        Projects
                    </h2>
                    <div className="space-y-3">
                        {projects.map(proj => (
                            <div key={proj.id}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="font-bold text-[1.05em] text-gray-900">
                                        {proj.name} {proj.url && <span className="font-normal text-[0.85em] text-gray-500 ml-2">({proj.url})</span>}
                                    </h3>
                                </div>
                                {proj.technologies && proj.technologies.length > 0 && (
                                    <div className="text-[0.9em] font-medium text-gray-600 italic mb-1">
                                        {proj.technologies.join(', ')}
                                    </div>
                                )}
                                {proj.bullets && proj.bullets.length > 0 ? (
                                    <ul className="list-disc pl-5 mt-1 space-y-1 text-[0.95em] text-gray-700">
                                        {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                                    </ul>
                                ) : (
                                    proj.description && <div className="text-[0.95em] text-gray-700" dangerouslySetInnerHTML={{ __html: proj.description }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b-2 mb-3 pb-0.5" style={{ borderBottomColor: accentColor }}>
                        Education
                    </h2>
                    <div className="space-y-3">
                        {education.map(edu => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-[1.05em] text-gray-900">{edu.institution}</h3>
                                    <span className="font-semibold text-[0.9em] text-gray-600">
                                        {edu.startDate} – {edu.endDate || 'Expected'}
                                    </span>
                                </div>
                                <div className="font-medium text-[0.95em] text-gray-800">
                                    {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                                    {edu.gpa && <span className="ml-2 font-normal text-gray-600">GPA: {edu.gpa}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b-2 mb-3 pb-0.5" style={{ borderBottomColor: accentColor }}>
                        Certifications
                    </h2>
                    <div className="space-y-2">
                        {certifications.map(cert => (
                            <div key={cert.id} className="flex justify-between items-baseline">
                                <div>
                                    <span className="font-bold text-[0.95em] text-gray-900">{cert.name}</span>
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
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b-2 mb-3 pb-0.5" style={{ borderBottomColor: accentColor }}>
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
