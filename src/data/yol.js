// Taban yolu (GitHub Pages alt klasörü) ile iç bağlantılar
const taban = import.meta.env.BASE_URL.replace(/\/$/, '');

export const yol = (p = '') => `${taban}/${p.replace(/^\//, '')}`;

export const urunYolu = (slug, yuzey = 'tuz') =>
  yuzey === 'tuz' ? yol(`urun/${slug}/`) : yol(`urun/${slug}/${yuzey}/`);

export const tl = (n) => `${n.toLocaleString('tr-TR')} TL`;
