import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TRootStackParamList } from '@src/configs/routes/app.route';
import { useAuth } from '@src/hooks/use-auth.hook';
import React from 'react';
import { SafeAreaView } from 'react-native';

import AppNavigator from './app.navigator';
import AuthNavigator from './auth.navigator';

const Stack = createStackNavigator<TRootStackParamList>();

const RootNavigator = (): JSX.Element => {
  const { isAuth } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuth ? (
            <Stack.Screen name="App" component={AppNavigator} />
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default RootNavigator;
