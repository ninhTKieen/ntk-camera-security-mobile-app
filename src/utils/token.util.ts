import { storage } from '@src/configs/mmkv.storage';

export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

export const getAccessToken = () => storage.getString(ACCESS_TOKEN_KEY);

export const setAccessToken = (token: string) =>
  storage.set(ACCESS_TOKEN_KEY, token);

export const removeAccessToken = () => storage.delete(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => storage.getString(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token: string) =>
  storage.set(REFRESH_TOKEN_KEY, token);

export const removeRefreshToken = () => storage.delete(REFRESH_TOKEN_KEY);
