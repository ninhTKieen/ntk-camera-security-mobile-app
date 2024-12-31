import IconGeneral from '@src/components/icon-general';
import { SvgIcon } from '@src/components/svg-icons';
import { HOME_ID_KEY } from '@src/configs/constant';
import { i18nKeys } from '@src/configs/i18n';
import { storage } from '@src/configs/mmkv.storage';
import { TRelayBasic } from '@src/features/relays/relay.model';
import relayService from '@src/features/relays/relay.service';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Actionsheet, Box, Text, useTheme } from 'native-base';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onChooseRelay: (relayId: string) => void;
};

const ListEmptyComponent = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <SvgIcon
        name="house"
        width={60}
        height={60}
        color={colors.primary[500]}
      />
      <Text mt={2}>{t(i18nKeys.estates.empty)}</Text>
    </Box>
  );
};

export const ChooseRelayModal = ({ isOpen, onClose, onChooseRelay }: Props) => {
  const homeId = Number(storage.getString(HOME_ID_KEY));

  const relaysQuery = useInfiniteQuery({
    queryKey: ['relays', { estateId: homeId }],
    queryFn: ({ pageParam }) =>
      relayService.getAll({
        page: pageParam,
        limit: 10,
        estateId: homeId,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.items.length < 10) {
        return undefined;
      }
      return allPages.length * 10;
    },
  });

  const paginatedData = useMemo(() => {
    const data: TRelayBasic[] = [];

    relaysQuery.data?.pages.forEach((page) => {
      data.push(...page.data.items);
    });

    return data;
  }, [relaysQuery.data?.pages]);

  const renderItem: ListRenderItem<TRelayBasic> = ({ item }) => (
    <Actionsheet.Item
      borderRadius="xl"
      _pressed={{
        _text: {
          color: 'white',
        },
        borderRadius: 'xl',
      }}
      onPress={() => {
        onChooseRelay && onChooseRelay(item.uid);
        onClose();
      }}
    >
      <Box
        w="full"
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Text fontWeight="semibold" fontSize="lg">
            {item.name}
          </Text>
          <Text>{item.uid}</Text>
        </Box>
        <IconGeneral
          type="MaterialCommunityIcons"
          name="chevron-right"
          size={25}
        />
      </Box>
    </Actionsheet.Item>
  );

  return (
    <Actionsheet
      isOpen={isOpen}
      onClose={onClose}
      hideDragIndicator
      safeAreaTop
    >
      <Actionsheet.Content
        bgColor="gray.50"
        shadow={4}
        borderWidth={2}
        borderColor="gray.200"
      >
        <Box w="full" h={60} px={4}>
          <Text fontSize="16" fontWeight="bold" textAlign="center" py={2}>
            {'Relays Server'}
          </Text>
        </Box>
        <FlatList
          data={paginatedData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<ListEmptyComponent />}
          refreshControl={
            <RefreshControl
              refreshing={relaysQuery.isLoading}
              onRefresh={relaysQuery.refetch}
            />
          }
        />
      </Actionsheet.Content>
    </Actionsheet>
  );
};
