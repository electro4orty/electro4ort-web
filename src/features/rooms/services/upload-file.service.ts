import { apiClient } from '@/lib/api-client';

export async function uploadFilesService(roomId: string, formData: FormData) {
  const res = await apiClient.post<
    {
      fileName: string;
      size: number;
      mimeType: string;
    }[]
  >(`/rooms/${roomId}/files`, formData);
  return res.data;
}
