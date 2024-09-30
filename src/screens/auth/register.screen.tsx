import { yupResolver } from '@hookform/resolvers/yup';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { i18nKeys } from '@src/configs/i18n';
import { TAuthStackParamList } from '@src/configs/routes/auth.route';
import { EGender, IRegisterPayload } from '@src/features/auth/auth.model';
import authService from '@src/features/auth/auth.service';
import { useAuthStore } from '@src/features/auth/auth.store';
import { useAppStore } from '@src/features/common/app.store';
import {
  EWebAppType,
  TSendTokenData,
} from '@src/features/notifications/notification.model';
import notificationServices from '@src/features/notifications/notification.service';
import { useMutation } from '@tanstack/react-query';
import { Box, Button, Input, Pressable, Radio, Stack, Text } from 'native-base';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import Toast from 'react-native-toast-message';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import * as yup from 'yup';

const RegisterScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<TAuthStackParamList, 'Register'>>();
  const { t } = useTranslation();
  const [show, isShow] = useState(false);
  const { login, logout } = useAuthStore();
  const { setLoading } = useAppStore();

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

  const registerMutation = useMutation({
    mutationFn: (data: IRegisterPayload) => {
      setLoading(true);
      return authService.register(data);
    },
    onSuccess: (res) => {
      login(res);
      setLoading(false);
      sendFcmToken.mutate();
    },
    onError: (error) => {
      console.log('error', error);
      setLoading(false);
      logout();
      // Toast.show({
      //   text1: t(i18nKeys.auth.loginFail),
      //   type: 'error',
      //   position: 'top',
      // });
    },
  });

  const registerSchema = useMemo(
    () =>
      yup.object().shape({
        email: yup
          .string()
          .required(t(i18nKeys.validation.required))
          .email(t(i18nKeys.validation.invalidEmail))
          .trim(),
        password: yup.string().required(t(i18nKeys.validation.required)),
        name: yup.string().required(t(i18nKeys.validation.required)),
        username: yup.string().required(t(i18nKeys.validation.required)),
      }),
    [t],
  );

  const form = useForm<IRegisterPayload>({
    resolver: yupResolver(registerSchema),
    mode: 'all',
  });
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (data: IRegisterPayload) => {
    registerMutation.mutate(data);
  };

  const textInputs = [
    {
      label: t(i18nKeys.auth.email),
      value: watch('email'),
      placeholder: t(i18nKeys.auth.email),
      onChangeText: (text: string) => setValue('email', text),
      variant: 'filled',
      error: errors.email,
    },
    {
      label: t(i18nKeys.auth.name),
      value: watch('name'),
      placeholder: t(i18nKeys.auth.name),
      onChangeText: (text: string) => setValue('name', text),
      variant: 'outline',
      error: errors.name,
    },
    {
      label: t(i18nKeys.auth.username),
      value: watch('username'),
      placeholder: t(i18nKeys.auth.username),
      onChangeText: (text: string) => setValue('username', text),
      variant: 'outline',
      error: errors.username,
    },
    {
      label: t(i18nKeys.auth.password),
      value: watch('password'),
      placeholder: t(i18nKeys.auth.password),
      onChangeText: (text: string) => setValue('password', text),
      variant: 'outline',
      isPassword: true,
      error: errors.password,
    },
  ];

  return (
    <Box style={styles.container}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Box style={{ alignItems: 'center', marginTop: 60 }}>
          <Text
            fontSize="2xl"
            style={{
              fontWeight: '600',
            }}
          >
            {t(i18nKeys.auth.register)}
          </Text>
        </Box>

        <Box style={{ padding: 20 }}>
          {textInputs.map((input, index) => (
            <React.Fragment key={index}>
              <Text fontSize="xl" style={{ fontWeight: '500' }}>
                {input.label}
              </Text>
              <Input
                variant="outline"
                size="2xl"
                placeholder={input.placeholder}
                value={input.value}
                onChangeText={(text) => {
                  input.onChangeText && input.onChangeText(text);
                }}
                type={!input.isPassword ? 'text' : show ? 'text' : 'password'}
                InputRightElement={
                  input.isPassword ? (
                    <Pressable mx={2} onPress={() => isShow(!show)}>
                      <MaterialIcon
                        name={show ? 'visibility' : 'visibility-off'}
                        size={24}
                        color="#000"
                      />
                    </Pressable>
                  ) : (
                    <></>
                  )
                }
              />
              {errors.email && (
                <Text fontSize="sm" mt={2} color="red.500">
                  {errors.email.message}
                </Text>
              )}

              <View style={{ marginTop: 20 }} />
            </React.Fragment>
          ))}

          <Box>
            <Text fontSize="xl" fontWeight="medium" mb={2}>
              {t(i18nKeys.auth.gender)}
            </Text>
            <Radio.Group
              name="user-gender"
              onChange={(value) => setValue('gender', value as EGender)}
            >
              <Stack
                direction={{
                  base: 'row',
                }}
                alignItems={{
                  base: 'flex-start',
                  md: 'center',
                }}
                space={4}
                w="75%"
                maxW="300px"
              >
                <Radio value={EGender.MALE} size="md">
                  {t(i18nKeys.common.male)}
                </Radio>
                <Radio value={EGender.FEMALE} size="md">
                  {t(i18nKeys.common.female)}
                </Radio>
              </Stack>
            </Radio.Group>
          </Box>

          <Box>
            <Text style={{ marginTop: 20 }}>
              {t(i18nKeys.auth.alreadyHaveAccount)}{' '}
              <Text
                color="primary.500"
                fontWeight="medium"
                onPress={() => navigation.navigate('Login')}
              >
                {t(i18nKeys.auth.login)}
              </Text>
            </Text>
          </Box>

          <Button
            style={{ marginTop: 20 }}
            size="lg"
            onPress={handleSubmit(onSubmit)}
            colorScheme="primary"
          >
            {t(i18nKeys.auth.register)}
          </Button>
        </Box>
      </KeyboardAwareScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});

export default RegisterScreen;
