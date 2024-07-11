import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {TRootStackParamList} from '@src/configs/routes/app.route';

import AuthNavigator from './auth.navigator';
import AppNavigator from './app.navigator';
import {useAuth} from '@src/hooks/use-auth.hook';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView} from 'react-native';

const Stack = createStackNavigator<TRootStackParamList>();

const RootNavigator = (): JSX.Element => {
  const {isAuth} = useAuth();

  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
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
