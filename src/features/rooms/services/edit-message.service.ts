import { socket } from '@/lib/socket';
import { Message } from '@/types/message';

export interface EditMessageDTO {
  messageId: string;
  body: string;
}

export async function editMessageService(data: EditMessageDTO) {
  return new Promise<Message>((resolve) =>
    socket.emit('message/edit', data, (newMessage) => resolve(newMessage))
  );
}
