import {
  ZoomInDownZoomOutUp,
  createNotifications,
} from 'react-native-notificated';

export const {
  NotificationsProvider,
  ModalNotificationsProvider,
  modify,
  notify,
  useNotifications,
  CustomVariantsTypeHelper,
  remove,
} = createNotifications({
  animationConfig: ZoomInDownZoomOutUp,
  defaultStylesSettings: {
    globalConfig: {
      titleSize: 16,
      titleWeight: '600',
      descriptionSize: 12,
      descriptionWeight: '400',
      multiline: 2,
      imageStyle: {
        width: 20,
        height: 20,
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
      },
    },
    successConfig: {
      bgColor: '#EEF9E8',
      accentColor: '#52C41A',
      leftIconSource: require('@src/assets/images/round-check.png'),
    },
    errorConfig: {
      bgColor: '#FFE6E6',
      accentColor: '#FF5959',
      leftIconSource: require('@src/assets/images/round-error.png'),
    },
  },
});
