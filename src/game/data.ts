import type { Act, Cond, Level, World } from './engine';
import raw from './levels.json';

const data = raw as unknown as { worlds: World[]; levels: Level[] };

export const WORLDS: World[] = data.worlds;
export const LEVELS: Level[] = data.levels;

export function worldStars(stars: number[], w: World): number {
  let s = 0;
  for (let i = w.a; i < w.b; i++) s += stars[i] ?? 0;
  return s;
}

/** Tools this level adds compared with the level before it (shown as "New"). */
export function newTools(index: number): (Cond | Act)[] {
  const L = LEVELS[index];
  const prev = LEVELS[index - 1];
  if (!prev) return [];
  const had = new Set<string>([...prev.conds, ...prev.acts]);
  return [...L.conds, ...L.acts].filter((x) => !had.has(x));
}
