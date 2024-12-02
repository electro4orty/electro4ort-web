import { apiClient } from '@/lib/api-client';

export async function uploadAvatarService(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.post<{
    fileName: string;
    mimeType: string;
    size: number;
  }>('/users/avatar', formData);
  return res.data;
}
