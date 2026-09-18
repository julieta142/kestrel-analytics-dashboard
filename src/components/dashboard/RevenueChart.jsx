import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartTooltip from './ChartTooltip';
import { useTheme } from '../../context/ThemeContext';
import { chartTheme, series } from '../../lib/constants';
import { formatCurrency, formatDate } from '../../lib/utils';

export default function RevenueChart({ data }) {
  const { isDark } = useTheme();
  const t = isDark ? chartTheme.dark : chartTheme.light;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={series.primary} stopOpacity={0.28} />
            <stop offset="100%" stopColor={series.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={t.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => formatDate(value)}
          tick={{ fill: t.axis, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          minTickGap={28}
        />
        <YAxis
          tickFormatter={(value) => formatCurrency(value, { compact: true })}
          tick={{ fill: t.axis, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={56}
        />
        <Tooltip content={<ChartTooltip currency />} cursor={{ stroke: t.grid }} />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke={series.primary}
          strokeWidth={2}
          fill="url(#revenueFill)"
          activeDot={{ r: 4, strokeWidth: 2, stroke: t.tooltipBg }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
