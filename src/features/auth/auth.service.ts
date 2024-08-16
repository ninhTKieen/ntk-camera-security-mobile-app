import httpUtil from '@src/utils/http.util';
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@src/utils/token.util';

import { IBaseHttpResponse } from '../common/common.model';
import {
  ILoginPayload,
  ILoginResponse,
  IRegisterPayload,
  IUpdateUser,
  IUser,
} from './auth.model';

class AuthService {
  async login(loginPayload: ILoginPayload) {
    const response = await httpUtil.request<IBaseHttpResponse<ILoginResponse>>({
      url: '/api/auth/login',
      method: 'POST',
      data: loginPayload,
    });

    setAccessToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);

    return response.data.user;
  }

  async register(registerPayload: IRegisterPayload) {
    const response = await httpUtil.request<IBaseHttpResponse<ILoginResponse>>({
      url: '/api/auth/register',
      method: 'POST',
      data: registerPayload,
    });

    setAccessToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);

    return response.data.user;
  }

  async getUserInfo() {
    const accessToken = getAccessToken();

    if (!accessToken) {
      throw new Error('Access token is not found');
    }

    const response = await httpUtil.request<IBaseHttpResponse<IUser>>({
      url: '/api/users/get-me',
      method: 'GET',
    });

    return response.data;
  }

  async refreshToken() {
    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        return false;
      }

      const response = await httpUtil.request<
        IBaseHttpResponse<ILoginResponse>
      >({
        url: '/api/auth/refresh-token',
        method: 'POST',
        data: {
          refreshToken,
        },
      });

      setAccessToken(response.data.accessToken);

      return true;
    } catch (error) {
      return false;
    }
  }

  logout() {
    removeAccessToken();
    removeRefreshToken();
  }

  async updateUser(id: number, data: IUpdateUser) {
    if (data?.imageUrl) {
      if (typeof data.imageUrl === 'object') {
        const response = await httpUtil.uploadImage({
          file: data.imageUrl,
        });

        data = {
          ...data,
          imageUrl: response.data.imagePublicUrl,
          imageUrlId: response.data.imagePublicId,
        };
      }
    }
    const response = await httpUtil.request<IBaseHttpResponse<IUser>>({
      url: `/api/users/${id}`,
      method: 'PATCH',
      data,
    });

    return response.data;
  }
}

const authService = new AuthService();

export default authService;
