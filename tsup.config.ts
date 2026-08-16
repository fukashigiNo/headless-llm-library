import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/react/index.ts'], // Точка входа в нашу библиотеку
  format: ['cjs', 'esm'],  // Собираем для старых (CommonJS) и новых (ES Modules) проектов
  dts: true,               // Генерируем типы TypeScript
  splitting: false,
  sourcemap: true,
  clean: true,             // Очищать папку dist перед каждой сборкой
  external: ['react'],     // React не должен попадать в бандл, он должен быть установлен у пользователя
});