import { createStackNavigator } from '@react-navigation/stack';
import { TSettingsStackParamList } from '@src/configs/routes/account.route';
import React from 'react';

import MainSettingScreen from './main-setting.screen';

const Stack = createStackNavigator<TSettingsStackParamList>();

const SettingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainSettings" component={MainSettingScreen} />
    </Stack.Navigator>
  );
};

export default SettingStack;
