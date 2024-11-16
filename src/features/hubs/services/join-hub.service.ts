import { apiClient } from '@/lib/api-client';
import { Hub } from '@/types/hub';

export async function joinHubService(hubSlug: string) {
  const res = await apiClient.post<Hub>(`/hubs/${hubSlug}/join`);
  return res.data;
}
