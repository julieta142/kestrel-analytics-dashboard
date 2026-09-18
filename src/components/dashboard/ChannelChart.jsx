import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { channelColors, chartTheme } from '../../lib/constants';
import { formatCurrency } from '../../lib/utils';

function ChannelTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-pop">
      <p className="text-xs text-muted">{item.name}</p>
      <p className="tnum text-sm font-medium text-ink">{formatCurrency(item.value)}</p>
    </div>
  );
}

export default function ChannelChart({ data }) {
  const { isDark } = useTheme();
  const t = isDark ? chartTheme.dark : chartTheme.light;
  const total = data.reduce((sum, row) => sum + row.value, 0);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row lg:flex-col xl:flex-row">
      <div className="relative h-[168px] w-[168px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={54}
              outerRadius={78}
              paddingAngle={2}
              stroke={t.tooltipBg}
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={channelColors[index % channelColors.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChannelTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xs text-muted">Total</span>
          <span className="tnum text-sm font-semibold text-ink">
            {formatCurrency(total, { compact: true })}
          </span>
        </div>
      </div>

      <ul className="w-full space-y-2.5">
        {data.map((entry, index) => (
          <li key={entry.name} className="flex items-center gap-2.5 text-xs">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: channelColors[index % channelColors.length] }}
            />
            <span className="truncate text-muted">{entry.name}</span>
            <span className="tnum ml-auto font-medium text-ink">
              {Math.round((entry.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
