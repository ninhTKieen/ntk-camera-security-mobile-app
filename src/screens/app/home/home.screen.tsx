import MainLayout from '@src/components/main-layout';
import { i18nKeys } from '@src/configs/i18n';
import { Box, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

const HomeScreen = () => {
  const { t } = useTranslation();

  return (
    <MainLayout title={t(i18nKeys.bottomTab.home)}>
      <Box style={styles.container}>
        <Text>{t(i18nKeys.bottomTab.home)}</Text>
      </Box>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
