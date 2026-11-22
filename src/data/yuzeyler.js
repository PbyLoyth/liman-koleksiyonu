// Yalnız beton ya da yalnız çelik (22 Kas kuralı). Beton: Brüt, Tuz, Grafit. Çelik: Ayna (krom gibi parlatılmış,
// kararmış kazıma), Kara (karartılmış çelik, parlak kazıma). Kimlikler dönüş karelerinin klasör adları.
export const palet = {
  'Tuz Beyazı': '#E4E1DA',
  Grafit: '#55585A',
  Brüt: '#74756F',
  Krom: '#B9BCC1',
  Kara: '#2A2C2F',
};

export const malzemeler = [
  { id: 'beton', ad: 'Beton' },
  { id: 'celik', ad: 'Çelik' },
];

export const yuzeyler = [
  {
    id: 'brut',
    malzeme: 'beton',
    ad: 'Brüt',
    kisa: 'Ham gri beton',
    metin: 'Kalıptan çıktığı gibi: gözenekli, mat, ham gri beton.',
  },
  {
    id: 'tuz',
    malzeme: 'beton',
    ad: 'Tuz',
    kisa: 'Beyaz beton',
    metin: 'Beyaz çimentoyla dökülmüş beton, ince koyu derzler.',
  },
  {
    id: 'grafit',
    malzeme: 'beton',
    ad: 'Grafit',
    kisa: 'Koyu beton',
    metin: 'Koyu, sıkı beton; hafif ipek parlaklık, ton ton derz.',
  },
  {
    id: 'lansman',
    malzeme: 'celik',
    ad: 'Ayna',
    kisa: 'Parlatılmış çelik',
    metin: 'Ayna gibi parlatılmış çelik; kazıma çizgileri kararmış.',
  },
  {
    id: 'kara',
    malzeme: 'celik',
    ad: 'Kara',
    kisa: 'Karartılmış çelik',
    metin: 'Karartılmış çelik; kazıma çizgileri parlak çelik olarak açılır.',
  },
];

export const yuzeyBul = (id) => yuzeyler.find((y) => y.id === id);

export const yuzeyAdi = (y) => y?.ad ?? '';
export const yuzeyKisa = (y) => y?.kisa ?? '';
export const malzemeAdi = (y) => (y?.malzeme === 'celik' ? 'Çelik' : 'Beton');
/** "Brüt beton", "Ayna çelik" */
export const tamAd = (y) => (y ? `${y.ad} ${y.malzeme === 'celik' ? 'çelik' : 'beton'}` : '');
