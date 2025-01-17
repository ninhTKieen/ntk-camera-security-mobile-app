import { create } from 'zustand';

type TAppStore = {
  language?: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  isHideBottomTabBar: boolean;
  setHideBottomTabBar: (isHideBottomTabBar: boolean) => void;
};

export const useAppStore = create<TAppStore>((set) => ({
  isDarkMode: false,
  toggleDarkMode: () =>
    set((state) => ({ ...state, isDarkMode: !state.isDarkMode })),
  isLoading: false,
  setLoading: (isLoading) => set((state) => ({ ...state, isLoading })),
  isHideBottomTabBar: false,
  setHideBottomTabBar: (isHideBottomTabBar) =>
    set((state) => ({ ...state, isHideBottomTabBar })),
}));
