import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an ISO date string.
 * - `relative` → "3 hours ago"
 * - default   → "Mar 9, 2026"
 */
export function formatDate(
  dateStr: string | Date | undefined | null,
  mode: 'relative' | 'short' | 'long' = 'short',
): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  if (mode === 'relative') {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  if (mode === 'long') {
    return format(date, 'MMMM d, yyyy');
  }
  return format(date, 'MMM d, yyyy');
}

/**
 * Display a credit amount with proper pluralisation.
 * `formatCredits(5)` → "5 credits"
 * `formatCredits(1)` → "1 credit"
 */
export function formatCredits(n: number): string {
  return `${n} ${n === 1 ? 'credit' : 'credits'}`;
}
