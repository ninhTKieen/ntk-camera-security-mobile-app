import { createStackNavigator } from '@react-navigation/stack';
import { THomeManagementStackParamList } from '@src/configs/routes/account.route';
import React from 'react';

import HomeListScreen from './home-list.screen';

const Stack = createStackNavigator<THomeManagementStackParamList>();

const HomeManagementNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeList" component={HomeListScreen} />
    </Stack.Navigator>
  );
};

export default HomeManagementNavigator;
