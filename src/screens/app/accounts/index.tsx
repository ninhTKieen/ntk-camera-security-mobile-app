import {
  RouteProp,
  getFocusedRouteNameFromRoute,
  useRoute,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TAccountStackParamList } from '@src/configs/routes/account.route';
import { useAppStore } from '@src/features/common/app.store';
import React, { useEffect } from 'react';

import AccountScreen from './account.screen';
import EditProfileScreen from './edit-profile.screen';
import HomeManagementNavigator from './home-management';
import SettingStack from './settings';

const Stack = createStackNavigator<TAccountStackParamList>();

const AccountNavigator = (): JSX.Element => {
  const { setHideBottomTabBar } = useAppStore();

  const route = useRoute<RouteProp<TAccountStackParamList, 'Accounts'>>();

  useEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);

    setHideBottomTabBar(!!routeName && routeName !== 'Accounts');
  }, [route, setHideBottomTabBar]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Accounts" component={AccountScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen
        name="HomeManagementNavigator"
        component={HomeManagementNavigator}
      />
      <Stack.Screen name="SettingsStack" component={SettingStack} />
    </Stack.Navigator>
  );
};

export default AccountNavigator;
