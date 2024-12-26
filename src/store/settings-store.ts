import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  isSendMessageUsingModifier: boolean;
  setIsSendMessageUsingModifier: (value: boolean) => void;
  theme: string;
  setTheme: (value: string) => void;
  useMobileDialog: boolean;
  setUseMobileDialog: (value: boolean) => void;
  useSidebarSwipe: boolean;
  setUseSidebarSwipe: (value: boolean) => void;
  lastVisited: {
    roomId: string;
    hubSlug: string;
  } | null;
  setLastVisited: (data: { roomId: string; hubSlug: string }) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      isSendMessageUsingModifier: false,
      setIsSendMessageUsingModifier: (value) =>
        set({ isSendMessageUsingModifier: value }),
      theme: 'default',
      setTheme: (value) => {
        set({ theme: value });
        document.documentElement.className = value === 'default' ? '' : value;
      },
      useMobileDialog: true,
      setUseMobileDialog: (value) => set({ useMobileDialog: value }),
      useSidebarSwipe: false,
      setUseSidebarSwipe: (value) => set({ useSidebarSwipe: value }),
      lastVisited: null,
      setLastVisited: (data) => set({ lastVisited: data }),
    }),
    {
      name: 'settings-store',
      onRehydrateStorage: () => (state) => {
        document.documentElement.className =
          !state || state.theme === 'default' ? '' : state.theme;
      },
    },
  ),
);
