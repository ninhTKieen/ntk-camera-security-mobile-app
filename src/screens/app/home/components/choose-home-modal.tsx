import IconGeneral from '@src/components/icon-general';
import { HOME_ID_KEY } from '@src/configs/constant';
import { i18nKeys } from '@src/configs/i18n';
import { storage } from '@src/configs/mmkv.storage';
import {
  EEstateRole,
  TGetEstateListResponse,
} from '@src/features/estates/estate.model';
import { Actionsheet, Box, Text } from 'native-base';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItem } from 'react-native';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  paginatedData: TGetEstateListResponse[];
};

const ChooseHomeModal = ({ isOpen, onClose, paginatedData }: Props) => {
  const { t } = useTranslation();
  const homeId = Number(storage.getString(HOME_ID_KEY));

  const onSelectHome = (id: number) => {
    storage.set(HOME_ID_KEY, String(id));
    onClose();
  };

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

  const renderItem: ListRenderItem<TGetEstateListResponse> = ({ item }) => (
    <Actionsheet.Item
      onPress={() => onSelectHome(item.id)}
      bg={
        item.id === Number(storage.getString(HOME_ID_KEY))
          ? 'primary.700'
          : 'transparent'
      }
      borderRadius="xl"
      _pressed={{
        _text: {
          color: 'white',
        },
        borderRadius: 'xl',
      }}
    >
      <Box
        w="full"
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Text
            fontWeight="semibold"
            fontSize="lg"
            color={item.id === homeId ? 'gray.100' : 'black'}
          >
            {item.name}
          </Text>
          <Text color={item.id === homeId ? 'white' : 'black'}>
            {getMemberRole(item.role)}
          </Text>
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
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <Box w="full" h={60} px={4}>
          <Text fontSize="16" fontWeight="bold" textAlign="center" py={4}>
            {t(i18nKeys.account.homeManagement.title)}
          </Text>
        </Box>
        <FlatList
          data={paginatedData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ChooseHomeModal;
