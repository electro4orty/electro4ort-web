import { Attachment } from './attachment';
import { User } from './user';

export enum MessageType {
  TEXT = 'text',
  GIF = 'gif',
}

export interface Message {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  roomId: string;
  authorId: string;
  author: User;
  body: string;
  attachments: (Attachment | null)[] | null;
  type: MessageType;
}
