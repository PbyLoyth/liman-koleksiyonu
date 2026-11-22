// Kampanya görselleri: kendi çekimlerimizden kara-beyaz, yüksek kontrast, film grenli, köşeleri kararmış kareler.
// npm run kampanya  →  public/kampanya/<ad>-<900|1800>.jpg
// Ayrıca UMUTMASA'da üretilen konsept görselleri (renderlar/konsept/*.png) aynı işlemle public/konsept'e yazılır.
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';

const R = process.env.RENDER_KOK ?? 'C:/projects/beton-obje/tasarim/renderlar';
const KAMPANYA = [
  ['kemer-ayna', `${R}/site3-web/kemer-aci-lansman.jpg`],
  ['sapel-ayna', `${R}/site3-web/sapel-aci-lansman.jpg`],
  ['gul-ayna', `${R}/site3-web/gul-aci-lansman.jpg`],
  ['payanda-ayna', `${R}/site3-web/payanda-aci-lansman.jpg`],
  ['katedral-grafit', `${R}/katedral-web/katedral-aci-grafit.jpg`],
  ['katedral-genis', `${R}/katedral-web/katedral-kapak-grafit.jpg`],
  ['payanda-masada', `${R}/kullanim-web/payanda-kullanim-grafit.jpg`],
  ['sapel-gece', `${R}/kullanim-web/sapel-kullanim-beyaz.jpg`],
  ['liman-ust', `${R}/foto/kapak-ust.jpg`],
  ['demet-masada', `${R}/kullanim-web/demet-kullanim-beyaz.jpg`],
];

async function karaBeyaz(kaynak, hedefTaban, genislikler, gren = 0.13) {
  const meta = await sharp(kaynak).metadata();
  for (const g of genislikler) {
    const y = Math.round((g * meta.height) / meta.width);
    const temel = await sharp(kaynak).resize(g, y).grayscale().linear(1.32, -34).toBuffer();
    const gurultu = await sharp({ create: { width: g, height: y, channels: 3, background: '#808080', noise: { type: 'gaussian', mean: 128, sigma: 42 } } })
      .grayscale().ensureAlpha(gren).png().toBuffer();
    const vinyet = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${g}" height="${y}"><defs><radialGradient id="v" cx="50%" cy="50%" r="72%">` +
      `<stop offset="55%" stop-color="#fff"/><stop offset="100%" stop-color="#6b6b6b"/></radialGradient></defs>` +
      `<rect width="100%" height="100%" fill="url(#v)"/></svg>`,
    );
    mkdirSync(hedefTaban.replace(/\/[^/]+$/, ''), { recursive: true });
    await sharp(temel)
      .composite([{ input: vinyet, blend: 'multiply' }, { input: gurultu, blend: 'overlay' }])
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(`${hedefTaban}-${g}.jpg`);
  }
}

let n = 0;
for (const [ad, kaynak] of KAMPANYA) {
  if (!existsSync(kaynak)) { console.log('YOK', kaynak); continue; }
  await karaBeyaz(kaynak, `public/kampanya/${ad}`, [900, 1800]);
  n++;
}

// Konsept görselleri (FLUX.1 schnell, UMUTMASA): renkli olanlar da kara-beyaza çevrilir, hafif gren
const K = `${R}/konsept`;
let k = 0;
if (existsSync(K)) {
  // Yalnız seçilen denemeler yayına girer (src/data/konsept.js ile aynı liste)
  const SECILEN = new Set(['kiris-11', 'somun-21', 'percin-31', 'flans-42', 'donati-51', 'kule-61', 'kemer-celik-72',
    'sapel-beton-81', 'katedral-91', 'dokum-101', 'atolye-111', 'makro-121', 'zincir-131']);
  for (const f of readdirSync(K).filter((d) => d.endsWith('.png') && SECILEN.has(d.replace(/\.png$/, '')))) {
    await karaBeyaz(`${K}/${f}`, `public/konsept/${f.replace(/\.png$/, '')}`, [800, 1400], 0.09);
    k++;
  }
}
console.log(`KAMPANYA ${n} kare, KONSEPT ${k} kare`);
