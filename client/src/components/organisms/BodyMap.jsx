import { regionsFor } from '../../lib/guide.js';
import styles from './BodyMap.module.css';

// Shapes are drawn for the left half (x < 100) and mirrored. `region` null = non-muscle base.
const E = (cx, cy, rx, ry, rot = 0) => ({ el: 'ellipse', cx, cy, rx, ry, transform: rot ? `rotate(${rot} ${cx} ${cy})` : undefined });
const P = (d) => ({ el: 'path', d });
const R = (x, y, width, height, rx) => ({ el: 'rect', x, y, width, height, rx });

const SHARED_CENTER = [
  { region: null, ...E(100, 30, 17, 21) },
  { region: null, ...P('M92 48 h16 v16 h-16z') },
];

const LIMB_BASE = [
  { region: null, ...E(44, 208, 7, 11) }, // hand
  { region: null, ...E(84, 286, 10, 9) }, // knee
  { region: null, ...E(85, 400, 10, 7) }, // foot
];

const FRONT = {
  center: [...SHARED_CENTER, { region: null, ...P('M76 176 Q100 188 124 176 L120 202 Q100 212 80 202 Z') }],
  side: [
    ...LIMB_BASE,
    { region: 'delts', ...P('M84 64 Q64 62 56 78 Q52 92 56 102 Q66 88 80 84 Z') },
    { region: 'chest', ...P('M99 70 L99 112 Q88 118 75 110 Q67 100 71 86 Q79 72 99 70 Z') },
    { region: 'biceps', ...E(56, 126, 9, 20, 8) },
    { region: 'forearms', ...E(48, 172, 8, 24, 10) },
    { region: 'abs', ...R(88, 117, 11, 58, 4) },
    { region: 'obliques', ...P('M85 118 Q74 124 76 150 Q78 168 85 176 Z') },
    { region: 'quads', ...E(84, 240, 15, 40, -4) },
    { region: 'adductors', ...E(96, 226, 4.5, 24) },
    { region: 'calves', ...E(84, 336, 9, 38) },
  ],
};

const BACK = {
  center: SHARED_CENTER,
  side: [
    ...LIMB_BASE,
    { region: 'rearDelts', ...P('M84 64 Q64 62 56 78 Q52 92 56 102 Q66 88 80 84 Z') },
    { region: 'traps', ...P('M99 50 L99 114 Q92 98 82 84 Q74 76 78 69 Q90 64 99 50 Z') },
    { region: 'lats', ...P('M80 92 Q70 110 76 142 Q84 160 98 166 L98 120 Q90 104 80 92 Z') },
    { region: 'triceps', ...E(56, 126, 9, 20, 8) },
    { region: 'forearms', ...E(48, 172, 8, 24, 10) },
    { region: 'lowerBack', ...R(89, 162, 9, 24, 4) },
    { region: 'glutes', ...E(86, 206, 15, 18) },
    { region: 'hamstrings', ...E(85, 256, 13, 32) },
    { region: 'calves', ...E(85, 334, 11, 34) },
  ],
};

function Shape({ shape, state }) {
  const { el: Tag, region, ...props } = shape;
  return <Tag {...props} className={styles[state]} />;
}

function Figure({ view, label, regions }) {
  const stateOf = (region) =>
    region && regions.primary.has(region) ? 'primary' : region && regions.secondary.has(region) ? 'secondary' : 'base';
  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>{label}</figcaption>
      <svg viewBox="0 0 200 412" className={styles.svg} aria-hidden="true">
        {view.center.map((s, i) => (
          <Shape key={`c${i}`} shape={s} state={stateOf(s.region)} />
        ))}
        <g>
          {view.side.map((s, i) => (
            <Shape key={`l${i}`} shape={s} state={stateOf(s.region)} />
          ))}
        </g>
        <g transform="translate(200 0) scale(-1 1)">
          {view.side.map((s, i) => (
            <Shape key={`r${i}`} shape={s} state={stateOf(s.region)} />
          ))}
        </g>
      </svg>
    </figure>
  );
}

/** Front and back figures with primary and secondary muscles highlighted. Muscle names are also listed as text. */
export default function BodyMap({ primary, secondary }) {
  const regions = regionsFor(primary, secondary);
  return (
    <div className={styles.map}>
      <div className={styles.header}>
        <span className={styles.title}>Body map</span>
        <span className={styles.legend}>
          <span className={styles.key}>
            <span className={`${styles.swatch} ${styles.primary}`} aria-hidden="true" /> Primary
          </span>
          <span className={styles.key}>
            <span className={`${styles.swatch} ${styles.secondary}`} aria-hidden="true" /> Secondary
          </span>
        </span>
      </div>
      <div className={styles.figures}>
        <Figure view={FRONT} label="Front" regions={regions} />
        <Figure view={BACK} label="Back" regions={regions} />
      </div>
      <dl className={styles.muscles}>
        <div>
          <dt>Primary</dt>
          <dd>{primary}</dd>
        </div>
        <div>
          <dt>Secondary</dt>
          <dd>{secondary.length ? secondary.join(', ') : 'None'}</dd>
        </div>
      </dl>
    </div>
  );
}
