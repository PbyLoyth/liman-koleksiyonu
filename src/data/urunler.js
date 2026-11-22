// Ürünler. Ölçü ve ağırlıklar 3D modelden (beyaz beton, 2,25 g/cm³). Fiyatlar TL.
// gorsel: her yüzey için gösterilen çekimler; kullanım görseli (varsa) bütün yüzeylerin galerisine eklenir.
export const koleksiyonlar = [
  {
    id: 'katedral',
    ad: 'Katedral',
    alt: 'Gotik yapının parçaları: payanda, şapel, sivri kemer, demet ayak, gül pencere.',
  },
  {
    id: 'liman',
    ad: 'Liman',
    alt: 'Limanın beton yapıları: dalgakıran, keson, iskele babası, silo, rıhtım.',
  },
];

export const urunler = [
  // ---------------------------------------------------------------- Katedral
  {
    slug: 'payanda',
    koleksiyon: 'katedral',
    ad: 'Payanda',
    rol: 'Şarap tutucu',
    fiyat: 1650,
    kaynak: 'Uçan payanda, katedralin duvarını dışarıdan tutan kemerli destektir.',
    metin: 'Şişe kirişin sırtındaki beşiğe yatar; dibi beşiğin ucuna, boynu kulenin çentiğine oturur.',
    imza: { ad: 'Şarap', neden: 'Tuttuğu şarabın tortusu' },
    ozellik: [
      ['Ölçü', '252 × 72 × 155 mm'],
      ['Ağırlık', 'Yaklaşık 2,05 kg'],
      ['Şişe', '75 cl, Ø90 mm’ye kadar'],
    ],
    gorsel: ['aci', 'ust'],
  },
  {
    slug: 'sapel',
    koleksiyon: 'katedral',
    ad: 'Şapel',
    rol: 'Mum feneri',
    fiyat: 950,
    kaynak: 'Şapel, katedralin içindeki küçük ibadet odasıdır.',
    metin: 'Tealight’ın üstüne kapatılır; ışık iki sivri pencereden ve gözden dışarı süzülür. Tepedeki baca ısıyı atar.',
    imza: { ad: 'Vitray Moru', neden: 'Şapel vitrayının moru' },
    ozellik: [
      ['Ölçü', '96 × 96 × 142 mm'],
      ['Ağırlık', 'Yaklaşık 740 g'],
      ['Mum', 'Tealight, Ø38 mm'],
    ],
    uyari: 'Yanan mumu yalnız bırakmayın; fener ısınır.',
    gorsel: ['aci', 'ust'],
  },
  {
    slug: 'kemer',
    koleksiyon: 'katedral',
    ad: 'Kemer',
    rol: 'Kitap desteği, çift',
    fiyat: 1550,
    kaynak: 'Sivri kemer gotik yapının imzasıdır: iki yay yükü ortada buluşturur.',
    metin: 'Her destek kemerin bir yarısı. Kitaplar aralarına girince kemer tamamlanır.',
    imza: { ad: 'Gece Mavisi', neden: 'Vitray gecesinin mavisi' },
    ozellik: [
      ['Ölçü', '110 × 52 × 170 mm (tanesi)'],
      ['Ağırlık', 'Tanesi yaklaşık 1,16 kg'],
      ['Takım', '2 adet'],
    ],
    gorsel: ['aci', 'ust'],
  },
  {
    slug: 'demet',
    koleksiyon: 'katedral',
    ad: 'Demet',
    rol: 'Vazo',
    fiyat: 890,
    kaynak: 'Demet ayak, ince sütunların birleşip tek ayak olduğu gotik taşıyıcıdır.',
    metin: 'Beton olanı kuru dal için; çelik olanı suyu doğrudan tutar.',
    imza: { ad: 'Yosun', neden: 'Eski taşı saran yosun' },
    ozellik: [
      ['Ölçü', 'Ø76 × 210 mm'],
      ['Ağırlık', 'Yaklaşık 880 g'],
      ['Ağız', 'Ø27 mm'],
    ],
    gorsel: ['aci', 'ust'],
  },
  {
    slug: 'gul',
    koleksiyon: 'katedral',
    ad: 'Gül',
    rol: 'Takı tabağı',
    fiyat: 490,
    kaynak: 'Gül pencere, katedral cephesindeki yuvarlak vitraydır.',
    metin: 'Tabanında pencerenin kurşun çizgileri derz olarak durur. Yüzük, küpe ve küçük eşyalar için.',
    imza: { ad: 'Gül Kurusu', neden: 'Kurumuş gül yaprağı' },
    ozellik: [
      ['Ölçü', 'Ø130 × 18 mm'],
      ['Ağırlık', 'Yaklaşık 335 g'],
    ],
    gorsel: ['aci', 'ust'],
  },
  // ---------------------------------------------------------------- Liman
  {
    slug: 'keson',
    koleksiyon: 'liman',
    ad: 'Keson',
    rol: 'Valet tepsisi',
    fiyat: 1250,
    kaynak: 'Keson, dalgakıranın içi hücreli beton kutusudur. Suyun altında durur, üstündeki duvar dalgayı geri çevirir.',
    metin: 'Telefon, kulaklık kutusu, yüzük ve bozuk para için hücreleri var. Arkadaki duvar telefona yaslanma yeri.',
    imza: { ad: 'Petrol', neden: 'Kesonun durduğu derin su' },
    ozellik: [
      ['Ölçü', '260 × 130 × 44 mm'],
      ['Ağırlık', 'Yaklaşık 1,25 kg'],
      ['Hücreler', 'Telefon (168 × 106 mm), kulaklık kutusu, yüzük ve bozuk para'],
    ],
    gorsel: ['aci', 'ust'],
  },
  {
    slug: 'dalgakiran',
    koleksiyon: 'liman',
    ad: 'Dalgakıran',
    rol: 'Kitap desteği, çift',
    fiyat: 1450,
    kaynak: 'Dört bacaklı dalgakıran bloğu. Üç bacağının üstünde durur, dördüncüsü yukarı bakar.',
    metin: 'Kitaplar dik bacağa yaslanır. Çift olarak gelir; tek başına da masada güzel durur.',
    imza: { ad: 'Liman Grisi', neden: 'Dalgakıran bloklarının betonu' },
    ozellik: [
      ['Ölçü', '156 × 138 × 125 mm'],
      ['Ağırlık', 'Tanesi yaklaşık 780 g'],
      ['Takım', '2 adet'],
    ],
    gorsel: ['aci', 'ust'],
  },
  {
    slug: 'baba',
    koleksiyon: 'liman',
    ad: 'Baba',
    rol: 'Şamdan, iki boy',
    fiyat: 690,
    kaynak: 'İskele babası, gemi halatının sarıldığı mantar başlı direktir.',
    metin: 'Başlığında standart ince mum için yuva var. İki boy birlikte gelir: 80 ve 115 mm.',
    imza: { ad: 'Kömür', neden: 'Döküm demir babaların siyahı' },
    ozellik: [
      ['Ölçü', 'Ø58 × 80 mm ve Ø58 × 115 mm'],
      ['Ağırlık', 'Yaklaşık 265 g ve 375 g'],
      ['Mum', 'İnce mum, Ø22 mm'],
    ],
    uyari: 'Yanan mumu yalnız bırakmayın.',
    gorsel: ['aci', 'ust'],
  },
  {
    slug: 'silo',
    koleksiyon: 'liman',
    ad: 'Silo',
    rol: 'Kalemlik',
    fiyat: 890,
    kaynak: 'Liman siloları yan yana kaynaşmış silindirlerdir.',
    metin: 'Üç boy silo, üç ayrı bölme: kalem, makas, fırça.',
    imza: { ad: 'Pas', neden: 'Limandaki çeliğin rengi' },
    ozellik: [
      ['Ölçü', '94 × 83 × 120 mm'],
      ['Ağırlık', 'Yaklaşık 695 g'],
      ['Bölmeler', 'Ø36, Ø32 ve Ø28 mm'],
    ],
    gorsel: ['aci', 'ust'],
  },
  {
    slug: 'rihtim',
    koleksiyon: 'liman',
    ad: 'Rıhtım',
    rol: 'Tütsülük',
    fiyat: 490,
    kaynak: 'Rıhtım, gemilerin yanaştığı duvardır; üstünde küçük bir baba durur.',
    metin: 'Çubuk tütsü babadaki yuvada eğik durur, külü kanala düşer. Palo santo kanala yatar.',
    imza: { ad: 'Hardal', neden: 'Rıhtım babalarının sarı boyası' },
    ozellik: [
      ['Ölçü', '200 × 42 × 28 mm'],
      ['Ağırlık', 'Yaklaşık 280 g'],
      ['Yuva', 'Çubuk tütsü, 25° eğik'],
    ],
    uyari: 'Yanan tütsüyü yalnız bırakmayın.',
    gorsel: ['aci', 'ust'],
  },
  {
    slug: 'antifer',
    koleksiyon: 'liman',
    ad: 'Antifer',
    rol: 'Kâğıt ağırlığı',
    fiyat: 450,
    kaynak: 'Antifer, dört yüzü oluklu dalgakıran küpüdür; adını Fransa’daki Antifer limanından alır.',
    metin: 'Kâğıtları tutar, oluklarına kablo yatar.',
    imza: { ad: 'Kum', neden: 'Blokların yattığı kıyı kumu' },
    ozellik: [
      ['Ölçü', '58 × 58 × 58 mm'],
      ['Ağırlık', 'Yaklaşık 375 g'],
      ['Oluk', '14 mm'],
    ],
    gorsel: ['aci', 'ust'],
  },
  {
    slug: 'fener',
    koleksiyon: 'liman',
    ad: 'Fener',
    rol: 'Masa lambası',
    fiyat: 2900,
    yakinda: true,
    gizli: true, // opal cam başlık ve elektrik aksamı: yalnız beton / yalnız çelik kuralına uymuyor
    kaynak: 'Liman girişindeki mendirek feneri.',
    metin: 'Beton gövde, ışığı yumuşatan opal başlık. Elektrik aksamının uygunluk testleri bitince satışa çıkacak.',
    imza: { ad: 'İşaret Kırmızısı', neden: 'Liman girişindeki kırmızı fener' },
    ozellik: [
      ['Ölçü', 'Gövde 115 × 115 × 192 mm, toplam yaklaşık 295 mm'],
      ['Ağırlık', 'Yaklaşık 1,6 kg'],
      ['Duy', 'E14'],
    ],
    gorsel: ['aci'],
  },
];

export const ortak = [
  ['Malzeme', 'Tek malzeme: ya beton ya çelik. Beton elde dökülür, derzleri harçla dolar; çelik kesilir, kaynaklanır, kazınır'],
  ['Bakım', 'Kuru ya da hafif nemli bezle silin'],
  ['Not', 'Her parça elde yapılır; ton, gözenek ve kazıma izi parçadan parçaya değişir'],
];

export const urunBul = (slug) => urunler.find((u) => u.slug === slug);

export const koleksiyonAdi = (id) => koleksiyonlar.find((k) => k.id === id)?.ad ?? id;

/** Katalog numarası: koleksiyonun baş harfi ve sıra (K—01, L—03) */
export const kod = (u) => {
  const sira = urunler.filter((d) => d.koleksiyon === u.koleksiyon).indexOf(u) + 1;
  return `${u.koleksiyon === 'katedral' ? 'K' : 'L'}—${String(sira).padStart(2, '0')}`;
};
