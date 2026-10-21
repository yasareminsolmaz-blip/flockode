import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';

import { ACTS, CONDS, type Level } from '../game/engine.ts';
import { GENERIC_TIPS, LEVEL_NAMES, LEVEL_TIPS, levelName, levelTip, WORLD_INTROS, WORLD_NAMES } from './content.ts';
import { format, LANGS, pickLang, STRINGS } from './strings.ts';

const data: { levels: Level[] } = JSON.parse(fs.readFileSync(new URL('../game/levels.json', import.meta.url), 'utf8'));
const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

test('every interface text exists in every language with the same placeholders', () => {
  for (const [key, entry] of Object.entries(STRINGS)) {
    const ref = placeholders(entry.tr);
    for (const lang of LANGS) {
      assert.ok(entry[lang]?.trim(), `${key} missing in ${lang}`);
      assert.equal(placeholders(entry[lang]), ref, `${key} placeholders differ in ${lang}`);
    }
  }
});

test('every condition and action has a label', () => {
  const keys = Object.keys(STRINGS);
  for (const c of CONDS) assert.ok(keys.includes(`cond${cap(c)}`), c);
  for (const a of ACTS) assert.ok(keys.includes(`act${cap(a)}`), a);
});

test('every world, level name and level tip exists in every language', () => {
  for (const table of [WORLD_NAMES, WORLD_INTROS, GENERIC_TIPS, LEVEL_NAMES, LEVEL_TIPS]) for (const entry of table) for (const lang of LANGS) assert.ok(entry[lang]?.trim());
  assert.equal(WORLD_NAMES.length, 20);
  assert.equal(WORLD_INTROS.length, 20);
  assert.equal(LEVEL_NAMES.length, 20);
  assert.equal(LEVEL_TIPS.length, 20);
  assert.equal(levelName('tr', 47), 'Dere 8');
  assert.equal(levelName('en', 199), 'Legendary Flock 10');
  for (const L of data.levels) for (const lang of LANGS) assert.ok(levelName(lang, L.k) && levelTip(lang, L.k));
});

test('language helpers', () => {
  assert.equal(pickLang('de'), 'de');
  assert.equal(pickLang('pt'), 'en');
  assert.equal(pickLang(undefined), 'en');
  assert.equal(format('Level {n} / {m}', { n: 3, m: 10 }), 'Level 3 / 10');
});
