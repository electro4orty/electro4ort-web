import { useMemo } from 'react';
import { useMessages } from '../hooks/use-messages';
import ChatMessage from './message/chat-message';
import ChatMessagesSkeletons from './chat-messages-skeletons';
import InfiniteScroll from 'react-infinite-scroll-component';
import ChatMessagesInfo from './chat-messages-info';
import { Message } from '@/types/message';

interface ChatMessagesProps {
  roomId: string;
  onReplyClick: (message: Message) => void;
}

export default function ChatMessages({
  roomId,
  onReplyClick,
}: ChatMessagesProps) {
  const { data, isLoading, hasNextPage, fetchNextPage } = useMessages(roomId);

  const dataLength = useMemo(
    () => data?.pages.reduce((prev, page) => prev + page.data.length, 0) ?? 0,
    [data?.pages]
  );

  return (
    <InfiniteScroll
      dataLength={dataLength}
      hasMore={hasNextPage}
      loader={<ChatMessagesInfo>Loading...</ChatMessagesInfo>}
      next={fetchNextPage}
      inverse
      scrollableTarget="scrollable"
      className="flex flex-col-reverse gap-1 px-2 pt-2"
      endMessage={<ChatMessagesInfo>No messages left</ChatMessagesInfo>}
    >
      {isLoading && <ChatMessagesSkeletons />}
      {!isLoading &&
        data?.pages.map((page) =>
          page.data.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onReplyClick={onReplyClick}
            />
          ))
        )}
    </InfiniteScroll>
  );
}
