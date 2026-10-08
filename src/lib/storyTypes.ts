/**
 * Hayalin Canlansın — Hikâye demo'su için paylaşılan tipler.
 *
 * Bu tipler hem tarayıcıda çalışan statik demo'nun (storyEngine.ts)
 * hem de ilerideki gerçek API entegrasyonunun (bkz.
 * docs/CLAUDE_INTEGRATION.md) ortak sözleşmesidir.
 *
 * Tasarım ilkesi: `generateStory()` tarayıcıda da, sunucuda da aynı
 * sözleşmeyi karşılar. Gerçek Claude API entegrasyonunda yalnızca
 * `StoryGenerator` arayüzünün uygulaması değişir, arayüz kalır.
 */

export const THEMES = ['space', 'forest', 'ocean'] as const;
export type ThemeId = (typeof THEMES)[number];

export const AGE_GROUPS = ['3-5', '6-8', '9-12'] as const;
export type AgeGroupId = (typeof AGE_GROUPS)[number];

export interface Trait {
  /** URL/veri katmanında güvenli kimlik. */
  id: string;
  /** Ekranda görünen etiket (örn. "Cesur"). */
  label: string;
  /** Cümle içi kullanım için küçük harfli hâli (örn. "cesur"). */
  lower: string;
}

export interface StoryInput {
  /** Kahramanın adı. Yalnızca düz metin; HTML kabul edilmez. */
  heroName: string;
  theme: ThemeId;
  ageGroup: AgeGroupId;
  /** Temaya özel opsiyonel karakter özelliği kimliği. */
  trait?: string;
  /** Aynı girdiyle farklı varyant üretmek için. */
  variant?: number;
}

export interface StoryPage {
  /** 1 tabanlı sayfa numarası (ileride kitap sayfalama için). */
  index: number;
  paragraphs: string[];
}

export interface StoryResult {
  title: string;
  themeId: ThemeId;
  themeLabel: string;
  ageLabel: string;
  traitLabel: string | null;
  /** Düz metin paragraflar. Asla HTML değil — güvenli render için. */
  paragraphs: string[];
  /** İleride kitap sayfalamasına hazırlık olarak bölünmüş sayfalar. */
  pages: StoryPage[];
  /** Kaynak hakkında dürüst not (ör. "tarayıcı şablonu"). */
  provenance: string;
}

export interface StoryGenerator {
  generate(input: StoryInput): StoryResult;
}

/** Bir temanın tüm içeriğini ve üretim kuralını tanımlar. */
export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  /** Kart üzerindeki kısa açıklama. */
  short: string;
  /** Temaya özgü karakter özellikleri (en az 3, en fazla 5). */
  traits: Trait[];
  /** Kullanılabilir varyant sayısı (en az 2). */
  variantCount: number;
  /** Paragraf setini üretir. Düz metin; HTML içermez. */
  build(params: {
    name: string;
    age: AgeGroupId;
    trait: Trait | null;
    variant: number;
  }): string[];
}

/** Demo'nun her yerde kullanacağı dürüst, değişmez açıklama. */
export const DEMO_PROVENANCE =
  'Bu hikâye tarayıcınızda çalışan, önceden hazırlanmış şablonlarla ' +
  'üretilen bir konsept önizlemedir. Yapay zekâ API\'si kullanılmaz, ' +
  'girdileriniz cihazınızdan çıkmaz.';

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
}

export function isAgeGroupId(value: unknown): value is AgeGroupId {
  return typeof value === 'string' && (AGE_GROUPS as readonly string[]).includes(value);
}
