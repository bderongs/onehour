import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    minify: true,
    rollupOptions: {
      input: {
        app: './index.html',
      },
    },
    outDir: 'dist/client',
    cssCodeSplit: false, // Force all CSS into a single file
  },
  ssr: {
    target: 'node',
    noExternal: ['react-router-dom', 'react-helmet-async', 'tailwindcss', '@tailwindcss/forms', 'framer-motion']
  },
  optimizeDeps: {
    include: ['tailwindcss', '@tailwindcss/forms']
  },
  server: {
    middlewareMode: false,
    fs: {
      strict: false,
      allow: ['public']
    }
  }
});
