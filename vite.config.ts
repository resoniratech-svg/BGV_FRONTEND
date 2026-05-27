import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // You may need to run: npm install -D @types/node

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});