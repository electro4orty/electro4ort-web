import { apiClient } from '@/lib/api-client';
import { Message } from '@/types/message';

interface GetMissedMessagesArgs {
  roomId: string;
  cursor: {
    createdAt: string;
  };
}

export async function getMissedMessagesService({
  roomId,
  cursor,
}: GetMissedMessagesArgs) {
  const res = await apiClient.get<Message[]>(
    `/rooms/${roomId}/missed-messages`,
    {
      params: {
        cursor: JSON.stringify(cursor),
      },
    }
  );
  return res.data;
}
