/**
 * Deterministic mock dataset.
 * Seeded so every visitor sees identical numbers — screenshots and demos stay stable.
 */

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260119);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const between = (min, max) => min + rand() * (max - min);

const FIRST = ['Amara', 'Tomas', 'Leila', 'Diego', 'Hana', 'Noor', 'Felix', 'Ingrid', 'Rustam', 'Mei', 'Jonas', 'Sofia', 'Kaveh', 'Elena', 'Marcus', 'Priya'];
const LAST = ['Okafor', 'Halvorsen', 'Bergman', 'Navarro', 'Sasaki', 'Rahimi', 'Weiss', 'Lindqvist', 'Aliyev', 'Chen', 'Moreau', 'Petrova', 'Ismailov', 'Vargas', 'Doyle', 'Nair'];
const PLANS = [
  { name: 'Starter', price: 29 },
  { name: 'Growth', price: 119 },
  { name: 'Scale', price: 349 },
  { name: 'Enterprise', price: 890 },
];
const CHANNELS = ['Direct', 'Organic search', 'Referral', 'Paid social', 'Email'];
const STATUSES = ['paid', 'paid', 'paid', 'paid', 'paid', 'pending', 'refunded', 'failed'];

const DAYS = 120;

/** One row per day, with a gentle upward trend plus weekday seasonality. */
function buildTimeline() {
  const out = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = DAYS - 1; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dayOfWeek = date.getDay();
    const weekendDip = dayOfWeek === 0 || dayOfWeek === 6 ? 0.68 : 1;
    const growth = 1 + (DAYS - i) / DAYS / 2.2;
    const noise = between(0.86, 1.14);

    const visitors = Math.round(1450 * growth * weekendDip * noise);
    const signups = Math.round(visitors * between(0.031, 0.055));
    const orders = Math.round(signups * between(0.38, 0.6));
    const revenue = Math.round(orders * between(96, 168));

    out.push({ date: date.toISOString().slice(0, 10), visitors, signups, orders, revenue });
  }
  return out;
}

function buildOrders(timeline) {
  const out = [];
  let counter = 4820;

  timeline.forEach((day) => {
    // A representative sample rather than every transaction — keeps the demo light.
    const count = Math.max(1, Math.round(day.orders / 7));
    for (let i = 0; i < count; i += 1) {
      const plan = pick(PLANS);
      const first = pick(FIRST);
      const last = pick(LAST);
      const seats = plan.name === 'Enterprise' ? Math.ceil(between(3, 9)) : Math.ceil(between(1, 4));
      const hour = Math.floor(between(7, 22));
      const minute = Math.floor(between(0, 59));
      counter += 1;

      out.push({
        id: `INV-${counter}`,
        customer: `${first} ${last}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}@${pick(['northwind.io', 'lumenlabs.co', 'brightfold.com', 'setbase.dev', 'orrery.app'])}`,
        plan: plan.name,
        seats,
        amount: plan.price * seats,
        status: pick(STATUSES),
        channel: pick(CHANNELS),
        createdAt: `${day.date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`,
      });
    }
  });

  return out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export const timeline = buildTimeline();
export const orders = buildOrders(timeline);
export const channels = CHANNELS;
export const plans = PLANS.map((p) => p.name);
