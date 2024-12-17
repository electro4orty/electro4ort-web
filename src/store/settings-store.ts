import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  isSendMessageUsingModifier: boolean;
  setIsSendMessageUsingModifier: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      isSendMessageUsingModifier: false,
      setIsSendMessageUsingModifier: (value) =>
        set({ isSendMessageUsingModifier: value }),
    }),
    {
      name: 'settings-store',
    }
  )
);
