import { Pressable, StyleSheet, View } from 'react-native';
import { EXAMS, type ExamId } from '../engine';
import { colors, layout, radii, spacing } from '../theme';
import { Icon } from './Icon';
import { Txt } from './Txt';

const GLYPH: Record<ExamId, string> = { sat: '√x', 'ap-calc-ab': '∫', 'a-level': 'Σ' };
const REGION: Record<ExamId, string> = {
  sat: 'Digital SAT · College Board',
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
            style={({ pressed }) => [
              styles.card,
              selected && styles.selected,
              pressed && !selected && { backgroundColor: colors.inset },
            ]}
          >
            <View style={[styles.glyph, selected && { backgroundColor: colors.surface }]}>
              <Txt variant="h2" color="primary">
                {GLYPH[exam.id]}
              </Txt>
            </View>
            <View style={styles.text}>
              <Txt variant="h3">{exam.name}</Txt>
              <Txt variant="small" color="inkMuted">
                {`${exam.region} · ${REGION[exam.id]}`}
              </Txt>
            </View>
            {selected ? <Icon name="check" color="primary" /> : null}
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
    borderWidth: layout.hairline,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  glyph: {
    width: 52,
    height: 52,
    borderRadius: radii.icon,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
});
