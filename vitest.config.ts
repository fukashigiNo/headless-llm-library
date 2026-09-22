import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import swc from 'unplugin-swc';
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.build.json', 

    }),
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