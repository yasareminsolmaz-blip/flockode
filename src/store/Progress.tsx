import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { LEVELS } from '../game/data';
import { LANGS, type Lang } from '../i18n/strings';

const STORAGE_KEY = 'flockode.progress.v1';

interface Saved {
  /** Highest playable level index + 1 */
  unlocked: number;
  /** Best stars per level index */
  stars: number[];
  /** Sound effects on */
  sound: boolean;
  /** Interface language; 'auto' follows the device */
  lang: Lang | 'auto';
}

interface ProgressValue extends Saved {
  hydrated: boolean;
  recordWin: (level: number, stars: number) => void;
  setSound: (on: boolean) => void;
  setLang: (lang: Lang | 'auto') => void;
}

const DEFAULT: Saved = { unlocked: 1, stars: [], sound: true, lang: 'auto' };
const Ctx = createContext<ProgressValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Saved>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const s = JSON.parse(raw) as Partial<Saved>;
        setState({
          unlocked: Math.min(LEVELS.length, Math.max(1, Number(s.unlocked) || 1)),
          stars: Array.isArray(s.stars) ? s.stars.map((n) => Number(n) || 0) : [],
          sound: s.sound !== false,
          lang: s.lang && (LANGS as readonly string[]).includes(s.lang) ? s.lang : 'auto',
        });
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, hydrated]);

  const recordWin = useCallback((level: number, stars: number) => {
    setState((s) => {
      const next = [...s.stars];
      next[level] = Math.max(next[level] ?? 0, stars);
      return { ...s, stars: next, unlocked: Math.min(LEVELS.length, Math.max(s.unlocked, level + 2)) };
    });
  }, []);
  const setSound = useCallback((on: boolean) => setState((s) => ({ ...s, sound: on })), []);
  const setLang = useCallback((lang: Lang | 'auto') => setState((s) => ({ ...s, lang })), []);

  const value = useMemo(() => ({ ...state, hydrated, recordWin, setSound, setLang }), [state, hydrated, recordWin, setSound, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgress() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useProgress must be used inside ProgressProvider');
  return v;
}
