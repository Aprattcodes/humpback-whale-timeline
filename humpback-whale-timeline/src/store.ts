import { create } from 'zustand';

export type Phase = 'silencing' | 'return' | 'new-ocean';

export const MIN_YEAR = 1940;
export const MAX_YEAR = 2025;

export function phaseForYear(year: number): Phase {
  if (year <= 1966) return 'silencing';
  if (year <= 2000) return 'return';
  return 'new-ocean';
}

export const PHASE_LABELS: Record<Phase, string> = {
  silencing: 'The Silencing',
  return: 'The Return',
  'new-ocean': 'The New Ocean',
};

type TimelineState = {
  currentYear: number;
  isPaused: boolean;
  reducedMotion: boolean;
  audioEnabled: boolean;
  narrationCache: Record<number, string>;
  setYear: (year: number) => void;
  setPaused: (paused: boolean) => void;
  setReducedMotion: (rm: boolean) => void;
  setAudioEnabled: (on: boolean) => void;
  cacheNarration: (year: number, text: string) => void;
};

export const useTimelineStore = create<TimelineState>((set) => ({
  currentYear: 1940,
  isPaused: false,
  reducedMotion: false,
  audioEnabled: false,
  narrationCache: {},
  setYear: (year) => set({ currentYear: year }),
  setPaused: (paused) => set({ isPaused: paused }),
  setReducedMotion: (rm) => set({ reducedMotion: rm }),
  setAudioEnabled: (on) => set({ audioEnabled: on }),
  cacheNarration: (year, text) =>
    set((s) => ({ narrationCache: { ...s.narrationCache, [year]: text } })),
}));

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  useTimelineStore.setState({ reducedMotion: mql.matches });
  mql.addEventListener('change', (e) => {
    useTimelineStore.setState({ reducedMotion: e.matches });
  });
}
