# Claude Entegrasyonu — Tasarım Notu

> **Durum: planlama aşamasında.** Bu dokümanda anlatılan servis
> henüz yazılmamıştır. Ücretli API çağrısı yapılmamakta, istemciye
> hiçbir API anahtarı yerleştirilmemekte ve sitedeki demo, mevcut
> yerel şablon motorunu kullanmaktadır.
>
> Bu dosya, iş uygulamaya geçmeden önce mimariyi, sınırları ve
> riskleri netleştirmek için hazırlanmıştır.

---

## 1. Kapsam ve hedefler

| Hedef | Açıklama |
| --- | --- |
| Yapılacak | Sunucu taraflı bir servis üzerinden değişken uzunlukta, bağlama duyarlı hikâye üretimi denemek |
| Yapılmayacak | API anahtarını tarayıcıya koymak, üretimde kullanıcının girdisini kalıcı olarak saklamak, "Powered by Claude" gibi doğrulanamayan bir iddia kullanmak |
| Korunacak | Sitedeki yerel demo her koşulda çalışır kalacak; API kapalıysa veya hata verirse kullanıcı bir şey fark etmeyecek |

İki temel prensip:

1. **Sözleşme sabit, üretici değişken.** Arayüz `generateStory()` sonucu
   olan `StoryResult` ile konuşur. Bu sözleşme `src/lib/storyTypes.ts`
   içinde tanımlıdır. Geçişte yalnızca bu fonksiyonun arkasındaki
   uygulama değişir.
2. **Anahtar istemciye asla ulaşmaz.** Üretimde tarayıcı yalnızca
   kendi origin'undaki (aynı domain'deki) bir uç noktaya istek atar.

---

## 2. Hedef mimari

```
┌─────────────────────────── Tarayıcı ────────────────────────────┐
│  StoryDemo.astro                                                │
│      │                                                          │
│      ▼                                                          │
│  storyEngine.generateStory(input)                               │
│      │                                                          │
│      ├── yerel şablon motoru (şu an çalışan durum)               │
│      │                                                          │
│      └── [ileride] fetch('/api/v1/story') ───────────┐          │
│                                                       │          │
└───────────────────────────────────────────────────────┼──────────┘
                                                        │
                                                        ▼
                                    ┌───────────────────────────────┐
                                    │  Cloudflare Worker            │
                                    │  (aynı domain, /api/v1/*)     │
                                    │                               │
                                    │  1. girdi doğrulama           │
                                    │  2. rate limit + bütçe kontrol │
                                    │  3. yaş/tema prompt şablonu    │
                                    │  4. Anthropic API çağrısı     │
                                    │     ANTHROPIC_API_KEY (secret) │
                                    │  5. JSON şema doğrulama       │
                                    │  6. içerik güvenliği filtresi  │
                                    │  7. (ops.) kısa TTL önbellek   │
                                    └───────────────┬───────────────┘
                                                    │
                                                    ▼
                                        api.anthropic.com
```

### Neden Cloudflare Worker?

- Statik site zaten CDN arkasında; Worker aynı domain'de `/api/v1/*`
  için rota oluşturur — CORS ve özel alan adı derdi çıkmaz.
- Secret yönetimi (`wrangler secret put`) anahtarı depodan uzak tutar.
- Fiyatlandırma istek başına çalışır; sabit sunucu gerekmez.
- `fetch` ile Anthropic API'ye doğrudan çağrılır, framework gerekmez.

> Alternatif: aynı mimari Vercel/Netlify Functions veya kendi küçük bir
> Node servisiyle de kurulabilir. Değişmeyen şey, "anahtar sunucuda,
  istemci yalnızca kendi origin'ine konuşur" kuralıdır.

---

## 3. API sözleşmesi

### İstek — `POST /api/v1/story`

```jsonc
{
  "heroName": "Deniz",        // 2–30 karakter, düz metin
  "theme": "space",           // "space" | "forest" | "ocean"
  "ageGroup": "6-8",          // "3-5" | "6-8" | "9-12"
  "trait": "curious",         // opsiyonel, temaya özel kimlik
  "variant": 0                // opsiyonel, 0..N-1 (çeşitlilik)
}
```

Bu gövde, `src/lib/storyTypes.ts` içindeki `StoryInput` ile birebir
aynıdır.

### Yanıt — `200 OK`

```jsonc
{
  "title": "Deniz ve Sönen Yıldız",
  "themeId": "space",
  "themeLabel": "Uzay Macerası",
  "ageLabel": "6–8 yaş",
  "traitLabel": "Meraklı",
  "paragraphs": ["…", "…", "…", "…", "…", "…"],
  "pages": [
    { "index": 1, "paragraphs": ["…", "…", "…", "…"] },
    { "index": 2, "paragraphs": ["…", "…"] }
  ],
  "provenance": "Bu hikâye … konsept önizlemedir …"
}
```

Bu da `StoryResult` ile birebir aynıdır.

### Hata sınıfları

| Durum | Kod | Tarayıcı davranışı |
| --- | --- | --- |
| 400 | `invalid_input` | Kullanıcıya Türkçe, alan bazlı hata göster |
| 429 | `rate_limited` | Kısa bekleme öner; istemci sonucu yerel motora düşürür |
| 502 | `upstream_error` | Yerel motora düş (sessizce), kullanıcıya hata gösterme |
| 503 | `budget_exceeded` | Yerel motora düş; günlüğü imzalayarak durumu işaretle |
| 500 | `internal` | Yerel motora düş |

**Önemli:** Hata durumunda sayfa çalışmaz hâle gelmemelidir. İstemci,
`fetch` başarısız olursa veya yanıt `ok` değilse `LocalStoryGenerator`
ile devam eder. Demo her koşulda çalışır.

---

## 4. Anahtar ve sırlar yönetimi

```bash
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put SERVICE_BUDGET_USD_MONTH   # opsiyonel, aylık tavan
```

Kurallar:

- `ANTHROPIC_API_KEY` yalnızca Worker environment/secret'ında tutulur.
- Koddaki hiçbir dosyaya, `.env` dosyasına veya istemci bundle'ına
  yazılmaz; repo `.env*` dosyalarını `.gitignore` ile hariç tutar.
- Anahtar periyodik olarak döndürülür (öneri: 90 günde bir veya
  sızıntı şüphesinde).
- Worker, çağrı başına maliyeti ölçer; aylık tavanı aşınca
  `budget_exceeded` döner ve yerel motor devreye girer.

---

## 5. Prompt şablonları

### Sistem prompt'u (tüm çağrılar için ortak)

```
Sen, 3-12 yaş arası çocuklar için kişiselleştirilmiş hikâyeler yazan
bir anlatıcısın. Kurallar:

- Yalnızca geçerli JSON döndür; Markdown, kod bloğu veya açıklama ekleme.
- JSON şeması: { "title": string, "paragraphs": string[] }
- "paragraphs" tam olarak 6 öğe içermeli; her paragraf 1-3 cümle.
- HTML, etiket veya kaçış karakteri kullanma; düz Türkçe metin yaz.
- Kahramanın adını yalnızca doğal yerlerde kullan; adı her paragrafa
  tekrar etme.
- Yaş grubuna uygun kelime ve cümle uzunluğu kullan.
- Şiddet, korku, ölüm, yalnızlık kaygısı veya cinsel içerik yok.
- Din, siyaset, marka veya gerçek kişi göndermesi yapma.
- Ürün, satış, fiyat veya siparişten bahsetme.
```

### Kullanıcı prompt'u (şablon dolgulu)

```
Tema: {themeLabel} — {themeShort}
Yaş grubu: {ageLabel}
Kahraman adı: {heroName}
Karakter özelliği: {traitLabel | "seçilmedi"}
Varyant no: {variant}   // aynı girdi için farklı açılış/kapanış seç

Hikâyenin iskeleti:
1. Giriş — sorunun fark edildiği sahne
2. Tepki — kahramanın karakter özelliğine göre tepkisi
3. Çağrı — rehber karakterin gelişi ve istek
4. Yolculuk — yaşa uygun engeller
5. Doruk — özelliğin çözümde kullanıldığı an
6. Kapanış — sıcak, ders içermeyen final

Şu alan adını kullan: {heroName}
```

`{themeShort}`, `{traitLabel}` ve `{heroName}` değerleri mevcut
`themes` verisinden gelir; `{heroName}` sunucuda `sanitizeName()`
geçirmiş olur.

### Sıcaklık / yaratıcılık

- `temperature`: 0.7–0.9 aralığında denenir (tutarlılık ile
  çeşitlilik dengesi).
- `max_tokens`: ~900 (6 paragraf + başlık için yeterli pay).
- Model seçimi: en güncel ekonomik model ile başlanır; kalite/maliyet
  ölçümü sonrası karar verilir. **Bu dokümanda model adı ve maliyet
  rakamı verilmez** — bunlar doğrulanmadan paylaşılmaz.

---

## 6. JSON çıktısının doğrulaması

Modelin çıktısı **güvenilmez veridir**. Worker sırasıyla şunları yapar:

1. **Ayıklama:** Yanıt metninden JSON nesnesi çıkarılır
   (mümkünse `response` içinde `tool_use` / structured output kullanılır).
2. **Şema kontrolü:** `title` var mı, `paragraphs` bir `string[]` mi?
   Değilse → `upstream_error`.
3. **Uzunluk kontrolü:** `paragraphs.length === 6`; her paragraf
   40–600 karakter aralığında; `title` ≤ 80 karakter.
4. **HTML temizliği:** `<` ve `>` karakterleri `(` ve `)` ile
   değiştirilir (aynı `sanitizeName()` kuralı).
5. **Yasaklı içerik taraması:** Yetişkin içerik, marka/marka adı,
   gerçek kişi, şiddet sözcükleri için basit bir kara liste.
   Tutarsa → `upstream_error`, istemci yerele düşer.
6. **Yer tutucu kontrolü:** `{name}` gibi işlenmemiş kalıplar kalırsa
   → yoksayılır/temizlenir.
7. **`provenance` alanı sunucuda sabitlenir**, modele emanet edilmez.

Doğrulama başarısız olursa yanıt **asla** ham hâlde kullanıcıya
ulaştırılmaz.

---

## 7. Hız sınırlama ve maliyet kontrolü

| Katman | Kural (başlangıç önerisi) | Amaç |
| --- | --- | --- |
| IP başına | 5 istek / dakika, 50 istek / gün | Gösterge/sızıntı önleme |
| Global | Dakikalık istek tavanı | Beklenmedik yük |
| Aylık | Sabit bütçe tavanı (`SERVICE_BUDGET_USD_MONTH`) | Fatura sürprizi |
| Önbellek | Aynı `(theme, ageGroup, trait, variant)` için 24 saat | Tekrarlayan istekleri bedavaya düşürme |

- Sınırlama **Worker'da** (KV veya Durable Object ile) tutulur;
  tarayıcı tarafı sınırlama bilgi amaçlıdır, güven sayılmaz.
- `heroName` önbellek anahtarına **dahil edilmez** — aynı hikâye
  yapısı, farklı isimlerle paylaşılabilir (kişisel veri önbellekte
  tutulmaz).
- Aylık bütçe dolduğunda: `budget_exceeded` → istemci yerel motora
  düşer, servis kapanmaz.

---

## 8. Gizlilik ve KVKK

- **Kalıcı depolama yok.** `heroName` hiçbir veritabanına, KV'ye,
  log'a yazılmaz.
- **Loglama:** Yalnızca zaman, durum kodu, tema, yaş grubu ve
  hata türü. İsim, IP ve tam girdi loglanmaz.
- **Üçüncü taraf:** Anthropic'e yalnızca üretim için gerekli prompt
  gider (ad + tema + yaş + özellik). Bkz. ilgili sağlayıcının veri
  işleme koşulları.
- **İstemci tarafı:** Demo zaten hiçbir veriyi göndermez; bu, sitedeki
  "Bu bilgi cihazından çıkmaz" ifadesiyle tutarlıdır.
- **Süre:** Üretim sonucu 24 saatten uzun saklanmaz (önbellek TTL).
- Sitede KVKK aydınlatma metni, gerçek bir veri toplama başladığında
  eklenmelidir; eklenmeden önce toplama yapılmaz.

---

## 9. Geçiş planı

| Aşama | İş | Çıktı / çıkış ölçütü |
| --- | --- | --- |
| 0 | **Şu an:** yerel şablon motoru yayında | 26 birim testi geçiyor |
| 1 | `docs/CLAUDE_INTEGRATION.md` (bu dosya) | Mimari ve sınırlar yazılı |
| 2 | Worker iskeleti + girdi doğrulama + yerel motor fallback | API kapalıyken demo bozulmuyor |
| 3 | Prompt şablonları + JSON doğrulama + kara liste | 3 tema × 3 yaş × 4 özellik için kalite okuması |
| 4 | Rate limit + bütçe + önbellek | Fatura öngörülebilir |
| 5 | Kapalı test (yalnızca kendi cihazından) | Konsol hatasız, yanıt < 5 sn |
| 6 | `StoryGenerator` uygulamasını uzak sürüme çevirme | Arayüz değişmedi, demo aynı |

Her aşamada geri dönüş: `LocalStoryGenerator` tek satırda devreye
alınabilir.

---

## 10. Etiketleme kuralları (zorunlu)

- Üretim gerçekten devreye girip stabilleşene kadar sitede
  **"Yapay zekâ ile üretilir"** ibaresi **bulunmayacak**.
- Motor yerel şablon olduğu sürece demo şu şekilde etiketlenir:
  *"İnteraktif konsept demo"* ve *"Yapay zekâ API'si kullanılmaz"*.
- API devreye girerse ifade net ve sade olur: örn.
  *"Bu hikâye, bir yapay zekâ modelinden alınan taslak üzerine
  kurallarla şekillendirilir."* — "Powered by Claude" gibi bir
  sağlayıcı rozeti, sağlayıcının marka kılavuzu izni olmadan
  kullanılmaz.
- İnsan incelemesi gerçekten yapılmadan "insan onaylı" ifadesi
  kullanılmaz.

---

## 11. Bilinmeyenler ve karar noktası gerektirenler

1. **Model ve maliyet:** Doğrulanmış fiyat ve kalite verisi olmadan
   rakam paylaşılmayacak. İlk deneme sonrası gerçek ölçüm yapılacak.
2. **Sağlayıcı sözleşmesi / KVKK:** Anthropic ile veri işleme
   koşulları incelenmeli; Avrupa/Türkiye kullanıcı verisi için
   uygunluk teyit edilmeli.
3. **Yaş uyumu ve içerik güvenliği:** 3-5 yaş için ek sıkı bir
   sözcük listesi gerekebilir.
4. **Kapasite:** Worker ücretsiz/hobi planında günlük istek tavanı
   belirlenmeli.
5. **Görsel üretimi:** Hikâye illüstrasyonu ayrı bir adımdır; bu
   dokümanın kapsamı yalnızca metindir.
