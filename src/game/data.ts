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

/**
 * A level is open when it is the first level of its world, when the level before it has a star,
 * or when it was opened earlier (`unlocked`, kept from older saves). Paid worlds also need the
 * full version; check that separately with isPlayableWorld.
 */
export function isLevelOpen(i: number, stars: number[], unlocked: number): boolean {
  const L = LEVELS[i];
  if (!L) return false;
  return i === WORLDS[L.w].a || i < unlocked || (stars[i - 1] ?? 0) > 0;
}

/** True when World 2 (the last free world) has not been finished yet. */
export const freeWorldsUnfinished = (stars: number[]) => {
  const free = WORLDS.filter((w) => w.free);
  const last = free[free.length - 1];
  return !last || !((stars[last.b - 1] ?? 0) > 0);
};
