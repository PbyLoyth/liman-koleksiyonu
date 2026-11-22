// Giriş videosu: tek bir fotoğraftan sade, kusursuz dönen bir film döngüsü.
// - çok yavaş içeri/dışarı yaklaşma (nefes alır gibi, başı ve sonu aynı kare)
// - mum alevlerinin çevresinde titreyen ışık (görüntünün en parlak bölgelerinden çıkarılan maske)
// - ışıkta süzülen toz zerreleri, ince film greni
// Bütün hareketler döngü süresine tam bölünür: video kesintisiz döner. İlk kare afiş görseliyle aynıdır.
// kullanım: node tools/giris_video.mjs <kaynak.png> <çıktı öneki> <genişlik> <yükseklik> [saniye=12] [fps=24]
// çıktı: <önek>.mp4 (H.264) ve <önek>.webm (VP9)
import sharp from 'sharp';
import { spawn } from 'node:child_process';

const [KAYNAK, ONEK, G, Y, SN = '12', FPS = '24'] = process.argv.slice(2);
const W = +G, H = +Y, T = +SN, F = +FPS, N = Math.round(T * F);
const PAY = 1.1; // kaynak çıktıdan %10 büyük: yaklaşma hep görüntünün içinde kalır
const SW = Math.round(W * PAY), SH = Math.round(H * PAY);

// Kaynak ve ışık maskesi (doğrusal kayan nokta)
const kaynak = await sharp(KAYNAK).resize(SW, SH, { fit: 'cover', kernel: 'lanczos3' }).removeAlpha().raw().toBuffer();
const parlak = await sharp(KAYNAK).resize(SW, SH, { fit: 'cover' }).greyscale()
  .linear(4.2, -0.72 * 4.2 * 255).blur(Math.max(6, SW / 90)).raw().toBuffer();
const S = new Float32Array(SW * SH * 3);
for (let i = 0; i < S.length; i++) S[i] = kaynak[i];
const M = new Float32Array(SW * SH);
let mmax = 1;
for (let i = 0; i < M.length; i++) { M[i] = parlak[i]; if (M[i] > mmax) mmax = M[i]; }
for (let i = 0; i < M.length; i++) M[i] /= mmax;

// Döngüye tam bölünen titreşim: tam sayı frekanslı sinüslerin toplamı
const rnd = (() => { let s = 20261122; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
const dalgalar = [3, 5, 8, 13, 21, 34].map((k, i) => ({ k, a: 0.5 / (i + 1.2), f: rnd() * Math.PI * 2 }));
const titresim = (t) => {
  let v = 0;
  for (const d of dalgalar) v += d.a * Math.sin((2 * Math.PI * d.k * t) / T + d.f);
  return v; // ~[-1, 1]
};

// Toz: ışığa yakın yerlerde, küçük kapalı yörüngelerde süzülen zerreler
const tozlar = [];
while (tozlar.length < Math.round((W * H) / 16000)) {
  const x = rnd() * SW, y = rnd() * SH;
  if (M[Math.floor(y) * SW + Math.floor(x)] < 0.08 && rnd() > 0.15) continue;
  tozlar.push({ x, y, r: 6 + rnd() * 34, k1: 1 + Math.floor(rnd() * 2), k2: 1 + Math.floor(rnd() * 3), f1: rnd() * 6.28, f2: rnd() * 6.28,
    yukari: (rnd() * 0.5 + 0.2) * SH * 0.06, boy: 0.8 + rnd() * 1.7, isik: 0.25 + rnd() * 0.75 });
}

// Catmull-Rom ağırlıkları
const cr = (t) => {
  const t2 = t * t, t3 = t2 * t;
  return [(-t3 + 2 * t2 - t) / 2, (3 * t3 - 5 * t2 + 2) / 2, (-3 * t3 + 4 * t2 + t) / 2, (t3 - t2) / 2];
};

function kare(n) {
  const t = n / F;
  const faz = (1 - Math.cos((2 * Math.PI * t) / T)) / 2; // 0 → 1 → 0
  const z = 1 + 0.065 * faz;
  const kx = SW / 2 + SW * 0.004 * Math.sin((2 * Math.PI * t) / T);
  const ky = SH / 2 - SH * 0.006 * faz;
  const olcek = PAY / z;
  // eksenler ayrık: her sütun ve satır için kaynak konumu ve ağırlıklar bir kez
  const xi = new Int32Array(W), xw = new Float32Array(W * 4), yi = new Int32Array(H), yw = new Float32Array(H * 4);
  for (let u = 0; u < W; u++) { const x = kx + (u + 0.5 - W / 2) * olcek - 0.5; const b = Math.floor(x); xi[u] = b; xw.set(cr(x - b), u * 4); }
  for (let v = 0; v < H; v++) { const y = ky + (v + 0.5 - H / 2) * olcek - 0.5; const b = Math.floor(y); yi[v] = b; yw.set(cr(y - b), v * 4); }
  const isik = 1 + 0.11 * titresim(t), nefes = 1 + 0.012 * Math.sin((4 * Math.PI * t) / T);
  const cikti = new Uint8ClampedArray(W * H * 3); // kırpar (Buffer taşınca sarardı)
  const sx = (x) => (x < 0 ? 0 : x >= SW ? SW - 1 : x), sy = (y) => (y < 0 ? 0 : y >= SH ? SH - 1 : y);
  for (let v = 0; v < H; v++) {
    const yb = yi[v];
    const r0 = sy(yb - 1) * SW, r1 = sy(yb) * SW, r2 = sy(yb + 1) * SW, r3 = sy(yb + 2) * SW;
    const satirlar = [r0, r1, r2, r3], ys = [yw[v * 4], yw[v * 4 + 1], yw[v * 4 + 2], yw[v * 4 + 3]];
    for (let u = 0; u < W; u++) {
      const xb = xi[u];
      const c0 = sx(xb - 1), c1 = sx(xb), c2 = sx(xb + 1), c3 = sx(xb + 2);
      const a0 = xw[u * 4], a1 = xw[u * 4 + 1], a2 = xw[u * 4 + 2], a3 = xw[u * 4 + 3];
      let R = 0, Gc = 0, B = 0, m = 0;
      for (let j = 0; j < 4; j++) {
        const r = satirlar[j], wy = ys[j];
        const p0 = r + c0, p1 = r + c1, p2 = r + c2, p3 = r + c3;
        R += wy * (a0 * S[p0 * 3] + a1 * S[p1 * 3] + a2 * S[p2 * 3] + a3 * S[p3 * 3]);
        Gc += wy * (a0 * S[p0 * 3 + 1] + a1 * S[p1 * 3 + 1] + a2 * S[p2 * 3 + 1] + a3 * S[p3 * 3 + 1]);
        B += wy * (a0 * S[p0 * 3 + 2] + a1 * S[p1 * 3 + 2] + a2 * S[p2 * 3 + 2] + a3 * S[p3 * 3 + 2]);
        m += wy * (a0 * M[p0] + a1 * M[p1] + a2 * M[p2] + a3 * M[p3]);
      }
      const k = (1 + (isik - 1) * m) * nefes;
      const o = (v * W + u) * 3;
      cikti[o] = R * k; cikti[o + 1] = Gc * k; cikti[o + 2] = B * k;
    }
  }
  // toz zerreleri (ışıkla güçlenir)
  for (const d of tozlar) {
    const a = (2 * Math.PI * t) / T;
    const x = d.x + d.r * Math.cos(d.k1 * a + d.f1);
    const y = d.y + d.r * 0.6 * Math.sin(d.k2 * a + d.f2) - d.yukari * Math.sin(a);
    const u0 = (x - kx) / olcek + W / 2, v0 = (y - ky) / olcek + H / 2;
    const yr = d.boy * 1.6;
    const isikM = M[sy(Math.floor(y)) * SW + sx(Math.floor(x))];
    const guc = (0.18 + 0.9 * isikM) * d.isik * 120;
    for (let v = Math.floor(v0 - yr * 2); v <= v0 + yr * 2; v++) {
      if (v < 0 || v >= H) continue;
      for (let u = Math.floor(u0 - yr * 2); u <= u0 + yr * 2; u++) {
        if (u < 0 || u >= W) continue;
        const e = Math.exp(-((u - u0) ** 2 + (v - v0) ** 2) / (2 * yr * yr)) * guc;
        const o = (v * W + u) * 3;
        cikti[o] += e; cikti[o + 1] += e * 0.96; cikti[o + 2] += e * 0.86;
      }
    }
  }
  // ince gren (parlaklıkta), her karede yeni
  for (let i = 0; i < W * H; i++) {
    const g = (rnd() + rnd() + rnd() - 1.5) * 5.2;
    const o = i * 3;
    cikti[o] += g; cikti[o + 1] += g; cikti[o + 2] += g;
  }
  return Buffer.from(cikti.buffer);
}

function kodla(args) {
  const p = spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${W}x${H}`, '-r', String(F), '-i', '-', ...args],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  return p;
}
const mp4 = kodla(['-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', `${ONEK}.mp4`]);
const webm = kodla(['-c:v', 'libvpx-vp9', '-crf', '37', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p', '-an', `${ONEK}.webm`]);
const yaz = (p, b) => new Promise((ok) => (p.stdin.write(b) ? ok() : p.stdin.once('drain', ok)));
const t0 = Date.now();
for (let n = 0; n < N; n++) {
  const b = kare(n);
  await Promise.all([yaz(mp4, b), yaz(webm, b)]);
  if (n % 48 === 0) console.log(`kare ${n}/${N} · ${((Date.now() - t0) / 1000).toFixed(0)} sn`);
}
mp4.stdin.end(); webm.stdin.end();
await Promise.all([new Promise((ok) => mp4.on('close', ok)), new Promise((ok) => webm.on('close', ok))]);
console.log(`VIDEO ${ONEK} ${W}x${H} ${N} kare ${((Date.now() - t0) / 1000).toFixed(0)} sn`);
