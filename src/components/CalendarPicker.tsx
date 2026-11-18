import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { addDays, daysInMonth, fromKey, monthName, toKey, todayKey } from '../services/dates';
import { colors, layout, radii, spacing } from '../theme';
import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface Props {
  value: string;
  onChange: (key: string) => void;
}

function Nav({ icon, label, disabled, onPress }: { icon: IconName; label: string; disabled?: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.nav, pressed && { backgroundColor: colors.primarySoft }, disabled && styles.off]}
    >
      <Icon name={icon} color="primary" size={layout.iconSmall} />
    </Pressable>
  );
}

export function CalendarPicker({ value, onChange }: Props) {
  const min = addDays(todayKey(), 1);
  const max = addDays(todayKey(), 730);
  const selected = fromKey(value);
  const [cursor, setCursor] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const lead = (new Date(year, month, 1).getDay() + 6) % 7;
  const total = daysInMonth(year, month);
  const cells: (number | null)[] = [...Array.from({ length: lead }, () => null), ...Array.from({ length: total }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const minD = fromKey(min);
  const maxD = fromKey(max);
  const canPrev = year > minD.getFullYear() || (year === minD.getFullYear() && month > minD.getMonth());
  const canNext = year < maxD.getFullYear() || (year === maxD.getFullYear() && month < maxD.getMonth());

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Icon name="calendar" color="inkMuted" size={layout.iconSmall} />
        <Txt variant="bodyStrong" style={styles.flex}>
          {`${monthName(month)} ${year}`}
        </Txt>
        <Nav icon="back" label="Previous month" disabled={!canPrev} onPress={() => setCursor(new Date(year, month - 1, 1))} />
        <Nav icon="chevron" label="Next month" disabled={!canNext} onPress={() => setCursor(new Date(year, month + 1, 1))} />
      </View>
      <View style={styles.row}>
        {WEEKDAYS.map((w, i) => (
          <View key={`${w}${i}`} style={styles.cell}>
            <Txt variant="caption" color="inkFaint">
              {w}
            </Txt>
          </View>
        ))}
      </View>
      {Array.from({ length: cells.length / 7 }, (_, r) => (
        <View key={r} style={styles.row}>
          {cells.slice(r * 7, r * 7 + 7).map((day, i) => {
            if (day === null) return <View key={`e${i}`} style={styles.cell} />;
            const key = toKey(new Date(year, month, day));
            const disabled = key < min || key > max;
            const on = key === value;
            return (
              <Pressable
                key={key}
                testID={`calendar-${key}`}
                accessibilityRole="button"
                accessibilityLabel={key}
                accessibilityState={{ selected: on, disabled }}
                disabled={disabled}
                onPress={() => onChange(key)}
                style={styles.cell}
              >
                <View style={[styles.day, on && styles.dayOn]}>
                  <Txt variant="small" color={on ? 'onPrimary' : disabled ? 'inkFaint' : 'ink'}>
                    {String(day)}
                  </Txt>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  flex: { flex: 1 },
  nav: { width: 36, height: 36, borderRadius: radii.chip, alignItems: 'center', justifyContent: 'center' },
  off: { opacity: 0.35 },
  row: { flexDirection: 'row' },
  cell: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 40 },
  day: { width: 36, height: 36, borderRadius: radii.chip, alignItems: 'center', justifyContent: 'center' },
  dayOn: { backgroundColor: colors.primary },
});
