import axios from 'axios';
import { toast } from 'sonner';

const apiUrl = 'https://tenor.googleapis.com/v2';

export const tenorClient = axios.create({
  baseURL: apiUrl,
  params: {
    key: import.meta.env.VITE_TENOR_API_KEY,
  },
});

tenorClient.interceptors.response.use(
  (response) => response,
  (error: Error) => {
    toast.error(error.message);
    throw error;
  }
);
