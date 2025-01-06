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
import { HOME_ID_KEY } from '@src/configs/constant';
import { storage } from '@src/configs/mmkv.storage';
import { THomeStackParamList } from '@src/configs/routes/home.route';
import { useAppStore } from '@src/features/common/app.store';
import deviceService from '@src/features/devices/device.service';
import { TResponseRecognizedFace } from '@src/features/recognized-faces/recognized-face.model';
import socketService from '@src/features/socket/socket.service';
import { requestExternalStoragePermission } from '@src/utils/common.util';
import { useQuery } from '@tanstack/react-query';
import { Box, useTheme } from 'native-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import RNBUtil from 'react-native-blob-util';

import { RTSPView, RtspViewRef } from './components/rtsp-view';

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

  const relayId = route.params.relayId;

  const [recogFaces, setRecognizedFaces] = useState<TResponseRecognizedFace[]>(
    [],
  );
  const [ratio, setRatio] = useState({
    x: 1,
    y: 1,
  });
  const { setHideBottomTabBar } = useAppStore();

  const ref = useRef<RtspViewRef>(null);
  const lastSnapshotTime = useRef<number>(0);

  const theme = useTheme();

  const { deviceId, deviceName } = route.params;
  const homeId = Number(storage.getString(HOME_ID_KEY));

  const getDeviceQuery = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => deviceService.getDetail(deviceId),
    enabled: !!deviceId,
  });

  const sendMessageToServer = useCallback(
    (sendBase64: string) => {
      socketService.send({
        channel: 'device/send-base64',
        data: {
          base64: sendBase64,
          estateId: homeId,
          deviceId,
        },
      });
    },
    [deviceId, homeId],
  );

  const saveFileToLibrary = useCallback(async () => {
    const result = await requestExternalStoragePermission();

    console.log('Request external storage permission:', result);

    const snapshot = await makeImageFromView(ref.current?.rctView as any);

    const base64String = snapshot?.encodeToBase64(ImageFormat.PNG, 50);

    if (result) {
      const pictureBasePath = Platform.select({
        android: RNBUtil.fs.dirs.PictureDir,
        ios: RNBUtil.fs.dirs.LibraryDir,
      });

      const fileName = `camera_snapshot_${new Date().getTime()}.png`;

      if (base64String) {
        try {
          await RNBUtil.fs.writeFile(
            `${pictureBasePath}/${fileName}`,
            base64String as string,
            'base64',
          );

          console.log(
            'File written successfully',
            `${pictureBasePath}/${fileName}`,
          );
        } catch (error) {
          console.error('Error writing file:', error);
        }
      }
    }
  }, []);

  const takeSnapshot = useCallback(async () => {
    const snapshot = await makeImageFromView(ref.current?.rctView as any);

    const snapshotWidth = snapshot?.width();
    const snapshotHeight = snapshot?.height();

    if (!snapshotWidth || !snapshotHeight) {
      return;
    }

    ref.current?.rctView?.current?.measureInWindow((x, y, width, height) => {
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
        sendMessageToServer(base64String);
      }
    });
  }, [sendMessageToServer]);

  const handleVideoProgress = useCallback(() => {
    const now = Date.now();
    if (now - lastSnapshotTime.current >= 60000) {
      lastSnapshotTime.current = now;
      takeSnapshot();
    }
    if (ref.current && ref.current.requestRef) {
      ref.current.requestRef.current =
        requestAnimationFrame(handleVideoProgress);
    }
  }, [takeSnapshot]);

  const handleJoinRoom = useCallback(() => {
    socketService.send({
      channel: 'device/join-room',
      data: {
        deviceId,
        estateId: homeId,
      },
    });
  }, [deviceId, homeId]);

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

  useEffect(() => {
    if (isFocused) {
      setHideBottomTabBar(true);
      handleJoinRoom();
    }

    return () => {
      setHideBottomTabBar(false);
      socketService.off('device/join-room');
    };
  }, [handleJoinRoom, isFocused, setHideBottomTabBar]);

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
      <Box flex={1} bg="white" position="relative" h="full" p={4}>
        {getDeviceQuery.data && (
          <>
            <Box>
              {getDeviceQuery.data.streamLink && relayId && (
                <RTSPView
                  relayId={relayId}
                  rtsp={getDeviceQuery.data.streamLink}
                  ref={ref}
                  saveFileToLibrary={saveFileToLibrary}
                  handleVideoProgress={handleVideoProgress}
                />
              )}
            </Box>
          </>
        )}

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
