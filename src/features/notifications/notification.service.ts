import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import {
  PERMISSIONS,
  checkNotifications,
  request,
} from 'react-native-permissions';

class NotificationServices {
  async requestPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }

    try {
      if (Platform.OS === 'android') {
        const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        console.log('POST_NOTIFICATIONS status:', result);

        return result !== 'denied' && result !== 'blocked';
      }
    } catch (error) {
      console.log('POST_NOTIFICATIONS error ', error);
      throw Promise.reject(error);
    }

    return enabled;
  }

  async checkPermission() {
    const result = await checkNotifications();

    return result.status === 'granted';
  }
}

const notificationServices = new NotificationServices();

export default notificationServices;
