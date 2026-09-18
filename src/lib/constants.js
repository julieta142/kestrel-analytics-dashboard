/** Chart colors are resolved in JS because SVG fills can't read Tailwind classes. */
export const chartTheme = {
  light: {
    grid: '#e4e4e7',
    axis: '#71717a',
    tooltipBg: '#ffffff',
    tooltipBorder: '#e4e4e7',
    tooltipText: '#18181b',
  },
  dark: {
    grid: '#27272a',
    axis: '#94949e',
    tooltipBg: '#18181b',
    tooltipBorder: '#3f3f46',
    tooltipText: '#f4f4f5',
  },
};

export const series = {
  primary: '#12a594',
  secondary: '#6e56cf',
};

export const channelColors = ['#12a594', '#6e56cf', '#f5a524', '#8b78dd', '#71717a'];

export const dateRanges = [
  { value: '7d', label: '7 days', days: 7 },
  { value: '30d', label: '30 days', days: 30 },
  { value: '90d', label: '90 days', days: 90 },
];

export const statusTone = {
  paid: 'success',
  pending: 'warning',
  refunded: 'neutral',
  failed: 'danger',
};
