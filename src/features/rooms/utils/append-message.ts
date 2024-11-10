import { Message } from '@/types/message';
import { InfiniteData, QueryClient } from '@tanstack/react-query';
import { GetRoomMessagesResponse } from '../services/get-room-messages.service';

export function appendMessage(client: QueryClient, message: Message) {
  client.setQueryData<InfiniteData<GetRoomMessagesResponse>>(
    ['rooms', message.roomId, 'messages'],
    (prev) =>
      prev
        ? ({
            pages: prev.pages.map((page, i) =>
              i === 0
                ? {
                    ...page,
                    data: [message, ...page.data],
                  }
                : page
            ),
            pageParams: prev.pageParams,
          } satisfies InfiniteData<GetRoomMessagesResponse>)
        : undefined
  );
}
