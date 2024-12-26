import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import emojis from 'unicode-emoji-json/data-by-group.json';

type EmojiType = (typeof emojis)[number]['emojis'][number];

interface EmojiStore {
  recentEmojis: EmojiType[];
  addRecentEmoji: (emoji: EmojiType) => void;
}

export const useEmojiStore = create<EmojiStore>()(
  persist(
    (set) => ({
      recentEmojis: [],
      addRecentEmoji: (emoji) =>
        set((prev) => ({
          recentEmojis: Array.from(new Set([emoji, ...prev.recentEmojis])),
        })),
    }),
    {
      name: 'emoji-store',
    }
  )
);
