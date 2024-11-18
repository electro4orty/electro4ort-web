import { Fragment, useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useMessages } from '../hooks/use-messages';
import ChatMessage from './chat-message';
import { Message } from '@/types/message';
import { appendMessage } from '../utils/append-message';
import { useQueryClient } from '@tanstack/react-query';
import ChatMessagesSkeletons from './chat-messages-skeletons';
import InfiniteScroll from 'react-infinite-scroll-component';

interface ChatMessagesProps {
  roomId: string;
}

export default function ChatMessages({ roomId }: ChatMessagesProps) {
  const { data, isLoading, hasNextPage, fetchNextPage } = useMessages(roomId);
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

  const dataLength =
    data?.pages.reduce((prev, page) => prev + page.data.length, 0) ?? 0;

  return (
    <InfiniteScroll
      dataLength={dataLength}
      hasMore={hasNextPage}
      loader={
        <p className="text-center text-muted-foreground text-sm py-2">
          Loading...
        </p>
      }
      next={fetchNextPage}
      inverse
      scrollableTarget="scrollable"
      className="flex flex-col-reverse gap-1 px-2 pt-2"
      endMessage={
        <p className="text-center text-muted-foreground text-sm py-2">
          No messages left
        </p>
      }
    >
      {isLoading && <ChatMessagesSkeletons />}
      {!isLoading &&
        data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.data.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </Fragment>
        ))}
    </InfiniteScroll>
  );
}
