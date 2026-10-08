# DOMAIN Bağlama Talimatları

Bu site statik olduğundan herhangi bir sunucu gerekmez. Aşağıdaki iki
adım yeterlidir.

## 1. GitHub Pages'te özel alan adı

1. Depo köküne (veya `site/` klasörü publish ediliyorsa onun içinde)
   `CNAME` adında boş bir dosya oluştur ve içine şunu yaz:

   ```
   hayalincanlansin.com.tr
   ```

   `astro.config.mjs` içindeki `site` değeri zaten
   `https://hayalincanlansin.com.tr` olarak ayarlıdır.

2. GitHub deposunda **Settings → Pages → Custom domain** kısmından
   `hayalincanlansin.com.tr` yaz ve kaydet. GitHub otomatik olarak
   A kayıtlarını önerecektir.

## 2. DNS kayıtları (domain sağlayıcında)

`hayalincanlansin.com.tr` için:

| Tür  | İsim (Host) | Değer |
|------|-------------|-------|
| A    | @           | 185.199.108.153 |
| A    | @           | 185.199.109.153 |
| A    | @           | 185.199.110.153 |
| A    | @           | 185.199.111.153 |

Alternatif olarak (sağlayıcı CNAME apex destekliyorsa, örneğin Cloudflare
gibi): `@` → `<kullanıcı>.github.io.` CNAME kaydı.

`www` alt alan adı için:

| Tür    | İsim (Host) | Değer |
|--------|-------------|-------|
| CNAME  | www         | <kullanıcı>.github.io. |

DNS değişiklikleri 1–24 saat arasında yayılır. HTTPS sertifikası,
GitHub Pages ayarlarından "Enforce HTTPS" açıldığında otomatik olur.

## Doğrulama sonrası

- `src/config/site.ts` içindeki `domain`, `siteUrl` ve `email`
  alanlarını kontrol et.
- `public/robots.txt` içindeki sitemap URL'si canlı domaini
  gösteriyor olmalı (şu an için doğrudur).
- E-posta adresinin (`bilgi@hayalincanlansin.com.tr`) çalıştığını
  test et; çalışmıyorsa iletişim bölümündeki adresi güncelle.
