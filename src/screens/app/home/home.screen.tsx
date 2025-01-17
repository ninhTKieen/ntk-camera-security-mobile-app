import IconGeneral from '@src/components/icon-general';
import { HOME_ID_KEY } from '@src/configs/constant';
import { i18nKeys } from '@src/configs/i18n';
import { storage } from '@src/configs/mmkv.storage';
import {
  EEstateMemberStatus,
  EEstateRole,
  TGetDetailEstate,
  TGetEstateListResponse,
} from '@src/features/estates/estate.model';
import estateService from '@src/features/estates/estate.service';
import { useEstateStore } from '@src/features/estates/estate.store';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Box, Pressable, Text, useDisclose } from 'native-base';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import ChooseHomeModal from './components/choose-home-modal';
import CreateDeviceModal from './components/create-device-modal';
import HomeTabList from './components/home-tab-list';

const AnimatedBox = Animated.createAnimatedComponent(Box);

const HomeScreen = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclose();
  const [isCreateDeviceModalOpen, setIsCreateDeviceModalOpen] = useState(false);
  const { setHomeRole } = useEstateStore();

  const homeId = Number(storage.getString(HOME_ID_KEY));

  const anim = useSharedValue(0);

  const onModalWillShow = useCallback(() => {
    anim.value = withTiming(1);
  }, [anim]);

  const onModalWillClose = useCallback(() => {
    anim.value = withTiming(0);
  }, [anim]);

  const selectData = useCallback(
    (data: TGetDetailEstate) => {
      setHomeRole(data.role);
      return data;
    },
    [setHomeRole],
  );

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
    select: selectData,
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

  const transformStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${interpolate(anim.value, [0, 1], [0, 180])}deg` },
      ],
    };
  }, []);

  return (
    <Box flex={1} bgColor="muted.100">
      <Box
        flexDir="row"
        p={2}
        bgColor="white"
        h="16"
        alignItems="center"
        justifyContent="space-between"
      >
        <Pressable
          w="1/2"
          flexDir="row"
          alignItems="center"
          onPress={() => {
            onOpen();
            onModalWillShow();
          }}
        >
          <Text
            fontSize="xl"
            fontWeight="bold"
            mr={8}
            color="primary.700"
            numberOfLines={1}
            ellipsizeMode="tail"
            flex={1}
          >
            {homeDetailQuery.data?.name || t(i18nKeys.bottomTab.home)}
          </Text>
          <AnimatedBox style={transformStyle}>
            <IconGeneral type="Ionicons" name="chevron-down" size={24} />
          </AnimatedBox>
        </Pressable>

        {canAddDevice ? (
          <IconGeneral
            type="MaterialIcons"
            name="add-home-work"
            size={24}
            onPress={() => {
              setIsCreateDeviceModalOpen(true);
            }}
          />
        ) : null}
      </Box>

      {homeDetailQuery.data && (
        <Box flex={1}>
          <HomeTabList />
        </Box>
      )}

      <ChooseHomeModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          onModalWillClose();
        }}
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
