import * as Haptics from 'expo-haptics';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Board, cellSizeFor, type SheepView } from '../../components/Board';
import { Icon, Star } from '../../components/Icons';
import { ProgramEditor, StaticProgram } from '../../components/ProgramEditor';
import { BackButton } from '../../components/Screen';
import { SoundToggle } from '../../components/SoundToggle';
import { Button, Card, Overlay, ui } from '../../components/ui';
import { LEVELS, newTools, WORLDS } from '../../game/data';
import {
  act,
  actOf,
  choose,
  everySquare,
  field,
  lines,
  shuffled,
  starsFor,
  stateKey,
  type Program,
  type Sheep,
} from '../../game/engine';
import { useI18n } from '../../i18n';
import { useSounds } from '../../logic/sounds';
import { isPlayableWorld, useProgress } from '../../store/Progress';
import { colors } from '../../theme';

const STEP_MS = 440;
const MAX_STEPS = 400;
const HINT_WAIT = 30;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type Msg = { kind: 'bad' | 'info' | 'good'; text: string; sub?: string } | null;
interface Sim extends Sheep {
  id: number;
  angle: number;
  done: boolean;
  lost: boolean;
  /** Walked onto a wolf: lost for good and taken off the board */
  eaten: boolean;
  bump: boolean;
  seen: Set<number>;
}

export default function LevelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const index = Number(id);
  const { unlocked, owned } = useProgress();
  if (!LEVELS[index] || index >= unlocked) return <Redirect href="/" />;
  if (!isPlayableWorld(WORLDS[LEVELS[index].w].free, owned)) return <Redirect href="/shop" />;
  // A fresh component per level keeps all play state local and resets it on "next level".
  return <Game key={index} index={index} />;
}

/** Board positions for a flock; sheep sharing a square are spread out a little. */
function toView(sims: Sim[], t: number): SheepView[] {
  const groups = new Map<string, number[]>();
  sims.forEach((s, i) => {
    if (s.done || s.eaten) return;
    const k = `${s.x},${s.y}`;
    groups.set(k, [...(groups.get(k) ?? []), i]);
  });
  return sims.map((s, i) => {
    const g = groups.get(`${s.x},${s.y}`);
    let ox = 0;
    let oy = 0;
    if (g && g.length > 1) {
      const a = (g.indexOf(i) / g.length) * Math.PI * 2;
      ox = Math.cos(a) * 0.16;
      oy = Math.sin(a) * 0.16;
    }
    return { id: s.id, x: s.x, y: s.y, angle: s.angle, done: s.done, eaten: s.eaten, lost: s.lost, bump: s.bump, ox, oy, t };
  });
}

const startSims = (flock: Sheep[]): Sim[] =>
  flock.map((s, id) => ({ ...s, id, angle: s.d * 90, done: false, lost: false, eaten: false, bump: false, seen: new Set([stateKey(s)]) }));

function Game({ index }: { index: number }) {
  const level = LEVELS[index];
  const world = WORLDS[level.w];
  const F = useMemo(() => field(level), [level]);
  const fresh = useMemo(() => newTools(index), [index]);
  const { recordWin, owned } = useProgress();
  const sfx = useSounds();
  const { t, levelName, levelTip, worldName } = useI18n();
  const { width, height } = useWindowDimensions();
  const wide = width >= 900 || (width > height && width >= 700);

  const token = useRef(0);
  const [flock, setFlock] = useState<Sheep[]>(F.flock);
  const [shuffledOnce, setShuffledOnce] = useState(false);
  const [program, setProgram] = useState<Program>({ rules: [], def: 'forward' });
  const [view, setView] = useState<SheepView[]>(() => toView(startSims(F.flock), 0));
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [fast, setFast] = useState(false);
  const [highlight, setHighlight] = useState<Set<number>>(new Set());
  const [msg, setMsg] = useState<Msg>(null);
  const [heat, setHeat] = useState<{ x: number; y: number; n: number }[] | null>(null);
  const [win, setWin] = useState<{ stars: number; all: boolean; n: number } | null>(null);
  const [fails, setFails] = useState(0);
  const [hintStep, setHintStep] = useState(0);
  const [hintReadyAt, setHintReadyAt] = useState(0);
  const [now, setNow] = useState(0);
  const ms = fast ? STEP_MS / 2.2 : STEP_MS;

  const boxW = wide ? Math.min(width * 0.54, 720) : Math.min(width - 32, 680);
  const boxH = wide ? height - 250 : height * 0.48;
  const cell = cellSizeFor(F, { w: boxW, h: boxH });
  const inBarn = view.filter((s) => s.done).length;

  const resetBoard = useCallback(
    (f: Sheep[] = flock) => {
      token.current++;
      setRunning(false);
      setStep(0);
      setHighlight(new Set());
      setView(toView(startSims(f), 0));
    },
    [flock],
  );

  useEffect(() => {
    const tk = token;
    return () => {
      tk.current++;
    };
  }, []);

  // Hint countdown ticks once a second while waiting.
  useEffect(() => {
    if (hintReadyAt <= now) return;
    const id = setTimeout(() => setNow(Date.now()), 1000);
    return () => clearTimeout(id);
  }, [hintReadyAt, now]);

  const edited = (p: Program) => {
    setProgram(p);
    setMsg(null);
    setHeat(null);
    resetBoard();
  };

  const setNewFlock = (f: Sheep[], isShuffle: boolean) => {
    setFlock(f);
    setShuffledOnce(isShuffle);
    setMsg(null);
    resetBoard(f);
  };

  const run = async () => {
    if (running) {
      resetBoard();
      return;
    }
    setMsg(null);
    setWin(null);
    token.current++;
    const tok = token.current;
    const sims = startSims(flock);
    setView(toView(sims, 0));
    setRunning(true);
    sfx.play('start');
    await sleep(200);
    for (let n = 1; n <= MAX_STEPS; n++) {
      if (tok !== token.current) return;
      const used = new Set<number>();
      let bumped = false;
      for (const s of sims) {
        s.bump = false;
        if (s.done || s.eaten) continue;
        const line = choose(F, program, s);
        used.add(line);
        const a = actOf(program, line);
        if (a === 'right' || a === 'stepRight') s.angle += 90;
        else if (a === 'left' || a === 'stepLeft') s.angle -= 90;
        else if (a === 'back') s.angle += 180;
        const mv = act(F, s, a);
        if (mv === 'barn') s.done = true;
        else if (mv === 'wolf') {
          s.eaten = true;
          s.lost = true;
          bumped = true;
        } else {
          if (mv === 'bump') {
            s.bump = true;
            bumped = true;
          }
          const k = stateKey(s);
          if (s.seen.has(k)) s.lost = true;
          else s.seen.add(k);
        }
      }
      setHighlight(used);
      setStep(n);
      setView(toView(sims, n));
      if (bumped) sfx.play('bump');
      await sleep(ms);
      if (tok !== token.current) return;

      if (sims.every((s) => s.done)) {
        setRunning(false);
        setHighlight(new Set());
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        sfx.play('win');
        const every = everySquare(F, program);
        const st = starsFor(level, true, every.ok, lines(program));
        recordWin(index, st);
        setTimeout(() => {
          if (tok === token.current) setWin({ stars: st, all: every.ok, n: lines(program) });
          if (!every.ok) setHeat(every.cells);
        }, 500);
        return;
      }
      if (sims.every((s) => s.done || s.lost)) {
        setRunning(false);
        setHighlight(new Set());
        setFails((f) => f + 1);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        sfx.play('fail');
        const eaten = sims.filter((s) => s.eaten).length;
        const looping = sims.filter((s) => !s.done && !s.eaten).length;
        setMsg({
          kind: 'bad',
          text: [eaten ? t('lostToWolf', { n: eaten }) : '', looping ? t('lostSheep', { n: looping }) : ''].filter(Boolean).join(' '),
          sub: t('lostHelp'),
        });
        return;
      }
    }
    setRunning(false);
  };

  const testAll = () => {
    if (heat) {
      setHeat(null);
      setMsg(null);
      return;
    }
    const r = everySquare(F, program);
    setHeat(r.cells);
    const ok = r.cells.filter((c) => c.n === 4).length;
    setMsg(
      r.ok
        ? { kind: 'good', text: t('testAllOk') }
        : { kind: 'info', text: t('testResult', { ok, total: r.cells.length }), sub: t('testLegend') },
    );
  };

  // Hints reveal the stored solution one line at a time, with a short wait in between.
  const hintTotal = lines(level.sol);
  const wait = Math.max(0, Math.ceil((hintReadyAt - now) / 1000));
  const showHint = () => {
    setHintStep((h) => Math.min(hintTotal, h + 1));
    const tt = Date.now();
    setNow(tt);
    setHintReadyAt(tt + HINT_WAIT * 1000);
  };
  const hintLabel = hintStep >= hintTotal ? t('hintAllShown') : wait > 0 ? t('hintWait', { n: wait }) : hintStep ? t('hintMore') : t('hintGet');

  const isLast = index === LEVELS.length - 1;
  const worldEnd = index === world.b - 1;
  const nextLocked = !isLast && !isPlayableWorld(WORLDS[LEVELS[index + 1].w].free, owned);
  const goNext = () => {
    setWin(null);
    router.replace(nextLocked ? '/shop' : `/level/${index + 1}`);
  };

  const mission = (
    <Card>
      <Text style={ui.eyebrow}>
        {t('levelEyebrow', { w: world.idx + 1, name: worldName(world.idx), n: index - world.a + 1 })}
        {worldEnd ? <Text style={{ color: colors.lantern }}> · {t('bossLevel')}</Text> : null}
      </Text>
      <Text style={styles.levelTitle}>{levelName(level.k)}</Text>
      <Text style={styles.body}>{levelTip(level.k)}</Text>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          disabled={wait > 0 || hintStep >= hintTotal || running}
          onPress={showHint}
          style={[styles.hintBtn, fails >= 2 && hintStep === 0 && styles.hintNudge, (wait > 0 || hintStep >= hintTotal) && { opacity: 0.55 }]}
        >
          <Icon name="bulb" size={18} color={colors.lantern} stroke={2.2} />
          <Text style={styles.hintText}>{hintLabel}</Text>
        </Pressable>
      </View>
      {hintStep > 0 && (
        <View style={styles.hintBox}>
          <Text style={styles.hintBoxText}>{hintStep >= hintTotal ? t('hintSolution') : t('hintStarts')}</Text>
          <StaticProgram program={level.sol} upTo={hintStep} />
        </View>
      )}
    </Card>
  );

  const boardView = (
    <View style={{ gap: 12 }}>
      <View>
        <Board F={F} cell={cell} sheep={view} ms={ms} heat={heat} />
        <View style={styles.counters} pointerEvents="none">
          <Text style={styles.pill}>{t('inBarn', { n: inBarn, total: view.length })}</Text>
          <Text style={styles.pill}>{t('stepN', { n: step })}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Button
          label={running ? t('stop') : t('run')}
          kind={running ? 'dark' : 'go'}
          icon={<Icon name={running ? 'stop' : 'play'} size={20} color={running ? '#fff' : '#2A1D05'} />}
          onPress={run}
          style={{ flexGrow: 1 }}
        />
        <Button label={t('backToStart')} icon={<Icon name="reset" size={20} />} disabled={running || step === 0} onPress={() => resetBoard()} />
        <Button label={t('shuffle')} icon={<Icon name="shuffle" size={20} />} disabled={running} onPress={() => setNewFlock(shuffled(F, F.flock.length), true)} />
        {shuffledOnce && <Button label={t('original')} disabled={running} onPress={() => setNewFlock(F.flock, false)} />}
        <Button label={`${t('speed')} ${fast ? '2×' : '1×'}`} onPress={() => setFast((f) => !f)} />
      </View>
      {msg && (
        <View style={[styles.msg, msg.kind === 'bad' ? styles.msgBad : msg.kind === 'good' ? styles.msgGood : styles.msgInfo]}>
          <Text style={styles.msgText}>{msg.text}</Text>
          {msg.sub && <Text style={styles.msgSub}>{msg.sub}</Text>}
        </View>
      )}
    </View>
  );

  const panel = (
    <Card>
      <View style={styles.panelHead}>
        <Text style={styles.panelTitle}>{t('yourCode')}</Text>
        <Text style={[ui.fine, { fontVariant: ['tabular-nums'] }]}>{t('lineCount', { n: lines(program), best: level.best })}</Text>
      </View>
      <Text style={ui.fine}>{t('codeExplain')}</Text>
      <ProgramEditor
        program={program}
        conds={level.conds}
        acts={level.acts}
        fresh={fresh}
        highlight={highlight}
        disabled={running}
        onChange={edited}
      />
      <Button label={heat ? t('hideTest') : t('testAll')} icon={<Icon name="grid" size={20} />} disabled={running} onPress={testAll} />
    </Card>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
          <BackButton label={t('worldN', { n: world.idx + 1 })} onPress={() => router.replace(`/world/${world.idx}`)} />
          <SoundToggle compact />
        </View>
        {wide ? (
          <View style={styles.wide}>
            <View style={{ flex: 1.15, gap: 14 }}>
              {mission}
              {boardView}
            </View>
            <View style={{ flex: 1 }}>{panel}</View>
          </View>
        ) : (
          <>
            {mission}
            {boardView}
            {panel}
          </>
        )}
      </ScrollView>

      <Overlay visible={!!win} onRequestClose={() => setWin(null)}>
        {win && (
          <>
            <View style={styles.stars}>
              {[1, 2, 3].map((k) => (
                <Star key={k} on={k <= win.stars} size={52} />
              ))}
            </View>
            <Text style={styles.winTitle}>
              {worldEnd && win.stars >= 1 ? t('winWorld', { n: world.idx + 1 }) : win.stars === 3 ? t('win3') : win.stars === 2 ? t('win2') : t('win1')}
            </Text>
            <View style={{ gap: 6 }}>
              <Check on label={t('star1')} />
              <Check on={win.all} label={t('star2')} />
              <Check on={win.stars === 3} label={t('star3', { n: level.best })} />
            </View>
            <Text style={styles.winText}>
              {!win.all ? t('winNotEverywhere') : win.n > level.best ? t('winTryShorter', { n: win.n, best: level.best }) : t('winShortest')}
              {isLast ? `\n\n${t('allDone')}` : ''}
            </Text>
            <View style={styles.row}>
              <Button
                label={win.all ? t('playAgain') : t('showMap')}
                onPress={() => {
                  setWin(null);
                  resetBoard();
                }}
              />
              {!isLast && (
                <Button
                  label={nextLocked ? t('seeFullVersion') : worldEnd ? t('worldN', { n: world.idx + 2 }) : t('nextLevel')}
                  kind="go"
                  onPress={goNext}
                  style={{ flexGrow: 1 }}
                />
              )}
            </View>
          </>
        )}
      </Overlay>
    </SafeAreaView>
  );
}

function Check({ on, label }: { on: boolean; label: string }) {
  return (
    <View style={styles.check}>
      <View style={[styles.checkDot, on && styles.checkOn]}>{on && <Icon name="check" size={14} color="#0F1C31" stroke={3} />}</View>
      <Text style={[styles.checkText, !on && { color: colors.mute }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.night },
  content: { width: '100%', maxWidth: 1320, alignSelf: 'center', padding: 16, paddingBottom: 40, gap: 14 },
  wide: { flexDirection: 'row', gap: 20, alignItems: 'flex-start' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', alignItems: 'center' },
  levelTitle: { fontSize: 26, fontWeight: '900', color: colors.wool },
  body: { fontSize: 16, lineHeight: 23, color: colors.ink },
  hintBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel2, borderRadius: 999, paddingHorizontal: 14, minHeight: 42 },
  hintNudge: { borderColor: colors.lantern, borderWidth: 2, transform: [{ scale: 1.05 }] },
  hintText: { fontWeight: '800', color: colors.ink, fontSize: 15, fontVariant: ['tabular-nums'] },
  hintBox: { backgroundColor: colors.night, borderRadius: 12, padding: 12, gap: 8, borderWidth: 1, borderColor: colors.line },
  hintBoxText: { fontWeight: '700', color: colors.mute, fontSize: 14 },
  counters: { position: 'absolute', top: 16, left: 16, flexDirection: 'row', gap: 8 },
  pill: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
    backgroundColor: 'rgba(18,33,58,0.85)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    overflow: 'hidden',
    fontVariant: ['tabular-nums'],
  },
  msg: { borderRadius: 14, borderWidth: 1, padding: 12, gap: 4 },
  msgBad: { backgroundColor: colors.badBg, borderColor: colors.bad },
  msgInfo: { backgroundColor: colors.panel, borderColor: colors.line },
  msgGood: { backgroundColor: '#1F3B33', borderColor: colors.good },
  msgText: { fontWeight: '800', fontSize: 15, lineHeight: 21, color: colors.ink },
  msgSub: { fontSize: 14, lineHeight: 20, color: colors.mute },
  panelHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 },
  panelTitle: { fontSize: 20, fontWeight: '900', color: colors.wool },
  stars: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  winTitle: { fontSize: 28, fontWeight: '900', color: colors.wool, textAlign: 'center' },
  winText: { fontSize: 15, lineHeight: 22, color: colors.ink, textAlign: 'center' },
  check: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.starOff, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.good, borderColor: colors.good },
  checkText: { fontSize: 15, fontWeight: '800', color: colors.ink },
});
