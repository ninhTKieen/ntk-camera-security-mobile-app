import { createStackNavigator } from '@react-navigation/stack';
import { THomeStackParamList } from '@src/configs/routes/home.route';
import React from 'react';

import AddDeviceManualScreen from './add-device-manual.screen';
import DeviceDetailScreen from './device-detail.screen';
import HomeScreen from './home.screen';

const Stack = createStackNavigator<THomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddDeviceManual" component={AddDeviceManualScreen} />
      <Stack.Screen name="DeviceDetail" component={DeviceDetailScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
