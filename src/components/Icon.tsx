import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors, layout, type ColorToken } from '../theme';

export type IconName =
  | 'today'
  | 'practice'
  | 'progress'
  | 'settings'
  | 'check'
  | 'close'
  | 'back'
  | 'chevron'
  | 'lock'
  | 'spark'
  | 'bell'
  | 'card'
  | 'calendar';

interface Props {
  name: IconName;
  color?: ColorToken;
  size?: number;
}

export function Icon({ name, color = 'ink', size = layout.iconSize }: Props) {
  const c = colors[color];
  const stroke = { stroke: c, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'today' ? (
        <>
          <Circle cx={12} cy={12} r={4.2} {...stroke} />
          <Path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" {...stroke} />
        </>
      ) : null}
      {name === 'practice' ? (
        <>
          <Rect x={4} y={3.5} width={16} height={17} rx={3} {...stroke} />
          <Path d="M8 9h8M8 13h8M8 17h4" {...stroke} />
        </>
      ) : null}
      {name === 'progress' ? <Path d="M5 20V13M12 20V8M19 20V4" {...stroke} strokeWidth={2.4} /> : null}
      {name === 'settings' ? (
        <>
          <Path d="M4 7h10M18 7h2M4 17h4M12 17h8" {...stroke} />
          <Circle cx={16} cy={7} r={2} {...stroke} />
          <Circle cx={10} cy={17} r={2} {...stroke} />
        </>
      ) : null}
      {name === 'check' ? <Path d="M5 12.5l4.5 4.5L19 7.5" {...stroke} strokeWidth={2.2} /> : null}
      {name === 'close' ? <Path d="M6.5 6.5l11 11M17.5 6.5l-11 11" {...stroke} strokeWidth={2} /> : null}
      {name === 'back' ? <Path d="M15 5l-7 7 7 7" {...stroke} strokeWidth={2} /> : null}
      {name === 'chevron' ? <Path d="M9 5l7 7-7 7" {...stroke} strokeWidth={2} /> : null}
      {name === 'lock' ? (
        <>
          <Rect x={5} y={10.5} width={14} height={10} rx={2.5} {...stroke} />
          <Path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" {...stroke} />
        </>
      ) : null}
      {name === 'spark' ? <Path d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9z" {...stroke} /> : null}
      {name === 'bell' ? (
        <Path d="M6 16.5V11a6 6 0 0112 0v5.5l1.5 1.5h-15zM10 20.5a2 2 0 004 0" {...stroke} />
      ) : null}
      {name === 'card' ? (
        <>
          <Rect x={3} y={5.5} width={18} height={13} rx={2.5} {...stroke} />
          <Path d="M3 10h18" {...stroke} />
        </>
      ) : null}
      {name === 'calendar' ? (
        <>
          <Rect x={4} y={5} width={16} height={15} rx={3} {...stroke} />
          <Path d="M4 10h16M8.5 3v4M15.5 3v4" {...stroke} />
        </>
      ) : null}
    </Svg>
  );
}
