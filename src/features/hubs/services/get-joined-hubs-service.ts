import { apiClient } from '@/lib/api-client';
import { Hub } from '@/types/hub';

export async function getJoinedHubsService() {
  const res = await apiClient.get<Hub[]>('/hubs/joined');
  return res.data;
}
