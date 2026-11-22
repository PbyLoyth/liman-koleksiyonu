// Görseller public/g altında (tools/gorsel.mjs üretir): <ad>-<genişlik>.webp
import { existsSync } from 'node:fs';

const taban = import.meta.env.BASE_URL.replace(/\/$/, '');
export const yol = (p = '') => `${taban}/${p.replace(/^\//, '')}`;

/** Dikey ürün görseli (4:5): 640 ve 1200 px */
export const dikey = (ad) => ({
  src: yol(`g/${ad}-1200.webp`),
  srcset: `${yol(`g/${ad}-640.webp`)} 640w, ${yol(`g/${ad}-1200.webp`)} 1200w`,
});

/** Geniş görsel (16:9): 960 ve 1536 px */
export const genis = (ad) => ({
  src: yol(`g/${ad}-1536.webp`),
  srcset: `${yol(`g/${ad}-960.webp`)} 960w, ${yol(`g/${ad}-1536.webp`)} 1536w`,
});

export const var_ = (ad, g = 1200) => existsSync(`public/g/${ad}-${g}.webp`);

/** public altındaki herhangi bir dosya var mı (video gibi) */
export const dosyaVar = (p) => existsSync(`public/${p.replace(/^\//, '')}`);
