import messaging from '@react-native-firebase/messaging';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IconGeneral from '@src/components/icon-general';
import { i18nKeys } from '@src/configs/i18n';
import { TAppStackParamList } from '@src/configs/routes/app.route';
import HomeScreen from '@src/screens/app/home/home.screen';
import SettingNavigator from '@src/screens/app/settings';
import { useTheme } from 'native-base';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator<TAppStackParamList>();

const AuthNavigator = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const color = theme.colors.primary[500];

  const getFcmToken = useCallback(async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);
    } catch (error) {
      console.log('getFcmToken error', error);
    }
  }, []);

  useEffect(() => {
    getFcmToken();
  }, [getFcmToken]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color,
        headerTintColor: color,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <IconGeneral
                color={color}
                type="Ionicons"
                size={28}
                name="home"
              />
            ) : (
              <IconGeneral
                color={color}
                type="Ionicons"
                size={28}
                name="home-outline"
              />
            ),
          tabBarActiveTintColor: color,
          tabBarLabel: t(i18nKeys.bottomTab.home),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Settings"
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <IconGeneral
                color={color}
                type="Ionicons"
                size={28}
                name="settings"
              />
            ) : (
              <IconGeneral
                color={color}
                type="Ionicons"
                size={28}
                name="settings-outline"
              />
            ),
          tabBarActiveTintColor: color,
          tabBarLabel: t(i18nKeys.bottomTab.setting),
        }}
        component={SettingNavigator}
      />
    </Tab.Navigator>
  );
};

export default AuthNavigator;
