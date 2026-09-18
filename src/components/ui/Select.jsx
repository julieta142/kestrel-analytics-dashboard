import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Select({ className, options, ...props }) {
  return (
    <div className="relative">
      <select
        className={cn(
          'focus-ring h-9 w-full appearance-none rounded-lg border border-line bg-surface pl-3 pr-9 text-sm text-ink',
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
