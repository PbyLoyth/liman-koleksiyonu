// Görseller. Stüdyo dönüş kareleri public/donus altında (ürün/yüzey/b|k/NN.webp; b: 1000 px, k: 500 px).
// Masada ve editoryal görseller src/assets altında, Astro boyutlandırır. Hepsini tools/gorseller.mjs üretir.
import { existsSync } from 'node:fs';
import { yol } from './yol.js';

const masada = import.meta.glob('../assets/masada/*.jpg', { eager: true, import: 'default' });
const editoryal = import.meta.glob('../assets/editoryal/*.jpg', { eager: true, import: 'default' });

export const KARE = 24;
export const KAPAK_KARE = 48;

export const donusKok = (slug, yuzey) => yol(`donus/${slug}/${yuzey}/`);

/** Çekimi bitmiş yüzeyler: dönüş kareleri public/donus altında olanlar (yarım çekimle yayın bozulmasın) */
export const cekildi = (slug, yuzey) => existsSync(`public/donus/${slug}/${yuzey}/b/23.webp`);
export const kapakKok = (slug) => yol(`donus/kapak/${slug}/`);

/** İlk kare: dönüşün 0° karesi, iki boyda */
export const ilkKare = (kok) => ({ src: `${kok}b/00.webp`, srcset: `${kok}k/00.webp 500w, ${kok}b/00.webp 1000w` });

export const masadaGorsel = (slug) => masada[`../assets/masada/${slug}.jpg`];

// Zeminli fotoğraflar (public/foto): açıdan ve üstten, her yüzeyde; koleksiyon serimleri ve kapakları
export const cekimAdi = { aci: 'Açıdan', ust: 'Üstten' };
export const foto = (slug, yuzey, cekim) => {
  const k = yol(`foto/${slug}/${yuzey}-${cekim}`);
  return { src: `${k}-1200.webp`, srcset: `${k}-640.webp 640w, ${k}-1200.webp 1200w` };
};
export const fotoVar = (slug, yuzey, cekim) => existsSync(`public/foto/${slug}/${yuzey}-${cekim}-1200.webp`);
export const serim = (ad, yuzey) => {
  const k = yol(`foto/serim/${ad}-${yuzey}`);
  return { src: `${k}-1800.webp`, srcset: `${k}-960.webp 960w, ${k}-1800.webp 1800w` };
};
export const serimVar = (ad, yuzey) => existsSync(`public/foto/serim/${ad}-${yuzey}-1800.webp`);
export const kapakFoto = (ad) => {
  const k = yol(`foto/serim/${ad}-kapak`);
  return { src: `${k}-2400.webp`, srcset: `${k}-1280.webp 1280w, ${k}-2400.webp 2400w` };
};
export const editoryalGorsel = (ad) => editoryal[`../assets/editoryal/${ad}.jpg`];
export const ogGorsel = (slug, yuzey) => yol(`og/${slug}-${yuzey}.jpg`);

// Masada sahneleri: render ayarlarındaki zemin, ışık ve yüzey (koleksiyon.py, FOTO kullanım çekimleri)
export const sahneler = {
  payanda: { yuzey: 'grafit', sahne: 'Kara mermer, akşam' },
  sapel: { yuzey: 'tuz', sahne: 'Arduvaz, gece' },
  gul: { yuzey: 'renk', sahne: 'Bordo kadife' },
  kemer: { yuzey: 'renk', sahne: 'Ceviz masa' },
  demet: { yuzey: 'tuz', sahne: 'Traverten, kuru ay otu' },
  baba: { yuzey: 'renk', sahne: 'Kara mermer, gece' },
  rihtim: { yuzey: 'serpinti', sahne: 'Arduvaz, akşam' },
  silo: { yuzey: 'tuz-biber', sahne: 'Traverten' },
  antifer: { yuzey: 'grafit', sahne: 'Ceviz masa' },
  dalgakiran: { yuzey: 'tuz', sahne: 'Ceviz masa' },
  keson: { yuzey: 'tuz', sahne: 'Kaba beton' },
  fener: { yuzey: 'tuz', sahne: 'Kara mermer, gece' },
};
