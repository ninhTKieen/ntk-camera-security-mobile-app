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
import { TCreateRecognizedFace } from '@src/features/recognized-faces/recognized-face.model';
import recognizedFaceService from '@src/features/recognized-faces/recognized-face.service';
import { useApp } from '@src/hooks/use-app.hook';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { Box, Button, Image, Pressable, useTheme } from 'native-base';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet } from 'react-native';
import * as yup from 'yup';

const { width } = Dimensions.get('window');

type TForm = TCreateRecognizedFace & {
  localImg: TLocalImgProps;
};

const AddRecognitionScreen = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const theme = useTheme();
  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const { toastMessage } = useApp();
  const navigation = useNavigation();

  const homeId = Number(storage.getString(HOME_ID_KEY));

  const schema = useMemo(
    () =>
      yup.object().shape({
        name: yup.string().required(t(i18nKeys.validation.required)),
        idCode: yup.string().required(t(i18nKeys.validation.required)),
        localImg: yup
          .object<TLocalImgProps>()
          .shape({
            uri: yup.string().required(t(i18nKeys.validation.required)),
            name: yup.string().required(t(i18nKeys.validation.required)),
            type: yup.string().required(t(i18nKeys.validation.required)),
            size: yup.number().required(t(i18nKeys.validation.required)),
            width: yup.number().required(t(i18nKeys.validation.required)),
            height: yup.number().required(t(i18nKeys.validation.required)),
          })
          .required(t(i18nKeys.validation.required)),
        estateId: yup.number().required(t(i18nKeys.validation.required)),
      }),
    [t],
  );

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TForm>({
    defaultValues: {
      estateId: homeId,
    },
    resolver: yupResolver(schema),
  });

  const setFormValue = (name: keyof TCreateRecognizedFace, value: string) => {
    setValue(name, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const createFace = useMutation({
    mutationFn: (data: TCreateRecognizedFace) => {
      return recognizedFaceService.create(data, homeId);
    },
    onSuccess: () => {
      toastMessage({
        type: 'success',
        title: t(i18nKeys.common.success),
        description: t(i18nKeys.recognition.addSuccess),
      });
      navigation.goBack();
      queryClient.refetchQueries({
        queryKey: ['devices/getFaceRecognitionList', { estateId: homeId }],
      });
    },
    onError: () => {
      toastMessage({
        type: 'error',
        title: t(i18nKeys.common.error),
        description: t(i18nKeys.recognition.addError),
      });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: (data: TForm) => {
      return recognizedFaceService.uploadKnownFace(
        {
          image: data.localImg as unknown as File,
          idCode: data.idCode,
        },
        data.estateId,
      );
    },
    onSuccess: (res, variables) => {
      const rest = _.omit(variables, 'localImg');
      rest.imageUrl = res.filePath;
      createFace.mutate(rest);
    },
    onError: () => {
      toastMessage({
        type: 'error',
        title: t(i18nKeys.common.error),
        description: t(i18nKeys.recognition.addError),
      });
    },
  });

  const onSubmit = (data: TForm) => {
    if (data.localImg && data.name) {
      const originalExtension = data.localImg.name.split('.').pop();
      data.localImg.name = `${data.idCode}.${originalExtension}`;
    }

    uploadImageMutation.mutate(data);
  };

  return (
    <SubLayout title={t(i18nKeys.recognition.add)}>
      <Box flex={1} bg="white" p={4}>
        <Pressable alignSelf="center" onPress={() => setOpenPhotoModal(true)}>
          {({ isPressed }) => (
            <>
              {watch('localImg') ? (
                <Box style={styles.faceContainer} shadow={2}>
                  <Image
                    source={{ uri: watch('localImg').uri }}
                    style={styles.faceContainer}
                    alt="face-recognition"
                    borderRadius="full"
                  />
                </Box>
              ) : (
                <Box
                  borderWidth={1}
                  borderColor={errors.localImg ? 'red.700' : 'gray.300'}
                  borderRadius="full"
                  borderStyle="dashed"
                  opacity={isPressed ? 0.5 : 1}
                  style={styles.faceRecognitionContainer}
                >
                  <SvgIcon
                    name="face-recognition"
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
                    {t(i18nKeys.recognition.add)}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Pressable>

        <CommonOutlineInput
          label={t(i18nKeys.recognition.name)}
          value={watch('name')}
          onChangeText={(text) => setFormValue('name', text)}
          isRequired
          errMessage={errors.name?.message}
        />

        <CommonOutlineInput
          label={t(i18nKeys.recognition.idCode)}
          value={watch('idCode')}
          onChangeText={(text) => setFormValue('idCode', text)}
          isRequired
          errMessage={errors.idCode?.message}
        />

        <Button style={{ marginTop: 'auto' }} onPress={handleSubmit(onSubmit)}>
          {t(i18nKeys.common.save)}
        </Button>

        <PhotoModal
          isOpen={openPhotoModal}
          onClose={() => setOpenPhotoModal(false)}
          setValues={(values: TLocalImgProps) => {
            setValue('localImg', values);
          }}
          cropping
        />
      </Box>
    </SubLayout>
  );
};

const styles = StyleSheet.create({
  faceRecognitionContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    width: width * 0.5,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceContainer: {
    width: width * 0.5,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddRecognitionScreen;
