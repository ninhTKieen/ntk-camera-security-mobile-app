import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SvgIcon } from '@src/components/svg-icons';
import { HOME_ID_KEY } from '@src/configs/constant';
import { i18nKeys } from '@src/configs/i18n';
import { storage } from '@src/configs/mmkv.storage';
import { THomeStackParamList } from '@src/configs/routes/home.route';
import {
  TGetDetailEstate,
  TGetDetailEstateDevice,
} from '@src/features/estates/estate.model';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { Box, FlatList, Pressable, Stack, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItem, RefreshControl } from 'react-native';

const ListEmptyComponent = () => {
  const { t } = useTranslation();
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <SvgIcon name="camera" width={60} height={60} color="#000" />
      <Text mt={2}>{t(i18nKeys.devices.emptyList)}</Text>
    </Box>
  );
};

const HomeDevicesList = () => {
  const queryClient = useQueryClient();
  const navigation =
    useNavigation<StackNavigationProp<THomeStackParamList, 'Home'>>();

  const homeId = Number(storage.getString(HOME_ID_KEY));

  const query = queryClient.getQueryData<TGetDetailEstate>([
    'estates/getEstate',
    { estateId: homeId },
  ]);
  const isFetching = useIsFetching({
    queryKey: ['estates/getEstate', { estateId: homeId }],
  });

  const renderItem: ListRenderItem<TGetDetailEstateDevice> = ({ item }) => {
    return (
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          navigation.navigate('DeviceDetail', {
            deviceId: item.id,
            deviceName: item.name,
          });
        }}
      >
        {({ isPressed }) => (
          <Box
            bg="white"
            shadow={1}
            borderRadius={15}
            p={2}
            opacity={isPressed ? 0.5 : 1}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flex={1}
            >
              <SvgIcon name="security-camera" width={50} height={50} />
              <Text maxW="1/2" numberOfLines={1}>
                {item.model ?? '---'}
              </Text>
            </Stack>
            <Text mt={'5'}>{item.name}</Text>
          </Box>
        )}
      </Pressable>
    );
  };

  return (
    <Box w="full" h="full">
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isFetching > 0}
            onRefresh={() => {
              queryClient.invalidateQueries({
                queryKey: ['estates/getEstate', { estateId: homeId }],
              });
            }}
          />
        }
        showsVerticalScrollIndicator={false}
        data={query?.devices}
        p={4}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{
          gap: 20,
          justifyContent: 'space-between',
        }}
        ItemSeparatorComponent={() => <Box h={4} />}
        ListEmptyComponent={ListEmptyComponent}
      />
    </Box>
  );
};

export default HomeDevicesList;
