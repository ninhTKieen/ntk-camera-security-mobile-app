import { RTSPVideoComponent } from '@src/components/RTSPVideo';
import MainLayout from '@src/components/main-layout';
import { i18nKeys } from '@src/configs/i18n';
import { Box } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

const DashboardScreen = () => {
  const { t } = useTranslation();

  return (
    <MainLayout title={t(i18nKeys.bottomTab.dashboard)}>
      <Box style={styles.container}>
        <RTSPVideoComponent
          style={{ width: '100%', height: 300 }}
          source={{
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          }}
          paused={false}
          onError={(event) => {
            console.log(event.nativeEvent.error);
          }}
          onLoad={() => console.log('Video loaded')}
        />
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

export default DashboardScreen;
