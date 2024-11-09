import { Attachment } from './attachment';
import { User } from './user';

export interface Message {
  id: string;
  roomId: string;
  authorId: string;
  author: User;
  body: string;
  attachments: (Attachment | null)[] | null;
}
