import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EditPlanScreen } from '../screens/EditPlanScreen';
import { PracticeSessionScreen } from '../screens/PracticeSessionScreen';
import { ReminderScreen } from '../screens/ReminderScreen';
import { colors } from '../theme';
import type { SessionParams } from '../types';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface Props {
  initialTab?: keyof TabParamList;
  initialSession?: SessionParams;
}

export function RootNavigator({ initialTab, initialSession }: Props) {
  return (
    <Stack.Navigator
      initialRouteName={initialSession ? 'Session' : 'Tabs'}
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}
    >
      <Stack.Screen name="Tabs">{() => <TabNavigator initialTab={initialTab} />}</Stack.Screen>
      <Stack.Screen
        name="Session"
        component={PracticeSessionScreen}
        initialParams={initialSession}
        options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
      />
      <Stack.Screen name="EditPlan" component={EditPlanScreen} />
      <Stack.Screen name="Reminder" component={ReminderScreen} options={{ animation: 'slide_from_bottom' }} />
    </Stack.Navigator>
  );
}
