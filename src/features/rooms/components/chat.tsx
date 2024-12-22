import { useRef, useState } from 'react';
import ChatEditor from './editor/chat-editor';
import ChatMessages from './chat-messages';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Message } from '@/types/message';

interface ChatProps {
  roomId: string;
}

export default function Chat({ roomId }: ChatProps) {
  const chatMessagesScrollRef = useRef<HTMLDivElement>(null);
  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(false);
  const [replyMessage, setReplyMessage] = useState<Message | null>(null);

  const clearReplyMessage = () => setReplyMessage(null);

  const scrollToBottom = () => {
    chatMessagesScrollRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleMessageSend = () => {
    setTimeout(scrollToBottom, 0);
    clearReplyMessage();
  };

  const scrollbarWidth = chatMessagesScrollRef.current
    ? chatMessagesScrollRef.current.offsetWidth -
      chatMessagesScrollRef.current.clientWidth
    : 0;

  return (
    <div className="flex flex-col h-full">
      <div
        ref={chatMessagesScrollRef}
        className="grow overflow-y-auto flex flex-col-reverse electro4ort-scrollbar"
        id="scrollable"
        onScroll={(e) =>
          setIsScrollToBottomVisible(e.currentTarget.scrollTop < -300)
        }
      >
        <ChatMessages roomId={roomId} onReplyClick={setReplyMessage} />
        <AnimatePresence>
          {isScrollToBottomVisible && (
            <Button
              size="icon"
              type="button"
              className="fixed bottom-24 rounded-full"
              style={{
                right: `calc(${scrollbarWidth}px + 0.5rem)`,
              }}
              onClick={scrollToBottom}
              asChild
            >
              <motion.button
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.1,
                }}
              >
                <ChevronDown />
              </motion.button>
            </Button>
          )}
        </AnimatePresence>
      </div>
      <ChatEditor
        roomId={roomId}
        onSend={handleMessageSend}
        replyMessage={replyMessage}
        onReplyClear={() => setReplyMessage(null)}
      />
    </div>
  );
}
