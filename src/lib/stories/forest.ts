import type { AgeGroupId, ThemeDefinition, Trait } from '../storyTypes.ts';
import { ageText, traitAge } from './shared.ts';

export const forestTraits: Trait[] = [
  { id: 'curious', label: 'Meraklı', lower: 'meraklı' },
  { id: 'gentle', label: 'Nazik', lower: 'nazik' },
  { id: 'brave', label: 'Cesur', lower: 'cesur' },
  { id: 'cheerful', label: 'Neşeli', lower: 'neşeli' },
];

/** Kural: değerler yalnızca eylemdir; isim ve sıfat motor tarafından eklenir. */
const reactionMap: Record<string, Partial<Record<AgeGroupId, string>>> = {
  curious: {
    '3-5': `hemen ne olduğunu görmek için koştu.`,
    '6-8': `sesin geldiği yere doğru hemen yürüdü.`,
    '9-12': `sesin geldiği yöne, sık ağaçların arasına daldı.`,
  },
  gentle: {
    '3-5': `koşmadan, sessizce yürüdü.`,
    '6-8': `ağaçların arasından sessizce ilerledi.`,
    '9-12': `ağaçların arasından sesini çıkarmadan, adım adım ilerledi.`,
  },
  brave: {
    '3-5': `hiç korkmadan ormana daldı.`,
    '6-8': `hiç tereddüt etmeden ormana daldı.`,
    '9-12': `hiç tereddüt etmeden, karanlığın içine doğru ilerledi.`,
  },
  cheerful: {
    '3-5': `bu durumu bile bir macera gibi gördü.`,
    '6-8': `endişelenmek yerine gülümseyerek yola çıktı.`,
    '9-12': `endişelenmek yerine gülümseyerek, kafasını çevirip yola çıktı.`,
  },
};

const reactionNeutral: Partial<Record<AgeGroupId, string>> = {
  '3-5': `hemen sesin geldiği yöne koştu.`,
  '6-8': `sesin geldiği yere doğru yürüdü.`,
  '9-12': `sesin geldiği yöne, sık ağaçların arasına daldı.`,
};

const climaxMap: Record<string, Partial<Record<AgeGroupId, string>>> = {
  curious: {
    '3-5': `Kovuğun arkasında eski bir kitap buldu. Sayfaları açtı ve ışığı uyandıran sözcükleri okudu.`,
    '6-8': `Kovuğun arkasında gizlenmiş eski bir kitap buldu; içinde ışığın nasıl uyandırıldığı yazıyordu ve hemen uyguladı.`,
    '9-12': `Kovuğun arkasında gizlenmiş, deri ciltli eski bir kitap buldu. Işığın nasıl uyandırıldığını anlatan bölümü dikkatle okudu ve yazılanı harfiyen uyguladı.`,
  },
  gentle: {
    '3-5': `Sararmış yapraklara tek tek dokundu. Dokunduğu her yaprak yeniden yeşerdi.`,
    '6-8': `Sararmış yapraklara tek tek dokundu, kırılanları nazikçe yerine koydu. Yaptığı iyilik ışığı geri getirdi.`,
    '9-12': `Sararmış yapraklara tek tek dokundu, kırılanları nazikçe yerine yerleştirdi. Kimseyi ürkmeyen bu sessiz iyilik, ağacın köklerinden ışığı geri çağırdı.`,
  },
  brave: {
    '3-5': `Karanlık kovuğa indi. Işık tohumunu bulup geri çıkardı.`,
    '6-8': `Karanlık kovuğa inmekten korkmadı; orada saklanan ışık tohumunu bulup geri çıkardı.`,
    '9-12': `Karanlık kovuğa inmekten hiç korkmadı; dipsiz görünen kuyunun dibinde saklanan ışık tohumunu bulup geri çıkardı.`,
  },
  cheerful: {
    '3-5': `Ağacın altında şarkı söyledi. Şarkısı bitince ışık parladı.`,
    '6-8': `Ağacın altında neşeyle şarkı söyledi. Şarkısının sonunda ışık yeniden uyandı.`,
    '9-12': `Ağacın altında, kendi kendine neşeyle bir şarkı söyledi. Şarkının sonunda ormanın kalbindeki ışık yeniden uyandı.`,
  },
};

const climaxFallback: Partial<Record<AgeGroupId, string>> = {
  '3-5': `Işık tohumunu kovuktan çıkardı ve yerine bıraktı.`,
  '6-8': `Işık tohumunu kovuktan çıkardı ve ağacın köküne bıraktı.`,
  '9-12': `Işık tohumunu kovuktan çıkardı ve ağacın köküne, olması gereken yere bıraktı.`,
};

function reaction(age: AgeGroupId, trait: Trait | null): string {
  if (!trait) {
    const action = traitAge(age, null, {}, reactionNeutral);
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

  const action = traitAge(age, trait, reactionMap, reactionNeutral);
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

export const forestTheme: ThemeDefinition = {
  id: 'forest',
  label: 'Büyülü Orman',
  short: 'Sararan yaprakların arasında, ormanın kalbine ulaşmak için çıkarılan bir yolculuk.',
  traits: forestTraits,
  variantCount: 2,
  build({ name, age, trait, variant }) {
    const opening =
      variant % 2 === 0
        ? ageText(
            age,
            {
              '3-5': `{name} bahçede oynarken bir ses duydu: "Ağaçlar solar!" Hemen ormana koştu.`,
              '6-8': `{name} bahçede oynarken uzaktan gelen bir fısıltı yakaladı: "Ağaçlar solar!" Koşarak ormanın kenarına vardı.`,
              '9-12': `{name} bahçede oynarken dikkatini uzaktan gelen ince bir fısıltı çekti: "Ağaçlar solar!" Fısıltının geldiği yöne doğru, sık ağaçların arasına daldı.`,
            },
            `{name} bahçede oynarken "Ağaçlar solar!" fısıltısını duydu ve ormana koştu.`,
          )
        : ageText(
            age,
            {
              '3-5': `{name} ormanın kenarına gitti. Kuşlar şarkı söylemiyordu. Her yer sessizdi.`,
              '6-8': `{name} ormanın kenarına vardığında tuhaf bir sessizlikle karşılaştı; kuşlar şarkı söylemiyordu, rüzgâr yaprakları fısıldatmıyordu.`,
              '9-12': `{name} ormanın kenarına vardığında bir şeylerin ters gittiğini hemen anladı: kuşlar susmuş, rüzgâr yaprakları fısıldatmıyordu; orman kendi sesini kaybetmişti.`,
            },
            `{name} ormanın kenarına gitti ve tuhaf bir sessizlikle karşılaştı.`,
          );

    const reactionP = reaction(age, trait);

    const call =
      variant % 2 === 0
        ? ageText(
            age,
            {
              '3-5': `Bir dalın üstünde bir sincap belirdi. Adı Fındık. "Yaşlı Meşe'nin ışığı söndü," dedi. "Bana yardım eder misin?"`,
              '6-8': `Bir dalın üstünde küçük bir sincap belirdi: Fındık. "Yaşlı Meşe'nin ışığı söndü," dedi. "Işık olmadan orman solar. Bana yardım eder misin, {name}?"`,
              '9-12': `Bir dalın üstünde küçük ama kıpır kıpır bir sincap belirdi: Fındık. "Yaşlı Meşe'nin ışığı söndü," dedi. "O ışık giderse orman da gider. Beraber bakabilir miyiz, {name}?"`,
            },
            `Bir dalın üstünde bir sincap belirdi: Fındık. "Yaşlı Meşe'nin ışığı söndü. Bana yardım eder misin, {name}?"`,
          )
        : ageText(
            age,
            {
              '3-5': `Çalılardan bir sincap çıktı: Fındık. Elinde küçük bir harita vardı. "Işığı kaybettik," dedi.`,
              '6-8': `Çalılıkların arasından bir sincap fırladı: Fındık. Elinde yıpranmış bir harita vardı. "Işığı kaybettik ve haritayı da," dedi. "Gelir misin, {name}?"`,
              '9-12': `Çalılıkların arasından bir sincap fırladı: Fındık. Elinde kenarları yıpranmış, elle çizilmiş bir harita vardı. "Işığı kaybettik," dedi, "üstelik haritayı da. Yaşlı Meşe'nin ışığı olmadan orman dayanamaz. Gelir misin, {name}?"`,
            },
            `Çalılardan bir sincap çıktı: Fındık. Elinde küçük bir harita vardı. "Işığı kaybettik. Gelir misin, {name}?"`,
          );

    const journey = ageText(
      age,
      {
        '3-5': `Dikenlerin önünden geçtiler. Küçük bir dereyi taşlarla atlattılar. Sonunda Yaşlı Meşe'yi gördü; yaprakları sararıyordu.`,
        '6-8': `Önce dikenli çalıların arasından geçtiler; Fındık yolu açtı. Sonra sisli bir dereyi taş taş atlayarak aştılar. Yaşlı Meşe'ye vardıklarında yaprakları sararmıştı bile.`,
        '9-12': `Önce dikenli çalıların arasından geçmek zorunda kaldılar; Fındık önden yolu açtı. Sonra sisli bir dereyi, yalnızca ıslanmadan geçilebilecek taşları bularak aştılar. Yaşlı Meşe'ye vardıklarında yaprakları büyük ölçüde sararmıştı.`,
      },
      `Dikenli çalıların arasından geçtiler, sisli bir dereyi taşlarla aştılar ve Yaşlı Meşe'ye vardılar.`,
    );

    const climaxP = traitAge(age, trait, climaxMap, climaxFallback);

    const closing =
      variant % 2 === 0
        ? ageText(
            age,
            {
              '3-5': `Yapraklar yeniden yeşerdi. Kuşlar şarkıya başladı.`,
              '6-8': `Yapraklar yeniden yeşerdi ve kuşlar şarkıya başladı. {name} ormandan çıkarken arkasından gelen ince bir fısıltıyı duydu: teşekkür ederiz.`,
              '9-12': `Yapraklar birer birer yeniden yeşerdi ve kuşlar şarkıya başladı. {name} ormandan çıkarken arkasından gelen ince bir fısıltıyı duydu: "Teşekkür ederiz." Artık orman kendi sesine sahipti.`,
            },
            `Yapraklar yeniden yeşerdi ve kuşlar şarkıya başladı.`,
          )
        : ageText(
            age,
            {
              '3-5': `Orman yeniden renklendi. {name} eve döndü. Cebinde bir yaprak vardı.`,
              '6-8': `Orman kendi sesini yeniden buldu. {name} akşam eve dönerken cebinde tek bir sararmış yaprak taşıyordu — hatıra olarak.`,
              '9-12': `Orman kendi sesini yeniden buldu ve Yaşlı Meşe'nin ışığı akşamüstü gibi parlak yandı. {name} eve dönerken cebinde tek bir sararmış yaprak taşıyordu; kimseye göstermedi ama hep hatırlayacaktı.`,
            },
            `Orman kendi sesini yeniden buldu ve {name} eve döndü; cebinde hatıra olarak bir yaprak vardı.`,
          );

    return [opening, reactionP, call, journey, climaxP, closing].map((p) => p.replace(/\{name\}/g, name));
  },
};
