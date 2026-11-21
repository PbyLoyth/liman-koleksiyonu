// Render klasörlerinden site görsellerini hazırlar: npm run gorseller
// Kaynaklar (dizüstü): renderlar/foto (Tuz, tam boy), renderlar/site ve site2-web (yüzeyler), kullanim-web,
// katedral-web, kaplama ve kaplama-web (koleksiyon görselleri).
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname } from 'node:path';

const R = process.env.RENDER_KOK ?? 'C:/projects/beton-obje/tasarim/renderlar';
const KAP = { beyaz: 'tuz', grafit: 'grafit', tuzbiber: 'tuz-biber', isaret: 'isaret', serpinti: 'serpinti',
  suhatti: 'su-hatti', palet: 'renk' };
const CEKIM = ['keson-ust', 'keson-aci', 'dalgakiran-ust', 'dalgakiran-aci', 'baba-ust', 'baba-aci', 'silo-ust', 'silo-aci',
  'rihtim-ust', 'rihtim-aci', 'antifer-ust', 'antifer-aci', 'fener-aci', 'payanda-ust', 'payanda-aci', 'sapel-ust',
  'sapel-aci', 'kemer-ust', 'kemer-aci', 'demet-ust', 'demet-aci', 'gul-ust', 'gul-aci'];
const KULLANIM = ['dalgakiran', 'baba', 'silo', 'rihtim', 'antifer', 'fener', 'payanda', 'sapel', 'kemer', 'demet', 'gul'];
let yazilan = 0;
const eksik = [];
const ilk = (...yollar) => yollar.find((y) => y && existsSync(y));

async function yaz(kaynak, hedef, w, h, ad) {
  if (!kaynak) { eksik.push(ad ?? hedef); return; }
  mkdirSync(dirname(hedef), { recursive: true });
  await sharp(kaynak).resize(w, h, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true }).toFile(hedef);
  yazilan++;
}

for (const c of CEKIM) {
  const [urun, aci] = c.split('-');
  for (const [k, y] of Object.entries(KAP)) {
    const kaynak = ilk(`${R}/site2-web/${c}-${k}.jpg`, k === 'beyaz' ? `${R}/foto/${c}.jpg` : null, `${R}/site/${c}-${k}.jpg`);
    await yaz(kaynak, `src/assets/urun/${urun}/${y}-${aci}.jpg`, 1600, 2000, `${c}-${k}`);
  }
}
// Kullanım: ürün başına bir görsel, bütün yüzeylerin galerisinde
await yaz(ilk(`${R}/foto/keson-kullanim.jpg`), 'src/assets/urun/keson/kullanim.jpg', 1600, 2000, 'keson-kullanim');
const kulKlasor = `${R}/kullanim-web`;
const kulDosya = existsSync(kulKlasor) ? readdirSync(kulKlasor) : [];
for (const s of KULLANIM) {
  const f = kulDosya.find((d) => d.startsWith(`${s}-kullanim-`) && d.endsWith('.jpg'));
  await yaz(f ? `${kulKlasor}/${f}` : null, `src/assets/urun/${s}/kullanim.jpg`, 1600, 2000, `${s}-kullanim`);
}
// Yüzeyler bölümü: Liman serimi yedi yüzeyde
for (const [k, y] of Object.entries(KAP)) {
  const kaynak = k === 'beyaz' ? ilk(`${R}/foto/koleksiyon-aci.jpg`)
    : ilk(`${R}/kaplama-web/koleksiyon-aci-${k}.jpg`, `${R}/kaplama/koleksiyon-aci-${k}.jpg`);
  await yaz(kaynak, `src/assets/koleksiyon/${y}.jpg`, 2400, 1920, `koleksiyon-${k}`);
}
// Katedral serimi ve kapak
await yaz(ilk(`${R}/katedral-web/katedral-aci-grafit.jpg`), 'src/assets/koleksiyon/kapak.jpg', 2400, 1920, 'katedral-aci-grafit');
await yaz(ilk(`${R}/katedral-web/katedral-kapak-grafit.jpg`), 'src/assets/koleksiyon/kapak-genis.jpg', 2560, 1280, 'katedral-kapak-grafit');
await yaz(ilk(`${R}/katedral-web/katedral-aci-beyaz.jpg`), 'src/assets/koleksiyon/katedral-tuz.jpg', 2400, 1920, 'katedral-aci-beyaz');
await yaz(ilk(`${R}/foto/koleksiyon-aci.jpg`), 'src/assets/koleksiyon/liman-tuz.jpg', 2400, 1920, 'liman');
const og = ilk(`${R}/katedral-web/katedral-aci-grafit.jpg`, `${R}/foto/koleksiyon-aci.jpg`);
if (og) {
  await sharp(og).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82, mozjpeg: true }).toFile('public/og.jpg');
}
console.log(`GÖRSEL ${yazilan} yazıldı, ${eksik.length} eksik`);
if (eksik.length) console.log('  eksik: ' + eksik.join(', '));
