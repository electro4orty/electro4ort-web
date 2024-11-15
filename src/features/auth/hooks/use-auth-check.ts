import { useMutation } from '@tanstack/react-query';
import { getMeService } from '../services/get-me.service';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth-store';

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
