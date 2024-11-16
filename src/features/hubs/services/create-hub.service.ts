import { apiClient } from '@/lib/api-client';
import { Hub } from '@/types/hub';
import { toFormData } from 'axios';

interface CreateHubDTO {
  name: string;
  avatar: FileList | undefined;
}

export async function createHubService(data: CreateHubDTO) {
  const formData = toFormData(data);
  const res = await apiClient.post<Hub>('/hubs', formData);
  return res.data;
}
