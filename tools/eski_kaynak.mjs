// Eski Liman tasarımlarının (Blender stüdyo kareleri, saydam zemin) koleksiyonun fotoğraf diline çevrilmesi için
// başlangıç görselleri: siyah zemin, tepeden spot ışığı ve zeminde ışık havuzu. Bu görseller görsel hattında
// "kaynak" olarak kullanılır; biçim korunur, ışık ve doku fotoğrafa döner.
// Fener'in buzlu başlığı (beton dışı malzeme) yarıklı beton fener odasına çevrilir: ışığı içindeki mumdan gelir.
// kullanım: node tools/eski_kaynak.mjs <kare klasörü> <çıktı klasörü>
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const [GIRDI, CIKTI] = process.argv.slice(2);
mkdirSync(CIKTI, { recursive: true });
const W = 1024, H = 1280;

const URUNLER = [
  { ad: 'fener', kare: '00', boy: 940, taban: 1075 },
  { ad: 'dalgakiran', kare: '00', en: 860, taban: 1010 },
  { ad: 'keson', kare: '00', en: 820, taban: 985 },
  { ad: 'rihtim', kare: '00', en: 780, taban: 975 },
];

const zemin = (cy) => Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>` +
  `<radialGradient id="h"><stop offset="0" stop-color="#4c4c4c"/><stop offset="0.5" stop-color="#1f1f1f"/><stop offset="1" stop-color="#000"/></radialGradient>` +
  `<radialGradient id="a" cx="512" cy="${cy - 420}" r="600" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#191919"/><stop offset="1" stop-color="#000"/></radialGradient>` +
  `</defs><rect width="100%" height="100%" fill="#000"/><rect width="100%" height="100%" fill="url(#a)"/>` +
  `<ellipse cx="512" cy="${cy}" rx="500" ry="165" fill="url(#h)"/></svg>`);

// Fener başlığı: beton silindir, üç dikey yarıktan sızan mum ışığı
function fenerBasligi(ow, oh, alfa) {
  const satir = (y) => {
    let l = -1, r = -1;
    for (let x = 0; x < ow; x++) if (alfa[y * ow + x] > 200) { if (l < 0) l = x; r = x; }
    return l < 0 ? null : [l, r];
  };
  let ust = 0;
  while (ust < oh && !satir(ust)) ust++;
  const genislikler = [];
  for (let y = ust + Math.round(oh * 0.03); y < ust + Math.round(oh * 0.15); y++) { const s = satir(y); if (s) genislikler.push(s[1] - s[0]); }
  genislikler.sort((a, b) => a - b);
  const wc = genislikler[Math.floor(genislikler.length / 2)];
  let yc = ust + Math.round(oh * 0.05);
  while (yc < oh * 0.6) { const s = satir(yc); if (s && s[1] - s[0] > wc * 1.06) break; yc++; }
  const s = satir(ust + Math.round(oh * 0.08));
  const cx = (s[0] + s[1]) / 2, x0 = cx - wc / 2, h = yc - ust, e = wc * 0.12;
  const yarik = (k, gen) => {
    const x = cx + k * wc * 0.3 - gen / 2, y = ust + e + h * 0.16, yy = h * 0.62;
    return `<rect x="${x}" y="${y}" width="${gen}" height="${yy}" rx="${gen / 2}"/>`;
  };
  const yariklar = yarik(-1, wc * 0.05) + yarik(0, wc * 0.075) + yarik(1, wc * 0.05);
  return {
    ust, yc, svg: Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${ow}" height="${oh}"><defs>` +
      `<linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#6a6a6a"/><stop offset="0.32" stop-color="#ababab"/><stop offset="0.6" stop-color="#8e8e8e"/><stop offset="1" stop-color="#454545"/></linearGradient>` +
      `<filter id="b" x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="${wc * 0.035}"/></filter></defs>` +
      `<rect x="${x0 - 2}" y="0" width="${wc + 4}" height="${yc + 2}" fill="url(#g)"/>` +
      `<ellipse cx="${cx}" cy="${ust + e}" rx="${wc / 2}" ry="${e}" fill="#b4b4b4" stroke="#3a3a3a" stroke-width="1.2"/>` +
      `<line x1="${x0}" y1="${yc - 3}" x2="${x0 + wc}" y2="${yc - 3}" stroke="#2c2c2c" stroke-width="2"/>` +
      `<g fill="#fff3dd" opacity="0.75" filter="url(#b)">${yariklar}</g><g fill="#fffaf0">${yariklar}</g></svg>`),
  };
}

for (const u of URUNLER) {
  const kirpik = await sharp(`${GIRDI}/${u.ad}-${u.kare}.png`).trim({ threshold: 8 }).png().toBuffer({ resolveWithObject: true });
  const olcek = u.boy ? u.boy / kirpik.info.height : u.en / kirpik.info.width;
  const ow = Math.round(kirpik.info.width * olcek), oh = Math.round(kirpik.info.height * olcek);
  const { data } = await sharp(kirpik.data).resize(ow, oh).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  // Tam gri ton + tepeden ışık: üst parlak, alt koyu; sol hafif aydınlık. Beton dokusu: iri lekeler ve ince gözenek
  // (model temiz yüzeyi bilgisayar çizimi sanıp öyle bırakıyor; doku onu fotoğrafa yöneltiyor)
  const alfa = new Uint8Array(ow * oh);
  const GX = 40, GY = 50, leke = Float32Array.from({ length: GX * GY }, () => Math.random());
  const lekeAl = (x, y) => {
    const fx = (x / ow) * (GX - 1), fy = (y / oh) * (GY - 1), x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
    const g = (a, b) => leke[Math.min(GY - 1, b) * GX + Math.min(GX - 1, a)];
    return (g(x0, y0) * (1 - tx) + g(x0 + 1, y0) * tx) * (1 - ty) + (g(x0, y0 + 1) * (1 - tx) + g(x0 + 1, y0 + 1) * tx) * ty;
  };
  for (let y = 0; y < oh; y++) for (let x = 0; x < ow; x++) {
    const i = (y * ow + x) * 4;
    const L = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const doku = 0.93 + 0.1 * lekeAl(x, y) + (Math.random() < 0.012 ? -0.35 * Math.random() : 0.05 * (Math.random() - 0.5));
    const f = (1 - 0.3 * (y / oh)) * (1.04 - 0.12 * (x / ow)) * 0.9 * doku;
    const v = Math.max(0, Math.min(255, L * f));
    data[i] = data[i + 1] = data[i + 2] = v;
    alfa[y * ow + x] = data[i + 3];
  }
  let katman = sharp(data, { raw: { width: ow, height: oh, channels: 4 } }).png();
  if (u.ad === 'fener') {
    const b = fenerBasligi(ow, oh, alfa);
    const maske = await sharp(data, { raw: { width: ow, height: oh, channels: 4 } }).png().toBuffer();
    const boyali = await katman.composite([{ input: b.svg }]).png().toBuffer();
    katman = sharp(boyali).composite([{ input: maske, blend: 'dest-in' }]).png();
    console.log(`fener başlığı: satır ${b.ust}–${b.yc}`);
  }
  const nesne = await katman.toBuffer();
  const gren = Buffer.alloc(W * H);
  for (let i = 0; i < gren.length; i++) gren[i] = 128 + (Math.random() + Math.random() + Math.random() - 1.5) * 34;
  const grenPng = await sharp(gren, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
  await sharp(zemin(u.taban - 10))
    .composite([{ input: nesne, left: Math.round((W - ow) / 2), top: u.taban - oh }, { input: grenPng, blend: 'soft-light' }])
    .png().toFile(`${CIKTI}/ss-${u.ad}-kaynak.png`);
  console.log(`KAYNAK ${u.ad} ${ow}x${oh}`);
}
