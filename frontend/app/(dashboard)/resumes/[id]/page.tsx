import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Resume Details' };

export default async function ResumeDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Resume Preview</h1>
            <p className="text-sm text-muted-foreground">
                Viewing resume <code>{id}</code>
            </p>
            {/* <ResumePreview id={id} /> */}
        </div>
    );
}
