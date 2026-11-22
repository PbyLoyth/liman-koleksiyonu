// Fotoğrafları hazırlar: npm run gorseller   (dönüş kareleri ayrı: npm run kareler)
//  public/foto/<ürün>/<yüzey>-<açı|üst>-<640|1200>.webp  zeminli ürün fotoğrafları (açıdan, üstten)
//  public/foto/serim/<liman|katedral>-<yüzey>-<960|1800>.webp  koleksiyon serimleri; *-kapak geniş kapaklar
//  src/assets/masada/<ürün>.jpg  kullanım sahneleri (Astro boyutlandırır)
//  public/og.jpg  ana sayfa paylaşım görseli
// Kaynak: renderlar/site3-web (22 Kas ikinci tur: Krom ve yeni imza renkleri), site2-web, site, foto, kaplama-web,
// katedral-web, kullanim-web. Rengi değişen ürünlerin "Renk" fotoğrafı ve bütün Krom fotoğrafları yalnız site3'ten.
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname } from 'node:path';

const R = process.env.RENDER_KOK ?? 'C:/projects/beton-obje/tasarim/renderlar';
// Yalnız beton ve çelik (22 Kas kuralı); renkli boya yüzeyleri artık üretilmez
const KAP = { beyaz: 'tuz', grafit: 'grafit', brut: 'brut', lansman: 'lansman', kara: 'kara' };
const CEKIM = {
  payanda: ['aci', 'ust'], sapel: ['aci', 'ust'], kemer: ['aci', 'ust'], demet: ['aci', 'ust'], gul: ['aci', 'ust'],
  keson: ['aci', 'ust'], dalgakiran: ['aci', 'ust'], baba: ['aci', 'ust'], silo: ['aci', 'ust'], rihtim: ['aci', 'ust'],
  antifer: ['aci', 'ust'], fener: ['aci'],
};
const RENGI_DEGISEN = new Set(['keson', 'fener', 'antifer', 'rihtim', 'payanda', 'sapel', 'gul']);
const ilk = (...yollar) => yollar.find((y) => y && existsSync(y));
let yazilan = 0;
const eksik = [];

async function webp(kaynak, hedefTaban, genislikler, oran) {
  for (const g of genislikler) {
    const hedef = `${hedefTaban}-${g}.webp`;
    mkdirSync(dirname(hedef), { recursive: true });
    await sharp(kaynak)
      .resize(g, Math.round(g / oran), { fit: 'cover', position: 'centre' })
      .webp({ quality: 80, effort: 5 })
      .toFile(hedef);
  }
  yazilan++;
}

// Ürün fotoğrafları
for (const [urun, cekimler] of Object.entries(CEKIM)) {
  for (const cekim of cekimler) {
    for (const [k, y] of Object.entries(KAP)) {
      const ad = `${urun}-${cekim}`;
      const yalnizYeni = k === 'lansman' || (k === 'palet' && RENGI_DEGISEN.has(urun));
      const kaynak = yalnizYeni
        ? ilk(`${R}/site3-web/${ad}-${k}.jpg`)
        : ilk(`${R}/site3-web/${ad}-${k}.jpg`, `${R}/site2-web/${ad}-${k}.jpg`, k === 'beyaz' ? `${R}/foto/${ad}.jpg` : null,
            `${R}/site/${ad}-${k}.jpg`);
      if (!kaynak) {
        eksik.push(`${ad}-${k}`);
        continue;
      }
      await webp(kaynak, `public/foto/${urun}/${y}-${cekim}`, [640, 1200], 4 / 5);
    }
  }
}

// Serimler (koleksiyon fotoğrafları), 5:4
const SERIM = {
  liman: (k) => (k === 'beyaz' ? ilk(`${R}/foto/koleksiyon-aci.jpg`)
    : ilk(`${R}/site3-web/koleksiyon-aci-${k}.jpg`, k === 'palet' ? null : `${R}/kaplama-web/koleksiyon-aci-${k}.jpg`)),
  katedral: (k) => ilk(`${R}/site3-web/katedral-aci-${k}.jpg`, `${R}/katedral-web/katedral-aci-${k}.jpg`),
};
for (const [ad, bul] of Object.entries(SERIM)) {
  for (const [k, y] of Object.entries(KAP)) {
    const kaynak = bul(k);
    if (kaynak) await webp(kaynak, `public/foto/serim/${ad}-${y}`, [960, 1800], 5 / 4);
  }
}
const kapaklar = { katedral: `${R}/katedral-web/katedral-kapak-grafit.jpg`, liman: `${R}/foto/kapak-ust.jpg` };
for (const [ad, kaynak] of Object.entries(kapaklar)) {
  if (existsSync(kaynak)) await webp(kaynak, `public/foto/serim/${ad}-kapak`, [1280, 2400], 2);
  else eksik.push(`${ad}-kapak`);
}

// Masada: ürün başına bir kullanım sahnesi (Gül yeni rengiyle site3'te)
const kulKlasor = `${R}/kullanim-web`;
const kulDosya = existsSync(kulKlasor) ? readdirSync(kulKlasor) : [];
for (const s of Object.keys(CEKIM)) {
  const f = kulDosya.find((d) => d.startsWith(`${s}-kullanim-`) && d.endsWith('.jpg'));
  const kaynak = ilk(`${R}/site3-web/${s}-kullanim-palet.jpg`, f ? `${kulKlasor}/${f}` : null, `${R}/foto/${s}-kullanim.jpg`);
  if (!kaynak) {
    eksik.push(`${s}-kullanim`);
    continue;
  }
  mkdirSync('src/assets/masada', { recursive: true });
  await sharp(kaynak).resize(1600, 2000, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true })
    .toFile(`src/assets/masada/${s}.jpg`);
  yazilan++;
}

// Ana sayfa paylaşım görseli: Katedral serimi, Grafit, kara mermer
const og = ilk(`${R}/katedral-web/katedral-aci-grafit.jpg`, `${R}/foto/koleksiyon-aci.jpg`);
if (og) await sharp(og).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82, mozjpeg: true }).toFile('public/og.jpg');

console.log(`GÖRSEL ${yazilan} yazıldı, ${eksik.length} eksik${eksik.length ? ': ' + eksik.slice(0, 12).join(', ') + (eksik.length > 12 ? ' …' : '') : ''}`);
