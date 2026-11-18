import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { formatScore, getExam, type ExamId } from '../engine';
import { colors, spacing } from '../theme';
import { Txt } from './Txt';

interface Props {
  exam: ExamId;
  now: number;
  target: number;
  daysLeft: number;
  height?: number;
  onReady?: () => void;
}

const PAD = { top: 28, bottom: 28, left: 8, right: 8 };

function roundFor(exam: ExamId, v: number): number {
  return exam === 'sat' ? Math.round(v / 10) * 10 : Math.round(v);
}

export function ProjectionGraph({ exam, now, target, daysLeft, height = 200, onReady }: Props) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (width > 0) onReady?.();
  }, [width, onReady]);
  const { min, max } = getExam(exam).scale;
  const span = max - min;
  const own = now + (target - now) * 0.25;
  const lo = Math.max(min, now - span * 0.12);
  const hi = Math.min(max, target + span * 0.08);
  const innerW = Math.max(1, width - PAD.left - PAD.right);
  const innerH = height - PAD.top - PAD.bottom;
  const x = (t: number) => PAD.left + t * innerW;
  const y = (v: number) => PAD.top + (1 - (v - lo) / Math.max(1e-6, hi - lo)) * innerH;
  const curve = (end: number, ease: (t: number) => number) =>
    Array.from({ length: 25 }, (_, i) => {
      const t = i / 24;
      return `${i === 0 ? 'M' : 'L'}${x(t).toFixed(1)},${y(now + (end - now) * ease(t)).toFixed(1)}`;
    }).join(' ');
  const calm = curve(target, (t) => 1 - Math.pow(1 - t, 2.2));
  const alone = curve(own, (t) => t);

  return (
    <View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: colors.primary }]} />
          <Txt variant="caption" color="inkMuted">
            With CalmExam
          </Txt>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: colors.inkFaint }]} />
          <Txt variant="caption" color="inkMuted">
            On your own
          </Txt>
        </View>
      </View>
      <View style={{ height }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 ? (
          <Svg width={width} height={height}>
            {[0, 0.5, 1].map((t) => (
              <Line
                key={t}
                x1={PAD.left}
                x2={width - PAD.right}
                y1={PAD.top + t * innerH}
                y2={PAD.top + t * innerH}
                stroke={colors.border}
                strokeWidth={1}
              />
            ))}
            <Path d={alone} stroke={colors.inkFaint} strokeWidth={3} fill="none" strokeDasharray="6 6" strokeLinecap="round" />
            <Path d={calm} stroke={colors.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" />
            <Circle cx={x(0)} cy={y(now)} r={5} fill={colors.ink} />
            <Circle cx={x(1)} cy={y(target)} r={6} fill={colors.primary} />
            <Circle cx={x(1)} cy={y(own)} r={5} fill={colors.inkFaint} />
          </Svg>
        ) : null}
        {width > 0 ? (
          <>
            <View style={[styles.tag, { left: PAD.left, top: y(now) - 26 }]}>
              <Txt variant="captionStrong">{`Now ${formatScore(exam, roundFor(exam, now))}`}</Txt>
            </View>
            <View style={[styles.tag, styles.right, { top: y(target) - 26 }]}>
              <Txt variant="captionStrong" color="primary">
                {formatScore(exam, roundFor(exam, target))}
              </Txt>
            </View>
            <View style={[styles.tag, styles.right, { top: y(own) + 8 }]}>
              <Txt variant="captionStrong" color="inkMuted">
                {formatScore(exam, roundFor(exam, own))}
              </Txt>
            </View>
          </>
        ) : null}
      </View>
      <View style={styles.axis}>
        <Txt variant="caption" color="inkMuted">
          Today
        </Txt>
        <Txt variant="caption" color="inkMuted">
          {`Exam day · ${daysLeft} days`}
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  swatch: { width: 14, height: 4, borderRadius: 2 },
  tag: { position: 'absolute' },
  right: { right: PAD.right },
  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
});
