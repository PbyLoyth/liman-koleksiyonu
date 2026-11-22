// Stüdyo dönüş karelerini çekim makinesinden alır: npm run kareler
//  1) UMUTMASA'da donus_web.py eksik kareleri WebP'ye çevirir (b: 1000 px, k: 500 px) ve paylaşım görsellerini yazar
//  2) web/donus ve web/og klasörleri tar akışıyla public/ altına iner
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, existsSync } from 'node:fs';

const UZAK = process.env.KARE_MAKINE ?? 'umutmasa';
const r = spawnSync('ssh', [UZAK, 'python3 ~/projects/beton-obje/donus_web.py'], { stdio: 'inherit' });
if (r.status !== 0) process.exit(r.status ?? 1);

mkdirSync('public', { recursive: true });
await new Promise((tamam, hata) => {
  const ssh = spawn('ssh', [UZAK, 'cd ~/projects/beton-obje/web && tar cf - donus og'], { stdio: ['ignore', 'pipe', 'inherit'] });
  // Gizli ürün (Fener: opal cam, kurala uymuyor) yayına girmez
  const tar = spawn('tar', ['-xf', '-', '-C', 'public', '--exclude', 'donus/fener', '--exclude', 'og/fener-*'], { stdio: ['pipe', 'inherit', 'inherit'] });
  ssh.stdout.pipe(tar.stdin);
  tar.on('close', (k) => (k === 0 ? tamam() : hata(new Error(`tar çıkış ${k}`))));
  ssh.on('error', hata);
});

const say = (d) => (existsSync(d) ? readdirSync(d, { recursive: true }).filter((f) => String(f).endsWith('.webp')).length : 0);
console.log(`KARE ${say('public/donus')} webp, ${existsSync('public/og') ? readdirSync('public/og').length : 0} paylaşım görseli`);
