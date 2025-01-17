import messaging from '@react-native-firebase/messaging';
import _ from 'lodash';
import { Platform } from 'react-native';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';

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

export const requestExternalStoragePermission = async () => {
  try {
    const permission = Platform.select({
      android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      default: null,
    });

    if (!permission) {
      console.warn('Platform not supported');
      return false;
    }

    const result = await request(permission);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error('Error requesting permission:', error);
    return false;
  }
};

export const isObjectDiff = (obj1: any, obj2: any) => {
  return !_.isEqual(obj1, obj2);
};
