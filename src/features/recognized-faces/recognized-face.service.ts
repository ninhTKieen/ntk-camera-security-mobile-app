import httpUtil from '@src/utils/http.util';

import { IBaseHttpResponse } from '../common/common.model';
import {
  TCreateRecognizedFace,
  TGetListRecognizedFace,
  TUploadKnownFace,
} from './recognized-face.model';

class RecognizedFaceService {
  async getList(estateId: number) {
    const response = await httpUtil.request<
      IBaseHttpResponse<TGetListRecognizedFace[]>
    >({
      method: 'GET',
      url: `/api/estates/${estateId}/recognized-faces`,
    });

    return response.data;
  }

  async create(data: TCreateRecognizedFace, estateId: number) {
    const response = await httpUtil.request<IBaseHttpResponse<boolean>>({
      method: 'POST',
      url: `/api/estates/${estateId}/add-recognized-face`,
      data,
    });

    return response.data;
  }

  async uploadKnownFace(data: TUploadKnownFace, estateId: number) {
    const response = await httpUtil.uploadKnownFace(
      data,
      `/api/estates/${estateId}/upload-known-face`,
    );

    return response.data;
  }

  async getImageLocal(estateId: number) {
    const response = await httpUtil.request<IBaseHttpResponse<any>>({
      method: 'GET',
      url: `/api/image/known-face/${estateId}`,
    });

    return response;
  }
}

export default new RecognizedFaceService();
