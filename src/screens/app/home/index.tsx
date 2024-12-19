import { createStackNavigator } from '@react-navigation/stack';
import { THomeStackParamList } from '@src/configs/routes/home.route';
import React from 'react';

import AddDeviceManualScreen from './add-device-manual.screen';
import AddRecognitionScreen from './add-recognition.screen';
import DeviceDetailScreen from './device-detail.screen';
import EditDeviceScreen from './edit-device.screen';
import EditRecognitionScreen from './edit-recognition.screen';
import FaceRecognitionListScreen from './face-recognition-list.screen';
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
      <Stack.Screen name="AddRecognition" component={AddRecognitionScreen} />
      <Stack.Screen
        name="RecognitionList"
        component={FaceRecognitionListScreen}
      />
      <Stack.Screen name="EditRecognition" component={EditRecognitionScreen} />
      <Stack.Screen name="EditDevice" component={EditDeviceScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
