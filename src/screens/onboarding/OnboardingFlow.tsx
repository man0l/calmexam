import { useEffect, useRef, useState } from 'react';
import type { ExamId } from '../../engine';
import { datePresets } from '../../services/dates';
import { randomSeed } from '../../services/practice';
import { useProfile } from '../../store/ProfileContext';
import type { OtherExam } from '../../types';
import { DateStep } from './DateStep';
import { ExamStep } from './ExamStep';
import { PlacementStep } from './PlacementStep';
import { PlanStep } from './PlanStep';
import { WelcomeStep } from './WelcomeStep';

export const ONBOARDING_STEPS = ['welcome', 'exam', 'date', 'placement', 'plan'] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

const ADVANCE_MS = 250;

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
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const index = ONBOARDING_STEPS.indexOf(step);
  const progress = index / (ONBOARDING_STEPS.length - 1);
  const go = (s: OnboardingStep) => setStep(s);
  const goSoon = (s: OnboardingStep) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStep(s), ADVANCE_MS);
  };
  const back = () => go(ONBOARDING_STEPS[Math.max(0, index - 1)]);

  const chooseExam = (id: ExamId) => {
    setExamChosen(id);
    const preset = datePresets(id)[0];
    update({ exam: id, otherExam: null, ...(preset ? { examDate: preset.key } : {}) });
    goSoon('date');
  };

  const chooseOther = (o: OtherExam) => {
    setExamChosen('sat');
    const preset = datePresets('sat')[0];
    update({ exam: 'sat', otherExam: o, ...(preset ? { examDate: preset.key } : {}) });
    goSoon('date');
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
        />
      );
    case 'date':
      return (
        <DateStep
          exam={exam}
          value={profile.examDate}
          progress={progress}
          onChange={(examDate) => update({ examDate })}
          onBack={back}
          onNext={() => goSoon('placement')}
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
            go('plan');
          }}
        />
      );
    case 'plan':
      return (
        <PlanStep
          exam={exam}
          plan={plan}
          minutes={profile.minutesPerDay}
          placement={profile.placement}
          progress={progress}
          onBack={() => go('placement')}
          onNext={() => {
            update({ onboarded: true });
            onComplete();
          }}
        />
      );
  }
}
