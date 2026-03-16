import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github, GraduationCap, Briefcase, Code2, Award, Languages, Star } from 'lucide-react';

interface FresherTemplateProps {
    resume: Resume;
}

export function FresherTemplate({ resume }: FresherTemplateProps) {
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

    const primaryColor = settings?.colors?.primary || '#6c63ff';

    // Derive a complementary second color for gradient
    const secondaryColor = '#f857a6';

    const spacingClass =
        settings?.spacing === 'compact' ? 'mb-4' :
            settings?.spacing === 'relaxed' ? 'mb-10' :
                'mb-7';

    const textClass =
        settings?.fontSize === 'small' ? 'text-[8.5pt]' :
            settings?.fontSize === 'large' ? 'text-[11pt]' :
                'text-[9.5pt]';

    const gradientBg = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
    const softGradientBg = `linear-gradient(135deg, ${primaryColor}12 0%, ${secondaryColor}12 100%)`;
    const pillBg = `linear-gradient(135deg, ${primaryColor}22 0%, ${secondaryColor}22 100%)`;

    return (
        <div
            className={cn("w-[794px]  bg-white box-border mx-auto  flex flex-col overflow-hidden", textClass)}
            style={{ fontFamily: "'Nunito', 'Trebuchet MS', sans-serif" }}
        >
            {/* ═══════════════════════════════════════
                HEADER — bold gradient color block
            ═══════════════════════════════════════ */}
            {personalInfo && (
                <div style={{ background: gradientBg, padding: '42px 48px 36px', position: 'relative', overflow: 'hidden' }}>

                    {/* Decorative circles in background */}
                    <div style={{
                        position: 'absolute', top: '-40px', right: '-40px',
                        width: '180px', height: '180px', borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.08)'
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-30px', right: '120px',
                        width: '100px', height: '100px', borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.06)'
                    }} />
                    <div style={{
                        position: 'absolute', top: '20px', right: '200px',
                        width: '60px', height: '60px', borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.05)'
                    }} />

                    {/* Name + title */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            display: 'inline-block',
                            backgroundColor: 'rgba(255,255,255,0.18)',
                            borderRadius: '20px',
                            padding: '3px 14px',
                            fontSize: '0.65em',
                            fontWeight: '800',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.9)',
                            marginBottom: '12px'
                        }}>
                            ✦ Fresh Graduate
                        </div>

                        <h1 style={{
                            fontSize: '3.2em',
                            fontWeight: '900',
                            color: '#ffffff',
                            lineHeight: 1.05,
                            letterSpacing: '-0.01em',
                            marginBottom: '8px',
                            textShadow: '0 2px 12px rgba(0,0,0,0.15)'
                        }}>
                            {personalInfo.fullName || 'Your Name'}
                        </h1>

                        {personalInfo.title && (
                            <p style={{
                                fontSize: '1.1em',
                                fontWeight: '600',
                                color: 'rgba(255,255,255,0.85)',
                                letterSpacing: '0.04em',
                                marginBottom: '20px'
                            }}>
                                {personalInfo.title}
                            </p>
                        )}

                        {/* Contact pills row */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                            {personalInfo.email && (
                                <ContactPill href={`mailto:${personalInfo.email}`} icon={<Mail style={{ width: 10, height: 10 }} />}>
                                    {personalInfo.email}
                                </ContactPill>
                            )}
                            {personalInfo.phone && (
                                <ContactPill href={`tel:${personalInfo.phone}`} icon={<Phone style={{ width: 10, height: 10 }} />}>
                                    {personalInfo.phone}
                                </ContactPill>
                            )}
                            {personalInfo.location && (
                                <ContactPill icon={<MapPin style={{ width: 10, height: 10 }} />}>
                                    {personalInfo.location}
                                </ContactPill>
                            )}
                            {personalInfo.website && (
                                <ContactPill href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} icon={<Globe style={{ width: 10, height: 10 }} />}>
                                    {personalInfo.website.replace(/^https?:\/\//, '')}
                                </ContactPill>
                            )}
                            {personalInfo.linkedin && (
                                <ContactPill href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} icon={<Linkedin style={{ width: 10, height: 10 }} />}>
                                    {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                                </ContactPill>
                            )}
                            {personalInfo.github && (
                                <ContactPill href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} icon={<Github style={{ width: 10, height: 10 }} />}>
                                    {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                                </ContactPill>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Summary band — soft gradient bg */}
            {personalInfo?.summary && (
                <div style={{
                    background: softGradientBg,
                    borderBottom: `1px solid ${primaryColor}20`,
                    padding: '16px 48px',
                    fontSize: '0.92em',
                    color: '#374151',
                    lineHeight: '1.75',
                    fontWeight: '500'
                }}
                    dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
                />
            )}

            {/* ═══════════════════════════════════════
                BODY — asymmetric 2-col
            ═══════════════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', flex: 1, alignItems: 'start' }}>

                {/* LEFT — main content */}
                <div style={{ padding: '28px 32px 28px 48px', borderRight: `2px dashed ${primaryColor}25` }}>

                    {/* Education — prominent for freshers */}
                    {education && education.length > 0 && (
                        <SectionBlock
                            title="Education"
                            icon={<GraduationCap style={{ width: 14, height: 14 }} />}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                            gapClass={spacingClass}
                        >
                            {education.map(edu => (
                                <div key={edu.id} style={{
                                    padding: '14px 18px',
                                    borderRadius: '14px',
                                    background: softGradientBg,
                                    border: `1.5px solid ${primaryColor}20`,
                                    marginBottom: '12px',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {/* Accent strip */}
                                    <div style={{
                                        position: 'absolute', left: 0, top: 0, bottom: 0,
                                        width: '4px', background: gradientBg, borderRadius: '14px 0 0 14px'
                                    }} />
                                    <div style={{ paddingLeft: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h3 style={{ fontSize: '0.97em', fontWeight: '800', color: '#111827', lineHeight: 1.3 }}>
                                                {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                                            </h3>
                                            <span style={{
                                                fontSize: '0.7em', fontWeight: '700',
                                                color: primaryColor,
                                                backgroundColor: `${primaryColor}15`,
                                                padding: '2px 8px', borderRadius: '20px',
                                                whiteSpace: 'nowrap', marginLeft: '10px'
                                            }}>
                                                {edu.startDate} – {edu.endDate || 'Expected'}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.85em', fontWeight: '700', color: primaryColor, marginTop: '3px' }}>
                                            {edu.institution}
                                        </div>
                                        {edu.gpa && (
                                            <div style={{
                                                marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                fontSize: '0.75em', fontWeight: '700',
                                                color: '#6b7280', backgroundColor: 'white',
                                                padding: '2px 8px', borderRadius: '20px',
                                                border: `1px solid ${primaryColor}30`
                                            }}>
                                                <Star style={{ width: 9, height: 9, color: primaryColor }} />
                                                GPA {edu.gpa}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </SectionBlock>
                    )}

                    {/* Projects — key for freshers */}
                    {projects && projects.length > 0 && (
                        <SectionBlock
                            title="Projects"
                            icon={<Code2 style={{ width: 14, height: 14 }} />}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                            gapClass={spacingClass}
                        >
                            {projects.map(proj => (
                                <div key={proj.id} style={{
                                    borderRadius: '14px',
                                    border: `1.5px solid ${primaryColor}20`,
                                    overflow: 'hidden',
                                    marginBottom: '12px',
                                    backgroundColor: '#fafafa'
                                }}>
                                    {/* Project card header */}
                                    <div style={{
                                        background: pillBg,
                                        padding: '10px 16px',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <h3 style={{ fontSize: '0.95em', fontWeight: '800', color: '#111827' }}>
                                            {proj.name}
                                        </h3>
                                        {proj.url && (
                                            <a href={proj.url} style={{
                                                fontSize: '0.7em', fontWeight: '700',
                                                color: 'white', background: gradientBg,
                                                padding: '2px 10px', borderRadius: '20px',
                                                textDecoration: 'none', whiteSpace: 'nowrap'
                                            }}>
                                                View ↗
                                            </a>
                                        )}
                                    </div>
                                    <div style={{ padding: '10px 16px 12px' }}>
                                        {proj.description && (
                                            <div style={{ fontSize: '0.87em', color: '#4b5563', lineHeight: '1.65', marginBottom: '8px' }}
                                                dangerouslySetInnerHTML={{ __html: proj.description }}
                                            />
                                        )}
                                        {proj.bullets && proj.bullets.length > 0 && (
                                            <ul style={{ margin: 0, padding: 0, listStyle: 'none', marginBottom: '8px' }}>
                                                {proj.bullets.map((b, i) => (
                                                    <li key={i} style={{
                                                        display: 'flex', gap: '7px',
                                                        fontSize: '0.85em', color: '#4b5563',
                                                        lineHeight: '1.6', marginBottom: '3px'
                                                    }}>
                                                        <span style={{
                                                            marginTop: '5px', width: '6px', height: '6px',
                                                            borderRadius: '50%', background: gradientBg, flexShrink: 0
                                                        }} />
                                                        {b}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {proj.technologies && proj.technologies.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
                                                {proj.technologies.map((tech, i) => (
                                                    <span key={i} style={{
                                                        fontSize: '0.72em', fontWeight: '800',
                                                        color: primaryColor,
                                                        backgroundColor: `${primaryColor}12`,
                                                        border: `1px solid ${primaryColor}25`,
                                                        padding: '2px 8px', borderRadius: '20px'
                                                    }}>
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </SectionBlock>
                    )}

                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <SectionBlock
                            title="Experience"
                            icon={<Briefcase style={{ width: 14, height: 14 }} />}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                            gapClass={spacingClass}
                        >
                            {experience.map(exp => (
                                <div key={exp.id} style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                                        <h3 style={{ fontSize: '0.97em', fontWeight: '800', color: '#111827' }}>
                                            {exp.position}
                                        </h3>
                                        <span style={{
                                            fontSize: '0.7em', fontWeight: '700',
                                            color: primaryColor, backgroundColor: `${primaryColor}15`,
                                            padding: '2px 8px', borderRadius: '20px',
                                            whiteSpace: 'nowrap', marginLeft: '10px'
                                        }}>
                                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.85em', fontWeight: '700', color: primaryColor, marginBottom: '6px' }}>
                                        {exp.company}
                                    </div>
                                    {exp.description && (
                                        <div style={{ fontSize: '0.87em', color: '#4b5563', lineHeight: '1.65', marginBottom: '6px' }}
                                            dangerouslySetInnerHTML={{ __html: exp.description }}
                                        />
                                    )}
                                    {exp.bullets && exp.bullets.length > 0 && (
                                        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                                            {exp.bullets.map((b, i) => (
                                                <li key={i} style={{
                                                    display: 'flex', gap: '7px',
                                                    fontSize: '0.87em', color: '#4b5563',
                                                    lineHeight: '1.6', marginBottom: '4px'
                                                }}>
                                                    <span style={{
                                                        marginTop: '5px', width: '6px', height: '6px',
                                                        borderRadius: '50%', background: gradientBg, flexShrink: 0
                                                    }} />
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <div style={{ height: '1px', background: `linear-gradient(90deg, ${primaryColor}30, transparent)`, marginTop: '12px' }} />
                                </div>
                            ))}
                        </SectionBlock>
                    )}
                </div>

                {/* RIGHT SIDEBAR */}
                <div style={{ padding: '28px 28px 28px 22px' }}>

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <RightSectionBlock
                            title="Skills"
                            icon={<Code2 style={{ width: 12, height: 12 }} />}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                            gapClass={spacingClass}
                        >
                            {skills.map(skill => (
                                <div key={skill.id} style={{ marginBottom: '10px' }}>
                                    <div style={{
                                        fontSize: '0.68em', fontWeight: '800',
                                        letterSpacing: '0.12em', textTransform: 'uppercase',
                                        color: primaryColor, marginBottom: '5px'
                                    }}>
                                        {skill.category}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                        {skill.items.map((item, i) => (
                                            <span key={i} style={{
                                                fontSize: '0.78em', fontWeight: '700',
                                                color: '#374151',
                                                backgroundColor: 'white',
                                                border: `1.5px solid ${primaryColor}30`,
                                                padding: '2px 7px', borderRadius: '20px',
                                                boxShadow: `0 1px 3px ${primaryColor}15`
                                            }}>
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </RightSectionBlock>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <RightSectionBlock
                            title="Certifications"
                            icon={<Award style={{ width: 12, height: 12 }} />}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                            gapClass={spacingClass}
                        >
                            {certifications.map(cert => (
                                <div key={cert.id} style={{
                                    padding: '10px 12px',
                                    borderRadius: '10px',
                                    background: softGradientBg,
                                    border: `1px solid ${primaryColor}20`,
                                    marginBottom: '8px'
                                }}>
                                    <h3 style={{ fontSize: '0.82em', fontWeight: '800', color: '#111827', lineHeight: 1.35 }}>{cert.name}</h3>
                                    <div style={{ fontSize: '0.75em', color: '#6b7280', marginTop: '2px' }}>{cert.issuer}</div>
                                    <div style={{
                                        marginTop: '4px', fontSize: '0.68em', fontWeight: '700',
                                        color: primaryColor, display: 'inline-block',
                                        backgroundColor: `${primaryColor}12`,
                                        padding: '1px 6px', borderRadius: '20px'
                                    }}>
                                        {cert.date}
                                    </div>
                                </div>
                            ))}
                        </RightSectionBlock>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <RightSectionBlock
                            title="Languages"
                            icon={<Languages style={{ width: 12, height: 12 }} />}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                            gapClass={spacingClass}
                        >
                            {languages.map(lang => (
                                <div key={lang.id} style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', marginBottom: '7px',
                                    padding: '5px 10px', borderRadius: '20px',
                                    backgroundColor: `${primaryColor}08`,
                                    border: `1px solid ${primaryColor}18`
                                }}>
                                    <span style={{ fontSize: '0.85em', fontWeight: '700', color: '#111827' }}>{lang.language}</span>
                                    <span style={{
                                        fontSize: '0.68em', fontWeight: '800',
                                        color: 'white', background: gradientBg,
                                        padding: '1px 7px', borderRadius: '20px'
                                    }}>
                                        {lang.proficiency}
                                    </span>
                                </div>
                            ))}
                        </RightSectionBlock>
                    )}
                </div>
            </div>

            {/* Footer gradient strip */}
            <div style={{ height: '5px', background: gradientBg, marginTop: 'auto' }} />
        </div>
    );
}

/* ── Contact pill for header ── */
function ContactPill({ children, href, icon }: { children: React.ReactNode; href?: string; icon?: React.ReactNode }) {
    const style: React.CSSProperties = {
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        backgroundColor: 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '20px',
        padding: '4px 10px',
        fontSize: '0.76em', fontWeight: '700',
        color: 'rgba(255,255,255,0.95)',
        textDecoration: 'none',
        whiteSpace: 'nowrap'
    };
    return href
        ? <a href={href} style={style}>{icon}{children}</a>
        : <span style={style}>{icon}{children}</span>;
}

/* ── Left column section ── */
function SectionBlock({ title, icon, children, primaryColor, secondaryColor, gapClass }: {
    title: string; icon: React.ReactNode; children: React.ReactNode;
    primaryColor: string; secondaryColor: string; gapClass: string;
}) {
    return (
        <div className={gapClass} style={{ marginBottom: '24px' }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '14px'
            }}>
                <div style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', flexShrink: 0
                }}>
                    {icon}
                </div>
                <h2 style={{
                    fontSize: '0.82em', fontWeight: '900',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#111827', margin: 0
                }}>
                    {title}
                </h2>
                <div style={{ flex: 1, height: '2px', background: `linear-gradient(90deg, ${primaryColor}40, transparent)`, borderRadius: '2px' }} />
            </div>
            {children}
        </div>
    );
}

/* ── Right sidebar section ── */
function RightSectionBlock({ title, icon, children, primaryColor, secondaryColor, gapClass }: {
    title: string; icon: React.ReactNode; children: React.ReactNode;
    primaryColor: string; secondaryColor: string; gapClass: string;
}) {
    return (
        <div className={gapClass} style={{ marginBottom: '22px' }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                marginBottom: '10px', paddingBottom: '8px',
                borderBottom: `2px solid ${primaryColor}20`
            }}>
                <span style={{ color: primaryColor }}>{icon}</span>
                <h2 style={{
                    fontSize: '0.72em', fontWeight: '900',
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: 0
                }}>
                    {title}
                </h2>
            </div>
            {children}
        </div>
    );
}
