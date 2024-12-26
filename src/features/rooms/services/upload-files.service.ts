import { apiClient } from '@/lib/api-client';

interface UploadFilesResponse {
  fileName: string;
  size: number;
  mimeType: string;
}

export async function uploadFilesService(files: FileList | File[]) {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('files', file);
  });

  const res = await apiClient.post<UploadFilesResponse[]>(
    `/attachments`,
    formData
  );
  return res.data;
}
