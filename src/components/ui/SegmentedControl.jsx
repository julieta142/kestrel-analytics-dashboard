import { cn } from '../../lib/utils';

/** Compact radio group used for the date range. Keyboard-navigable via real buttons. */
export default function SegmentedControl({ options, value, onChange, label }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex rounded-lg border border-line bg-surface p-0.5"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'focus-ring rounded-[7px] px-3 py-1.5 text-xs font-medium transition-colors',
              active ? 'bg-ink text-canvas' : 'text-muted hover:text-ink',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
