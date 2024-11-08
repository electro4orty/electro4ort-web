import { socket } from '@/lib/socket';
import { Message } from '@/types/message';

interface CreateMessageDTO {
  roomId: string;
  userId: string;
  body: string;
}

export async function createMessageService(data: CreateMessageDTO) {
  return new Promise<Message>((resolve) =>
    socket.emit('message', data, (newMessage) => resolve(newMessage))
  );
}
