import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  isSendMessageUsingModifier: boolean;
  setIsSendMessageUsingModifier: (value: boolean) => void;
  theme: string;
  setTheme: (value: string) => void;
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
    }),
    {
      name: 'settings-store',
      onRehydrateStorage: () => (state) => {
        document.documentElement.className =
          !state || state.theme === 'default' ? '' : state.theme;
      },
    }
  )
);
