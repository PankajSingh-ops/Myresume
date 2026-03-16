import { Resume } from '@/types/resume';
import { ClassicTemplate } from './ClassicTemplate';
import { ModernTemplate } from './ModernTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { CorporateTemplate } from './CorporateTemplate';
import { TechnicalTemplate } from './TechnicalTemplate';
import { StartupTemplate } from './StartupTemplate';
import { ElegantTemplate } from './ElegantTemplate';
import { TechTemplate } from './TechTemplate';
import { EditorialTemplate } from './Editorialtemplate';
import { LuxuryTemplate } from './LuxuryTemplate';
import { FresherTemplate } from './FresherTemplate';
import { ManagementTemplate } from './ManagementTemplate';
import { FaangTemplate } from './FaangTemplate';
import { TechStudentTemplate } from './TechStudentsTemplate';
import { HRTemplate } from './HrTemplate';
import { HRTemplate as HRLatestTemplate } from './HrLatestTemplate';
import { ModernLineTemplate } from './ModernLineTemplate';
import { SWETemplate } from './SweteTemplate';
import { FresherTemplate as FresherFriendlyTemplate } from './FresherFriendlyTemplate';
import { AvatarTemplate } from './AvatarTemplate';

interface TemplateRendererProps {
    resume: Resume;
}

export function TemplateRenderer({ resume }: TemplateRendererProps) {
    const templateId = resume.settings?.templateId || 'classic';

    switch (templateId) {
        case 'modern':
            return <ModernTemplate resume={resume} />;
        case 'executive':
            return <ExecutiveTemplate resume={resume} />;
        case 'creative':
            return <CreativeTemplate resume={resume} />;
        case 'minimal':
            return <MinimalTemplate resume={resume} />;
        case 'professional':
            return <ProfessionalTemplate resume={resume} />;
        case 'corporate':
            return <CorporateTemplate resume={resume} />;
        case 'technical':
            return <TechnicalTemplate resume={resume} />;
        case 'startup':
            return <StartupTemplate resume={resume} />;
        case 'elegant':
            return <ElegantTemplate resume={resume} />;
        case 'tech':
            return <TechTemplate resume={resume} />;
        case 'editorial':
            return <EditorialTemplate resume={resume} />;
        case 'luxury':
            return <LuxuryTemplate resume={resume} />;
        case 'fresher':
            return <FresherTemplate resume={resume} />;
        case 'management':
            return <ManagementTemplate resume={resume} />;
        case 'faang':
            return <FaangTemplate resume={resume} />;
        case 'techstudent':
            return <TechStudentTemplate resume={resume} />;
        case 'hr':
            return <HRTemplate resume={resume} />;
        case 'hr-latest':
            return <HRLatestTemplate resume={resume} />;
        case 'modern-line':
            return <ModernLineTemplate resume={resume} />;
        case 'swe':
            return <SWETemplate resume={resume} />;
        case 'fresher-friendly':
            return <FresherFriendlyTemplate resume={resume} />;
        case 'avatar':
            return <AvatarTemplate resume={resume} />;
        case 'classic':
        default:
            return <ClassicTemplate resume={resume} />;
    }
}
