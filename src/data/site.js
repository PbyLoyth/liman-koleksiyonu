// Site ayarları. Sipariş kanalları ve satıcı bilgileri buradan değişir; boş bırakılan alan sitede görünmez.
export const site = {
  ad: 'Savana Season',
  alt: 'beton objeler',
  baslik: 'Savana Season · beton objeler',
  aciklama:
    'Yalnız beton, yalnız çelik: brütalist ve gotik objeler. Katedral ve Liman koleksiyonları, endüstriden konseptler.',
  url: 'https://pbyloyth.github.io/savana-season',

  // Satış kapalı: site şimdilik neler yapabildiğimizi gösteren vitrin (fiyat ve sipariş düğmeleri gizli).
  satis: false,

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
