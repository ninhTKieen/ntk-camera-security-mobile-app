import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Canvas,
  Circle,
  Group,
  ImageFormat,
  Rect,
  Text,
  makeImageFromView,
  matchFont,
} from '@shopify/react-native-skia';
import IconGeneral from '@src/components/icon-general';
import SubLayout from '@src/components/sub-layout';
import { VLCPlayer } from '@src/components/vlc-player';
import { HOME_ID_KEY } from '@src/configs/constant';
import { storage } from '@src/configs/mmkv.storage';
import { THomeStackParamList } from '@src/configs/routes/home.route';
import deviceService from '@src/features/devices/device.service';
import { TResponseRecognizedFace } from '@src/features/recognized-faces/recognized-face.model';
import socketService from '@src/features/socket/socket.service';
import { requestExternalStoragePermission } from '@src/utils/common.util';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Spinner, useTheme } from 'native-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import RNBUtil from 'react-native-blob-util';

const fontFamily = Platform.select({ ios: 'Helvetica', default: 'serif' });
const fontStyle = {
  fontFamily,
  fontSize: 14,
  fontStyle: 'italic',
  fontWeight: 'bold',
};
const font = matchFont(fontStyle as any);

const DeviceDetailScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<THomeStackParamList, 'DeviceDetail'>>();
  const route = useRoute<RouteProp<THomeStackParamList, 'DeviceDetail'>>();
  const isFocused = useIsFocused();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [base64, setBase64] = useState<string | undefined>(undefined);
  const [lastProgressTime, setLastProgressTime] = useState<number>(0);
  const [recogFaces, setRecognizedFaces] = useState<TResponseRecognizedFace[]>(
    [],
  );
  const [ratio, setRatio] = useState({
    x: 1,
    y: 1,
  });

  const ref = useRef<View>(null);
  const theme = useTheme();

  const { deviceId, deviceName } = route.params;
  const homeId = Number(storage.getString(HOME_ID_KEY));

  const getDeviceQuery = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => deviceService.getDetail(deviceId),
    enabled: !!deviceId,
  });

  const sendMessageToServer = (sendBase64: string) => {
    socketService.send({
      channel: 'device/send-base64',
      data: {
        base64: sendBase64,
        estateId: homeId,
        deviceId,
      },
    });
  };

  const saveFileToLibrary = useCallback(async () => {
    const result = await requestExternalStoragePermission();

    if (result) {
      const pictureBasePath = Platform.select({
        android: RNBUtil.fs.dirs.PictureDir,
        ios: RNBUtil.fs.dirs.LibraryDir,
      });

      const fileName = `camera_snapshot_${new Date().getTime()}.png`;

      if (base64) {
        try {
          await RNBUtil.fs.writeFile(
            `${pictureBasePath}/${fileName}`,
            base64 as string,
            'base64',
          );

          console.log('File written successfully');
        } catch (error) {
          console.error('Error writing file:', error);
        }
      }
    }
  }, [base64]);

  const takeSnapshot = async () => {
    const snapshot = await makeImageFromView(ref);

    const snapshotWidth = snapshot?.width();
    const snapshotHeight = snapshot?.height();

    if (!snapshotWidth || !snapshotHeight) {
      return;
    }

    ref.current?.measureInWindow((x, y, width, height) => {
      if (!width || !height) {
        return;
      }

      // Calculate scaling ratios
      const xRatio = snapshotWidth / width;
      const yRatio = snapshotHeight / height;

      setRatio({
        x: xRatio,
        y: yRatio,
      });

      const base64String = snapshot?.encodeToBase64(ImageFormat.PNG, 50);

      if (base64String) {
        setBase64(base64String);
        sendMessageToServer(base64String);
      }
    });
  };

  const handleVideoProgress = () => {
    const now = Date.now();
    if (now - lastProgressTime > 1500) {
      setLastProgressTime(now);
      takeSnapshot();
    } else {
      // console.log('Skipping snapshot');
    }
  };

  useEffect(() => {
    socketService.received({
      channel: 'device/receive-recognized-faces',
      callback: (data: TResponseRecognizedFace[]) => {
        // data?.length && setRecognizedFaces(data);
        if (data?.length) {
          const adjustedFaces = data?.map((face) => {
            const adjustedBox = {
              _x: face.detection._box._x / ratio.x + 16,
              _y: face.detection._box._y / ratio.y + 16,
              _width: face.detection._box._width / ratio.x + 16 * 2,
              _height: face.detection._box._height / ratio.y + 16 * 2,
            };

            const adjustedLandmarks = face.landmarks._positions.map(
              (point: any) => ({
                _x: point._x / ratio.x + 16,
                _y: point._y / ratio.y + 16,
              }),
            );

            return {
              ...face,
              detection: { ...face.detection, _box: adjustedBox },
              landmarks: { ...face.landmarks, _positions: adjustedLandmarks },
            };
          });

          setRecognizedFaces(adjustedFaces);
        }
      },
    });
  }, [ratio.x, ratio.y]);

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      socketService.send({
        channel: 'device/leave-room',
        data: {
          deviceId,
          estateId: homeId,
        },
      });
    });
  }, [deviceId, homeId, navigation]);

  return (
    <SubLayout
      title={deviceName}
      right={
        <IconGeneral
          type="Ionicons"
          name="settings"
          size={25}
          onPress={() => {
            navigation.navigate('EditDevice', {
              deviceId,
            });
          }}
        />
      }
    >
      <Box flex={1} bg="gray.100" p={4}>
        {getDeviceQuery.data && (
          <>
            {isLoading && <Spinner size="lg" />}
            <Box
              ref={ref}
              w="full"
              style={{
                aspectRatio: 16 / 9,
                display: isFocused ? 'flex' : 'none',
              }}
              onLayout={(event) => {
                console.log('event', event.nativeEvent.layout);
              }}
            >
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
                onVideoError={(event) => {
                  console.log('error', event);
                  setIsLoading(false);
                }}
                onVideoLoadStart={() => {
                  setIsLoading(false);
                  socketService.send({
                    channel: 'device/join-room',
                    data: {
                      deviceId,
                      estateId: homeId,
                    },
                  });
                }}
                onVideoProgress={handleVideoProgress}
              />
            </Box>
          </>
        )}

        <Button mt={4} onPress={saveFileToLibrary} zIndex={100}>
          {t('media.snapshot')}
        </Button>

        {recogFaces.length > 0 && (
          <Box style={StyleSheet.absoluteFill}>
            {recogFaces?.map((face, itemIndex) => {
              const box = face.detection._box;
              const landmarks = face.landmarks._positions;

              return (
                <Canvas style={StyleSheet.absoluteFill} key={itemIndex}>
                  <Rect
                    x={box._x}
                    y={box._y}
                    width={box._width}
                    height={box._height}
                    color={theme.colors.primary[400]}
                    style="stroke"
                    strokeWidth={2}
                  />

                  <Text
                    x={box._x}
                    y={box._y - 10}
                    text={`${face?.bestMatch?.personName || 'Unknown'} - ${
                      face?.bestMatch?.distance?.toFixed(2) || 1
                    }`}
                    color={theme.colors.primary[400]}
                    font={font}
                  />

                  <Group>
                    {landmarks.map((point, index) => (
                      <Circle
                        key={index}
                        cx={point._x}
                        cy={point._y}
                        r={1}
                        color={theme.colors.muted[500]}
                      />
                    ))}
                  </Group>
                </Canvas>
              );
            })}
          </Box>
        )}
      </Box>
    </SubLayout>
  );
};

export default DeviceDetailScreen;
