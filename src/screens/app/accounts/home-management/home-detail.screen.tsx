import { RouteProp, useRoute } from '@react-navigation/native';
import SubLayout from '@src/components/sub-layout';
import { ESTATE_MAP } from '@src/configs/constant';
import { i18nKeys } from '@src/configs/i18n';
import { THomeManagementStackParamList } from '@src/configs/routes/account.route';
import {
  EEstateRole,
  EEstateType,
  TEstateMember,
} from '@src/features/estates/estate.model';
import estateService from '@src/features/estates/estate.service';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Box, ScrollView, Text } from 'native-base';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const HomeDetailScreen = () => {
  const route =
    useRoute<RouteProp<THomeManagementStackParamList, 'HomeDetail'>>();
  const { homeName, homeId } = route.params;

  const { t } = useTranslation();

  const homeDetailQuery = useQuery({
    queryKey: ['estates/getEstate', { estateId: homeId }],
    queryFn: () => estateService.getDetail(homeId),
  });

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

  const renderMemberItem = ({ item }: { item: TEstateMember }) => {
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
        <Box ml={2}>
          <Text flex={1} fontWeight="bold" fontSize="md" numberOfLines={1}>
            {item.nickname}
          </Text>
          <Text style={styles.estateItemText}>{getMemberRole(item.role)}</Text>
        </Box>
      </Box>
    );
  };

  return (
    <SubLayout title={homeName}>
      <ScrollView showsVerticalScrollIndicator={false} flex={1} bg="white">
        <Box>
          <FastImage
            source={{
              uri: homeDetailQuery.data?.imageUrls?.[0],
            }}
            style={{ width: '100%', height: 200 }}
            defaultSource={require('@src/assets/images/not-found.png')}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </Box>

        <Box m={4} p={2} shadow={2} borderRadius={15} bg="white">
          <Box style={styles.estateItem}>
            <Text
              fontSize="md"
              fontWeight="bold"
              style={styles.estateItemTitle}
            >
              {t(i18nKeys.estates.name)}
            </Text>
            <Text style={styles.estateItemText}>
              {homeDetailQuery.data?.name}
            </Text>
          </Box>

          <Box style={styles.estateItem}>
            <Text
              fontSize="md"
              fontWeight="bold"
              style={styles.estateItemTitle}
            >
              {t(i18nKeys.estates.type.title)}
            </Text>
            <Text style={styles.estateItemText}>
              {t(
                ESTATE_MAP.get(homeDetailQuery.data?.type as EEstateType) || '',
              )}
            </Text>
          </Box>

          <Box style={styles.estateItem}>
            <Text
              fontSize="md"
              fontWeight="bold"
              style={styles.estateItemTitle}
            >
              {t(i18nKeys.estates.address)}
            </Text>
            <Text style={styles.estateItemText}>
              {homeDetailQuery.data?.address}
            </Text>
          </Box>

          <Box style={styles.estateItem}>
            <Text
              fontSize="md"
              fontWeight="bold"
              style={styles.estateItemTitle}
            >
              {t(i18nKeys.estates.description)}
            </Text>
            <Text style={styles.estateItemText}>
              {homeDetailQuery.data?.description}
            </Text>
          </Box>
        </Box>

        <Box m={4} p={2} shadow={2} borderRadius={15} bg="white">
          <Text
            fontSize="md"
            fontWeight="bold"
            style={[styles.estateItemTitle, { padding: 10 }]}
          >
            {t(i18nKeys.estates.members)}
          </Text>

          <FlatList
            scrollEnabled={false}
            data={homeDetailQuery.data?.members}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMemberItem}
          />
        </Box>
      </ScrollView>
    </SubLayout>
  );
};

const styles = StyleSheet.create({
  estateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  estateItemTitle: {
    flex: 2,
  },
  estateItemText: {
    flex: 5,
  },
});

export default HomeDetailScreen;
