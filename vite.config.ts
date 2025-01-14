import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Chỉ định thư mục gốc cho alias "@"
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
})
