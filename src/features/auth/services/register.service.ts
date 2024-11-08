import { apiClient } from '@/lib/api-client';
import { AuthResponse } from '../types/auth-response';

interface RegisterDTO {
  username: string;
  password: string;
  displayName: string;
}

export async function registerService(data: RegisterDTO) {
  const res = await apiClient.post<AuthResponse>('/auth/register', data);
  return res.data;
}
