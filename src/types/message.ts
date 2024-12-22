import { Attachment } from './attachment';
import { User } from './user';

export enum MessageType {
  TEXT = 'text',
  GIF = 'gif',
  AUDIO = 'audio',
  VIDEO = 'video',
}

export interface Message {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  roomId: string;
  authorId: string;
  author: User;
  body: string;
  attachments: Attachment[] | null;
  type: MessageType;
  replyToId: string | null;
  replyTo: Message | null;
}
