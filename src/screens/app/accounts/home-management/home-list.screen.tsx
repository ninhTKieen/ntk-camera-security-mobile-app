import IconGeneral from '@src/components/icon-general';
import SubLayout from '@src/components/sub-layout';
import { i18nKeys } from '@src/configs/i18n';
import {
  EEstateRole,
  TGetEstateListResponse,
} from '@src/features/estates/estate.model';
import estateService from '@src/features/estates/estate.service';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Box, Pressable, Text } from 'native-base';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

const HomeListScreen = () => {
  const { t } = useTranslation();

  const estatesListQuery = useInfiniteQuery({
    queryKey: ['estates/getEstates'],
    queryFn: ({ pageParam = 1 }) =>
      estateService.getList({
        page: pageParam,
        limit: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length < 10) {
        return undefined;
      }

      return allPages.length * 10;
    },
  });

  const paginatedData = useMemo(() => {
    const data: TGetEstateListResponse[] = [];

    estatesListQuery.data?.pages.forEach((page) => {
      data.push(...page.items);
    });

    return data;
  }, [estatesListQuery.data?.pages]);

  const getMemberRole = useCallback(
    (role: EEstateRole) => {
      switch (role) {
        case EEstateRole.OWNER:
          return t(i18nKeys.estates.owner);
        case EEstateRole.ADMIN:
          return t(i18nKeys.estates.admin);
        case EEstateRole.NORMAL_USER:
          return t(i18nKeys.estates.normalUser);
        default:
          return '';
      }
    },
    [t],
  );

  const renderItem = ({ item }: { item: TGetEstateListResponse }) => {
    return (
      <Pressable>
        <Box
          p={4}
          m={2}
          borderWidth={1}
          borderColor="white"
          bgColor="light.50"
          borderRadius={15}
          shadow={2}
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Text fontWeight="semibold" fontSize="lg">
              {item.name}
            </Text>
            <Text>{getMemberRole(item.role)}</Text>
          </Box>

          <IconGeneral
            type="MaterialCommunityIcons"
            name="chevron-right"
            size={25}
          />
        </Box>
      </Pressable>
    );
  };

  return (
    <SubLayout title={t(i18nKeys.account.homeManagement.title)}>
      <Box bgColor="white" flex={1}>
        <FlatList
          data={paginatedData}
          keyExtractor={(item) => item.name + item.id}
          renderItem={renderItem}
        />
      </Box>
    </SubLayout>
  );
};

export default HomeListScreen;
