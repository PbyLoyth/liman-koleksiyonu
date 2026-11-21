// npm run yayinla: siteyi kurar ve dist/ klasörünü gh-pages dalına gönderir (GitHub Pages bu daldan yayınlar).
// Yayın dalı her seferinde tek işlemle yeniden yazılır; kaynak geçmişi main dalında kalır.
import { execSync } from 'node:child_process';
import { mkdtempSync, cpSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const sh = (k, cwd) => execSync(k, { stdio: 'inherit', cwd });
sh('npm run build');
const uzak = execSync('git remote get-url origin').toString().trim();
const gecici = mkdtempSync(join(tmpdir(), 'liman-yayin-'));
try {
  cpSync('dist', gecici, { recursive: true });
  writeFileSync(join(gecici, '.nojekyll'), '');
  sh('git init -q -b gh-pages', gecici);
  sh('git add -A', gecici);
  const not = process.env.YAYIN_NOTU ? `\n\n${process.env.YAYIN_NOTU}` : '';
  writeFileSync(join(gecici, '.git', 'YAYIN_MSG'), `Yayın ${new Date().toISOString().slice(0, 16).replace('T', ' ')}${not}\n`);
  sh('git commit -q -F .git/YAYIN_MSG', gecici);
  sh(`git push -f ${uzak} gh-pages`, gecici);
  console.log('YAYINLANDI');
} finally {
  rmSync(gecici, { recursive: true, force: true });
}
