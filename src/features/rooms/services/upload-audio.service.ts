import { apiClient } from '@/lib/api-client';

export async function uploadAudioService(audio: Blob) {
  const formData = new FormData();
  formData.set('file', audio);

  const res = await apiClient.post<{ fileName: string }>(
    '/attachments/audio',
    formData
  );
  return res.data;
}
