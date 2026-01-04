import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Since files are in root, we don't need a custom root entry 
  // unless your index.html points to a different path.
})
