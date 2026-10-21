// Draws the fields of worlds 3–20 and stores them in scripts/generated.json.
// Slow (minutes per world); run it only to remake those worlds:
//   node --no-warnings scripts/generate.ts            all worlds still missing from generated.json
//   node --no-warnings scripts/generate.ts 7 --redo   remake world 7 (1-based)
// Then run scripts/levels.ts, which checks every level again and writes src/game/levels.json.
import fs from 'node:fs';

import { field, lines, works, type Act, type Cond, type Program } from '../src/game/engine.ts';
import { fastSolver, fmt, randomField, rng, tooEasy, type Recipe, type Tools } from './shared.ts';

const SIDES: Cond[] = ['fenceAhead', 'freeAhead', 'fenceRight', 'freeRight', 'fenceLeft', 'freeLeft'];
const FL3: Cond[] = ['onYellow', 'onBlue', 'onRed'];
const WOLF: Cond[] = ['wolfAhead', 'wolfRight', 'wolfLeft'];
const TURN: Act[] = ['forward', 'right', 'left', 'back'];
const STEP: Act[] = [...TURN, 'stepRight', 'stepLeft'];
const MIX: Cond[] = ['fenceAhead', 'freeAhead', 'fenceRight', 'freeRight', 'freeLeft', 'onYellow', 'onRed', 'wolfAhead', 'onStream'];

type Need = 'red' | 'wolf' | 'stream' | 'step' | 'flower';
interface Spec {
  tools: Tools;
  recipes: Recipe[];
  /** Fewest lines a level of this world must need */
  min: number;
  need: Need[];
}

export const SPECS: Spec[] = [
  // 3 Red flower
  { tools: { conds: [...SIDES, ...FL3], acts: TURN }, min: 3, need: ['red'], recipes: [
    { style: 'field', w: [5, 7], h: [4, 5], rocks: [2, 4], flowers: { kinds: 'ybrr', n: [2, 4] } },
    { style: 'loops', w: [7, 7], h: [5, 5], flowers: { kinds: 'ybrr', n: [2, 3] } },
  ] },
  // 4 Wolf tracks
  { tools: { conds: [...SIDES, ...WOLF], acts: TURN }, min: 3, need: ['wolf'], recipes: [
    { style: 'field', w: [5, 7], h: [4, 5], rocks: [1, 3], wolves: [1, 3] },
  ] },
  // 5 Stream
  { tools: { conds: [...SIDES, 'onStream'], acts: TURN }, min: 2, need: ['stream'], recipes: [
    { style: 'field', w: [5, 7], h: [4, 5], rocks: [1, 4], streams: [1, 2] },
    { style: 'loops', w: [7, 7], h: [5, 5], streams: [1, 2] },
  ] },
  // 6 Flower maze
  { tools: { conds: [...SIDES, ...FL3], acts: STEP }, min: 3, need: ['step', 'flower'], recipes: [
    { style: 'loops', w: [7, 9], h: [5, 7], flowers: { kinds: 'ybr', n: [2, 4] } },
  ] },
  // 7 Wolf maze
  { tools: { conds: [...SIDES, ...WOLF], acts: STEP }, min: 3, need: ['wolf'], recipes: [
    { style: 'loops', w: [7, 9], h: [5, 7], wolves: [1, 2] },
  ] },
  // 8 Stream maze
  { tools: { conds: [...SIDES, 'onStream'], acts: STEP }, min: 3, need: ['stream', 'step'], recipes: [
    { style: 'loops', w: [7, 9], h: [5, 7], streams: [1, 3] },
  ] },
  // 9 Night meadow
  { tools: { conds: [...SIDES, 'wolfAhead', 'onYellow', 'onBlue'], acts: STEP }, min: 3, need: ['wolf'], recipes: [
    { style: 'field', w: [6, 8], h: [5, 6], rocks: [2, 4], wolves: [2, 3], flowers: { kinds: 'yb', n: [1, 3] } },
  ] },
  // 10 Flower creek
  { tools: { conds: [...SIDES, 'onYellow', 'onBlue', 'onStream'], acts: STEP }, min: 3, need: ['stream'], recipes: [
    { style: 'field', w: [6, 8], h: [5, 6], rocks: [2, 4], streams: [1, 3], flowers: { kinds: 'yb', n: [1, 3] } },
  ] },
  // 11 Long corridors
  { tools: { conds: SIDES, acts: STEP }, min: 3, need: [], recipes: [{ style: 'loops', w: [9, 11], h: [7, 9] }] },
  // 12 Wolves and streams
  { tools: { conds: [...SIDES, 'wolfAhead', 'wolfRight', 'onStream'], acts: STEP }, min: 3, need: ['wolf'], recipes: [
    { style: 'field', w: [6, 8], h: [5, 6], rocks: [1, 3], wolves: [1, 3], streams: [1, 2] },
  ] },
  // 13 Three flowers
  { tools: { conds: [...SIDES, ...FL3], acts: STEP }, min: 4, need: ['flower'], recipes: [
    { style: 'field', w: [6, 8], h: [5, 6], rocks: [2, 5], flowers: { kinds: 'ybr', n: [3, 5] } },
  ] },
  // 14 Foggy field
  { tools: { conds: SIDES, acts: STEP }, min: 3, need: [], recipes: [{ style: 'field', w: [7, 9], h: [6, 7], rocks: [5, 9] }] },
  // 15 Wolf pack
  { tools: { conds: [...SIDES, ...WOLF], acts: STEP }, min: 3, need: ['wolf'], recipes: [
    { style: 'field', w: [7, 8], h: [5, 6], rocks: [1, 3], wolves: [3, 5] },
  ] },
  // 16 Flood
  { tools: { conds: [...SIDES, 'onStream'], acts: STEP }, min: 3, need: ['stream'], recipes: [
    { style: 'field', w: [7, 8], h: [5, 6], rocks: [2, 4], streams: [3, 4] },
  ] },
  // 17 Big farm
  { tools: { conds: MIX, acts: STEP }, min: 3, need: [], recipes: [
    { style: 'field', w: [7, 9], h: [5, 7], rocks: [2, 5], wolves: [1, 2], streams: [1, 2], flowers: { kinds: 'yr', n: [1, 3] } },
  ] },
  // 18 Night maze
  { tools: { conds: MIX, acts: STEP }, min: 3, need: [], recipes: [
    { style: 'loops', w: [9, 11], h: [7, 9], wolves: [1, 2], streams: [1, 2], flowers: { kinds: 'yr', n: [1, 3] } },
  ] },
  // 19 Master shepherd
  { tools: { conds: [...SIDES, ...FL3], acts: STEP }, min: 4, need: [], recipes: [
    { style: 'loops', w: [9, 11], h: [7, 9], flowers: { kinds: 'ybr', n: [2, 5] } },
  ] },
  // 20 Legendary flock
  { tools: { conds: MIX, acts: STEP }, min: 4, need: [], recipes: [
    { style: 'field', w: [8, 10], h: [6, 8], rocks: [3, 7], wolves: [1, 3], streams: [1, 3], flowers: { kinds: 'yr', n: [2, 3] } },
    { style: 'loops', w: [9, 11], h: [7, 9], wolves: [1, 2], streams: [1, 2], flowers: { kinds: 'yr', n: [1, 3] } },
  ] },
];

const usedTools = (p: Program) => [...p.rules.flatMap((r) => [r.c, r.a]), p.def] as string[];
function meets(need: Need, map: string[], p: Program): boolean {
  const used = usedTools(p);
  if (need === 'red') return used.includes('onRed');
  if (need === 'flower') return used.some((t) => t.startsWith('on') && t !== 'onStream');
  if (need === 'wolf') return used.some((t) => t.startsWith('wolf'));
  if (need === 'step') return used.some((t) => t.startsWith('step'));
  // Streams must change the answer: the same code fails once the water is gone.
  const dry = map.map((r) => r.replace(/[URDL]/g, '.'));
  return used.includes('onStream') || !works(field({ map: dry }), p);
}

export interface Gen {
  map: string[];
  conds: Cond[];
  acts: Act[];
  sol: Program;
}

const OUT = new URL('./generated.json', import.meta.url);
const store: Record<string, Gen[]> = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const only = process.argv[2] && /^\d+$/.test(process.argv[2]) ? Number(process.argv[2]) : null;
const redo = process.argv.includes('--redo');

SPECS.forEach((spec, i) => {
  const w = i + 3;
  if (only !== null && only !== w) return;
  if (store[w] && !redo) return;
  const t0 = Date.now();
  const rnd = rng(1000 + w * 7919);
  const found: Gen[] = [];
  const seenMaps = new Set<string>();
  for (let n = 0; n < 5000 && found.length < 40; n++) {
    const recipe = spec.recipes[n % spec.recipes.length];
    const map = randomField(rnd, recipe);
    const key = map.join('/');
    if (seenMaps.has(key) || tooEasy(map)) continue;
    seenMaps.add(key);
    const sol = fastSolver(map, spec.tools).solveFast();
    if (!sol || lines(sol) < spec.min) continue;
    if (!spec.need.every((need) => meets(need, map, sol))) continue;
    found.push({ map, conds: spec.tools.conds, acts: spec.tools.acts, sol });
  }
  // Prefer different solutions, then order from easiest to hardest (fewer lines, smaller field).
  const byKey = new Map<string, Gen[]>();
  for (const g of found) byKey.set(fmt(g.sol), [...(byKey.get(fmt(g.sol)) ?? []), g]);
  const groups = [...byKey.values()];
  const picked: Gen[] = [];
  for (let r = 0; picked.length < 10 && groups.some((g) => g.length > r); r++)
    for (const g of groups) if (g[r] && picked.length < 10) picked.push(g[r]);
  const size = (g: Gen) => g.map.length * g.map[0].length;
  picked.sort((a, b) => lines(a.sol) - lines(b.sol) || size(a) - size(b));
  console.log(`world ${w}: ${found.length} found, ${byKey.size} different solutions, picked ${picked.length} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  if (picked.length === 10) {
    store[w] = picked;
    fs.writeFileSync(OUT, JSON.stringify(store, null, 1) + '\n');
  }
});
