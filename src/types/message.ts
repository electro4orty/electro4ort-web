import { User } from './user';

export interface Message {
  id: string;
  roomId: string;
  authorId: string;
  author: User;
  body: string;
}
