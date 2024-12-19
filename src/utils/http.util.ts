import { APP_API_ENDPOINT } from '@src/configs/constant';
import authService from '@src/features/auth/auth.service';
import {
  IBaseHttpResponse,
  TUploadImageResult,
} from '@src/features/common/common.model';
import {
  TUploadKnownFace,
  TUploadKnownFaceResult,
} from '@src/features/recognized-faces/recognized-face.model';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';

import { getAccessToken } from './token.util';

interface IHttpRequest {
  url: string;
  method: Method;
  data?: any;
  params?: any;
  contentType?: string;
}

class HttpUtil {
  private readonly http: AxiosInstance;
  private readonly httpUploadImg: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: APP_API_ENDPOINT,
      timeout: 30000,
    });

    this.httpUploadImg = axios.create({
      baseURL: APP_API_ENDPOINT,
      timeout: 30000,
    });

    this.http.interceptors.request.use(
      (config) => {
        const headers: any = config.headers;
        const accessToken = getAccessToken();

        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }

        return { ...config, headers: config.headers };
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.http.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const accessToken = getAccessToken();

        if (!accessToken) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401) {
          const success = await authService.refreshToken();

          if (success) {
            return this.http(error.config as AxiosRequestConfig);
          } else {
            await authService.logout();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  async request<T>({
    url,
    params,
    data,
    method,
    contentType,
  }: IHttpRequest): Promise<T> {
    const config: AxiosRequestConfig = {
      url,
      method,
      params,
      data,
      headers: {
        'Content-Type': contentType || 'application/json',
      },
    };

    const response = await this.http.request(config);

    return response.data as T;
  }

  async uploadImage({ file }: { file: File }) {
    const formData = new FormData();
    formData.append('image', file);

    const config: AxiosRequestConfig = {
      url: '/api/image/upload',
      method: 'POST',
      data: formData,
      baseURL: APP_API_ENDPOINT,
    };

    const response = await this.http.request<
      IBaseHttpResponse<TUploadImageResult>
    >(config);

    return response.data;
  }

  async uploadKnownFace(data: TUploadKnownFace, url: string) {
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('idCode', data.idCode);

    const config: AxiosRequestConfig = {
      url,
      method: 'POST',
      data: formData,
      baseURL: APP_API_ENDPOINT,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await this.http.request<
      IBaseHttpResponse<TUploadKnownFaceResult>
    >(config);

    return response.data;
  }

  async uploadListImage({ files }: { files: any[] }): Promise<any> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('image', file);
    });

    const config: AxiosRequestConfig = {
      url: '/api/image/upload',
      method: 'POST',
      data: formData,
      baseURL: APP_API_ENDPOINT,
    };

    const response = await this.http.request(config);

    return response.data;
  }
}

const httpUtil = new HttpUtil();

export default httpUtil;
