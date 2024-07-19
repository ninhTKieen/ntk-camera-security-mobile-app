export enum EWebAppType {
  ADMIN = 'ADMIN',
  WEB = 'WEB',
  MOBILE = 'MOBILE',
}

export type TSendTokenData = {
  token: string;
  deviceId: string;
  webAppType: EWebAppType;
  language?: 'en' | 'vi';
};
