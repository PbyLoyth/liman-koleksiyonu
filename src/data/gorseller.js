// Görseller src/assets altında; tools/gorseller.mjs render klasörlerinden üretir.
const urun = import.meta.glob('../assets/urun/*/*.jpg', { eager: true, import: 'default' });
const kol = import.meta.glob('../assets/koleksiyon/*.jpg', { eager: true, import: 'default' });

export const urunGorseli = (slug, yuzey, cekim) =>
  urun[`../assets/urun/${slug}/${yuzey}-${cekim}.jpg`] ?? urun[`../assets/urun/${slug}/tuz-${cekim}.jpg`];

export const kullanimGorseli = (slug) => urun[`../assets/urun/${slug}/kullanim.jpg`];

// Yüzeye özgü çekimler, ardından (varsa) bütün yüzeylerde ortak kullanım görseli
export const cekimler = (u, yuzey) => {
  const liste = u.gorsel.map((cekim) => ({ cekim, img: urunGorseli(u.slug, yuzey, cekim) })).filter((x) => x.img);
  const k = kullanimGorseli(u.slug);
  if (k) liste.push({ cekim: 'kullanim', img: k });
  return liste;
};

export const koleksiyonGorseli = (ad) => kol[`../assets/koleksiyon/${ad}.jpg`] ?? kol['../assets/koleksiyon/tuz.jpg'];

export const cekimAdi = { aci: 'açıdan', ust: 'üstten', kullanim: 'kullanımda' };
