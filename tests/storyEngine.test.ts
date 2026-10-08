import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { LocalStoryGenerator, generateStory, themeList, themes, validateInput } from '../src/lib/storyEngine.ts';
import { AGE_LABELS, paginate, sanitizeName } from '../src/lib/stories/shared.ts';
import { DEMO_PROVENANCE, isAgeGroupId, isThemeId, type AgeGroupId, type ThemeId } from '../src/lib/storyTypes.ts';

const ALL_THEMES: ThemeId[] = ['space', 'forest', 'ocean'];
const ALL_AGES: AgeGroupId[] = ['3-5', '6-8', '9-12'];

describe('tema listesi', () => {
  it('üç tema tanımlı ve kimlikleri tutarlı', () => {
    assert.equal(themeList.length, 3);
    assert.deepEqual(
      themeList.map((t) => t.id),
      ALL_THEMES,
    );
  });

  it('her temada en az 3 karakter özelliği var', () => {
    for (const theme of themeList) {
      assert.ok(theme.traits.length >= 3, `${theme.id} için özellik sayısı yetersiz`);
      assert.ok(theme.traits.length <= 5, `${theme.id} için özellik fazla`);
      for (const trait of theme.traits) {
        assert.ok(trait.id.length > 0, `${theme.id}: boş özellik kimliği`);
        assert.ok(trait.lower === trait.lower.toLowerCase(), `${theme.id}.${trait.id}: lower küçük harf değil`);
      }
    }
  });

  it('her temada en az 2 varyant var', () => {
    for (const theme of themeList) {
      assert.ok(theme.variantCount >= 2, `${theme.id}: varyant sayısı yetersiz`);
    }
  });
});

describe('hikâye üretimi', () => {
  it('her tema × yaş kombinasyonu 6 dolu paragraf üretir', () => {
    for (const theme of ALL_THEMES) {
      for (const age of ALL_AGES) {
        const result = generateStory({ heroName: 'Deniz', theme, ageGroup: age });
        assert.equal(result.paragraphs.length, 6, `${theme}/${age}: paragraf sayısı`);
        for (const p of result.paragraphs) {
          assert.ok(p.trim().length > 20, `${theme}/${age}: kısa/boş paragraf -> "${p}"`);
        }
        assert.ok(result.title.includes('Deniz'), `${theme}/${age}: başlıkta isim yok`);
        assert.equal(result.themeId, theme);
        assert.equal(result.ageLabel, AGE_LABELS[age]);
      }
    }
  });

  it('sonuç düz metin içerir, HTML etiketi barındırmaz', () => {
    for (const theme of ALL_THEMES) {
      const result = generateStory({ heroName: 'Elif', theme, ageGroup: '6-8' });
      const all = [result.title, ...result.paragraphs].join(' ');
      assert.ok(!/<[a-z/]/i.test(all), `${theme}: HTML etiketi bulundu`);
      assert.equal(result.provenance, DEMO_PROVENANCE);
    }
  });

  it('değişken yer tutucuları yerinde bırakılmaz', () => {
    for (const theme of ALL_THEMES) {
      const result = generateStory({ heroName: 'Can', theme, ageGroup: '9-12' });
      const all = [result.title, ...result.paragraphs].join(' ');
      assert.ok(!all.includes('{name}'), `${theme}: açılmamış {name} yer tutucusu var`);
    }
  });

  it('yaş grubu metni gerçekten değiştirir (uyarlama)', () => {
    for (const theme of ALL_THEMES) {
      const young = generateStory({ heroName: 'Ada', theme, ageGroup: '3-5' });
      const old = generateStory({ heroName: 'Ada', theme, ageGroup: '9-12' });
      assert.notDeepEqual(young.paragraphs, old.paragraphs, `${theme}: yaş uyarlaması çalışmıyor`);
      // Yaşça büyük grup daha uzun anlatır
      const youngLen = young.paragraphs.join(' ').length;
      const oldLen = old.paragraphs.join(' ').length;
      assert.ok(oldLen > youngLen, `${theme}: 9-12 yaş metni 3-5 yaşdan kısa`);
    }
  });

  it('varyant seçimi anlatımı değiştirir', () => {
    for (const theme of ALL_THEMES) {
      const v0 = generateStory({ heroName: 'Ada', theme, ageGroup: '6-8', variant: 0 });
      const v1 = generateStory({ heroName: 'Ada', theme, ageGroup: '6-8', variant: 1 });
      assert.notEqual(v0.title, v1.title, `${theme}: varyantlar aynı başlıkta`);
      assert.notDeepEqual(v0.paragraphs, v1.paragraphs, `${theme}: varyantlar aynı metinde`);
    }
  });

  it('varyant sayısı aşınca başa döner (mod)', () => {
    const a = generateStory({ heroName: 'Ada', theme: 'space', ageGroup: '6-8', variant: 0 });
    const b = generateStory({ heroName: 'Ada', theme: 'space', ageGroup: '6-8', variant: 2 });
    const c = generateStory({ heroName: 'Ada', theme: 'space', ageGroup: '6-8', variant: -4 });
    const d = generateStory({ heroName: 'Ada', theme: 'space', ageGroup: '6-8', variant: 1 });
    const e = generateStory({ heroName: 'Ada', theme: 'space', ageGroup: '6-8', variant: -3 });
    assert.deepEqual(a, b, 'variant 2, variant 0 ile aynı olmalı');
    assert.deepEqual(a, c, 'variant -4, variant 0 ile aynı olmalı');
    assert.deepEqual(d, e, 'variant -3, variant 1 ile aynı olmalı');
  });

  it('sayfalar tüm paragrafları eksiksiz kapsar', () => {
    const result = generateStory({ heroName: 'Ada', theme: 'forest', ageGroup: '6-8' });
    assert.ok(result.pages.length >= 2);
    const flat = result.pages.flatMap((p) => p.paragraphs);
    assert.deepEqual(flat, result.paragraphs);
    result.pages.forEach((page, i) => assert.equal(page.index, i + 1));
  });

  it('her iki üreteç de aynı sözleşmeyi karşılar', () => {
    const a = new LocalStoryGenerator().generate({ heroName: 'Ada', theme: 'ocean', ageGroup: '6-8' });
    const b = generateStory({ heroName: 'Ada', theme: 'ocean', ageGroup: '6-8' });
    assert.deepEqual(a, b);
  });
});

describe('karakter özelliği', () => {
  it('seçilen özellik anlatıya işler', () => {
    for (const theme of ALL_THEMES) {
      const first = themes[theme].traits[0].id;
      const withTrait = generateStory({ heroName: 'Ada', theme, ageGroup: '6-8', trait: first });
      const without = generateStory({ heroName: 'Ada', theme, ageGroup: '6-8' });
      assert.equal(withTrait.traitLabel, themes[theme].traits[0].label);
      assert.equal(without.traitLabel, null);
      assert.notDeepEqual(withTrait.paragraphs, without.paragraphs, `${theme}: özellik anlatımı etkilemiyor`);
    }
  });

  it('geçersiz özellik kimliği güvenli biçimde yok sayılır', () => {
    const result = generateStory({ heroName: 'Ada', theme: 'space', ageGroup: '6-8', trait: 'does-not-exist' });
    assert.equal(result.traitLabel, null);
    assert.equal(result.paragraphs.length, 6);
  });
});

describe('girdi güvenliği', () => {
  it('HTML denemesi düz metne çevrilir (XSS)', () => {
    const evil = '<img src=x onerror=alert(1)>';
    const result = generateStory({ heroName: evil, theme: 'space', ageGroup: '6-8' });
    const all = [result.title, ...result.paragraphs].join(' ');
    // Etiket sınırlayıcıları (`<`, `>`) yok edildiği için tarayıcı girdiyi
    // HTML olarak yorumlayamaz. Ayrıca metin `textContent` ile basıldığı
    // için olay işleyicileri hiçbir koşulda çalışmaz.
    assert.ok(!all.includes('<'), 'çıktıda `<` karakteri kalmamalı');
    assert.ok(!all.includes('>'), 'çıktıda `>` karakteri kalmamalı');
    // Girdi sessizce düşürülmemiş, düz metin olarak korunmuş olmalı
    assert.ok(all.includes('img src=x'), 'girdi düz metin olarak korunmalı');
  });

  it('sahte kapanış etiketleri ve script blokları nötrlenir', () => {
    const result = generateStory({ heroName: '</script><b>X</b>', theme: 'forest', ageGroup: '3-5' });
    const all = [result.title, ...result.paragraphs].join(' ');
    assert.ok(!all.includes('<'));
    assert.ok(!all.includes('>'));
  });

  it('boş isim yedek kahramana düşer', () => {
    for (const empty of ['', '   ', '\t\n']) {
      const result = generateStory({ heroName: empty, theme: 'ocean', ageGroup: '6-8' });
      assert.ok(result.title.includes('Kahraman'), `girdi "${empty}" için yedek kullanılmadı`);
      assert.ok(result.paragraphs.join(' ').includes('Kahraman'));
    }
  });

  it('geçersiz tema ve yaş yedeklere düşer', () => {
    const result = generateStory({
      heroName: 'Ada',
      theme: 'nope' as ThemeId,
      ageGroup: '99' as AgeGroupId,
    });
    assert.equal(result.themeId, 'space');
    assert.equal(result.ageLabel, AGE_LABELS['6-8']);
  });

  it('isim uzunluğu sınırı uygulanır', () => {
    const long = 'Ü'.repeat(120);
    assert.equal(sanitizeName(long).length, 30);
  });

  it('kontrol karakterleri ve yeni satırlar temizlenir', () => {
    const dirty = 'Ay\x00şe\nKaya\r\nDeniz';
    const clean = sanitizeName(dirty);
    assert.ok(!clean.includes('\n'));
    assert.ok(!clean.includes('\x00'));
    assert.equal(clean, 'Ayşe Kaya Deniz');
  });

  it('Türkçe karakterler korunur', () => {
    const name = 'Şule Güngör-Üğür';
    assert.equal(sanitizeName(`  ${name}  `), name);
    const result = generateStory({ heroName: name, theme: 'forest', ageGroup: '9-12' });
    assert.ok(result.paragraphs.join(' ').includes('Şule'), 'Ş karakteri kaybolmuş');
    assert.ok(result.paragraphs.join(' ').includes('Üğür'), 'Ü/ğ karakterleri kaybolmuş');
  });
});

describe('girdi doğrulama', () => {
  it('geçerli girdiyi kabul eder', () => {
    assert.deepEqual(validateInput({ heroName: 'Ada', theme: 'space', ageGroup: '6-8' }), { ok: true });
  });

  it('boş veya kısa ismi reddeder', () => {
    assert.equal(validateInput({ heroName: '', theme: 'space', ageGroup: '6-8' }).ok, false);
    assert.equal(validateInput({ heroName: '   ', theme: 'space', ageGroup: '6-8' }).ok, false);
    assert.equal(validateInput({ heroName: 'A', theme: 'space', ageGroup: '6-8' }).ok, false);
  });

  it('geçersiz tema/yaş reddeder', () => {
    assert.equal(validateInput({ heroName: 'Ada', theme: 'x', ageGroup: '6-8' }).ok, false);
    assert.equal(validateInput({ heroName: 'Ada', theme: 'space', ageGroup: 'x' }).ok, false);
  });

  it('tip koruyucu yardımcılar doğru çalışır', () => {
    assert.ok(isThemeId('ocean'));
    assert.ok(!isThemeId('mars'));
    assert.ok(isAgeGroupId('3-5'));
    assert.ok(!isAgeGroupId(35));
  });
});

describe('paginate', () => {
  it('taşan paragrafları doğru böler', () => {
    const items = ['a', 'b', 'c', 'd', 'e'];
    assert.deepEqual(paginate(items, 4), [
      { index: 1, paragraphs: ['a', 'b', 'c', 'd'] },
      { index: 2, paragraphs: ['e'] },
    ]);
  });

  it('boş liste boş sayfa döner', () => {
    assert.deepEqual(paginate([]), []);
  });
});
