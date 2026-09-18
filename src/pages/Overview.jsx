import { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import SegmentedControl from '../components/ui/SegmentedControl';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import StatCard, { StatCardSkeleton } from '../components/dashboard/StatCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import TrafficChart from '../components/dashboard/TrafficChart';
import ChannelChart from '../components/dashboard/ChannelChart';
import InvoicesTable from '../components/dashboard/InvoicesTable';
import { useAsync } from '../hooks/useAsync';
import { getChannelBreakdown, getSummary, getTimeline } from '../services/api';
import { dateRanges } from '../lib/constants';

const metrics = [
  { key: 'revenue', label: 'Revenue' },
  { key: 'orders', label: 'Paid invoices' },
  { key: 'visitors', label: 'Visitors' },
  { key: 'conversion', label: 'Visitor to customer' },
];

export default function Overview() {
  const [range, setRange] = useState('30d');
  const rangeLabel = dateRanges.find((r) => r.value === range).label;

  const summary = useAsync(() => getSummary(range), [range]);
  const timeline = useAsync(() => getTimeline(range), [range]);
  const channels = useAsync(() => getChannelBreakdown(range), [range]);

  return (
    <>
      <PageHeader
        title="Overview"
        description={`Revenue and acquisition for the last ${rangeLabel}.`}
        action={
          <SegmentedControl
            label="Date range"
            options={dateRanges}
            value={range}
            onChange={setRange}
          />
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.loading || !summary.data
          ? metrics.map((metric) => <StatCardSkeleton key={metric.key} />)
          : metrics.map((metric) => (
              <StatCard
                key={metric.key}
                label={metric.label}
                metric={summary.data[metric.key]}
                rangeLabel={rangeLabel}
              />
            ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader title="Revenue" description={`Daily gross revenue, last ${rangeLabel}`} />
          <CardBody className="pr-2">
            {timeline.error ? (
              <ErrorState onRetry={timeline.reload} />
            ) : timeline.loading || !timeline.data ? (
              <Skeleton className="h-[260px] w-full" />
            ) : (
              <RevenueChart data={timeline.data} />
            )}
          </CardBody>
        </Card>

        <Card className="min-w-0">
          <CardHeader title="Revenue by channel" description="Paid invoices only" />
          <CardBody>
            {channels.error ? (
              <ErrorState onRetry={channels.reload} />
            ) : channels.loading || !channels.data ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ChannelChart data={channels.data} />
            )}
          </CardBody>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader title="Traffic and signups" description="Daily unique visitors and new accounts" />
          <CardBody className="pr-2">
            {timeline.error ? (
              <ErrorState onRetry={timeline.reload} />
            ) : timeline.loading || !timeline.data ? (
              <Skeleton className="h-[240px] w-full" />
            ) : (
              <TrafficChart data={timeline.data} />
            )}
          </CardBody>
        </Card>

        <div className="min-w-0 lg:col-span-1">
          <InvoicesTable
            range={range}
            compact
            title="Latest invoices"
            description="Select a row for detail"
          />
        </div>
      </div>
    </>
  );
}
