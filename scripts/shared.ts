import type { Act, Cond, Program } from '../src/game/engine.ts';

/** Every program with exactly k rules from these tools (a condition is used at most once). */
export function* programs(tools: { conds: Cond[]; acts: Act[] }, k: number): Generator<Program> {
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

/** Solutions taught by earlier levels; the explorer skips fields any of them already solves. */
export const PREVIOUS: Program[] = (process.env.PREV ?? '')
  .split(';')
  .filter(Boolean)
  .map((s) => JSON.parse(s) as Program)
  .concat([
    { rules: [{ c: 'fenceAhead', a: 'right' }], def: 'forward' },
    { rules: [{ c: 'fenceAhead', a: 'left' }], def: 'forward' },
  ]);
