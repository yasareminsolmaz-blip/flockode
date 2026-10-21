// Sürü rules. Kept free of app imports so it runs under plain Node in tests and in the level
// generator (scripts/levels.ts), which verifies every level with exactly these rules.
//
// Every sheep runs the same program. Sheep do not block each other, so each sheep's walk is
// independent: a program works for any flock exactly when it works for every single start
// (every grass cell, facing every direction). That is what the "every square" test checks.

/**
 * Map legend: . grass, # fence, B barn, y yellow flower, b blue flower (flowers are grass too),
 * ^ > v < a sheep on grass facing up, right, down, left.
 */
export type Cond =
  | 'fenceAhead'
  | 'freeAhead'
  | 'barnAhead'
  | 'fenceRight'
  | 'freeRight'
  | 'fenceLeft'
  | 'freeLeft'
  | 'onYellow'
  | 'onBlue';
export type Act = 'forward' | 'right' | 'left' | 'back' | 'stepRight' | 'stepLeft';

export const CONDS: Cond[] = ['fenceAhead', 'freeAhead', 'barnAhead', 'fenceRight', 'freeRight', 'fenceLeft', 'freeLeft', 'onYellow', 'onBlue'];
export const ACTS: Act[] = ['forward', 'right', 'left', 'back', 'stepRight', 'stepLeft'];

export interface Rule {
  c: Cond;
  a: Act;
}

/** Rules are checked top to bottom; the first one that holds runs. If none holds, `def` runs. */
export interface Program {
  rules: Rule[];
  def: Act;
}

export interface Level {
  /** Index of the level's name and tip, see src/i18n/content.ts */
  k: number;
  /** World index */
  w: number;
  map: string[];
  conds: Cond[];
  acts: Act[];
  /** Fewest program lines (rules + the last line) that work from every square */
  best: number;
  /** A verified shortest program that works from every square */
  sol: Program;
}

export interface World {
  idx: number;
  free: boolean;
  /** Level index range [a, b) */
  a: number;
  b: number;
}

export interface Sheep {
  x: number;
  y: number;
  d: number;
}

export const DX = [0, 1, 0, -1];
export const DY = [-1, 0, 1, 0];
const ARROWS = '^>v<';

export const MAX_RULES = 4;

export const lines = (p: Program) => p.rules.length + 1;

export interface Field {
  rows: number;
  cols: number;
  /** '.', '#', 'B', 'y' or 'b' per cell, row by row */
  cells: string[];
  barn: { x: number; y: number };
  /** The flock this level starts with */
  flock: Sheep[];
  /** Every grass cell, for the every-square test */
  grass: { x: number; y: number }[];
}

export function field(L: Pick<Level, 'map'>): Field {
  const rows = L.map.length;
  const cols = L.map[0].length;
  const F: Field = { rows, cols, cells: [], barn: { x: 0, y: 0 }, flock: [], grass: [] };
  L.map.forEach((r, y) =>
    [...r].forEach((c, x) => {
      const d = ARROWS.indexOf(c);
      if (d >= 0) F.flock.push({ x, y, d });
      if (c === 'B') F.barn = { x, y };
      const cell = '#Byb'.includes(c) ? c : '.';
      F.cells.push(cell);
      if (cell !== '#' && cell !== 'B') F.grass.push({ x, y });
    }),
  );
  return F;
}

export function cellAt(F: Field, x: number, y: number): string {
  return x < 0 || y < 0 || x >= F.cols || y >= F.rows ? '#' : F.cells[y * F.cols + x];
}

/** What the sheep sees one step away: k = 0 ahead, 1 right, 3 left. */
function look(F: Field, s: Sheep, k: number) {
  const d = (s.d + k) % 4;
  return cellAt(F, s.x + DX[d], s.y + DY[d]);
}

export function holds(F: Field, s: Sheep, c: Cond): boolean {
  switch (c) {
    case 'fenceAhead': return look(F, s, 0) === '#';
    case 'freeAhead': return look(F, s, 0) !== '#';
    case 'barnAhead': return look(F, s, 0) === 'B';
    case 'fenceRight': return look(F, s, 1) === '#';
    case 'freeRight': return look(F, s, 1) !== '#';
    case 'fenceLeft': return look(F, s, 3) === '#';
    case 'freeLeft': return look(F, s, 3) !== '#';
    case 'onYellow': return cellAt(F, s.x, s.y) === 'y';
    case 'onBlue': return cellAt(F, s.x, s.y) === 'b';
  }
}

/** Index of the rule that runs (rules.length means the last line). */
export function choose(F: Field, p: Program, s: Sheep): number {
  for (let i = 0; i < p.rules.length; i++) if (holds(F, s, p.rules[i].c)) return i;
  return p.rules.length;
}

export const actOf = (p: Program, line: number): Act => (line < p.rules.length ? p.rules[line].a : p.def);

export type Move = 'turn' | 'move' | 'bump' | 'barn';

/** Applies one action to `s` (mutates it). */
export function act(F: Field, s: Sheep, a: Act): Move {
  if (a === 'right' || a === 'stepRight') s.d = (s.d + 1) % 4;
  else if (a === 'left' || a === 'stepLeft') s.d = (s.d + 3) % 4;
  else if (a === 'back') s.d = (s.d + 2) % 4;
  if (a === 'right' || a === 'left' || a === 'back') return 'turn';
  const nx = s.x + DX[s.d];
  const ny = s.y + DY[s.d];
  const c = cellAt(F, nx, ny);
  if (c === '#') return 'bump';
  s.x = nx;
  s.y = ny;
  return c === 'B' ? 'barn' : 'move';
}

export const stateKey = (s: Sheep) => (s.y * 64 + s.x) * 4 + s.d;

/**
 * Walks one sheep until it enters the barn or repeats a state (then it would loop forever).
 * Returns the number of steps to the barn, or -1.
 */
export function walk(F: Field, p: Program, start: Sheep): number {
  const s = { ...start };
  const seen = new Set<number>();
  for (let n = 1; ; n++) {
    seen.add(stateKey(s));
    if (act(F, s, actOf(p, choose(F, p, s))) === 'barn') return n;
    if (seen.has(stateKey(s))) return -1;
  }
}

/** Result of the every-square test: per grass cell, how many of the 4 directions reach the barn. */
export function everySquare(F: Field, p: Program): { ok: boolean; cells: { x: number; y: number; n: number }[] } {
  let ok = true;
  const cells = F.grass.map(({ x, y }) => {
    let n = 0;
    for (let d = 0; d < 4; d++) if (walk(F, p, { x, y, d }) >= 0) n++;
    if (n < 4) ok = false;
    return { x, y, n };
  });
  return { ok, cells };
}

/** True when every sheep reaches the barn from every square (fast, stops at the first failure). */
export function works(F: Field, p: Program): boolean {
  for (const { x, y } of F.grass) for (let d = 0; d < 4; d++) if (walk(F, p, { x, y, d }) < 0) return false;
  return true;
}

export const flockWorks = (F: Field, p: Program) => F.flock.every((s) => walk(F, p, s) >= 0);

/** One star: this flock reaches the barn. Two: every square. Three: every square in `best` lines. */
export function starsFor(L: Pick<Level, 'best'>, flockOk: boolean, allOk: boolean, n: number): 0 | 1 | 2 | 3 {
  if (!flockOk) return 0;
  if (!allOk) return 1;
  return n <= L.best ? 3 : 2;
}

/** A random flock of `n` sheep on distinct grass cells. */
export function shuffled(F: Field, n: number, rnd: () => number = Math.random): Sheep[] {
  const cells = [...F.grass];
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  return cells.slice(0, Math.min(n, cells.length)).map(({ x, y }) => ({ x, y, d: Math.floor(rnd() * 4) }));
}
