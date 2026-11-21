// Render klasörlerinden site görsellerini hazırlar: npm run gorseller
// Beyaz (Tuz) çekimler renderlar/foto, diğer yüzeyler renderlar/site, koleksiyon yüzeyleri renderlar/kaplama.
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const R = process.env.RENDER_KOK ?? 'C:/projects/beton-obje/tasarim/renderlar';
const KAP = { beyaz: 'tuz', tuzbiber: 'tuz-biber', isaret: 'isaret', serpinti: 'serpinti', suhatti: 'su-hatti', palet: 'renk' };
const CEKIM = ['keson-ust', 'keson-aci', 'dalgakiran-ust', 'dalgakiran-aci', 'baba-ust', 'baba-aci', 'silo-ust', 'silo-aci',
  'rihtim-ust', 'rihtim-aci', 'antifer-ust', 'antifer-aci', 'fener-aci'];
let yazilan = 0, eksik = [];

async function yaz(kaynak, hedef, w, h) {
  if (!existsSync(kaynak)) { eksik.push(kaynak); return; }
  mkdirSync(dirname(hedef), { recursive: true });
  await sharp(kaynak).resize(w, h, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true }).toFile(hedef);
  yazilan++;
}

for (const c of CEKIM) {
  const [urun, aci] = c.split('-');
  for (const [k, y] of Object.entries(KAP)) {
    const kaynak = k === 'beyaz' ? `${R}/foto/${c}.jpg` : `${R}/site/${c}-${k}.jpg`;
    await yaz(kaynak, `src/assets/urun/${urun}/${y}-${aci}.jpg`, 1600, 2000);
  }
}
await yaz(`${R}/foto/keson-kullanim.jpg`, 'src/assets/urun/keson/tuz-kullanim.jpg', 1600, 2000);
for (const [k, y] of Object.entries(KAP)) {
  const kaynak = k === 'beyaz' ? `${R}/foto/koleksiyon-aci.jpg` : `${R}/kaplama/koleksiyon-aci-${k}.jpg`;
  await yaz(kaynak, `src/assets/koleksiyon/${y}.jpg`, 2400, 1920);
}
await yaz(`${R}/foto/koleksiyon-ust.jpg`, 'src/assets/koleksiyon/kapak.jpg', 2400, 1920);
await yaz(`${R}/foto/kapak-ust.jpg`, 'src/assets/koleksiyon/kapak-genis.jpg', 2560, 1280);
if (existsSync(`${R}/foto/koleksiyon-aci.jpg`)) {
  await sharp(`${R}/foto/koleksiyon-aci.jpg`).resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 82, mozjpeg: true }).toFile('public/og.jpg');
}
console.log(`GÖRSEL ${yazilan} yazıldı, ${eksik.length} eksik`);
if (eksik.length) console.log(eksik.map((e) => '  - ' + e.replace(R + '/', '')).join('\n'));
