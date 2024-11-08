import { apiClient } from '@/lib/api-client';
import { User } from '@/types/user';

export async function getUserService(userId: string) {
  const res = await apiClient.get<User>(`/users/${userId}`);
  return res.data;
}
