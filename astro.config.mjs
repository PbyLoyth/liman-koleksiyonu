import { defineConfig } from 'astro/config';

// GitHub Pages: https://pbyloyth.github.io/liman-koleksiyonu/
export default defineConfig({
  site: 'https://pbyloyth.github.io',
  base: '/liman-koleksiyonu',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
