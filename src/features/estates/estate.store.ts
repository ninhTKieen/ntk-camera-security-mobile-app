import { create } from 'zustand';

import { EEstateRole } from './estate.model';

type TEstateStore = {
  homeId?: number;
  setHomeId: (homeId: number) => void;
  homeRole?: EEstateRole;
  setHomeRole: (homeRole: EEstateRole) => void;
};

export const useEstateStore = create<TEstateStore>()((set) => ({
  homeId: undefined,
  setHomeId: (homeId) => set({ homeId }),
  homeRole: undefined,
  setHomeRole: (homeRole) => set({ homeRole }),
}));
