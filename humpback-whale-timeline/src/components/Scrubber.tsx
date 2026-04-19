import { useEffect, useRef } from 'react';
import type { KeyboardEvent, CSSProperties } from 'react';
import {
  useTimelineStore,
  phaseForYear,
  PHASE_LABELS,
  MIN_YEAR,
  MAX_YEAR,
} from '../store';
import styles from './Scrubber.module.css';

const PAUSE_DEBOUNCE_MS = 1500;
const TICK_YEARS = [1966, 1986, 2008] as const;

const clampYear = (y: number) =>
  Math.max(MIN_YEAR, Math.min(MAX_YEAR, y));

export default function Scrubber() {
  const currentYear = useTimelineStore((s) => s.currentYear);
  const setYear = useTimelineStore((s) => s.setYear);
  const setPaused = useTimelineStore((s) => s.setPaused);

  const phase = phaseForYear(currentYear);
  const phaseLabel = PHASE_LABELS[phase];
  const fillRatio = (currentYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR);

  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setPaused(false);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(
      () => setPaused(true),
      PAUSE_DEBOUNCE_MS,
    );
    return () => {
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
    };
  }, [currentYear, setPaused]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Home':
        e.preventDefault();
        setYear(MIN_YEAR);
        break;
      case 'End':
        e.preventDefault();
        setYear(MAX_YEAR);
        break;
      case 'PageUp':
        e.preventDefault();
        setYear(clampYear(currentYear + 5));
        break;
      case 'PageDown':
        e.preventDefault();
        setYear(clampYear(currentYear - 5));
        break;
      default:
    }
  };

  const rangeStyle = { '--value': fillRatio } as CSSProperties;

  return (
    <div className={styles.scrubber}>
      <div className={styles.display}>
        <span className={styles.year}>{currentYear}</span>
        <span
          className={styles.phase}
          aria-live="polite"
          aria-atomic="true"
        >
          {phaseLabel}
        </span>
      </div>

      <input
        type="range"
        className={styles.range}
        min={MIN_YEAR}
        max={MAX_YEAR}
        step={1}
        value={currentYear}
        onChange={(e) => setYear(Number(e.currentTarget.value))}
        onKeyDown={onKeyDown}
        aria-label={`Year, ${MIN_YEAR} to ${MAX_YEAR}`}
        aria-valuetext={`${currentYear}, ${phaseLabel}`}
        style={rangeStyle}
      />

      <div className={styles.ticks} aria-hidden="true">
        {TICK_YEARS.map((y) => {
          const pos = ((y - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
          return (
            <span
              key={y}
              className={styles.tick}
              style={{ left: `${pos}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}
