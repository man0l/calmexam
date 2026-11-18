import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { ScreenShell } from '../../components/ScreenShell';
import { TopBar } from '../../components/TopBar';
import { Txt } from '../../components/Txt';
import { layout, spacing } from '../../theme';

interface Props {
  title: string;
  subtitle?: string;
  progress?: number;
  onBack?: () => void;
  cta?: string;
  onNext?: () => void;
  ctaDisabled?: boolean;
  topContent?: ReactNode;
  children: ReactNode;
  footerExtra?: ReactNode;
  deferReady?: boolean;
}

export function StepLayout({
  title,
  subtitle,
  progress,
  onBack,
  cta = 'Continue',
  onNext,
  ctaDisabled,
  topContent,
  children,
  footerExtra,
  deferReady,
}: Props) {
  return (
    <ScreenShell
      deferReady={deferReady}
      header={
        <TopBar
          onBack={onBack}
          center={progress !== undefined ? <ProgressBar value={progress} height={layout.progressHeight} /> : topContent}
        />
      }
      footer={
        onNext ? (
          <>
            <Button testID="onboarding-continue" label={cta} onPress={onNext} disabled={ctaDisabled} />
            {footerExtra}
          </>
        ) : undefined
      }
    >
      <View style={styles.head}>
        <Txt variant="title">{title}</Txt>
        {subtitle ? (
          <Txt variant="body" color="inkMuted">
            {subtitle}
          </Txt>
        ) : null}
      </View>
      {children}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  head: { gap: spacing.sm, marginBottom: spacing.xxl },
});
