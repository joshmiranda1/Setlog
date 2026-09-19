const kgFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
const intFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

export const formatKg = (kg) => `${kgFormatter.format(kg)} kg`;
export const formatVolume = (kg) => `${intFormatter.format(kg)} kg`;
const compactFormatter = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 });

export const formatNumber = (n) => intFormatter.format(n);
export const formatDecimal = (n) => kgFormatter.format(n);
export const formatCompact = (n) => (n >= 10_000 ? compactFormatter.format(n) : intFormatter.format(n));

export const formatSet = (set) => (set.weight > 0 ? `${set.reps} × ${formatKg(set.weight)}` : `${set.reps} reps`);

export const formatLongDate = (date) =>
  new Date(date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

export const formatShortDate = (date) =>
  new Date(date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });

export const formatAxisDate = (date) => new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

export function relativeDay(date) {
  const start = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((start(new Date()) - start(new Date(date))) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
}

/** "bench PRESS" -> "Bench Press". Mirrors titleCase() in server/src/http.js, which is the source of truth. */
export const titleCase = (text) =>
  text
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

export const plural =(n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
