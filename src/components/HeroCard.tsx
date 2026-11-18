import { useState, type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Path, Pattern, Rect } from 'react-native-svg';
import { colors, radii, spacing } from '../theme';

interface Props {
  children: ReactNode;
  wave?: boolean;
  style?: ViewStyle;
  testID?: string;
}

function wavePath(w: number, h: number): string {
  const base = h * 0.72;
  const amp = h * 0.07;
  return Array.from({ length: 41 }, (_, i) => {
    const x = (i / 40) * w;
    const y = base - Math.sin((i / 40) * Math.PI * 2.4 + 0.6) * amp - (i / 40) * h * 0.16;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

export function HeroCard({ children, wave = true, style, testID }: Props) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  return (
    <View
      testID={testID}
      style={[styles.card, style]}
      onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
    >
      {size.w > 0 ? (
        <Svg width={size.w} height={size.h} style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <Pattern id="grid" width={16} height={16} patternUnits="userSpaceOnUse">
              <Circle cx={2} cy={2} r={1.1} fill={colors.lagoonLine} />
            </Pattern>
          </Defs>
          <Rect width={size.w} height={size.h} fill="url(#grid)" />
          {wave ? (
            <>
              <Path d={wavePath(size.w, size.h)} stroke={colors.mint} strokeOpacity={0.35} strokeWidth={2} fill="none" />
              <Path
                d={wavePath(size.w, size.h)}
                stroke={colors.mint}
                strokeOpacity={0.14}
                strokeWidth={2}
                fill="none"
                transform="translate(0 14)"
              />
            </>
          ) : null}
        </Svg>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.lagoon,
    borderRadius: radii.hero,
    borderBottomWidth: 5,
    borderBottomColor: colors.lagoonEdge,
    padding: spacing.xxl,
    gap: spacing.md,
    overflow: 'hidden',
  },
});
