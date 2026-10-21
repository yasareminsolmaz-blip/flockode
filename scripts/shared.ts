import { field, flockWorks, works, type Act, type Cond, type Program } from '../src/game/engine.ts';

export interface Tools {
  conds: Cond[];
  acts: Act[];
}

/** Every program with exactly k rules from these tools (a condition is used at most once). */
export function* programs(tools: Tools, k: number): Generator<Program> {
  const { conds, acts } = tools;
  const rec = function* (rules: Program['rules'], used: Set<Cond>): Generator<Program> {
    if (rules.length === k) {
      for (const def of acts) yield { rules, def };
      return;
    }
    for (const c of conds) {
      if (used.has(c)) continue;
      for (const a of acts) yield* rec([...rules, { c, a }], new Set([...used, c]));
    }
  };
  yield* rec([], new Set());
}

/** Shortest program (up to `k` rules) that brings sheep home from every square, or null. */
export function solve(map: string[], tools: Tools, k = 3): Program | null {
  const F = field({ map });
  for (let n = 0; n <= k; n++) for (const p of programs(tools, n)) if (works(F, p)) return p;
  return null;
}

export const fmt = (p: Program) => [...p.rules.map((r) => `${r.c}→${r.a}`), `else ${p.def}`].join(' | ');

/** Solutions taught by earlier levels; the explorer skips fields any of them already solves. */
export const PREVIOUS: Program[] = (process.env.PREV ?? '')
  .split(';')
  .filter(Boolean)
  .map((s) => JSON.parse(s) as Program)
  .concat([
    { rules: [{ c: 'fenceAhead', a: 'right' }], def: 'forward' },
    { rules: [{ c: 'fenceAhead', a: 'left' }], def: 'forward' },
  ]);

// ---------- Random fields ----------

export function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export interface Recipe {
  style: 'maze' | 'loops' | 'field';
  /** Width and height in cells (maze styles use (w + 1) / 2 rooms) */
  w: [number, number];
  h: [number, number];
  rocks?: [number, number];
  flowers?: { kinds: string; n: [number, number] };
  wolves?: [number, number];
  streams?: [number, number];
}

const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const between = (rnd: () => number, [a, b]: [number, number]) => a + Math.floor(rnd() * (b - a + 1));

function maze(rnd: () => number, W: number, H: number, extra: number): string[][] {
  const cw = Math.ceil(W / 2);
  const ch = Math.ceil(H / 2);
  const g = Array.from({ length: H }, () => Array(W).fill('#'));
  const seen = new Set<string>(['0,0']);
  const stack: [number, number][] = [[0, 0]];
  g[0][0] = '.';
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const n = DIRS.map(([dx, dy]) => [x + dx, y + dy, dx, dy]).filter(
      ([nx, ny]) => nx >= 0 && ny >= 0 && nx < cw && ny < ch && nx * 2 < W && ny * 2 < H && !seen.has(`${nx},${ny}`),
    );
    if (!n.length) {
      stack.pop();
      continue;
    }
    const [nx, ny, dx, dy] = n[Math.floor(rnd() * n.length)];
    g[y * 2 + dy][x * 2 + dx] = '.';
    g[ny * 2][nx * 2] = '.';
    seen.add(`${nx},${ny}`);
    stack.push([nx, ny]);
  }
  for (let i = 0; i < extra * 6; i++) {
    const y = Math.floor(rnd() * H);
    const x = Math.floor(rnd() * W);
    if ((x + y) % 2 === 1 && g[y][x] === '#' && extra > 0) {
      g[y][x] = '.';
      extra--;
    }
  }
  return g;
}

const grassOf = (g: string[][]) => g.flatMap((r, y) => r.map((c, x) => (c === '.' ? [x, y] : null)).filter((v): v is number[] => !!v));
const open = (c: string | undefined) => c !== undefined && c !== '#' && c !== 'w';
const degree = (g: string[][], x: number, y: number) => DIRS.filter(([dx, dy]) => open(g[y + dy]?.[x + dx])).length;

/** One random field following the recipe, with a barn, extras and a flock of 3–5 sheep. */
export function randomField(rnd: () => number, R: Recipe): string[] {
  const W = between(rnd, R.w);
  const H = between(rnd, R.h);
  let g: string[][];
  if (R.style === 'field') {
    g = Array.from({ length: H }, () => Array(W).fill('.'));
    const rocks = between(rnd, R.rocks ?? [2, 5]);
    for (let i = 0; i < rocks; i++) g[Math.floor(rnd() * H)][Math.floor(rnd() * W)] = '#';
  } else g = maze(rnd, W, H, R.style === 'loops' ? between(rnd, [1, 3]) : 0);
  const take = (cells: number[][]) => cells.splice(Math.floor(rnd() * cells.length), 1)[0];

  let cells = grassOf(g);
  const dead = cells.filter(([x, y]) => degree(g, x, y) === 1);
  const [bx, by] = dead.length && rnd() < 0.7 ? take(dead) : take(cells);
  g[by][bx] = 'B';

  // Streams: straight runs of 2–3 squares
  const nStreams = R.streams ? between(rnd, R.streams) : 0;
  for (let i = 0, tries = 0; i < nStreams && tries < 40; tries++) {
    const [x, y] = grassOf(g)[Math.floor(rnd() * grassOf(g).length)] ?? [];
    if (x === undefined) break;
    const d = Math.floor(rnd() * 4);
    const len = 2 + Math.floor(rnd() * 2);
    const run: number[][] = [];
    for (let k = 0; k < len; k++) {
      const cx = x + DIRS[d][0] * k;
      const cy = y + DIRS[d][1] * k;
      if (g[cy]?.[cx] !== '.') break;
      run.push([cx, cy]);
    }
    if (run.length < 2) continue;
    for (const [cx, cy] of run) g[cy][cx] = 'URDL'[d];
    i++;
  }
  // Wolves, never right next to the barn
  const nWolves = R.wolves ? between(rnd, R.wolves) : 0;
  cells = grassOf(g).filter(([x, y]) => Math.abs(x - bx) + Math.abs(y - by) > 1);
  for (let i = 0; i < nWolves && cells.length; i++) {
    const [x, y] = take(cells);
    g[y][x] = 'w';
  }
  // Flowers on squares with at least two ways out (corners and crossings)
  if (R.flowers) {
    const spots = grassOf(g).filter(([x, y]) => degree(g, x, y) >= 2);
    const n = between(rnd, R.flowers.n);
    for (let i = 0; i < n && spots.length; i++) {
      const [x, y] = take(spots);
      g[y][x] = R.flowers.kinds[Math.floor(rnd() * R.flowers.kinds.length)];
    }
  }
  const free = grassOf(g);
  const ns = Math.min(free.length, 3 + Math.floor(rnd() * 3));
  for (let i = 0; i < ns; i++) {
    const [x, y] = take(free);
    g[y][x] = '^>v<'[Math.floor(rnd() * 4)];
  }
  return g.map((r) => r.join(''));
}

/** True when the field's starting code (always forward) already finishes it. */
export const tooEasy = (map: string[]) => flockWorks(field({ map }), { rules: [], def: 'forward' });

// ---------- Fast solver ----------
// Same answers as `solve`, many times faster: every (square, facing) state gets its sensor bits
// and the result of each action precomputed, and walks reuse one visited array.

import { act as applyAct, holds, type Field } from '../src/game/engine.ts';

export function fastSolver(map: string[], tools: Tools) {
  const F: Field = field({ map });
  const W = F.cols;
  const N = F.rows * W * 4;
  const id = (x: number, y: number, d: number) => (y * W + x) * 4 + d;
  const starts: number[] = [];
  const bits = new Int32Array(N);
  // next[s * A + a] = state after action a (or -1 barn, -2 wolf)
  const A = tools.acts.length;
  const next = new Int32Array(N * A).fill(-3);
  for (const { x, y } of F.grass)
    for (let d = 0; d < 4; d++) {
      const s = id(x, y, d);
      starts.push(s);
      tools.conds.forEach((c, i) => {
        if (holds(F, { x, y, d }, c)) bits[s] |= 1 << i;
      });
      tools.acts.forEach((a, j) => {
        const sh = { x, y, d };
        const m = applyAct(F, sh, a);
        next[s * A + j] = m === 'barn' ? -1 : m === 'wolf' ? -2 : id(sh.x, sh.y, sh.d);
      });
    }
  const seen = new Int32Array(N);
  let stamp = 0;
  const order = [...starts];

  /** rules as parallel arrays of condition and action indexes */
  function worksIdx(rc: number[], ra: number[], k: number, def: number): boolean {
    for (let oi = 0; oi < order.length; oi++) {
      let s = order[oi];
      stamp++;
      for (;;) {
        seen[s] = stamp;
        const b = bits[s];
        let a = def;
        for (let i = 0; i < k; i++)
          if (b & (1 << rc[i])) {
            a = ra[i];
            break;
          }
        const n = next[s * A + a];
        if (n === -1) break;
        if (n === -2 || seen[n] === stamp) {
          // Try this hard start first next time.
          if (oi > 0) {
            const h = order[oi];
            order.splice(oi, 1);
            order.unshift(h);
          }
          return false;
        }
        s = n;
      }
    }
    return true;
  }

  function solveFast(maxRules = 3): Program | null {
    const C = tools.conds.length;
    const rc = [0, 0, 0, 0];
    const ra = [0, 0, 0, 0];
    for (let k = 0; k <= maxRules; k++) {
      const rec = (depth: number, used: number): Program | null => {
        if (depth === k) {
          for (let def = 0; def < A; def++)
            if (worksIdx(rc, ra, k, def))
              return { rules: rc.slice(0, k).map((c, i) => ({ c: tools.conds[c], a: tools.acts[ra[i]] })), def: tools.acts[def] };
          return null;
        }
        for (let c = 0; c < C; c++) {
          if (used & (1 << c)) continue;
          rc[depth] = c;
          for (let a = 0; a < A; a++) {
            ra[depth] = a;
            const r = rec(depth + 1, used | (1 << c));
            if (r) return r;
          }
        }
        return null;
      };
      const r = rec(0, 0);
      if (r) return r;
    }
    return null;
  }
  return { solveFast };
}
