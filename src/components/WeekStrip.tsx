import { StyleSheet, View } from 'react-native';
import { todayKey, weekdayInitial } from '../services/dates';
import { weekKeys } from '../services/streak';
import { colors, layout, spacing } from '../theme';
import { Icon } from './Icon';
import { Txt } from './Txt';

export function WeekStrip({ days }: { days: Record<string, number> }) {
  const today = todayKey();
  return (
    <View style={styles.row}>
      {weekKeys(today).map((k, i) => {
        const done = (days[k] ?? 0) > 0;
        const isToday = k === today;
        return (
          <View key={k} style={styles.day}>
            <Txt variant="caption" color={isToday ? 'ink' : 'inkFaint'}>
              {weekdayInitial(k)}
            </Txt>
            <View
              style={[
                styles.stone,
                { transform: [{ rotate: `${i % 2 === 0 ? -6 : 5}deg` }] },
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
  stone: {
    width: 36,
    height: 32,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  done: { backgroundColor: colors.primary, borderBottomWidth: 3, borderBottomColor: colors.primaryEdge },
  empty: { backgroundColor: colors.inset },
  today: { borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.surface },
});
