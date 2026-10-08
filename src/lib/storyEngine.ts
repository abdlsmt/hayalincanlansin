import {
  DEMO_PROVENANCE,
  THEMES,
  isAgeGroupId,
  isThemeId,
  type AgeGroupId,
  type StoryGenerator,
  type StoryInput,
  type StoryResult,
  type ThemeDefinition,
  type ThemeId,
} from './storyTypes.ts';
import { AGE_LABELS, findTrait, paginate, sanitizeName } from './stories/shared.ts';
import { forestTheme } from './stories/forest.ts';
import { oceanTheme } from './stories/ocean.ts';
import { spaceTheme } from './stories/space.ts';

/** Kayıtlı temalar. Yeni tema eklemek için buraya bir satır eklenir. */
export const themes: Record<ThemeId, ThemeDefinition> = {
  space: spaceTheme,
  forest: forestTheme,
  ocean: oceanTheme,
};

export const themeList: ThemeDefinition[] = THEMES.map((id) => themes[id]);

/** Variant başına başlık kalıpları. {name} ile kahraman adı geçer. */
const TITLE_PATTERNS: Record<ThemeId, string[]> = {
  space: ['{name} ve Sönen Yıldız', '{name}, Yıldızların Peşinde'],
  forest: ['{name} ve Fısıldayan Orman', '{name} ve Kayıp Harita'],
  ocean: ['{name} ve Sönen Fener', '{name} ve Derinlerin Sırrı'],
};

const DEFAULT_NAME = 'Kahraman';
const DEFAULT_AGE: AgeGroupId = '6-8';
const FALLBACK_THEME: ThemeId = 'space';

function clampVariant(value: unknown, count: number): number {
  const n = typeof value === 'number' && Number.isFinite(value) ? Math.floor(value) : 0;
  const normalized = ((n % count) + count) % count;
  return normalized;
}

/**
 * Yerel (tarayıcı-içi) hikâye üretici.
 *
 * Sözleşme, ilerideki gerçek API entegrasyonuyla birebir aynıdır
 * (bkz. docs/CLAUDE_INTEGRATION.md). Yalnızca `generate()` içi
 * değişir; `StoryResult` şekli değişmez.
 */
export class LocalStoryGenerator implements StoryGenerator {
  generate(input: StoryInput): StoryResult {
    const themeId: ThemeId = isThemeId(input.theme) ? input.theme : FALLBACK_THEME;
    const theme = themes[themeId];
    const age: AgeGroupId = isAgeGroupId(input.ageGroup) ? input.ageGroup : DEFAULT_AGE;

    const name = sanitizeName(input.heroName ?? '') || DEFAULT_NAME;
    const trait = findTrait(theme.traits, input.trait);
    const variant = clampVariant(input.variant, theme.variantCount);

    const paragraphs = theme.build({ name, age, trait, variant });
    const pattern = TITLE_PATTERNS[themeId][variant % TITLE_PATTERNS[themeId].length];
    const title = pattern.replace('{name}', name);

    return {
      title,
      themeId,
      themeLabel: theme.label,
      ageLabel: AGE_LABELS[age],
      traitLabel: input.trait ? (trait?.label ?? null) : null,
      paragraphs,
      pages: paginate(paragraphs),
      provenance: DEMO_PROVENANCE,
    };
  }
}

/** Sayfanın kullanacağı kısa yol. */
export function generateStory(input: StoryInput): StoryResult {
  return new LocalStoryGenerator().generate(input);
}

/** Form tarafında da kullanılan temel girdi doğrulaması. */
export function validateInput(raw: { heroName?: string; theme?: string; ageGroup?: string }): {
  ok: boolean;
  message?: string;
} {
  const name = sanitizeName(raw.heroName ?? '');
  if (!name) {
    return { ok: false, message: 'Lütfen kahramanın adını yaz.' };
  }
  if (name.length < 2) {
    return { ok: false, message: 'İsim en az 2 karakter olmalı.' };
  }
  if (!isThemeId(raw.theme)) {
    return { ok: false, message: 'Lütfen bir tema seç.' };
  }
  if (!isAgeGroupId(raw.ageGroup)) {
    return { ok: false, message: 'Lütfen bir yaş grubu seç.' };
  }
  return { ok: true };
}
