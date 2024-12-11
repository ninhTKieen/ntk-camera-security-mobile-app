import httpUtil from '@src/utils/http.util';

import { IBaseHttpResponse } from '../common/common.model';
import { TCreateRecognizedFace } from './recognized-face.model';

class RecognizedFaceService {
  async createRecognizedFace(data: TCreateRecognizedFace, estateId: number) {
    const response = await httpUtil.request<IBaseHttpResponse<boolean>>({
      method: 'POST',
      url: `/api/estates/${estateId}/add-recognized-face`,
      data,
    });

    return response.data;
  }

  async uploadKnownFace(file: File, estateId: number) {
    const response = await httpUtil.uploadImage({
      file,
      url: `/api/estates/${estateId}/upload-known-face`,
    });

    return response.data;
  }
}

export default new RecognizedFaceService();
