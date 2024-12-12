import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import IconGeneral from '@src/components/icon-general';
import { SvgIcon } from '@src/components/svg-icons';
import { HOME_ID_KEY } from '@src/configs/constant';
import { i18nKeys } from '@src/configs/i18n';
import { storage } from '@src/configs/mmkv.storage';
import { THomeStackParamList } from '@src/configs/routes/home.route';
import {
  EEstateMemberStatus,
  EEstateRole,
  TGetDetailEstateDevice,
  TGetEstateListResponse,
} from '@src/features/estates/estate.model';
import estateService from '@src/features/estates/estate.service';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  Box,
  FlatList,
  Pressable,
  Stack,
  Text,
  useDisclose,
} from 'native-base';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItem } from 'react-native';
import FastImage from 'react-native-fast-image';

import ChooseHomeModal from './components/choose-home-modal';
import CreateDeviceModal from './components/create-device-modal';

const HomeScreen = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclose();
  const [isCreateDeviceModalOpen, setIsCreateDeviceModalOpen] = useState(false);

  const navigation = useNavigation<StackNavigationProp<THomeStackParamList>>();

  const homeId = Number(storage.getString(HOME_ID_KEY));

  const estatesListQuery = useInfiniteQuery({
    queryKey: [
      'estates/getEstates',
      {
        status: EEstateMemberStatus.JOINED,
      },
    ],
    queryFn: ({ pageParam }) =>
      estateService.getList({
        page: pageParam,
        limit: 10,
        status: EEstateMemberStatus.JOINED,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length < 10) {
        return undefined;
      }
      return allPages.length * 10;
    },
  });

  const homeDetailQuery = useQuery({
    queryKey: ['estates/getEstate', { estateId: homeId }],
    queryFn: () => estateService.getDetail(homeId),
    enabled: !!homeId,
  });

  const paginatedData = useMemo(() => {
    const data: TGetEstateListResponse[] = [];
    estatesListQuery.data?.pages.forEach((page) => {
      data.push(...page.items);
    });
    return data;
  }, [estatesListQuery.data?.pages]);

  const canAddDevice = useMemo(() => {
    return homeId && homeDetailQuery.data?.role !== EEstateRole.NORMAL_USER;
  }, [homeId, homeDetailQuery.data]);

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
    <Box h="full" flex={1}>
      <Box
        flexDir="row"
        p={2}
        bgColor="white"
        h="16"
        alignItems="center"
        justifyContent="space-between"
      >
        <Pressable flexDir="row" alignItems="center" onPress={onOpen}>
          <Text fontSize="2xl" fontWeight="bold" mr={2}>
            {homeDetailQuery.data?.name || t(i18nKeys.bottomTab.home)}
          </Text>
          <IconGeneral
            type="MaterialCommunityIcons"
            name="chevron-down"
            size={24}
          />
        </Pressable>

        {canAddDevice ? (
          <IconGeneral
            type="MaterialCommunityIcons"
            name="camera-plus"
            size={24}
            onPress={() => {
              setIsCreateDeviceModalOpen(true);
            }}
          />
        ) : null}
      </Box>

      {homeDetailQuery.data && (
        <Box>
          <Box
            backgroundColor="white"
            shadow={2}
            borderRadius={15}
            overflow="hidden"
            m={4}
          >
            <FastImage
              source={{
                uri: homeDetailQuery.data?.imageUrls?.[0],
              }}
              style={{ width: '100%', aspectRatio: 16 / 9 }}
              defaultSource={require('@src/assets/images/not-found.png')}
              resizeMode={FastImage.resizeMode.stretch}
            />
          </Box>

          <FlatList
            data={homeDetailQuery.data.devices}
            p={4}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={{
              gap: 20,
              justifyContent: 'space-between',
            }}
            ItemSeparatorComponent={() => <Box h={4} />}
          />
        </Box>
      )}

      <ChooseHomeModal
        isOpen={isOpen}
        onClose={onClose}
        paginatedData={paginatedData}
      />

      <CreateDeviceModal
        isOpen={isCreateDeviceModalOpen}
        onClose={() => setIsCreateDeviceModalOpen(false)}
      />
    </Box>
  );
};

export default HomeScreen;
