# Yol Haritası

Bu dosya, projenin gelecek aşamalarındaki planları içerir.
**Şu anda hiçbir ürün satışa sunulmamaktadır.**

> Kesin tarih veya tamamlanma yüzdesi paylaşılmıyor: henüz gerçek
> kullanıcı verisi oluşmadığı için bu tür bir rakam uydurma olurdu.
> Site üzerindeki "Geliştirme Yol Haritası" bölümü bu dosyayla
> aynı sırayı izler.

## Faz 0 — Temel ✅

- Marka kimliği ve tasarım sistemi
- Tanıtım sitesi (statik, GitHub Pages)
- SEO, erişilebilirlik ve performans temelleri

## Faz 0.5 — İnteraktif prototip ✅

- [x] Etkileşimli hikâye demo'su (Hero'nun hemen altında)
- [x] 3 tema: Uzay Macerası · Büyülü Orman · Deniz Altı Dünyası
- [x] 3 yaş grubu (3–5 / 6–8 / 9–12) — cümle uzunluğu ve kelime
      seçimi yaşa göre uyarlanıyor
- [x] 4 opsiyonel karakter özelliği — olay örgüsüne giriyor
- [x] Şablon-tabanlı anlatı (rastgele cümle birleştirmiyor)
- [x] Yazdır / PDF çıktısı (`@media print`)
- [x] XSS güvenli render (`textContent`), veri saklamıyor
- [x] `node:test` ile 26 birim testi (`npm test`)
- [x] Ürün durumu etiketleri, yol haritası bölümü, iletişimde
      doğrulanamaz iddiaların temizliği

## Faz 1 — Doğrulama (sıradaki öncelik)

- [ ] `docs/VALIDATION_PLAN.md`'deki 10–20 görüşmeyi tamamla
- [ ] Tek seferlik değerlendirme: yeşil / sarı / kırmızı kararı
- [ ] Geri bildirimden çıkan en acil 3 düzeltmeyi uygula

> Bu faz tamamlanmadan ödeme, baskı veya büyüme işine girişilmez.

## Faz 2 — Sunucu tarafında hikâye üretimi

- [ ] `docs/CLAUDE_INTEGRATION.md`'e göre Worker iskeleti
- [ ] Girdi doğrulama + JSON şema doğrulama + içerik filtresi
- [ ] Yerel motora otomatik düşme (fallback) — demo hiç kırılmaz
- [ ] Hız sınırı, aylık bütçe tavanı ve kısa TTL önbellek
- [ ] KVKK/gizlilik metni, veri toplama başlamadan önce

## Faz 3 — Kitap deneyimi

- [ ] Sayfalama (6 paragraf → kitap sayfaları) ve kapak tasarımı
- [ ] Yazdırma/PDF kalitesi: kenar boşlukları, sayfa numarası
- [ ] Görsel üretimi ve baskı iş birlikleri için maliyet araştırması
- [ ] Orijinal illüstrasyonların üretimi ve WebP/AVIF optimizasyonu

## Faz 4 — Platform genişlemesi

- [ ] "Anılarımızdan Bir Hikâye" ve "Hayalimdeki Macera" kategorileri
- [ ] Dijital hikâye deneyimleri (etkileşimli okuma)
- [ ] Özel gün sürprizleri (doğum günü, yıldönümü)
- [ ] Ödeme altyapısı — yalnızca talep kanıtlanırsa
- [ ] İnsan incelemesi (editoryal onay) akışı — yalnızca üretim
      başlayınca

## Teknik borçlar / notlar

- [ ] Fontları kendi sunucuya taşı (gizlilik / çevrimdışı okuma)
- [ ] OG kapağı için raster (PNG) versiyon üret (sosyal medya
      crawlerları SVG og:image'i desteklemeyebilir)
- [ ] Blog / hikâye arşivi için Astro content collections
- [ ] Çok dilli destek (EN) değerlendirilebilir
- [ ] `ConceptArt.astro` içindeki `family` varyantı şu an kullanılmıyor
      (örnek kartları demo temalarıyla hizalandı); ileride geri
      kullanılabilir
