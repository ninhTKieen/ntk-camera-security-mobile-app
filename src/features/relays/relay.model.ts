import { TParamsGetList } from '../common/common.model';

export type TRelayBasic = {
  id: number;
  uid: string;
  name: string;
  description?: string;
  ipAddress?: string;
  port?: string;
  estateId: number;
  estateName: string;
};

export type TRelayParams = TParamsGetList & {
  estateId: number;
};
