// Görselleri hazırlar: npm run gorseller → public/g/<ad>-<genişlik>.webp ve public/og.jpg
// Kaynak: UMUTMASA'daki görsel hattı (renderlar/vizyon, atölye için renderlar/konsept, Fener ve V2 için renderlar/tur5).
// Her ürünün iki "ana" denemesinden SECIM'deki seçilir; hepsi tam kara-beyaza çevrilir.
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';

const R = process.env.RENDER_KOK ?? 'C:/projects/beton-obje/tasarim/renderlar';
const V = `${R}/vizyon`;
const K = `${R}/konsept`;
const T5 = `${R}/tur5`;

// Fener ve eski Liman tasarımları (V2): Blender stüdyo karelerinden koleksiyonun fotoğraf diline çevrildi
// (tools/eski_kaynak.mjs, sonra görsel hattında ara gürültüyle görselden görsel). Değer: renderlar altındaki yol (uzantısız).
export const ESKI = {};
// Mühür: Umut'un seçtiği kara-beyaz alevli haç (renderlar/tur5, ilk görsel turu)
const AMBLEM = `${R}/tur5/amblem-sb-5012.png`;

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

async function yaz(kaynak, ad, genislikler, oran, kararma = false, renkli = false) {
  if (!kaynak || !existsSync(kaynak)) { eksik.push(ad); return; }
  for (const g of genislikler) {
    const y = Math.round(g / oran);
    let im = sharp(kaynak).resize(g, y, { fit: 'cover', position: 'centre', withoutEnlargement: true });
    if (!renkli) im = im.grayscale().linear(1.05, -3);
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
// Giyim: özel tasarım klasöründeki Seri 2 fotoğrafları (beton-obje/tasarim/giyim/seri2/foto: kalıptan FLUX ile üretilip
// imzası logo.mjs ile işlenmiş, açık gri e-ticaret zemini); ana görsel ilk renk, ikinci görsel öbür renk. Renk ve zemin korunur.
const GIYIM = process.env.GIYIM_KOK ?? 'C:/projects/beton-obje/tasarim/giyim/seri2/foto';
export const GIYIM_GORSEL = {
  'bandana-boxer': ['bandana-boxer-kara', 'bandana-boxer-kemik'],
  'bandana-sort': ['bandana-sort-kara', 'bandana-sort-kemik'],
  'kamuflaj-boxer': ['kamuflaj-boxer-savana', 'kamuflaj-boxer-beton'],
  'kamuflaj-sort': ['kamuflaj-sort-savana', 'kamuflaj-sort-beton'],
  'muhur-boxer': ['muhur-boxer-kara', 'muhur-boxer-kemik'],
  'muhur-sort': ['muhur-sort-kara', 'muhur-sort-beton'],
  'moto-forma': ['moto-forma-kara', 'moto-forma-kemik'],
  'arazi-kaski': ['arazi-kaski-kara', 'arazi-kaski-kemik'],
};
for (const [slug, [a, b]] of Object.entries(GIYIM_GORSEL)) {
  await yaz(`${GIYIM}/${a}.webp`, `${slug}-ana`, [640, 1200], 4 / 5, false, true);
  await yaz(`${GIYIM}/${b}.webp`, `${slug}-detay`, [640, 1200], 4 / 5, false, true);
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
