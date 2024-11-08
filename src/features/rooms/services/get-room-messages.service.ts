import { apiClient } from '@/lib/api-client';
import { Message } from '@/types/message';

export interface GetRoomMessagesResponse {
  data: Message[];
  nextCursor: {
    createdAt: string;
    id: string;
  };
  hasNextPage: boolean;
}

export async function getRoomMessagesService(
  roomId: string,
  cursor?: {
    createdAt: string;
    id: string;
  }
) {
  const res = await apiClient.get<GetRoomMessagesResponse>(
    `/rooms/${roomId}/messages`,
    {
      params: {
        cursor: cursor ? JSON.stringify(cursor) : undefined,
      },
    }
  );
  return res.data;
}
