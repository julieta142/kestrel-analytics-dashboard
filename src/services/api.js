/**
 * Single data-access layer.
 * Every component talks to the app through these functions, so swapping the mock
 * dataset for a real HTTP backend means editing this file and nothing else.
 */
import { timeline, orders, channels } from '../data/db';
import { dateRanges } from '../lib/constants';

const LATENCY = [220, 520];
const wait = () =>
  new Promise((resolve) =>
    setTimeout(resolve, LATENCY[0] + Math.random() * (LATENCY[1] - LATENCY[0])),
  );

const daysFor = (range) => dateRanges.find((r) => r.value === range)?.days ?? 30;

const sum = (rows, key) => rows.reduce((total, row) => total + row[key], 0);

const delta = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

/** Headline metrics plus period-over-period change. */
export async function getSummary(range) {
  await wait();
  const days = daysFor(range);
  const current = timeline.slice(-days);
  const previous = timeline.slice(-days * 2, -days);

  const build = (key, format) => ({
    value: sum(current, key),
    delta: delta(sum(current, key), sum(previous, key)),
    format,
  });

  const conversion = (rows) => (sum(rows, 'orders') / sum(rows, 'visitors')) * 100;

  return {
    revenue: build('revenue', 'currency'),
    orders: build('orders', 'number'),
    visitors: build('visitors', 'number'),
    conversion: {
      value: conversion(current),
      delta: delta(conversion(current), conversion(previous)),
      format: 'percent',
    },
  };
}

export async function getTimeline(range) {
  await wait();
  return timeline.slice(-daysFor(range));
}

/** Revenue split by acquisition channel, largest first. */
export async function getChannelBreakdown(range) {
  await wait();
  const days = daysFor(range);
  const cutoff = timeline[timeline.length - days].date;
  const scoped = orders.filter((o) => o.createdAt.slice(0, 10) >= cutoff && o.status === 'paid');

  return channels
    .map((name) => ({
      name,
      value: scoped.filter((o) => o.channel === name).reduce((t, o) => t + o.amount, 0),
    }))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value);
}

const SETTINGS_KEY = 'kestrel-settings';

export const defaultSettings = {
  name: 'Leila Rahimi',
  email: 'leila@kestrel.app',
  weekly: true,
  anomalies: false,
};

/** Workspace settings, restored from the last save. */
export async function getSettings() {
  await wait();
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return { ...defaultSettings };
    return { ...defaultSettings, ...JSON.parse(stored) };
  } catch {
    // Corrupt or unavailable storage should not break the page.
    return { ...defaultSettings };
  }
}

/** Persist workspace settings and echo back what was stored. */
export async function saveSettings(settings) {
  await wait();
  const merged = { ...defaultSettings, ...settings };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  } catch {
    throw new Error('Settings could not be stored on this device.');
  }
  return merged;
}

/** Paginated, searchable, sortable invoice list. */
export async function getOrders({
  range = '30d',
  search = '',
  status = 'all',
  sortKey = 'createdAt',
  sortDir = 'desc',
  page = 1,
  pageSize = 8,
} = {}) {
  await wait();
  const days = daysFor(range);
  const cutoff = timeline[timeline.length - days].date;
  const term = search.trim().toLowerCase();

  let rows = orders.filter((o) => o.createdAt.slice(0, 10) >= cutoff);
  if (status !== 'all') rows = rows.filter((o) => o.status === status);
  if (term) {
    rows = rows.filter(
      (o) =>
        o.customer.toLowerCase().includes(term) ||
        o.email.toLowerCase().includes(term) ||
        o.id.toLowerCase().includes(term),
    );
  }

  rows = [...rows].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    const [x, y] = [a[sortKey], b[sortKey]];
    if (typeof x === 'number') return (x - y) * dir;
    return String(x).localeCompare(String(y)) * dir;
  });

  const total = rows.length;
  const start = (page - 1) * pageSize;

  return {
    rows: rows.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}
