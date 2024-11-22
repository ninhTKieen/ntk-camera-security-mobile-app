import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { CommonOutlineInput } from '@src/components/common-outline-input';
import SubLayout from '@src/components/sub-layout';
import { HOME_ID_KEY } from '@src/configs/constant';
import { i18nKeys } from '@src/configs/i18n';
import { storage } from '@src/configs/mmkv.storage';
import { TCreateDevice } from '@src/features/devices/device.model';
import deviceService from '@src/features/devices/device.service';
import { useApp } from '@src/hooks/use-app.hook';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button } from 'native-base';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

const AddDeviceManualScreen = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { toastMessage } = useApp();
  const navigation = useNavigation();

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

  const { watch, handleSubmit, setValue } = useForm<TCreateDevice>({
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
    <SubLayout title={t(i18nKeys.devices.addManual)}>
      <Box bg="white" flex={1} p={2}>
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

        <Button style={{ marginTop: 'auto' }} onPress={handleSubmit(onSubmit)}>
          {t(i18nKeys.devices.create)}
        </Button>
      </Box>
    </SubLayout>
  );
};

export default AddDeviceManualScreen;
