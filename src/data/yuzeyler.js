// Altı yüzey. "renk" her ürünün kendi imza rengidir (urunler.js > imza).
export const palet = {
  'Tuz Beyazı': '#E4E1DA',
  'Liman Grisi': '#8E918C',
  Yosun: '#6E7959',
  Pas: '#9A5A36',
  Kömür: '#3A3C3B',
  'Gece Mavisi': '#34465A',
};

export const yuzeyler = [
  {
    id: 'tuz',
    ad: 'Tuz',
    kisa: 'Beyaz beton, koyu derz',
    metin: 'Koleksiyonun ilk hâli: beyaz beton, ince koyu derzler.',
  },
  {
    id: 'tuz-biber',
    ad: 'Tuz-biber',
    kisa: 'Beyaz, kömür benekli',
    metin: 'Beyazın üstüne elde atılmış ince kömür benekler.',
  },
  {
    id: 'isaret',
    ad: 'İşaret',
    kisa: 'Beyaz, sinyal renkleri',
    metin: 'Denizcilik sinyal bayraklarının kırmızısı, laciverti, sarısı ve siyahı; küçük damlalar hâlinde.',
  },
  {
    id: 'serpinti',
    ad: 'Serpinti',
    kisa: 'Gece mavisi, beyaz köpük',
    metin: 'Gece mavisi gövdeye dalgakırana vuran köpük gibi beyaz sıçrama.',
  },
  {
    id: 'su-hatti',
    ad: 'Su hattı',
    kisa: 'Beyaz, tabanda pas bandı',
    metin: 'Her parça aynı 9 mm çizgiye kadar pas rengine batırılmış gibi.',
  },
  {
    id: 'renk',
    ad: 'Renk',
    kisa: 'Ürünün kendi rengi',
    metin: 'Her parçanın limandan gelen kendi rengi.',
  },
];

export const yuzeyBul = (id) => yuzeyler.find((y) => y.id === id);

// Ürün sayfasında "Renk" yüzeyi ürünün imza rengiyle adlanır
export const yuzeyAdi = (y, urun) => (y.id === 'renk' ? urun.imza.ad : y.ad);
export const yuzeyKisa = (y, urun) => (y.id === 'renk' ? urun.imza.neden : y.kisa);
