import httpUtil from '@src/utils/http.util';

import { IBaseHttpResponse } from '../common/common.model';
import {
  TCreateDevice,
  TGetDetailEstateDevice,
  TUpdateDevice,
} from './device.model';

class DeviceService {
  async create(data: TCreateDevice) {
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
    const response = await httpUtil.request<IBaseHttpResponse<boolean>>({
      method: 'POST',
      url: '/api/devices/create',
      data,
    });

    return response.data;
  }

  async getDetail(deviceId: number) {
    const response = await httpUtil.request<
      IBaseHttpResponse<TGetDetailEstateDevice>
    >({
      method: 'GET',
      url: `/api/devices/${deviceId}`,
    });

    return response.data;
  }

  async update(deviceId: number, data: TUpdateDevice) {
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
    const response = await httpUtil.request<IBaseHttpResponse<boolean>>({
      method: 'PATCH',
      url: `/api/devices/${deviceId}`,
      data,
    });

    return response.data;
  }

  async delete(deviceId: number) {
    const response = await httpUtil.request<IBaseHttpResponse<boolean>>({
      method: 'DELETE',
      url: `/api/devices/${deviceId}`,
    });

    return response.data;
  }

  async getRecognizedFaces(deviceId: number) {
    const response = await httpUtil.request<
      IBaseHttpResponse<
        {
          uri: string;
          time: string;
        }[]
      >
    >({
      method: 'GET',
      url: `/api/devices/${deviceId}/recognized-faces`,
    });

    return response.data;
  }
}

const deviceService = new DeviceService();

export default deviceService;
