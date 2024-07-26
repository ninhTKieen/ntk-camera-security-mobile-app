import { createStackNavigator } from '@react-navigation/stack';
import { TSettingStackParamList } from '@src/configs/routes/setting.route';
import React from 'react';

import EditProfileScreen from './edit-profile.screen';
import MainSettingsScreen from './main-settings.screen';

const Stack = createStackNavigator<TSettingStackParamList>();

const SettingNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainSettings" component={MainSettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

export default SettingNavigator;
