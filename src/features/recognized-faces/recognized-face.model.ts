import { TFullAudited } from '../common/common.model';

export type TCreateRecognizedFace = {
  name: string;
  description?: string;
  idCode: string;
  estateId: number;
  imageUrl?: string;
};

export type TUploadKnownFace = {
  image: File;
  idCode: string;
};

export type TUploadKnownFaceResult = {
  message: string;
  filePath: string;
};

export type TGetListRecognizedFace = {
  id: number;
  name: string;
  description?: string;
  idCode: string;
  imageUrl: string;
  isActive: boolean;
} & TFullAudited;
