import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import EnvironmentPlugin from 'vite-plugin-environment';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin([
      'VITE_API_URL',
      'VITE_TENOR_API_KEY',
      'VITE_WEB_PUSH_PUBLIC_KEY',
      'VITE_GITHUB_ACCESS_TOKEN',
    ]),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
