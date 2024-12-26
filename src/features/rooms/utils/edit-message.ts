import { Message } from '@/types/message';
import { InfiniteData, QueryClient } from '@tanstack/react-query';
import { GetRoomMessagesResponse } from '../services/get-room-messages.service';

export function editMessage(
  client: QueryClient,
  message: Omit<Message, 'attachments' | 'author' | 'replyTo'>
) {
  client.setQueryData<InfiniteData<GetRoomMessagesResponse>>(
    ['rooms', message.roomId, 'messages'],
    (prev) =>
      prev
        ? ({
            pages: prev.pages.map((page) => ({
              ...page,
              data: page.data.map((item) =>
                item.id === message.id
                  ? {
                      ...item,
                      body: message.body,
                    }
                  : item
              ),
            })),
            pageParams: prev.pageParams,
          } satisfies InfiniteData<GetRoomMessagesResponse>)
        : undefined
  );
}
