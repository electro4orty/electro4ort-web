import { Attachment } from './attachment';
import { User } from './user';

export interface Message {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  roomId: string;
  authorId: string;
  author: User;
  body: string;
  attachments: (Attachment | null)[] | null;
}
