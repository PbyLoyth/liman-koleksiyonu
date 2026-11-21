// Görseller src/assets altında; tools/gorseller.mjs render klasörlerinden üretir.
const urun = import.meta.glob('../assets/urun/*/*.jpg', { eager: true, import: 'default' });
const kol = import.meta.glob('../assets/koleksiyon/*.jpg', { eager: true, import: 'default' });

export const urunGorseli = (slug, yuzey, cekim) =>
  urun[`../assets/urun/${slug}/${yuzey}-${cekim}.jpg`] ?? urun[`../assets/urun/${slug}/tuz-${cekim}.jpg`];

export const cekimler = (u, yuzey) =>
  [...u.gorsel, ...((u.ek && u.ek[yuzey]) || [])]
    .map((cekim) => ({ cekim, img: urunGorseli(u.slug, yuzey, cekim) }))
    .filter((x) => x.img);

export const koleksiyonGorseli = (yuzey) => kol[`../assets/koleksiyon/${yuzey}.jpg`] ?? kol['../assets/koleksiyon/tuz.jpg'];
export const kapakGorseli = () => kol['../assets/koleksiyon/kapak.jpg'];
export const kapakGenis = () => kol['../assets/koleksiyon/kapak-genis.jpg'];

export const cekimAdi = { aci: 'açıdan', ust: 'üstten', kullanim: 'kullanımda' };
