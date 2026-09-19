import { useEffect, useState } from 'react';
import { Pause, Play } from '@phosphor-icons/react';
import IconButton from '../atoms/IconButton.jsx';
import { frameUrl } from '../../lib/guide.js';
import styles from './FrameViewer.module.css';

const FRAME_MS = 700;
const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Plays an exercise's frames as a loop (1 → 2 → 3 → 2 → …) with pause and frame controls.
 * Starts paused when the user prefers reduced motion.
 */
export default function FrameViewer({ slug, name, frames = 3 }) {
  // Ping-pong order, e.g. 3 frames -> [1, 2, 3, 2].
  const sequence = [];
  for (let i = 1; i <= frames; i++) sequence.push(i);
  for (let i = frames - 1; i > 1; i--) sequence.push(i);

  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(() => frames > 1 && !prefersReducedMotion());
  const frame = sequence[step % sequence.length];

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => setStep((s) => s + 1), FRAME_MS);
    return () => clearInterval(id);
  }, [playing]);

  const choose = (i) => {
    setPlaying(false);
    setStep(sequence.indexOf(i));
  };

  return (
    <div className={styles.viewer}>
      <div className={styles.stage}>
        {Array.from({ length: frames }, (_, i) => i + 1).map((i) => (
          <img
            key={i}
            src={frameUrl(slug, i)}
            alt={i === frame ? `${name}, position ${i} of ${frames}` : ''}
            aria-hidden={i === frame ? undefined : 'true'}
            className={`${styles.frame} ${i === frame ? styles.current : ''}`}
            width="512"
            height="512"
            decoding="async"
          />
        ))}
      </div>
      {frames > 1 && (
        <div className={styles.controls}>
          <IconButton
            label={playing ? 'Pause movement' : 'Play movement'}
            onClick={() => setPlaying((p) => !p)}
            aria-pressed={playing}
          >
            {playing ? <Pause size={18} weight="fill" aria-hidden="true" /> : <Play size={18} weight="fill" aria-hidden="true" />}
          </IconButton>
          <div className={styles.frames} role="group" aria-label="Show position">
            {Array.from({ length: frames }, (_, i) => i + 1).map((i) => (
              <button
                key={i}
                type="button"
                className={styles.frameButton}
                aria-pressed={i === frame}
                aria-label={`Position ${i}`}
                onClick={() => choose(i)}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
