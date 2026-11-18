import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../components/Button';
import { CalendarPicker } from '../../components/CalendarPicker';
import { OptionButton } from '../../components/OptionButton';
import { Txt } from '../../components/Txt';
import type { Exam } from '../../engine';
import { datePresets, daysUntil, formatLong } from '../../services/dates';
import { spacing } from '../../theme';
import { StepLayout } from './StepLayout';

const NO_DATE_MIN_DAYS = 60;

interface Props {
  exam: Exam;
  value: string;
  progress: number;
  onChange: (key: string) => void;
  onBack: () => void;
  onNext: () => void;
}

function daysLabel(key: string): string {
  const n = daysUntil(key);
  return `${n} ${n === 1 ? 'day' : 'days'} left`;
}

export function DateStep({ exam, value, progress, onChange, onBack, onNext }: Props) {
  const presets = useMemo(() => datePresets(exam.id), [exam.id]);
  const [calendar, setCalendar] = useState(false);

  if (calendar) {
    return (
      <StepLayout
        title="Pick your exam date"
        subtitle={`${formatLong(value)} · ${daysLabel(value)}`}
        progress={progress}
        onBack={() => setCalendar(false)}
        onNext={onNext}
      >
        <CalendarPicker value={value} onChange={onChange} />
      </StepLayout>
    );
  }

  const choose = (key: string) => {
    onChange(key);
    onNext();
  };
  const noDate = () => {
    const later = presets.find((p) => daysUntil(p.key) >= NO_DATE_MIN_DAYS) ?? presets[presets.length - 1];
    if (later) choose(later.key);
    else onNext();
  };

  return (
    <StepLayout
      title={`When do you take ${exam.shortName}?`}
      subtitle="We pace your plan to the days you have left."
      progress={progress}
      onBack={onBack}
    >
      <View style={styles.list}>
        {presets.map((p) => (
          <OptionButton
            key={p.key}
            testID={`date-${p.key}`}
            label={p.label}
            caption={`${formatLong(p.key)} · ${daysLabel(p.key)}`}
            state={value === p.key ? 'selected' : 'idle'}
            onPress={() => choose(p.key)}
          />
        ))}
        <OptionButton testID="date-other" label="Another date" caption="Pick it on a calendar" onPress={() => setCalendar(true)} />
      </View>
      <Txt variant="caption" color="inkMuted" style={styles.note}>
        Typical dates. Check your official timetable.
      </Txt>
      <Button testID="date-none" label="No date yet" variant="ghost" compact onPress={noDate} />
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
  note: { marginTop: spacing.md, marginBottom: spacing.sm },
});
