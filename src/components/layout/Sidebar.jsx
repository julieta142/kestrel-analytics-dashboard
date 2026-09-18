import { NavLink } from 'react-router-dom';
import { BarChart3, Receipt, Settings, Bird, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const navigation = [
  { to: '/', label: 'Overview', icon: BarChart3, end: true },
  { to: '/invoices', label: 'Invoices', icon: Receipt },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex h-14 items-center gap-2.5 border-b border-line px-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Bird size={16} strokeWidth={2.2} />
        </span>
        <span className="text-sm font-semibold tracking-tight text-ink">Kestrel</span>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {navigation.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-line/70 text-ink' : 'text-muted hover:bg-line/40 hover:text-ink',
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 rounded-lg border border-line p-4">
        <p className="text-xs font-medium text-ink">Trial ends in 9 days</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Keep your reports and add unlimited seats.
        </p>
        <a
          href="#pricing"
          className="focus-ring mt-3 inline-flex items-center gap-1 rounded text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          Compare plans
          <ArrowUpRight size={13} />
        </a>
      </div>
    </div>
  );
}
