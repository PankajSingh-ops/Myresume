'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    LayoutTemplate,
    Coins,
    Settings,
    X,
    DollarSign,
    ScanSearch,
    BookOpen,
} from 'lucide-react';
import { cn, formatCredits } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { useCreditsStore } from '@/store/creditsStore';
import { Button } from '@/components/ui/button';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/resumes', label: 'My Resumes', icon: FileText },
    { href: '/resumes/templates', label: 'Resume Templates', icon: LayoutTemplate },
    { href: '/cover-letters', label: 'My Cover Letters', icon: BookOpen },
    { href: '/cover-letters/templates', label: 'Cover Letter Templates', icon: LayoutTemplate },
    { href: '/ats-scanner', label: 'ATS Scanner', icon: ScanSearch },
    { href: '/credits', label: 'Credits', icon: Coins, showBalance: true },
    { href: '/pricing', label: 'Pricing', icon: DollarSign },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const sidebarOpen = useUIStore((s) => s.sidebarOpen);
    const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
    const balance = useCreditsStore((s) => s.balance);

    // Hide sidebar entirely on the resume/cover-letter editor page
    if (
        (pathname.startsWith('/resumes/') && pathname.endsWith('/edit')) ||
        (pathname.startsWith('/cover-letters/') && pathname.endsWith('/edit'))
    ) {
        return null;
    }

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b px-6">
                    <Link
                        href="/dashboard"
                        className="text-xl font-bold tracking-tight text-sidebar-foreground"
                    >
                        MyResume
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4">
                    {navItems.map(({ href, label, icon: Icon, showBalance }) => {
                        const isExact = pathname === href;
                        const isPrefix = pathname.startsWith(`${href}/`);
                        // Only highlight via prefix if no other nav item is a more specific match
                        const hasMoreSpecificMatch = navItems.some(
                            (other) => other.href !== href && other.href.startsWith(`${href}/`) && (pathname === other.href || pathname.startsWith(`${other.href}/`))
                        );
                        const isActive = isExact || (isPrefix && !hasMoreSpecificMatch);

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                                )}
                                onClick={() => {
                                    if (window.innerWidth < 1024) setSidebarOpen(false);
                                }}
                            >
                                <span className="flex items-center gap-3">
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </span>
                                {showBalance && balance !== null && (
                                    <span className="text-xs tabular-nums text-muted-foreground">
                                        {formatCredits(balance)}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
