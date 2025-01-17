import { yupResolver } from '@hookform/resolvers/yup';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { i18nKeys } from '@src/configs/i18n';
import { TAuthStackParamList } from '@src/configs/routes/auth.route';
import { ILoginPayload } from '@src/features/auth/auth.model';
import authService from '@src/features/auth/auth.service';
import { useAuthStore } from '@src/features/auth/auth.store';
import { useAppStore } from '@src/features/common/app.store';
import {
  EWebAppType,
  TSendTokenData,
} from '@src/features/notifications/notification.model';
import notificationServices from '@src/features/notifications/notification.service';
import { useApp } from '@src/hooks/use-app.hook';
import { useMutation } from '@tanstack/react-query';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Image,
  Input,
  Pressable,
  Stack,
  Text,
} from 'native-base';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import * as yup from 'yup';

const LoginScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<TAuthStackParamList, 'Login'>>();
  const { t } = useTranslation();
  const [show, isShow] = useState(false);
  const { login, logout } = useAuthStore();
  const { setLoading } = useAppStore();
  const { toastMessage } = useApp();

  const setUpData = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();
      const deviceId = await DeviceInfo.getUniqueId();
      console.log('FCM Token', fcmToken, 'Device ID', deviceId);
      const data: TSendTokenData = {
        token: fcmToken,
        deviceId,
        webAppType: EWebAppType.MOBILE,
      };
      await notificationServices.sendFcmTokenToServer(data);
    } catch (error) {
      console.log('Error Set Up Data', error);
    }
  };

  const sendFcmToken = useMutation({
    mutationFn: () => setUpData(),
    onSuccess: () => {
      console.log('[FCM] Send token success');
    },
    onError: (error) => {
      console.log('[FCM] Send token error', error);
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: ILoginPayload) => {
      setLoading(true);
      return authService.login(data);
    },
    onSuccess: (res) => {
      login(res);
      setLoading(false);
      sendFcmToken.mutate();
      toastMessage({
        type: 'success',
        title: t(i18nKeys.auth.login),
        description: t(i18nKeys.auth.loginSuccess),
      });
    },
    onError: (error) => {
      console.log('error', error);
      logout();
      setLoading(false);
      toastMessage({
        type: 'error',
        title: t(i18nKeys.auth.loginFail),
        description: t(i18nKeys.auth.loginFailDesc),
      });
    },
  });

  const loginSchema = useMemo(
    () =>
      yup.object().shape({
        email: yup
          .string()
          .required(t(i18nKeys.validation.required))
          .email(t(i18nKeys.validation.invalidEmail))
          .trim(),
        password: yup.string().required(t(i18nKeys.validation.required)),
        isRemember: yup.boolean(),
      }),
    [t],
  );

  const form = useForm<ILoginPayload>({
    resolver: yupResolver(loginSchema),
    mode: 'all',
  });
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (data: ILoginPayload) => {
    loginMutation.mutate(data);
  };

  return (
    <Box style={styles.container}>
      <Box style={{ alignItems: 'center', marginTop: 60 }}>
        <Text
          fontSize="2xl"
          style={{
            fontWeight: '600',
          }}
        >
          {t(i18nKeys.auth.login)}
        </Text>
      </Box>

      <Image
        source={require('@src/assets/images/ntk_cam_logo.webp')}
        alt="Logo"
        width={90}
        height={90}
        style={{ alignSelf: 'center', marginTop: 20 }}
      />

      <Box style={{ padding: 20 }}>
        <Text fontSize="xl" style={{ fontWeight: '500' }}>
          {t(i18nKeys.auth.email)}
        </Text>
        <Input
          variant="outline"
          size="2xl"
          placeholder={t(i18nKeys.auth.email)}
          value={watch('email')}
          onChangeText={(text) => setValue('email', text)}
        />
        {errors.email && (
          <Text fontSize="sm" mt={2} color="red.500">
            {errors.email.message}
          </Text>
        )}

        <View style={{ marginTop: 20 }} />
        <Text fontSize="xl" style={{ fontWeight: '500' }}>
          {t(i18nKeys.auth.password)}
        </Text>
        <Input
          variant="outline"
          size="2xl"
          placeholder={t(i18nKeys.auth.password)}
          type={show ? 'text' : 'password'}
          value={watch('password')}
          onChangeText={(text) => setValue('password', text)}
          InputRightElement={
            <Pressable mx={2} onPress={() => isShow(!show)}>
              <MaterialIcon
                name={show ? 'visibility' : 'visibility-off'}
                size={24}
                color="#000"
              />
            </Pressable>
          }
        />
        {errors.password && (
          <Text fontSize="sm" mt={2} color="red.500">
            {errors.password.message}
          </Text>
        )}

        <Stack
          mt={4}
          direction={{
            base: 'row',
            md: 'row',
          }}
          justifyContent="space-between"
        >
          <Pressable
            flexDir="row"
            alignItems="center"
            onPress={() => {
              setValue('isRemember', !watch('isRemember'));
            }}
          >
            <Checkbox
              aria-label="Remember me"
              value={String(watch('isRemember'))}
              isChecked={watch('isRemember')}
              onChange={(value) => setValue('isRemember', value)}
            />

            <Text ml="1.5">{t(i18nKeys.auth.rememberMe)}</Text>
          </Pressable>

          <Pressable>
            <Text color="primary.500" fontWeight="medium">
              {t(i18nKeys.auth.forgotPassword)}
            </Text>
          </Pressable>
        </Stack>

        <Button
          style={{ marginTop: 20 }}
          size="lg"
          onPress={handleSubmit(onSubmit)}
          colorScheme="primary"
        >
          {t(i18nKeys.auth.login)}
        </Button>

        <Stack direction="row" my={6} alignItems="center">
          <Divider flex={1} />
          <Text mx={2}>{t(i18nKeys.common.or)}</Text>
          <Divider flex={1} />
        </Stack>

        <Button
          size="lg"
          onPress={() => navigation.navigate('Register')}
          colorScheme="primary"
          variant="outline"
        >
          {t(i18nKeys.auth.register)}
        </Button>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});

export default LoginScreen;
