import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="tnum text-sm font-medium text-muted">404</p>
      <h1 className="mt-2 text-xl font-semibold tracking-tight text-ink">Page not found</h1>
      <p className="mt-1 max-w-xs text-sm text-muted">
        That route does not exist in this workspace.
      </p>
      <Link
        to="/"
        className="focus-ring mt-5 inline-flex h-9 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
      >
        Back to overview
      </Link>
    </div>
  );
}
