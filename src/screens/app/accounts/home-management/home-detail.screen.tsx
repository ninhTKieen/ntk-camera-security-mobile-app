import { RouteProp, useRoute } from '@react-navigation/native';
import SubLayout from '@src/components/sub-layout';
import { ESTATE_MAP } from '@src/configs/constant';
import { i18nKeys } from '@src/configs/i18n';
import { THomeManagementStackParamList } from '@src/configs/routes/account.route';
import { EEstateType } from '@src/features/estates/estate.model';
import estateService from '@src/features/estates/estate.service';
import { useQuery } from '@tanstack/react-query';
import { Box, ScrollView, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

import { HomeMembers } from './components/home-members';

const HomeDetailScreen = () => {
  const route =
    useRoute<RouteProp<THomeManagementStackParamList, 'HomeDetail'>>();
  const { homeName, homeId } = route.params;

  const { t } = useTranslation();

  const homeDetailQuery = useQuery({
    queryKey: ['estates/getEstate', { estateId: homeId }],
    queryFn: () => estateService.getDetail(homeId),
  });

  return (
    <SubLayout title={homeName}>
      <ScrollView showsVerticalScrollIndicator={false} flex={1} bg="white">
        <Box m={4} backgroundColor="white" shadow={2} borderRadius={15}>
          <FastImage
            source={{
              uri: homeDetailQuery.data?.imageUrls?.[0],
            }}
            style={{ width: '100%', height: 200, borderRadius: 15 }}
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

        <HomeMembers
          members={homeDetailQuery.data?.members}
          estateId={homeId}
        />
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
