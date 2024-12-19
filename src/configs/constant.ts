import { API_ENDPOINT } from '@env';
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
