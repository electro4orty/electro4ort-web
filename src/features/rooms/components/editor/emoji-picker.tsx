import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmojiStore } from '@/store/emoji-store';
import { Clock } from 'lucide-react';
import emojis from 'unicode-emoji-json/data-by-group.json';

interface EmojiPickerProps {
  onPick: (emoji: string) => void;
}

export default function EmojiPicker({ onPick }: EmojiPickerProps) {
  const { recentEmojis, addRecentEmoji } = useEmojiStore();

  const handleClick = (emoji: (typeof emojis)[number]['emojis'][number]) => {
    addRecentEmoji(emoji);
    onPick(emoji.emoji);
  };

  return (
    <Tabs defaultValue="recent">
      <TabsList className="overflow-x-auto w-full justify-start">
        <TabsTrigger value="recent" className="px-[11px] py-2">
          <Clock className="size-4" />
        </TabsTrigger>
        {emojis.map((item) => (
          <TabsTrigger key={item.slug} value={item.slug}>
            {item.emojis[0].emoji}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="recent" className="h-64 overflow-y-auto px-1">
        {recentEmojis.length === 0 && (
          <p className="text-muted-foreground h-full flex items-center justify-center">
            Nothing here yet
          </p>
        )}
        {recentEmojis.map((emoji) => (
          <Button
            key={emoji.slug}
            type="button"
            size="icon"
            variant="ghost"
            className="w-9 text-xl"
            onClick={() => handleClick(emoji)}
          >
            {emoji.emoji}
          </Button>
        ))}
      </TabsContent>

      {emojis.map((item) => (
        <TabsContent
          key={item.slug}
          value={item.slug}
          className="h-64 overflow-y-auto"
        >
          {item.emojis.map((emoji) => (
            <Button
              key={emoji.slug}
              type="button"
              size="icon"
              variant="ghost"
              className="w-9 text-xl"
              onClick={() => handleClick(emoji)}
            >
              {emoji.emoji}
            </Button>
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
