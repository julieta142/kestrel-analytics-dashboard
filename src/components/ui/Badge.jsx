import { cn } from '../../lib/utils';

const tones = {
  success: 'bg-brand-500/12 text-brand-700 dark:text-brand-400 ring-brand-500/25',
  warning: 'bg-amber-500/12 text-amber-700 dark:text-amber-400 ring-amber-500/25',
  danger: 'bg-red-500/12 text-red-700 dark:text-red-400 ring-red-500/25',
  neutral: 'bg-line/70 text-muted ring-line',
};

export default function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-medium capitalize ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
