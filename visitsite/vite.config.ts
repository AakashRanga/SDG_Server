import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Default port fallback
const DEFAULT_PORT = 8081;

export default defineConfig(({ mode }) => {
  const rootDir = path.resolve(__dirname, '..');
  const env = loadEnv(mode, rootDir, '');
  const port = Number(env.VISITSITE_PORT || env.PORT || process.env.VISITSITE_PORT || process.env.PORT) || DEFAULT_PORT;

  return {
    envDir: rootDir,
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port,
      strictPort: true,
      allowedHosts: ["sdg.saveetha.com", "sdg.localhost", "localhost", "127.0.0.1"],
      proxy: {
        '/api': {
          target: 'https://sdgportal.saveetha.com',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    preview: {
      host: '0.0.0.0',
      port,
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      chunkSizeWarningLimit: 2500,
      rollupOptions: {
        output: {
          format: 'es',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          manualChunks: {
            vendor: ['react', 'react-dom'],
          }
        }
      }
    }
  };
});