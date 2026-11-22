// Mühür (alevli haç) ve giriş görselindeki nişin başlangıç görselleri.
// Görsel modeli eşit kollu haçı kendiliğinden çizemiyor (hep Latin haçı çiziyor; yanan Latin haçı da istenmeyen bir
// çağrışım taşıyor). Bu yüzden biçimi biz veriyoruz: kendi haç çizimimiz (src/data/amblem.js) başlangıç görseline
// konur, model yalnız malzemeyi, ışığı ve alevi fotoğrafa çevirir.
// kullanım: node tools/muhur_kaynak.mjs <giriş görseli.png> <çıktı klasörü>
//   → ss-amblem-kaynak.png (1024²), ss-giris-kaynak.png + ss-giris-maske.png (giriş boyutu)
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { HAC } from '../src/data/amblem.js';

const [GIRIS, CIKTI] = process.argv.slice(2);
mkdirSync(CIKTI, { recursive: true });

// 1) Mühür: kararmış çelik haç, arkasında yükselen alev dilleri
const rnd = (() => { let s = 7; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
let alevler = '';
for (let i = 0; i < 15; i++) {
  const a = (i / 15) * Math.PI * 2;
  const x = 512 + Math.cos(a) * (200 + rnd() * 90), y = 560 + Math.sin(a) * (180 + rnd() * 80);
  const h = 230 + rnd() * 260, w = 55 + rnd() * 60, sap = (rnd() - 0.5) * 70;
  alevler += `<path d="M${x} ${y}C${x - w} ${y - h * 0.35} ${x - w * 0.2} ${y - h * 0.75} ${x + sap} ${y - h}C${x + w * 0.25} ${y - h * 0.7} ${x + w} ${y - h * 0.35} ${x} ${y}Z"/>`;
}
const muhur = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><defs>
<linearGradient id="a" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#9c1e06"/><stop offset=".45" stop-color="#f0681a"/><stop offset="1" stop-color="#ffd98a"/></linearGradient>
<linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a5a5a"/><stop offset=".5" stop-color="#262626"/><stop offset="1" stop-color="#141414"/></linearGradient>
<filter id="b"><feGaussianBlur stdDeviation="9"/></filter></defs>
<rect width="1024" height="1024" fill="#000"/>
<g fill="url(#a)" filter="url(#b)" opacity=".92">${alevler}</g>
<g transform="translate(152 152) scale(7.2)"><path d="${HAC}" fill="url(#c)" stroke="#a8a8a8" stroke-width=".55"/></g>
</svg>`;
await sharp(Buffer.from(muhur)).png().toFile(`${CIKTI}/ss-amblem-kaynak.png`);
console.log('KAYNAK amblem');

// 2) Giriş görseli: nişteki Latin haçı yerine kendi haçımız, taş kabartma olarak
const m = await sharp(GIRIS).metadata();
const W = m.width, H = m.height;
const kemer = 'M752 712V330A195 195 0 0 1 1142 330V712Z';
const boya = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>
<linearGradient id="d" x1="0" x2="1"><stop offset="0" stop-color="rgb(110,67,24)"/><stop offset=".5" stop-color="rgb(92,55,18)"/><stop offset="1" stop-color="rgb(58,35,9)"/></linearGradient>
<filter id="tas" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="4"/><feColorMatrix type="saturate" values="0"/>
  <feComponentTransfer><feFuncA type="linear" slope="0" intercept=".22"/></feComponentTransfer><feComposite in2="SourceGraphic" operator="in"/><feBlend in2="SourceGraphic" mode="multiply"/></filter>
<filter id="kab" x="-5%" y="-5%" width="110%" height="110%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" result="b"/>
  <feDiffuseLighting in="b" surfaceScale="3.2" diffuseConstant="1.25" lighting-color="#fff" result="isik"><feDistantLight azimuth="225" elevation="32"/></feDiffuseLighting>
  <feComposite in="isik" in2="SourceAlpha" operator="in" result="isikli"/>
  <feBlend in="SourceGraphic" in2="isikli" mode="multiply"/></filter>
<filter id="golge" x="-10%" y="-10%" width="130%" height="130%"><feGaussianBlur stdDeviation="2.2"/></filter></defs>
<path d="${kemer}" fill="url(#d)" filter="url(#tas)"/>
<g transform="translate(767 250) scale(3.6)">
  <path d="${HAC}" fill="rgb(16,9,2)" opacity=".8" transform="translate(2.6 3.2)" filter="url(#golge)"/>
  <path d="${HAC}" fill="rgb(236,176,96)" filter="url(#kab)"/>
</g></svg>`;
await sharp(GIRIS).composite([{ input: Buffer.from(boya) }]).png().toFile(`${CIKTI}/ss-giris-kaynak.png`);
const maske = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#000"/><path d="${kemer}" fill="#fff"/></svg>`;
await sharp(Buffer.from(maske)).blur(5).png().toFile(`${CIKTI}/ss-giris-maske.png`);
console.log('KAYNAK giris + maske', W, H);
