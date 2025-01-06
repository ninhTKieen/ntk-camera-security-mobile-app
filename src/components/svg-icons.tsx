import UploadImgIcon from '@src/assets/icons/add-image-outlined.svg';
import ArrowUpFilledIcon from '@src/assets/icons/arrow-up-filled.svg';
import CameraIcon from '@src/assets/icons/camera.svg';
import FaceRecognitionList from '@src/assets/icons/face-recognition-list.svg';
import FaceRecognitionIcon from '@src/assets/icons/face-recognition.svg';
import HouseHomeIcon from '@src/assets/icons/house.svg';
import PauseCircleOutlineIcon from '@src/assets/icons/pause-circle-outlined.svg';
import PauseIcon from '@src/assets/icons/pause.svg';
import PlayCircleOutlineIcon from '@src/assets/icons/play-circle-outlined.svg';
import PlayIcon from '@src/assets/icons/play.svg';
import SecurityCameraIcon from '@src/assets/icons/security-camera.svg';
import React from 'react';
import { SvgProps } from 'react-native-svg';

export const iconsMap = {
  'upload-image': UploadImgIcon,
  house: HouseHomeIcon,
  'security-camera': SecurityCameraIcon,
  'face-recognition': FaceRecognitionIcon,
  camera: CameraIcon,
  'face-recognition-list': FaceRecognitionList,
  'pause-circle-outlined': PauseCircleOutlineIcon,
  'play-circle-outlined': PlayCircleOutlineIcon,
  'arrow-up-filled': ArrowUpFilledIcon,
  play: PlayIcon,
  pause: PauseIcon,
};

type TIconProps = {
  name: keyof typeof iconsMap;
} & SvgProps;

export type TIconNames = keyof typeof iconsMap;

export const SvgIcon = ({ name, ...props }: TIconProps) => {
  const IconComponent = iconsMap[name];

  return <IconComponent {...props} />;
};
