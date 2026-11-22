// Konseptler: "neler yapabiliriz". Görseller UMUTMASA'da FLUX.1 schnell (Apache 2.0) ile üretildi, kara-beyaza
// çevrildi (tools/kampanya.mjs → public/konsept). Hepsi tek malzeme: ya beton ya çelik.
import { existsSync } from 'node:fs';
import { yol } from './yol.js';

export const konseptler = [
  { ad: 'Kiriş', gorsel: 'kiris-11', malzeme: 'Çelik', rol: 'Kitap desteği',
    metin: 'I-profil kirişten kesilir: gövdede sivri kemer penceresi, flanşlarda perçin sırası.' },
  { ad: 'Somun', gorsel: 'somun-21', malzeme: 'Çelik', rol: 'Şamdan',
    metin: 'Dev bir altıgen somun; her yüzünde kararmış dörtyaprak kazıma.' },
  { ad: 'Perçin', gorsel: 'percin-31', malzeme: 'Kara çelik', rol: 'Kutu',
    metin: 'Perçinli levhalardan küçük bir mahfaza; yanlarında sivri kemer, kapağında kule tutamak.' },
  { ad: 'Flanş', gorsel: 'flans-42', malzeme: 'Çelik', rol: 'Tealight',
    metin: 'Boru flanşı: cıvata delikleri yerinde, ortası gül pencere.' },
  { ad: 'Donatı', gorsel: 'donati-51', malzeme: 'Brüt beton', rol: 'Vazo',
    metin: 'Tahta kalıp izi ve donatı dokusu; gövdede katedral sütunu gibi oluklar.' },
  { ad: 'Baca', gorsel: 'kule-61', malzeme: 'Brüt beton', rol: 'Tütsülük',
    metin: 'Fabrika bacasının tepesinde gotik kule; duman sivri yarıklardan çıkar.' },
  { ad: 'Kemer, çelik', gorsel: 'kemer-celik-72', malzeme: 'Çelik', rol: 'Kitap desteği',
    metin: 'Kemer’in kalın çelik levhadan hâli; birleşimlerde açıkta cıvatalar.' },
  { ad: 'Şapel, brüt', gorsel: 'sapel-beton-81', malzeme: 'Brüt beton', rol: 'Mum feneri',
    metin: 'Tahta kalıp dokulu ham beton; ışık iki sivri pencereden süzülür.' },
];

// Atölye ve hava görselleri (aynı üretimden)
export const atolye = {
  katedral: 'katedral-91',
  dokum: 'dokum-101',
  kesim: 'atolye-111',
  makro: 'makro-121',
  zincir: 'zincir-131',
};

export const konseptGorsel = (ad) => {
  const k = yol(`konsept/${ad}`);
  return { src: `${k}-1400.jpg`, srcset: `${k}-800.jpg 800w, ${k}-1400.jpg 1400w` };
};
export const konseptVar = (ad) => existsSync(`public/konsept/${ad}-1400.jpg`);

export const kampanya = (ad) => {
  const k = yol(`kampanya/${ad}`);
  return { src: `${k}-1800.jpg`, srcset: `${k}-900.jpg 900w, ${k}-1800.jpg 1800w` };
};
export const kampanyaVar = (ad) => existsSync(`public/kampanya/${ad}-1800.jpg`);
