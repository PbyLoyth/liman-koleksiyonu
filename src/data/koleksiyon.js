// Savana Season · Konsept koleksiyon 01
// Bir fikir ve vizyon sitesi: nesneler henüz üretimde değil. Kural: her nesne tek malzeme, ya beton ya çelik.
// Dil: tutku ve başarı. Ateş (çelik) ve sabır (beton).

export const marka = {
  ad: 'Savana Season',
  koleksiyon: 'Konsept koleksiyon 01',
  slogan: 'Yalnız beton. Yalnız çelik.',
  tutku: 'Ateşte doğar. Sabırla sertleşir.',
  aciklama:
    'Savana Season: tutkuyla tasarlanan ağır, sessiz nesneler. Katedralden, limandan ve fabrikadan gelir; her biri tek malzeme, ya beton ya çelik.',
  url: 'https://pbyloyth.github.io/savana-season',
};

// Vizyon: tutku ve başarı; kısa, kesin cümleler
export const manifesto = [
  'Tutku bir ateştir. Çelik o ateşte doğar: dövülür, kesilir, parlatılır. Beton sabırla sertleşir: kalıpta bekler, her gün biraz daha güçlenir.',
  'Savana Season ikisinin arasında durur. Katedralin kemerini, limanın dalgakıranını, fabrikanın kirişini masaya taşır ve onlara yeni bir iş verir: kitabı yaslamak, mumu korumak, şarabı tutmak.',
  'Her nesne tek malzemedir. Boya yok, kaplama yok, süs yok. Yüzeyde ne görüyorsan malzemenin kendisi o.',
  'Başarı ağırdır; elde tartınca anlaşılır. Biz o ağırlığın peşindeyiz: yıllarca aynı yerde, aynı ciddiyetle duracak nesneler.',
];

// Mühür: alevli haç
export const muhur = {
  baslik: 'Mühür',
  metin: [
    'Alevli haç Savana Season’ın mührü: kararmış çelikten bir gotik haç. Kolları sivri uçla biter, her kolda zambak işlemesi, ortasında dövme bir kabara.',
    'Alev tutkudur. Çelik ateşte doğar; fikir de öyle. Haç sabırdır: taş taş örülen, yüzyıllarca ayakta kalan yapı.',
  ],
};

export const koleksiyonlar = [
  {
    id: 'katedral',
    ad: 'Katedral',
    satir: 'Işığa yol açan taş.',
    metin: 'Gotik yapının parçaları masaya iner: sivri kemer, uçan payanda, şapel, gül pencere, demet ayak. Taş ışığa yol açar; nesne de öyle.',
    gorsel: 'kampanya-katedral',
  },
  {
    id: 'liman',
    ad: 'Liman',
    satir: 'Suya karşı duran beton.',
    metin: 'Dalgakıran, iskele babası, keson, silo, rıhtım, antifer. Limanın ağır, sessiz yapıları; dalgayı kırar, halatı tutar, yükü saklar.',
    gorsel: 'kampanya-liman',
  },
  {
    id: 'fabrika',
    ad: 'Fabrika',
    satir: 'Taşıyan, sıkan, tutan.',
    metin: 'Kiriş, somun, perçin, flanş, donatı, baca. Endüstrinin parçaları gotik ayrıntıyla yeniden çizilir; çelik taşır, beton tutar.',
    gorsel: 'kampanya-fabrika',
  },
  {
    id: 'giyim',
    ad: 'Giyim',
    tur: 'giyim',
    satir: 'Sade, ağır, imzalı.',
    metin: 'Boxer ve şort: sade kesimler, ağır kumaşlar. İmza hep aynı: Old English Savana Season ve haç.',
    gorsel: 'kampanya-giyim',
  },
];

export const malzemeler = [
  {
    ad: 'Beton',
    metin: 'Silikon kalıba elde dökülür, derzleri harçla dolar. Gözenek, ton farkı ve kalıp izi saklanmaz.',
    turler: [
      ['Brüt', 'Ham gri, gözenekli, tahta kalıp izli'],
      ['Tuz', 'Beyaz çimento, ince gözenek'],
      ['Grafit', 'Koyu, sıkı, hafif ipek parlaklık'],
    ],
  },
  {
    ad: 'Çelik',
    metin: 'Kesilir, kaynaklanır, kazınır. Çizgiler mücevherdeki gibi karartılır ya da parlatılır.',
    turler: [
      ['Ayna', 'Parlatılmış çelik, kararmış kazıma'],
      ['Kara', 'Karartılmış çelik, parlak kazıma'],
    ],
  },
];

// 17 nesne ve giyim. kod: koleksiyonun baş harfi ve sıra. Giyimde iki renk: ana görsel ilk renk, ikinci görsel öbür renk
export const urunler = [
  // Katedral
  { slug: 'kemer', ad: 'Kemer', koleksiyon: 'katedral', rol: 'Kitap desteği', malzeme: 'Brüt beton',
    metin: 'İki yarım, tek kemer. Kitaplar araya girince sivri kemer tamamlanır; derzler taş örgüyü sürdürür.' },
  { slug: 'payanda', ad: 'Payanda', koleksiyon: 'katedral', rol: 'Şarap tutucu', malzeme: 'Kara çelik',
    metin: 'Uçan payandanın kemerli kirişi şişeyi taşır; boyun kulenin çentiğine yaslanır.' },
  { slug: 'sapel', ad: 'Şapel', koleksiyon: 'katedral', rol: 'Mum feneri', malzeme: 'Brüt beton',
    metin: 'Mumun üstüne kapanır; ışık iki sivri pencereden ve tepedeki gözden dışarı süzülür.' },
  { slug: 'gul', ad: 'Gül', koleksiyon: 'katedral', rol: 'Takı tabağı', malzeme: 'Ayna çelik',
    metin: 'Gül pencerenin kurşun çizgileri tabana kazınır ve karartılır. Yüzük ve küpe için.' },
  { slug: 'demet', ad: 'Demet', koleksiyon: 'katedral', rol: 'Vazo', malzeme: 'Grafit beton',
    metin: 'İnce sütunların birleşip tek ayak olduğu gotik taşıyıcı: sekiz yumuşak oluk, sekizgen başlık.' },
  // Liman
  { slug: 'dalgakiran', ad: 'Dalgakıran', koleksiyon: 'liman', rol: 'Kitap desteği', malzeme: 'Brüt beton',
    metin: 'Dört bacaklı dalgakıran bloğu, çift. Üç bacağının üstünde durur; kitaplar dik bacağa yaslanır.' },
  { slug: 'baba', ad: 'Baba', koleksiyon: 'liman', rol: 'Şamdan', malzeme: 'Kara çelik',
    metin: 'İskele babası, iki boy. Halat yerine ince mum tutar.' },
  { slug: 'keson', ad: 'Keson', koleksiyon: 'liman', rol: 'Valet tepsisi', malzeme: 'Grafit beton',
    metin: 'Dalgakıranın hücreli beton kutusu. Yüzük, saat ve bozuk para için ayrı hücreler.' },
  { slug: 'silo', ad: 'Silo', koleksiyon: 'liman', rol: 'Kalemlik', malzeme: 'Tuz beton',
    metin: 'Yan yana kaynaşmış üç liman silosu, üç ayrı bölme: kalem, makas, fırça.' },
  { slug: 'rihtim', ad: 'Rıhtım', koleksiyon: 'liman', rol: 'Tütsülük', malzeme: 'Brüt beton',
    metin: 'Rıhtım duvarı ve üstünde küçük bir baba. Tütsü babada durur, külü kanala düşer.' },
  { slug: 'antifer', ad: 'Antifer', koleksiyon: 'liman', rol: 'Kâğıt ağırlığı', malzeme: 'Ayna çelik',
    metin: 'Dört yüzü oluklu dalgakıran küpü, parlatılmış çelikten. Ağır, küçük, sessiz.' },
  // Fabrika
  { slug: 'kiris', ad: 'Kiriş', koleksiyon: 'fabrika', rol: 'Kitap desteği', malzeme: 'Ayna çelik',
    metin: 'I-profil kirişten kesilir: gövdede sivri kemer penceresi, flanşlarda perçin sırası.' },
  { slug: 'somun', ad: 'Somun', koleksiyon: 'fabrika', rol: 'Şamdan', malzeme: 'Ayna çelik',
    metin: 'Dev bir altıgen somun. Her yüzüne dörtyaprak işlenir; mum ortadaki deliğe oturur.' },
  { slug: 'percin', ad: 'Perçin', koleksiyon: 'fabrika', rol: 'Kutu', malzeme: 'Kara çelik',
    metin: 'Perçinli levhalardan küçük bir mahfaza. Yanlarında sivri kemer, kapağında kule tutamak.' },
  { slug: 'flans', ad: 'Flanş', koleksiyon: 'fabrika', rol: 'Mumluk', malzeme: 'Kara çelik',
    metin: 'Boru flanşı: cıvata delikleri yerinde kalır, ortası gül pencere olarak kesilir.' },
  { slug: 'donati', ad: 'Donatı', koleksiyon: 'fabrika', rol: 'Vazo', malzeme: 'Brüt beton',
    metin: 'Donatı izi ve tahta kalıp dokusu; gövdede katedral sütunu gibi oluklar.' },
  { slug: 'baca', ad: 'Baca', koleksiyon: 'fabrika', rol: 'Tütsülük', malzeme: 'Grafit beton',
    metin: 'Fabrika bacasının tepesinde gotik bir kule. Duman sivri yarıklardan çıkar.' },
  // Giyim
  { slug: 'bandana-boxer', ad: 'Bandana Boxer', koleksiyon: 'giyim', rol: 'Boxer', malzeme: 'Pamuk ve elastan', renkler: 'Kara · Kemik',
    metin: 'Bandana karesi önde ortalanır: madalyon önde, bordür yanlarda. Kara jakar bel lastiğinde Old English Savana Season ve haç tekrarı.' },
  { slug: 'bandana-sort', ad: 'Bandana Şort', koleksiyon: 'giyim', rol: 'Şort', malzeme: 'Ağır triko', renkler: 'Kara · Kemik',
    metin: 'Ağır triko üstünde dağınık bandana madalyonları. Çift çizgili ribana paça, büzgülü bel ve kordon, dokuma etiket.' },
  { slug: 'kamuflaj-boxer', ad: 'Kamuflaj Boxer', koleksiyon: 'giyim', rol: 'Boxer', malzeme: 'Pamuk ve elastan', renkler: 'Savana · Beton',
    metin: 'Savana Season kamuflajı: Savana kum, zeytin ve toprakta, Beton gri tonlarda. Kara jakar bel lastiği.' },
  { slug: 'kamuflaj-sort', ad: 'Kamuflaj Şort', koleksiyon: 'giyim', rol: 'Şort', malzeme: 'Ripstop pamuk', renkler: 'Savana · Beton',
    metin: 'Geniş kargo kesim: kemer köprüleri, eğik ön cepler, kapaklı körüklü yan cepler, yan ayar tokası. Cebe dikili dokuma etiket.' },
  { slug: 'muhur-boxer', ad: 'Mühür Boxer', koleksiyon: 'giyim', rol: 'Boxer', malzeme: 'Pamuk ve modal', renkler: 'Kara · Kemik',
    metin: 'Düz renk. Belde ortada tek Old English yazı, bacakta küçük haç nakışı.' },
  { slug: 'muhur-sort', ad: 'Mühür Şort', koleksiyon: 'giyim', rol: 'Şort', malzeme: 'Yıkanmış kot', renkler: 'Kara · Beton',
    metin: 'Geniş kesim yıkanmış kot: beş cep, perçin, marangoz halkası ve D-halka. Uylukta dikişli deri haç yama.' },
];

export const koleksiyonBul = (id) => koleksiyonlar.find((k) => k.id === id);
export const kod = (u) => {
  const n = urunler.filter((d) => d.koleksiyon === u.koleksiyon).indexOf(u) + 1;
  return `${u.koleksiyon[0].toUpperCase()}–${String(n).padStart(2, '0')}`;
};

// Atölye görselleri (yöntem): döküm, kesim, kazıma
export const yontem = [
  ['atolye-dokum', 'Döküm', 'Beton silikon kalıba elde dökülür.'],
  ['atolye-kesim', 'Kesim', 'Çelik kesilir, kaynaklanır.'],
  ['atolye-kazima', 'Kazıma', 'Çizgiler kazınır, karartılır, parlatılır.'],
];
