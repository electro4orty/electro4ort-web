import { apiClient } from '@/lib/api-client';
import { Hub } from '@/types/hub';

interface CreateHubDTO {
  name: string;
}

export async function createHubService(data: CreateHubDTO) {
  const res = await apiClient.post<Hub>('/hubs', data);
  return res.data;
}
