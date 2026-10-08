# Hayalin Canlansın — Web Sitesi

Kişisel anıları ve hayallerin, kişiye özel masallar, hikâye kitapları ve
yaratıcı dijital deneyimlere dönüştüğü bir yaratıcı teknoloji girişiminin
tanıtım sitesi. **Proje geliştirme aşamasında; hiçbir ürün henüz
satışa sunulmamaktadır.**

## Özellikler

- Astro ile oluşturulmuş tamamen statik site (sunucu, veritabanı yok)
- Kütüphanesiz, hafif JavaScript (mobil menü, scroll-reveal)
- El yazımı tasarım sistemi (krem / lavanta / pembe / şeftali paleti)
- %100 özgün SVG görselleri — harici görsel bağımlılığı yok
- Türkçe SEO, Open Graph, robots.txt, otomatik sitemap
- Erişilebilirlik: skip-link, klavye navigasyonu, `prefers-reduced-motion`
- GitHub Pages ve Cloudflare Pages'te yayınlanabilir

## Gereksinimler

- Node.js 20 veya üstü

## Yerel çalıştırma

```bash
npm install
npm run dev        # Geliştirme sunucusu (http://localhost:4321)
```

## Derleme ve denetim

```bash
npm run build      # Statik çıktı: dist/
npm run preview    # Derlenmiş siteyi yerel olarak önizle
npm run check      # TypeScript tip denetimi
```

## Yayınlama (GitHub Pages)

Bu proje, GitHub deposunun **kökü** olarak tasarlanmıştır
(`.github/workflows/deploy.yml` kökte çalışır).

1. Bu klasörün tüm içeriğini GitHub deposunun köküne taşı.
2. Depo ayarlarından **Settings → Pages → Source** seçeneğini
   **GitHub Actions** olarak belirle.
   **Bu adım tek seferlik ve el ile yapılmalıdır:** GitHub,
   Actions token'ının API üzerinden Pages'i etkinleştirmesine
   izin vermez ("Resource not accessible by integration").
3. `main` dalına push ettiğinde workflow otomatik çalışır ve site
   `https://abdlsmt.github.io/hayalincanlansin/` adresinde yayınlanır.

> Not: `astro.config.mjs` içindeki `site` değeri şu an
> `https://hayalincanlansin.com.tr` olarak ayarlıdır. Özel
> alan adı bağlanana kadar canonical URL'ler canlı domaini
> gösterir; DNS yönlendirmesi yapıldığında doğru hâle gelir.
>
> Alt klasör yolları: Site kök dizinden (`/`) derlendiği için
> `abdlsmt.github.io/hayalincanlansin/` alt adresinde görseller
> ve CSS geçici olarak 404 verebilir. Bu, özel alan adı
> (`hayalincanlansin.com.tr`) DNS'ye yönlendirildikten sonra
> çözülür; repo `public/CNAME` dosyasıyla birlikte gelir.

## Alan adı bağlama

`DOMAIN.md` dosyasına bak.

## Proje yapısı

```
├── .github/workflows/deploy.yml   # GitHub Pages deployment
├── public/                        # Statik varlıklar
│   ├── favicon.svg · favicon-32.png · favicon-16.png
│   ├── og-cover.svg · robots.txt · js/main.js
├── scripts/make-favicons.mjs      # Favicon PNG üretici
├── src/
│   ├── components/                # Bölüm bileşenleri
│   ├── config/site.ts             # Merkezi ayarlar (domain, e-posta)
│   ├── layouts/MainLayout.astro   # SEO head + sayfa iskeleti
│   ├── pages/index.astro          # Tek sayfa
│   └── styles/global.css          # Tasarım sistemi
├── astro.config.mjs · package.json · tsconfig.json
├── README.md · ROADMAP.md · DOMAIN.md
```

## Dürünlük ilkeleri

- Satın alma butonu, müşteri yorumu, kullanıcı sayısı veya ortaklık
  iddiası bulunmamaktadır.
- Ürün kartları "Planlanıyor", hikâye örnekleri "Konsept Örneği"
  olarak etiketlenmiştir.
- İletişim, doğrudan `mailto:` bağlantısıdır; sahte form yoktur.
