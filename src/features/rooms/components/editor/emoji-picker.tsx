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
      <div className="overflow-x-auto electro4ort-scrollbar">
        <TabsList>
          <TabsTrigger value="recent" className="px-[11px] py-2">
            <Clock className="size-4" />
          </TabsTrigger>
          {emojis.map((item) => (
            <TabsTrigger key={item.slug} value={item.slug}>
              {item.emojis[0].emoji}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value="recent">
        {recentEmojis.length === 0 && (
          <p className="h-64 text-muted-foreground flex items-center justify-center">
            Nothing here yet
          </p>
        )}
        <div className="h-64 overflow-y-auto grid grid-cols-7 md:grid-cols-10">
          {recentEmojis.map((emoji) => (
            <Button
              key={emoji.slug}
              type="button"
              size="icon"
              variant="ghost"
              className="w-full aspect-square text-xl"
              onClick={() => handleClick(emoji)}
            >
              {emoji.emoji}
            </Button>
          ))}
        </div>
      </TabsContent>

      {emojis.map((item) => (
        <TabsContent key={item.slug} value={item.slug}>
          <div className="h-64 overflow-y-auto grid grid-cols-7 md:grid-cols-10">
            {item.emojis.map((emoji) => (
              <Button
                key={emoji.slug}
                type="button"
                size="icon"
                variant="ghost"
                className="w-full aspect-square text-xl"
                onClick={() => handleClick(emoji)}
              >
                {emoji.emoji}
              </Button>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
