import { useAuthStore } from '@/store/auth-store';
import axios from 'axios';
import { toast } from 'sonner';

const apiUrl = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: `${apiUrl}/api`,
});

apiClient.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: Error) => {
    toast.error(error.message);
    throw error;
  }
);
