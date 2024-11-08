import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  GetRoomMessagesResponse,
  getRoomMessagesService,
} from '../services/get-room-messages.service';
import { useCallback } from 'react';
import { Message } from '@/types/message';

export function useMessages(roomId: string) {
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['rooms', roomId, 'messages'],
      queryFn: ({ pageParam }) => getRoomMessagesService(roomId, pageParam),
      initialPageParam: undefined as
        | {
            createdAt: string;
            id: string;
          }
        | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.nextCursor : undefined,
    });

  const appendMessage = useCallback(
    (message: Message) => {
      queryClient.setQueryData<InfiniteData<GetRoomMessagesResponse>>(
        ['rooms', roomId, 'messages'],
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
    },
    [queryClient, roomId]
  );

  return {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    appendMessage,
  };
}
