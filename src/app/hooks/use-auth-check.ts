import { useMutation } from '@tanstack/react-query';
import { getMeService } from '../../features/auth/services/get-me.service';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { registerSW } from '../config/register-sw';
import { connectAll } from '@/lib/socket';

export function useAuthCheck() {
  const { login, logout, token } = useAuthStore();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const { mutate } = useMutation({
    mutationFn: getMeService,
    onSuccess: (data) => {
      login(data);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      registerSW(data.user);
      connectAll();
    },
    onError: () => {
      logout();
    },
  });

  useEffect(() => {
    if (token) {
      mutate();
    }
  }, [token, mutate]);
}
