'use client';

import { Menu, LogOut, ChevronDown, User, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useLogout } from '@/hooks/useAuth';
import { CreditBadge } from '@/components/credits/CreditBadge';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

export function Header() {
    const user = useAuthStore((s) => s.user);
    const toggleSidebar = useUIStore((s) => s.toggleSidebar);
    const logout = useLogout();
    const { theme, setTheme } = useTheme();

    const initials = user
        ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
        : '';

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            {/* Left — mobile menu toggle */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={toggleSidebar}
                >
                    <Menu className="h-5 w-5" />
                </Button>
                <span className="hidden text-lg font-semibold tracking-tight lg:block">
                    MyResume
                </span>
            </div>

            {/* Right — credits + theme toggle + user dropdown */}
            <div className="flex items-center gap-4">
                <CreditBadge />

                {/* Dark / Light mode toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="rounded-full"
                    aria-label="Toggle theme"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-accent transition-colors">
                            {/* Avatar circle */}
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                {initials}
                            </div>
                            {user && (
                                <span className="hidden text-sm font-medium sm:inline-block">
                                    {user.firstName}
                                </span>
                            )}
                            <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-48 p-1">
                        <div className="px-3 py-2 border-b">
                            <p className="text-sm font-medium">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {user?.email}
                            </p>
                        </div>
                        <Link
                            href="/profile"
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                        >
                            <User className="h-4 w-4" />
                            My Profile
                        </Link>
                        <button
                            onClick={() => logout.mutate()}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Log out
                        </button>
                    </PopoverContent>
                </Popover>
            </div>
        </header>
    );
}
