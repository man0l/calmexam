import type { NavigatorScreenParams } from '@react-navigation/native';
import type { SessionParams } from '../types';

export type TabParamList = {
  Today: undefined;
  Practice: undefined;
  Progress: undefined;
  Settings: undefined;
};

export type EditField = 'exam' | 'date' | 'minutes';

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Session: SessionParams;
  EditPlan: { field: EditField };
  Reminder: undefined;
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
