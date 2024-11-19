import axios from 'axios';
import { toast } from 'sonner';

const apiUrl = 'https://api.github.com';

export const githubClient = axios.create({
  baseURL: apiUrl,
});

githubClient.interceptors.response.use(
  (response) => response,
  (error: Error) => {
    toast.error(error.message);
    throw error;
  }
);
