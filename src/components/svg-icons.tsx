import UploadImgIcon from '@src/assets/icons/add-image-outlined.svg';
import HouseHomeIcon from '@src/assets/icons/house.svg';
import React from 'react';
import { SvgProps } from 'react-native-svg';

export const iconsMap = {
  'upload-image': UploadImgIcon,
  house: HouseHomeIcon,
};

type TIconProps = {
  name: keyof typeof iconsMap;
} & SvgProps;

export type TIconNames = keyof typeof iconsMap;

export const SvgIcon = ({ name, ...props }: TIconProps) => {
  const IconComponent = iconsMap[name];

  return <IconComponent {...props} />;
};
