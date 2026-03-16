import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface AvatarTemplateProps {
    resume: Resume;
}

export function AvatarTemplate({ resume }: AvatarTemplateProps) {
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

    const primaryColor = settings?.colors?.primary || '#2563eb'; // standard blue

    // Spacing utility multiplier
    const spacingClass =
        settings?.spacing === 'compact' ? 'space-y-2 mb-3' :
            settings?.spacing === 'relaxed' ? 'space-y-5 mb-8' :
                'space-y-4 mb-6';

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9pt]' :
            settings?.fontSize === 'large' ? 'text-[12pt]' :
                'text-[10.5pt]';

    return (
        <div className={cn("w-[794px] min-h-[1123px] bg-white text-black font-sans leading-snug p-10 mx-auto shadow-md box-border flex flex-col gap-6", textClass)}>

            {/* Header: Personal Info with Avatar */}
            {personalInfo && (
                <div className="flex flex-row items-center gap-8 mb-4 border-b pb-6" style={{ borderBottomColor: primaryColor }}>

                    {/* Avatar */}
                    <div
                        className="w-32 h-32 rounded-full overflow-hidden shrink-0 border-4 shadow-sm"
                        style={{ borderColor: primaryColor }}
                    >
                        {personalInfo.profileImage ? (
                            <img
                                src={personalInfo.profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                No Image
                            </div>
                        )}
                    </div>

                    {/* Contact details */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                            {personalInfo.fullName || 'Your Name'}
                        </h1>
                        {personalInfo.title && (
                            <p className="text-xl mt-1 font-medium" style={{ color: primaryColor }}>{personalInfo.title}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-[0.9em] text-gray-600">
                            {personalInfo.email && (
                                <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                                    <Mail className="h-3.5 w-3.5" /> <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                                </div>
                            )}
                            {personalInfo.phone && (
                                <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                                    <Phone className="h-3.5 w-3.5" /> <a href={`tel:${personalInfo.phone}`}>{personalInfo.phone}</a>
                                </div>
                            )}
                            {personalInfo.location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5" /> {personalInfo.location}
                                </div>
                            )}
                            {personalInfo.linkedin && (
                                <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                                    <Linkedin className="h-3.5 w-3.5" /> <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a>
                                </div>
                            )}
                            {personalInfo.website && (
                                <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                                    <Globe className="h-3.5 w-3.5" /> <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer">{personalInfo.website.replace(/^https?:\/\//, '')}</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Summary */}
            {personalInfo?.summary && (
                <div className={spacingClass}>
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-gray-900">Profile</h2>
                    <div
                        className="text-[0.95em] text-gray-700 leading-relaxed text-justify"
                        dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
                    />
                </div>
            )}

            <div className="flex flex-row gap-8">
                {/* Left Column (Main Content) */}
                <div className="flex-[2] flex flex-col gap-6">
                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 text-gray-900">Experience</h2>
                            <div className="space-y-5">
                                {experience.map(exp => (
                                    <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: primaryColor }}>
                                        <div className="absolute w-2.5 h-2.5 bg-white border-2 rounded-full -left-[6px] top-1.5" style={{ borderColor: primaryColor }} />

                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-[1.1em] text-gray-900">{exp.position}</h3>
                                            <span className="font-medium text-[0.85em] text-gray-500 whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded-sm">
                                                {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                            </span>
                                        </div>
                                        <div className="font-semibold text-[0.95em] mb-1.5" style={{ color: primaryColor }}>{exp.company}</div>

                                        {exp.description && (
                                            <div className="mb-2 text-[0.95em] text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: exp.description }} />
                                        )}

                                        {exp.bullets && exp.bullets.length > 0 && (
                                            <ul className="list-disc pl-5 mt-1 space-y-1 text-[0.95em] text-gray-700 marker:text-gray-400">
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
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 text-gray-900">Projects</h2>
                            <div className="space-y-4">
                                {projects.map(proj => (
                                    <div key={proj.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="flex items-baseline justify-between mb-1.5">
                                            <h3 className="font-bold text-[1.05em] text-gray-900">{proj.name}</h3>
                                            {proj.url && (
                                                <a href={proj.url} className="text-[0.85em] text-blue-600 hover:underline">{proj.url.replace(/^https?:\/\//, '')}</a>
                                            )}
                                        </div>
                                        {proj.technologies && proj.technologies.length > 0 && (
                                            <div className="text-[0.85em] font-medium text-gray-600 mb-2">
                                                <span className="font-semibold text-gray-800">Stack:</span> {proj.technologies.join(' • ')}
                                            </div>
                                        )}
                                        {proj.description && (
                                            <div className="mb-2 text-[0.95em] text-gray-700" dangerouslySetInnerHTML={{ __html: proj.description }} />
                                        )}
                                        {proj.bullets && proj.bullets.length > 0 && (
                                            <ul className="list-disc pl-4 space-y-1 text-[0.9em] text-gray-700">
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

                {/* Right Column (Sidebar equivalent) */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-gray-900">Skills</h2>
                            <div className="space-y-4">
                                {skills.map(skill => (
                                    <div key={skill.id}>
                                        <div className="font-bold text-[0.9em] text-gray-800 mb-1.5 uppercase tracking-wide">{skill.category}</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {skill.items.map((item, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[0.85em] rounded-md font-medium">
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
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-gray-900">Education</h2>
                            <div className="space-y-4">
                                {education.map(edu => (
                                    <div key={edu.id} className="relative">
                                        <h3 className="font-bold text-[1em] text-gray-900 leading-tight mb-0.5">{edu.degree} in {edu.field}</h3>
                                        <div className="font-medium text-[0.9em]" style={{ color: primaryColor }}>{edu.institution}</div>
                                        <div className="font-medium text-[0.85em] text-gray-500 mt-1">
                                            {edu.startDate} – {edu.endDate || 'Present'}
                                        </div>
                                        {edu.gpa && <div className="text-[0.85em] text-gray-600 mt-0.5"><span className="font-semibold">GPA:</span> {edu.gpa}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-gray-900">Certifications</h2>
                            <div className="space-y-3">
                                {certifications.map(cert => (
                                    <div key={cert.id}>
                                        <div className="font-bold text-[0.95em] text-gray-900">{cert.name}</div>
                                        <div className="text-[0.85em] text-gray-600">{cert.issuer}</div>
                                        <div className="text-[0.8em] text-gray-500 mt-0.5">{cert.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-gray-900">Languages</h2>
                            <div className="space-y-1.5">
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
            </div>

        </div>
    );
}
