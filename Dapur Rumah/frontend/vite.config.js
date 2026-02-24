import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        product: resolve(__dirname, 'product.html'),
        seller: resolve(__dirname, 'seller.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
  server: {
    port: 5500,
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'https://dapur-rumah-api.afuitdev.workers.dev',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
