import { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import SegmentedControl from '../components/ui/SegmentedControl';
import InvoicesTable from '../components/dashboard/InvoicesTable';
import { dateRanges } from '../lib/constants';

export default function Invoices() {
  const [range, setRange] = useState('30d');

  return (
    <>
      <PageHeader
        title="Invoices"
        description="Search, sort and inspect every invoice in the period."
        action={
          <SegmentedControl
            label="Date range"
            options={dateRanges}
            value={range}
            onChange={setRange}
          />
        }
      />
      <InvoicesTable range={range} title="All invoices" />
    </>
  );
}
