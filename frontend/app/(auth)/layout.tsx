import { RedirectIfAuthenticated } from '@/components/auth/RedirectIfAuthenticated';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RedirectIfAuthenticated>
            <PublicHeader />
            <div className="flex min-h-screen items-center justify-center bg-muted/40">
                <div className="w-full max-w-md px-4">{children}</div>
            </div>
        </RedirectIfAuthenticated>
    );
}
