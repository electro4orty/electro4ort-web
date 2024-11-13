import { Fragment, useEffect } from 'react';
import { socket } from '@/lib/socket';
import { Button } from '@/components/ui/button';
import { useMessages } from '../hooks/use-messages';
import ChatMessage from './chat-message';
import { Message } from '@/types/message';
import { appendMessage } from '../utils/append-message';
import { useQueryClient } from '@tanstack/react-query';

interface ChatMessagesProps {
  roomId: string;
}

export default function ChatMessages({ roomId }: ChatMessagesProps) {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useMessages(roomId);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleMessage = (message: Message) => {
      appendMessage(queryClient, message);
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, [queryClient]);

  if (!data || data.pages.length === 0) {
    return <span className="px-3">Empty</span>;
  }

  return (
    <div className="flex flex-col-reverse gap-1 px-3 pt-3">
      {data.pages.map((page, i) => (
        <Fragment key={i}>
          {page.data.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </Fragment>
      ))}

      {hasNextPage && (
        <div className="flex justify-center items-center p-2">
          <Button
            type="button"
            onClick={() => fetchNextPage()}
            size="sm"
            variant="secondary"
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  );
}
