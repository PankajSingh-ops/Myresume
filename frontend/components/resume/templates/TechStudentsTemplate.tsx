import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface TechStudentTemplateProps {
    resume: Resume;
}

export function TechStudentTemplate({ resume }: TechStudentTemplateProps) {
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

    const accent = settings?.colors?.primary || '#0ea5e9'; // sky blue

    const gap =
        settings?.spacing === 'compact' ? 12 :
            settings?.spacing === 'relaxed' ? 22 :
                16;

    const textClass =
        settings?.fontSize === 'small' ? 'text-[8.5pt]' :
            settings?.fontSize === 'large' ? 'text-[11pt]' :
                'text-[9.5pt]';

    const mono = "'JetBrains Mono', 'Fira Code', 'Consolas', monospace";
    const sans = "'DM Sans', 'Segoe UI', system-ui, sans-serif";

    const accentBg = accent + '12';
    const accentBdr = accent + '35';
    const accentMid = accent + '70';
    const slate50 = '#f8fafc';
    const slate100 = '#f1f5f9';
    const slate200 = '#e2e8f0';
    const slate500 = '#64748b';
    const slate700 = '#334155';
    const slate900 = '#0f172a';

    /* ── Section heading ─────────────────────────── */
    const Section = ({ tag, children, style }: {
        tag: string;
        children: React.ReactNode;
        style?: React.CSSProperties;
    }) => (
        <div style={{ marginBottom: `${gap}px`, ...style }}>
            {/* opening tag label */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: `${gap * 0.55}px`,
            }}>
                <span style={{
                    fontFamily: mono,
                    fontSize: '0.72em',
                    color: accent,
                    fontWeight: '600',
                    userSelect: 'none',
                }}>
                    {'<'}{tag}{'>'}
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: slate200 }} />
            </div>
            {children}
            {/* closing tag label */}
            <div style={{
                marginTop: `${gap * 0.4}px`,
                fontFamily: mono,
                fontSize: '0.65em',
                color: slate200,
                userSelect: 'none',
            }}>
                {'</'}{tag}{'>'}
            </div>
        </div>
    );

    /* ── Skill chip ──────────────────────────────── */
    const Chip = ({ label }: { label: string }) => (
        <span style={{
            fontFamily: mono,
            fontSize: '0.75em',
            fontWeight: '500',
            color: accent,
            backgroundColor: accentBg,
            border: `1px solid ${accentBdr}`,
            padding: '2px 8px',
            borderRadius: '4px',
            display: 'inline-block',
            lineHeight: '1.6',
        }}>
            {label}
        </span>
    );

    /* ── Timeline dot ────────────────────────────── */
    const Dot = () => (
        <div style={{
            width: '8px', height: '8px',
            borderRadius: '50%',
            border: `2px solid ${accent}`,
            backgroundColor: 'white',
            flexShrink: 0,
            marginTop: '5px',
        }} />
    );

    return (
        <div
            className={cn('w-[794px]  bg-white box-border mx-auto', textClass)}
            style={{ fontFamily: sans, color: slate700 }}
        >

            {/* ══════════════════════════════════
                HEADER
            ══════════════════════════════════ */}
            {personalInfo && (
                <div style={{
                    backgroundColor: slate900,
                    padding: '32px 44px 28px',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Subtle grid pattern overlay */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `linear-gradient(${accent}08 1px, transparent 1px), linear-gradient(90deg, ${accent}08 1px, transparent 1px)`,
                        backgroundSize: '28px 28px',
                        pointerEvents: 'none',
                    }} />

                    {/* Accent glow circle */}
                    <div style={{
                        position: 'absolute', top: '-60px', right: '-60px',
                        width: '220px', height: '220px', borderRadius: '50%',
                        background: `radial-gradient(circle, ${accent}25 0%, transparent 70%)`,
                        pointerEvents: 'none',
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        {/* Monospace greeting */}
                        <div style={{
                            fontFamily: mono,
                            fontSize: '0.68em',
                            color: accent,
                            marginBottom: '8px',
                            opacity: 0.85,
                        }}>
                            $ whoami
                        </div>

                        {/* Name */}
                        <h1 style={{
                            fontFamily: sans,
                            fontSize: '2.8em',
                            fontWeight: '800',
                            color: '#ffffff',
                            letterSpacing: '-0.02em',
                            lineHeight: 1,
                            margin: 0,
                            marginBottom: '6px',
                        }}>
                            {personalInfo.fullName || 'Your Name'}
                        </h1>

                        {/* Title */}
                        {personalInfo.title && (
                            <p style={{
                                fontFamily: mono,
                                fontSize: '0.82em',
                                color: accentMid,
                                margin: 0,
                                marginBottom: '18px',
                                letterSpacing: '0.04em',
                            }}>
                                // {personalInfo.title}
                            </p>
                        )}

                        {/* Contact row */}
                        <div style={{
                            display: 'flex', flexWrap: 'wrap',
                            gap: '14px', fontSize: '0.8em',
                            color: 'rgba(255,255,255,0.6)',
                        }}>
                            {personalInfo.email && (
                                <a href={`mailto:${personalInfo.email}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'inherit', textDecoration: 'none' }}>
                                    <Mail style={{ width: 11, height: 11, color: accent }} />{personalInfo.email}
                                </a>
                            )}
                            {personalInfo.phone && (
                                <a href={`tel:${personalInfo.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'inherit', textDecoration: 'none' }}>
                                    <Phone style={{ width: 11, height: 11, color: accent }} />{personalInfo.phone}
                                </a>
                            )}
                            {personalInfo.location && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <MapPin style={{ width: 11, height: 11, color: accent }} />{personalInfo.location}
                                </span>
                            )}
                            {personalInfo.github && (
                                <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: accent, textDecoration: 'none', fontFamily: mono }}>
                                    <Github style={{ width: 11, height: 11 }} />{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                                </a>
                            )}
                            {personalInfo.linkedin && (
                                <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: accent, textDecoration: 'none' }}>
                                    <Linkedin style={{ width: 11, height: 11 }} />{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                                </a>
                            )}
                            {personalInfo.website && (
                                <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: accent, textDecoration: 'none' }}>
                                    <Globe style={{ width: 11, height: 11 }} />{personalInfo.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Summary bar */}
            {personalInfo?.summary && (
                <div style={{
                    backgroundColor: slate50,
                    borderBottom: `1px solid ${slate200}`,
                    borderLeft: `4px solid ${accent}`,
                    padding: '12px 44px 12px 40px',
                    fontSize: '0.9em',
                    color: slate700,
                    lineHeight: '1.7',
                }}
                    dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
                />
            )}

            {/* ══════════════════════════════════
                BODY — 2 columns
            ══════════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 215px', alignItems: 'start' }}>

                {/* ── LEFT: main content ─────────── */}
                <div style={{ padding: `${gap + 6}px 28px ${gap}px 44px`, borderRight: `1px solid ${slate200}` }}>

                    {/* Education */}
                    {education && education.length > 0 && (
                        <Section tag="education">
                            {education.map((edu, idx) => (
                                <div key={edu.id} style={{
                                    display: 'flex', gap: '12px',
                                    marginBottom: idx < education.length - 1 ? `${gap * 0.8}px` : 0,
                                }}>
                                    {/* Timeline line */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Dot />
                                        {idx < education.length - 1 && (
                                            <div style={{ flex: 1, width: '1px', backgroundColor: slate200, minHeight: '20px' }} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1, paddingBottom: '4px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h3 style={{ fontSize: '0.97em', fontWeight: '700', color: slate900, margin: 0 }}>
                                                    {edu.degree}{edu.field ? ` — ${edu.field}` : ''}
                                                </h3>
                                                <div style={{ fontSize: '0.85em', color: accent, fontWeight: '600', marginTop: '1px' }}>
                                                    {edu.institution}
                                                </div>
                                            </div>
                                            <span style={{
                                                fontFamily: mono,
                                                fontSize: '0.72em',
                                                color: slate500,
                                                backgroundColor: slate100,
                                                border: `1px solid ${slate200}`,
                                                padding: '1px 7px',
                                                borderRadius: '4px',
                                                whiteSpace: 'nowrap',
                                                marginLeft: '10px',
                                                marginTop: '1px',
                                            }}>
                                                {edu.startDate} → {edu.endDate || 'Present'}
                                            </span>
                                        </div>
                                        {edu.gpa && (
                                            <div style={{
                                                marginTop: '4px', display: 'inline-flex',
                                                alignItems: 'center', gap: '4px',
                                                fontFamily: mono, fontSize: '0.72em',
                                                color: accent, backgroundColor: accentBg,
                                                border: `1px solid ${accentBdr}`,
                                                padding: '1px 6px', borderRadius: '4px',
                                            }}>
                                                GPA: {edu.gpa}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </Section>
                    )}

                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <Section tag="projects">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {projects.map(proj => (
                                    <div key={proj.id} style={{
                                        border: `1px solid ${slate200}`,
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        backgroundColor: '#fff',
                                    }}>
                                        {/* Card top bar */}
                                        <div style={{
                                            backgroundColor: slate900,
                                            padding: '8px 14px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}>
                                            {/* Traffic light dots */}
                                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff5f57' }} />
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#febc2e' }} />
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#28c840' }} />
                                                <span style={{
                                                    fontFamily: mono, fontSize: '0.72em',
                                                    color: 'rgba(255,255,255,0.5)',
                                                    marginLeft: '8px',
                                                }}>
                                                    {proj.name.toLowerCase().replace(/\s+/g, '-')}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontFamily: mono, fontSize: '0.75em', fontWeight: '700', color: '#fff' }}>
                                                    {proj.name}
                                                </span>
                                                {proj.url && (
                                                    <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{
                                                        fontFamily: mono, fontSize: '0.68em',
                                                        color: accent, textDecoration: 'none',
                                                    }}>
                                                        [link ↗]
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card body */}
                                        <div style={{ padding: '10px 14px 12px' }}>
                                            {proj.description && (
                                                <div
                                                    style={{ fontSize: '0.88em', color: slate700, lineHeight: '1.65', marginBottom: '7px' }}
                                                    dangerouslySetInnerHTML={{ __html: proj.description }}
                                                />
                                            )}
                                            {proj.bullets && proj.bullets.length > 0 && (
                                                <ul style={{ margin: 0, padding: 0, listStyle: 'none', marginBottom: '8px' }}>
                                                    {proj.bullets.map((b, i) => (
                                                        <li key={i} style={{
                                                            display: 'flex', gap: '7px',
                                                            fontSize: '0.87em', color: slate700,
                                                            lineHeight: '1.6', marginBottom: '3px',
                                                        }}>
                                                            <span style={{ color: accent, fontFamily: mono, fontSize: '0.9em', flexShrink: 0 }}>›</span>
                                                            {b}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {proj.technologies && proj.technologies.length > 0 && (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                                                    {proj.technologies.map((tech, i) => (
                                                        <Chip key={i} label={tech} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <Section tag="experience">
                            {experience.map((exp, idx) => (
                                <div key={exp.id} style={{
                                    display: 'flex', gap: '12px',
                                    marginBottom: idx < experience.length - 1 ? `${gap * 0.85}px` : 0,
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Dot />
                                        {idx < experience.length - 1 && (
                                            <div style={{ flex: 1, width: '1px', backgroundColor: slate200, minHeight: '20px' }} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h3 style={{ fontSize: '0.97em', fontWeight: '700', color: slate900, margin: 0 }}>
                                                    {exp.position}
                                                </h3>
                                                <div style={{ fontSize: '0.85em', color: accent, fontWeight: '600', marginTop: '1px' }}>
                                                    {exp.company}
                                                </div>
                                            </div>
                                            <span style={{
                                                fontFamily: mono,
                                                fontSize: '0.72em',
                                                color: slate500,
                                                backgroundColor: slate100,
                                                border: `1px solid ${slate200}`,
                                                padding: '1px 7px',
                                                borderRadius: '4px',
                                                whiteSpace: 'nowrap',
                                                marginLeft: '10px',
                                                marginTop: '1px',
                                            }}>
                                                {exp.startDate} → {exp.current ? 'now' : exp.endDate || ''}
                                            </span>
                                        </div>
                                        {exp.description && (
                                            <div
                                                style={{ fontSize: '0.88em', color: slate700, lineHeight: '1.65', marginTop: '5px', marginBottom: '5px' }}
                                                dangerouslySetInnerHTML={{ __html: exp.description }}
                                            />
                                        )}
                                        {exp.bullets && exp.bullets.length > 0 && (
                                            <ul style={{ margin: '5px 0 0', padding: 0, listStyle: 'none' }}>
                                                {exp.bullets.map((b, i) => (
                                                    <li key={i} style={{
                                                        display: 'flex', gap: '7px',
                                                        fontSize: '0.88em', color: slate700,
                                                        lineHeight: '1.6', marginBottom: '3px',
                                                    }}>
                                                        <span style={{ color: accent, fontFamily: mono, flexShrink: 0 }}>›</span>
                                                        {b}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </Section>
                    )}
                </div>

                {/* ── RIGHT: sidebar ─────────────── */}
                <div style={{ padding: `${gap + 6}px 24px ${gap}px 20px` }}>

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <div style={{ marginBottom: `${gap + 2}px` }}>
                            <div style={{
                                fontFamily: mono,
                                fontSize: '0.68em',
                                color: accent,
                                marginBottom: '10px',
                                paddingBottom: '6px',
                                borderBottom: `1px solid ${slate200}`,
                            }}>
                                {'<skills />'}
                            </div>
                            {skills.map(skill => (
                                <div key={skill.id} style={{ marginBottom: '10px' }}>
                                    <div style={{
                                        fontSize: '0.72em',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        color: slate500,
                                        marginBottom: '5px',
                                    }}>
                                        {skill.category}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                        {skill.items.map((item, i) => (
                                            <Chip key={i} label={item} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <div style={{ marginBottom: `${gap + 2}px` }}>
                            <div style={{
                                fontFamily: mono,
                                fontSize: '0.68em',
                                color: accent,
                                marginBottom: '10px',
                                paddingBottom: '6px',
                                borderBottom: `1px solid ${slate200}`,
                            }}>
                                {'<certifications />'}
                            </div>
                            {certifications.map(cert => (
                                <div key={cert.id} style={{
                                    marginBottom: '9px',
                                    paddingLeft: '8px',
                                    borderLeft: `2px solid ${accentBdr}`,
                                }}>
                                    <div style={{ fontSize: '0.85em', fontWeight: '700', color: slate900, lineHeight: '1.3' }}>
                                        {cert.name}
                                    </div>
                                    <div style={{ fontSize: '0.77em', color: slate500, marginTop: '1px' }}>{cert.issuer}</div>
                                    <div style={{
                                        fontFamily: mono, fontSize: '0.68em',
                                        color: accent, marginTop: '2px',
                                    }}>{cert.date}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <div style={{ marginBottom: `${gap}px` }}>
                            <div style={{
                                fontFamily: mono,
                                fontSize: '0.68em',
                                color: accent,
                                marginBottom: '10px',
                                paddingBottom: '6px',
                                borderBottom: `1px solid ${slate200}`,
                            }}>
                                {'<languages />'}
                            </div>
                            {languages.map(lang => (
                                <div key={lang.id} style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', marginBottom: '6px',
                                    padding: '4px 8px',
                                    backgroundColor: slate50,
                                    border: `1px solid ${slate200}`,
                                    borderRadius: '4px',
                                }}>
                                    <span style={{ fontSize: '0.85em', fontWeight: '600', color: slate900 }}>{lang.language}</span>
                                    <span style={{
                                        fontFamily: mono, fontSize: '0.68em',
                                        color: accent,
                                    }}>
                                        {lang.proficiency}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
