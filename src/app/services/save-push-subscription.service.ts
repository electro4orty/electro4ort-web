import { apiClient } from '@/lib/api-client';
import { User } from '@/types/user';

interface SavePushSubscriptionServiceArgs {
  userId: string;
  data: object;
}

export async function savePushSubscriptionService(
  args: SavePushSubscriptionServiceArgs
) {
  const res = await apiClient.post<User>(
    `/users/${args.userId}/push-config`,
    args.data
  );
  return res.data;
}
