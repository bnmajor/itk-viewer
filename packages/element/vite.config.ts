import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  publicDir: '../../test/data/input',
  build: {
    lib: {
      entry: 'src/itk-viewer-element.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: /^lit/,
    },
  },
  optimizeDeps: {
    exclude: ['@itk-wasm/htj2k', 'itk-wasm'],
  },
  plugins: [
    // collect lazy loaded JavaScript and Wasm bundles in public directory
    viteStaticCopy({
      targets: [
        {
          src: '../io/node_modules/itk-wasm/dist/web-workers/*',
          dest: 'itk/web-workers',
        },
        {
          src: '../io/node_modules/itk-image-io/*',
          dest: 'itk/image-io',
        },
        {
          src: '../blosc-zarr/emscripten-build/*',
          dest: 'itk/pipelines',
        },
      ],
    }),
  ],
});
