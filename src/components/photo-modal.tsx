import { i18nKeys } from '@src/configs/i18n';
import { Box, Pressable, Stack, Text } from 'native-base';
import { useTheme } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import ImageCropPicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';

import IconGeneral from './icon-general';

type TPhotoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setValues: (values: any) => void;
  chooseMultiple?: boolean;
};

const PhotoModal = ({
  isOpen,
  onClose,
  setValues,
  chooseMultiple,
}: TPhotoModalProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const convertToFileForm = (images: ImageOrVideo | ImageOrVideo[]) => {
    if (Array.isArray(images)) {
      return images.map((image) => {
        return {
          uri: image.path,
          width: image.width,
          height: image.height,
          type: image.mime,
          size: image.size,
          name:
            Platform.OS === 'ios'
              ? image.filename
                  ?.replace(/HEIC/g, 'jpg')
                  .replace(/heic/g, 'jpg')
                  .replace(/heif/g, 'jpg')
                  .replace(/HEIF/g, 'jpg') ?? image.path
              : image.path.substring(image.path.lastIndexOf('/') + 1),
        };
      });
    } else {
      return {
        uri: images.path,
        width: images.width,
        height: images.height,
        type: images.mime,
        size: images.size,
        name:
          Platform.OS === 'ios'
            ? images.filename
                ?.replace(/HEIC/g, 'jpg')
                .replace(/heic/g, 'jpg')
                .replace(/heif/g, 'jpg')
                .replace(/HEIF/g, 'jpg') ?? images.path
            : images.path.substring(images.path.lastIndexOf('/') + 1),
      };
    }
  };

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection={['down', 'up', 'left', 'right']}
      onSwipeComplete={onClose}
      style={{}}
    >
      <Box bg="white" p={2} width="4/5" alignSelf="center" borderRadius="2xl">
        <Pressable>
          {({ isPressed }) => (
            <Stack
              style={{
                transform: [{ scale: isPressed ? 0.95 : 1 }],
              }}
              space={4}
              p={4}
              direction="row"
              alignItems="center"
            >
              <Box bg="gray.200" borderRadius="full" p={2}>
                <IconGeneral
                  type="FontAwesome5"
                  name="camera-retro"
                  size={20}
                  color={theme.colors.primary[600]}
                />
              </Box>
              <Text fontWeight="semibold" fontSize="lg" color="primary.600">
                {t(i18nKeys.photo.take)}
              </Text>
            </Stack>
          )}
        </Pressable>

        <Pressable
          onPress={() => {
            ImageCropPicker.openPicker({
              multiple: chooseMultiple,
            })
              .then((images) => {
                const files = convertToFileForm(images);
                setValues(files);
                onClose();
              })
              .catch(() => {
                onClose();
              });
          }}
        >
          {({ isPressed }) => (
            <Stack
              style={{
                transform: [{ scale: isPressed ? 0.95 : 1 }],
              }}
              space={4}
              p={4}
              direction="row"
              alignItems="center"
            >
              <Box bg="gray.200" borderRadius="full" p={2}>
                <IconGeneral
                  type="Fontisto"
                  name="photograph"
                  size={20}
                  color={theme.colors.primary[600]}
                />
              </Box>
              <Text fontWeight="semibold" fontSize="lg" color="primary.600">
                {t(i18nKeys.photo.chooseFromLibrary)}
              </Text>
            </Stack>
          )}
        </Pressable>
      </Box>
    </Modal>
  );
};

export default PhotoModal;
