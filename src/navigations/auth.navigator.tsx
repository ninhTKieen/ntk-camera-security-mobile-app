import {createStackNavigator} from '@react-navigation/stack';
import {TAuthStackParamList} from '@src/configs/routes/auth.route';
import {useAppStore} from '@src/features/common/app.store';
import {useAuth} from '@src/hooks/use-auth.hook';
import LoginScreen from '@src/screens/auth/login.screen';
import React, {useEffect} from 'react';

const Stack = createStackNavigator<TAuthStackParamList>();

const AuthNavigator = (): JSX.Element => {
  const {authQuery} = useAuth();
  const {setLoading} = useAppStore();

  useEffect(() => {
    if (authQuery.isLoading) {
      setLoading(true);
    }
  }, [authQuery.isLoading, setLoading]);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
