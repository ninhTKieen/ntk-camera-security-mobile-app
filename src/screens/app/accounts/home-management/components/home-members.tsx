import IconGeneral from '@src/components/icon-general';
import { i18nKeys } from '@src/configs/i18n';
import {
  EEstateMemberStatus,
  EEstateRole,
  TEstateMember,
} from '@src/features/estates/estate.model';
import { Avatar, Box, Pressable, Stack, Text, useTheme } from 'native-base';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet } from 'react-native';

import AddMemberModal from './add-member-modal';

type Props = {
  members?: TEstateMember[];
  estateId: number;
};

export const HomeMembers = ({ members, estateId }: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

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

  const renderItem = ({ item }: { item: TEstateMember }) => {
    return (
      <Box
        flexDir="row"
        mb={2}
        p={2}
        borderWidth={2}
        borderColor="warmGray.100"
        borderRadius="full"
      >
        <Avatar source={{ uri: item.user.imageUrl }}>
          {item.user.name.substring(0, 1).toUpperCase()}
        </Avatar>
        <Box ml={2} flex={1}>
          <Text fontWeight="bold" fontSize="md" numberOfLines={1}>
            {item.nickname}
          </Text>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            borderRadius="md"
            pr={1}
          >
            <Text fontSize="sm" color="gray.600">
              {getMemberRole(item.role)}
            </Text>
            <Text
              fontSize="sm"
              color={
                item.status === EEstateMemberStatus.PENDING
                  ? 'orange.500'
                  : 'green.500'
              }
            >
              {item.status === EEstateMemberStatus.PENDING
                ? t(i18nKeys.estates.status.pending)
                : t(i18nKeys.estates.status.joined)}
            </Text>
          </Stack>
        </Box>
      </Box>
    );
  };

  return (
    <Box m={4} p={2} shadow={2} borderRadius={15} bg="white">
      <Box
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        mb={2}
      >
        <Text fontSize="md" fontWeight="bold" style={[styles.estateItemTitle]}>
          {t(i18nKeys.estates.members)}
        </Text>

        <Pressable onPress={() => setIsAddMemberModalOpen(true)}>
          {({ isPressed }) => (
            <IconGeneral
              type="AntDesign"
              name="pluscircleo"
              size={25}
              style={{
                transform: [{ scale: isPressed ? 0.95 : 1 }],
              }}
              color={colors.primary[500]}
            />
          )}
        </Pressable>
      </Box>

      <FlatList
        scrollEnabled={false}
        data={members}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        estateId={estateId}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  estateItemTitle: {
    flex: 2,
  },
});
