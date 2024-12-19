import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import IconGeneral from '@src/components/icon-general';
import { useModal } from '@src/components/modal-provider';
import SubLayout from '@src/components/sub-layout';
import { SvgIcon } from '@src/components/svg-icons';
import { i18nKeys } from '@src/configs/i18n';
import { THomeManagementStackParamList } from '@src/configs/routes/account.route';
import {
  EEstateMemberStatus,
  EEstateRole,
  TGetEstateListResponse,
} from '@src/features/estates/estate.model';
import estateService from '@src/features/estates/estate.service';
import { useApp } from '@src/hooks/use-app.hook';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { Box, Pressable, Text, useTheme } from 'native-base';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

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

const HomeListScreen = () => {
  const navigation =
    useNavigation<
      StackNavigationProp<THomeManagementStackParamList, 'HomeList'>
    >();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { openConfirmationModal } = useModal();
  const { toastMessage } = useApp();

  const estatesListQuery = useInfiniteQuery({
    queryKey: ['estates/getEstates'],
    queryFn: ({ pageParam }) =>
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

  const acceptInvitationMutation = useMutation({
    mutationFn: (estateId: number) => estateService.acceptInvitation(estateId),
    onSuccess: () => {
      estatesListQuery.refetch();
      toastMessage({
        type: 'success',
        title: t(i18nKeys.common.success),
        description: t(i18nKeys.estates.joinHomeSuccess),
      });
    },
    onError: () => {
      toastMessage({
        type: 'error',
        title: t(i18nKeys.common.error),
        description: t(i18nKeys.estates.confirmInvitationError),
      });
    },
  });

  const rejectInvitationMutation = useMutation({
    mutationFn: (estateId: number) => estateService.rejectInvitation(estateId),
    onSuccess: () => {
      estatesListQuery.refetch();
    },
    onError: () => {
      toastMessage({
        type: 'error',
        title: t(i18nKeys.common.error),
        description: t(i18nKeys.estates.confirmInvitationError),
      });
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
      <Pressable
        onPress={() => {
          if (item.status === EEstateMemberStatus.PENDING) {
            openConfirmationModal({
              onBtnConfirm: () => {
                acceptInvitationMutation.mutate(item.id);
              },
              onBtnCancel: () => {
                rejectInvitationMutation.mutate(item.id);
              },
              title: t(i18nKeys.estates.confirmInvitation),
              description: t(i18nKeys.estates.confirmInviteText),
              confirmText: t(i18nKeys.common.confirm),
              cancelText: t(i18nKeys.common.decline),
            });
          } else {
            navigation.navigate('HomeDetail', {
              homeId: item.id,
              homeName: item.name,
            });
          }
        }}
      >
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

            <Text
              color={
                item.status === EEstateMemberStatus.PENDING
                  ? 'orange.500'
                  : 'gray.600'
              }
            >
              {item.status === EEstateMemberStatus.PENDING
                ? t(i18nKeys.estates.status.pending)
                : getMemberRole(item.role)}
            </Text>
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
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={{ flex: 1 }}
        />

        <Pressable
          position="absolute"
          right={5}
          bottom={5}
          bgColor={colors.primary[500]}
          borderRadius="full"
          w={'12'}
          h={'12'}
          alignItems="center"
          justifyContent="center"
          onPress={() => {
            navigation.navigate('CreateHome');
          }}
        >
          <IconGeneral
            type="MaterialCommunityIcons"
            name="plus"
            size={20}
            color={colors.white}
            onPress={() => {
              navigation.navigate('CreateHome');
            }}
          />
        </Pressable>
      </Box>
    </SubLayout>
  );
};

export default HomeListScreen;
