// Site ayarları. Sipariş kanalları ve satıcı bilgileri buradan değişir; boş bırakılan alan sitede görünmez.
export const site = {
  ad: 'Liman',
  alt: 'beton objeler',
  baslik: 'Liman · beton objeler',
  aciklama:
    'Dalgakıranlardan, iskele babalarından ve silolardan doğan beton objeler. Beyaz çimentoyla, siparişle elde dökülür.',
  url: 'https://pbyloyth.github.io/liman-koleksiyonu',

  // Sipariş penceresindeki düğmeler. Doldurulan her kanal bir düğme olur.
  siparis: {
    whatsapp: '', // ülke koduyla, yalnız rakam: 905xxxxxxxxx
    instagram: '', // kullanıcı adı, @ olmadan
    eposta: '',
  },

  // Ödeme yolu, sipariş ve iade sayfasında görünür (örnek: 'Havale / EFT').
  odeme: '',

  // Satıcı bilgileri (mesafeli satış için). Dolu olanlar sipariş ve iade sayfasında listelenir.
  satici: {
    unvan: '',
    adres: '',
    vergi: '',
    mersis: '',
    eposta: '',
    telefon: '',
  },
};

export const siparisAcik = Object.values(site.siparis).some(Boolean);
