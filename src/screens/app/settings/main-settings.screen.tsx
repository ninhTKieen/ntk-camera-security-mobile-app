import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import IconGeneral from '@src/components/icon-general';
import MainLayout from '@src/components/main-layout';
import { i18nKeys } from '@src/configs/i18n';
import { TSettingStackParamList } from '@src/configs/routes/setting.route';
import authService from '@src/features/auth/auth.service';
import { useAuthStore } from '@src/features/auth/auth.store';
import notificationServices from '@src/features/notifications/notification.service';
import { useAuth } from '@src/hooks/use-auth.hook';
import { useMutation } from '@tanstack/react-query';
import { Avatar, Box, Button, Pressable, ScrollView, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const MainSettingsScreen = () => {
  const { t } = useTranslation();
  const { authQuery } = useAuth();
  const { logout } = useAuthStore();
  const navigation =
    useNavigation<
      StackNavigationProp<TSettingStackParamList, 'MainSettings'>
    >();

  const deleteFcmToken = async () => {
    try {
      const deviceId = await DeviceInfo.getUniqueId();
      await notificationServices.deleteFcmToken(
        authQuery.data?.id as number,
        deviceId,
      );
    } catch (error) {
      console.log('Error Set Up Data', error);
    }
  };

  const logoutMutation = useMutation({
    mutationFn: () => deleteFcmToken(),
    onSuccess: () => {
      authService.logout();
      logout();
    },
    onError: () => {
      authService.logout();
      logout();
    },
  });

  return (
    <MainLayout title={t(i18nKeys.bottomTab.setting)}>
      <Box bg="white" style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => navigation.navigate('EditProfile')}>
            {({ isPressed }) => (
              <Box
                bg="white"
                shadow="3"
                flexDir="row"
                p={3}
                m={3}
                borderRadius={10}
                style={{
                  transform: [{ scale: isPressed ? 0.95 : 1 }],
                }}
              >
                <Avatar
                  source={{
                    uri: authQuery.data?.imageUrl,
                  }}
                  size="lg"
                >
                  {authQuery.data?.name?.[0]?.toUpperCase()}
                </Avatar>

                <Box mx={2} style={{ flex: 1 }}>
                  <Text fontSize="2xl" fontWeight="medium">
                    {authQuery.data?.name}
                  </Text>

                  <Text fontSize="sm" fontWeight="light">
                    @{authQuery.data?.username}
                  </Text>
                </Box>

                <Box justifyContent="center" alignItems="center">
                  <IconGeneral type="FontAwesome" name="edit" size={25} />
                </Box>
              </Box>
            )}
          </Pressable>
        </ScrollView>

        <Box
          style={{
            justifyContent: 'flex-end',
          }}
        >
          <Button
            m={2}
            onPress={() => {
              logoutMutation.mutate();
            }}
          >
            {t(i18nKeys.auth.logout)}
          </Button>
        </Box>
      </Box>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MainSettingsScreen;
