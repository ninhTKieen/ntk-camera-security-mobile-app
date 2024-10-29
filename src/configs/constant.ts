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
