import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { ExamId } from '../engine';
import {
  addDays,
  datePresets,
  daysInMonth,
  daysUntil,
  formatLong,
  fromKey,
  monthName,
  toKey,
  todayKey,
} from '../services/dates';
import { colors, layout, radii, spacing } from '../theme';
import { Icon, type IconName } from './Icon';
import { OptionButton } from './OptionButton';
import { Txt } from './Txt';

interface Props {
  exam: ExamId;
  value: string;
  onChange: (key: string) => void;
}

function clampKey(key: string): string {
  const min = addDays(todayKey(), 1);
  const max = addDays(todayKey(), 730);
  if (key < min) return min;
  if (key > max) return max;
  return key;
}

function Step({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.step, pressed && { backgroundColor: colors.primarySoft }]}
    >
      <Icon name={icon} color="primary" />
    </Pressable>
  );
}

export function DateSelector({ exam, value, onChange }: Props) {
  const presets = useMemo(() => datePresets(exam), [exam]);
  const d = fromKey(value);
  const days = daysUntil(value);

  const shiftMonth = (delta: number) => {
    const y = d.getFullYear();
    const m = d.getMonth() + delta;
    const target = new Date(y, m, 1);
    const day = Math.min(d.getDate(), daysInMonth(target.getFullYear(), target.getMonth()));
    onChange(clampKey(toKey(new Date(target.getFullYear(), target.getMonth(), day))));
  };
  const shiftDay = (delta: number) => onChange(clampKey(addDays(value, delta)));

  return (
    <View style={styles.wrap}>
      <View style={styles.countdown}>
        <Txt variant="display" color="primary">
          {String(days)}
        </Txt>
        <Txt variant="bodyStrong" color="inkMuted">
          {days === 1 ? 'day left' : 'days left'}
        </Txt>
      </View>
      <Txt variant="small" color="inkMuted" align="center">
        {formatLong(value)}
      </Txt>

      <View style={styles.list}>
        <Txt variant="captionStrong" color="inkMuted">
          NEXT OFFICIAL SITTINGS
        </Txt>
        {presets.map((p) => (
          <OptionButton
            key={p.key}
            label={p.label}
            caption={`${formatLong(p.key)} · ${daysUntil(p.key)} days`}
            state={value === p.key ? 'selected' : 'idle'}
            onPress={() => onChange(p.key)}
          />
        ))}
        <Txt variant="caption" color="inkMuted">
          Typical dates. Check your official timetable.
        </Txt>
      </View>

      <View style={styles.custom}>
        <Txt variant="captionStrong" color="inkMuted">
          OR PICK A DATE
        </Txt>
        <View style={styles.stepper}>
          <Step icon="back" label="Previous month" onPress={() => shiftMonth(-1)} />
          <Txt variant="bodyStrong">{`${monthName(d.getMonth())} ${d.getFullYear()}`}</Txt>
          <Step icon="chevron" label="Next month" onPress={() => shiftMonth(1)} />
        </View>
        <View style={styles.stepper}>
          <Step icon="back" label="Previous day" onPress={() => shiftDay(-1)} />
          <Txt variant="bodyStrong">{`Day ${d.getDate()}`}</Txt>
          <Step icon="chevron" label="Next day" onPress={() => shiftDay(1)} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  countdown: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: spacing.sm },
  list: { gap: spacing.sm },
  custom: { gap: spacing.sm },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radii.input,
    borderWidth: layout.hairline,
    borderColor: colors.border,
    padding: spacing.xs,
  },
  step: { width: 44, height: 44, borderRadius: radii.input, alignItems: 'center', justifyContent: 'center' },
});
