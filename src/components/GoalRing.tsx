import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, layout } from '../theme';
import { Txt } from './Txt';

interface Props {
  done: number;
  goal: number;
  size?: number;
}

export function GoalRing({ done, goal, size = layout.ringSize }: Props) {
  const stroke = layout.ringStroke;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = goal > 0 ? Math.min(1, done / goal) : 0;
  const complete = pct >= 1;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.inset} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={complete ? colors.correct : colors.primary}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={circ * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Txt variant="h2" style={styles.num}>
          {`${Math.min(done, 999)}/${goal}`}
        </Txt>
        <Txt variant="caption" color="inkMuted">
          {complete ? 'goal met' : 'problems'}
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  num: { fontVariant: ['tabular-nums'] },
});
