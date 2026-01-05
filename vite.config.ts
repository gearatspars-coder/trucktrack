import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Standard approach to provide environment variables to the browser in Vite
    // as mandated by the @google/genai SDK integration guidelines.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'recharts', '@google/genai'],
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true
  }
});