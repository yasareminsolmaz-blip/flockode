import { getLocales } from 'expo-localization';
import { useCallback } from 'react';

import { useProgress } from '../store/Progress';
import { levelName, levelTip, worldIntro, worldName } from './content';
import { pickLang, translate, type Lang, type StringKey } from './strings';

export { LANG_NAMES, LANGS, type Lang } from './strings';

export function deviceLang(): Lang {
  try {
    return pickLang(getLocales()[0]?.languageCode);
  } catch {
    return 'en';
  }
}

/** Current language (the saved choice, or the device language) and text helpers. */
export function useI18n() {
  const { lang: choice } = useProgress();
  const lang: Lang = choice === 'auto' ? deviceLang() : choice;
  const t = useCallback((key: StringKey, vars?: Record<string, string | number>) => translate(lang, key, vars), [lang]);
  const level = useCallback((k: number) => levelName(lang, k), [lang]);
  const tip = useCallback((k: number) => levelTip(lang, k), [lang]);
  const world = useCallback((i: number) => worldName(lang, i), [lang]);
  const intro = useCallback((i: number) => worldIntro(lang, i), [lang]);
  return { lang, t, levelName: level, levelTip: tip, worldName: world, worldIntro: intro };
}
