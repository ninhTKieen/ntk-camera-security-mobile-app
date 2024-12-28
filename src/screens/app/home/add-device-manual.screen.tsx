import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { CommonOutlineInput } from '@src/components/common-outline-input';
import PhotoModal from '@src/components/photo-modal';
import SubLayout from '@src/components/sub-layout';
import { SvgIcon } from '@src/components/svg-icons';
import { HOME_ID_KEY } from '@src/configs/constant';
import { i18nKeys } from '@src/configs/i18n';
import { storage } from '@src/configs/mmkv.storage';
import { TLocalImgProps } from '@src/features/common/common.model';
import { TCreateDevice } from '@src/features/devices/device.model';
import deviceService from '@src/features/devices/device.service';
import { useApp } from '@src/hooks/use-app.hook';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Image,
  Pressable,
  ScrollView,
  useTheme,
} from 'native-base';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet } from 'react-native';
import * as yup from 'yup';

const { width } = Dimensions.get('window');

const AddDeviceManualScreen = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { toastMessage } = useApp();
  const navigation = useNavigation();

  const theme = useTheme();

  const [openPhotoModal, setOpenPhotoModal] = useState(false);

  const homeId = Number(storage.getString(HOME_ID_KEY));

  const createDeviceMutation = useMutation({
    mutationFn: (data: TCreateDevice) => {
      return deviceService.create(data);
    },
    onSuccess: () => {
      toastMessage({
        type: 'success',
        title: t(i18nKeys.common.success),
        description: t(i18nKeys.devices.createSuccess),
      });

      navigation.goBack();

      queryClient.invalidateQueries({
        queryKey: ['estates/getEstate', { estateId: homeId }],
        type: 'all',
      });
    },
    onError: () => {
      toastMessage({
        type: 'error',
        title: t(i18nKeys.common.error),
        description: t(i18nKeys.devices.createError),
      });
    },
  });

  const schema = yup.object().shape({
    name: yup.string().required(t(i18nKeys.validation.required)),
    streamLink: yup.string().required(t(i18nKeys.validation.required)),
    estateId: yup.number().required(t(i18nKeys.validation.required)),
    areaId: yup.number().optional(),
    description: yup.string().optional(),
    rtsp: yup.string().optional(),
    model: yup.string().optional(),
    serial: yup.string().optional(),
    brand: yup.string().optional(),
    mac: yup.string().optional(),
  });

  const {
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TCreateDevice>({
    resolver: yupResolver(schema),
    defaultValues: {
      estateId: homeId,
    },
  });

  const setFormValue = useCallback(
    (key: keyof TCreateDevice, value: any) => {
      setValue(key, value, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const onSubmit = (data: TCreateDevice) => {
    createDeviceMutation.mutate(data);
  };

  return (
    <SubLayout title={t(i18nKeys.devices.create)}>
      <Box bg="white" flex={1} p={2}>
        <ScrollView
          flex={1}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Pressable alignSelf="center" onPress={() => setOpenPhotoModal(true)}>
            {({ isPressed }) => (
              <>
                {watch('imageUrl') ? (
                  <Box style={styles.imageLocalContainer} shadow={2}>
                    <Image
                      source={{ uri: watch('imageUrl').uri }}
                      style={styles.imageLocalContainer}
                      alt="face-recognition"
                      borderRadius="full"
                    />
                  </Box>
                ) : (
                  <Box
                    borderWidth={1}
                    borderColor={errors.imageUrl ? 'red.700' : 'gray.300'}
                    borderRadius="full"
                    borderStyle="dashed"
                    opacity={isPressed ? 0.5 : 1}
                    style={styles.imageUrlContainer}
                  >
                    <SvgIcon
                      name="camera"
                      width={60}
                      height={60}
                      color={theme.colors.primary[700]}
                    />

                    <Button
                      m={2}
                      onPress={() => {
                        setOpenPhotoModal(true);
                      }}
                    >
                      {t(i18nKeys.devices.addImage)}
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Pressable>

          <CommonOutlineInput
            label={t(i18nKeys.devices.name)}
            value={watch('name')}
            onChangeText={(text) => setFormValue('name', text)}
          />

          <CommonOutlineInput
            label={t(i18nKeys.devices.networkStream)}
            value={watch('streamLink')}
            onChangeText={(text) => setFormValue('streamLink', text)}
          />

          <CommonOutlineInput
            label={t(i18nKeys.devices.description)}
            value={watch('description')}
            onChangeText={(text) => setFormValue('description', text)}
            isDescription
          />

          <CommonOutlineInput
            label={t(i18nKeys.devices.model)}
            value={watch('model')}
            onChangeText={(text) => setFormValue('model', text)}
          />

          <CommonOutlineInput
            label={t(i18nKeys.devices.brand)}
            value={watch('brand')}
            onChangeText={(text) => setFormValue('brand', text)}
          />

          <Button
            style={{ marginTop: 'auto' }}
            onPress={handleSubmit(onSubmit)}
            isLoading={createDeviceMutation.isPending}
            isDisabled={createDeviceMutation.isPending}
          >
            {t(i18nKeys.devices.create)}
          </Button>

          <PhotoModal
            isOpen={openPhotoModal}
            onClose={() => setOpenPhotoModal(false)}
            setValues={(values: TLocalImgProps) => {
              setValue('imageUrl', values);
            }}
            cropping
          />
        </ScrollView>
      </Box>
    </SubLayout>
  );
};

const styles = StyleSheet.create({
  imageUrlContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    width: width * 0.5,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLocalContainer: {
    width: width * 0.5,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddDeviceManualScreen;
