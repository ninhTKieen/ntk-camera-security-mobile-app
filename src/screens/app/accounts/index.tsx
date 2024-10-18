import { createStackNavigator } from '@react-navigation/stack';
import { TAccountStackParamList } from '@src/configs/routes/setting.route';
import React from 'react';

import AccountScreen from './account.screen';
import EditProfileScreen from './edit-profile.screen';

const Stack = createStackNavigator<TAccountStackParamList>();

const AccountNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Accounts" component={AccountScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

export default AccountNavigator;
