// Mühür fotoğrafı: gerçek alev fotoğrafının önünde kendi haç çizimimiz (src/data/amblem.js), kararmış çelik olarak.
// Biçim tamamen bizim: model yalnız alevi üretti (renderlar/tur8/alev-*.png). Sitedeki tek renk ateştir.
// kullanım: node tools/muhur.mjs <alev.png> <çıktı.png>
import sharp from 'sharp';
import { HAC } from '../src/data/amblem.js';

const [ALEV, CIKTI] = process.argv.slice(2);
const N = 1024;

// Alev: aynı alev fotoğrafı ve aynası haçın iki yanından yükselir (alev haçı sarar); kenarlar siyaha söner
const alevKare = async (aynala) => {
  let p = sharp(ALEV).resize(Math.round(N * 0.92), Math.round(N * 0.92));
  if (aynala) p = p.flop();
  return p.toBuffer();
};
const sol = await alevKare(true), sag = await alevKare(false);
const alevler = await sharp({ create: { width: N, height: N, channels: 3, background: '#000' } })
  .composite([{ input: sol, left: Math.round(N * -0.12), top: Math.round(N * 0.1) }, { input: sag, left: Math.round(N * 0.2), top: Math.round(N * 0.1), blend: 'screen' }])
  .png().toBuffer();
const sonme = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${N}" height="${N}"><defs><radialGradient id="s" cx="50%" cy="54%" r="58%">
<stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#s)"/></svg>`);

// Haç: kararmış çelik; tepeden gelen alev ışığıyla kenar parlaması, çekiçlenmiş doku
const haç = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${N}" height="${N}"><defs>
<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1a14"/><stop offset=".5" stop-color="#130b09"/><stop offset="1" stop-color="#060303"/></linearGradient>
<linearGradient id="k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd59a"/><stop offset=".5" stop-color="#e0732c"/><stop offset="1" stop-color="#5a2410"/></linearGradient>
<filter id="doku" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="11" result="n"/>
  <feColorMatrix in="n" type="saturate" values="0" result="ng"/><feComponentTransfer in="ng" result="na"><feFuncA type="linear" slope="0" intercept=".28"/></feComponentTransfer>
  <feComposite in="na" in2="SourceGraphic" operator="in" result="nk"/><feBlend in="nk" in2="SourceGraphic" mode="multiply"/></filter>
<filter id="kab" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="b"/>
  <feSpecularLighting in="b" surfaceScale="4" specularConstant=".9" specularExponent="22" lighting-color="#ffcf8a" result="p"><feDistantLight azimuth="270" elevation="52"/></feSpecularLighting>
  <feComposite in="p" in2="SourceAlpha" operator="in" result="pp"/><feComposite in="SourceGraphic" in2="pp" operator="arithmetic" k1="0" k2="1" k3=".1" k4="0"/></filter>
<filter id="parilti" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter></defs>
<g transform="translate(167 182) scale(6.9)">
  <path d="${HAC}" fill="#ff6a1e" opacity=".7" filter="url(#parilti)"/>
  <path d="${HAC}" fill="url(#g)" filter="url(#doku)"/>
  <path d="${HAC}" fill="url(#g)" filter="url(#kab)" opacity=".9"/>
  <path d="${HAC}" fill="none" stroke="url(#k)" stroke-width=".7" opacity=".95"/>
</g></svg>`);

await sharp({ create: { width: N, height: N, channels: 3, background: '#000' } })
  .composite([{ input: alevler }, { input: sonme, blend: 'multiply' }, { input: haç }])
  .png().toFile(CIKTI);
console.log('MUHUR', CIKTI);
