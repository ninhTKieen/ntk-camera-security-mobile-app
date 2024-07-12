import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TRootStackParamList } from '@src/configs/routes/app.route';
import { useAuth } from '@src/hooks/use-auth.hook';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { SafeAreaView } from 'react-native';

import AppNavigator from './app.navigator';
import AuthNavigator from './auth.navigator';

const Stack = createStackNavigator<TRootStackParamList>();

const RootNavigator = (): JSX.Element => {
  const queryClient = useQueryClient();

  const { isAuth, currentUser } = useAuth();

  const onStateChange = () => {
    (!isAuth || !!currentUser) &&
      queryClient.refetchQueries({
        queryKey: ['auth/getUserInfo'],
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer onStateChange={onStateChange}>
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
