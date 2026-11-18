import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, layout, radii, spacing } from '../theme';
import { Icon } from './Icon';
import { TopicArt } from './TopicArt';
import { Txt } from './Txt';

export type StoneState = 'done' | 'current' | 'open' | 'locked';

export interface Stone {
  id: string;
  topicId: string;
  title: string;
  caption: string;
  state: StoneState;
  onPress: () => void;
}

interface Props {
  stones: Stone[];
  finish: { title: string; caption: string };
}

const ROW = 156;
const COLS = [0.2, 0.8];

export function StonePath({ stones, finish }: Props) {
  const [width, setWidth] = useState(0);
  const count = stones.length + 1;
  const cx = (i: number) => width * COLS[i % 2];
  const cy = (i: number) => ROW * i + layout.stoneHero / 2;
  const height = ROW * (count - 1) + layout.stoneHero;
  const reached = Math.max(0, stones.findIndex((s) => s.state === 'current'));

  const link = (i: number) => {
    const x1 = cx(i);
    const y1 = cy(i) + layout.stone / 2 + 6;
    const x2 = cx(i + 1);
    const y2 = cy(i + 1) - layout.stone / 2 - 6;
    const mid = (y1 + y2) / 2;
    return `M${x1},${y1} C${x1},${mid + 30} ${x2},${mid - 30} ${x2},${y2}`;
  };

  return (
    <View style={{ height }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 ? (
        <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
          {Array.from({ length: count - 1 }, (_, i) => (
            <Path
              key={i}
              d={link(i)}
              stroke={i < reached ? colors.primary : colors.edge}
              strokeWidth={5}
              strokeDasharray="0.1 12"
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </Svg>
      ) : null}
      {width > 0
        ? stones.map((s, i) => {
            const left = i % 2 === 0;
            const current = s.state === 'current';
            const size = current ? layout.stoneHero : layout.stone;
            return (
              <View key={s.id} style={[styles.row, { top: cy(i) - layout.stoneHero / 2, height: layout.stoneHero }]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${s.title}. ${s.caption}`}
                  testID={`stone-${s.topicId}`}
                  onPress={s.onPress}
                  style={({ pressed }) => [
                    styles.stone,
                    { left: cx(i) - size / 2, width: size, height: size, top: (layout.stoneHero - size) / 2 },
                    pressed && styles.pressed,
                  ]}
                >
                  {current ? (
                    <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
                      <Circle cx={size / 2} cy={size / 2} r={size / 2 - 3} stroke={colors.mint} strokeWidth={4} fill="none" />
                    </Svg>
                  ) : null}
                  <TopicArt topicId={s.topicId} index={i} size={current ? size - 20 : size} locked={s.state === 'locked'} />
                  {s.state === 'done' || s.state === 'locked' ? (
                    <View style={[styles.badge, s.state === 'done' ? styles.badgeDone : styles.badgeLocked]}>
                      <Icon name={s.state === 'done' ? 'check' : 'lock'} color={s.state === 'done' ? 'onPrimary' : 'inkFaint'} size={14} />
                    </View>
                  ) : null}
                </Pressable>
                <View
                  style={[
                    styles.label,
                    left
                      ? { left: cx(i) + size / 2 + spacing.md, right: 0, alignItems: 'flex-start' }
                      : { right: width - cx(i) + size / 2 + spacing.md, left: 0, alignItems: 'flex-end' },
                  ]}
                  pointerEvents="none"
                >
                  {current ? (
                    <View style={styles.pill}>
                      <Txt variant="captionStrong" color="onPrimary">
                        UP NEXT
                      </Txt>
                    </View>
                  ) : null}
                  <Txt variant="h3" color={s.state === 'locked' ? 'inkFaint' : 'ink'} align={left ? 'left' : 'right'}>
                    {s.title}
                  </Txt>
                  <Txt variant="small" color="inkMuted" align={left ? 'left' : 'right'}>
                    {s.caption}
                  </Txt>
                </View>
              </View>
            );
          })
        : null}
      {width > 0 ? (
        <View style={[styles.row, { top: cy(count - 1) - layout.stoneHero / 2, height: layout.stoneHero }]}>
          <View
            style={[
              styles.finish,
              { left: cx(count - 1) - layout.stone / 2, top: (layout.stoneHero - layout.stone) / 2 },
            ]}
          >
            <Icon name="flag" color="lagoon" size={30} />
          </View>
          <View
            style={[
              styles.label,
              (count - 1) % 2 === 0
                ? { left: cx(count - 1) + layout.stone / 2 + spacing.md, right: 0, alignItems: 'flex-start' }
                : { right: width - cx(count - 1) + layout.stone / 2 + spacing.md, left: 0, alignItems: 'flex-end' },
            ]}
          >
            <Txt variant="h3">{finish.title}</Txt>
            <Txt variant="small" color="inkMuted">
              {finish.caption}
            </Txt>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { position: 'absolute', left: 0, right: 0 },
  stone: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  pressed: { transform: [{ translateY: 2 }] },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: radii.chip,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bg,
  },
  badgeDone: { backgroundColor: colors.primary },
  badgeLocked: { backgroundColor: colors.inset },
  label: { position: 'absolute', top: 0, bottom: 0, justifyContent: 'center', gap: 2 },
  pill: {
    backgroundColor: colors.coral,
    borderRadius: radii.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginBottom: 2,
  },
  finish: {
    position: 'absolute',
    width: layout.stone,
    height: layout.stone,
    borderRadius: radii.chip,
    backgroundColor: colors.sand,
    borderBottomWidth: 4,
    borderBottomColor: colors.sandEdge,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
