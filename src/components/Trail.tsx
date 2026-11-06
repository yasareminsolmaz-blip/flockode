import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '../theme';
import { Icon } from './Icons';

export interface TrailStop {
  key: string;
  /** Big text inside the round stop, e.g. the world or level number. */
  badge: string;
  /** Name under the stop. */
  label: string;
  /** Extra line under the name (stars, "full version" note...). */
  foot?: ReactNode;
  state: 'open' | 'done' | 'locked';
  /** A bigger stop with a lantern ring, used for each world's last level. */
  big?: boolean;
  a11y: string;
  onPress?: () => void;
}

/**
 * A winding meadow path: stops run left to right, then turn and come back right to left,
 * so the whole map reads as one trail the flock walks along (not a grid of cards).
 */
export function Trail({ stops, size = 78, rowHeight = 190, maxCols = 5 }: { stops: TrailStop[]; size?: number; rowHeight?: number; maxCols?: number }) {
  const [width, setWidth] = useState(0);
  const cols = Math.max(2, Math.min(maxCols, Math.floor(width / 150) || 2));
  const cell = width / cols;
  const rows = Math.ceil(stops.length / cols);
  const top = size / 2 + 8;

  const pos = stops.map((_, i) => {
    const r = Math.floor(i / cols);
    const k = i % cols;
    const c = r % 2 === 0 ? k : cols - 1 - k;
    return { x: (c + 0.5) * cell, y: top + r * rowHeight };
  });

  // Straight steps along a row, wide curves where the trail turns into the next row.
  const segment = (i: number) => {
    const a = pos[i];
    const b = pos[i + 1];
    if (a.y === b.y) return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
    const out = Math.floor(i / cols) % 2 === 0 ? 1 : -1;
    const bulge = Math.min(cell * 0.48, 90) * out;
    return `M ${a.x} ${a.y} C ${a.x + bulge} ${a.y}, ${b.x + bulge} ${b.y}, ${b.x} ${b.y}`;
  };

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ width: '100%', height: width ? (rows - 1) * rowHeight + size + 120 : 0 }}>
      {width > 0 && (
        <>
          <Svg width={width} height={(rows - 1) * rowHeight + size + 120} style={StyleSheet.absoluteFill}>
            {pos.slice(0, -1).map((_, i) => {
              const walked = stops[i + 1].state !== 'locked';
              return (
                <Path
                  key={i}
                  d={segment(i)}
                  stroke={walked ? colors.lantern : colors.tuft}
                  strokeWidth={walked ? 6 : 5}
                  strokeDasharray={walked ? undefined : '2 12'}
                  strokeLinecap="round"
                  fill="none"
                  opacity={walked ? 0.85 : 1}
                />
              );
            })}
          </Svg>
          {stops.map((s, i) => {
            const d = s.big ? size + 14 : size;
            const lw = Math.min(cell - 8, 170);
            return (
              <View key={s.key} style={[styles.stop, { left: pos[i].x - lw / 2, top: pos[i].y - d / 2, width: lw }]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={s.a11y}
                  disabled={!s.onPress}
                  onPress={s.onPress}
                  hitSlop={6}
                  style={({ pressed }) => [
                    styles.disc,
                    { width: d, height: d, borderRadius: d / 2 },
                    s.state === 'done' && styles.done,
                    s.state === 'locked' && styles.locked,
                    s.big && styles.big,
                    pressed && { transform: [{ scale: 0.94 }] },
                  ]}
                >
                  {s.state === 'locked' ? (
                    <Icon name="lock" size={d * 0.32} color={colors.mute} stroke={2.2} />
                  ) : (
                    <Text style={[styles.badge, { fontSize: d * 0.38 }, s.state === 'done' && { color: '#24331F' }]}>{s.badge}</Text>
                  )}
                </Pressable>
                <Text style={[styles.label, s.state === 'locked' && { color: colors.mute }]} numberOfLines={2}>
                  {s.label}
                </Text>
                {s.foot}
              </View>
            );
          })}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stop: { position: 'absolute', alignItems: 'center', gap: 6 },
  disc: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.meadow2,
    borderWidth: 4,
    borderColor: colors.wool,
    boxShadow: '0px 8px 0px rgba(0,0,0,0.35)',
  },
  done: { backgroundColor: colors.good, borderColor: colors.wool },
  locked: { backgroundColor: colors.soil, borderColor: colors.tuft, borderStyle: 'dashed', boxShadow: 'none' },
  big: { borderColor: colors.lantern, borderWidth: 6 },
  badge: { fontWeight: '900', color: colors.wool, fontVariant: ['tabular-nums'] },
  label: { fontSize: 15, fontWeight: '800', color: colors.wool, textAlign: 'center', lineHeight: 19 },
});
