// Görselleri hazırlar: npm run gorseller → public/g/<ad>-<genişlik>.webp ve public/og.jpg
// Kaynak: UMUTMASA'daki görsel hattı (renderlar/vizyon, atölye için renderlar/konsept, Fener ve V2 için renderlar/tur5).
// Her ürünün iki "ana" denemesinden SECIM'deki seçilir; hepsi tam kara-beyaza çevrilir. Mühür renkli kalır.
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';

const R = process.env.RENDER_KOK ?? 'C:/projects/beton-obje/tasarim/renderlar';
const V = `${R}/vizyon`;
const K = `${R}/konsept`;
const T5 = `${R}/tur5`;

// Fener ve eski Liman tasarımları (V2): Blender stüdyo karelerinden koleksiyonun fotoğraf diline çevrildi
// (tools/eski_kaynak.mjs, sonra görsel hattında ara gürültüyle görselden görsel). Değer: renderlar altındaki yol (uzantısız).
export const ESKI = {
  fener: { ana: 'tur8/v2-fener-s857-9101', detay: 'tur8/v2-fener-detay-s857-9301' },
  'dalgakiran-v2': { ana: 'tur8/v2-dalgakiran-s857-9102', detay: 'tur8/v2-dalgakiran-detay-s857-9302' },
  'keson-v2': { ana: 'tur6/v2-keson-g75-7402', detay: 'tur8/v2-keson-detay-s857-9302' },
  'rihtim-v2': { ana: 'tur8/v2-rihtim-s857-9101', detay: 'tur8/v2-rihtim-detay-s857-9301' },
};
// Mühür: alevli haç (tools/muhur.mjs); sitedeki tek renk ateştir, bu yüzden renkli kalır
const AMBLEM = `${R}/tur8/muhur-son-a.png`;

// Seçilen ana deneme (tohumun son hanesi: 1 ya da 2); yazılmayan ürün için 1
export const SECIM = {
  kemer: 2, payanda: 2, sapel: 1, gul: 1, demet: 1, dalgakiran: 1, baba: 1, keson: 2, silo: 2,
  rihtim: 1, antifer: 1, kiris: 2, somun: 1, percin: 1, flans: 1, donati: 1, baca: 1,
};
// Katedral 1'de sunakta haç vardı; Fabrika 1'de kutuda anlamsız işaretler
const KAMPANYA_SECIM = { katedral: 2, fabrika: 2, liman: 1 };

mkdirSync('public/g', { recursive: true });
let n = 0;
const eksik = [];

// Ürün karelerinin kenarı yumuşakça tam siyaha iner: zemin sayfayla birleşir, kare sınırı görünmez
const kenar = (g, y) => Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${g}" height="${y}"><defs><radialGradient id="k" cx="50%" cy="50%" r="62%">` +
  `<stop offset="0.62" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient></defs>` +
  `<rect width="100%" height="100%" fill="url(#k)"/></svg>`);

async function yaz(kaynak, ad, genislikler, oran, kararma = false) {
  if (!kaynak || !existsSync(kaynak)) { eksik.push(ad); return; }
  for (const g of genislikler) {
    const y = Math.round(g / oran);
    let im = sharp(kaynak).resize(g, y, { fit: 'cover', position: 'centre', withoutEnlargement: true }).grayscale().linear(1.05, -3);
    if (kararma) {
      // büyütme yapılmadığı için gerçek boyut istenenden küçük olabilir: kararma katmanı gerçek boyutta
      const { data, info } = await im.toBuffer({ resolveWithObject: true });
      im = sharp(data).composite([{ input: kenar(info.width, info.height), blend: 'multiply' }]);
    }
    await im.webp({ quality: 82, effort: 5 }).toFile(`public/g/${ad}-${g}.webp`);
  }
  n++;
}

const dosyalar = existsSync(V) ? readdirSync(V) : [];
const bul = (onek, son) => {
  const f = dosyalar.filter((d) => d.startsWith(onek) && d.endsWith('.png')).sort();
  const s = son ? f.find((d) => d.endsWith(`${son}.png`)) : null;
  return s ? `${V}/${s}` : f[0] ? `${V}/${f[0]}` : null;
};

const URUNLER = ['kemer', 'payanda', 'sapel', 'gul', 'demet', 'dalgakiran', 'baba', 'keson', 'silo', 'rihtim', 'antifer',
  'kiris', 'somun', 'percin', 'flans', 'donati', 'baca'];
for (const s of URUNLER) {
  await yaz(bul(`${s}-ana-`, SECIM[s]), `${s}-ana`, [640, 1200], 4 / 5, true);
  await yaz(bul(`${s}-detay-`), `${s}-detay`, [640, 1200], 4 / 5, true);
}
for (const [slug, s] of Object.entries(ESKI)) {
  await yaz(`${R}/${s.ana}.png`, `${slug}-ana`, [640, 1200], 4 / 5, true);
  await yaz(`${R}/${s.detay}.png`, `${slug}-detay`, [640, 1200], 4 / 5, true);
}
if (existsSync(AMBLEM)) {
  for (const g of [256, 512, 1024]) {
    await sharp(AMBLEM).resize(g, g, { fit: 'cover' }).webp({ quality: 84, effort: 5 }).toFile(`public/g/amblem-${g}.webp`);
  }
  n++;
} else eksik.push('amblem');
for (const k of ['katedral', 'fabrika', 'liman']) {
  await yaz(bul(`kampanya-${k}-`, KAMPANYA_SECIM[k]), `kampanya-${k}`, [960, 1536], 16 / 9);
}
for (const [kaynak, ad] of [['dokum-101', 'atolye-dokum'], ['atolye-111', 'atolye-kesim'], ['makro-121', 'atolye-kazima']]) {
  await yaz(`${K}/${kaynak}.png`, ad, [960, 1536], 16 / 9);
}
// Paylaşım görseli artık giriş görselinden (tools/giris.mjs); o yoksa Katedral kampanyasından
const og = bul('kampanya-katedral-', KAMPANYA_SECIM.katedral);
if (og && !existsSync(`${R}/tur8/giris-yatay-son.png`)) await sharp(og).resize(1200, 630, { fit: 'cover' }).grayscale().jpeg({ quality: 82, mozjpeg: true }).toFile('public/og.jpg');
console.log(`GÖRSEL ${n} yazıldı${eksik.length ? `, eksik: ${eksik.join(', ')}` : ''}`);
