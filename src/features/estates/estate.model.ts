import { EGender } from '../auth/auth.model';
import { TFullAudited } from '../common/common.model';

export enum EEstateType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  LAND = 'LAND',
  COMMERCIAL = 'COMMERCIAL',
  SCHOOL = 'SCHOOL',
  HOSPITAL = 'HOSPITAL',
  OTHER = 'OTHER',
}

export enum EEstateRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  NORMAL_USER = 'NORMAL_USER',
}

export enum EEstateMemberStatus {
  JOINED = 'JOINED',
  PENDING = 'PENDING',
}

export type TGetEstateListResponse = {
  id: number;
  name: string;
  type: EEstateType;
  description?: string;
  imageUrls?: string[];
  imageUrlIds?: string[];
  long?: string;
  lat?: string;
  address?: string;
  role: EEstateRole;
} & TFullAudited;

export type TEstateMember = {
  id: number;
  role: EEstateRole;
  nickname?: string;
  user: {
    id: number;
    name: string;
    email: string;
    imageUrl?: string;
    gender?: EGender;
    dateOfBirth?: string;
  };
  status: EEstateMemberStatus;
};

export type TGetDetailEstateDevice = {
  id: number;
  name: string;
  description?: string;
  streamLink: string;
  rtsp?: null;
  model?: string;
  serial?: string;
  brand?: string;
  mac?: string;
} & TFullAudited;

export type TGetDetailEstate = TGetEstateListResponse & {
  members: TEstateMember[];
  areas: (TFullAudited & {
    id: number;
    name: string;
    description?: string;
  })[];
  devices: TGetDetailEstateDevice[];
};

export type TCreateEstate = {
  name: string;
  description?: string;
  type: EEstateType;
  address?: string;
  long?: number;
  lat?: number;
  imageUrls?: any[];
  imageUrlIds?: string[];
};

export type TInviteMember = {
  username: string;
  role: EEstateRole;
  nickname?: string;
};
