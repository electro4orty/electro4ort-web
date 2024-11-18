import { useRef } from 'react';
import ChatEditor from './chat-editor';
import ChatMessages from './chat-messages';

interface ChatProps {
  roomId: string;
}

export default function Chat({ roomId }: ChatProps) {
  const chatMessagesScrollRef = useRef<HTMLDivElement>(null);

  const handleMessageSend = () => {
    setTimeout(() => {
      chatMessagesScrollRef.current?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 0);
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={chatMessagesScrollRef}
        className="grow overflow-y-auto flex flex-col-reverse"
        id="scrollable"
      >
        <ChatMessages roomId={roomId} />
      </div>
      <ChatEditor roomId={roomId} onSend={handleMessageSend} />
    </div>
  );
}
