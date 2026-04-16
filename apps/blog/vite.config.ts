import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      input: 'src/client/entry.tsx',
      output: {
        entryFileNames: 'blog.js',
        assetFileNames: 'blog.[ext]',
      },
    },
  },
});
