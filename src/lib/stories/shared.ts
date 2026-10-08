import type { AgeGroupId, StoryPage, Trait } from '../storyTypes.ts';

/** {değişken} yer tutucularını düz metinle doldurur. HTML üretmez. */
export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : match,
  );
}

/** Yaşa göre metin seçer; eksik yaş için yedeğe düşer. */
export function ageText(
  age: AgeGroupId,
  variants: Partial<Record<AgeGroupId, string>>,
  fallback: string,
): string {
  return variants[age] ?? fallback;
}

/** Yaş etiketini insan-okunur biçime çevirir. */
export const AGE_LABELS: Record<AgeGroupId, string> = {
  '3-5': '3–5 yaş',
  '6-8': '6–8 yaş',
  '9-12': '9–12 yaş',
};

/** Belirtilen trait kimliğini bulur; bulunamazsa null döner. */
export function findTrait(traits: Trait[], id?: string): Trait | null {
  if (!id) return null;
  return traits.find((t) => t.id === id) ?? null;
}

/**
 * Karakter özelliğine ve yaşa göre metin seçer.
 * Trait yoksa ya da tanımı eksikse `fallback` kullanılır.
 */
export function traitAge(
  age: AgeGroupId,
  trait: Trait | null,
  map: Record<string, Partial<Record<AgeGroupId, string>>>,
  fallback: Partial<Record<AgeGroupId, string>>,
): string {
  const neutral = fallback['6-8'] ?? fallback[age] ?? '';
  if (!trait) return ageText(age, fallback, neutral);
  const variants = map[trait.id];
  if (!variants) return ageText(age, fallback, neutral);
  return ageText(age, variants, variants['6-8'] ?? neutral);
}

/** Paragraf listesini kitap sayfalarına böler (varsayılan 4'er paragraf). */
export function paginate(paragraphs: string[], perPage = 4): StoryPage[] {
  const pages: StoryPage[] = [];
  for (let i = 0; i < paragraphs.length; i += perPage) {
    pages.push({
      index: pages.length + 1,
      paragraphs: paragraphs.slice(i, i + perPage),
    });
  }
  return pages;
}

/**
 * Güvenli girdi temizliği:
 * - ASCII kontrol karakterleri atılır
 * - `<` ve `>` düz metne çevrilir (savunma katmanı)
 * - Fazla boşluklar tek boşluğa indirilir, tek satıra indirgenir
 * - Uzunluk sınırı uygulanır
 *
 * Not: Çıktı zaten `textContent` ile basıldığı için HTML kaçışı
 * motorun değil, render katmanının görevidir. Bu fonksiyon ek
 * savunma katmanıdır.
 */
export function sanitizeName(raw: string, maxLength = 30): string {
  let cleaned = '';
  for (const ch of raw) {
    const code = ch.codePointAt(0) ?? 0;
    // Satır sonu ve sekme → boşluk (kelimeler birleşmesin)
    if (ch === '\n' || ch === '\r' || ch === '\t') {
      cleaned += ' ';
      continue;
    }
    // Diğer kontrol karakterleri tamamen atılır
    if (code < 0x20 || code === 0x7f) continue;
    if (ch === '<') cleaned += '(';
    else if (ch === '>') cleaned += ')';
    else cleaned += ch;
  }
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned.slice(0, maxLength);
}
