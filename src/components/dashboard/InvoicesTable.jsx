import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import InvoiceDrawer from './InvoiceDrawer';
import { useAsync } from '../../hooks/useAsync';
import { useDebounce } from '../../hooks/useDebounce';
import { getOrders } from '../../services/api';
import { statusTone } from '../../lib/constants';
import { cn, formatCurrency, formatDate } from '../../lib/utils';

const statusOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'failed', label: 'Failed' },
];

const columns = [
  { key: 'id', label: 'Invoice', sortable: false, className: 'w-[7.5rem]' },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'plan', label: 'Plan', sortable: true, className: 'w-28' },
  { key: 'amount', label: 'Amount', sortable: true, className: 'w-28 text-right' },
  { key: 'status', label: 'Status', sortable: true, className: 'w-28' },
  { key: 'createdAt', label: 'Date', sortable: true, className: 'w-28 text-right' },
];

export default function InvoicesTable({ range, compact = false, title, description }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState({ key: 'createdAt', dir: 'desc' });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const debouncedSearch = useDebounce(search);
  const pageSize = compact ? 5 : 8;

  // Any change to the query resets pagination, otherwise page 4 of 2 shows nothing.
  useEffect(() => setPage(1), [debouncedSearch, status, range, sort]);

  const { data, loading, error, reload } = useAsync(
    () =>
      getOrders({
        range,
        search: debouncedSearch,
        status,
        sortKey: sort.key,
        sortDir: sort.dir,
        page,
        pageSize,
      }),
    [range, debouncedSearch, status, sort.key, sort.dir, page, pageSize],
  );

  const toggleSort = (key) =>
    setSort((current) =>
      current.key === key
        ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'desc' },
    );

  const rows = data?.rows ?? [];
  const showEmpty = !loading && !error && rows.length === 0;

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader
          title={title}
          description={description}
          action={
            !compact ? null : (
              <span className="tnum shrink-0 text-xs text-muted">
                {data ? `${data.total} total` : ''}
              </span>
            )
          }
        />

        {!compact ? (
          <div className="flex flex-col gap-2 border-b border-line p-4 sm:flex-row">
            <Input
              icon={Search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by customer, email or invoice"
              aria-label="Search invoices"
              className="sm:max-w-sm"
            />
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              options={statusOptions}
              aria-label="Filter by status"
              className="sm:w-44"
            />
          </div>
        ) : null}

        {error ? <ErrorState onRetry={reload} /> : null}
        {showEmpty ? (
          <EmptyState
            title="No invoices match"
            description="Try a different search term, or clear the status filter."
            actionLabel={search || status !== 'all' ? 'Clear filters' : undefined}
            onAction={() => {
              setSearch('');
              setStatus('all');
            }}
          />
        ) : null}

        {!error && !showEmpty ? (
          <>
            {/* Table layout from md up — the compact variant is always a list,
                because six columns cannot fit a one-third-width column. */}
            <div className={cn('overflow-x-auto', compact ? 'hidden' : 'hidden md:block')}>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line">
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className={cn(
                          'whitespace-nowrap px-5 py-2.5 text-xs font-medium text-muted',
                          column.className,
                        )}
                      >
                        {column.sortable ? (
                          <button
                            type="button"
                            onClick={() => toggleSort(column.key)}
                            className={cn(
                              'focus-ring inline-flex items-center gap-1 rounded transition-colors hover:text-ink',
                              sort.key === column.key && 'text-ink',
                              column.className?.includes('text-right') && 'flex-row-reverse',
                            )}
                          >
                            {column.label}
                            {sort.key === column.key ? (
                              sort.dir === 'asc' ? (
                                <ArrowUp size={12} />
                              ) : (
                                <ArrowDown size={12} />
                              )
                            ) : null}
                          </button>
                        ) : (
                          column.label
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {loading
                    ? Array.from({ length: pageSize }).map((_, index) => (
                        <tr key={index}>
                          {columns.map((column) => (
                            <td key={column.key} className="px-5 py-3.5">
                              <Skeleton className="h-3.5 w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : rows.map((row) => (
                        <tr
                          key={row.id}
                          tabIndex={0}
                          role="button"
                          onClick={() => setSelected(row)}
                          onKeyDown={(event) => event.key === 'Enter' && setSelected(row)}
                          className="focus-ring cursor-pointer transition-colors hover:bg-line/30"
                        >
                          <td className="tnum whitespace-nowrap px-5 py-3.5 text-xs text-muted">{row.id}</td>
                          <td className="px-5 py-3.5">
                            <p className="truncate font-medium text-ink">{row.customer}</p>
                            <p className="truncate text-xs text-muted">{row.email}</p>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-muted">{row.plan}</td>
                          <td className="tnum px-5 py-3.5 text-right font-medium text-ink">
                            {formatCurrency(row.amount)}
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge tone={statusTone[row.status]}>{row.status}</Badge>
                          </td>
                          <td className="tnum px-5 py-3.5 text-right text-xs text-muted">
                            {formatDate(row.createdAt)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {/* Cards below md — a horizontally scrolling table is unusable on a phone */}
            <ul className={cn('divide-y divide-line', !compact && 'md:hidden')}>
              {loading
                ? Array.from({ length: pageSize }).map((_, index) => (
                    <li key={index} className="p-4">
                      <Skeleton className="h-3.5 w-32" />
                      <Skeleton className="mt-2 h-3 w-44" />
                    </li>
                  ))
                : rows.map((row) => (
                    <li key={row.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(row)}
                        className="focus-ring w-full px-4 py-3.5 text-left transition-colors hover:bg-line/30"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-ink">{row.customer}</p>
                            <p className="tnum truncate text-xs text-muted">
                              {row.id} · {formatDate(row.createdAt)}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="tnum text-sm font-medium text-ink">
                              {formatCurrency(row.amount)}
                            </p>
                            <Badge tone={statusTone[row.status]} className="mt-1">
                              {row.status}
                            </Badge>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
            </ul>

            {!compact && data ? (
              <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
                <p className="tnum text-xs text-muted">
                  Page {data.page} of {data.pageCount} · {data.total} invoices
                </p>
                <div className="flex gap-1.5">
                  <Button
                    variant="secondary"
                    size="iconSm"
                    aria-label="Previous page"
                    disabled={page <= 1 || loading}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft size={15} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="iconSm"
                    aria-label="Next page"
                    disabled={page >= data.pageCount || loading}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight size={15} />
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </Card>

      <InvoiceDrawer invoice={selected} onClose={() => setSelected(null)} />
    </>
  );
}
