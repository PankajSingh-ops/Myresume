import { CoverLetter } from '@/types/coverLetter';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { CleanTemplate } from './CleanCoverTemplate';
import { ManagementTemplate } from './ManagementTemplate';


interface TemplateRendererProps {
    coverLetter: CoverLetter;
}

export function TemplateRenderer({ coverLetter }: TemplateRendererProps) {
    const templateId = coverLetter.settings?.templateId || 'classic';

    switch (templateId) {
        case 'modern':
            return <ModernTemplate coverLetter={coverLetter} />;
        case 'minimal':
            return <MinimalTemplate coverLetter={coverLetter} />;
        case 'executive':
            return <ExecutiveTemplate coverLetter={coverLetter} />;
        case 'clean':
            return <CleanTemplate coverLetter={coverLetter} />;
        case 'management':
            return <ManagementTemplate coverLetter={coverLetter} />;
        case 'classic':
        default:
            return <ClassicTemplate coverLetter={coverLetter} />;
    }
}
