import IconGeneral from '@src/components/icon-general';
import PhotoModal from '@src/components/photo-modal';
import SubLayout from '@src/components/sub-layout';
import { i18nKeys } from '@src/configs/i18n';
import { EGender, IUpdateUser } from '@src/features/auth/auth.model';
import authService from '@src/features/auth/auth.service';
import { useAppStore } from '@src/features/common/app.store';
import { TLocalImgProps } from '@src/features/common/common.model';
import { useApp } from '@src/hooks/use-app.hook';
import { useAuth } from '@src/hooks/use-auth.hook';
import { useMutation } from '@tanstack/react-query';
import { Avatar, Box, Button, Input, Radio, Stack, Text } from 'native-base';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const EditProfileScreen = () => {
  const { t } = useTranslation();
  const { authQuery } = useAuth();
  const { toastMessage } = useApp();
  const { watch, setValue, handleSubmit } = useForm<IUpdateUser>({
    defaultValues: {
      name: authQuery.data?.name,
      phoneNumber: authQuery.data?.phoneNumber,
      imageUrl: authQuery.data?.imageUrl,
      imageUrlId: authQuery.data?.imageUrlId,
      gender: authQuery.data?.gender,
      dateOfBirth: authQuery.data?.dateOfBirth,
    },
    mode: 'onBlur',
  });
  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const { setLoading } = useAppStore();

  const textInputs = [
    {
      label: t(i18nKeys.auth.email),
      value: authQuery.data?.email,
      placeholder: t(i18nKeys.auth.email),
      isDisabled: true,
      variant: 'filled',
    },
    {
      label: t(i18nKeys.auth.name),
      value: watch('name'),
      placeholder: t(i18nKeys.auth.name),
      onChangeText: (text: string) => setValue('name', text),
      variant: 'outline',
    },
    {
      label: t(i18nKeys.auth.phoneNumber),
      value: watch('phoneNumber'),
      placeholder: t(i18nKeys.auth.phoneNumber),
      onChangeText: (text: string) => setValue('phoneNumber', text),
      variant: 'outline',
    },
  ];

  const updateUserMutation = useMutation({
    mutationFn: (data: IUpdateUser) => {
      setLoading(true);
      return authService.updateUser(authQuery.data?.id as number, data);
    },
    onSuccess: () => {
      authQuery.refetch();
      toastMessage({
        type: 'success',
        title: t(i18nKeys.common.success),
      });
      setLoading(false);
    },
    onError: (error) => {
      console.log('[UPDATE USER] Error', error);
      toastMessage({
        type: 'error',
        title: t(i18nKeys.common.error),
      });
      setLoading(false);
    },
  });

  const onSubmit = (data: IUpdateUser) => {
    updateUserMutation.mutate(data);
  };

  return (
    <SubLayout title={t(i18nKeys.account.editProfile)}>
      <Box bg="white" flex={1}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={{
              position: 'relative',
              alignSelf: 'center',
              margin: 16,
            }}
            onPress={() => setOpenPhotoModal(true)}
          >
            <Avatar
              source={{
                uri: watch('imageUrl')
                  ? typeof watch('imageUrl') === 'string'
                    ? watch('imageUrl')
                    : watch('imageUrl').uri
                  : authQuery.data?.imageUrl,
              }}
              size="2xl"
              borderWidth={5}
              borderColor="gray.200"
            >
              {authQuery.data?.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box
              position="absolute"
              bottom={0}
              right={2}
              bg="white"
              borderRadius="full"
              borderWidth={2}
              borderColor="gray.100"
              p={1}
            >
              <IconGeneral type="FontAwesome5" name="camera-retro" size={20} />
            </Box>
          </TouchableOpacity>

          <Box p={4}>
            {textInputs.map((input, index) => (
              <Box key={index} mt={3}>
                <Text fontSize="xl" fontWeight="medium">
                  {input.label}
                </Text>
                <Input
                  isDisabled={input.isDisabled}
                  variant={input.variant}
                  size="2xl"
                  placeholder={input.placeholder}
                  value={input.value}
                  onChangeText={(text) => {
                    input.onChangeText && input.onChangeText(text);
                  }}
                />
              </Box>
            ))}
          </Box>

          <Box px={4}>
            <Text fontSize="xl" fontWeight="medium" mb={2}>
              {t(i18nKeys.auth.gender)}
            </Text>
            <Radio.Group
              name="user-gender"
              defaultValue={authQuery.data?.gender}
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

          <Box
            style={{
              justifyContent: 'flex-end',
            }}
          >
            <Button m={2} onPress={handleSubmit(onSubmit)}>
              {t(i18nKeys.common.update)}
            </Button>
          </Box>
        </KeyboardAwareScrollView>
      </Box>

      <PhotoModal
        isOpen={openPhotoModal}
        onClose={() => setOpenPhotoModal(false)}
        setValues={(values: TLocalImgProps) => {
          setValue('imageUrl', values);
        }}
      />
    </SubLayout>
  );
};

export default EditProfileScreen;
