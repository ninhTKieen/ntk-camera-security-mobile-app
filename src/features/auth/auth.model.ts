export interface ILoginPayload {
  email: string;
  password: string;
  isRemember?: boolean;
}

export enum ERole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum EGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface IUser {
  createdAt: Date;
  createdById?: number;
  updatedAt?: Date;
  updatedById?: number;
  id: number;
  name: string;
  email: string;
  username: string;
  phoneNumber?: string;
  imageUrl?: string;
  imageUrlId?: string;
  gender?: EGender;
  dateOfBirth: Date;
  role: ERole;
}

export interface IUpdateUser {
  name?: string;
  phoneNumber?: string;
  imageUrl?: any;
  imageUrlId?: string;
  gender?: EGender;
  dateOfBirth?: Date;
}

export interface IRegisterPayload {
  email: string;
  password: string;
  name: string;
  username: string;
  phoneNumber?: string;
  imageUrl?: any;
  imageUrlId?: string;
  gender?: EGender;
  dateOfBirth?: Date;
}

export interface ILoginResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}
