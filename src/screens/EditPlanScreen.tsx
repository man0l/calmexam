import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../components/Button';
import { DateSelector } from '../components/DateSelector';
import { ExamPicker } from '../components/ExamPicker';
import { MinutesPicker } from '../components/MinutesPicker';
import { ScreenShell } from '../components/ScreenShell';
import { TopBar } from '../components/TopBar';
import { Txt } from '../components/Txt';
import type { RootStackParamList } from '../navigation/types';
import { datePresets } from '../services/dates';
import { useProfile } from '../store/ProfileContext';
import { StyleSheet } from 'react-native';
import { spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EditPlan'>;

const TITLES = { exam: 'Change exam', date: 'Exam date', minutes: 'Daily time' } as const;

export function EditPlanScreen({ navigation, route }: Props) {
  const { field } = route.params;
  const { profile, update } = useProfile();

  return (
    <ScreenShell
      header={<TopBar onBack={() => navigation.goBack()} />}
      footer={<Button label="Done" onPress={() => navigation.goBack()} />}
    >
      <Txt variant="title" style={styles.title}>
        {TITLES[field]}
      </Txt>
      {field === 'exam' ? (
        <ExamPicker
          value={profile.exam}
          onSelect={(exam) => {
            if (exam === profile.exam) return;
            const preset = datePresets(exam)[0];
            update({ exam, otherExam: null, placement: [], ...(preset ? { examDate: preset.key } : {}) });
          }}
        />
      ) : null}
      {field === 'date' ? (
        <DateSelector exam={profile.exam} value={profile.examDate} onChange={(examDate) => update({ examDate })} />
      ) : null}
      {field === 'minutes' ? (
        <MinutesPicker value={profile.minutesPerDay} onChange={(minutesPerDay) => update({ minutesPerDay })} />
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.xl },
});
