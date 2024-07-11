import {Text} from '@rneui/themed';
import React from 'react';
import {StyleSheet, View} from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text h1>Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
