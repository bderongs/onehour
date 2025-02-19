import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  base: '/',
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    minify: mode === 'production',
    manifest: true,
    rollupOptions: {
      input: {
        app: './index.html',
      },
      output: {
        // Ensure CSS is emitted as a separate file
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'assets/index.css';
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    outDir: 'dist/client',
    cssCodeSplit: false, // Force all CSS into a single file
  },
  ssr: {
    target: 'node',
    format: 'esm',
    noExternal: ['react-helmet-async'],
  },
  optimizeDeps: {
    // Pre-bundle these dependencies
    include: [
      'react',
      'react-dom',
      'react-dom/server',
      'react-router-dom',
      'react-helmet-async'
    ],
  },
  resolve: {
    // This is needed for proper SSR with React
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    middlewareMode: true,
    hmr: {
      protocol: 'ws',
      timeout: 30000
    },
    watch: {
      usePolling: true,
      interval: 100
    },
    fs: {
      strict: false,
      allow: ['public', 'node_modules']
    }
  }
}));
