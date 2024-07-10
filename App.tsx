import React from 'react';

import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const App = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Hello World</Text>
      <Icon name="home" size={30} color="#900" />
    </View>
  );
};

export default App;
