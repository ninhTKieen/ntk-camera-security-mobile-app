import httpUtil from '@src/utils/http.util';

import { IBaseHttpResponse } from '../common/common.model';
import {
  TCreateDevice,
  TGetDetailEstateDevice,
  TUpdateDevice,
} from './device.model';

class DeviceService {
  async create(data: TCreateDevice) {
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
}

const deviceService = new DeviceService();

export default deviceService;
