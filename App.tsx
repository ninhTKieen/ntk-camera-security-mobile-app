import { modalStack } from '@src/configs/modal/modal.config';
import { NotificationsProvider } from '@src/configs/notificated.config';
import RootNavigator from '@src/navigations';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ModalProvider } from 'react-native-modalfy';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NativeBaseProvider>
            <ModalProvider stack={modalStack}>
              <NotificationsProvider>
                <RootNavigator />
              </NotificationsProvider>
            </ModalProvider>
          </NativeBaseProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default App;
