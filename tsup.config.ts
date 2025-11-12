import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['BP/scripts/main/index.ts'],
  format: ['esm'],
  dts: true,
  minify: true,
  sourcemap: true,
  clean: true,
  outDir: 'BP/scripts/dist',
  outExtension: ({ format }) => ({
    js: '.js',
    dts: '.d.ts' // WY ITS NOT WORKING
  })
})
