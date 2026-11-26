import {
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  useFonts,
} from '@expo-google-fonts/lexend';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaInsetsContext, SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import type { TabParamList } from './src/navigation/types';
import { OnboardingFlow, type OnboardingStep } from './src/screens/onboarding/OnboardingFlow';
import { PaywallScreen } from './src/screens/PaywallScreen';
import { askTracking, startAttribution } from './src/services/attribution';
import { readDemoInsets, type DemoConfig, type DemoId } from './src/services/demo';
import { applyDemo } from './src/services/demoSeed';
import { DemoReadyContext } from './src/store/DemoReadyContext';
import { ProfileProvider, useProfile } from './src/store/ProfileContext';
import { ProgressProvider, useProgress } from './src/store/ProgressContext';
import { SubscriptionProvider, useSubscription } from './src/store/SubscriptionContext';
import { colors } from './src/theme';
import type { SessionParams } from './src/types';

const DEMO_SEED = 7;
const DEMO_TOPIC = 'sat-quadratics';
const DEMO_INSETS = readDemoInsets();

const DEMO_TABS: Partial<Record<DemoId, keyof TabParamList>> = {
  practice: 'Practice',
  progress: 'Progress',
  settings: 'Settings',
};

const DEMO_STEPS: Partial<Record<DemoId, OnboardingStep>> = {
  onboarding: 'welcome',
  exam: 'exam',
  placement: 'placement',
  date: 'date',
  plan: 'plan',
};

function demoSession(id: DemoId | undefined): SessionParams | undefined {
  if (id === 'answer') return { kind: 'topic', topicId: DEMO_TOPIC, seed: DEMO_SEED, demoAnswer: 'wrong' };
  if (id === 'explain') return { kind: 'topic', topicId: DEMO_TOPIC, seed: DEMO_SEED, demoAnswer: 'wrong', demoExplain: true };
  return undefined;
}

function Root({ demo }: { demo: DemoConfig | null }) {
  const { ready: profileReady, profile } = useProfile();
  const { ready: progressReady } = useProgress();
  const { ready: subReady, subscribed, paywallVisible, openPaywall } = useSubscription();
  const [screenReady, setScreenReady] = useState(false);
  const markReady = useCallback(() => setScreenReady(true), []);

  useEffect(() => {
    if (demo?.id === 'paywall') openPaywall();
  }, [demo, openPaywall]);

  const onboarded = profileReady && profile.onboarded;
  useEffect(() => {
    if (onboarded && !demo) void startAttribution();
  }, [onboarded, demo]);

  if (!profileReady || !progressReady || !subReady) return <View style={styles.root} />;

  const id = demo?.id;
  const ready = !!demo && screenReady && (id !== 'paywall' || paywallVisible);

  return (
    <DemoReadyContext.Provider value={markReady}>
      <View style={styles.root} testID={ready ? 'screen-ready' : undefined}>
        <StatusBar style="dark" />
        {profile.onboarded ? (
          <NavigationContainer>
            <RootNavigator initialTab={id ? DEMO_TABS[id] : undefined} initialSession={demoSession(id)} />
          </NavigationContainer>
        ) : (
          <OnboardingFlow
            initialStep={id ? DEMO_STEPS[id] : undefined}
            seed={demo ? DEMO_SEED : undefined}
            placementIndex={id === 'placement' ? 1 : undefined}
            onComplete={() => {
              if (subscribed) return;
              if (demo) openPaywall();
              else void askTracking().finally(openPaywall);
            }}
          />
        )}
        {paywallVisible ? (
          <View style={StyleSheet.absoluteFill}>
            <PaywallScreen />
          </View>
        ) : null}
      </View>
    </DemoReadyContext.Provider>
  );
}

export default function App() {
  const [demo, setDemo] = useState<DemoConfig | null | undefined>(undefined);
  const [fontsLoaded, fontError] = useFonts({ Lexend_400Regular, Lexend_500Medium, Lexend_600SemiBold, Lexend_700Bold });
  const fontsReady = fontsLoaded || !!fontError;

  useEffect(() => {
    applyDemo()
      .then(setDemo)
      .catch(() => setDemo(null));
  }, []);

  const content =
    demo === undefined || !fontsReady ? (
      <View style={styles.root} />
    ) : (
      <ProfileProvider>
        <ProgressProvider>
          <SubscriptionProvider>
            <Root demo={demo} />
          </SubscriptionProvider>
        </ProgressProvider>
      </ProfileProvider>
    );

  return (
    <SafeAreaProvider>
      {DEMO_INSETS ? <SafeAreaInsetsContext.Provider value={DEMO_INSETS}>{content}</SafeAreaInsetsContext.Provider> : content}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
