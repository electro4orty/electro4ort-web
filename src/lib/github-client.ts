import axios from 'axios';
import { toast } from 'sonner';

const apiUrl = 'https://api.github.com';

export const githubClient = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${process.env.VITE_GITHUB_ACCESS_TOKEN}`,
  },
});

githubClient.interceptors.response.use(
  (response) => response,
  (error: Error) => {
    toast.error(error.message);
    throw error;
  }
);
