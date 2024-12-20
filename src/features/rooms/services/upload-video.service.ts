import { apiClient } from '@/lib/api-client';

export async function uploadVideoService(video: Blob) {
  const formData = new FormData();
  formData.set('file', video);

  const res = await apiClient.post<{ fileName: string }>(
    '/attachments/video',
    formData
  );
  return res.data;
}
