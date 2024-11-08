import { apiClient } from '@/lib/api-client';
import { Hub } from '@/types/hub';

export async function searchHubsService(query: string) {
  const res = await apiClient.get<Hub[]>('/hubs', {
    params: {
      query,
    },
  });
  return res.data;
}
