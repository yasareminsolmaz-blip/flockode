import * as Haptics from 'expo-haptics';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { MAX_RULES, type Act, type Cond, type Program } from '../game/engine';
import { useI18n } from '../i18n';
import type { StringKey } from '../i18n/strings';
import { colors } from '../theme';
import { CondArt, Icon } from './Icons';
import { Button, Overlay } from './ui';

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
export const condKey = (c: Cond) => `cond${cap(c)}` as StringKey;
export const actKey = (a: Act) => `act${cap(a)}` as StringKey;

type Picking = { kind: 'cond'; i: number } | { kind: 'act'; i: number } | null;

/**
 * The flock's code: a list of "IF condition → action" rules and a last line that runs when no
 * rule fits. `highlight` marks the lines used in the latest step.
 */
export function ProgramEditor({
  program,
  conds,
  acts,
  fresh,
  highlight,
  disabled,
  onChange,
}: {
  program: Program;
  conds: Cond[];
  acts: Act[];
  /** Tools new in this level, marked "New" in the menus */
  fresh: string[];
  highlight: Set<number>;
  disabled: boolean;
  onChange: (p: Program) => void;
}) {
  const { t } = useI18n();
  const [picking, setPicking] = useState<Picking>(null);
  const n = program.rules.length;

  const update = (p: Program) => {
    Haptics.selectionAsync().catch(() => {});
    onChange(p);
  };
  const setRule = (i: number, patch: Partial<Program['rules'][number]>) =>
    update({ ...program, rules: program.rules.map((r, k) => (k === i ? { ...r, ...patch } : r)) });
  const remove = (i: number) => update({ ...program, rules: program.rules.filter((_, k) => k !== i) });
  const moveUp = (i: number) => {
    const rules = [...program.rules];
    [rules[i - 1], rules[i]] = [rules[i], rules[i - 1]];
    update({ ...program, rules });
  };
  const add = () => {
    const used = new Set(program.rules.map((r) => r.c));
    const c = conds.find((x) => !used.has(x)) ?? conds[0];
    update({ ...program, rules: [...program.rules, { c, a: acts.includes('right') ? 'right' : acts[0] }] });
  };

  const pick = (value: string) => {
    if (!picking) return;
    if (picking.kind === 'cond') setRule(picking.i, { c: value as Cond });
    else if (picking.i === n) update({ ...program, def: value as Act });
    else setRule(picking.i, { a: value as Act });
    setPicking(null);
  };

  const current = picking ? (picking.kind === 'cond' ? program.rules[picking.i]?.c : picking.i === n ? program.def : program.rules[picking.i]?.a) : null;
  const options: string[] = picking?.kind === 'cond' ? conds : acts;

  return (
    <View style={[styles.list, disabled && { opacity: 0.75 }]}>
      {program.rules.map((r, i) => (
        <View key={i} style={[styles.rule, highlight.has(i) && styles.lit]}>
          <Text style={styles.kw}>{t('ifWord')}</Text>
          <Chip kind="cond" label={t(condKey(r.c))} art={<CondArt c={r.c} size={22} />} disabled={disabled} onPress={() => setPicking({ kind: 'cond', i })} />
          <Icon name="forward" size={16} color={colors.mute} stroke={2.4} />
          <Chip kind="act" label={t(actKey(r.a))} art={<Icon name={r.a} size={18} color={colors.ink} />} disabled={disabled} onPress={() => setPicking({ kind: 'act', i })} />
          <View style={styles.tools}>
            {i > 0 && (
              <Pressable accessibilityRole="button" accessibilityLabel={t('moveUp')} disabled={disabled} onPress={() => moveUp(i)} hitSlop={6} style={styles.tool}>
                <Icon name="up" size={18} color={colors.mute} />
              </Pressable>
            )}
            <Pressable accessibilityRole="button" accessibilityLabel={t('removeRule')} disabled={disabled} onPress={() => remove(i)} hitSlop={6} style={styles.tool}>
              <Icon name="close" size={18} color={colors.mute} />
            </Pressable>
          </View>
        </View>
      ))}
      <View style={[styles.rule, styles.last, highlight.has(n) && styles.lit]}>
        <Text style={styles.kw}>{n ? t('elseWord') : t('alwaysWord')}</Text>
        <Chip kind="act" label={t(actKey(program.def))} art={<Icon name={program.def} size={18} color={colors.ink} />} disabled={disabled} onPress={() => setPicking({ kind: 'act', i: n })} />
      </View>
      {n < MAX_RULES && (
        <Pressable accessibilityRole="button" disabled={disabled} onPress={add} style={({ pressed }) => [styles.add, pressed && { opacity: 0.7 }]}>
          <Text style={styles.addText}>{t('addRule')}</Text>
        </Pressable>
      )}

      <Overlay visible={!!picking} onRequestClose={() => setPicking(null)}>
        <Text style={styles.pickTitle}>{picking?.kind === 'cond' ? t('pickCondition') : t('pickAction')}</Text>
        <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ gap: 8 }}>
          {options.map((o) => (
            <Pressable
              key={o}
              accessibilityRole="radio"
              accessibilityState={{ selected: o === current }}
              onPress={() => pick(o)}
              style={({ pressed }) => [styles.option, o === current && styles.optionOn, pressed && { opacity: 0.7 }]}
            >
              {picking?.kind === 'cond' ? <CondArt c={o as Cond} size={28} /> : <Icon name={o as Act} size={24} color={colors.ink} />}
              <Text style={styles.optionText}>{t(picking?.kind === 'cond' ? condKey(o as Cond) : actKey(o as Act))}</Text>
              {fresh.includes(o) && <Text style={styles.fresh}>{t('newTool')}</Text>}
            </Pressable>
          ))}
        </ScrollView>
        {picking?.kind === 'act' && acts.includes('stepRight') && <Text style={styles.note}>{t('actStepNote')}</Text>}
        <Button label={t('close')} onPress={() => setPicking(null)} />
      </Overlay>
    </View>
  );
}

function Chip({ kind, label, art, disabled, onPress }: { kind: 'cond' | 'act'; label: string; art: ReactNode; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, kind === 'cond' ? styles.cond : styles.act, pressed && { transform: [{ translateY: 2 }] }]}
    >
      {art}
      <Text style={styles.chipText} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Read-only code, used by hints. */
export function StaticProgram({ program, upTo }: { program: Program; upTo: number }) {
  const { t } = useI18n();
  const n = program.rules.length;
  return (
    <View style={{ gap: 6 }}>
      {program.rules.slice(0, upTo).map((r, i) => (
        <Text key={i} style={styles.staticLine}>
          {t('ifWord')} {t(condKey(r.c))} → {t(actKey(r.a))}
        </Text>
      ))}
      {upTo > n && (
        <Text style={styles.staticLine}>
          {n ? t('elseWord') : t('alwaysWord')} {t(actKey(program.def))}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: colors.panel2,
    borderRadius: 14,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  last: { backgroundColor: 'transparent', borderStyle: 'dashed', borderColor: colors.line },
  lit: { borderColor: colors.lantern, borderStyle: 'solid' },
  kw: { fontSize: 12, fontWeight: '900', letterSpacing: 1, color: colors.mute, minWidth: 48 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingHorizontal: 10, borderRadius: 12, borderWidth: 1, flexShrink: 1 },
  cond: { backgroundColor: colors.cond, borderColor: colors.condLine },
  act: { backgroundColor: colors.act, borderColor: colors.actLine },
  chipText: { fontSize: 15, fontWeight: '800', color: colors.ink, flexShrink: 1 },
  tools: { flexDirection: 'row', marginLeft: 'auto', gap: 2 },
  tool: { padding: 8, borderRadius: 10 },
  add: { minHeight: 48, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  addText: { fontSize: 16, fontWeight: '800', color: colors.mute },
  pickTitle: { fontSize: 22, fontWeight: '900', color: colors.wool, textAlign: 'center' },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel2 },
  optionOn: { borderColor: colors.lantern, borderWidth: 2 },
  optionText: { fontSize: 17, fontWeight: '800', color: colors.ink, flex: 1 },
  fresh: { fontSize: 11, fontWeight: '900', color: '#2A1D05', backgroundColor: colors.lantern, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, overflow: 'hidden' },
  note: { fontSize: 13, color: colors.mute, textAlign: 'center' },
  staticLine: { fontSize: 15, fontWeight: '800', color: colors.ink },
});
