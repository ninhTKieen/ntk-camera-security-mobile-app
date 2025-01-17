import { RouteProp, useRoute } from '@react-navigation/native';
import SubLayout from '@src/components/sub-layout';
import { SvgIcon } from '@src/components/svg-icons';
import { APP_API_ENDPOINT } from '@src/configs/constant';
import { i18nKeys } from '@src/configs/i18n';
import { THomeStackParamList } from '@src/configs/routes/home.route';
import deviceService from '@src/features/devices/device.service';
import { dayjs } from '@src/utils/date.util';
import { useQuery } from '@tanstack/react-query';
import { Box, FlatList, Pressable, Stack, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GAP = 5;
const ITEM_WIDTH = (SCREEN_WIDTH - 16 * 2 - 2 * GAP) / 2;

const ListEmptyComponent = () => {
  const { t } = useTranslation();
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <SvgIcon name="camera" width={60} height={60} color="#000" />
      <Text mt={2}>{t(i18nKeys.devices.noImages)}</Text>
    </Box>
  );
};

const HumanDetectionImagesScreen = () => {
  const { t } = useTranslation();
  const route =
    useRoute<RouteProp<THomeStackParamList, 'HumanDetectionImages'>>();

  const { deviceId } = route.params;

  const deviceRecognitionsQuery = useQuery({
    queryKey: ['device/recognitions', { deviceId }],
    queryFn: () => deviceService.getRecognizedFaces(deviceId),
    refetchOnMount: 'always',
  });

  const renderItem: ListRenderItem<{
    uri: string;
    time: string;
  }> = ({ item }) => {
    return (
      <Pressable
        style={{ width: ITEM_WIDTH }}
        rounded={15}
        shadow={2}
        onPress={() => {}}
      >
        {({ isPressed }) => (
          <Box
            bg="white"
            shadow={1}
            borderRadius={15}
            opacity={isPressed ? 0.5 : 1}
            rounded={15}
            overflow="hidden"
          >
            <Stack flex={1}>
              <FastImage
                source={{ uri: `${APP_API_ENDPOINT}${item.uri}` }}
                style={styles.images}
              />

              <Box p={2}>
                <Text>
                  {dayjs
                    .unix(Number(item.time) / 1000)
                    .format('DD/MM/YY HH:mm:ss')}
                </Text>
              </Box>
            </Stack>
          </Box>
        )}
      </Pressable>
    );
  };

  return (
    <SubLayout title={t(i18nKeys.devices.humanDetection)}>
      <Box flex={1} bg="white">
        <FlatList
          px={4}
          contentContainerStyle={{ paddingVertical: 8 }}
          refreshControl={
            <RefreshControl
              refreshing={deviceRecognitionsQuery.isLoading}
              onRefresh={() => {
                deviceRecognitionsQuery.refetch();
              }}
            />
          }
          showsVerticalScrollIndicator={false}
          data={deviceRecognitionsQuery.data}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          ItemSeparatorComponent={() => <Box h={4} />}
          ListEmptyComponent={ListEmptyComponent}
        />
      </Box>
    </SubLayout>
  );
};

const styles = StyleSheet.create({
  images: {
    width: '100%',
    height: ITEM_WIDTH * 0.8,
  },
});

export default HumanDetectionImagesScreen;
