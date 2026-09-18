import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartTooltip from './ChartTooltip';
import { useTheme } from '../../context/ThemeContext';
import { chartTheme, series } from '../../lib/constants';
import { formatDate, formatNumber } from '../../lib/utils';

export default function TrafficChart({ data }) {
  const { isDark } = useTheme();
  const t = isDark ? chartTheme.dark : chartTheme.light;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
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
          tickFormatter={(value) => formatNumber(value, { compact: true })}
          tick={{ fill: t.axis, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={56}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: t.grid }} />
        <Line
          type="monotone"
          dataKey="visitors"
          name="Visitors"
          stroke={series.primary}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="signups"
          name="Signups"
          stroke={series.secondary}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
