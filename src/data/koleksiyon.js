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
    metin: 'Fener, dalgakıran, iskele babası, keson, silo, rıhtım, antifer. Limanın ağır, sessiz yapıları; ışığı taşır, dalgayı kırar, halatı tutar, yükü saklar. V2 nesneleri koleksiyonun ilk çizimlerinden döner.',
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
    satir: 'Bandana, kamuflaj, mühür.',
    metin: 'Boxer ve şort: klasik paisley ve bandana kareleri, Savana Season kamuflajı ve düz renk Mühür serisi. Bel lastiğinde Old English logo, bacakta haç.',
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

// 21 nesne ve 6 giyim. kod: koleksiyonun baş harfi ve sıra. Giyimde iki renk: ana görsel ilk renk, ikinci görsel öbür renk
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
  { slug: 'fener', ad: 'Fener', koleksiyon: 'liman', rol: 'Mum feneri', malzeme: 'Tuz beton',
    metin: 'Liman fenerinden küçültüldü: on iki yüzlü taban, karo derzli kule, galeri halkası. Tepedeki beton fener odasına bir tealight girer; ışık üç yarıktan sızar.' },
  { slug: 'dalgakiran', ad: 'Dalgakıran', koleksiyon: 'liman', rol: 'Kitap desteği', malzeme: 'Brüt beton',
    metin: 'Dört bacaklı dalgakıran bloğu, çift. Üç bacağının üstünde durur; kitaplar dik bacağa yaslanır.' },
  { slug: 'dalgakiran-v2', ad: 'Dalgakıran V2', koleksiyon: 'liman', rol: 'Kitap desteği', malzeme: 'Tuz beton',
    metin: 'Koleksiyonun ilk Dalgakıran’ı: dört konik bacaklı tetrapod, bacaklarında karo derzi. Çift durur; dalgayı kıran biçim kitapları tutar.' },
  { slug: 'baba', ad: 'Baba', koleksiyon: 'liman', rol: 'Şamdan', malzeme: 'Kara çelik',
    metin: 'İskele babası, iki boy. Halat yerine ince mum tutar.' },
  { slug: 'keson', ad: 'Keson', koleksiyon: 'liman', rol: 'Valet tepsisi', malzeme: 'Grafit beton',
    metin: 'Dalgakıranın hücreli beton kutusu. Yüzük, saat ve bozuk para için ayrı hücreler.' },
  { slug: 'keson-v2', ad: 'Keson V2', koleksiyon: 'liman', rol: 'Valet tepsisi', malzeme: 'Tuz beton',
    metin: 'İlk Keson: kalın duvarlı, hücreli bir liman kesonu. Telefon, kulaklık ve yüzük için ayrı gözler; dış yüzlerde karo derzi.' },
  { slug: 'silo', ad: 'Silo', koleksiyon: 'liman', rol: 'Kalemlik', malzeme: 'Tuz beton',
    metin: 'Yan yana kaynaşmış üç liman silosu, üç ayrı bölme: kalem, makas, fırça.' },
  { slug: 'rihtim', ad: 'Rıhtım', koleksiyon: 'liman', rol: 'Tütsülük', malzeme: 'Brüt beton',
    metin: 'Rıhtım duvarı ve üstünde küçük bir baba. Tütsü babada durur, külü kanala düşer.' },
  { slug: 'rihtim-v2', ad: 'Rıhtım V2', koleksiyon: 'liman', rol: 'Tütsülük', malzeme: 'Tuz beton',
    metin: 'İlk Rıhtım: uzun, alçak bir rıhtım duvarı. Tütsü uçtaki küçük babada durur, külü boydan boya uzanan kanala düşer; yanlarda karo derzi.' },
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
    metin: 'Her yanı klasik paisley. Jakar bel lastiğinde Old English Savana Season ve haç tekrarı.' },
  { slug: 'bandana-sort', ad: 'Bandana Şort', koleksiyon: 'giyim', rol: 'Şort', malzeme: 'Pamuk poplin', renkler: 'Kara · Kemik',
    metin: 'Bandana kareleri yan yana; kenar şeritleri birbirine değer. Büzgülü bel, metal uçlu kordon, bacakta dokuma etiket.' },
  { slug: 'kamuflaj-boxer', ad: 'Kamuflaj Boxer', koleksiyon: 'giyim', rol: 'Boxer', malzeme: 'Pamuk ve elastan', renkler: 'Beton · Savana',
    metin: 'Savana Season kamuflajı: Beton gri tonlarda, Savana kum, okra ve zeytinde. Kara jakar bel.' },
  { slug: 'kamuflaj-sort', ad: 'Kamuflaj Şort', koleksiyon: 'giyim', rol: 'Şort', malzeme: 'Ripstop pamuk', renkler: 'Beton · Savana',
    metin: 'Dikişsiz kamuflaj deseni, büzgülü bel ve kara kordon. Bacakta dokuma etiket.' },
  { slug: 'muhur-boxer', ad: 'Mühür Boxer', koleksiyon: 'giyim', rol: 'Boxer', malzeme: 'Pamuk ve modal', renkler: 'Kara · Kemik',
    metin: 'Düz renk. Jakar bel lastiği ve bacakta küçük haç nakışı.' },
  { slug: 'muhur-sort', ad: 'Mühür Şort', koleksiyon: 'giyim', rol: 'Şort', malzeme: 'Ağır penye', renkler: 'Kara · Beton',
    metin: 'Düz renk ağır penye. Bacakta dikişli deri haç yama ve Old English logo nakışı.' },
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
