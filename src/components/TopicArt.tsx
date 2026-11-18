import type { ReactNode } from 'react';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

type Motif =
  | 'line'
  | 'cross'
  | 'parabola'
  | 'pie'
  | 'growth'
  | 'circle'
  | 'triangle'
  | 'bars'
  | 'limit'
  | 'area'
  | 'tangent'
  | 'grid'
  | 'log'
  | 'steps'
  | 'wave'
  | 'arrow';

const MOTIF: Record<string, Motif> = {
  'sat-linear-equations': 'line',
  'sat-linear-functions': 'line',
  'sat-systems': 'cross',
  'sat-quadratics': 'parabola',
  'sat-percentages': 'pie',
  'sat-exponentials': 'growth',
  'sat-circles': 'circle',
  'sat-geometry': 'triangle',
  'sat-statistics': 'bars',
  'calc-limits': 'limit',
  'calc-derivatives': 'tangent',
  'calc-applications': 'parabola',
  'calc-integrals': 'area',
  'al-algebra': 'grid',
  'al-differentiation': 'tangent',
  'al-integration': 'area',
  'al-exponentials-logs': 'log',
  'al-sequences': 'steps',
  'al-trigonometry': 'wave',
  'al-coordinate-geometry': 'circle',
  'al-mechanics': 'arrow',
};

const TINTS = [
  { pebble: colors.primarySoft, shade: colors.mint },
  { pebble: colors.amberSoft, shade: colors.sand },
  { pebble: colors.coralSoft, shade: colors.coral },
];

const PEBBLE = 'M33 5c15 0 26 9 26 26 0 17-11 28-28 28S5 49 5 32C5 16 17 5 33 5z';

function motifArt(m: Motif, ink: string, accent: string, paper: string): ReactNode {
  const s = { stroke: ink, strokeWidth: 3.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  switch (m) {
    case 'line':
      return (
        <>
          <Path d="M17 44L47 20" {...s} />
          <Circle cx={25} cy={37.6} r={4} fill={accent} />
          <Circle cx={39} cy={26.4} r={4} fill={paper} stroke={ink} strokeWidth={2.4} />
        </>
      );
    case 'cross':
      return (
        <>
          <Path d="M16 42L48 22" {...s} />
          <Path d="M18 22L46 44" {...s} stroke={accent} />
          <Circle cx={32} cy={32.5} r={4.5} fill={paper} stroke={ink} strokeWidth={2.4} />
        </>
      );
    case 'parabola':
      return (
        <>
          <Path d="M17 18C22 46 42 46 47 18" {...s} />
          <Circle cx={32} cy={39} r={4.5} fill={accent} />
        </>
      );
    case 'pie':
      return (
        <>
          <Circle cx={32} cy={32} r={14} fill={paper} stroke={ink} strokeWidth={3} />
          <Path d="M32 32V18A14 14 0 0 1 45.3 36.3Z" fill={accent} stroke={ink} strokeWidth={2.4} strokeLinejoin="round" />
        </>
      );
    case 'growth':
      return (
        <>
          <Path d="M16 44C30 43 38 36 46 18" {...s} />
          <Path d="M16 47H48" {...s} strokeWidth={2} strokeOpacity={0.5} />
          <Circle cx={46} cy={18} r={4.5} fill={accent} />
        </>
      );
    case 'circle':
      return (
        <>
          <Circle cx={32} cy={32} r={14} fill={paper} stroke={ink} strokeWidth={3} />
          <Path d="M32 32L43 24" {...s} strokeWidth={2.6} />
          <Circle cx={32} cy={32} r={3.5} fill={accent} />
        </>
      );
    case 'triangle':
      return (
        <>
          <Path d="M18 44H46V20Z" fill={paper} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
          <Rect x={39} y={37} width={7} height={7} fill={accent} />
        </>
      );
    case 'bars':
      return (
        <>
          <Rect x={17} y={30} width={8} height={15} rx={2} fill={paper} stroke={ink} strokeWidth={2.6} />
          <Rect x={28} y={20} width={8} height={25} rx={2} fill={accent} stroke={ink} strokeWidth={2.6} />
          <Rect x={39} y={26} width={8} height={19} rx={2} fill={paper} stroke={ink} strokeWidth={2.6} />
        </>
      );
    case 'limit':
      return (
        <>
          <Path d="M15 40C24 38 28 30 32 28" {...s} />
          <Path d="M32 28C36 26 41 20 49 19" {...s} />
          <Circle cx={32} cy={28} r={4.2} fill={paper} stroke={accent} strokeWidth={3} />
        </>
      );
    case 'area':
      return (
        <>
          <Path d="M21 45V33C26 25 34 22 43 24V45Z" fill={accent} />
          <Path d="M15 37C24 24 36 19 49 23" {...s} />
          <Path d="M15 45H49" {...s} strokeWidth={2.4} />
        </>
      );
    case 'tangent':
      return (
        <>
          <Path d="M16 44C24 22 40 22 48 44" {...s} />
          <Path d="M17 26H47" {...s} stroke={accent} />
          <Circle cx={32} cy={27.5} r={4} fill={paper} stroke={ink} strokeWidth={2.4} />
        </>
      );
    case 'grid':
      return (
        <>
          <Rect x={17} y={17} width={18} height={18} rx={2} fill={accent} stroke={ink} strokeWidth={2.6} />
          <Rect x={35} y={17} width={12} height={18} rx={2} fill={paper} stroke={ink} strokeWidth={2.6} />
          <Rect x={17} y={35} width={18} height={12} rx={2} fill={paper} stroke={ink} strokeWidth={2.6} />
          <Rect x={35} y={35} width={12} height={12} rx={2} fill={paper} stroke={ink} strokeWidth={2.6} />
        </>
      );
    case 'log':
      return (
        <>
          <Path d="M18 48C20 32 30 24 48 21" {...s} />
          <Path d="M18 16V48" {...s} strokeWidth={2} strokeOpacity={0.5} />
          <Circle cx={23} cy={31} r={4} fill={accent} />
        </>
      );
    case 'steps':
      return (
        <>
          <Circle cx={18} cy={42} r={4} fill={paper} stroke={ink} strokeWidth={2.6} />
          <Circle cx={28} cy={35} r={5} fill={paper} stroke={ink} strokeWidth={2.6} />
          <Circle cx={39} cy={27} r={6} fill={accent} stroke={ink} strokeWidth={2.6} />
          <Circle cx={47} cy={18} r={3} fill={ink} />
        </>
      );
    case 'wave':
      return (
        <>
          <Path d="M14 32C19 18 25 18 30 32S41 46 46 32" {...s} />
          <Circle cx={22} cy={21.5} r={4} fill={accent} />
          <Path d="M14 32H50" {...s} strokeWidth={2} strokeOpacity={0.5} />
        </>
      );
    case 'arrow':
      return (
        <>
          <Rect x={14} y={36} width={14} height={10} rx={3} fill={accent} stroke={ink} strokeWidth={2.6} />
          <Path d="M24 30L46 20" {...s} />
          <Path d="M38 18L46 20 42 27" {...s} />
        </>
      );
  }
}

interface Props {
  topicId: string;
  index?: number;
  size?: number;
  locked?: boolean;
}

export function TopicArt({ topicId, index = 0, size = 56, locked }: Props) {
  const tint = TINTS[index % TINTS.length];
  const pebble = locked ? colors.inset : tint.pebble;
  const shade = locked ? colors.border : tint.shade;
  const ink = locked ? colors.inkFaint : colors.lagoon;
  const accent = locked ? colors.edge : tint === TINTS[0] ? colors.coral : colors.primary;
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path d={PEBBLE} fill={shade} transform="translate(0 3)" />
      <Path d={PEBBLE} fill={pebble} />
      <G>{motifArt(MOTIF[topicId] ?? 'line', ink, accent, colors.surface)}</G>
    </Svg>
  );
}

export function ExamArt({ exam, size = 56, selected }: { exam: string; size?: number; selected?: boolean }) {
  const motif: Motif = exam === 'sat' ? 'parabola' : exam === 'ap-calc-ab' ? 'area' : 'wave';
  const pebble = selected ? colors.surface : colors.primarySoft;
  const shade = colors.mint;
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path d={PEBBLE} fill={shade} transform="translate(0 3)" />
      <Path d={PEBBLE} fill={pebble} />
      <G>{motifArt(motif, colors.lagoon, colors.coral, colors.surface)}</G>
    </Svg>
  );
}
