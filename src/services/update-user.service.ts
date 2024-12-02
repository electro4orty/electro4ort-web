import { apiClient } from '@/lib/api-client';
import { User } from '@/types/user';

interface UpdateUserDTO {
  username: string;
  displayName: string;
  avatar: string;
  birthDate: string;
}

interface UpdateUserArgs {
  userId: string;
  data: UpdateUserDTO;
}

export async function updateUserService(args: UpdateUserArgs) {
  const res = await apiClient.put<User>(`/users/${args.userId}`, args.data);
  return res.data;
}
