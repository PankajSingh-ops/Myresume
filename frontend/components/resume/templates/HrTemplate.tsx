import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github, Users, Heart } from 'lucide-react';

interface HRTemplateProps {
    resume: Resume;
}

export function HRTemplate({ resume }: HRTemplateProps) {
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

    const accent = settings?.colors?.primary || '#c05a7a'; // deep rose
    const accent2 = '#e8956d'; // warm coral complement

    const accentBg = accent + '10';
    const accentBg2 = accent + '1a';
    const accentBdr = accent + '30';

    const gap =
        settings?.spacing === 'compact' ? 12 :
            settings?.spacing === 'relaxed' ? 24 :
                17;

    const textClass =
        settings?.fontSize === 'small' ? 'text-[8.5pt]' :
            settings?.fontSize === 'large' ? 'text-[11pt]' :
                'text-[9.5pt]';

    const sans = "'Nunito', 'Varela Round', 'Trebuchet MS', sans-serif";
    const display = "'Cormorant Garamond', 'Georgia', serif";

    const ink = '#2d1f27';
    const inkMid = '#5c4a54';
    const inkLight = '#9e8a93';
    const pageBg = '#fffbf9';
    const sideCol = '#fdf0f3';

    /* ─── Section heading (main) ─── */
    const MainHeading = ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) => (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: `${gap * 0.6}px`,
        }}>
            {icon && (
                <div style={{
                    width: '22px', height: '22px', borderRadius: '6px',
                    backgroundColor: accentBg2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <span style={{ color: accent }}>{icon}</span>
                </div>
            )}
            <h2 style={{
                fontFamily: display,
                fontSize: '1.15em',
                fontWeight: '700',
                fontStyle: 'italic',
                color: accent,
                margin: 0,
                letterSpacing: '0.03em',
            }}>
                {children}
            </h2>
            <div style={{
                flex: 1,
                height: '1px',
                background: `linear-gradient(90deg, ${accent}40, transparent)`,
            }} />
        </div>
    );

    /* ─── Section heading (sidebar) ─── */
    const SideHeading = ({ children }: { children: React.ReactNode }) => (
        <div style={{ marginBottom: `${gap * 0.5}px` }}>
            <h2 style={{
                fontFamily: sans,
                fontSize: '0.68em',
                fontWeight: '800',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: accent,
                margin: 0,
                marginBottom: '6px',
            }}>
                {children}
            </h2>
            <div style={{
                height: '2px', borderRadius: '2px',
                background: `linear-gradient(90deg, ${accent}, ${accent2}80)`,
                width: '40px',
            }} />
        </div>
    );

    /* ─── Bullet item ─── */
    const Bullet = ({ text }: { text: string }) => (
        <li style={{
            display: 'flex', gap: '8px',
            fontSize: '0.9em', color: inkMid,
            lineHeight: '1.65', marginBottom: '4px',
            listStyle: 'none',
        }}>
            <span style={{
                width: '5px', height: '5px', borderRadius: '50%',
                backgroundColor: accent2,
                flexShrink: 0, marginTop: '7px',
            }} />
            <span>{text}</span>
        </li>
    );

    return (
        <div
            className={cn('w-[794px]  box-border mx-auto ', textClass)}
            style={{ fontFamily: sans, backgroundColor: pageBg, color: ink }}
        >

            {/* ══════════════════════════════════════
                HEADER
            ══════════════════════════════════════ */}
            {personalInfo && (
                <div style={{ position: 'relative', overflow: 'hidden' }}>

                    {/* Organic blob top-right */}
                    <svg
                        style={{ position: 'absolute', top: 0, right: 0, width: '320px', height: '180px', pointerEvents: 'none' }}
                        viewBox="0 0 320 180" fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M320 0 C240 0, 180 30, 200 90 C220 150, 280 160, 320 180 Z"
                            fill={accent}
                            opacity="0.08"
                        />
                        <path
                            d="M320 0 C260 0, 210 40, 240 100 C265 150, 300 155, 320 180 Z"
                            fill={accent2}
                            opacity="0.07"
                        />
                    </svg>

                    {/* Accent top bar with gradient */}
                    <div style={{
                        height: '5px',
                        background: `linear-gradient(90deg, ${accent}, ${accent2})`,
                    }} />

                    <div style={{ padding: '30px 44px 26px', position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>

                            {/* Left: name block */}
                            <div>
                                {/* People icon badge */}
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                                    backgroundColor: accentBg2,
                                    border: `1px solid ${accentBdr}`,
                                    borderRadius: '20px',
                                    padding: '3px 10px',
                                    marginBottom: '10px',
                                }}>
                                    <Users style={{ width: 10, height: 10, color: accent }} />
                                    <span style={{
                                        fontSize: '0.62em', fontWeight: '800',
                                        letterSpacing: '0.15em', textTransform: 'uppercase',
                                        color: accent,
                                    }}>
                                        Human Resources
                                    </span>
                                </div>

                                <h1 style={{
                                    fontFamily: display,
                                    fontSize: '3em',
                                    fontWeight: '700',
                                    color: ink,
                                    lineHeight: 1.05,
                                    margin: 0,
                                    marginBottom: '6px',
                                    letterSpacing: '0.01em',
                                }}>
                                    {personalInfo.fullName || 'Your Name'}
                                </h1>

                                {personalInfo.title && (
                                    <p style={{
                                        fontSize: '0.95em',
                                        fontWeight: '600',
                                        color: inkLight,
                                        margin: 0,
                                        letterSpacing: '0.06em',
                                    }}>
                                        {personalInfo.title}
                                    </p>
                                )}
                            </div>

                            {/* Right: contacts */}
                            <div style={{
                                display: 'flex', flexDirection: 'column',
                                gap: '5px', alignItems: 'flex-end',
                                fontSize: '0.8em', color: inkMid,
                                flexShrink: 0, paddingTop: '32px',
                            }}>
                                {personalInfo.email && (
                                    <a href={`mailto:${personalInfo.email}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'inherit', textDecoration: 'none' }}>
                                        {personalInfo.email} <Mail style={{ width: 10, height: 10, color: accent }} />
                                    </a>
                                )}
                                {personalInfo.phone && (
                                    <a href={`tel:${personalInfo.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'inherit', textDecoration: 'none' }}>
                                        {personalInfo.phone} <Phone style={{ width: 10, height: 10, color: accent }} />
                                    </a>
                                )}
                                {personalInfo.location && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        {personalInfo.location} <MapPin style={{ width: 10, height: 10, color: accent }} />
                                    </span>
                                )}
                                {personalInfo.linkedin && (
                                    <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: accent, textDecoration: 'none' }}>
                                        {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')} <Linkedin style={{ width: 10, height: 10 }} />
                                    </a>
                                )}
                                {personalInfo.website && (
                                    <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: accent, textDecoration: 'none' }}>
                                        {personalInfo.website.replace(/^https?:\/\//, '')} <Globe style={{ width: 10, height: 10 }} />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Summary */}
                        {personalInfo.summary && (
                            <div style={{
                                marginTop: '18px',
                                padding: '14px 18px',
                                backgroundColor: accentBg,
                                border: `1px solid ${accentBdr}`,
                                borderRadius: '12px',
                                borderLeft: `4px solid ${accent}`,
                            }}>
                                <div
                                    style={{ fontSize: '0.91em', color: inkMid, lineHeight: '1.75' }}
                                    dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Wavy divider */}
                    <svg viewBox="0 0 794 22" style={{ display: 'block', width: '100%', height: '22px' }} preserveAspectRatio="none">
                        <path d="M0,0 C200,22 600,0 794,16 L794,22 L0,22 Z" fill={sideCol} />
                    </svg>
                </div>
            )}

            {/* ══════════════════════════════════════
                BODY — 2 column
            ══════════════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 210px', alignItems: 'start' }}>

                {/* ── LEFT MAIN ── */}
                <div style={{ padding: `${gap}px 28px ${gap}px 44px` }}>

                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <div style={{ marginBottom: `${gap + 4}px` }}>
                            <MainHeading icon={<Users style={{ width: 11, height: 11 }} />}>
                                Work Experience
                            </MainHeading>
                            {experience.map((exp, idx) => (
                                <div key={exp.id} style={{
                                    marginBottom: idx < experience.length - 1 ? `${gap + 2}px` : 0,
                                    position: 'relative',
                                    paddingLeft: '18px',
                                }}>
                                    {/* Left accent bar */}
                                    <div style={{
                                        position: 'absolute', left: 0, top: 0, bottom: 0,
                                        width: '3px', borderRadius: '3px',
                                        background: idx === 0
                                            ? `linear-gradient(180deg, ${accent}, ${accent2})`
                                            : `linear-gradient(180deg, ${accentBdr}, transparent)`,
                                    }} />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1em', fontWeight: '700', color: ink, margin: 0 }}>
                                                {exp.position}
                                            </h3>
                                            <div style={{ fontSize: '0.87em', fontWeight: '600', color: accent, marginTop: '1px' }}>
                                                {exp.company}
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: '0.72em', fontWeight: '700',
                                            color: 'white',
                                            background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                                            padding: '2px 10px', borderRadius: '20px',
                                            whiteSpace: 'nowrap', marginLeft: '10px', flexShrink: 0,
                                        }}>
                                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                        </span>
                                    </div>

                                    {exp.description && (
                                        <div
                                            style={{ fontSize: '0.89em', color: inkMid, lineHeight: '1.65', margin: '5px 0' }}
                                            dangerouslySetInnerHTML={{ __html: exp.description }}
                                        />
                                    )}
                                    {exp.bullets && exp.bullets.length > 0 && (
                                        <ul style={{ margin: 0, padding: 0 }}>
                                            {exp.bullets.map((b, i) => <Bullet key={i} text={b} />)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Projects / HR Initiatives */}
                    {projects && projects.length > 0 && (
                        <div style={{ marginBottom: `${gap + 4}px` }}>
                            <MainHeading icon={<Heart style={{ width: 11, height: 11 }} />}>
                                Key Initiatives
                            </MainHeading>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {projects.map(proj => (
                                    <div key={proj.id} style={{
                                        padding: '13px 15px',
                                        borderRadius: '12px',
                                        backgroundColor: '#fff',
                                        border: `1px solid ${accentBdr}`,
                                        boxShadow: `0 2px 8px ${accent}0d`,
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}>
                                        {/* Corner accent */}
                                        <div style={{
                                            position: 'absolute', top: 0, right: 0,
                                            width: '40px', height: '40px',
                                            background: `linear-gradient(225deg, ${accent}15, transparent)`,
                                            borderBottomLeftRadius: '40px',
                                        }} />
                                        <h3 style={{ fontSize: '0.92em', fontWeight: '800', color: ink, margin: 0, marginBottom: '4px' }}>
                                            {proj.name}
                                        </h3>
                                        {proj.description && (
                                            <div
                                                style={{ fontSize: '0.84em', color: inkMid, lineHeight: '1.6', marginBottom: '6px' }}
                                                dangerouslySetInnerHTML={{ __html: proj.description }}
                                            />
                                        )}
                                        {proj.bullets && proj.bullets.length > 0 && (
                                            <ul style={{ margin: 0, padding: 0 }}>
                                                {proj.bullets.slice(0, 3).map((b, i) => (
                                                    <li key={i} style={{
                                                        display: 'flex', gap: '6px',
                                                        fontSize: '0.82em', color: inkMid,
                                                        lineHeight: '1.55', marginBottom: '3px',
                                                        listStyle: 'none',
                                                    }}>
                                                        <span style={{ color: accent2, flexShrink: 0, marginTop: '6px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: accent2, display: 'inline-block' }} />
                                                        {b}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {proj.technologies && proj.technologies.length > 0 && (
                                            <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                                                {proj.technologies.map((t, i) => (
                                                    <span key={i} style={{
                                                        fontSize: '0.7em', fontWeight: '700',
                                                        color: accent, backgroundColor: accentBg,
                                                        border: `1px solid ${accentBdr}`,
                                                        padding: '1px 6px', borderRadius: '20px',
                                                    }}>
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <div style={{ marginBottom: `${gap}px` }}>
                            <MainHeading>Education</MainHeading>
                            {education.map((edu, idx) => (
                                <div key={edu.id} style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: idx < education.length - 1 ? `${gap * 0.7}px` : 0,
                                    padding: '10px 14px',
                                    backgroundColor: '#fff',
                                    border: `1px solid ${accentBdr}`,
                                    borderRadius: '10px',
                                }}>
                                    <div>
                                        <h3 style={{ fontSize: '0.95em', fontWeight: '700', color: ink, margin: 0 }}>
                                            {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                                        </h3>
                                        <div style={{ fontSize: '0.84em', color: accent, fontWeight: '600', marginTop: '2px' }}>
                                            {edu.institution}
                                        </div>
                                        {edu.gpa && (
                                            <div style={{ fontSize: '0.75em', color: inkLight, marginTop: '2px' }}>GPA: {edu.gpa}</div>
                                        )}
                                    </div>
                                    <span style={{
                                        fontSize: '0.72em', fontWeight: '700',
                                        color: inkLight, backgroundColor: '#f5f0f2',
                                        padding: '2px 9px', borderRadius: '20px',
                                        whiteSpace: 'nowrap', marginLeft: '10px', flexShrink: 0,
                                    }}>
                                        {edu.startDate} – {edu.endDate || 'Expected'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── RIGHT SIDEBAR ── */}
                <div style={{
                    backgroundColor: sideCol,
                    padding: `${gap}px 22px`,
                    minHeight: '100%',
                    borderLeft: `1px solid ${accentBdr}`,
                }}>

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <div style={{ marginBottom: `${gap + 4}px` }}>
                            <SideHeading>Skills</SideHeading>
                            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {skills.map(skill => (
                                    <div key={skill.id}>
                                        <div style={{
                                            fontSize: '0.7em', fontWeight: '800',
                                            color: inkLight, letterSpacing: '0.1em',
                                            textTransform: 'uppercase', marginBottom: '5px',
                                        }}>
                                            {skill.category}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {skill.items.map((item, i) => (
                                                <span key={i} style={{
                                                    fontSize: '0.78em', fontWeight: '600',
                                                    color: ink,
                                                    backgroundColor: '#fff',
                                                    border: `1.5px solid ${accentBdr}`,
                                                    padding: '2px 8px', borderRadius: '20px',
                                                    boxShadow: `0 1px 3px ${accent}10`,
                                                }}>
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <div style={{ marginBottom: `${gap + 4}px` }}>
                            <SideHeading>Certifications</SideHeading>
                            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                                {certifications.map(cert => (
                                    <div key={cert.id} style={{
                                        padding: '9px 11px',
                                        backgroundColor: '#fff',
                                        border: `1px solid ${accentBdr}`,
                                        borderRadius: '10px',
                                        borderLeft: `3px solid ${accent}`,
                                    }}>
                                        <div style={{ fontSize: '0.84em', fontWeight: '700', color: ink, lineHeight: '1.3' }}>{cert.name}</div>
                                        <div style={{ fontSize: '0.76em', color: inkLight, marginTop: '2px' }}>{cert.issuer}</div>
                                        <div style={{ fontSize: '0.7em', color: accent, fontWeight: '700', marginTop: '3px' }}>{cert.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <div style={{ marginBottom: `${gap}px` }}>
                            <SideHeading>Languages</SideHeading>
                            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {languages.map(lang => (
                                    <div key={lang.id} style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '5px 10px',
                                        backgroundColor: '#fff',
                                        borderRadius: '20px',
                                        border: `1px solid ${accentBdr}`,
                                    }}>
                                        <span style={{ fontSize: '0.84em', fontWeight: '700', color: ink }}>{lang.language}</span>
                                        <span style={{
                                            fontSize: '0.68em', fontWeight: '700',
                                            color: 'white',
                                            background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                                            padding: '1px 8px', borderRadius: '20px',
                                        }}>
                                            {lang.proficiency}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer gradient bar */}
            <div style={{
                height: '4px',
                background: `linear-gradient(90deg, ${accent}, ${accent2})`,
                marginTop: 'auto',
            }} />
        </div>
    );
}
