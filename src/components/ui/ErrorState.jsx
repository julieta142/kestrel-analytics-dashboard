import { AlertTriangle, RotateCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ onRetry, description = 'The request did not complete.' }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/12 text-red-500">
        <AlertTriangle size={18} />
      </span>
      <p className="text-sm font-medium text-ink">Could not load this data</p>
      <p className="mt-1 max-w-xs text-xs text-muted">{description}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          <RotateCw size={14} /> Try again
        </Button>
      ) : null}
    </div>
  );
}
