import { useMutation } from '@tanstack/react-query';
import { getMeService } from '../../features/auth/services/get-me.service';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

export function useAuthCheck() {
  const { login, logout, token } = useAuthStore();

  const { mutate } = useMutation({
    mutationFn: getMeService,
    onSuccess: login,
    onError: logout,
  });

  useEffect(() => {
    if (token) {
      mutate();
    }
  }, [token, mutate]);
}
