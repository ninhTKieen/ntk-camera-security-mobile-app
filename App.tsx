import React from 'react';

import {View} from 'react-native';
import {Text} from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text h1>Hello World</Text>
          <Icon name="home" size={30} color="#900" />
        </View>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
