import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    react: 'src/react/index.ts',
    vue: 'src/vue/index.ts',
    angular: 'src/angular/index.ts' 
  }, 
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'vue', '@angular/core'], 
});