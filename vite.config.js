import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: false, // Disable hot reload on save
  },
  plugins: [
    vue(),
    wasm()
  ],
  base: './',
    build: {
        emptyOutDir: true
    }
  }
);