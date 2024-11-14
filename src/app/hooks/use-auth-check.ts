import { useMutation } from '@tanstack/react-query';
import { getMeService } from '../../features/auth/services/get-me.service';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { registerSW } from '../config/register-sw';

export function useAuthCheck() {
  const { login, logout, token } = useAuthStore();
  const isCheckedRef = useRef(false);

  const { mutate } = useMutation({
    mutationFn: getMeService,
    onSuccess: (data) => {
      if (isCheckedRef.current) {
        return;
      }
      login(data);
      isCheckedRef.current = true;
      registerSW(data.user.id);
    },
    onError: () => {
      logout();
      isCheckedRef.current = false;
    },
  });

  useEffect(() => {
    if (token && !isCheckedRef.current) {
      mutate();
    }

    return () => {
      if (!token) {
        isCheckedRef.current = false;
      }
    };
  }, [token, mutate]);
}
