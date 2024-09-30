import { useNotifications } from 'react-native-notificated';
import { NotificationOwnProps } from 'react-native-notificated/lib/typescript/defaultConfig/types';
import { StyleProps } from 'react-native-reanimated';

export const useApp = () => {
  const { modify, notify, remove } = useNotifications();

  const toastMessage = ({
    type,
    title,
    description,
    params,
  }: {
    type: 'error' | 'success' | 'info' | 'warning';
    title: string;
    description?: string;
    params?: NotificationOwnProps & StyleProps;
  }) => {
    notify(type, {
      params: {
        title,
        description,
        ...params,
      },
    });
  };

  return {
    toastMessage,
    modify,
    remove,
  };
};
