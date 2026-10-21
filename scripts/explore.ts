// Level explorer: draws random fields of one style, finds each one's shortest working program and
// prints the ones that teach something new. Good candidates are copied into scripts/levels.ts.
// Run: node --no-warnings scripts/explore.ts <style> <tools> <seed> [count]
//   style: maze | loops | field | flowers
//   tools: sides | flowers | step
import { field, flockWorks, works, type Act, type Cond, type Program } from '../src/game/engine.ts';
import { programs, PREVIOUS } from './shared.ts';

const [style = 'maze', toolName = 'sides', seedArg = '1', countArg = '400'] = process.argv.slice(2);
let seed = Number(seedArg);
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];

const SIDES = { conds: ['fenceAhead', 'freeAhead', 'fenceRight', 'freeRight', 'fenceLeft', 'freeLeft'] as Cond[], acts: ['forward', 'right', 'left', 'back'] as Act[] };
const TOOLS: Record<string, { conds: Cond[]; acts: Act[] }> = {
  sides: SIDES,
  flowers: { conds: [...SIDES.conds, 'onYellow', 'onBlue'], acts: SIDES.acts },
  step: { conds: [...SIDES.conds, 'onYellow', 'onBlue'], acts: [...SIDES.acts, 'stepRight', 'stepLeft'] },
};
const tools = TOOLS[toolName];

function maze(cw: number, ch: number, extra: number): string[][] {
  const W = cw * 2 - 1, H = ch * 2 - 1;
  const g = Array.from({ length: H }, () => Array(W).fill('#'));
  const seen = new Set<string>();
  const stack: [number, number][] = [[0, 0]];
  seen.add('0,0');
  g[0][0] = '.';
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const n = ([[1, 0], [-1, 0], [0, 1], [0, -1]] as const)
      .map(([dx, dy]) => [x + dx, y + dy, dx, dy] as const)
      .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < cw && ny < ch && !seen.has(`${nx},${ny}`));
    if (!n.length) { stack.pop(); continue; }
    const [nx, ny, dx, dy] = pick(n);
    g[y * 2 + dy][x * 2 + dx] = '.';
    g[ny * 2][nx * 2] = '.';
    seen.add(`${nx},${ny}`);
    stack.push([nx, ny]);
  }
  for (let i = 0; i < extra; i++) {
    const y = Math.floor(rnd() * H), x = Math.floor(rnd() * W);
    if ((x + y) % 2 === 1 && g[y][x] === '#') g[y][x] = '.';
  }
  return g;
}

function openField(w: number, h: number, rocks: number): string[][] {
  const g = Array.from({ length: h }, () => Array(w).fill('.'));
  for (let i = 0; i < rocks; i++) g[Math.floor(rnd() * h)][Math.floor(rnd() * w)] = '#';
  return g;
}

const grassCells = (g: string[][]) => g.flatMap((r, y) => r.map((c, x) => (c === '.' ? [x, y] : null)).filter(Boolean) as number[][]);
const neighbours = (g: string[][], x: number, y: number) =>
  [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => g[y + dy]?.[x + dx] && g[y + dy][x + dx] !== '#').length;

function candidate(): string[] {
  let g: string[][];
  if (style === 'maze') g = maze(pick([3, 4, 4, 5]), pick([3, 3, 4]), 0);
  else if (style === 'loops') g = maze(pick([4, 5]), pick([3, 4]), pick([1, 2, 3]));
  else g = openField(pick([5, 6, 7]), pick([4, 5]), pick([3, 4, 5, 6]));
  const cells = grassCells(g);
  const dead = cells.filter(([x, y]) => neighbours(g, x, y) === 1);
  const [bx, by] = dead.length && rnd() < 0.8 ? pick(dead) : pick(cells);
  g[by][bx] = 'B';
  if (style === 'flowers' || toolName !== 'sides') {
    const junctions = grassCells(g).filter(([x, y]) => neighbours(g, x, y) >= 2);
    const nf = pick([1, 2, 2, 3, 4]);
    for (let i = 0; i < nf && junctions.length; i++) {
      const [x, y] = junctions.splice(Math.floor(rnd() * junctions.length), 1)[0];
      g[y][x] = rnd() < 0.5 ? 'y' : 'b';
    }
  }
  const free = grassCells(g);
  const ns = Math.min(free.length, pick([3, 4, 5]));
  for (let i = 0; i < ns; i++) {
    const [x, y] = free.splice(Math.floor(rnd() * free.length), 1)[0];
    g[y][x] = pick(['^', '>', 'v', '<']);
  }
  return g.map((r) => r.join(''));
}

const usesNew = (p: Program) => {
  const all = [...p.rules.map((r) => r.c), ...p.rules.map((r) => r.a), p.def] as string[];
  if (toolName === 'sides') return all.some((t) => /Right|Left/.test(t) && t !== 'fenceAhead');
  if (toolName === 'flowers') return all.some((t) => t === 'onYellow' || t === 'onBlue');
  return all.some((t) => t.startsWith('step'));
};

const fmt = (p: Program) => [...p.rules.map((r) => `${r.c}→${r.a}`), `else ${p.def}`].join(' | ');
const found: { map: string[]; p: Program; n: number }[] = [];
for (let i = 0; i < Number(countArg); i++) {
  const map = candidate();
  const F = field({ map });
  let best: Program | null = null;
  for (let n = 0; n <= 3 && !best; n++) for (const p of programs(tools, n)) if (works(F, p)) { best = p; break; }
  if (!best || !usesNew(best) || best.rules.length < 1) continue;
  if (PREVIOUS.some((q) => works(F, q))) continue;
  if (flockWorks(F, { rules: [], def: 'forward' })) continue;
  found.push({ map, p: best, n: best.rules.length + 1 });
}
found.sort((a, b) => b.n - a.n);
const shown = new Set<string>();
for (const f of found) {
  const key = fmt(f.p);
  if (shown.has(key)) continue;
  shown.add(key);
  console.log(`lines=${f.n}  ${key}\n  ${JSON.stringify(f.map)}`);
  if (shown.size >= 12) break;
}
console.log(`${found.length} usable of ${countArg}`);
