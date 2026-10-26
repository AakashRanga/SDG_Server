import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const DEFAULT_PORT = 8080;

export default defineConfig(({ mode }) => {
  const rootDir = path.resolve(__dirname, '..');
  const env = loadEnv(mode, rootDir, '');
  const port = Number(env.WEBSITE_PORT || env.PORT || process.env.WEBSITE_PORT || process.env.PORT) || DEFAULT_PORT;

  return {
    envDir: rootDir,
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port,
      strictPort: true,
      allowedHosts: ['sdgportal.saveetha.com', 'localhost', '127.0.0.1'],
      proxy: {
        '/uploads': {
          target: 'http://localhost:8006',
          changeOrigin: true
        }
      }
    },
    preview: {
      host: '0.0.0.0',
      port,
      proxy: {
        '/uploads': {
          target: 'http://localhost:8006',
          changeOrigin: true
        }
      }
    },
  };
});