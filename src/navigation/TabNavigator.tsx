import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '../components/Icon';
import { PracticeScreen } from '../screens/PracticeScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TodayScreen } from '../screens/TodayScreen';
import { colors, typography } from '../theme';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<keyof TabParamList, IconName> = {
  Today: 'today',
  Practice: 'practice',
  Progress: 'progress',
  Settings: 'settings',
};

export function TabNavigator({ initialTab }: { initialTab?: keyof TabParamList }) {
  // Room for a 16px label under the icon; the default bar clips descenders on web and Android.
  const { bottom } = useSafeAreaInsets();
  return (
    <Tab.Navigator
      initialRouteName={initialTab ?? 'Today'}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1.5,
          height: 64 + bottom,
          paddingTop: 4,
          paddingBottom: Math.max(bottom, 4),
        },
        tabBarLabelStyle: typography.tabLabel,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarIcon: ({ focused }) => <Icon name={ICONS[route.name]} color={focused ? 'primary' : 'inkMuted'} />,
      })}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Practice" component={PracticeScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
