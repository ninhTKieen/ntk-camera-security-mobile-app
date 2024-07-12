import { yupResolver } from '@hookform/resolvers/yup';
import ReactNativeLogo from '@src/assets/react-native.svg';
import { i18nKeys } from '@src/configs/i18n';
import { ILoginPayload } from '@src/features/auth/auth.model';
import authService from '@src/features/auth/auth.service';
import { useAuthStore } from '@src/features/auth/auth.store';
import { useMutation } from '@tanstack/react-query';
import { Box, Button, Input, Pressable, Text } from 'native-base';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import * as yup from 'yup';

const LoginScreen = () => {
  const { t } = useTranslation();
  const [show, isShow] = useState(false);

  const { login, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: ILoginPayload) => authService.login(data),
    onSuccess: (res) => {
      login(res);
    },
    onError: () => {
      logout();
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
          {t(i18nKeys.auth.welcomeBack)}
        </Text>
        <Text style={{ fontSize: 16, marginTop: 5 }}>
          {t(i18nKeys.auth.loginTitle)}
        </Text>
      </Box>

      <ReactNativeLogo
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

        <Button
          style={{ marginTop: 20 }}
          size="lg"
          onPress={handleSubmit(onSubmit)}
          colorScheme="primary"
        >
          {t(i18nKeys.auth.login)}
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
