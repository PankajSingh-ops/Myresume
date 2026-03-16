'use client';

import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthMeterProps {
    password: string;
}

const rules = [
    { label: 'Min 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'Number', test: (p: string) => /\d/.test(p) },
    { label: 'Special character', test: (p: string) => /[@$!%*?&]/.test(p) },
];

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
    if (!password) return null;

    const passed = rules.filter((r) => r.test(password)).length;
    const strength = passed / rules.length;

    return (
        <div className="space-y-2 pt-1">
            {/* Strength bar */}
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            'h-1 flex-1 rounded-full transition-colors',
                            i < passed
                                ? strength <= 0.4
                                    ? 'bg-red-500'
                                    : strength <= 0.7
                                        ? 'bg-yellow-500'
                                        : 'bg-green-500'
                                : 'bg-muted',
                        )}
                    />
                ))}
            </div>

            {/* Rule checklist */}
            <ul className="space-y-0.5">
                {rules.map(({ label, test }) => {
                    const met = test(password);
                    return (
                        <li
                            key={label}
                            className={cn(
                                'flex items-center gap-1.5 text-xs transition-colors',
                                met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground',
                            )}
                        >
                            {met ? (
                                <Check className="h-3 w-3" />
                            ) : (
                                <X className="h-3 w-3" />
                            )}
                            {label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
