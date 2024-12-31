import { API_ENDPOINT } from '@env';
import { RTCConfiguration } from '@src/features/common/common.model';
import { EEstateType } from '@src/features/estates/estate.model';

export const ESTATE_MAP = new Map([
  [EEstateType.APARTMENT, 'estates.type.apartment'],
  [EEstateType.COMMERCIAL, 'estates.type.commercial'],
  [EEstateType.HOUSE, 'estates.type.house'],
  [EEstateType.LAND, 'estates.type.land'],
  [EEstateType.SCHOOL, 'estates.type.school'],
  [EEstateType.HOSPITAL, 'estates.type.hospital'],
  [EEstateType.OTHER, 'estates.type.other'],
]);

export const HOME_ID_KEY = 'HOME_ID';
export const APP_API_ENDPOINT = API_ENDPOINT;

export const DATE_FORMAT = 'DD/MM/YYYY';
export const TIME_FORMAT_VI = 'HH:mm';
export const TIME_FORMAT_EN = 'h:mm A';
export const CURRENT_DATE_FORMAT = 'dddd, DD/MMM/YYYY';

export const ICE_SERVERS = [
  {
    // urls: 'stun:stun.l.google.com:19302',
    urls: 'stun:stun.relay.metered.ca:80',
  },
  {
    urls: 'turn:ntkieen.site:34780',
    username: 'test',
    credential: 'test',
  },
  {
    urls: 'turn:ntkieen.site:34780?transport=tcp',
    username: 'test',
    credential: 'test',
  },
  {
    urls: 'turn:ntkieen.site:30443',
    username: 'test',
    credential: 'test',
  },
  {
    urls: 'turn:ntkieen.site:30443?transport=tcp',
    username: 'test',
    credential: 'test',
  },
];

// export const ICE_SERVERS = [
//   {
//     urls: 'stun:stun.relay.metered.ca:80',
//   },
//   {
//     urls: 'turn:36.50.135.31:34780',
//     username: 'test',
//     credential: 'test',
//   },
//   {
//     urls: 'turn:36.50.135.31:30443?transport=tcp',
//     username: 'test',
//     credential: 'test',
//   },
// ];

export const RCT_CONFIGS: RTCConfiguration = {
  iceServers: ICE_SERVERS,
  iceCandidatePoolSize: 10,
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require',
};
