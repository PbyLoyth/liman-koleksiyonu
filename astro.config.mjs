import { defineConfig } from 'astro/config';

// GitHub Pages: https://pbyloyth.github.io/savana-season/
export default defineConfig({
  site: 'https://pbyloyth.github.io',
  base: '/savana-season',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
