// Level list: worlds 1–2 are drawn by hand below, worlds 3–20 come from scripts/generated.json
// (made by scripts/generate.ts). Every level is checked again here: the stored solution must work
// from every square and no shorter program may exist. Writes src/game/levels.json.
// Run: node --no-warnings scripts/levels.ts   (add --check to only print the table)
import fs from 'node:fs';

import { field, lines, works, flockWorks, type Act, type Cond, type Level, type Program, type World } from '../src/game/engine.ts';
import { fmt, programs } from './shared.ts';
import type { Gen } from './generate.ts';

const A = { conds: ['fenceAhead'] as Cond[], acts: ['forward', 'right', 'left'] as Act[] };
const B = { conds: ['fenceAhead', 'freeAhead'] as Cond[], acts: ['forward', 'right', 'left', 'back'] as Act[] };
const SIDES = { conds: [...B.conds, 'fenceRight', 'freeRight', 'fenceLeft', 'freeLeft'] as Cond[], acts: B.acts };
const FLOWERS = { conds: [...SIDES.conds, 'onYellow', 'onBlue'] as Cond[], acts: SIDES.acts };
const STEP = { conds: FLOWERS.conds, acts: [...FLOWERS.acts, 'stepRight', 'stepLeft'] as Act[] };

interface Src {
  map: string[];
  tools: { conds: Cond[]; acts: Act[] };
  /** Used when no program of up to 3 rules exists */
  manual?: Program;
}

const WORLDS = 20;
const PER_WORLD = 10;
const generated: Record<string, Gen[]> = JSON.parse(fs.readFileSync(new URL('./generated.json', import.meta.url), 'utf8'));

// Fields 1.7 onwards were found with scripts/explore.ts and then checked here.
const SRC: Src[] = [
  // ---------- World 1: Meadow. Fence ahead, turning, then looking left and right ----------
  { tools: A, map: ['>.>..>.B'] }, // 1 First steps: everyone already faces the barn
  { tools: A, map: ['.>.<.B.<.>.'] }, // 2 Both ways: half the flock faces away
  { tools: A, map: ['>.>...', '#####.', '#####v', '#####B'] }, // 3 Corner
  { tools: A, map: ['#####B', '#####.', '#####^', '>.>...'] }, // 4 The other corner
  { tools: B, map: ['.>.....', '...v...', '.<.....', '....^..', '.>....B'] }, // 5 Big meadow
  { tools: B, map: ['...<.....', '########.', '.......#^', '.#####.#.', '.#B..<.#.', 'v#######.', '.....>...'] }, // 6 Snail
  { tools: SIDES, map: ['B#.v...', '.#.###.', '.#.#...', '.#.#^##', '...#.<.'] }, // 7 Zigzag
  { tools: SIDES, map: ['>..#B..', 'v#^###.', '.#...#.', '.###.#.', '.....#.', '.#####.', '.>.....'] }, // 8 Winding path
  { tools: SIDES, map: ['#..#.B', '......', '.<v.##', '......', '.v....'] }, // 9 Stony meadow
  { tools: SIDES, map: ['B...>#.', '####.#.', '......v', '.#####^', '.......'] }, // 10 Long way home

  // ---------- World 2: Maze. Flowers as signs, then side steps ----------
  { tools: FLOWERS, map: ['#^b##B', '>#..by', '......', '.<v<.#'] }, // 1 Blue flower
  { tools: FLOWERS, map: ['B...#.', '#.<<.y', '..>..y', '^.#.#.'] }, // 2 Yellow flowers
  { tools: STEP, map: ['B#.<...', '.#.###.', '...#...', '####.##', '..^...>'] }, // 3 Hand on the fence
  { tools: STEP, map: ['^......', '######.', '..>..<.', '.###.##', '.#B....', '.###.#.', '.....#.'] }, // 4 Right hand
  { tools: STEP, map: ['<#B......', '.#####.#.', '.#.....#.', '.#.###.#<', '.^.#v....'] }, // 5 Left hand
  { tools: STEP, map: ['<..#B..', '.#.###.', '.#..b#.', '.###.#v', '....>..'] }, // 6 Blue door
  { tools: STEP, map: ['.#B.<...v', '.#####.#.', 'y...b..#.', '.#<#####.', '...#.....'] }, // 7 Two flowers
  { tools: STEP, map: ['B..#...#.', '##.#.#.#.', '.#...#^#v', '>#.#.#.#.', '.#...#...', '.#######.', '......v..'] }, // 8 Dead ends
  { tools: STEP, map: ['..b...', '.^#...', '.#..y#', '..^...', '...v#B'] }, // 9 Flower field
  { tools: STEP, map: ['..y<..', '..#.^.', '.>....', '.....#', '.#b..B'] }, // 10 Shepherd's test
];

function solve(s: Src, k = 3): Program | null {
  const F = field(s);
  for (let n = 0; n <= k; n++) for (const p of programs(s.tools, n)) if (works(F, p)) return p;
  return null;
}

/** True when no program with fewer rules than `p` works (so `p` really is a shortest one). */
function shortest(map: string[], tools: Src['tools'], p: Program): boolean {
  const F = field({ map });
  for (let n = 0; n < p.rules.length; n++) for (const q of programs(tools, n)) if (works(F, q)) return false;
  return true;
}

const levels: Level[] = [];
const worlds: World[] = [];
let ok = true;
for (let w = 0; w < WORLDS; w++) {
  const a = w * PER_WORLD;
  worlds.push({ idx: w, free: w < 2, a, b: a + PER_WORLD });
  const gen = w >= 2 ? generated[w + 1] : null;
  for (let j = 0; j < PER_WORLD; j++) {
    const i = a + j;
    const tag = `${w + 1}.${j + 1}`;
    const s: Src | undefined = w < 2 ? SRC[i] : gen?.[j] && { map: gen[j].map, tools: { conds: gen[j].conds, acts: gen[j].acts }, manual: gen[j].sol };
    if (!s) {
      ok = false;
      console.log(tag, 'PROBLEM missing (run scripts/generate.ts)');
      continue;
    }
    const F = field(s);
    const widths = new Set(s.map.map((r) => r.length));
    // Hand-drawn levels are solved here; generated ones bring their solution and are re-checked.
    let sol = w < 2 ? solve(s) : null;
    if (!sol && s.manual && works(F, s.manual) && shortest(s.map, s.tools, s.manual)) sol = s.manual;
    if (widths.size !== 1 || F.flock.length === 0 || !sol || flockWorks(F, { rules: [], def: 'forward' }) !== (i === 0)) {
      ok = false;
      console.log(tag, 'PROBLEM', widths.size !== 1 ? 'ragged' : F.flock.length === 0 ? 'no sheep' : !sol ? 'no solution' : 'starting code works');
      continue;
    }
    if (w < 2 || process.argv.includes('--all')) console.log(tag, `lines=${lines(sol)}`, `sheep=${F.flock.length}`, fmt(sol));
    levels.push({ k: i, w, map: s.map, conds: s.tools.conds, acts: s.tools.acts, best: lines(sol), sol });
  }
}

if (!process.argv.includes('--check')) {
  if (!ok) {
    console.error('Not written: fix the problems above.');
    process.exit(1);
  }
  fs.writeFileSync(new URL('../src/game/levels.json', import.meta.url), JSON.stringify({ worlds, levels }, null, 1) + '\n');
  console.log(`Wrote ${levels.length} levels.`);
}
