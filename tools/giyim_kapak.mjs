// Giyim koleksiyonunun kapak görseli (ana sayfa girişi, paylaşım): iki ürün fotoğrafı yan yana, kara-beyaz;
// öbür koleksiyonların kampanya görselleriyle aynı dil. Çıktı public/g/kampanya-giyim-<960|1536>.webp (16:10).
// kullanım: node tools/giyim_kapak.mjs
import sharp from 'sharp';

const GIYIM = process.env.GIYIM_KOK ?? 'C:/projects/beton-obje/tasarim/giyim/seri2/foto';
const PARCA = ['bandana-boxer-kara', 'kamuflaj-sort-savana'];

for (const w of [960, 1536]) {
  const h = Math.round((w * 10) / 16), yarim = w / 2;
  const parca = await Promise.all(
    PARCA.map((p) => sharp(`${GIYIM}/${p}.webp`).resize(yarim, h, { fit: 'cover' }).greyscale().toBuffer()),
  );
  await sharp({ create: { width: w, height: h, channels: 3, background: '#e9e8e4' } })
    .composite(parca.map((b, i) => ({ input: b, left: i * yarim, top: 0 })))
    .webp({ quality: 80, effort: 5 })
    .toFile(`public/g/kampanya-giyim-${w}.webp`);
  console.log(`kampanya-giyim-${w}`);
}
