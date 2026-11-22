// Giriş videosu (gerçek hareket): LTX-Video'nun ürettiği kareleri (UMUTMASA ~/ai/uret_video.py, renderlar/video/<ad>/)
// afişle aynı sepya tona çevirir, hedef boyuta getirir, ince gren ekler ve MP4 + WebM yazar.
// Video ilk ve son kareyle aynı görsele yönlendirildiği için başa döner; son kare ilk karenin eşi olduğundan atlanır.
// kullanım: node tools/giris_video_kare.mjs <kare klasörü> <çıktı öneki> <genişlik> <yükseklik> [fps=24]
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { spawn } from 'node:child_process';

const [KLASOR, ONEK, G, Y, FPS = '24'] = process.argv.slice(2);
const W = +G, H = +Y;
const TON = { r: 168, g: 146, b: 118 }; // tools/giris.mjs ile aynı
const kareler = readdirSync(KLASOR).filter((d) => d.endsWith('.png')).sort().slice(0, -1);

const rnd = (() => { let s = 20261122; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
const kodla = (args) => spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${W}x${H}`, '-r', FPS, '-i', '-', ...args],
  { stdio: ['pipe', 'inherit', 'inherit'] });
const mp4 = kodla(['-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', `${ONEK}.mp4`]);
const webm = kodla(['-c:v', 'libvpx-vp9', '-crf', '36', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p', '-an', `${ONEK}.webm`]);
const yaz = (p, b) => new Promise((ok) => (p.stdin.write(b) ? ok() : p.stdin.once('drain', ok)));

const t0 = Date.now();
for (const [i, k] of kareler.entries()) {
  const gri = await sharp(`${KLASOR}/${k}`).resize(W, H, { fit: 'cover', position: 'centre', kernel: 'lanczos3' })
    .sharpen({ sigma: 0.7 }).greyscale().linear(1.08, -6).gamma(1.06).toColourspace('srgb').png().toBuffer();
  const ham = await sharp(gri).tint(TON).removeAlpha().raw().toBuffer();
  const b = new Uint8ClampedArray(ham.buffer, ham.byteOffset, ham.length);
  for (let p = 0; p < W * H; p++) {
    const g = (rnd() + rnd() + rnd() - 1.5) * 5;
    b[p * 3] += g; b[p * 3 + 1] += g; b[p * 3 + 2] += g;
  }
  await Promise.all([yaz(mp4, ham), yaz(webm, ham)]);
  if (i % 30 === 0) console.log(`kare ${i}/${kareler.length}`);
}
mp4.stdin.end(); webm.stdin.end();
await Promise.all([new Promise((ok) => mp4.on('close', ok)), new Promise((ok) => webm.on('close', ok))]);
console.log(`VIDEO ${ONEK} ${W}x${H} ${kareler.length} kare ${((Date.now() - t0) / 1000).toFixed(0)} sn`);
