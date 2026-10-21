// Level generator: checks every hand-drawn field, finds the shortest program that brings sheep
// home from every square, and writes src/game/levels.json.
// Run: node --no-warnings scripts/levels.ts   (add --check to only print the table)
import fs from 'node:fs';

import { field, lines, works, flockWorks, type Act, type Cond, type Level, type Program, type World } from '../src/game/engine.ts';
import { programs } from './shared.ts';

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

export const WORLD_SIZES = [10, 10];

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

const fmt = (p: Program) => [...p.rules.map((r) => `${r.c}→${r.a}`), `else ${p.def}`].join(' | ');

const levels: Level[] = [];
const worlds: World[] = [];
let ok = true;
let i = 0;
WORLD_SIZES.forEach((size, w) => {
  worlds.push({ idx: w, free: w < 2, a: i, b: i + size });
  for (let j = 0; j < size; j++, i++) {
    const s = SRC[i];
    const F = field(s);
    const widths = new Set(s.map.map((r) => r.length));
    let sol = solve(s);
    if (!sol && s.manual && works(F, s.manual)) sol = s.manual;
    const naive: Program = { rules: [], def: 'forward' };
    const tag = `${w + 1}.${j + 1}`;
    if (widths.size !== 1 || F.flock.length === 0 || !sol) {
      ok = false;
      console.log(tag, 'PROBLEM', widths.size !== 1 ? 'ragged' : F.flock.length === 0 ? 'no sheep' : 'no solution');
      continue;
    }
    const earlier = levels.map((L, n) => (works(F, L.sol) ? n + 1 : 0)).filter(Boolean);
    console.log(tag, `lines=${lines(sol)}`, `sheep=${F.flock.length}`, `naive=${flockWorks(F, naive)}`, `earlierWork=[${earlier}]`, fmt(sol));
    levels.push({ k: i, w, map: s.map, conds: s.tools.conds, acts: s.tools.acts, best: lines(sol), sol });
  }
});

if (!process.argv.includes('--check')) {
  if (!ok) {
    console.error('Not written: fix the problems above.');
    process.exit(1);
  }
  fs.writeFileSync(new URL('../src/game/levels.json', import.meta.url), JSON.stringify({ worlds, levels }, null, 1) + '\n');
  console.log(`Wrote ${levels.length} levels.`);
}
