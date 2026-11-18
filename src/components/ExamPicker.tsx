import { Pressable, StyleSheet, View } from 'react-native';
import { EXAMS, type ExamId } from '../engine';
import { colors, radii, spacing } from '../theme';
import { Icon } from './Icon';
import { ExamArt } from './TopicArt';
import { Txt } from './Txt';

const REGION: Record<ExamId, string> = {
  sat: 'Digital SAT',
  'ap-calc-ab': 'AP exam · College Board',
  'a-level': 'AQA, Edexcel, OCR',
};

export function ExamPicker({ value, onSelect }: { value: ExamId | null; onSelect: (exam: ExamId) => void }) {
  return (
    <View style={styles.list}>
      {EXAMS.map((exam) => {
        const selected = value === exam.id;
        return (
          <Pressable
            key={exam.id}
            testID={`exam-${exam.id}`}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onSelect(exam.id)}
            style={({ pressed }) => [styles.card, selected && styles.selected, pressed && styles.pressed]}
          >
            <ExamArt exam={exam.id} size={56} selected={selected} />
            <View style={styles.text}>
              <Txt variant="h3" color="ink">
                {exam.name}
              </Txt>
              <Txt variant="small" color="inkMuted">
                {`${exam.region} · ${REGION[exam.id]}`}
              </Txt>
            </View>
            <View style={[styles.tick, selected && styles.tickOn]}>
              {selected ? <Icon name="check" color="onPrimary" size={18} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.card,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: colors.border,
    borderBottomColor: colors.edge,
    backgroundColor: colors.surface,
  },
  selected: { backgroundColor: colors.primarySoft, borderColor: colors.primary, borderBottomColor: colors.primaryEdge },
  pressed: { borderBottomWidth: 1.5, marginTop: 2.5 },
  text: { flex: 1, gap: 2 },
  tick: {
    width: 28,
    height: 28,
    borderRadius: radii.chip,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickOn: { backgroundColor: colors.primary, borderColor: colors.primary },
});
