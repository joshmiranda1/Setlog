import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatAxisDate, formatDecimal, formatNumber, formatSet, formatShortDate } from '../../lib/format.js';
import styles from './ProgressChart.module.css';

export const METRICS = {
  topWeight: { label: 'Top set', unit: 'kg', describe: 'heaviest single set', format: formatDecimal },
  volume: { label: 'Volume', unit: 'kg', describe: 'reps × kg across all sets', format: formatNumber },
  reps: { label: 'Total reps', unit: 'reps', describe: 'all sets combined', format: formatNumber },
};

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function ChartTooltip({ active, payload, metric }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const { unit, format } = METRICS[metric];
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDate}>{formatShortDate(point.date)}</p>
      <p className={styles.tooltipValue}>
        {format(point[metric])} {unit}
      </p>
      {metric !== 'topWeight' || point.best.weight === 0 ? null : (
        <p className={styles.tooltipMeta}>Best set {formatSet(point.best)}</p>
      )}
      <p className={styles.tooltipMeta}>{point.setCount} sets</p>
    </div>
  );
}

/** Line chart of one metric per session. `summary` is read to screen readers; the table carries the data. */
export default function ProgressChart({ points, metric, summary }) {
  const { unit, label } = METRICS[metric];
  return (
    <figure className={styles.figure} aria-label={`${label} chart. ${summary}`}>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 16, right: 24, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-hairline)" />
            <XAxis
              dataKey="date"
              tickFormatter={formatAxisDate}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
              minTickGap={24}
              tickMargin={8}
            />
            <YAxis
              width={48}
              domain={['auto', 'auto']}
              tickFormatter={(v) => formatNumber(v)}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              label={{
                value: unit,
                position: 'insideTopLeft',
                offset: 0,
                dy: -14,
                fill: 'var(--color-text-muted)',
                fontSize: 12,
              }}
            />
            <Tooltip
              content={<ChartTooltip metric={metric} />}
              cursor={{ stroke: 'var(--color-border)', strokeDasharray: '4 4' }}
            />
            <Line
              type="monotone"
              dataKey={metric}
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ r: 3.5, fill: 'var(--color-bg)', stroke: 'var(--color-primary)', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: 'var(--color-primary)', stroke: 'var(--color-bg)', strokeWidth: 2 }}
              isAnimationActive={!reducedMotion()}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
