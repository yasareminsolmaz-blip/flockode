import { memo } from 'react';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import type { Act, Cond } from '../game/engine';
import { colors } from '../theme';

const PATHS = {
  forward: ['M12 19V5', 'M5 12l7-7 7 7'],
  left: ['M9 14 4 9l5-5', 'M4 9h11a5 5 0 0 1 5 5v5'],
  right: ['m15 14 5-5-5-5', 'M20 9H9a5 5 0 0 0-5 5v5'],
  back: ['M9 14 4 9l5-5', 'M4 9h10.5a5.5 5.5 0 0 1 0 11H11'],
  stepRight: ['M5 20V10h11', 'm12 6 4 4-4 4', 'M20 6v8'],
  stepLeft: ['M19 20V10H8', 'm12 6-4 4 4 4', 'M4 6v8'],
  bulb: ['M9 18h6M10 22h4', 'M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z'],
  lock: ['M8 11V7a4 4 0 0 1 8 0v4', 'M6 11h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z'],
  chevron: ['M15 18l-6-6 6-6'],
  play: ['M7 4.5v15l12-7.5z'],
  stop: ['M6 6h12v12H6z'],
  reset: ['M4 12a8 8 0 1 0 2.5-5.8', 'M4 4v4h4'],
  shuffle: ['M3 7h4c4 0 6 10 10 10h4', 'M3 17h4c1.6 0 2.8-1.6 3.9-3.6M14 7.3C14.9 7.1 15.9 7 17 7h4', 'M18 4l3 3-3 3M18 14l3 3-3 3'],
  grid: ['M4 4h16v16H4z', 'M4 12h16M12 4v16'],
  soundOn: ['M4 9h4l5-4v14l-5-4H4z', 'M16.5 8.5a5 5 0 0 1 0 7', 'M19.5 5.5a9 9 0 0 1 0 13'],
  soundOff: ['M4 9h4l5-4v14l-5-4H4z', 'm17 9 5 6', 'm22 9-5 6'],
  up: ['M12 19V5', 'M6 11l6-6 6 6'],
  close: ['M6 6l12 12M18 6 6 18'],
  check: ['M5 12.5 10 17l9-10'],
};
export type IconName = keyof typeof PATHS;

export const Icon = memo(function Icon({
  name,
  size = 24,
  color = colors.ink,
  stroke = 2.6,
}: {
  name: IconName;
  size?: number;
  color?: string;
  stroke?: number;
}) {
  const filled = name === 'play' || name === 'stop';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {PATHS[name].map((d) => (
        <Path
          key={d}
          d={d}
          fill={filled ? color : 'none'}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
});

export function Star({ on, size = 20 }: { on: boolean; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"
        fill={on ? colors.star : 'none'}
        stroke={on ? colors.star : colors.starOff}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const WOOL: [number, number][] = [[-10, -13], [7, -15], [-20, 3], [4, 0], [-8, 14], [9, 13], [-22, -10], [-20, 15]];

/** A sheep seen from above, facing right (rotate the view to face other ways). */
export const SheepArt = memo(function SheepArt({ size, tint = colors.wool }: { size: number; tint?: string }) {
  return (
    <Svg width={size} height={size} viewBox="-50 -50 100 100">
      <Ellipse cx={2} cy={6} rx={30} ry={24} fill="rgba(0,0,0,0.28)" />
      {WOOL.map(([x, y]) => (
        <Circle key={`${x},${y}`} cx={x} cy={y} r={13} fill={tint} />
      ))}
      {WOOL.slice(0, 4).map(([x, y]) => (
        <Circle key={`s${x},${y}`} cx={x + 3} cy={y + 3} r={5} fill="rgba(120,110,95,0.18)" />
      ))}
      <Ellipse cx={17} cy={-10} rx={6} ry={3.5} fill={colors.face} transform="rotate(-34 17 -10)" />
      <Ellipse cx={17} cy={10} rx={6} ry={3.5} fill={colors.face} transform="rotate(34 17 10)" />
      <Ellipse cx={24} cy={0} rx={10} ry={8.5} fill={colors.face} />
      <Circle cx={28} cy={-3.5} r={2} fill="#fff" />
      <Circle cx={28} cy={3.5} r={2} fill="#fff" />
    </Svg>
  );
});

/** Small robot used on the Robo Rota card. */
export function RobotMini({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Rect x={22.5} y={3} width={3} height={7} rx={1.5} fill={colors.ink} />
      <Circle cx={24} cy={4} r={3} fill={colors.lantern} />
      <Rect x={8} y={10} width={32} height={26} rx={8} fill="#E8553D" />
      <Rect x={13} y={16} width={22} height={12} rx={6} fill="#1D2B3C" />
      <Circle cx={19} cy={22} r={3} fill="#7FE0F0" />
      <Circle cx={29} cy={22} r={3} fill="#7FE0F0" />
      <Rect x={14} y={37} width={6} height={7} rx={2} fill="#A93623" />
      <Rect x={28} y={37} width={6} height={7} rx={2} fill="#A93623" />
    </Svg>
  );
}

/** Little picture for each condition: what the sheep looks at, from above. */
export const CondArt = memo(function CondArt({ c, size = 26 }: { c: Cond; size?: number }) {
  if (c === 'onYellow' || c === 'onBlue') return <Flower size={size} color={c === 'onYellow' ? colors.yellow : colors.blue} />;
  // A sheep dot in the middle facing up, and the square it checks.
  const spot = c.endsWith('Ahead') ? { x: 9, y: 1 } : c.endsWith('Right') ? { x: 17, y: 9 } : { x: 1, y: 9 };
  const fence = c.startsWith('fence');
  const barn = c === 'barnAhead';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={spot.x} y={spot.y} width={6} height={6} rx={1.5} fill={barn ? colors.barn : fence ? colors.wood : 'none'} stroke={fence || barn ? 'none' : colors.good} strokeWidth={1.6} strokeDasharray={fence || barn ? undefined : '2 1.5'} />
      <Circle cx={12} cy={13} r={4} fill={colors.wool} />
      <Circle cx={12} cy={9.5} r={2} fill={colors.face} />
    </Svg>
  );
});

export function Flower({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="-12 -12 24 24">
      <G>
        {[0, 72, 144, 216, 288].map((a) => (
          <Circle key={a} cx={Math.cos((a * Math.PI) / 180) * 5.5} cy={Math.sin((a * Math.PI) / 180) * 5.5} r={4.2} fill={color} />
        ))}
        <Circle r={3.2} fill={colors.lantern} />
      </G>
    </Svg>
  );
}

export const actIcon = (a: Act): IconName => a;
