import { storage } from '@src/configs/mmkv.storage';
import authService from '@src/features/auth/auth.service';
import { useAuthStore } from '@src/features/auth/auth.store';
import { useAppStore } from '@src/features/common/app.store';
import { ACCESS_TOKEN_KEY } from '@src/utils/token.util';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useAuth = () => {
  const { isAuth, currentUser, login, logout } = useAuthStore();
  const { setLoading } = useAppStore();
  const isHasAccessToken = storage.getString(ACCESS_TOKEN_KEY);

  const getUserInfo = useCallback(async () => {
    try {
      const userInfo = await authService.getUserInfo();
      login(userInfo);
      setLoading(false);

      return userInfo;
    } catch (error) {
      logout();
      setLoading(false);
      throw Promise.reject(error);
    }
  }, [login, logout, setLoading]);

  const authQuery = useQuery({
    queryKey: ['auth/getUserInfo'],
    queryFn: () => getUserInfo(),
    retry: false,
    enabled: !!isHasAccessToken,
  });

  return { authQuery, isAuth, currentUser };
};
