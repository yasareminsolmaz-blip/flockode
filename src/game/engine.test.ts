import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';

import { act, everySquare, field, flockWorks, lines, shuffled, starsFor, walk, works, type Level, type World } from './engine.ts';

const data: { worlds: World[]; levels: Level[] } = JSON.parse(fs.readFileSync(new URL('./levels.json', import.meta.url), 'utf8'));

test('20 worlds of 10 levels, first two free', () => {
  assert.equal(data.worlds.length, 20);
  assert.equal(data.levels.length, 200);
  data.worlds.forEach((w, i) => {
    assert.equal(w.b - w.a, 10);
    assert.equal(w.free, i < 2);
    for (let k = w.a; k < w.b; k++) assert.equal(data.levels[k].w, i);
  });
});

test('every field has one barn, a flock and a rectangular shape', () => {
  for (const L of data.levels) {
    const cells = L.map.join('');
    assert.equal(cells.split('B').length - 1, 1, `barn ${L.k}`);
    assert.ok(L.map.every((r) => r.length === L.map[0].length), `shape ${L.k}`);
    assert.ok(field(L).flock.length >= 2, `flock ${L.k}`);
  }
});

test('every stored solution brings sheep home from every square, using only the level tools', () => {
  for (const L of data.levels) {
    const F = field(L);
    assert.ok(works(F, L.sol), `solution ${L.k}`);
    assert.ok(everySquare(F, L.sol).ok, `every square ${L.k}`);
    assert.ok(flockWorks(F, L.sol), `flock ${L.k}`);
    assert.equal(lines(L.sol), L.best, `best ${L.k}`);
    for (const r of L.sol.rules) {
      assert.ok(L.conds.includes(r.c), `cond ${L.k}`);
      assert.ok(L.acts.includes(r.a), `act ${L.k}`);
    }
    assert.ok(L.acts.includes(L.sol.def), `def ${L.k}`);
  }
});

test('the starting code (always go forward) never finishes a level', () => {
  for (const L of data.levels.slice(1)) assert.equal(flockWorks(field(L), { rules: [], def: 'forward' }), false, `${L.k}`);
});

test('rules', () => {
  const F = field({ map: ['>.#', '..B'] });
  const s = { x: 0, y: 0, d: 1 };
  assert.equal(act(F, s, 'forward'), 'move');
  assert.equal(act(F, s, 'forward'), 'bump');
  assert.equal(act(F, s, 'stepRight'), 'move');
  assert.deepEqual(s, { x: 1, y: 1, d: 2 });
  assert.equal(act(F, s, 'left'), 'turn');
  assert.equal(act(F, s, 'forward'), 'barn');
  // A sheep that only turns repeats itself and is reported as never arriving.
  assert.equal(walk(F, { rules: [], def: 'right' }, { x: 0, y: 0, d: 0 }), -1);
  assert.equal(walk(F, { rules: [{ c: 'fenceAhead', a: 'stepRight' }], def: 'forward' }, { x: 0, y: 1, d: 1 }), 2);
});

test('wolves and streams', () => {
  const F = field({ map: ['>R.B', '.w..'] });
  // The stream carries the sheep one more square: two squares in one step, then into the barn.
  const s = { x: 0, y: 0, d: 1 };
  assert.equal(act(F, s, 'forward'), 'move');
  assert.deepEqual(s, { x: 2, y: 0, d: 1 });
  assert.equal(act(F, s, 'forward'), 'barn');
  // Walking onto a wolf loses the sheep.
  assert.equal(act(F, { x: 0, y: 1, d: 1 }, 'forward'), 'wolf');
  assert.equal(walk(F, { rules: [], def: 'forward' }, { x: 0, y: 1, d: 1 }), -1);
  assert.equal(
    walk(F, { rules: [{ c: 'wolfAhead', a: 'left' }, { c: 'fenceAhead', a: 'right' }], def: 'forward' }, { x: 0, y: 1, d: 1 }),
    5,
  );
  assert.ok(!F.grass.some((g) => g.x === 1 && g.y === 1), 'a wolf square is not a start square');
});

test('stars and shuffling', () => {
  assert.equal(starsFor({ best: 2 }, false, false, 2), 0);
  assert.equal(starsFor({ best: 2 }, true, false, 2), 1);
  assert.equal(starsFor({ best: 2 }, true, true, 3), 2);
  assert.equal(starsFor({ best: 2 }, true, true, 2), 3);
  const F = field(data.levels[5]);
  const f = shuffled(F, 5, () => 0.5);
  assert.equal(f.length, 5);
  assert.equal(new Set(f.map((s) => `${s.x},${s.y}`)).size, 5);
  for (const s of f) assert.ok(F.grass.some((g) => g.x === s.x && g.y === s.y));
});
