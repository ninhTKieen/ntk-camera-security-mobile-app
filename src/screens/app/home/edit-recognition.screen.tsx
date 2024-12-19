import { yupResolver } from '@hookform/resolvers/yup';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { CommonOutlineInput } from '@src/components/common-outline-input';
import PhotoModal from '@src/components/photo-modal';
import SubLayout from '@src/components/sub-layout';
import { APP_API_ENDPOINT, HOME_ID_KEY } from '@src/configs/constant';
import { i18nKeys } from '@src/configs/i18n';
import { storage } from '@src/configs/mmkv.storage';
import { THomeStackParamList } from '@src/configs/routes/home.route';
import { TLocalImgProps } from '@src/features/common/common.model';
import { EEstateRole } from '@src/features/estates/estate.model';
import { useEstateStore } from '@src/features/estates/estate.store';
import { TUpdateRecognizedFace } from '@src/features/recognized-faces/recognized-face.model';
import recognizedFaceService from '@src/features/recognized-faces/recognized-face.service';
import { useApp } from '@src/hooks/use-app.hook';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { Box, Button, Image, Pressable, Row } from 'native-base';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet } from 'react-native';
import * as yup from 'yup';

const { width } = Dimensions.get('window');

type TForm = TUpdateRecognizedFace;

const EditRecognitionScreen = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const { toastMessage } = useApp();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<THomeStackParamList, 'EditRecognition'>>();

  const { homeRole } = useEstateStore();

  const { recognitionId } = route.params;

  const homeId = Number(storage.getString(HOME_ID_KEY));

  const recognitionQuery = useQuery({
    queryKey: ['estate/recognition', { homeId, recognitionId }],
    queryFn: () => recognizedFaceService.getOne(recognitionId, homeId),
  });

  const schema = useMemo(
    () =>
      yup.object().shape({
        name: yup.string().nullable(),
        description: yup.string().nullable(),
      }),
    [],
  );

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TForm>({
    resolver: yupResolver(schema),
    defaultValues: {},
    values: recognitionQuery.data as any,
  });

  const setFormValue = (name: keyof TUpdateRecognizedFace, value: string) => {
    setValue(name, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const deleteFace = useMutation({
    mutationFn: () => recognizedFaceService.delete(recognitionId, homeId),
    onSuccess: () => {
      toastMessage({
        type: 'success',
        title: t(i18nKeys.common.success),
        description: t(i18nKeys.recognition.deleteSuccess),
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
        description: t(i18nKeys.recognition.deleteError),
      });
    },
  });

  const updateFace = useMutation({
    mutationFn: (data: TUpdateRecognizedFace) => {
      return recognizedFaceService.update(
        data,
        homeId,
        recognitionQuery.data?.id as number,
      );
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
          image: data.imageUrl as unknown as File,
          idCode: recognitionQuery.data?.idCode as string,
        },
        homeId,
      );
    },
    onSuccess: (res, variables) => {
      const rest = _.omit(variables, 'localImg');
      rest.imageUrl = res.filePath;
      updateFace.mutate(rest);
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
    const idCode = recognitionQuery.data?.idCode as string;
    if (typeof data.imageUrl !== 'string' && data.name) {
      const originalExtension = data.imageUrl.name.split('.').pop();
      data.imageUrl.name = `${idCode}.${originalExtension}`;
      uploadImageMutation.mutate(data);
    } else {
      updateFace.mutate(data);
    }
  };

  return (
    <SubLayout title={t(i18nKeys.recognition.add)}>
      <Box flex={1} bg="white" p={4}>
        {watch('imageUrl') && (
          <Pressable alignSelf="center" onPress={() => setOpenPhotoModal(true)}>
            {({ isPressed }) => (
              <>
                <Box
                  opacity={isPressed ? 0.5 : 1}
                  style={styles.faceContainer}
                  shadow={2}
                >
                  <Image
                    source={{
                      uri: watch('imageUrl')?.uri
                        ? watch('imageUrl')?.uri
                        : `${APP_API_ENDPOINT}${watch('imageUrl')}`,
                    }}
                    style={styles.faceContainer}
                    alt="face-recognition"
                    borderRadius="full"
                  />
                </Box>
              </>
            )}
          </Pressable>
        )}

        <CommonOutlineInput
          label={t(i18nKeys.recognition.name)}
          value={watch('name') as string}
          onChangeText={(text) => setFormValue('name', text)}
          isRequired
          errMessage={errors.name?.message}
        />

        <CommonOutlineInput
          label={t(i18nKeys.recognition.idCode)}
          value={recognitionQuery.data?.idCode}
          isDisabled
        />

        <Row mt="auto" space={4}>
          {homeRole === EEstateRole.OWNER && (
            <Button
              flex={1}
              onPress={() => {
                deleteFace.mutate();
              }}
              colorScheme="error"
              variant="outline"
            >
              {t(i18nKeys.common.delete)}
            </Button>
          )}

          <Button
            flex={1}
            style={{ marginTop: 'auto' }}
            onPress={handleSubmit(onSubmit)}
          >
            {t(i18nKeys.common.save)}
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

export default EditRecognitionScreen;
