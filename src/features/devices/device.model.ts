export type TCreateDevice = {
  name: string;
  streamLink: string;
  estateId: number;
  areaId?: number;
  description?: string;
  rtsp?: string;
  model?: string;
  serial?: string;
  brand?: string;
  mac?: string;
};
