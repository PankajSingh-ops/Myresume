import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface LuxuryTemplateProps {
    resume: Resume;
}

export function LuxuryTemplate({ resume }: LuxuryTemplateProps) {
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

    const accentColor = settings?.colors?.primary || '#2d5a3d'; // deep forest green

    const gapClass =
        settings?.spacing === 'compact' ? 'mb-5' :
            settings?.spacing === 'relaxed' ? 'mb-12' :
                'mb-8';

    const textClass =
        settings?.fontSize === 'small' ? 'text-[8.5pt]' :
            settings?.fontSize === 'large' ? 'text-[11pt]' :
                'text-[9.5pt]';

    const gold = '#b8986a';
    const cream = '#faf6ef';
    const darkInk = '#1c1917';

    return (
        <div
            className={cn("w-[794px]  box-border mx-auto shadow-2xl flex flex-col", textClass)}
            style={{ backgroundColor: cream, color: darkInk, fontFamily: "'Garamond', 'Georgia', serif" }}
        >
            {/* ── DECORATIVE TOP BORDER ── */}
            <div style={{ height: '6px', background: `repeating-linear-gradient(90deg, ${gold} 0px, ${gold} 18px, ${cream} 18px, ${cream} 22px)` }} />
            <div style={{ height: '2px', backgroundColor: gold, margin: '4px 0' }} />
            <div style={{ height: '1px', backgroundColor: gold, opacity: 0.4 }} />

            {/* ── HEADER ── */}
            {personalInfo && (
                <div style={{ padding: '36px 52px 28px', borderBottom: `1px solid ${gold}` }}>

                    {/* Tiny label row */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        marginBottom: '18px'
                    }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: gold, opacity: 0.5 }} />
                        <span style={{
                            fontSize: '0.62em', letterSpacing: '0.35em',
                            fontFamily: "'Garamond', 'Georgia', serif",
                            color: gold, textTransform: 'uppercase', fontStyle: 'italic'
                        }}>
                            Résumé
                        </span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: gold, opacity: 0.5 }} />
                    </div>

                    {/* Name — massive centered serif */}
                    <h1 style={{
                        textAlign: 'center',
                        fontFamily: "'Garamond', 'Georgia', serif",
                        fontSize: '3.8em',
                        fontWeight: '400',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: darkInk,
                        lineHeight: 1,
                        marginBottom: '10px'
                    }}>
                        {personalInfo.fullName || 'Your Name'}
                    </h1>

                    {/* Title — centered small caps */}
                    {personalInfo.title && (
                        <p style={{
                            textAlign: 'center',
                            fontSize: '0.88em',
                            letterSpacing: '0.28em',
                            textTransform: 'uppercase',
                            color: accentColor,
                            fontStyle: 'italic',
                            marginBottom: '20px'
                        }}>
                            {personalInfo.title}
                        </p>
                    )}

                    {/* Gold rule under title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: gold, opacity: 0.35 }} />
                        <div style={{ width: '6px', height: '6px', transform: 'rotate(45deg)', backgroundColor: gold }} />
                        <div style={{ flex: 1, height: '1px', backgroundColor: gold, opacity: 0.35 }} />
                    </div>

                    {/* Contact info — horizontal centered row */}
                    <div style={{
                        display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
                        gap: '20px', fontSize: '0.8em', color: '#57534e'
                    }}>
                        {personalInfo.email && (
                            <a href={`mailto:${personalInfo.email}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'inherit', textDecoration: 'none' }}>
                                <Mail style={{ width: '11px', height: '11px', color: gold }} />
                                {personalInfo.email}
                            </a>
                        )}
                        {personalInfo.phone && (
                            <a href={`tel:${personalInfo.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'inherit', textDecoration: 'none' }}>
                                <Phone style={{ width: '11px', height: '11px', color: gold }} />
                                {personalInfo.phone}
                            </a>
                        )}
                        {personalInfo.location && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <MapPin style={{ width: '11px', height: '11px', color: gold }} />
                                {personalInfo.location}
                            </div>
                        )}
                        {personalInfo.website && (
                            <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'inherit', textDecoration: 'none' }}>
                                <Globe style={{ width: '11px', height: '11px', color: gold }} />
                                {personalInfo.website.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                        {personalInfo.linkedin && (
                            <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'inherit', textDecoration: 'none' }}>
                                <Linkedin style={{ width: '11px', height: '11px', color: gold }} />
                                {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                            </a>
                        )}
                        {personalInfo.github && (
                            <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'inherit', textDecoration: 'none' }}>
                                <Github style={{ width: '11px', height: '11px', color: gold }} />
                                {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                            </a>
                        )}
                    </div>

                    {/* Summary */}
                    {personalInfo.summary && (
                        <div style={{
                            marginTop: '20px',
                            paddingTop: '16px',
                            borderTop: `1px solid ${gold}`,
                            borderBottom: `1px solid ${gold}`,
                            paddingBottom: '16px',
                            fontSize: '0.92em',
                            color: '#44403c',
                            lineHeight: '1.8',
                            textAlign: 'center',
                            fontStyle: 'italic',
                            maxWidth: '560px',
                            margin: '20px auto 0'
                        }}
                            dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
                        />
                    )}
                </div>
            )}

            {/* ── BODY: 3-column layout ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '175px 1fr 175px', flex: 1 }}>

                {/* LEFT COLUMN */}
                <div style={{
                    borderRight: `1px solid ${gold}`,
                    padding: '28px 22px 28px 28px',
                    backgroundColor: `${accentColor}08`
                }}>

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <SideSection title="Skills" gold={gold} accentColor={accentColor} gapClass={gapClass}>
                            {skills.map(skill => (
                                <div key={skill.id} style={{ marginBottom: '12px' }}>
                                    <div style={{
                                        fontSize: '0.68em', letterSpacing: '0.22em',
                                        textTransform: 'uppercase', color: gold,
                                        fontStyle: 'italic', marginBottom: '5px'
                                    }}>
                                        {skill.category}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                        {skill.items.map((item, i) => (
                                            <span key={i} style={{
                                                fontSize: '0.8em', color: '#44403c',
                                                backgroundColor: `${gold}18`,
                                                border: `1px solid ${gold}50`,
                                                padding: '1px 6px',
                                                borderRadius: '1px'
                                            }}>
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </SideSection>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <SideSection title="Languages" gold={gold} accentColor={accentColor} gapClass={gapClass}>
                            {languages.map(lang => (
                                <div key={lang.id} style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'baseline', paddingBottom: '6px',
                                    marginBottom: '6px', borderBottom: `1px dashed ${gold}40`
                                }}>
                                    <span style={{ fontSize: '0.88em', fontWeight: '600', color: darkInk }}>{lang.language}</span>
                                    <span style={{ fontSize: '0.7em', color: accentColor, fontStyle: 'italic' }}>{lang.proficiency}</span>
                                </div>
                            ))}
                        </SideSection>
                    )}
                </div>

                {/* CENTER MAIN COLUMN */}
                <div style={{ padding: '28px 28px' }}>

                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <div className={gapClass}>
                            <DecorativeHeading gold={gold} accentColor={accentColor}>Experience</DecorativeHeading>
                            {experience.map(exp => (
                                <div key={exp.id} style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                                        <h3 style={{
                                            fontSize: '1.02em', fontWeight: '700',
                                            letterSpacing: '0.04em', color: darkInk
                                        }}>
                                            {exp.position}
                                        </h3>
                                        <span style={{
                                            fontSize: '0.72em', color: '#78716c',
                                            fontStyle: 'italic', whiteSpace: 'nowrap', marginLeft: '12px'
                                        }}>
                                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                        </span>
                                    </div>
                                    <div style={{
                                        fontSize: '0.85em', fontStyle: 'italic',
                                        color: accentColor, marginBottom: '6px', fontWeight: '600'
                                    }}>
                                        {exp.company}
                                    </div>
                                    {exp.description && (
                                        <div style={{
                                            fontSize: '0.87em', color: '#57534e',
                                            lineHeight: '1.7', marginBottom: '6px'
                                        }}
                                            dangerouslySetInnerHTML={{ __html: exp.description }}
                                        />
                                    )}
                                    {exp.bullets && exp.bullets.length > 0 && (
                                        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                                            {exp.bullets.map((b, i) => (
                                                <li key={i} style={{
                                                    display: 'flex', gap: '8px',
                                                    fontSize: '0.87em', color: '#57534e',
                                                    lineHeight: '1.65', marginBottom: '3px'
                                                }}>
                                                    <span style={{ color: gold, flexShrink: 0, marginTop: '1px' }}>◆</span>
                                                    <span>{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <div style={{ height: '1px', backgroundColor: gold, opacity: 0.2, marginTop: '14px' }} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <div className={gapClass}>
                            <DecorativeHeading gold={gold} accentColor={accentColor}>Projects</DecorativeHeading>
                            {projects.map(proj => (
                                <div key={proj.id} style={{
                                    marginBottom: '16px',
                                    padding: '14px 16px',
                                    border: `1px solid ${gold}50`,
                                    backgroundColor: `${gold}08`,
                                    position: 'relative'
                                }}>
                                    {/* Corner ornament */}
                                    <div style={{
                                        position: 'absolute', top: '-1px', left: '-1px',
                                        width: '10px', height: '10px',
                                        borderTop: `2px solid ${gold}`,
                                        borderLeft: `2px solid ${gold}`
                                    }} />
                                    <div style={{
                                        position: 'absolute', bottom: '-1px', right: '-1px',
                                        width: '10px', height: '10px',
                                        borderBottom: `2px solid ${gold}`,
                                        borderRight: `2px solid ${gold}`
                                    }} />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                                        <h3 style={{ fontSize: '0.98em', fontWeight: '700', color: darkInk }}>{proj.name}</h3>
                                        {proj.url && (
                                            <a href={proj.url} style={{
                                                fontSize: '0.72em', color: accentColor,
                                                fontStyle: 'italic', textDecoration: 'none',
                                                marginLeft: '10px', whiteSpace: 'nowrap'
                                            }}>
                                                {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
                                            </a>
                                        )}
                                    </div>
                                    {proj.description && (
                                        <div style={{ fontSize: '0.85em', color: '#57534e', lineHeight: '1.65', marginBottom: '6px' }}
                                            dangerouslySetInnerHTML={{ __html: proj.description }}
                                        />
                                    )}
                                    {proj.bullets && proj.bullets.length > 0 && (
                                        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', marginBottom: '8px' }}>
                                            {proj.bullets.map((b, i) => (
                                                <li key={i} style={{ display: 'flex', gap: '6px', fontSize: '0.83em', color: '#78716c', lineHeight: '1.6', marginBottom: '2px' }}>
                                                    <span style={{ color: gold, flexShrink: 0 }}>◆</span>
                                                    <span>{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {proj.technologies && proj.technologies.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px' }}>
                                            {proj.technologies.map((tech, i) => (
                                                <span key={i} style={{
                                                    fontSize: '0.68em', letterSpacing: '0.18em',
                                                    textTransform: 'uppercase', color: accentColor,
                                                    fontStyle: 'italic'
                                                }}>
                                                    {tech}{i < proj.technologies!.length - 1 ? ' ·' : ''}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN */}
                <div style={{
                    borderLeft: `1px solid ${gold}`,
                    padding: '28px 28px 28px 22px',
                    backgroundColor: `${accentColor}08`
                }}>

                    {/* Education */}
                    {education && education.length > 0 && (
                        <SideSection title="Education" gold={gold} accentColor={accentColor} gapClass={gapClass}>
                            {education.map(edu => (
                                <div key={edu.id} style={{ marginBottom: '14px' }}>
                                    <h3 style={{ fontSize: '0.88em', fontWeight: '700', color: darkInk, lineHeight: '1.4', marginBottom: '2px' }}>
                                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                                    </h3>
                                    <div style={{ fontSize: '0.8em', color: accentColor, fontStyle: 'italic', fontWeight: '600' }}>
                                        {edu.institution}
                                    </div>
                                    <div style={{ fontSize: '0.72em', color: '#78716c', marginTop: '2px', letterSpacing: '0.05em' }}>
                                        {edu.startDate} – {edu.endDate || 'Expected'}
                                    </div>
                                    {edu.gpa && (
                                        <div style={{
                                            fontSize: '0.7em', color: '#78716c', marginTop: '2px',
                                            display: 'inline-block', border: `1px solid ${gold}50`,
                                            padding: '0 5px', borderRadius: '1px'
                                        }}>
                                            GPA {edu.gpa}
                                        </div>
                                    )}
                                    <div style={{ height: '1px', backgroundColor: gold, opacity: 0.2, marginTop: '10px' }} />
                                </div>
                            ))}
                        </SideSection>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <SideSection title="Certifications" gold={gold} accentColor={accentColor} gapClass={gapClass}>
                            {certifications.map(cert => (
                                <div key={cert.id} style={{ marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '0.85em', fontWeight: '700', color: darkInk, lineHeight: '1.35' }}>{cert.name}</h3>
                                    <div style={{ fontSize: '0.78em', color: '#78716c', fontStyle: 'italic' }}>{cert.issuer}</div>
                                    <div style={{ fontSize: '0.7em', color: gold, letterSpacing: '0.1em', marginTop: '1px' }}>{cert.date}</div>
                                </div>
                            ))}
                        </SideSection>
                    )}
                </div>
            </div>

            {/* ── DECORATIVE BOTTOM BORDER ── */}
            <div style={{ height: '1px', backgroundColor: gold, opacity: 0.4 }} />
            <div style={{ height: '2px', backgroundColor: gold, margin: '4px 0' }} />
            <div style={{ height: '6px', background: `repeating-linear-gradient(90deg, ${gold} 0px, ${gold} 18px, ${cream} 18px, ${cream} 22px)` }} />
        </div>
    );
}

/* ── Helper: Side section with art deco heading ── */
function SideSection({ title, children, gold, accentColor, gapClass }: {
    title: string;
    children: React.ReactNode;
    gold: string;
    accentColor: string;
    gapClass: string;
}) {
    return (
        <div className={gapClass} style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <div style={{ width: '14px', height: '1px', backgroundColor: gold }} />
                    <span style={{
                        fontSize: '0.65em', letterSpacing: '0.3em',
                        textTransform: 'uppercase', color: accentColor,
                        fontStyle: 'italic', fontWeight: '600'
                    }}>
                        {title}
                    </span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: gold, opacity: 0.4 }} />
                </div>
                <div style={{ height: '1px', backgroundColor: gold, opacity: 0.3 }} />
            </div>
            {children}
        </div>
    );
}

/* ── Helper: Center column heading with ornamental rules ── */
function DecorativeHeading({ children, gold, accentColor }: {
    children: React.ReactNode;
    gold: string;
    accentColor: string;
}) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '20px', height: '1px', backgroundColor: gold }} />
                <h2 style={{
                    fontSize: '0.72em', letterSpacing: '0.35em',
                    textTransform: 'uppercase', color: accentColor,
                    fontStyle: 'italic', fontWeight: '700', margin: 0
                }}>
                    {children}
                </h2>
                <div style={{ flex: 1, height: '1px', backgroundColor: gold, opacity: 0.5 }} />
                <div style={{ width: '5px', height: '5px', transform: 'rotate(45deg)', backgroundColor: gold }} />
            </div>
            <div style={{ height: '1px', backgroundColor: gold, opacity: 0.2, marginTop: '4px' }} />
        </div>
    );
}
