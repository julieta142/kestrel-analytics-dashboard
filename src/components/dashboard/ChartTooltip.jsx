import { formatCurrency, formatDate, formatNumber } from '../../lib/utils';

/** Shared tooltip so every chart reads the same way. */
export default function ChartTooltip({ active, payload, label, currency = false }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-pop">
      <p className="text-2xs font-medium text-muted">
        {label ? formatDate(label, { weekday: 'short', month: 'short', day: 'numeric' }) : ''}
      </p>
      <div className="mt-1.5 space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted">{entry.name}</span>
            <span className="tnum ml-auto font-medium text-ink">
              {currency ? formatCurrency(entry.value) : formatNumber(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
