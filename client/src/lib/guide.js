import guide from '../data/workout-guide.json';

export const guideExercises = guide;
const bySlug = new Map(guide.map((g) => [g.slug, g]));
const byName = new Map(guide.map((g) => [g.name.toLowerCase(), g]));

export const getGuide = (slug) => bySlug.get(slug) ?? null;
export const frameUrl = (slug, index = 1) => `/workout-guide/${slug}/frame-${index}.svg`;

const TYPE_LABELS = {
  weight_reps: 'weight reps',
  bodyweight_reps: 'bodyweight reps',
  assisted_bodyweight: 'assisted bodyweight',
  duration: 'duration',
  distance_duration: 'distance & duration',
};
export const typeLabel = (type) => TYPE_LABELS[type] ?? type;

export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Library names (the seed data) that differ from the guide's names.
const ALIASES = {
  'chest fly': 'dumbbell-fly',
  'push-ups': 'push-up',
  'pull-ups': 'pull-up',
  'seated cable row': 'seated-row',
  'walking lunges': 'walking-lunge',
  'calf raises': 'standing-calf-raise',
  'lateral raises': 'lateral-raise',
  'face pulls': 'face-pull',
  'bicep curls': 'bicep-curl',
  'hammer curls': 'hammer-curl',
  'tricep dips': 'dip',
  'skull crushers': 'skull-crusher',
  'hanging leg raises': 'hanging-leg-raise',
};/**Added the code myself - 09/20/2026 */

/** Finds the guide entry illustrating a library exercise, by alias, exact name, or singular slug. */
export function findGuideFor(name) {
  const key = name.trim().toLowerCase();
  if (ALIASES[key]) return getGuide(ALIASES[key]);
  if (byName.has(key)) return byName.get(key);
  const slug = slugify(name);
  return getGuide(slug) ?? getGuide(slug.replace(/s(?=-|$)/g, ''));
}

/** The library muscle group a guide entry belongs in when added to "My library". */
export function libraryGroupFor(primary) {
  const groups = {
    Chest: ['Chest'],
    Back: ['Back', 'Lats', 'Upper Back', 'Lower Back', 'Posterior Chain'],
    Shoulders: ['Shoulders', 'Rear Delts'],
    Arms: ['Biceps', 'Triceps', 'Forearms'],
    Legs: ['Quads', 'Hamstrings', 'Glutes', 'Calves', 'Legs', 'Adductors', 'Hips'],
    Core: ['Core'],
  };
  return Object.keys(groups).find((g) => groups[g].includes(primary)) ?? primary;
}

export function searchGuide({ q = '', muscle = '', equipment = '' }) {
  const tokens = q.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  return guide.filter((g) => {
    if (muscle && g.primary !== muscle) return false;
    if (equipment && g.equipment !== equipment) return false;
    if (!tokens.length) return true;
    const text = `${g.name} ${g.equipment} ${g.primary} ${g.secondary.join(' ')}`.toLowerCase();
    return tokens.every((t) => text.includes(t));
  });
}

const uniqueSorted = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b));
export const guideMuscles = uniqueSorted(guide.map((g) => g.primary));
export const guideEquipment = uniqueSorted(guide.map((g) => g.equipment));

// Guide muscle names -> body-map regions (see BodyMap.jsx).
const REGIONS = {
  Chest: ['chest'],
  Shoulders: ['delts', 'rearDelts'],
  'Rear Delts': ['rearDelts'],
  'Upper Back': ['traps', 'rearDelts'],
  Back: ['lats', 'traps', 'lowerBack'],
  Lats: ['lats'],
  'Lower Back': ['lowerBack'],
  'Posterior Chain': ['hamstrings', 'glutes', 'lowerBack'],
  Biceps: ['biceps'],
  Triceps: ['triceps'],
  Forearms: ['forearms'],
  Grip: ['forearms'],
  Core: ['abs', 'obliques'],
  Quads: ['quads'],
  Hamstrings: ['hamstrings'],
  Glutes: ['glutes'],
  Calves: ['calves'],
  Legs: ['quads', 'hamstrings', 'calves'],
  Adductors: ['adductors'],
  Groin: ['adductors'],
  Hips: ['glutes', 'adductors'],
};

export function regionsFor(primary, secondary) {
  const p = new Set(REGIONS[primary] ?? []);
  const s = new Set(secondary.flatMap((m) => REGIONS[m] ?? []).filter((r) => !p.has(r)));
  return { primary: p, secondary: s };
}
