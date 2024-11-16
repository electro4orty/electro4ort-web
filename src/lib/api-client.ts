import { useAuthStore } from '@/store/auth-store';
import axios from 'axios';
import { toast } from 'sonner';
import { debounce } from 'lodash';

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

const handleError = debounce((error: Error) => {
  console.log(error);
  toast.error(error.message);
  throw error;
}, 300);

apiClient.interceptors.response.use((response) => response, handleError);
