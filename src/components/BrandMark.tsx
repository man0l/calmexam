import Svg, { Ellipse, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

export function BrandMark({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Rect x={0} y={0} width={64} height={64} rx={18} fill={colors.lagoon} />
      <Path d="M10 47c6-3 12-3 18 0s12 3 18 0 6-1.5 8-1.5" stroke={colors.primary} strokeWidth={3} strokeLinecap="round" fill="none" />
      <Ellipse cx={18} cy={40} rx={7} ry={4.5} fill={colors.sand} />
      <Ellipse cx={32} cy={31} rx={8} ry={5} fill={colors.mint} />
      <Ellipse cx={46} cy={20} rx={9} ry={5.5} fill={colors.surface} />
    </Svg>
  );
}
