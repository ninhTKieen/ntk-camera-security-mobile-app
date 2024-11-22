import PhotoModal from '@src/components/photo-modal';
import { SvgIcon } from '@src/components/svg-icons';
import { i18nKeys } from '@src/configs/i18n';
import { TLocalImgProps } from '@src/features/common/common.model';
import { Box, Image, Pressable, Text, useTheme } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

type TChooseHomeImageProps = {
  image: string | TLocalImgProps;
  setValues: (values: TLocalImgProps) => void;
};

export const ChooseHomeImage = ({
  image,
  setValues,
}: TChooseHomeImageProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [openPhotoModal, setOpenPhotoModal] = useState(false);

  return (
    <Pressable
      onPress={() => {
        setOpenPhotoModal(true);
      }}
    >
      <Box
        m={4}
        p={1}
        shadow={2}
        borderRadius={15}
        bg="white"
        h="40"
        alignItems="center"
        justifyContent="center"
      >
        {image ? (
          <>
            <Image
              source={{
                uri: typeof image === 'string' ? image : image.uri,
              }}
              w="full"
              h="full"
              resizeMode="cover"
              overflow="hidden"
              alt=""
              borderRadius={15}
            />
          </>
        ) : (
          <>
            <SvgIcon
              name="upload-image"
              color={theme.colors.primary[600]}
              width={50}
              height={50}
            />

            <Text
              color="primary.600"
              fontSize="md"
              mt={2}
              fontWeight="semibold"
            >
              {t(i18nKeys.estates.uploadImage)}
            </Text>
          </>
        )}
      </Box>

      <PhotoModal
        isOpen={openPhotoModal}
        onClose={() => setOpenPhotoModal(false)}
        setValues={(values: TLocalImgProps) => {
          setValues(values);
        }}
      />
    </Pressable>
  );
};
