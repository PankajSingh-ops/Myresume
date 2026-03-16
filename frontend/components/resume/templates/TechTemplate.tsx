import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github, Code2, Cpu, Layout, Server, Database } from 'lucide-react';

interface TechTemplateProps {
    resume: Resume;
}

export function TechTemplate({ resume }: TechTemplateProps) {
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

    const accentColor = settings?.colors?.primary || '#3b82f6'; // blue-500

    const spacingClass =
        settings?.spacing === 'compact' ? 'space-y-4 mb-4' :
            settings?.spacing === 'relaxed' ? 'space-y-8 mb-8' :
                'space-y-6 mb-6';

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9.5pt]' :
            settings?.fontSize === 'large' ? 'text-[11.5pt]' :
                'text-[10.5pt]';

    return (
        <div className={cn("w-[794px]  bg-[#0d1117] text-[#c9d1d9] font-sans leading-relaxed p-10 mx-auto  box-border", textClass)}>

            {/* Header Area */}
            {personalInfo && (
                <div className="flex flex-col mb-8 border-b border-[#30363d] pb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-4xl font-bold tracking-tight text-[#c9d1d9]">
                                {personalInfo.fullName || 'User Name'}
                            </h1>
                            {personalInfo.title && (
                                <p className="text-xl font-medium" style={{ color: accentColor }}>{personalInfo.title}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5 text-[0.85em] font-medium text-[#8b949e] items-end">
                            {personalInfo.location && <div className="flex items-center gap-2">{personalInfo.location} <MapPin className="h-4 w-4 text-[#8b949e]" /></div>}
                            {personalInfo.email && <div className="flex items-center gap-2"><a href={`mailto:${personalInfo.email}`} className="hover:text-white transition-colors">{personalInfo.email}</a> <Mail className="h-4 w-4 text-[#8b949e]" /></div>}
                            {personalInfo.phone && <div className="flex items-center gap-2"><a href={`tel:${personalInfo.phone}`} className="hover:text-white transition-colors">{personalInfo.phone}</a> <Phone className="h-4 w-4 text-[#8b949e]" /></div>}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-[0.85em] font-medium text-[#8b949e] bg-[#161b22] border border-[#30363d] px-4 py-3 rounded-lg">
                        {personalInfo.github && <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors"><Github className="h-4 w-4" />{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</a>}
                        {personalInfo.website && <span className="text-[#30363d]">|</span>}
                        {personalInfo.website && <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors"><Globe className="h-4 w-4" />{personalInfo.website.replace(/^https?:\/\//, '')}</a>}
                        {personalInfo.linkedin && <span className="text-[#30363d]">|</span>}
                        {personalInfo.linkedin && <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors"><Linkedin className="h-4 w-4" />{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a>}
                    </div>
                </div>
            )}

            {/* Summary */}
            {personalInfo?.summary && (
                <div className={cn("text-[1.05em] text-[#8b949e] leading-relaxed", spacingClass)} dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
            )}

            <div className="grid grid-cols-[1fr_260px] gap-8">
                {/* Main Content Column */}
                <div>
                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-[1.15em] font-bold text-[#c9d1d9] mb-5 flex items-center gap-2 border-b border-[#30363d] pb-2">
                                <Cpu className="h-5 w-5" style={{ color: accentColor }} /> Experience
                            </h2>
                            <div className="space-y-6">
                                {experience.map(exp => (
                                    <div key={exp.id} className="relative">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-semibold text-[1.1em] text-white">{exp.position}</h3>
                                            <span className="text-[0.85em] font-mono text-[#8b949e] bg-[#21262d] px-2 py-0.5 rounded-md border border-[#30363d]">
                                                {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                            </span>
                                        </div>
                                        <div className="font-medium text-[1.05em] mb-2" style={{ color: accentColor }}>{exp.company}</div>

                                        {exp.description && (
                                            <div className="mb-2 text-[0.95em] text-[#8b949e] leading-relaxed" dangerouslySetInnerHTML={{ __html: exp.description }} />
                                        )}

                                        {exp.bullets && exp.bullets.length > 0 && (
                                            <ul className="space-y-1.5 text-[0.95em] text-[#c9d1d9]">
                                                {exp.bullets.map((b, i) => (
                                                    <li key={i} className="flex gap-2 items-start shrink-0">
                                                        <span className="text-[#8b949e] mt-0.5 select-none">›</span>
                                                        <span className="leading-snug">{b}</span>
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
                            <h2 className="text-[1.15em] font-bold text-[#c9d1d9] mb-5 flex items-center gap-2 border-b border-[#30363d] pb-2 mt-4">
                                <Code2 className="h-5 w-5" style={{ color: accentColor }} /> Projects
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {projects.map(proj => (
                                    <div key={proj.id} className="bg-[#0d1117] border border-[#30363d] p-5 rounded-lg hover:border-[#8b949e] transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-[1.1em] text-[#58a6ff] hover:underline cursor-pointer">{proj.name}</h3>
                                            {proj.url && (
                                                <a href={proj.url} className="text-[0.85em] text-[#8b949e] hover:text-[#58a6ff] transition-colors">{proj.url.replace(/^https?:\/\/(www\.)?/, '')}</a>
                                            )}
                                        </div>

                                        {proj.description && (
                                            <div className="mb-3 text-[0.95em] text-[#8b949e] leading-relaxed" dangerouslySetInnerHTML={{ __html: proj.description }} />
                                        )}

                                        {proj.bullets && proj.bullets.length > 0 && (
                                            <ul className="space-y-1.5 text-[0.9em] text-[#c9d1d9] mb-4">
                                                {proj.bullets.map((b, i) => (
                                                    <li key={i} className="flex gap-2 items-start">
                                                        <span className="text-[#30363d] mt-0.5 select-none">›</span>
                                                        <span className="leading-snug">{b}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {proj.technologies && proj.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-auto">
                                                {proj.technologies.map((tech, i) => (
                                                    <span key={i} className="text-[0.75em] font-medium text-[#58a6ff] bg-[#58a6ff]/10 border border-[#58a6ff]/20 px-2 py-0.5 rounded-full">
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
                            <h2 className="text-[1.15em] font-bold text-[#c9d1d9] mb-4 border-b border-[#30363d] pb-2 flex items-center gap-2">
                                <Layout className="h-4 w-4" style={{ color: accentColor }} /> Skills
                            </h2>
                            <div className="space-y-4">
                                {skills.map(skill => (
                                    <div key={skill.id}>
                                        <div className="font-semibold text-[0.9em] text-white mb-2">{skill.category}</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {skill.items.map((item, i) => (
                                                <span key={i} className="text-[0.85em] text-[#c9d1d9] bg-[#21262d] border border-[#30363d] px-2 py-1 rounded-md">
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
                            <h2 className="text-[1.15em] font-bold text-[#c9d1d9] mb-4 border-b border-[#30363d] pb-2 flex items-center gap-2 mt-2">
                                <Database className="h-4 w-4" style={{ color: accentColor }} /> Education
                            </h2>
                            <div className="space-y-4">
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <h3 className="font-semibold text-[0.95em] text-white mb-1 leading-tight">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                                        <div className="text-[0.9em]" style={{ color: accentColor }}>{edu.institution}</div>
                                        <div className="font-mono text-[0.8em] text-[#8b949e] mt-1">
                                            {edu.startDate} – {edu.endDate || 'Expected'}
                                        </div>
                                        {edu.gpa && <div className="text-[0.8em] text-[#8b949e] mt-1">GPA: <span className="text-white">{edu.gpa}</span></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-[1.15em] font-bold text-[#c9d1d9] mb-4 border-b border-[#30363d] pb-2 flex items-center gap-2 mt-2">
                                <Server className="h-4 w-4" style={{ color: accentColor }} /> Certifications
                            </h2>
                            <div className="space-y-3">
                                {certifications.map(cert => (
                                    <div key={cert.id}>
                                        <h3 className="font-medium text-[0.9em] text-white">{cert.name}</h3>
                                        <div className="text-[0.85em] text-[#8b949e]">{cert.issuer}</div>
                                        <div className="font-mono text-[0.75em] text-[#8b949e] mt-0.5">{cert.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <div className={spacingClass}>
                            <h2 className="text-[1.15em] font-bold text-[#c9d1d9] mb-4 border-b border-[#30363d] pb-2 flex items-center gap-2 mt-2">
                                Languages
                            </h2>
                            <div className="space-y-2">
                                {languages.map(lang => (
                                    <div key={lang.id} className="flex justify-between items-center bg-[#161b22] border border-[#30363d] px-3 py-1.5 rounded-md">
                                        <span className="font-medium text-[0.9em] text-[#c9d1d9]">{lang.language}</span>
                                        <span className="font-mono text-[0.75em] text-[#8b949e]">{lang.proficiency}</span>
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
