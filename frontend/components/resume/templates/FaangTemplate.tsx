import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react';

interface FaangTemplateProps {
    resume: Resume;
}

export function FaangTemplate({ resume }: FaangTemplateProps) {
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

    const accentColor = settings?.colors?.primary || '#1a6cf0';

    const gap =
        settings?.spacing === 'compact' ? 10 :
            settings?.spacing === 'relaxed' ? 22 :
                15;

    const textClass =
        settings?.fontSize === 'small' ? 'text-[8.5pt]' :
            settings?.fontSize === 'large' ? 'text-[11pt]' :
                'text-[9.5pt]';

    // ── tiny helpers ──────────────────────────────────
    const HR = () => (
        <div style={{
            borderTop: '1.5px solid #1a1a1a',
            marginBottom: `${gap * 0.7}px`,
        }} />
    );

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <div style={{ marginBottom: `${gap * 0.55}px` }}>
            <h2 style={{
                fontFamily: "'Cambria', 'Georgia', serif",
                fontSize: '1.05em',
                fontWeight: '700',
                letterSpacing: '0.01em',
                textTransform: 'uppercase',
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '3px',
            }}>
                {children}
            </h2>
            <HR />
        </div>
    );

    const Bullet = ({ text }: { text: string }) => (
        <li style={{
            display: 'flex',
            gap: '8px',
            fontSize: '0.93em',
            color: '#222',
            lineHeight: '1.55',
            marginBottom: '3px',
            listStyle: 'none',
        }}>
            <span style={{ color: '#555', flexShrink: 0, marginTop: '1px' }}>•</span>
            <span>{text}</span>
        </li>
    );

    return (
        <div
            className={cn(
                'w-[794px]  bg-white box-border mx-auto',
                textClass,
            )}
            style={{
                fontFamily: "'Calibri', 'Carlito', 'Liberation Sans', sans-serif",
                color: '#1a1a1a',
                padding: '36px 44px 36px 44px',
            }}
        >
            {/* ══════════════════════════════
                HEADER
            ══════════════════════════════ */}
            {personalInfo && (
                <div style={{ marginBottom: `${gap}px` }}>

                    {/* Name */}
                    <h1 style={{
                        fontFamily: "'Cambria', 'Georgia', serif",
                        fontSize: '2.45em',
                        fontWeight: '700',
                        letterSpacing: '-0.015em',
                        color: accentColor,
                        lineHeight: 1,
                        margin: 0,
                        marginBottom: '5px',
                    }}>
                        {personalInfo.fullName || 'Your Name'}
                    </h1>

                    {/* Title */}
                    {personalInfo.title && (
                        <p style={{
                            fontSize: '1.0em',
                            fontWeight: '400',
                            color: '#444',
                            margin: 0,
                            marginBottom: '9px',
                            letterSpacing: '0.01em',
                        }}>
                            {personalInfo.title}
                        </p>
                    )}

                    {/* Contact row */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        columnGap: '18px',
                        rowGap: '3px',
                        fontSize: '0.88em',
                        color: '#333',
                    }}>
                        {personalInfo.email && (
                            <a href={`mailto:${personalInfo.email}`}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#333', textDecoration: 'none' }}>
                                <Mail style={{ width: 11, height: 11, color: accentColor }} />
                                {personalInfo.email}
                            </a>
                        )}
                        {personalInfo.phone && (
                            <a href={`tel:${personalInfo.phone}`}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#333', textDecoration: 'none' }}>
                                <Phone style={{ width: 11, height: 11, color: accentColor }} />
                                {personalInfo.phone}
                            </a>
                        )}
                        {personalInfo.location && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin style={{ width: 11, height: 11, color: accentColor }} />
                                {personalInfo.location}
                            </span>
                        )}
                        {personalInfo.linkedin && (
                            <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', color: accentColor, textDecoration: 'none' }}>
                                <Linkedin style={{ width: 11, height: 11 }} />
                                {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                            </a>
                        )}
                        {personalInfo.github && (
                            <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', color: accentColor, textDecoration: 'none' }}>
                                <Github style={{ width: 11, height: 11 }} />
                                {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                            </a>
                        )}
                        {personalInfo.website && (
                            <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', color: accentColor, textDecoration: 'none' }}>
                                <Globe style={{ width: 11, height: 11 }} />
                                {personalInfo.website.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                    </div>

                    {/* Summary */}
                    {personalInfo.summary && (
                        <div
                            style={{
                                marginTop: '10px',
                                fontSize: '0.93em',
                                color: '#333',
                                lineHeight: '1.6',
                                borderLeft: `3px solid ${accentColor}`,
                                paddingLeft: '10px',
                            }}
                            dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
                        />
                    )}
                </div>
            )}


            {/* ══════════════════════════════
                EDUCATION
            ══════════════════════════════ */}
            {education && education.length > 0 && (
                <div style={{ marginBottom: `${gap}px` }}>
                    <SectionTitle>Education</SectionTitle>
                    {education.map((edu, idx) => (
                        <div key={edu.id} style={{ marginBottom: idx < education.length - 1 ? `${gap * 0.7}px` : 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <span style={{ fontWeight: '700', fontSize: '0.97em', color: '#111' }}>
                                    {edu.institution}
                                </span>
                                <span style={{ fontSize: '0.88em', color: '#555', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                                    {edu.startDate} – {edu.endDate || 'Expected'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '1px' }}>
                                <span style={{ fontSize: '0.93em', color: '#333', fontStyle: 'italic' }}>
                                    {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                                </span>
                                {edu.gpa && (
                                    <span style={{ fontSize: '0.88em', color: '#555', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                                        GPA: {edu.gpa}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {/* ══════════════════════════════
                EXPERIENCE
            ══════════════════════════════ */}
            {experience && experience.length > 0 && (
                <div style={{ marginBottom: `${gap}px` }}>
                    <SectionTitle>Experience</SectionTitle>
                    {experience.map((exp, idx) => (
                        <div key={exp.id} style={{ marginBottom: idx < experience.length - 1 ? `${gap * 0.8}px` : 0 }}>
                            {/* Row 1: Company + dates */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <span style={{ fontWeight: '700', fontSize: '0.97em', color: '#111' }}>
                                    {exp.company}
                                </span>
                                <span style={{ fontSize: '0.88em', color: '#555', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                                </span>
                            </div>
                            {/* Row 2: Title */}
                            <div style={{ fontSize: '0.93em', color: '#333', fontStyle: 'italic', marginBottom: '5px', marginTop: '1px' }}>
                                {exp.position}
                            </div>
                            {/* Description */}
                            {exp.description && (
                                <div
                                    style={{ fontSize: '0.93em', color: '#333', lineHeight: '1.55', marginBottom: '4px' }}
                                    dangerouslySetInnerHTML={{ __html: exp.description }}
                                />
                            )}
                            {/* Bullets */}
                            {exp.bullets && exp.bullets.length > 0 && (
                                <ul style={{ margin: 0, padding: 0 }}>
                                    {exp.bullets.map((b, i) => <Bullet key={i} text={b} />)}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}


            {/* ══════════════════════════════
                PROJECTS
            ══════════════════════════════ */}
            {projects && projects.length > 0 && (
                <div style={{ marginBottom: `${gap}px` }}>
                    <SectionTitle>Projects</SectionTitle>
                    {projects.map((proj, idx) => (
                        <div key={proj.id} style={{ marginBottom: idx < projects.length - 1 ? `${gap * 0.8}px` : 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <span style={{ fontWeight: '700', fontSize: '0.97em', color: '#111' }}>
                                    {proj.name}
                                    {proj.url && (
                                        <>
                                            {' '}
                                            <a href={proj.url} target="_blank" rel="noopener noreferrer"
                                                style={{ fontSize: '0.88em', fontWeight: '400', color: accentColor, textDecoration: 'none' }}>
                                                | {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
                                            </a>
                                        </>
                                    )}
                                </span>
                                {proj.technologies && proj.technologies.length > 0 && (
                                    <span style={{
                                        fontSize: '0.83em', color: '#555',
                                        fontStyle: 'italic', whiteSpace: 'nowrap',
                                        marginLeft: '12px',
                                    }}>
                                        {proj.technologies.join(', ')}
                                    </span>
                                )}
                            </div>
                            {proj.description && (
                                <div
                                    style={{ fontSize: '0.93em', color: '#333', lineHeight: '1.55', marginTop: '2px', marginBottom: '4px' }}
                                    dangerouslySetInnerHTML={{ __html: proj.description }}
                                />
                            )}
                            {proj.bullets && proj.bullets.length > 0 && (
                                <ul style={{ margin: 0, padding: 0 }}>
                                    {proj.bullets.map((b, i) => <Bullet key={i} text={b} />)}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}


            {/* ══════════════════════════════
                SKILLS  (inline, comma-separated per category)
            ══════════════════════════════ */}
            {skills && skills.length > 0 && (
                <div style={{ marginBottom: `${gap}px` }}>
                    <SectionTitle>Technical Skills</SectionTitle>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <tbody>
                            {skills.map(skill => (
                                <tr key={skill.id}>
                                    <td style={{
                                        fontWeight: '700',
                                        fontSize: '0.93em',
                                        color: '#111',
                                        whiteSpace: 'nowrap',
                                        paddingRight: '10px',
                                        paddingBottom: '3px',
                                        verticalAlign: 'top',
                                        width: '130px',
                                    }}>
                                        {skill.category}:
                                    </td>
                                    <td style={{
                                        fontSize: '0.93em',
                                        color: '#333',
                                        lineHeight: '1.5',
                                        paddingBottom: '3px',
                                        verticalAlign: 'top',
                                    }}>
                                        {skill.items.join(', ')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            {/* ══════════════════════════════
                CERTIFICATIONS
            ══════════════════════════════ */}
            {certifications && certifications.length > 0 && (
                <div style={{ marginBottom: `${gap}px` }}>
                    <SectionTitle>Certifications</SectionTitle>
                    {certifications.map((cert, idx) => (
                        <div key={cert.id} style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'baseline',
                            marginBottom: idx < certifications.length - 1 ? '5px' : 0,
                        }}>
                            <span style={{ fontSize: '0.93em', color: '#222' }}>
                                <span style={{ fontWeight: '700' }}>{cert.name}</span>
                                {cert.issuer && <span style={{ color: '#555' }}> — {cert.issuer}</span>}
                            </span>
                            {cert.date && (
                                <span style={{ fontSize: '0.88em', color: '#555', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                                    {cert.date}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}


            {/* ══════════════════════════════
                LANGUAGES
            ══════════════════════════════ */}
            {languages && languages.length > 0 && (
                <div style={{ marginBottom: `${gap}px` }}>
                    <SectionTitle>Languages</SectionTitle>
                    <div style={{ fontSize: '0.93em', color: '#333', lineHeight: '1.55' }}>
                        {languages.map((lang, i) => (
                            <span key={lang.id}>
                                <span style={{ fontWeight: '700' }}>{lang.language}</span>
                                {lang.proficiency && <span style={{ color: '#555' }}> ({lang.proficiency})</span>}
                                {i < languages.length - 1 && <span style={{ color: '#bbb' }}>  ·  </span>}
                            </span>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
