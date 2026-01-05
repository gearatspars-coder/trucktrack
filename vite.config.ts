import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: './', // Tells Vite index.html is in the root
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), // Explicitly link the root html
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Helper for clean imports
    },
  },
});
