import { apiClient } from '@/lib/api-client';
import { AuthResponse } from '../types/auth-response';

export async function getMeService() {
  const res = await apiClient.get<AuthResponse>('/auth/me');
  return res.data;
}
