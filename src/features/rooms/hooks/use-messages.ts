import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { getRoomMessagesService } from '../services/get-room-messages.service';
import { useEffect } from 'react';
import { getMissedMessagesService } from '../services/get-missed-messages.service';
import { socket } from '@/lib/socket';
import { Message } from '@/types/message';
import { appendMessage, appendMessages } from '../utils/append-message';

export function useMessages(roomId: string) {
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
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

  const { mutate } = useMutation({
    mutationFn: getMissedMessagesService,
    onSuccess: (data) => {
      appendMessages(queryClient, roomId, data);
    },
  });

  useEffect(() => {
    const checkMissedMessages = () => {
      const lastMessage = data?.pages[0].data[0];
      if (!lastMessage) {
        return;
      }

      mutate({
        roomId,
        cursor: {
          createdAt: lastMessage.createdAt,
        },
      });
    };

    socket.on('connect', checkMissedMessages);

    return () => {
      socket.off('connect', checkMissedMessages);
    };
  }, [data?.pages, mutate, roomId]);

  useEffect(() => {
    const handleMessage = (message: Message) => {
      appendMessage(queryClient, message);
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, [queryClient]);

  return {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
  };
}
