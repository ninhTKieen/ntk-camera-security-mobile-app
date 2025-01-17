export type THomeStackParamList = {
  Home: undefined;
  AddDeviceManual: undefined;
  AddDeviceAuto: undefined;
  DeviceDetail: {
    deviceId: number;
    deviceName: string;
    relayId: string;
  };
  AddRecognition: undefined;
  RecognitionDetail: {
    faceId: number;
  };
  RecognitionList: undefined;
  EditDevice: {
    deviceId: number;
  };
  EditRecognition: {
    recognitionId: number;
  };
  HumanDetectionImages: {
    deviceId: number;
  };
};
