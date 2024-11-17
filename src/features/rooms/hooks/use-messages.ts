import { useInfiniteQuery } from '@tanstack/react-query';
import { getRoomMessagesService } from '../services/get-room-messages.service';

export function useMessages(roomId: string) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
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

  return {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  };
}
