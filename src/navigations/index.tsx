import notifee, {
  AndroidImportance,
  EventType,
  Event as NotifeeEvent,
} from '@notifee/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingModal from '@src/components/loading-modal';
// import { i18nKeys } from '@src/configs/i18n';
import { TRootStackParamList } from '@src/configs/routes/app.route';
import { useAppStore } from '@src/features/common/app.store';
import notificationServices from '@src/features/notifications/notification.service';
import { useAuth } from '@src/hooks/use-auth.hook';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AppNavigator from './app.navigator';
import AuthNavigator from './auth.navigator';

const Stack = createStackNavigator<TRootStackParamList>();

const RootNavigator = (): JSX.Element => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { isAuth, currentUser } = useAuth();
  const { isLoading } = useAppStore();

  const onStateChange = () => {
    (!isAuth || !!currentUser) &&
      queryClient.refetchQueries({
        queryKey: ['auth/getUserInfo'],
      });
  };

  const onMessageReceived = useCallback(
    async (message: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('message', message);
      const channelId = await notifee.createChannel({
        id: 'RnNativeBaseConcept',
        name: 'RnNativeBaseConcept',
        importance: AndroidImportance.HIGH,
      });

      await notifee.requestPermission();
      if (Platform.OS === 'android') {
        await notifee.displayNotification({
          title: message?.notification?.title,
          body: message?.notification?.body,
          android: {
            channelId,
            pressAction: {
              id: 'RnNativeBaseConcept',
            },
            importance: AndroidImportance.HIGH,
          },
          data: message.data?.action ? { action: message.data.action } : {},
        });
      }

      notifee.onBackgroundEvent(async ({ type }: NotifeeEvent) => {
        if (type === EventType.PRESS) {
          //handle press event
        }
      });

      notifee.onForegroundEvent(async ({ type }: NotifeeEvent) => {
        if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
          //handle press event
        } else if (type === EventType.DISMISSED) {
          //handle dismiss event
        }
      });
    },
    [],
  );

  const handleNotification = useCallback(async () => {
    messaging().onMessage(onMessageReceived);

    messaging().setBackgroundMessageHandler(onMessageReceived);
  }, [onMessageReceived]);

  useEffect(() => {
    handleNotification();
  }, [handleNotification]);

  useEffect(() => {
    notificationServices
      .requestPermission()
      .then((result) => {
        if (!result) {
          // Toast.show({
          //   type: 'info',
          //   text1: t(i18nKeys.notification.disabled),
          //   text2: t(i18nKeys.notification.disabledMessage),
          //   position: 'top',
          // });
        }
      })
      .catch((error) => {
        console.log('requestPermission error', error);
      });
  }, [t]);

  useEffect(() => {
    notificationServices.checkPermission().then((result) => {
      console.log('checkPermission', result);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <LoadingModal isVisible={isLoading} />
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
    </GestureHandlerRootView>
  );
};

export default RootNavigator;
