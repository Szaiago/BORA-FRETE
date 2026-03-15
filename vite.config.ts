import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html
            .replace(/\{\{ VITE_SUPABASE_URL \}\}/g, env.VITE_SUPABASE_URL || '')
            .replace(/\{\{ VITE_SUPABASE_ANON_KEY \}\}/g, env.VITE_SUPABASE_ANON_KEY || '');
        }
      }
    ],
    optimizeDeps: {
      exclude: ['lucide-react'],
    }
  };
});
