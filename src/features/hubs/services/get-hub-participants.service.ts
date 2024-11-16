import { apiClient } from '@/lib/api-client';
import { User } from '@/types/user';

export async function getHubParticipantsService(hubSlug: string) {
  const res = await apiClient.get<User[]>(`/hubs/${hubSlug}/participants`);
  return res.data;
}
