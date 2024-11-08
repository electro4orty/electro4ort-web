import { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  user: User | null;
  token: string | null;
  login: (data: { user: User; token: string }) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: ({ user, token }) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-store',
    }
  )
);
