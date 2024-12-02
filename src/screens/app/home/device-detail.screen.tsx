import { RouteProp, useRoute } from '@react-navigation/native';
import { ImageFormat, makeImageFromView } from '@shopify/react-native-skia';
import SubLayout from '@src/components/sub-layout';
import { VLCPlayer } from '@src/components/vlc-player';
import { THomeStackParamList } from '@src/configs/routes/home.route';
import deviceService from '@src/features/devices/device.service';
import { requestExternalStoragePermission } from '@src/utils/common.util';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Image, Spinner } from 'native-base';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import RNBUtil from 'react-native-blob-util';

const DeviceDetailScreen = () => {
  const route = useRoute<RouteProp<THomeStackParamList, 'DeviceDetail'>>();
  const [isLoading, setIsLoading] = useState(true);
  const [base64, setBase64] = useState<string | undefined>(undefined);
  const { t } = useTranslation();

  const ref = useRef<View>(null);

  const { deviceId, deviceName } = route.params;

  const getDeviceQuery = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => deviceService.getDetail(deviceId),
    enabled: !!deviceId,
  });

  const takeSnapshot = async () => {
    const snapshot = await makeImageFromView(ref);

    const encodedBase64 = snapshot?.encodeToBase64(ImageFormat.JPEG, 50);

    setBase64(encodedBase64);

    const result = await requestExternalStoragePermission();

    if (result) {
      const pictureBasePath = Platform.select({
        android: RNBUtil.fs.dirs.PictureDir,
        ios: RNBUtil.fs.dirs.LibraryDir,
      });

      const fileName = `camera_snapshot_${new Date().getTime()}.png`;

      try {
        await RNBUtil.fs.writeFile(
          `${pictureBasePath}/${fileName}`,
          encodedBase64 as string,
          'base64',
        );

        console.log('File written successfully');
      } catch (error) {
        console.error('Error writing file:', error);
      }
    }
  };

  return (
    <SubLayout title={deviceName}>
      <Box flex={1} bg="gray.100" p={4}>
        {getDeviceQuery.data && (
          <>
            {isLoading && <Spinner size="lg" />}
            <Box ref={ref} style={{ width: '100%', aspectRatio: 16 / 9 }}>
              <VLCPlayer
                style={{ width: '100%', height: '100%' }}
                source={{
                  uri: encodeURI(getDeviceQuery.data.streamLink),
                  initType: 2,
                  hwDecoderEnabled: 1,
                  hwDecoderForced: 1,
                  initOptions: [
                    '--rtsp-tcp',
                    '--network-caching=500',
                    '--rtsp-caching=500',
                    '--no-stats',
                    '--tcp-caching=500',
                    '--realrtsp-caching=500',
                  ],
                }}
                paused={false}
                autoplay={true}
                onVideoError={(event) => {
                  console.log('error', event);
                  setIsLoading(false);
                }}
                onVideoLoadStart={() => {
                  console.log('load start');
                  setIsLoading(false);
                }}
              />
            </Box>

            <Button mt={4} onPress={takeSnapshot}>
              {t('media.snapshot')}
            </Button>

            {base64 && (
              <Image
                alt="snapshot"
                source={{ uri: `data:image/png;base64,${base64}` }}
                style={{
                  marginTop: 20,
                  width: '100%',
                  aspectRatio: 16 / 9,
                  alignSelf: 'center',
                }}
              />
            )}
          </>
        )}
      </Box>
    </SubLayout>
  );
};

export default DeviceDetailScreen;
