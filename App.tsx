import RootNavigator from '@src/navigations';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NativeBaseProvider>
            <RootNavigator />
          </NativeBaseProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default App;
