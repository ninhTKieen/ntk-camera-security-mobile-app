import httpUtil from '@src/utils/http.util';

import { IBaseHttpResponse } from '../common/common.model';
import { TCreateDevice } from './device.model';

class DeviceService {
  async create(data: TCreateDevice) {
    const response = await httpUtil.request<IBaseHttpResponse<boolean>>({
      method: 'POST',
      url: '/api/devices/create',
      data,
    });

    return response.data;
  }
}

const deviceService = new DeviceService();

export default deviceService;
