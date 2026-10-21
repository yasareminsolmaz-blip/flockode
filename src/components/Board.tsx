import { memo, useEffect, useRef, type ReactNode } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

import { cellAt, DX, DY, type Field } from '../game/engine';
import { colors } from '../theme';
import { SheepArt } from './Icons';

const FRAME = 8;

/** Where one sheep is drawn after the latest step. */
export interface SheepView {
  id: number;
  x: number;
  y: number;
  /** Facing in degrees, counted up from the start so turns always animate the short way */
  angle: number;
  done: boolean;
  lost: boolean;
  /** The sheep tried to walk into a fence this step */
  bump: boolean;
  /** Small shift (in cells) when several sheep share a square */
  ox: number;
  oy: number;
  /** Step counter; every change animates the sheep to its new place */
  t: number;
}

/** Largest cell size so the whole field fits in `box`. */
export function cellSizeFor(F: Pick<Field, 'rows' | 'cols'>, box: { w: number; h: number }) {
  return Math.max(26, Math.floor(Math.min((box.w - 2 * FRAME) / F.cols, (box.h - 2 * FRAME) / F.rows, 96)));
}

export const Board = memo(function Board({
  F,
  cell,
  sheep,
  ms,
  heat,
}: {
  F: Field;
  cell: number;
  sheep: SheepView[];
  ms: number;
  heat: { x: number; y: number; n: number }[] | null;
}) {
  return (
    <View style={[styles.frame, { width: F.cols * cell + 2 * FRAME, height: F.rows * cell + 2 * FRAME }]}>
      <View style={{ width: F.cols * cell, height: F.rows * cell }}>
        <Ground F={F} cell={cell} />
        {heat && (
          <Svg width={F.cols * cell} height={F.rows * cell} style={StyleSheet.absoluteFill} pointerEvents="none">
            {heat.map((h) => (
              <Rect
                key={`${h.x},${h.y}`}
                x={h.x * cell + cell * 0.12}
                y={h.y * cell + cell * 0.12}
                width={cell * 0.76}
                height={cell * 0.76}
                rx={cell * 0.18}
                fill={h.n === 4 ? colors.good : h.n === 0 ? colors.bad : colors.warn}
                opacity={0.5}
              />
            ))}
          </Svg>
        )}
        {sheep.map((s) => (
          <SheepSprite key={s.id} s={s} cell={cell} ms={ms} />
        ))}
      </View>
    </View>
  );
});

const SheepSprite = memo(function SheepSprite({ s, cell, ms }: { s: SheepView; cell: number; ms: number }) {
  const pos = useRef(new Animated.ValueXY({ x: (s.x + s.ox) * cell, y: (s.y + s.oy) * cell })).current;
  const rot = useRef(new Animated.Value(s.angle)).current;
  const scale = useRef(new Animated.Value(s.done ? 0 : 1)).current;
  const first = useRef(true);
  const cellRef = useRef(cell);

  useEffect(() => {
    const target = { x: (s.x + s.ox) * cell, y: (s.y + s.oy) * cell };
    // A new layout (first draw, a resize or a reset) jumps without animation.
    if (first.current || cellRef.current !== cell || s.t === 0) {
      first.current = false;
      cellRef.current = cell;
      pos.stopAnimation();
      rot.stopAnimation();
      scale.stopAnimation();
      pos.setValue(target);
      rot.setValue(s.angle);
      scale.setValue(s.done ? 0 : 1);
      return;
    }
    const anims: Animated.CompositeAnimation[] = [
      Animated.timing(rot, { toValue: s.angle, duration: ms * 0.8, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ];
    if (s.bump) {
      const d = ((Math.round(s.angle / 90) % 4) + 4) % 4;
      const k = cell * 0.16;
      anims.push(
        Animated.sequence([
          Animated.timing(pos, { toValue: { x: target.x + DX[d] * k, y: target.y + DY[d] * k }, duration: ms * 0.4, useNativeDriver: true }),
          Animated.timing(pos, { toValue: target, duration: ms * 0.4, useNativeDriver: true }),
        ]),
      );
    } else {
      anims.push(Animated.timing(pos, { toValue: target, duration: ms * 0.9, easing: Easing.inOut(Easing.quad), useNativeDriver: true }));
    }
    if (s.done) anims.push(Animated.timing(scale, { toValue: 0, duration: ms, easing: Easing.in(Easing.quad), useNativeDriver: true }));
    Animated.parallel(anims).start();
    // Animate only when the step changes; the other fields arrive with it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.t, cell]);

  const rotate = rot.interpolate({ inputRange: [-36000, 36000], outputRange: ['-36000deg', '36000deg'] });
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.sheep, { width: cell, height: cell, transform: [{ translateX: pos.x }, { translateY: pos.y }, { scale }] }]}
    >
      {/* The art faces right; facing 0° means up. */}
      <Animated.View style={{ transform: [{ rotate }, { rotate: '-90deg' }] }}>
        <SheepArt size={cell * 0.92} />
      </Animated.View>
      {s.lost && !s.done && (
        <View style={[styles.lost, { width: cell * 0.36, height: cell * 0.36, borderRadius: cell, top: 0, right: cell * 0.04 }]}>
          <Text style={[styles.lostText, { fontSize: cell * 0.26 }]}>?</Text>
        </View>
      )}
    </Animated.View>
  );
});

/** Grass, fences, flowers and the barn. Drawn once per field and cell size. */
const Ground = memo(function Ground({ F, cell }: { F: Field; cell: number }) {
  const u = cell;
  const parts: ReactNode[] = [];
  for (let y = 0; y < F.rows; y++)
    for (let x = 0; x < F.cols; x++) {
      const c = cellAt(F, x, y);
      parts.push(
        <Rect key={`g${x},${y}`} x={x * u} y={y * u} width={u + 0.5} height={u + 0.5} fill={c === '#' ? colors.soil : (x + y) % 2 ? colors.meadow : colors.meadow2} />,
      );
      if (c !== '#') {
        for (let k = 0; k < 3; k++) {
          const tx = (x + 0.2 + ((x * 7 + y * 13 + k * 29) % 60) / 100) * u;
          const ty = (y + 0.25 + ((x * 11 + y * 5 + k * 17) % 55) / 100) * u;
          parts.push(
            <Path
              key={`t${x},${y},${k}`}
              d={`M${tx - u * 0.04} ${ty}l${-u * 0.02} ${-u * 0.06}M${tx} ${ty}v${-u * 0.08}M${tx + u * 0.04} ${ty}l${u * 0.02} ${-u * 0.06}`}
              stroke={colors.tuft}
              strokeWidth={Math.max(1, u * 0.025)}
              strokeLinecap="round"
            />,
          );
        }
      }
    }
  // Lantern glow around the barn
  const bx = (F.barn.x + 0.5) * u;
  const by = (F.barn.y + 0.5) * u;
  [2.0, 1.4, 0.9].forEach((r, i) => parts.push(<Circle key={`glow${i}`} cx={bx} cy={by} r={u * r} fill={colors.lantern} opacity={0.06 + i * 0.03} />));

  // Fence rails between neighbouring fence posts, then the posts
  const rail = (key: string, x1: number, y1: number, x2: number, y2: number) => (
    <G key={key}>
      <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.woodDark} strokeWidth={u * 0.11} strokeLinecap="round" />
      <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.wood} strokeWidth={u * 0.06} strokeLinecap="round" />
    </G>
  );
  for (let y = 0; y < F.rows; y++)
    for (let x = 0; x < F.cols; x++) {
      if (cellAt(F, x, y) !== '#') continue;
      const cx = (x + 0.5) * u;
      const cy = (y + 0.5) * u;
      if (cellAt(F, x + 1, y) === '#' && x + 1 < F.cols) parts.push(rail(`rx${x},${y}`, cx, cy, cx + u, cy));
      if (cellAt(F, x, y + 1) === '#' && y + 1 < F.rows) parts.push(rail(`ry${x},${y}`, cx, cy, cx, cy + u));
    }
  for (let y = 0; y < F.rows; y++)
    for (let x = 0; x < F.cols; x++) {
      const c = cellAt(F, x, y);
      const cx = (x + 0.5) * u;
      const cy = (y + 0.5) * u;
      if (c === '#') {
        parts.push(<Circle key={`p${x},${y}`} cx={cx} cy={cy + u * 0.02} r={u * 0.13} fill={colors.woodDark} />);
        parts.push(<Circle key={`q${x},${y}`} cx={cx} cy={cy} r={u * 0.1} fill={colors.wood} />);
      } else if (c === 'y' || c === 'b') {
        const col = c === 'y' ? colors.yellow : colors.blue;
        [0, 72, 144, 216, 288].forEach((a) =>
          parts.push(
            <Circle
              key={`f${x},${y},${a}`}
              cx={cx + Math.cos((a * Math.PI) / 180) * u * 0.14}
              cy={cy + Math.sin((a * Math.PI) / 180) * u * 0.14}
              r={u * 0.11}
              fill={col}
            />,
          ),
        );
        parts.push(<Circle key={`fc${x},${y}`} cx={cx} cy={cy} r={u * 0.08} fill="#FFF4D0" />);
      } else if (c === 'B') {
        const s = u * 0.8;
        const x0 = x * u + u * 0.1;
        const y0 = y * u + u * 0.1;
        parts.push(
          <G key="barn">
            <Rect x={x0} y={y0 + u * 0.04} width={s} height={s} rx={u * 0.08} fill={colors.barnDark} />
            <Rect x={x0} y={y0} width={s} height={s} rx={u * 0.08} fill={colors.barn} />
            <Rect x={x0 + s * 0.2} y={y0 + s * 0.2} width={s * 0.6} height={s * 0.6} fill="none" stroke={colors.wool} strokeWidth={u * 0.04} />
            <Path d={`M${x0 + s * 0.2} ${y0 + s * 0.2}L${x0 + s * 0.8} ${y0 + s * 0.8}M${x0 + s * 0.8} ${y0 + s * 0.2}L${x0 + s * 0.2} ${y0 + s * 0.8}`} stroke={colors.wool} strokeWidth={u * 0.04} />
          </G>,
        );
      }
    }
  return (
    <Svg width={F.cols * u} height={F.rows * u} style={StyleSheet.absoluteFill}>
      {parts}
    </Svg>
  );
});

const styles = StyleSheet.create({
  frame: { backgroundColor: colors.wood, borderRadius: 18, padding: FRAME, alignSelf: 'center', boxShadow: '0px 14px 30px rgba(0,0,0,0.35)' },
  sheep: { position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center' },
  lost: { position: 'absolute', backgroundColor: colors.lantern, alignItems: 'center', justifyContent: 'center' },
  lostText: { fontWeight: '900', color: '#2A1D05' },
});
