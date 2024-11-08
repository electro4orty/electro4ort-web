import { User } from '@/types/user';

export interface AuthResponse {
  user: User;
  token: string;
}
