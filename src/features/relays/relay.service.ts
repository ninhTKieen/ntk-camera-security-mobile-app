import httpUtil from '@src/utils/http.util';

import { IBaseHttpResponseList } from '../common/common.model';
import { TRelayBasic, TRelayParams } from './relay.model';

class RelayService {
  async getAll(
    params: TRelayParams,
  ): Promise<IBaseHttpResponseList<TRelayBasic>> {
    const response = await httpUtil.request<IBaseHttpResponseList<TRelayBasic>>(
      {
        method: 'GET',
        url: '/api/relays/get-all',
        params,
      },
    );

    return response;
  }
}

const relayService = new RelayService();

export default relayService;
