import { createStackNavigator } from '@react-navigation/stack';
import { TAppStackParamList } from '@src/configs/routes/app.route';
import HomeScreen from '@src/screens/app/home/home.screen';
import React from 'react';

const Stack = createStackNavigator<TAppStackParamList>();

const AuthNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
