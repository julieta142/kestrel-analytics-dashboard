import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(function Input({ className, icon: Icon, ...props }, ref) {
  return (
    <div className="relative">
      {Icon ? (
        <Icon
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
      ) : null}
      <input
        ref={ref}
        className={cn(
          'focus-ring h-9 w-full rounded-lg border border-line bg-surface text-sm text-ink placeholder:text-muted',
          Icon ? 'pl-9 pr-3' : 'px-3',
          className,
        )}
        {...props}
      />
    </div>
  );
});

export default Input;
