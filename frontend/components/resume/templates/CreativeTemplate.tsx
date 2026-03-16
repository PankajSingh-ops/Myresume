import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface CreativeTemplateProps {
    resume: Resume;
}

export function CreativeTemplate({ resume }: CreativeTemplateProps) {
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

    const accentColor = settings?.colors?.primary || '#0d9488'; // teal-600

    const textClass =
        settings?.fontSize === 'small' ? 'text-[9pt]' :
            settings?.fontSize === 'large' ? 'text-[12pt]' :
                'text-[10.5pt]';

    return (
        <div className={cn("w-[794px]  bg-slate-50 text-slate-800 font-sans flex  box-border", textClass)}>

            {/* Left Thin Accent Column */}
            <div className="w-[8%] items-center flex flex-col py-10" style={{ backgroundColor: accentColor }}>
                <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-xl mb-auto">
                    {personalInfo?.fullName?.charAt(0) || 'M'}
                </div>

                <div className="space-y-6 text-white/80 pb-10">
                    {personalInfo?.website && <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors" title="Website"><Globe className="w-5 h-5 mx-auto" /></a>}
                    {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="block hover:text-white transition-colors" title="Email"><Mail className="w-5 h-5 mx-auto" /></a>}
                    {personalInfo?.phone && <a href={`tel:${personalInfo.phone}`} className="block hover:text-white transition-colors" title="Phone"><Phone className="w-5 h-5 mx-auto" /></a>}
                    {personalInfo?.linkedin && <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors" title="LinkedIn"><Linkedin className="w-5 h-5 mx-auto" /></a>}
                    {personalInfo?.github && <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors" title="GitHub"><Github className="w-5 h-5 mx-auto" /></a>}
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="px-10 py-12 bg-white flex justify-between items-center  z-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight" style={{ color: accentColor }}>
                            {personalInfo?.fullName || 'Your Name'}
                        </h1>
                        <h2 className="text-xl font-medium mt-1 text-slate-500">{personalInfo?.title || 'Professional Title'}</h2>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-[0.85em] font-medium text-slate-500">
                            {personalInfo?.location && <span>{personalInfo.location}</span>}
                            {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600 hover:underline">{personalInfo.email}</a>}
                            {personalInfo?.phone && <a href={`tel:${personalInfo.phone}`} className="hover:text-blue-600 hover:underline">{personalInfo.phone}</a>}
                            {personalInfo?.website && <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.website.replace(/^https?:\/\//, '')}</a>}
                            {personalInfo?.linkedin && <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'in/')}</a>}
                            {personalInfo?.github && <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</a>}
                        </div>
                    </div>
                </div>

                {/* Main */}
                <div className="p-10 grid grid-cols-12 gap-8 flex-1">

                    {/* Main Content col-8 */}
                    <div className="col-span-8 space-y-8">
                        {personalInfo?.summary && (
                            <section>
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-3 text-slate-400">About Me</h3>
                                <div className="text-[0.95em] leading-relaxed font-semibold text-slate-700" dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
                            </section>
                        )}

                        {experience && experience.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-slate-400">Work Experience</h3>
                                <div className="space-y-5">
                                    {experience.map((exp, i) => (
                                        <div key={exp.id} className="relative pl-5 border-l-2" style={{ borderColor: i === 0 ? accentColor : '#cbd5e1' }}>
                                            <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1" style={{ backgroundColor: i === 0 ? accentColor : '#cbd5e1' }}></div>
                                            <div className="flex justify-between items-end mb-1">
                                                <h4 className="font-bold text-[1.1em] text-slate-800">{exp.position}</h4>
                                                <span className="text-[0.8em] font-bold text-slate-400">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                                            </div>
                                            <div className="font-semibold text-[0.9em] mb-2" style={{ color: accentColor }}>{exp.company}</div>
                                            {exp.bullets && exp.bullets.length > 0 && (
                                                <ul className="list-none space-y-1 text-[0.9em] text-slate-600">
                                                    {exp.bullets.map((b, idx) => (
                                                        <li key={idx} className="relative pl-3 before:content-['•'] before:absolute before:left-0 before:text-slate-300">
                                                            {b}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar col-4 */}
                    <div className="col-span-4 space-y-8">
                        {skills && skills.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-slate-400">Expertise</h3>
                                <div className="space-y-4">
                                    {skills.map(skill => (
                                        <div key={skill.id}>
                                            <div className="text-[0.85em] font-bold text-slate-700 mb-1.5">{skill.category}</div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {skill.items.map((item, i) => (
                                                    <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-[0.8em] font-medium text-slate-600 ">{item}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education && education.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-slate-400">Education</h3>
                                <div className="space-y-4">
                                    {education.map(edu => (
                                        <div key={edu.id} className="bg-white p-3 rounded border border-slate-100  border-l-4" style={{ borderLeftColor: accentColor }}>
                                            <div className="font-bold text-[0.9em] text-slate-800">{edu.degree}</div>
                                            <div className="text-[0.8em] font-semibold text-slate-500 mb-1">{edu.field}</div>
                                            <div className="text-[0.8em] text-slate-600">{edu.institution}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {certifications && certifications.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-slate-400">Certifications</h3>
                                <div className="space-y-3">
                                    {certifications.map(cert => (
                                        <div key={cert.id} className="bg-white p-3 rounded border border-slate-100  border-l-4" style={{ borderLeftColor: accentColor }}>
                                            <div className="font-bold text-[0.9em] text-slate-800">{cert.name}</div>
                                            <div className="text-[0.8em] text-slate-500">{cert.issuer}</div>
                                            <div className="text-[0.75em] text-slate-400 mt-1">{cert.date}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {languages && languages.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-slate-400">Languages</h3>
                                <div className="space-y-2">
                                    {languages.map(lang => (
                                        <div key={lang.id} className="flex justify-between text-[0.85em]">
                                            <span className="font-semibold text-slate-700">{lang.language}</span>
                                            <span className="text-slate-400 capitalize">{lang.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
