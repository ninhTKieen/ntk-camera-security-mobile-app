import { yupResolver } from '@hookform/resolvers/yup';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CommonOutlineInput } from '@src/components/common-outline-input';
import PhotoModal from '@src/components/photo-modal';
import SubLayout from '@src/components/sub-layout';
import { HOME_ID_KEY } from '@src/configs/constant';
import { i18nKeys } from '@src/configs/i18n';
import { storage } from '@src/configs/mmkv.storage';
import { THomeStackParamList } from '@src/configs/routes/home.route';
import { useAppStore } from '@src/features/common/app.store';
import { TLocalImgProps } from '@src/features/common/common.model';
import { TUpdateDevice } from '@src/features/devices/device.model';
import deviceService from '@src/features/devices/device.service';
import { EEstateRole } from '@src/features/estates/estate.model';
import { useEstateStore } from '@src/features/estates/estate.store';
import { useApp } from '@src/hooks/use-app.hook';
import { isObjectDiff } from '@src/utils/common.util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Button, Image, Pressable, Row, ScrollView } from 'native-base';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet } from 'react-native';
import * as yup from 'yup';

const { width } = Dimensions.get('window');

const EditDeviceScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<THomeStackParamList, 'EditDevice'>>();
  const route = useRoute<RouteProp<THomeStackParamList, 'EditDevice'>>();

  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { toastMessage } = useApp();

  const { setHideBottomTabBar } = useAppStore();
  const { homeRole } = useEstateStore();
  const isFocused = useIsFocused();

  const [openPhotoModal, setOpenPhotoModal] = useState(false);

  const deviceId = route.params.deviceId;

  const homeId = Number(storage.getString(HOME_ID_KEY));

  const getDeviceQuery = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => deviceService.getDetail(deviceId),
    enabled: !!deviceId,
  });

  const updateDeviceMutation = useMutation({
    mutationFn: (data: TUpdateDevice) => {
      return deviceService.update(deviceId, data);
    },
    onSuccess: () => {
      toastMessage({
        type: 'success',
        title: t(i18nKeys.common.success),
        description: t(i18nKeys.devices.updateSuccess),
      });

      navigation.navigate('Home');

      queryClient.invalidateQueries({
        queryKey: ['estates/getEstate', { estateId: homeId }],
        type: 'all',
      });
      getDeviceQuery.refetch();
    },
    onError: () => {
      toastMessage({
        type: 'error',
        title: t(i18nKeys.common.error),
        description: t(i18nKeys.devices.updateError),
      });
    },
  });

  const deleteDeviceMutation = useMutation({
    mutationFn: () => deviceService.delete(deviceId),
    onSuccess: () => {
      toastMessage({
        type: 'success',
        title: t(i18nKeys.common.success),
        description: t(i18nKeys.devices.deleteSuccess),
      });

      navigation.navigate('Home');

      queryClient.invalidateQueries({
        queryKey: ['estates/getEstate', { estateId: homeId }],
        type: 'all',
      });
      getDeviceQuery.refetch();
    },
    onError: () => {
      toastMessage({
        type: 'error',
        title: t(i18nKeys.common.error),
        description: t(i18nKeys.devices.deleteError),
      });
    },
  });

  const schema = yup.object().shape({
    name: yup.string(),
    streamLink: yup.string(),
    areaId: yup.number().nullable(),
    description: yup.string().nullable(),
    rtsp: yup.string().nullable(),
    model: yup.string().nullable(),
    serial: yup.string().nullable(),
    brand: yup.string().nullable(),
    mac: yup.string().nullable(),
  });

  const {
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TUpdateDevice>({
    resolver: yupResolver(schema),
    defaultValues: {},
    values: getDeviceQuery.data as TUpdateDevice,
  });

  const setFormValue = useCallback(
    (key: keyof TUpdateDevice, value: any) => {
      setValue(key, value, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const isDataChanged = useMemo(() => {
    const data = getDeviceQuery.data as TUpdateDevice;
    const formValue = watch();

    return isObjectDiff(data, formValue);
  }, [getDeviceQuery.data, watch]);

  const onSubmit = (data: TUpdateDevice) => {
    updateDeviceMutation.mutate(data);
  };

  const onError = (_errors: any) => {
    console.log(errors);
  };

  useEffect(() => {
    if (isFocused) {
      setHideBottomTabBar(true);
    }

    return () => {
      setHideBottomTabBar(false);
    };
  }, [isFocused, setHideBottomTabBar]);

  return (
    <SubLayout title={t(i18nKeys.devices.edit)}>
      <Box bg="white" flex={1} p={2}>
        <ScrollView
          flex={1}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {watch('imageUrl') && (
            <Pressable
              alignSelf="center"
              onPress={() => setOpenPhotoModal(true)}
            >
              {({ isPressed }) => (
                <>
                  <Box
                    opacity={isPressed ? 0.5 : 1}
                    style={styles.imageLocalContainer}
                    shadow={2}
                  >
                    <Image
                      source={{
                        uri: watch('imageUrl')?.uri
                          ? watch('imageUrl')?.uri
                          : watch('imageUrl'),
                      }}
                      style={styles.imageLocalContainer}
                      alt="face-recognition"
                      borderRadius="full"
                    />
                  </Box>
                </>
              )}
            </Pressable>
          )}

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
            value={watch('description') as string}
            onChangeText={(text) => setFormValue('description', text)}
            isDescription
          />

          <CommonOutlineInput
            label={t(i18nKeys.devices.model)}
            value={watch('model') as string}
            onChangeText={(text) => setFormValue('model', text)}
          />

          <CommonOutlineInput
            label={t(i18nKeys.devices.brand)}
            value={watch('brand') as string}
            onChangeText={(text) => setFormValue('brand', text)}
          />

          <Row mt="auto" space={4}>
            {homeRole === EEstateRole.OWNER && (
              <Button
                flex={1}
                onPress={() => deleteDeviceMutation.mutate()}
                colorScheme="error"
                variant="outline"
              >
                {t(i18nKeys.devices.delBtn)}
              </Button>
            )}

            <Button
              flex={1}
              onPress={handleSubmit(onSubmit, onError)}
              disabled={!isDataChanged}
            >
              {t(i18nKeys.devices.editBtn)}
            </Button>
          </Row>

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

export default EditDeviceScreen;
