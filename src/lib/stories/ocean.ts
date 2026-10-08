import type { AgeGroupId, ThemeDefinition, Trait } from '../storyTypes.ts';
import { ageText, traitAge } from './shared.ts';

export const oceanTraits: Trait[] = [
  { id: 'patient', label: 'Sabırlı', lower: 'sabırlı' },
  { id: 'brave', label: 'Cesur', lower: 'cesur' },
  { id: 'curious', label: 'Meraklı', lower: 'meraklı' },
  { id: 'helpful', label: 'Yardımsever', lower: 'yardımsever' },
];

/** Yalnızca eylem içerir; isim ve sıfat motor tarafından eklenir. */
const reactionMap: Record<string, Partial<Record<AgeGroupId, string>>> = {
  patient: {
    '3-5': `acele etmedi, önce etrafına baktı.`,
    '6-8': `acele etmedi; önce etrafına dikkatle baktı.`,
    '9-12': `acele etmedi; önce durumu anlamayı ve etrafına dikkatle bakmayı seçti.`,
  },
  brave: {
    '3-5': `hiç korkmadan suya yaklaştı.`,
    '6-8': `hiç korkmadan suyun kenarına kadar yürüdü.`,
    '9-12': `hiç korkmadan, kabaran dalgaların arasından suyun kenarına kadar yürüdü.`,
  },
  curious: {
    '3-5': `sesin nereden geldiğini merak etti.`,
    '6-8': `sesin nereden geldiğini bulmak için hemen etrafına bakındı.`,
    '9-12': `sesin kaynağını bulmak için hemen etrafına bakındı ve dikkatle dinledi.`,
  },
  helpful: {
    '3-5': `hemen yardım etmek istedi.`,
    '6-8': `yardıma ihtiyacı olanın yanında olmak isterdi; hiç düşünmeden harekete geçti.`,
    '9-12': `kimin yardıma ihtiyacı varsa koşmak isterdi; hiç düşünmeden harekete geçti.`,
  },
};

const reactionNeutral: Partial<Record<AgeGroupId, string>> = {
  '3-5': `sesi takip etti.`,
  '6-8': `sesin geldiği yöne doğru ilerledi.`,
  '9-12': `sesin geldiği yöne doğru, dikkatle ilerledi.`,
};

const climaxMap: Record<string, Partial<Record<AgeGroupId, string>>> = {
  patient: {
    '3-5': `İncileri tek tek, acele etmeden topladı.`,
    '6-8': `İncileri tek tek, acele etmeden topladı; hiçbiri yere düşmedi.`,
    '9-12': `İncileri tek tek, acele etmeden topladı ve hiçbirini kırmadan sırayla yerine yerleştirdi.`,
  },
  brave: {
    '3-5': `Karanlıkta hiç korkmadan ileri yüzdü.`,
    '6-8': `Karanlıkta hiç korkmadan ileri yüzdü ve en uzaktaki inciyi getirdi.`,
    '9-12': `Karanlığın en dibine, ışığın hiç ulaşmadığı yere kadar ileri yüzdü ve en uzaktaki inciyi getirdi.`,
  },
  curious: {
    '3-5': `İncilerin saklandığı yeri buldu.`,
    '6-8': `Kayaların arasındaki gizli yarığı fark etti; inciler tam oradaydı.`,
    '9-12': `Kayaların arasındaki gizli yarığı fark etti ve akıntının izini sürerek incilerin saklandığı yeri buldu.`,
  },
  helpful: {
    '3-5': `Mercan ile birlikte taşıdı.`,
    '6-8': `Mercan'ın taşıyamadığı incileri de kendi aldı; birlikte taşıdılar.`,
    '9-12': `Mercan'ın taşıyamadığı incilerin tamamını kendi üstlendi; yükün büyük kısmını sırtlanarak fenerin önüne kadar taşıdılar.`,
  },
};

const climaxFallback: Partial<Record<AgeGroupId, string>> = {
  '3-5': `İncileri bulup fenerin önüne taşıdı.`,
  '6-8': `İncileri bulup tek tek fenerin önüne taşıdı.`,
  '9-12': `İncileri bulup tek tek fenerin önüne taşıdı ve hepsini yerine yerleştirdi.`,
};

function reaction(age: AgeGroupId, trait: Trait | null): string {
  const action = trait ? traitAge(age, trait, reactionMap, reactionNeutral) : traitAge(age, null, {}, reactionNeutral);

  if (!trait) {
    return ageText(
      age,
      {
        '3-5': `{name} ${action}`,
        '6-8': `{name} ${action}`,
        '9-12': `{name} ${action}`,
      },
      `{name} ${action}`,
    );
  }

  return ageText(
    age,
    {
      '3-5': `{name}, ${trait.lower} bir çocuktu. O ${action}`,
      '6-8': `{name}, ${trait.lower} bir çocuktu; bu yüzden ${action}`,
      '9-12': `{name}, ${trait.lower} bir çocuktu ve bu, onu hep bir adım öne çıkarmıştı. Bu kez de aynıydı: ${action}`,
    },
    `{name}, ${trait.lower} bir çocuktu; bu yüzden ${action}`,
  );
}

export const oceanTheme: ThemeDefinition = {
  id: 'ocean',
  label: 'Deniz Altı Dünyası',
  short: 'Sönen bir deniz fenerinin ışığını derinlerde arayan, su altı macerası.',
  traits: oceanTraits,
  variantCount: 2,
  build({ name, age, trait, variant }) {
    const opening =
      variant % 2 === 0
        ? ageText(
            age,
            {
              '3-5': `{name} sahilde kumdan kale yapıyordu. Birden dalganın içinden bir ses geldi: "Yardım!" {name} suya baktı.`,
              '6-8': `{name} sahilde kumdan kale yapıyordu. Birden dalganın içinden gelen bir ses duydu: "Yardım et!" Suyun içine baktı ama kimseyi göremedi.`,
              '9-12': `{name} sahilde, kumdan kaleye son kulesini yerleştirirken dalganın içinden gelen bir ses yakaladı dikkatini: "Yardım et!" Suyun içine baktı; kimse yoktu ama ses bir kez daha tekrarladı.`,
            },
            `{name} sahilde kumdan kale yapıyordu. Dalganın içinden "Yardım et!" sesini duydu.`,
          )
        : ageText(
            age,
            {
              '3-5': `Deniz çok sakindi. Sonra bütün dalgalar durdu. Deniz feneri ışığını kaybetti.`,
              '6-8': `Deniz akşamüstü çok sakindi; sonra bütün dalgalar bir anda durdu. Uzaktaki deniz feneri de ışığını kaybetmişti.`,
              '9-12': `Deniz akşamüstü hiç olmadığı kadar sakindi; sonra bütün dalgalar bir anda durdu. Uzaktaki deniz feneri de ışığını kaybetmiş, gece açılan gemiler için yol görünmez olmuştu.`,
            },
            `Deniz çok sakindi, sonra bütün dalgalar durdu ve uzaktaki deniz feneri ışığını kaybetti.`,
          );

    const reactionP = reaction(age, trait);

    const call =
      variant % 2 === 0
        ? ageText(
            age,
            {
              '3-5': `Su yüzünden bir yunus çıktı. Adı Mercan. "Deniz feneri söndü," dedi. "Bana yardım eder misin?"`,
              '6-8': `Su yüzünden parlak bir yunus sıçradı: Mercan. "Deniz feneri söndü," dedi. "Işık olmadan gemiler kaybolur. Bana yardım eder misin, {name}?"`,
              '9-12': `Su yüzünden parlak bir yunus sıçradı: Mercan, deniz fenerinin bekçisiydi. "Deniz feneri söndü," dedi. "Işık olmadan gece açılan gemiler kaybolur. Beraber bakabilir miyiz, {name}?"`,
            },
            `Su yüzünden bir yunus sıçradı: Mercan. "Deniz feneri söndü. Bana yardım eder misin, {name}?"`,
          )
        : ageText(
            age,
            {
              '3-5': `Bir yunus kıyıya geldi: Mercan. "İncilerimiz kayboldu," dedi. "Onları bulur musun?"`,
              '6-8': `Bir yunus kıyıya yüzerek geldi: Mercan. "Işığı taşıyan incilerimiz kayboldu," dedi. "Onları bulur musun, {name}?"`,
              '9-12': `Bir yunus kıyıya yüzerek geldi: Mercan, fenerin ışığını taşıyan incilerin koruyucusuydu. "İncilerimiz kayboldu," dedi, "ve ışıkları olmadan fener karanlıkta kalır. Onları bulur musun, {name}?"`,
            },
            `Bir yunus kıyıya geldi: Mercan. "Işığı taşıyan incilerimiz kayboldu. Onları bulur musun, {name}?"`,
          );

    const journey = ageText(
      age,
      {
        '3-5': `Önce hızlı akıntının yanından geçtiler. Sonra karanlık bir mağaraya girdiler. Sonunda ışıl ışıl bir oda buldular.`,
        '6-8': `Önce güçlü akıntıya karşı yüzdüler; Mercan önden yol açtı. Sonra karanlık bir mağaraya daldılar. Mağaranın sonunda ışıl ışıl bir oda vardı.`,
        '9-12': `Önce güçlü akıntıya karşı yüzmek zorunda kaldılar; Mercan önden yol açtı, {name} ise ritmini ona uydurdu. Sonra girişi neredeyse görünmeyen karanlık bir mağaraya daldılar. Mağaranın derinliğinde ışıl ışıl bir oda onları karşıladı.`,
      },
      `Güçlü akıntıya karşı yüzdüler, sonra karanlık bir mağaraya daldılar ve ışıl ışıl bir oda buldular.`,
    );

    const climaxP = traitAge(age, trait, climaxMap, climaxFallback);

    const closing =
      variant % 2 === 0
        ? ageText(
            age,
            {
              '3-5': `Fener yeniden yandı. Mercan sevinçle zıpladı. {name} sahile döndü.`,
              '6-8': `Fener yeniden yandı ve deniz ışıkla doldu. Mercan sevinçle zıpladı; {name} sahile dönerken ıslak ayak izleri bıraktı.`,
              '9-12': `Fener yeniden yandı ve karanlık deniz bir anda ışıkla doldu. Mercan sevinçle su yüzüne sıçradı; {name} sahile dönerken arkasında ıslak ayak izleri bıraktı.`,
            },
            `Fener yeniden yandı, deniz ışıkla doldu ve {name} sahile döndü.`,
          )
        : ageText(
            age,
            {
              '3-5': `İnciler yerine kondu. Deniz yeniden parladı.`,
              '6-8': `İnciler yerine kondu ve deniz yeniden parladı. {name} sahilde otururken dalgaların kendi adına ritim tuttuğunu düşündü.`,
              '9-12': `İnciler yerine kondu, deniz yeniden parladı ve fenerin ışığı ufka kadar ulaştı. {name} sahilde otururken dalgaların kendi adına ritim tuttuğunu düşündü.`,
            },
            `İnciler yerine kondu ve deniz yeniden parladı.`,
          );

    return [opening, reactionP, call, journey, climaxP, closing].map((p) => p.replace(/\{name\}/g, name));
  },
};
