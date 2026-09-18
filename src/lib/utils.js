import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge conditional class names without Tailwind conflicts. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value, { compact = false } = {}) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);

export const formatNumber = (value, { compact = false } = {}) =>
  new Intl.NumberFormat('en-US', {
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);

export const formatPercent = (value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

export const formatDate = (iso, opts = { month: 'short', day: 'numeric' }) =>
  new Intl.DateTimeFormat('en-US', opts).format(new Date(iso));

export const formatDateTime = (iso) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso));
