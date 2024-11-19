import { socket } from '@/lib/socket';
import { Message, MessageType } from '@/types/message';

export interface CreateMessageDTO {
  roomId: string;
  userId: string;
  body: string;
  text: string;
  attachments:
    | {
        fileName: string;
        size: number;
        mimeType: string;
      }[]
    | null;
  type: MessageType;
}

export async function createMessageService(data: CreateMessageDTO) {
  return new Promise<Message>((resolve) =>
    socket.emit('message', data, (newMessage) => resolve(newMessage))
  );
}
