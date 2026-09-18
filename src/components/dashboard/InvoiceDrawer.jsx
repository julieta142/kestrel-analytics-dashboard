import { Copy } from 'lucide-react';
import Drawer from '../ui/Drawer';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { statusTone } from '../../lib/constants';

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="text-right text-xs font-medium text-ink">{children}</dd>
    </div>
  );
}

export default function InvoiceDrawer({ invoice, onClose }) {
  const { toast } = useToast();

  const copyId = () => {
    navigator.clipboard?.writeText(invoice.id);
    toast(`Copied ${invoice.id}`);
  };

  return (
    <Drawer
      open={Boolean(invoice)}
      onClose={onClose}
      title="Invoice detail"
      footer={
        invoice ? (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1" onClick={copyId}>
              <Copy size={14} /> Copy ID
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => {
                toast(`Receipt sent to ${invoice.email}`);
                onClose();
              }}
            >
              Send receipt
            </Button>
          </div>
        ) : null
      }
    >
      {invoice ? (
        <>
          <div className="flex items-center gap-3 border-b border-line pb-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-iris-500/15 text-sm font-semibold text-iris-500">
              {invoice.customer
                .split(' ')
                .map((part) => part[0])
                .join('')}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{invoice.customer}</p>
              <p className="truncate text-xs text-muted">{invoice.email}</p>
            </div>
          </div>

          <div className="py-5">
            <p className="text-xs text-muted">Amount</p>
            <p className="tnum mt-1 text-2xl font-semibold tracking-tight text-ink">
              {formatCurrency(invoice.amount)}
            </p>
            <Badge tone={statusTone[invoice.status]} className="mt-2.5">
              {invoice.status}
            </Badge>
          </div>

          <dl className="divide-y divide-line border-t border-line">
            <Row label="Invoice">{invoice.id}</Row>
            <Row label="Plan">{invoice.plan}</Row>
            <Row label="Seats">{invoice.seats}</Row>
            <Row label="Acquisition channel">{invoice.channel}</Row>
            <Row label="Issued">{formatDateTime(invoice.createdAt)}</Row>
          </dl>
        </>
      ) : null}
    </Drawer>
  );
}
