import messaging from '@react-native-firebase/messaging';
import httpUtil from '@src/utils/http.util';
import { Platform } from 'react-native';
import {
  PERMISSIONS,
  checkNotifications,
  request,
} from 'react-native-permissions';

import { TSendTokenData } from './notification.model';

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

  async sendFcmTokenToServer(data: TSendTokenData) {
    const response = await httpUtil.request({
      url: '/api/fcm/send-token',
      method: 'POST',
      data,
    });

    return response;
  }
}

const notificationServices = new NotificationServices();

export default notificationServices;
