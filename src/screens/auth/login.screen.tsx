import {Text} from '@rneui/themed';
import React from 'react';
import {StyleSheet, View} from 'react-native';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text h1>Login Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LoginScreen;
