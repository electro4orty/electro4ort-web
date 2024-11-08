import ChatEditor from './chat-editor';
import ChatMessages from './chat-messages';

interface ChatProps {
  roomId: string;
}

export default function Chat({ roomId }: ChatProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="grow overflow-y-scroll flex flex-col-reverse">
        <ChatMessages roomId={roomId} />
      </div>
      <ChatEditor roomId={roomId} />
    </div>
  );
}
