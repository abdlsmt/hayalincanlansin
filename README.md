# Hayalin Canlansın — Web Sitesi

Kişisel anıları ve hayallerin, kişiye özel masallar, hikâye kitapları ve
yaratıcı dijital deneyimlere dönüştüğü bir yaratıcı teknoloji projesinin
tanıtım sitesi ve **çalışan hikâye prototipi**. Proje erken aşama
geliştirmededir; satılabilir bir ürün, sipariş veya baskı hizmeti
**henüz yoktur.**

## Özellikler

- Astro ile oluşturulmuş tamamen statik site (sunucu, veritabanı yok)
- **Etkileşimli hikâye demo'su**: 3 tema × 3 yaş grubu × 4 karakter
  özelliği, tarayıcıda çalışan şablon motoru ile anında üretim
- Kütüphanesiz, hafif JavaScript (mobil menü, scroll-reveal, demo formu)
- El yazımı tasarım sistemi (krem / lavanta / pembe / şeftali paleti)
- %100 özgün SVG görselleri — harici görsel bağımlılığı yok
- Türkçe SEO, Open Graph, robots.txt, otomatik sitemap
- Erişilebilirlik: skip-link, `fieldset/legend` gruplama, `aria-live`
  sonuç alanı, `prefers-reduced-motion`
- Yazdırma stili: hikâye `@media print` ile tek sayfa PDF'e çıkar
- GitHub Actions ile GitHub Pages'e otomatik yayınlama

## Gereksinimler

- Node.js 22.12 veya üstü

## Yerel çalıştırma

```bash
npm install
npm run dev        # Geliştirme sunucusu (http://localhost:4321)
```

## Denetim, test ve derleme

```bash
npm run check      # Astro + TypeScript denetimi
npm test           # node:test ile hikâye motoru testleri (26 test)
npm run build      # Statik çıktı: dist/
npm run preview    # Derlenmiş siteyi yerel olarak önizle
```

`npm test`, `src/lib/` içindeki hikâye motorunu doğrular: tema seçimi,
yaş uyarlaması, karakter etkisi, varyant rotasyonu, XSS kaçışı, boş/geçersiz
girdi davranışı ve Türkçe karakter korunumu.

## Yayınlama (GitHub Pages)

Bu proje, GitHub deposunun **kökü** olarak tasarlanmıştır
(`.github/workflows/deploy.yml` kökte çalışır).

1. Bu klasörün tüm içeriğini GitHub deposunun köküne taşı.
2. Depo ayarlarından **Settings → Pages → Source** seçeneğini
   **GitHub Actions** olarak belirle.
   **Bu adım tek seferlik ve el ile yapılmalıdır:** GitHub,
   Actions token'ının API üzerinden Pages'i etkinleştirmesine
   izin vermez ("Resource not accessible by integration").
3. `main` dalına push ettiğinde workflow otomatik çalışır.

Canlı site: `https://hayalincanlansin.com.tr`
(`astro.config.mjs` içindeki `site` değeri ve `public/CNAME` aynı adresi
gösterir.)

## Alan adı bağlama

`DOMAIN.md` dosyasına bak.

## Proje yapısı

```
├── .github/workflows/deploy.yml   # GitHub Pages deployment
├── docs/
│   ├── CLAUDE_INTEGRATION.md      # Planlanan hikâye API mimarisi
│   ├── STARTUP_OVERVIEW.md        # Başvuru özeti (İngilizce)
│   └── VALIDATION_PLAN.md         # Doğrulama / geri bildirim planı
├── public/                        # Statik varlıklar
│   ├── favicon.svg · favicon-32.png · favicon-16.png
│   ├── og-cover.svg · robots.txt · js/main.js
├── scripts/make-favicons.mjs      # Favicon PNG üretici
├── src/
│   ├── components/                # Bölüm bileşenleri (StoryDemo, Roadmap …)
│   ├── config/site.ts             # Merkezi ayarlar (domain, e-posta)
│   ├── lib/
│   │   ├── storyEngine.ts         # Üretici: theme × yaş × özellik × varyant
│   │   ├── storyTypes.ts          # Paylaşılan sözleşme (API'ye hazır)
│   │   └── stories/               # space · forest · ocean şablonları
│   ├── layouts/MainLayout.astro   # SEO head + sayfa iskeleti
│   ├── pages/index.astro          # Tek sayfa
│   └── styles/global.css          # Tasarım sistemi + yazdırma stili
├── tests/storyEngine.test.ts      # node:test birim testleri
├── astro.config.mjs · package.json · tsconfig.json
├── README.md · ROADMAP.md · DOMAIN.md
```

## Demo nasıl çalışıyor

`src/lib/storyEngine.ts` içindeki `generateStory()` girdi olarak
kahraman adı, tema, yaş grubu, opsiyonel karakter özelliği ve varyant
numarası alır; 6 paragraflık bir hikâye ve kitap sayfaları döner.

- Şablon-tabanlıdır: rastgele cümle birleştirmez.
- Çıktı düz metindir; arayüz yalnızca `textContent` ile basar (XSS yok).
- Hiçbir girdi `localStorage`'a yazılmaz veya sunucuya gönderilmez.
- Aynı sözleşme `docs/CLAUDE_INTEGRATION.md` içinde tanımlı gelecek API
  ile birebir aynıdır; geçişte yalnızca üretici değişir.

## Dürüstlük ilkeleri

- Satın alma butonu, müşteri yorumu, kullanıcı sayısı veya ortaklık
  iddiası bulunmamadır.
- Ürün kartları gerçek durumuna göre etiketlenir
  (`Çalışan prototip var` / `Prototip aşamasında` / `Konsept aşamasında` /
  `Gelecek genişleme`); çalışmayan hiçbir ürün için sipariş izlenimi
  verilmez.
- Demo, "İnteraktif konsept demo" olarak etiketlenir; "AI ile üretildi"
  iddiasında bulunmaz (kullanılan motor yerel şablon motorudur).
- Yol haritasında uydurma tarih veya tamamlanma yüzdesi paylaşılmaz.
- İletişim, doğrudan `mailto:` bağlantısıdır; sahte form yoktur,
  yanıt süresi garantisi verilmez.
