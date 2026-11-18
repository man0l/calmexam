import { StyleSheet, View } from 'react-native';
import { todayKey, weekdayInitial } from '../services/dates';
import { weekKeys } from '../services/streak';
import { colors, layout, radii, spacing } from '../theme';
import { Icon } from './Icon';
import { Txt } from './Txt';

export function WeekStrip({ days }: { days: Record<string, number> }) {
  const today = todayKey();
  return (
    <View style={styles.row}>
      {weekKeys(today).map((k) => {
        const done = (days[k] ?? 0) > 0;
        const isToday = k === today;
        return (
          <View key={k} style={styles.day}>
            <Txt variant="caption" color={isToday ? 'ink' : 'inkFaint'}>
              {weekdayInitial(k)}
            </Txt>
            <View
              style={[
                styles.dot,
                done ? styles.done : styles.empty,
                isToday && !done && styles.today,
              ]}
            >
              {done ? <Icon name="check" color="onPrimary" size={layout.iconSmall} /> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { alignItems: 'center', gap: spacing.xs },
  dot: { width: 34, height: 34, borderRadius: radii.chip, alignItems: 'center', justifyContent: 'center' },
  done: { backgroundColor: colors.primary },
  empty: { backgroundColor: colors.inset },
  today: { borderWidth: 1.5, borderColor: colors.primary, backgroundColor: colors.surface },
});
