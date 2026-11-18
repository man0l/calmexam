import { useState } from 'react';
import { DateSelector } from '../../components/DateSelector';
import { MinutesPicker } from '../../components/MinutesPicker';
import type { ExamId } from '../../engine';
import { datePresets } from '../../services/dates';
import { randomSeed } from '../../services/practice';
import { useProfile } from '../../store/ProfileContext';
import type { OtherExam, Worry } from '../../types';
import { ExamStep } from './ExamStep';
import { PlacementStep } from './PlacementStep';
import { PlanStep } from './PlanStep';
import { ProjectionStep } from './ProjectionStep';
import { StepLayout } from './StepLayout';
import { WelcomeStep } from './WelcomeStep';
import { WorriesStep } from './WorriesStep';

export const ONBOARDING_STEPS = ['welcome', 'exam', 'date', 'minutes', 'worries', 'placement', 'projection', 'plan'] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

interface Props {
  initialStep?: OnboardingStep;
  seed?: number;
  placementIndex?: number;
  onComplete: () => void;
}

export function OnboardingFlow({ initialStep = 'welcome', seed: fixedSeed, placementIndex, onComplete }: Props) {
  const { profile, exam, plan, update } = useProfile();
  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [examChosen, setExamChosen] = useState<ExamId | null>(initialStep === 'welcome' ? null : profile.exam);
  const [otherOpen, setOtherOpen] = useState(false);
  const [seed] = useState(() => fixedSeed ?? randomSeed());

  const index = ONBOARDING_STEPS.indexOf(step);
  const progress = index / (ONBOARDING_STEPS.length - 1);
  const go = (s: OnboardingStep) => setStep(s);
  const back = () => go(ONBOARDING_STEPS[Math.max(0, index - 1)]);

  const chooseExam = (id: ExamId) => {
    setExamChosen(id);
    const preset = datePresets(id)[0];
    update({ exam: id, otherExam: null, ...(preset ? { examDate: preset.key } : {}) });
  };

  const chooseOther = (o: OtherExam) => {
    setExamChosen('sat');
    const preset = datePresets('sat')[0];
    update({ exam: 'sat', otherExam: o, ...(preset ? { examDate: preset.key } : {}) });
  };

  const toggleWorry = (w: Worry) => {
    const has = profile.worries.includes(w);
    update({ worries: has ? profile.worries.filter((x) => x !== w) : [...profile.worries, w] });
  };

  switch (step) {
    case 'welcome':
      return <WelcomeStep onNext={() => go('exam')} />;
    case 'exam':
      return (
        <ExamStep
          exam={otherOpen ? null : examChosen}
          otherOpen={otherOpen}
          otherExam={profile.otherExam}
          progress={progress}
          onSelectExam={chooseExam}
          onOpenOther={() => setOtherOpen(true)}
          onSelectOther={chooseOther}
          onBack={() => (otherOpen ? setOtherOpen(false) : back())}
          onNext={() => go('date')}
        />
      );
    case 'date':
      return (
        <StepLayout
          title="When is your exam?"
          subtitle={`Pick the ${exam.shortName} sitting you are aiming for.`}
          progress={progress}
          onBack={back}
          onNext={() => go('minutes')}
        >
          <DateSelector exam={profile.exam} value={profile.examDate} onChange={(examDate) => update({ examDate })} />
        </StepLayout>
      );
    case 'minutes':
      return (
        <StepLayout
          title="How much time can you give each day?"
          subtitle="Little and often beats long cramming sessions."
          progress={progress}
          onBack={back}
          onNext={() => go('worries')}
        >
          <MinutesPicker value={profile.minutesPerDay} onChange={(minutesPerDay) => update({ minutesPerDay })} />
        </StepLayout>
      );
    case 'worries':
      return (
        <WorriesStep
          value={profile.worries}
          progress={progress}
          onToggle={toggleWorry}
          onBack={back}
          onNext={() => go('placement')}
        />
      );
    case 'placement':
      return (
        <PlacementStep
          exam={profile.exam}
          seed={seed}
          initialIndex={step === initialStep ? placementIndex : undefined}
          onBack={back}
          onDone={(placement) => {
            update({ placement });
            go('projection');
          }}
        />
      );
    case 'projection':
      return (
        <ProjectionStep
          exam={exam}
          plan={plan}
          placement={profile.placement}
          progress={progress}
          onBack={() => go('placement')}
          onNext={() => go('plan')}
        />
      );
    case 'plan':
      return (
        <PlanStep
          exam={exam}
          plan={plan}
          minutes={profile.minutesPerDay}
          worries={profile.worries}
          progress={progress}
          onBack={back}
          onNext={() => {
            update({ onboarded: true });
            onComplete();
          }}
        />
      );
  }
}
