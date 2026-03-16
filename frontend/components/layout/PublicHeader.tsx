'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function PublicHeader() {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-14 md:h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <FileText className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <span className="font-bold text-base md:text-lg truncate">Resume Builder</span>
        </Link>
        
        <div className="flex items-center gap-1 md:gap-3">
          {/* Theme Toggle */}
          <div className="flex items-center justify-center w-9 h-9">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {!mounted || theme === 'light' ? (
                <Sun className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              ) : (
                <Moon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              )}
            </Button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Action */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 text-muted-foreground" /> : <Menu className="h-5 w-5 text-muted-foreground" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3 shadow-md animate-in slide-in-from-top-2">
          <Link
            href="/login"
            className="flex w-full justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="flex w-full justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started Free
          </Link>
        </div>
      )}
    </header>
  );
}
