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

export type TResponseRecognizedFace = {
  detection: {
    _imageDims: {
      _width: number;
      _height: number;
    };
    _score: number;
    _classScore: number;
    _className: string;
    _box: {
      _x: number;
      _y: number;
      _width: number;
      _height: number;
    };
  };
  landmarks: {
    _imgDims: {
      _width: number;
      _height: number;
    };
    _shift: {
      _x: number;
      _y: number;
    };
    _positions: {
      _x: number;
      _y: number;
    }[];
  };
  unshiftedLandmarks: {
    _imgDims: {
      _width: number;
      _height: number;
    };
    _shift: {
      _x: number;
      _y: number;
    };
    _positions: {
      _x: number;
      _y: number;
    }[];
  };
  alignedRect: {
    _imageDims: {
      _width: number;
      _height: number;
    };
    _score: number;
    _classScore: number;
    _className: string;
    _box: {
      _x: number;
      _y: number;
      _width: number;
      _height: number;
    };
  };
  angle: {
    roll: number;
    pitch: number;
    yaw: number;
  };
  descriptor: {
    [key: string]: number;
  };
};
