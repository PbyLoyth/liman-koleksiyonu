// Giriş görseli: seçilen yatay çekimi sıcak tonlu (sepya) kara-beyaza çevirir; afiş görsellerini ve video kaynaklarını
// yazar. Telefon için dikey görüntü aynı çekimden kırpılır (mühür, mumlar ve kâse ortada kalır).
// Mum ışığının sıcaklığı tek renk olarak kalır; geri kalan her şey kara-beyaz.
// kullanım: node tools/giris.mjs <yatay.png> <kaynak çıktı klasörü> [dikey kırpma merkezi, 0-1 = 0.52] [tonsuz]
//   tonsuz: görsel zaten tonluysa (ör. hazır sepya tablo) renklerine dokunulmaz
//   → public/g/giris-yatay-{1280,1920,2560}.webp, public/g/giris-dikey-{720,1080}.webp, public/og.jpg
//   → <klasör>/giris-yatay-son.png (16:9) ve giris-dikey-son.png (9:16): video kaynakları
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const [YATAY, KLASOR, MERKEZ = '0.52', TON_SECIMI = 'ton'] = process.argv.slice(2);
mkdirSync('public/g', { recursive: true });
mkdirSync(KLASOR, { recursive: true });

// Sepya: tam gri ton ve hafif S eğrisi, sonra sıcak tonlama (parlaklık korunur). İki geçiş: sharp gri tonu boru
// hattının sonunda uyguladığı için aynı geçişteki tonlamayı siler.
const TON = { r: 168, g: 146, b: 118 };
const tonla = async (girdi) => TON_SECIMI === 'tonsuz' ? sharp(girdi)
  : sharp(await sharp(girdi).greyscale().linear(1.08, -6).gamma(1.06).toColourspace('srgb').png().toBuffer()).tint(TON);

const m = await sharp(YATAY).metadata();
const yg = Math.min(3840, m.width - (m.width % 16)), yy = Math.round((yg * 9) / 16);
const yatay = await sharp(YATAY).resize(yg, yy, { fit: 'cover', position: 'centre', kernel: 'lanczos3' }).png().toBuffer();
await (await tonla(yatay)).png().toFile(`${KLASOR}/giris-yatay-son.png`);
for (const w of [1280, 1920, 2560]) {
  await sharp(`${KLASOR}/giris-yatay-son.png`).resize(w, Math.round((w * 9) / 16), { kernel: 'lanczos3' }).webp({ quality: 80, effort: 5 }).toFile(`public/g/giris-yatay-${w}.webp`);
}
console.log(`GIRIS yatay ${yg}x${yy}`);

// Dikey: tam yükseklik, 9:16 kırpma
const dg = Math.round((yy * 9) / 16) & ~1;
const sol = Math.max(0, Math.min(yg - dg, Math.round(yg * +MERKEZ - dg / 2)));
await sharp(`${KLASOR}/giris-yatay-son.png`).extract({ left: sol, top: 0, width: dg, height: yy }).png().toFile(`${KLASOR}/giris-dikey-son.png`);
for (const w of [720, 1080]) {
  await sharp(`${KLASOR}/giris-dikey-son.png`).resize(w, Math.round((w * 16) / 9), { kernel: 'lanczos3' }).webp({ quality: 80, effort: 5 }).toFile(`public/g/giris-dikey-${w}.webp`);
}
console.log(`GIRIS dikey ${dg}x${yy} (sol ${sol})`);

// Paylaşım görseli: yatay girişten 1200×630
await sharp(`${KLASOR}/giris-yatay-son.png`).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 84, mozjpeg: true }).toFile('public/og.jpg');
console.log('OG public/og.jpg');
