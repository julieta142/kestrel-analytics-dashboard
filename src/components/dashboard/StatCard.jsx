import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import Skeleton from '../ui/Skeleton';
import { useCountUp } from '../../hooks/useCountUp';
import { cn, formatCurrency, formatNumber } from '../../lib/utils';

function render(value, format) {
  if (format === 'currency') return formatCurrency(value);
  if (format === 'percent') return `${value.toFixed(2)}%`;
  return formatNumber(Math.round(value));
}

export function StatCardSkeleton() {
  return (
    <Card className="p-5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-8 w-32" />
      <Skeleton className="mt-4 h-3 w-40" />
    </Card>
  );
}

export default function StatCard({ label, metric, rangeLabel }) {
  const animated = useCountUp(metric.value);
  const positive = metric.delta >= 0;
  const Trend = positive ? TrendingUp : TrendingDown;

  return (
    <Card className="p-5">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="tnum mt-3 text-[1.75rem] font-semibold leading-none tracking-tight text-ink">
        {render(animated, metric.format)}
      </p>
      <div className="mt-4 flex items-center gap-1.5 text-xs">
        <span
          className={cn(
            'tnum inline-flex items-center gap-1 font-medium',
            positive ? 'text-brand-600 dark:text-brand-400' : 'text-red-500',
          )}
        >
          <Trend size={13} strokeWidth={2.4} />
          {Math.abs(metric.delta).toFixed(1)}%
        </span>
        <span className="text-muted">vs previous {rangeLabel}</span>
      </div>
    </Card>
  );
}
