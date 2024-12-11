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
import { useMutation } from '@tanstack/react-query';
import _ from 'lodash';
import { Box, Button, Image, Pressable, useTheme } from 'native-base';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const AddRecognitionScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const { toastMessage } = useApp();

  const homeId = Number(storage.getString(HOME_ID_KEY));

  const { watch, setValue } = useForm<
    TCreateRecognizedFace & {
      imageUrl: TLocalImgProps;
    }
  >({
    defaultValues: {
      estateId: homeId,
      faceEncoding: 'Face Encoding',
    },
  });

  const setFormValue = (name: keyof TCreateRecognizedFace, value: string) => {
    setValue(name, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const createFace = useMutation({
    mutationFn: (data: TCreateRecognizedFace) => {
      return recognizedFaceService.createRecognizedFace(data, homeId);
    },
    onSuccess: () => {
      toastMessage({
        type: 'success',
        title: t(i18nKeys.common.success),
        description: t(i18nKeys.recognition.addSuccess),
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
    mutationFn: (
      data: TCreateRecognizedFace & {
        imageUrl: TLocalImgProps;
      },
    ) => {
      return recognizedFaceService.uploadKnownFace(
        data.imageUrl as any,
        data.estateId,
      );
    },
    onSuccess: (_res, variables) => {
      const rest = _.omit(variables, 'imageUrl');
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

  const onSubmit = () => {
    const data = watch();
    if (data.imageUrl && data.name) {
      const originalExtension = data.imageUrl.name.split('.').pop(); // Extract file extension
      data.imageUrl.name = `${data.name}.${originalExtension}`; // Construct new name
    }

    uploadImageMutation.mutate(data);
  };

  return (
    <SubLayout title={t(i18nKeys.recognition.add)}>
      <Box flex={1} bg="white" p={4}>
        <Pressable alignSelf="center" onPress={() => setOpenPhotoModal(true)}>
          {({ isPressed }) => (
            <>
              {watch('imageUrl') ? (
                <Image
                  source={{ uri: watch('imageUrl').uri }}
                  style={styles.faceRecognitionContainer}
                  alt="face-recognition"
                  borderRadius="full"
                />
              ) : (
                <Box
                  borderWidth={1}
                  borderColor="primary.700"
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
        />

        <Button style={{ marginTop: 'auto' }} onPress={onSubmit}>
          {t(i18nKeys.common.save)}
        </Button>

        <PhotoModal
          isOpen={openPhotoModal}
          onClose={() => setOpenPhotoModal(false)}
          setValues={(values: TLocalImgProps) => {
            setValue('imageUrl', values);
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
});

export default AddRecognitionScreen;
