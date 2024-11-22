import { RouteProp, useRoute } from '@react-navigation/native';
import SubLayout from '@src/components/sub-layout';
import { VLCPlayer } from '@src/components/vlc-player';
import { THomeStackParamList } from '@src/configs/routes/home.route';
import deviceService from '@src/features/devices/device.service';
import { useQuery } from '@tanstack/react-query';
import { Box, Spinner } from 'native-base';
import React, { useState } from 'react';

const DeviceDetailScreen = () => {
  const route = useRoute<RouteProp<THomeStackParamList, 'DeviceDetail'>>();
  const [isLoading, setIsLoading] = useState(true);

  const { deviceId, deviceName } = route.params;

  const getDeviceQuery = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => deviceService.getDetail(deviceId),
    enabled: !!deviceId,
  });

  return (
    <SubLayout title={deviceName}>
      {getDeviceQuery.data && (
        <>
          {isLoading && <Spinner size="lg" />}
          <Box style={{ width: '100%', aspectRatio: 16 / 9 }}>
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
        </>
      )}
    </SubLayout>
  );
};

export default DeviceDetailScreen;
