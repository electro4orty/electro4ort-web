import { apiClient } from '@/lib/api-client';
import { Hub } from '@/types/hub';

export async function getHubService(hubSlug: string) {
  const res = await apiClient.get<Hub>(`/hubs/${hubSlug}`);
  return res.data;
}
