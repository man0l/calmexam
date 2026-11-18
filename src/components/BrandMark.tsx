import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

export function BrandMark({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Rect x={0} y={0} width={64} height={64} rx={16} fill={colors.primary} />
      <Path
        d="M16 27c5.3-5.3 10.7-5.3 16 0s10.7 5.3 16 0M16 39c5.3-5.3 10.7-5.3 16 0s10.7 5.3 16 0"
        stroke={colors.cream}
        strokeWidth={4.5}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
