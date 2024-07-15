import IconGeneral from '@src/components/icon-general';
import { i18nKeys } from '@src/configs/i18n';
import authService from '@src/features/auth/auth.service';
import { useAuthStore } from '@src/features/auth/auth.store';
import { useAuth } from '@src/hooks/use-auth.hook';
import { useMutation } from '@tanstack/react-query';
import { Avatar, Box, Button, Pressable, ScrollView, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

const MainSettingsScreen = () => {
  const { t } = useTranslation();
  const { authQuery } = useAuth();
  const { logout } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
    },
    onError: () => {
      logout();
    },
  });

  return (
    <Box bg="white" style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MainSettingsScreen;
