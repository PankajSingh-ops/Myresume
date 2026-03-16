import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface ManagementTemplateProps {
    resume: Resume;
}

export function ManagementTemplate({ resume }: ManagementTemplateProps) {
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

    const accentColor = settings?.colors?.primary || '#0f2a4a'; // deep navy

    // Derive lighter tint from accent
    const accentLight = accentColor + '18';
    const accentMid = accentColor + '40';
    const gold = '#c9a84c';
    const ivory = '#fdfaf5';
    const inkDark = '#0d1117';
    const inkMid = '#374151';
    const inkLight = '#6b7280';

    const gap =
        settings?.spacing === 'compact' ? 14 :
            settings?.spacing === 'relaxed' ? 26 :
                19;

    const textClass =
        settings?.fontSize === 'small' ? 'text-[8.5pt]' :
            settings?.fontSize === 'large' ? 'text-[11pt]' :
                'text-[9.5pt]';

    /* ── Section heading used in main column ── */
    const MainSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div style={{ marginBottom: `${gap}px` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: `${gap * 0.5}px` }}>
                <h2 style={{
                    fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
                    fontSize: '0.85em',
                    fontWeight: '700',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: accentColor,
                    margin: 0,
                    whiteSpace: 'nowrap',
                }}>
                    {title}
                </h2>
                {/* rule + diamond */}
                <div style={{ flex: 1, height: '1px', backgroundColor: accentColor, opacity: 0.25 }} />
                <div style={{
                    width: '6px', height: '6px',
                    transform: 'rotate(45deg)',
                    backgroundColor: gold,
                    flexShrink: 0,
                }} />
                <div style={{ width: '28px', height: '1px', backgroundColor: accentColor, opacity: 0.25 }} />
            </div>
            {children}
        </div>
    );

    /* ── Section heading used in sidebar ── */
    const SideSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div style={{ marginBottom: `${gap + 2}px` }}>
            <div style={{ marginBottom: `${gap * 0.5}px` }}>
                <h2 style={{
                    fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
                    fontSize: '0.68em',
                    fontWeight: '700',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: gold,
                    margin: 0,
                    marginBottom: '5px',
                }}>
                    {title}
                </h2>
                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
            </div>
            {children}
        </div>
    );

    return (
        <div
            className={cn('w-[794px]  box-border mx-auto shadow-2xl flex flex-col', textClass)}
            style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", backgroundColor: ivory }}
        >

            {/* ══════════════════════════════════════════
                TOP GOLD BAND
            ══════════════════════════════════════════ */}
            <div style={{ height: '4px', backgroundColor: gold }} />

            {/* ══════════════════════════════════════════
                HEADER  — full-width, ivory bg
            ══════════════════════════════════════════ */}
            {personalInfo && (
                <div style={{
                    padding: '30px 44px 24px',
                    borderBottom: `1px solid ${accentMid}`,
                    backgroundColor: ivory,
                }}>
                    {/* Name + title row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h1 style={{
                                fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
                                fontSize: '3.1em',
                                fontWeight: '400',
                                letterSpacing: '0.08em',
                                color: inkDark,
                                lineHeight: 1,
                                margin: 0,
                                marginBottom: '6px',
                            }}>
                                {personalInfo.fullName || 'Your Name'}
                            </h1>
                            {personalInfo.title && (
                                <p style={{
                                    fontSize: '0.95em',
                                    fontWeight: '400',
                                    fontStyle: 'italic',
                                    color: accentColor,
                                    margin: 0,
                                    letterSpacing: '0.06em',
                                }}>
                                    {personalInfo.title}
                                </p>
                            )}
                        </div>

                        {/* Contact stack — right-aligned */}
                        <div style={{ textAlign: 'right', fontSize: '0.8em', color: inkMid, lineHeight: '1.8' }}>
                            {personalInfo.email && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '5px' }}>
                                    <a href={`mailto:${personalInfo.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{personalInfo.email}</a>
                                    <Mail style={{ width: 10, height: 10, color: gold }} />
                                </div>
                            )}
                            {personalInfo.phone && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '5px' }}>
                                    <a href={`tel:${personalInfo.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{personalInfo.phone}</a>
                                    <Phone style={{ width: 10, height: 10, color: gold }} />
                                </div>
                            )}
                            {personalInfo.location && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '5px' }}>
                                    {personalInfo.location}
                                    <MapPin style={{ width: 10, height: 10, color: gold }} />
                                </div>
                            )}
                            {personalInfo.linkedin && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '5px' }}>
                                    <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, textDecoration: 'none' }}>
                                        {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                                    </a>
                                    <Linkedin style={{ width: 10, height: 10, color: gold }} />
                                </div>
                            )}
                            {personalInfo.github && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '5px' }}>
                                    <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, textDecoration: 'none' }}>
                                        {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                                    </a>
                                    <Github style={{ width: 10, height: 10, color: gold }} />
                                </div>
                            )}
                            {personalInfo.website && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '5px' }}>
                                    <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, textDecoration: 'none' }}>
                                        {personalInfo.website.replace(/^https?:\/\//, '')}
                                    </a>
                                    <Globe style={{ width: 10, height: 10, color: gold }} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Gold rule */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0 12px' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: gold, opacity: 0.5 }} />
                        <div style={{ width: '5px', height: '5px', transform: 'rotate(45deg)', backgroundColor: gold }} />
                        <div style={{ flex: 1, height: '1px', backgroundColor: gold, opacity: 0.5 }} />
                    </div>

                    {/* Executive Summary */}
                    {personalInfo.summary && (
                        <div
                            style={{
                                fontSize: '0.93em',
                                color: inkMid,
                                lineHeight: '1.75',
                                fontStyle: 'italic',
                                textAlign: 'justify',
                                letterSpacing: '0.01em',
                            }}
                            dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
                        />
                    )}
                </div>
            )}

            {/* ══════════════════════════════════════════
                BODY — navy sidebar LEFT + main RIGHT
            ══════════════════════════════════════════ */}
            <div style={{ display: 'flex', flex: 1 }}>

                {/* ── LEFT SIDEBAR ── */}
                <div style={{
                    width: '218px',
                    flexShrink: 0,
                    backgroundColor: accentColor,
                    padding: '28px 22px',
                    color: 'rgba(255,255,255,0.88)',
                }}>

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <SideSection title="Core Competencies">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {skills.map(skill => (
                                    <div key={skill.id}>
                                        <div style={{
                                            fontSize: '0.72em',
                                            fontStyle: 'italic',
                                            color: 'rgba(255,255,255,0.55)',
                                            marginBottom: '4px',
                                            letterSpacing: '0.05em',
                                        }}>
                                            {skill.category}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {skill.items.map((item, i) => (
                                                <span key={i} style={{
                                                    fontSize: '0.79em',
                                                    color: 'rgba(255,255,255,0.9)',
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                    border: '1px solid rgba(255,255,255,0.15)',
                                                    padding: '2px 7px',
                                                    borderRadius: '2px',
                                                    lineHeight: '1.5',
                                                }}>
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SideSection>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <SideSection title="Education">
                            {education.map(edu => (
                                <div key={edu.id} style={{ marginBottom: '14px' }}>
                                    <div style={{
                                        fontSize: '0.88em',
                                        fontWeight: '700',
                                        color: 'rgba(255,255,255,0.95)',
                                        lineHeight: '1.35',
                                        marginBottom: '2px',
                                    }}>
                                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                                    </div>
                                    <div style={{ fontSize: '0.82em', color: gold, fontStyle: 'italic' }}>
                                        {edu.institution}
                                    </div>
                                    <div style={{ fontSize: '0.75em', color: 'rgba(255,255,255,0.45)', marginTop: '2px', letterSpacing: '0.06em' }}>
                                        {edu.startDate} – {edu.endDate || 'Expected'}
                                    </div>
                                    {edu.gpa && (
                                        <div style={{
                                            fontSize: '0.72em',
                                            color: 'rgba(255,255,255,0.5)',
                                            marginTop: '2px',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            display: 'inline-block',
                                            padding: '1px 6px',
                                            borderRadius: '2px',
                                        }}>
                                            GPA {edu.gpa}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </SideSection>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <SideSection title="Certifications">
                            {certifications.map(cert => (
                                <div key={cert.id} style={{ marginBottom: '10px' }}>
                                    <div style={{ fontSize: '0.85em', fontWeight: '700', color: 'rgba(255,255,255,0.92)', lineHeight: '1.35' }}>
                                        {cert.name}
                                    </div>
                                    <div style={{ fontSize: '0.77em', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>{cert.issuer}</div>
                                    <div style={{ fontSize: '0.72em', color: gold, marginTop: '2px' }}>{cert.date}</div>
                                </div>
                            ))}
                        </SideSection>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <SideSection title="Languages">
                            {languages.map(lang => (
                                <div key={lang.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    marginBottom: '7px',
                                    paddingBottom: '7px',
                                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                                }}>
                                    <span style={{ fontSize: '0.87em', color: 'rgba(255,255,255,0.88)', fontWeight: '600' }}>{lang.language}</span>
                                    <span style={{ fontSize: '0.72em', color: gold, fontStyle: 'italic' }}>{lang.proficiency}</span>
                                </div>
                            ))}
                        </SideSection>
                    )}
                </div>

                {/* ── MAIN CONTENT ── */}
                <div style={{ flex: 1, padding: '28px 36px 28px 32px', backgroundColor: ivory }}>

                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <MainSection title="Professional Experience">
                            {experience.map((exp, idx) => (
                                <div key={exp.id} style={{ marginBottom: idx < experience.length - 1 ? `${gap + 4}px` : 0 }}>

                                    {/* Role header */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '2px',
                                    }}>
                                        <div>
                                            <h3 style={{
                                                fontSize: '1.02em',
                                                fontWeight: '700',
                                                color: inkDark,
                                                margin: 0,
                                                letterSpacing: '0.02em',
                                            }}>
                                                {exp.position}
                                            </h3>
                                            <div style={{
                                                fontSize: '0.88em',
                                                fontStyle: 'italic',
                                                color: accentColor,
                                                marginTop: '1px',
                                                fontWeight: '600',
                                            }}>
                                                {exp.company}
                                            </div>
                                        </div>
                                        <div style={{
                                            textAlign: 'right',
                                            flexShrink: 0,
                                            marginLeft: '14px',
                                        }}>
                                            <div style={{
                                                fontSize: '0.78em',
                                                fontWeight: '700',
                                                color: 'white',
                                                backgroundColor: accentColor,
                                                padding: '2px 10px',
                                                borderRadius: '2px',
                                                whiteSpace: 'nowrap',
                                                letterSpacing: '0.04em',
                                            }}>
                                                {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thin separator */}
                                    <div style={{ height: '1px', backgroundColor: accentColor, opacity: 0.1, margin: '7px 0' }} />

                                    {/* Description */}
                                    {exp.description && (
                                        <div
                                            style={{ fontSize: '0.9em', color: inkMid, lineHeight: '1.65', marginBottom: '6px', fontStyle: 'italic' }}
                                            dangerouslySetInnerHTML={{ __html: exp.description }}
                                        />
                                    )}

                                    {/* Bullets */}
                                    {exp.bullets && exp.bullets.length > 0 && (
                                        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                                            {exp.bullets.map((b, i) => (
                                                <li key={i} style={{
                                                    display: 'flex',
                                                    gap: '9px',
                                                    fontSize: '0.9em',
                                                    color: inkMid,
                                                    lineHeight: '1.6',
                                                    marginBottom: '4px',
                                                }}>
                                                    <span style={{
                                                        color: gold,
                                                        flexShrink: 0,
                                                        marginTop: '4px',
                                                        width: '5px',
                                                        height: '5px',
                                                        transform: 'rotate(45deg)',
                                                        backgroundColor: gold,
                                                        display: 'inline-block',
                                                    }} />
                                                    <span>{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Row separator between jobs */}
                                    {idx < experience.length - 1 && (
                                        <div style={{
                                            marginTop: `${gap * 0.7}px`,
                                            height: '1px',
                                            background: `linear-gradient(90deg, ${accentColor}30, transparent)`,
                                        }} />
                                    )}
                                </div>
                            ))}
                        </MainSection>
                    )}

                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <MainSection title="Key Initiatives & Projects">
                            {projects.map((proj, idx) => (
                                <div key={proj.id} style={{
                                    marginBottom: idx < projects.length - 1 ? `${gap * 0.85}px` : 0,
                                    padding: '12px 16px',
                                    borderLeft: `3px solid ${gold}`,
                                    backgroundColor: accentLight,
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                        <h3 style={{ fontSize: '0.97em', fontWeight: '700', color: inkDark, margin: 0 }}>
                                            {proj.name}
                                        </h3>
                                        {proj.url && (
                                            <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{
                                                fontSize: '0.78em',
                                                color: accentColor,
                                                fontStyle: 'italic',
                                                textDecoration: 'none',
                                                marginLeft: '10px',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {proj.url.replace(/^https?:\/\/(www\.)?/, '')} ↗
                                            </a>
                                        )}
                                    </div>
                                    {proj.description && (
                                        <div
                                            style={{ fontSize: '0.88em', color: inkMid, lineHeight: '1.6', marginBottom: '5px' }}
                                            dangerouslySetInnerHTML={{ __html: proj.description }}
                                        />
                                    )}
                                    {proj.bullets && proj.bullets.length > 0 && (
                                        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                                            {proj.bullets.map((b, i) => (
                                                <li key={i} style={{
                                                    display: 'flex', gap: '8px',
                                                    fontSize: '0.87em', color: inkMid,
                                                    lineHeight: '1.55', marginBottom: '3px',
                                                }}>
                                                    <span style={{ color: gold, flexShrink: 0 }}>›</span>
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {proj.technologies && proj.technologies.length > 0 && (
                                        <div style={{ marginTop: '7px', fontSize: '0.78em', color: inkLight, fontStyle: 'italic' }}>
                                            {proj.technologies.join('  ·  ')}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </MainSection>
                    )}

                </div>
            </div>

            {/* ══════════════════════════════════════════
                BOTTOM GOLD BAND
            ══════════════════════════════════════════ */}
            <div style={{ height: '4px', backgroundColor: gold }} />
        </div>
    );
}
