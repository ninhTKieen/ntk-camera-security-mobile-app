import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ImageFormat, makeImageFromView } from '@shopify/react-native-skia';
import IconGeneral from '@src/components/icon-general';
import SubLayout from '@src/components/sub-layout';
import { HOME_ID_KEY } from '@src/configs/constant';
import { storage } from '@src/configs/mmkv.storage';
import { THomeStackParamList } from '@src/configs/routes/home.route';
import { useAppStore } from '@src/features/common/app.store';
import deviceService from '@src/features/devices/device.service';
import socketService from '@src/features/socket/socket.service';
import { requestExternalStoragePermission } from '@src/utils/common.util';
import { useQuery } from '@tanstack/react-query';
import { Box } from 'native-base';
import React, { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import RNBUtil from 'react-native-blob-util';

import { RTSPView, RtspViewRef } from './components/rtsp-view';

const DeviceDetailScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<THomeStackParamList, 'DeviceDetail'>>();
  const route = useRoute<RouteProp<THomeStackParamList, 'DeviceDetail'>>();
  const isFocused = useIsFocused();

  const relayId = route.params.relayId;

  const { setHideBottomTabBar } = useAppStore();

  const ref = useRef<RtspViewRef>(null);
  const lastSnapshotTime = useRef<number>(0);

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

      const base64String = snapshot?.encodeToBase64(ImageFormat.PNG, 50);

      if (base64String) {
        sendMessageToServer(base64String);
      }
    });
  }, [sendMessageToServer]);

  const handleVideoProgress = useCallback(() => {
    const now = Date.now();
    if (now - lastSnapshotTime.current >= 90000) {
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
    navigation.addListener('blur', () => {
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
                  deviceId={deviceId}
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
      </Box>
    </SubLayout>
  );
};

export default DeviceDetailScreen;
