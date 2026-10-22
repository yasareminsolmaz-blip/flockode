// Draws an easy first level for each of worlds 3–20 and stores it in scripts/intros.json.
// The first level of every world is open as soon as the world is playable, so a child may start
// there without the earlier worlds: it uses the world's new piece but needs at most 3 lines on a
// small field.  Run: node --no-warnings scripts/intros.ts   (then scripts/levels.ts)
import fs from 'node:fs';

import { lines, works, field, type Program } from '../src/game/engine.ts';
import { SPECS, type Gen } from './generate.ts';
import { fastSolver, randomField, rng, tooEasy, type Recipe } from './shared.ts';

const used = (p: Program) => [...p.rules.flatMap((r) => [r.c, r.a]), p.def] as string[];

/** Same checks as the world's own levels, on the solution of an intro field. */
function meets(need: string, map: string[], p: Program): boolean {
  const u = used(p);
  if (need === 'red') return u.includes('onRed');
  if (need === 'flower') return u.some((t) => t.startsWith('on') && t !== 'onStream');
  if (need === 'wolf') return u.some((t) => t.startsWith('wolf'));
  if (need === 'step') return u.some((t) => t.startsWith('step'));
  const dry = map.map((r) => r.replace(/[URDL]/g, '.'));
  return u.includes('onStream') || !works(field({ map: dry }), p);
}

/** The world's recipe, shrunk to a small field. */
const small = (r: Recipe): Recipe => ({
  ...r,
  w: [Math.max(4, r.w[0] - 2), Math.max(5, r.w[0])],
  h: [Math.max(3, r.h[0] - 1), Math.max(4, r.h[0])],
  rocks: r.rocks && [Math.max(0, r.rocks[0] - 1), r.rocks[0]],
  wolves: r.wolves && [1, Math.min(2, r.wolves[1])],
  streams: r.streams && [1, Math.min(2, r.streams[1])],
  flowers: r.flowers && { kinds: r.flowers.kinds, n: [1, Math.min(3, r.flowers.n[1])] },
});

const out: Record<string, Gen> = {};
SPECS.forEach((spec, i) => {
  const w = i + 3;
  const rnd = rng(77 + w * 104729);
  let best: { g: Gen; score: number } | null = null;
  for (let n = 0; n < 4000; n++) {
    const recipe = small(spec.recipes[n % spec.recipes.length]);
    const map = randomField(rnd, recipe);
    if (tooEasy(map)) continue;
    const sol = fastSolver(map, spec.tools).solveFast(2);
    if (!sol || lines(sol) < 2 || lines(sol) > 3) continue;
    if (!spec.need.every((need) => meets(need, map, sol))) continue;
    // Fewer lines and a smaller field are easier.
    const score = lines(sol) * 1000 + map.length * map[0].length;
    if (!best || score < best.score) best = { g: { map, conds: spec.tools.conds, acts: spec.tools.acts, sol }, score };
  }
  if (!best) {
    console.log(`world ${w}: no intro found`);
    return;
  }
  out[w] = best.g;
  console.log(`world ${w}: ${lines(best.g.sol)} lines, ${best.g.map[0].length}x${best.g.map.length}`);
});
fs.writeFileSync(new URL('./intros.json', import.meta.url), JSON.stringify(out, null, 1) + '\n');
