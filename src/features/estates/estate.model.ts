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

export type TGetDetailEstate = TGetEstateListResponse & {
  members: {
    id: number;
    role: string;
    nickname?: string;
    user: {
      id: number;
      name: string;
      email: string;
      imageUrl?: string;
      gender?: EGender;
      dateOfBirth?: string;
    };
  }[];
  areas: (TFullAudited & {
    id: number;
    name: string;
    description?: string;
  })[];
  devices: (TFullAudited & {
    id: number;
    name: string;
    description?: string;
    ipCamera: string;
    rtsp?: null;
    model?: string;
    serial?: string;
    brand?: string;
    mac?: string;
  })[];
};
