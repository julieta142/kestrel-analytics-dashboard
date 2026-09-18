# Kestrel — Revenue Analytics Dashboard

A revenue analytics console for a subscription billing product. Built to demonstrate
production-grade React: a real data layer, loading/empty/error states, responsive tables,
theme-aware charts, and keyboard-accessible components.

**Live demo:** _add your Vercel URL here_

![Kestrel dashboard](docs/screenshot-light.png)

## What it does

- **Period comparison** — every headline metric is compared against the previous period of
  equal length, so a 30-day view is measured against the 30 days before it.
- **Linked filtering** — changing the date range refetches the summary, both charts, the
  channel breakdown and the invoice table together.
- **Invoice table** — debounced search across customer, email and invoice ID; status filter;
  sortable columns; server-style pagination; row detail in a slide-over panel.
- **Responsive by layout, not by scroll** — the table becomes a card list below `md` rather
  than scrolling sideways. The sidebar becomes a slide-over below `lg`.
- **Theme** — light and dark, following the system setting on first visit and remembered
  after that. Charts read their colors from the active theme.
- **States** — skeletons on every request, an empty state with a filter reset, and an error
  state with retry.

## Stack

React 18 · Vite · Tailwind CSS · React Router · Recharts · Framer Motion · Lucide

## Architecture

```
src/
├── components/
│   ├── ui/          Presentational primitives (Button, Card, Badge, Drawer, Skeleton…)
│   ├── layout/      AppShell, Sidebar, Topbar, PageHeader
│   └── dashboard/   Feature components (StatCard, charts, InvoicesTable)
├── context/         ThemeContext, ToastContext
├── hooks/           useAsync, useDebounce, useCountUp, useMediaQuery, useClickOutside
├── services/api.js  Single data-access layer
├── data/db.js       Seeded mock dataset
├── lib/             cn() helper, formatters, design constants
└── pages/           Overview, Invoices, Settings, NotFound
```

Three decisions worth calling out:

**All data access goes through `services/api.js`.** Components never import the dataset
directly. Swapping the mock for a real HTTP backend is a change to one file — the artificial
latency in that layer is what makes the skeleton states meaningful rather than decorative.

**Theme tokens are CSS custom properties.** `--canvas`, `--surface`, `--line`, `--ink` and
`--muted` are redefined under `.dark` and exposed to Tailwind as `bg-surface`, `text-ink` and
so on. Components carry no `dark:` variants for color, so dark mode can't drift out of sync.

**`useAsync` centralises request state.** Loading, error and stale-response guarding live in
one hook instead of being reimplemented in each component.

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run lint
```

## Deploying

Vercel: import the repository, framework preset **Vite**, build `npm run build`, output
`dist`. `vercel.json` rewrites all routes to `index.html` so deep links resolve.

Netlify: same build settings, plus a `public/_redirects` file containing
`/*  /index.html  200`.

## Notes

The dataset is generated from a fixed seed, so the numbers are identical on every visit —
useful for screenshots and for demoing without surprises.
