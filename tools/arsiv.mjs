// Arşiv: baştan sona bütün çalışmalar, gizli sayfa /arsiv/ için. Kaynaklar tasarım klasöründe; bu araç web
// kopyalarını public/arsiv altına yazar ve src/data/arsiv.json'u üretir.
//   görsel: <bölüm>/<ad>.webp (uzun kenar en çok 1600) ve <ad>-k.webp (ızgara, yükseklik 360)
//   dönüş:  donus/<ad>.webp (24 ya da 48 karelik şerit, saydam) ve <ad>-k.webp (ilk kare)
//   film:   film/<ad>.mp4 ve <ad>-k.webp (afiş)
// Yalnız kaynağı yeni olanlar yeniden yazılır; artık kaynağı olmayan çıktılar silinir.
// kullanım: node tools/arsiv.mjs        (kök değişirse: TASARIM_KOK=... node tools/arsiv.mjs)
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const T = process.env.TASARIM_KOK ?? 'C:/projects/beton-obje/tasarim';
const R = `${T}/renderlar`, G = `${T}/giyim`, K = `${T}/arsiv-kaynak`;
const CIKTI = 'public/arsiv';
// giris-tablo ve giris-*-son: girişteki 19. yüzyıl tablosu (bizim işimiz değil)
const HARIC = [/-4k$/, /^giris-tablo/, /^giris-(yatay|dikey)-son$/, /onizleme/, /@2x$/, /-maske$/];
// Rötuş: bazı görsellerde model köşeye uydurma marka yazısı koymuş; çevresindeki zeminle doldurulur.
// [yön, x0, y0, x1, y1] (0-1). dikey: üst ve alt komşu satır arası, yatay: sol ve sağ komşu sütun arası.
const ROTUS = {
  'giris/t7-v2-dalgakiran-1': [['dikey', 0.30, 0.95, 0.70, 0.978]],
  'giris/t7-v2-dalgakiran-2': [['dikey', 0.80, 0.972, 0.992, 0.993]],
  'giris/t7-v2-keson-1': [['dikey', 0.30, 0.95, 0.70, 0.978]],
  'giris/t7-v2-rihtim-1': [['dikey', 0.30, 0.95, 0.70, 0.978]],
  'atolye/donati-2': [['yatay', 0.48, 0.924, 0.531, 0.946], ['yatay', 0.60, 0.906, 0.646, 0.931]],
};

const BOLUMLER = [
  { id: 'liman', ad: 'Liman · ilk çizimler', tarih: '21 Kasım 2026',
    not: 'İlk modeller. Tetrapod, keson, iskele babası, silo, rıhtım, antifer ve fener.',
    gruplar: [{ kaynak: [R] }] },
  { id: 'beyaz-beton', ad: 'Beyaz beton', tarih: '21 Kasım 2026',
    not: 'Tuz beyazı beton, koyu harçlı karo derzi. Kaba beton zeminde stüdyo çekimleri.',
    gruplar: [{ kaynak: [`${R}/foto`] }] },
  { id: 'yuzeyler', ad: 'Yüzeyler', tarih: '21 Kasım 2026',
    not: 'Aynı parçalar, altı yüzey: Tuz, Tuz-biber, İşaret, Renk, Serpinti, Su hattı.',
    gruplar: [{ kaynak: [`${R}/kaplama`] }] },
  { id: 'ilk-vitrin', ad: 'İlk vitrin', tarih: '21 Kasım 2026',
    not: 'İlk vitrinin bütün görselleri: her parça, her yüzey, iki açıdan.',
    gruplar: [{ kaynak: [`${R}/site`] }] },
  { id: 'kullanim', ad: 'Kullanım', tarih: '21 Kasım 2026',
    not: 'Masada, rafta, gece ışığında. Her sahne başka bir zeminde.',
    gruplar: [{ kaynak: [`${R}/kullanim-web`] }] },
  { id: 'katedral', ad: 'Katedral ve Grafit', tarih: '22 Kasım 2026',
    not: 'Beş gotik parça ve Grafit: koyu, lüks gri beton.',
    gruplar: [{ kaynak: [`${R}/katedral-web`, `${R}/site2-web`] }] },
  { id: 'donus', ad: 'Stüdyo dönüşleri', tarih: '22 Kasım 2026', tur: 'donus',
    not: 'Her parça, her yüzey, kendi ekseninde. Sürükle, döndür.',
    gruplar: 'donus' },
  { id: 'renk-krom', ad: 'Renk ve Krom', tarih: '22 Kasım 2026',
    not: 'Her parçaya kendi rengi; lansman için Krom.',
    gruplar: [{ kaynak: [`${R}/site3-web`] }] },
  { id: 'atolye', ad: 'Atölye ve Fabrika', tarih: '22 Kasım 2026',
    not: 'Döküm, kesim, kazıma. Fabrika serisinin ilk taslakları.',
    gruplar: [{ kaynak: [`${R}/konsept`] }] },
  { id: 'vizyon', ad: 'Vizyon', tarih: '22 Kasım 2026',
    not: 'Yalnız beton, yalnız çelik. On yedi nesne ve üç kampanya.',
    gruplar: [{ kaynak: [`${R}/vizyon`] }] },
  { id: 'giris', ad: 'Giriş ve mühür', tarih: '22 Kasım 2026',
    not: 'Giriş sahnesi, yanan haç mührü ve V2 parçaları; bütün denemeler.',
    gruplar: [5, 6, 7, 8].map((n) => ({ ad: `${n}. tur`, on: `t${n}`, kaynak: [`${R}/tur${n}`] })) },
  { id: 'film', ad: 'Giriş filmi', tarih: '22 Kasım 2026', tur: 'film',
    not: 'Mum ışığında giriş döngüsü, ilk denemeden son hâline.',
    gruplar: 'film' },
  { id: 'giyim-cizim', ad: 'Giyim · çizimler', tarih: '22 Kasım 2026',
    not: 'İlk desenler, çizimler ve ayrıntılar.',
    gruplar: [{ ad: 'Desenler', kaynak: [`${G}/desen`] }, { ad: 'Çizimler', kaynak: [`${G}/cizim`] }, { ad: 'Ayrıntılar', kaynak: [`${G}/detay`] }] },
  { id: 'giyim-foto', ad: 'Giyim · fotoğraflar', tarih: '22 Kasım 2026',
    not: 'Boxer ve şortların ilk fotoğrafları, ardından ikinci seri.',
    gruplar: [{ kaynak: [`${G}/foto`] }] },
  { id: 'giyim-seri2', ad: 'Giyim · Seri 2', tarih: '22 Kasım 2026',
    not: 'Boxer, şort, motokros forması ve arazi kaskı.',
    gruplar: [{ kaynak: [`${G}/seri2/foto`] }] },
];

// ---- adlar ve sıralama ----
const URUN = {
  'bandana-boxer': 'Bandana Boxer', 'bandana-sort': 'Bandana Şort', 'kamuflaj-boxer': 'Kamuflaj Boxer',
  'kamuflaj-sort': 'Kamuflaj Şort', 'muhur-boxer': 'Mühür Boxer', 'muhur-sort': 'Mühür Şort', 'moto-forma': 'Moto Forma',
  'arazi-kaski': 'Arazi Kaskı', 'esofman-alt': 'Eşofman altı', 'esofman-ceket': 'Eşofman ceketi',
  forma: 'Yarış Forması', kapusonlu: 'Kapüşonlu', tisort: 'Tişört', sapka: 'Şapka', kargo: 'Kargo Pantolon', mont: 'Şişme Mont',
  bandana: 'Bandana', kamuflaj: 'Kamuflaj', paisley: 'Paisley',
};
const AD = {
  koleksiyon: 'Koleksiyon', katedral: 'Katedral', kapak: 'Kapak', kampanya: 'Kampanya', atolye: 'Atölye', dokum: 'Döküm',
  makro: 'Yakın plan', giris: 'Giriş', amblem: 'Mühür', muhur: 'Mühür', alev: 'Alev', kullanim: 'Kullanım',
  kemer: 'Kemer', payanda: 'Payanda', sapel: 'Şapel', gul: 'Gül', demet: 'Demet',
  dalgakiran: 'Dalgakıran', baba: 'Baba', keson: 'Keson', silo: 'Silo', rihtim: 'Rıhtım', antifer: 'Antifer', fener: 'Fener',
  kiris: 'Kiriş', somun: 'Somun', percin: 'Perçin', flans: 'Flanş', donati: 'Donatı', baca: 'Baca', kule: 'Kule', zincir: 'Zincir',
  detay: 'Ayrıntı', bel: 'bel', etiket: 'etiket', kordon: 'kordon', yama: 'yama',
  aci: 'açı', ust: 'üst', arka: 'arka', pano: 'pano', nis: 'niş', kab: 'kabartma', kabartma: 'kabartma',
  dikey: 'dikey', yatay: 'yatay', son: 'son', sb: 'kara-beyaz', celik: 'çelik', a: 'A', b: 'B', c: 'C',
  beyaz: 'Tuz', tuzbiber: 'Tuz-biber', isaret: 'İşaret', palet: 'Renk', serpinti: 'Serpinti', suhatti: 'Su hattı',
  grafit: 'Grafit', lansman: 'Krom', brut: 'Brüt', kara: 'Kara', kemik: 'Kemik', beton: 'Beton', savana: 'Savana',
  fabrika: 'Fabrika', liman: 'Liman', kaplama: 'Yüzey panosu',
};
const ALT = { detay: 'ayrıntı', kullanim: 'kullanım', kapak: 'kapak', koleksiyon: 'koleksiyon' }; // ilk sözcük değilse
const SIRA = ['koleksiyon', 'katedral', 'kapak', 'kampanya', 'atolye', 'dokum', 'makro', 'giris', 'amblem', 'muhur', 'alev',
  'kemer', 'payanda', 'sapel', 'gul', 'demet', 'dalgakiran', 'baba', 'keson', 'silo', 'rihtim', 'antifer', 'fener',
  'kiris', 'somun', 'percin', 'flans', 'donati', 'baca', 'kule', 'zincir', 'kullanim',
  'bandana', 'kamuflaj', 'paisley', 'bandana-boxer', 'bandana-sort', 'kamuflaj-boxer', 'kamuflaj-sort', 'muhur-boxer',
  'muhur-sort', 'moto-forma', 'arazi-kaski', 'forma', 'esofman-ceket', 'esofman-alt', 'kapusonlu', 'tisort', 'sapka',
  'kargo', 'mont', 'detay'];
const GORUNUS = ['', 'ana', 'aci', 'ust', 'arka', 'detay', 'kullanim', 'kapak', 'pano'];
const YUZEY = ['beyaz', 'tuzbiber', 'isaret', 'palet', 'serpinti', 'suhatti', 'grafit', 'brut', 'kara', 'lansman',
  'kemik', 'savana', 'beton'];

// kaynak adından tohum ve deneme eklerini atar: amblem-sb-5012 → amblem-sb, giris-kab-s800-9401 → giris-kab
const kok = (ad) => ad.replace(/\.(png|jpe?g|webp|mp4)$/i, '').replace(/-\d{2,4}$/, '').replace(/-[sg]\d{2,3}$/, '');
const parcala = (k) => {
  const t = k.split('-');
  const v2 = t[0] === 'v2' ? t.shift() : null;
  const urun = URUN[`${t[0]}-${t[1]}`] ? `${t.shift()}-${t.shift()}` : t.shift();
  return { v2, urun, geri: t };
};
const sira = (liste, x) => { const i = liste.indexOf(x); return i < 0 ? 99 : i; };
function anahtar(k) {
  const { urun, geri } = parcala(k);
  const g = geri.map((x) => sira(GORUNUS, x)).filter((x) => x < 99);
  const y = geri.map((x) => sira(YUZEY, x)).filter((x) => x < 99);
  return [sira(SIRA, urun), g.length ? Math.min(...g) : 0, y.length ? Math.min(...y) : 0, k];
}
function karsilastir(a, b) {
  const x = anahtar(a.kok), y = anahtar(b.kok);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return x[3] < y[3] ? -1 : x[3] > y[3] ? 1 : a.dosya.localeCompare(b.dosya);
}
function etiket(k) {
  const { v2, urun, geri } = parcala(k);
  const bas = URUN[urun] ?? AD[urun] ?? urun;
  return [v2 ? `${bas} V2` : bas, ...geri.filter((x) => x !== 'ana').map((x) => ALT[x] ?? AD[x] ?? x)].join(' · ');
}

// ---- dosya işleri ----
const yazilan = new Set();
let yeni = 0;
const eski = (kaynak, hedef) => !existsSync(hedef) || statSync(hedef).mtimeMs < statSync(kaynak).mtimeMs;
const gorselMi = (f) => /\.(png|jpe?g|webp)$/i.test(f);
function liste(klasor, uzanti = gorselMi) {
  if (!existsSync(klasor)) { console.warn('YOK', klasor); return []; }
  return readdirSync(klasor).filter((f) => uzanti(f) && statSync(join(klasor, f)).isFile());
}
function hedefYol(...p) {
  const y = join(CIKTI, ...p).replace(/\\/g, '/');
  mkdirSync(y.slice(0, y.lastIndexOf('/')), { recursive: true });
  yazilan.add(y);
  return y;
}
const webYol = (y) => y.replace(/^public\//, '');

async function kaynakAc(kaynak, rotus) {
  const m = await sharp(kaynak).metadata();
  const duz = () => (m.hasAlpha ? sharp(kaynak).flatten({ background: '#f2f1ee' }) : sharp(kaynak));
  if (!rotus) return duz;
  const { data, info } = await duz().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels;
  let tohum = 7;
  const gurultu = () => ((tohum = (tohum * 1103515245 + 12345) % 2147483648) / 2147483648 - 0.5) * 6;
  for (const [yon, x0, y0, x1, y1] of rotus) {
    const X0 = Math.round(x0 * W), X1 = Math.min(W - 2, Math.round(x1 * W)), Y0 = Math.round(y0 * H), Y1 = Math.min(H - 2, Math.round(y1 * H));
    for (let y = Y0; y <= Y1; y++) for (let x = X0; x <= X1; x++) {
      const [a, b, t] = yon === 'dikey'
        ? [(Y0 - 1) * W + x, (Y1 + 1) * W + x, (y - Y0 + 1) / (Y1 - Y0 + 2)]
        : [y * W + X0 - 1, y * W + X1 + 1, (x - X0 + 1) / (X1 - X0 + 2)];
      const n = gurultu();
      for (let c = 0; c < C; c++) {
        const v = data[a * C + c] * (1 - t) + data[b * C + c] * t;
        data[(y * W + x) * C + c] = Math.max(0, Math.min(255, Math.round(v + n * Math.min(1, v / 60)))); // karanlıkta doku yok
      }
    }
  }
  return () => sharp(data, { raw: { width: W, height: H, channels: C } });
}

async function durgun(kaynak, bolum, ad) {
  const b = hedefYol(bolum, `${ad}.webp`), k = hedefYol(bolum, `${ad}-k.webp`);
  const ac = await kaynakAc(kaynak, ROTUS[`${bolum}/${ad}`]);
  if (eski(kaynak, b)) { await ac().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 74, effort: 5 }).toFile(b); yeni++; }
  if (eski(kaynak, k)) await ac().resize({ height: 360, withoutEnlargement: true }).webp({ quality: 70, effort: 5 }).toFile(k);
  const [mb, mk] = await Promise.all([sharp(b).metadata(), sharp(k).metadata()]);
  return { b: webYol(b), k: webYol(k), w: mb.width, h: mb.height, kw: mk.width, kh: mk.height };
}

function kopya(kaynak, ...p) {
  const h = hedefYol(...p);
  if (eski(kaynak, h)) { copyFileSync(kaynak, h); yeni++; }
  return h;
}

async function havuz(isler, n) {
  const sonuc = new Array(isler.length);
  let sira = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (sira < isler.length) { const i = sira++; sonuc[i] = await isler[i](); } }));
  return sonuc;
}

// ---- bölümleri kur ----
const sonuc = [];
for (const [i, bol] of BOLUMLER.entries()) {
  let gruplar = [];
  if (bol.gruplar === 'donus') {
    // kapak dönüşleri (48 kare) önde, sonra parça parça; her grubun içinde yüzey sırası
    const kl = `${K}/donus`;
    const adlar = liste(kl, (f) => /\.webp$/.test(f) && !f.endsWith('-k.webp')).map((f) => f.replace(/\.webp$/, ''));
    const kume = new Map();
    for (const ad of adlar) {
      const k48 = ad.endsWith('-48');
      const [urun, yuzey] = ad.replace(/-48$/, '').split('-');
      const g = k48 ? 'Kapak dönüşleri · 48 kare' : AD[urun];
      if (!kume.has(g)) kume.set(g, { ad: g, s: k48 ? -1 : sira(SIRA, urun), ogeler: [] });
      kume.get(g).ogeler.push({
        id: `${bol.id}-${ad}`, tur: 'donus', ad: `${AD[urun]} · ${AD[yuzey]}`, kare: k48 ? 48 : 24, sutun: k48 ? 8 : 6,
        b: webYol(kopya(`${kl}/${ad}.webp`, 'donus', `${ad}.webp`)),
        k: webYol(kopya(`${kl}/${ad}-k.webp`, 'donus', `${ad}-k.webp`)),
        w: 480, h: 600, kw: 288, kh: 360, s: sira(YUZEY, yuzey),
      });
    }
    gruplar = [...kume.values()].sort((a, b) => a.s - b.s).map((g) => ({ ad: g.ad, ogeler: g.ogeler.sort((a, b) => a.s - b.s) }));
  } else if (bol.gruplar === 'film') {
    const FILM = [
      ['giris-3cbc5ab-yatay', 'İlk döngü · yatay'], ['giris-3cbc5ab-dikey', 'İlk döngü · dikey'],
      ['giris-cbc574e-yatay', 'Seçilen sahne · yatay'], ['giris-cbc574e-dikey', 'Seçilen sahne · dikey'],
      ['ham-deneme-yatay', 'Hareket denemesi · ham'], ['ham-yatay-sakin', 'Sakin hareket · ham'],
      ['giris-7f9c99b-yatay', 'Alev, duman ve ışık · yatay'], ['giris-7f9c99b-dikey', 'Alev, duman ve ışık · dikey'],
    ];
    const ogeler = [];
    for (const [ad, baslik] of FILM) {
      const kaynak = `${K}/film/${ad}.mp4`;
      if (!existsSync(kaynak)) { console.warn('YOK', kaynak); continue; }
      const temiz = ad.replace('3cbc5ab', '1').replace('cbc574e', '2').replace('7f9c99b', '3'); // sürüm sırası
      const v = kopya(kaynak, 'film', `${temiz}.mp4`);
      const k = hedefYol('film', `${temiz}-k.webp`);
      if (eski(kaynak, k)) {
        const gecici = join(tmpdir(), `arsiv-${temiz}.png`);
        execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-ss', '1', '-i', kaynak, '-frames:v', '1', gecici]);
        await sharp(gecici).resize({ height: 360 }).webp({ quality: 72 }).toFile(k);
        rmSync(gecici);
      }
      const mk = await sharp(k).metadata();
      const [w, h] = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', kaynak]).toString().trim().split(',').map(Number);
      ogeler.push({ id: `${bol.id}-${temiz}`, tur: 'film', ad: baslik, b: webYol(v), k: webYol(k), w, h, kw: mk.width, kh: mk.height });
    }
    gruplar = [{ ad: null, ogeler }];
  } else {
    for (const g of bol.gruplar) {
      const dosyalar = g.kaynak.flatMap((kl) => liste(kl).map((f) => ({ kl, dosya: f, kok: kok(f) })))
        .filter((d) => !HARIC.some((r) => r.test(d.kok)))
        .sort(karsilastir);
      const say = new Map();
      for (const d of dosyalar) say.set(d.kok, (say.get(d.kok) ?? 0) + 1);
      const sayac = new Map();
      const isler = [];
      for (const d of dosyalar) {
        let ad = d.kok, baslik = etiket(d.kok);
        if (say.get(d.kok) > 1) {
          const n = (sayac.get(d.kok) ?? 0) + 1;
          sayac.set(d.kok, n);
          ad += `-${n}`;
          baslik += ` · ${n}`;
        }
        if (g.on) ad = `${g.on}-${ad}`;
        isler.push(async () => ({ id: `${bol.id}-${ad}`, tur: 'resim', ad: baslik, ...(await durgun(`${d.kl}/${d.dosya}`, bol.id, ad)) }));
      }
      const ogeler = await havuz(isler, 6);
      gruplar.push({ ad: g.ad ?? null, ogeler });
    }
  }
  const sayi = gruplar.reduce((t, g) => t + g.ogeler.length, 0);
  for (const g of gruplar) for (const o of g.ogeler) delete o.s;
  sonuc.push({ id: bol.id, no: String(i + 1).padStart(2, '0'), ad: bol.ad, tarih: bol.tarih, not: bol.not, tur: bol.tur ?? 'resim', sayi, gruplar });
  console.log(`${String(i + 1).padStart(2, '0')} ${bol.ad}: ${sayi}`);
}

// artık kaynağı olmayan çıktıları sil
function supur(kl) {
  for (const f of readdirSync(kl)) {
    const y = `${kl}/${f}`;
    if (statSync(y).isDirectory()) supur(y);
    else if (!yazilan.has(y)) { rmSync(y); console.log('SİLİNDİ', y); }
  }
}
supur(CIKTI);

writeFileSync('src/data/arsiv.json', JSON.stringify({ bolumler: sonuc }));
const toplam = sonuc.reduce((t, b) => t + b.sayi, 0);
console.log(`ARŞİV ${toplam} öğe, ${yeni} yeni dosya`);
