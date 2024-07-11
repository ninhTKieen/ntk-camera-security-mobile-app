import httpUtil from '@src/utils/http.util';
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@src/utils/token.util';

import { IBaseHttpResponse } from '../common/base-http-response.model';
import { ILoginPayload, ILoginResponse, IUser } from './auth.model';

class AuthService {
  async login(loginPayload: ILoginPayload) {
    const response = await httpUtil.request<IBaseHttpResponse<ILoginResponse>>({
      url: '/api/auth/token-auth',
      method: 'POST',
      data: loginPayload,
    });

    setAccessToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);

    return this.getUserInfo();
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

  async logout() {
    removeAccessToken();
    removeRefreshToken();
  }
}

const authService = new AuthService();

export default authService;
