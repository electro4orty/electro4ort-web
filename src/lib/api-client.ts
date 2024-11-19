import { useAuthStore } from '@/store/auth-store';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { debounce } from 'lodash';

const apiUrl = process.env.VITE_API_URL;

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

const handleError = debounce((error: AxiosError<{ message?: string }>) => {
  const errorMessage = error.response?.data.message ?? error.message;
  toast.error(errorMessage);
  throw error;
}, 300);

apiClient.interceptors.response.use((response) => response, handleError);
