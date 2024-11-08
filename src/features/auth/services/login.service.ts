import { apiClient } from '@/lib/api-client';
import { AuthResponse } from '../types/auth-response';

interface LoginDTO {
  username: string;
  password: string;
}

export async function loginService(data: LoginDTO) {
  const res = await apiClient.post<AuthResponse>('/auth/login', data);
  return res.data;
}
