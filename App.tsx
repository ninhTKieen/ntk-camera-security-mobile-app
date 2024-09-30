import RootNavigator from '@src/navigations';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  ZoomInDownZoomOutUp,
  createNotifications,
} from 'react-native-notificated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

const { NotificationsProvider } = createNotifications({
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
    errorConfig: {
      bgColor: '#FFEDED',
      accentColor: '#FF4D4F',
      leftIconSource: require('@src/assets/image.png'),
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NativeBaseProvider>
            <NotificationsProvider>
              <RootNavigator />
            </NotificationsProvider>
          </NativeBaseProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default App;
