import { TFullAudited } from '../common/common.model';
import { EEstateMemberStatus, EEstateRole } from '../estates/estate.model';

export type TCreateDevice = {
  name: string;
  streamLink: string;
  estateId: number;
  areaId?: number;
  description?: string;
  rtsp?: string;
  model?: string;
  serial?: string;
  brand?: string;
  mac?: string;
  imageUrl?: any;
  imageUrlId?: string;
};

export type TGetDetailEstateDeviceMember = {
  id: number;
  role: EEstateRole;
  nickname: string;
  status: EEstateMemberStatus;
  user: {
    id: number;
    email: string;
  };
};

export type TGetDetailEstateDeviceEstate = {
  id: number;
  name: string;
  members: Array<TGetDetailEstateDeviceMember>;
};

export type TGetDetailEstateDevice = TFullAudited & {
  id: number;
  name: string;
  description: string | null;
  streamLink: string;
  model: string | null;
  serial: string | null;
  brand: string | null;
  mac: string | null;
  estate: TGetDetailEstateDeviceEstate;
  area: any;
};

export type TUpdateDevice = {
  name?: string;
  streamLink?: string;
  areaId?: number | null;
  description?: string | null;
  rtsp?: string | null;
  model?: string | null;
  serial?: string | null;
  brand?: string | null;
  mac?: string | null;
  faceRecognitionEnabled?: boolean | null;
  imageUrl?: any;
  imageUrlId?: string;
};
