# Savana Season · beton objeler

Liman Koleksiyonu'nun satış sitesi. Yedi parça, altı yüzey; her ürünün ve her yüzeyin kendi sayfası var (paylaşılan bağlantı o yüzeyin görseliyle açılır).

Canlı: https://pbyloyth.github.io/savana-season/

## Sık değişenler

| Ne | Nerede |
|---|---|
| Sipariş kanalı (WhatsApp, Instagram, e-posta), ödeme, satıcı bilgileri | `src/data/site.js` |
| Ürün adı, fiyat, metin, ölçüler | `src/data/urunler.js` |
| Yüzey adları ve açıklamaları | `src/data/yuzeyler.js` |

## Komutlar

```
npm install
npm run dev        # http://localhost:4341/savana-season/
npm run gorseller  # render klasörlerinden src/assets görsellerini yeniden üretir
npm run yayinla    # kurar ve gh-pages dalına gönderir (site birkaç dakikada güncellenir)
```

Görseller UMUTMASA'daki Blender betiğinden gelir (`C:\projects\beton-obje\tasarim\koleksiyon.py`, `foto` modu, `FOTO_KAPLAMA`).
