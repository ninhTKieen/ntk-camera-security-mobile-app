import { createStackNavigator } from '@react-navigation/stack';
import { THomeManagementStackParamList } from '@src/configs/routes/account.route';
import React from 'react';

import CreateHomeScreen from './create-home.screen';
import HomeDetailScreen from './home-detail.screen';
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
      <Stack.Screen name="HomeDetail" component={HomeDetailScreen} />
      <Stack.Screen name="CreateHome" component={CreateHomeScreen} />
    </Stack.Navigator>
  );
};

export default HomeManagementNavigator;
