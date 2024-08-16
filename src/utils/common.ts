import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';

export const isAndroid = Platform.OS === 'android';

export const isIOS = Platform.OS === 'ios';

export const requestPermission = async (): Promise<boolean> => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }

  try {
    if (isAndroid) {
      const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      console.log('POST_NOTIFICATIONS status:', result);
    }
  } catch (error) {
    console.log('POST_NOTIFICATIONS error ', error);
  }

  return enabled;
};
