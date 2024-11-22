import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IconGeneral from '@src/components/icon-general';
import { i18nKeys } from '@src/configs/i18n';
import { TAppStackParamList } from '@src/configs/routes/app.route';
import AccountNavigator from '@src/screens/app/accounts';
import DashboardScreen from '@src/screens/app/dashboard/dashboard.screen';
import EventScreen from '@src/screens/app/events/event.screen';
import HomeStack from '@src/screens/app/home';
import { useTheme } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator<TAppStackParamList>();

const AppNavigator = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const color = theme.colors.primary[500];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color,
        headerTintColor: color,
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          height: 70,
        },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        options={{
          tabBarIcon: ({ focused }) => (
            <IconGeneral
              color={color}
              type="MaterialCommunityIcons"
              size={28}
              name={focused ? 'home' : 'home-outline'}
            />
          ),
          tabBarActiveTintColor: color,
          tabBarLabel: t(i18nKeys.bottomTab.home),
        }}
        component={HomeStack}
      />
      <Tab.Screen
        name="Dashboard"
        options={{
          tabBarIcon: ({ focused }) => (
            <IconGeneral
              color={color}
              type="MaterialCommunityIcons"
              size={28}
              name={focused ? 'view-dashboard' : 'view-dashboard-outline'}
            />
          ),
          tabBarActiveTintColor: color,
          tabBarLabel: t(i18nKeys.bottomTab.dashboard),
        }}
        component={DashboardScreen}
      />
      <Tab.Screen
        name="EventNavigator"
        options={{
          tabBarIcon: ({ focused }) => (
            <IconGeneral
              color={color}
              type="MaterialCommunityIcons"
              size={28}
              name={focused ? 'clipboard-alert' : 'clipboard-alert-outline'}
            />
          ),
          tabBarActiveTintColor: color,
          tabBarLabel: t(i18nKeys.bottomTab.event),
        }}
        component={EventScreen}
      />
      <Tab.Screen
        name="AccountNavigator"
        options={{
          tabBarIcon: ({ focused }) => (
            <IconGeneral
              color={color}
              type="MaterialCommunityIcons"
              size={28}
              name={focused ? 'account-circle' : 'account-circle-outline'}
            />
          ),
          tabBarActiveTintColor: color,
          tabBarLabel: t(i18nKeys.account.title),
        }}
        component={AccountNavigator}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
