import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Plugin } from 'vite';

// Plugin to inject build date meta tag
const injectBuildDate = (): Plugin => ({
  name: 'inject-build-date',
  transformIndexHtml: {
    enforce: 'pre',
    transform(html) {
      const buildDate = new Date().toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      return html.replace(
        '</head>',
        `  <meta name="build-date" content="${buildDate}" />\n</head>`
      );
    },
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), injectBuildDate()],
  base: '/',
  define: {
    'import.meta.env.VITE_BUILD_DATE': JSON.stringify(new Date().toISOString()),
  },
  server: {
    middlewareMode: false,
    fs: {
      strict: false,
      allow: ['public']
    }
  }
});
