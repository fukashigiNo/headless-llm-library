import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [
    vue(),
    swc.vite({
      jsc: {
        parser: {
          syntax: "typescript",
          decorators: true,
        },
        transform: {
          decoratorMetadata: true,
        },
      },
    }),
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
  }
});