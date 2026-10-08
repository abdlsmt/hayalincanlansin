import type { AgeGroupId, ThemeDefinition, Trait } from '../storyTypes.ts';
import { ageText } from './shared.ts';

export const spaceTraits: Trait[] = [
  { id: 'brave', label: 'Cesur', lower: 'cesur' },
  { id: 'curious', label: 'Meraklı', lower: 'meraklı' },
  { id: 'patient', label: 'Sabırlı', lower: 'sabırlı' },
  { id: 'cheerful', label: 'Neşeli', lower: 'neşeli' },
];

/** Tepki paragrafı: seçilen karakter özelliği olay örgüsüne işler. */
function reaction(age: AgeGroupId, trait: Trait | null): string {
  if (!trait) {
    return ageText(
      age,
      {
        '3-5': `{name} uyandı ve penceresine koştu.`,
        '6-8': `{name} bir anda uyandı ve penceresine koştu.`,
        '9-12': `{name} derin bir uykudaydı; gecenin ortasında gözlerini açtı ve penceresine koştu.`,
      },
      `{name} uyandı ve penceresine koştu.`,
    );
  }

  const byId: Record<string, Partial<Record<AgeGroupId, string>>> = {
    brave: {
      '3-5': `{name}, cesur bir çocuktu. O hiç korkmadı ve hemen yatağından kalktı.`,
      '6-8': `{name}, cesur bir çocuktu; bu yüzden hiç korkmadan yatağından kalktı.`,
      '9-12': `{name}, cesur bir çocuktu ve bu, onu hep bir adım öne çıkarmıştı. Bu gece de öyle oldu: hiç korkmadan yatağından kalktı.`,
    },
    curious: {
      '3-5': `{name}, meraklı bir çocuktu. O hemen neler olduğunu anlamak istedi.`,
      '6-8': `{name}, meraklı bir çocuktu; bu yüzden olan biteni hemen anlamak için uyandı.`,
      '9-12': `{name}, meraklı bir çocuktu ve bu, onu hep bir adım öne çıkarmıştı. Bu gece de öyle oldu: olan biteni hemen anlamak için uyandı.`,
    },
    patient: {
      '3-5': `{name}, sabırlı bir çocuktu. O acele etmedi, önce derin bir nefes aldı.`,
      '6-8': `{name}, sabırlı bir çocuktu; bu yüzden önce derin bir nefes aldı, sonra hazırlandı.`,
      '9-12': `{name}, sabırlı bir çocuktu ve bu, onu hep bir adım öne çıkarmıştı. Bu gece de öyle oldu: önce derin bir nefes aldı, sonra hazırlandı.`,
    },
    cheerful: {
      '3-5': `{name}, neşeli bir çocuktu. O bile bu durumu bir macera gibi gördü.`,
      '6-8': `{name}, neşeli bir çocuktu; bu yüzden bu durumu bile bir macera gibi gördü.`,
      '9-12': `{name}, neşeli bir çocuktu ve bu, onu hep bir adım öne çıkarmıştı. Bu gece de öyle oldu: bu durumu bile bir macera gibi gördü.`,
    },
  };

  const fallback = `{name}, ${trait.lower} bir çocuktu; bu yüzden o da ${trait.lower} bir yol seçti.`;
  const variants = byId[trait.id] ?? {};
  const fallbackText = variants['6-8'] ?? fallback;
  return ageText(age, variants, fallbackText);
}

function climax(age: AgeGroupId, trait: Trait | null): string {
  const steps: Record<string, string> = {
    brave: 'karanlıktan hiç korkmadı ve fenerin en yüksek basamağına tırmandı',
    curious: 'fenerin küçük mekanizmasını dikkatle inceledi; sıkışmış halkayı bulup düğmeye bastı',
    patient: 'acele etmedi, parçaları tek tek sabırla yerine koydu',
    cheerful: 'kocaman bir şarkı söyledi ve neşesiyle feneri uyandırdı',
  };
  const step = trait ? steps[trait.id] ?? 'fenerin başına geçti' : 'fenerin başına geçti';

  return ageText(
    age,
    {
      '3-5': `{name} fenerin başına geçti ve ışığı yerine koydu. Işık anında parladı.`,
      '6-8': `{name} ${step}. Kısa süre sonra ışık yeniden parladı.`,
      '9-12': `{name} ${step}. Işık, karanlığı delip gökyüzüne doğru yükseldi.`,
    },
    `{name} ${step}. Kısa süre sonra ışık yeniden parladı.`,
  );
}

export const spaceTheme: ThemeDefinition = {
  id: 'space',
  label: 'Uzay Macerası',
  short: 'Sönen bir yıldızın ışığını geri getirmek için yıldızların arasına yolculuk.',
  traits: spaceTraits,
  variantCount: 2,
  build({ name, age, trait, variant }) {
    // 1) Giriş
    const opening = variant % 2 === 0
      ? ageText(
          age,
          {
            '3-5': `${name} gece penceresinden dışarı baktı. Yıldızlar küçük lambalar gibi parlıyordu. Sonra en parlak yıldız birden söndü.`,
            '6-8': `${name} gecenin bir yarısında penceresinin önünde oturuyordu. Yıldızlar gökyüzünde küçük lambalar gibi parlıyordu. Tam o sırada en parlak yıldız titredi ve birden söndü.`,
            '9-12': `${name} gecenin derin bir saatinde penceresinin önünde duruyordu. Gökyüzü, her zamankinden daha canlı yıldızlarla kaplıydı. Tam o anda en parlak yıldız titredi, rengi soldu ve bir anda karardı.`,
          },
          `${name} gecenin bir yarısında penceresinin önünde oturuyordu. En parlak yıldız birden söndü.`,
        )
      : ageText(
          age,
          {
            '3-5': `${name} gökyüzüne baktı. Birden bütün yıldızlar bir anlığına söndü. Sonra yalnızca bir tanesi yeniden parladı.`,
            '6-8': `${name} gökyüzüne baktığında tuhaf bir şey fark etti: yıldızların çoğu bir anlığına söndü. Yeniden yandıklarında hepsi aynı yerde değildi.`,
            '9-12': `${name} gökyüzüne her baktığında aynı manzarayla karşılaşıyordu: yıldızlar bir an için hep birlikte soluyor, sonra eski yerlerine dönemiyordu. Bu, hiçbir yerde yazılmamış bir işaretti.`,
          },
          `${name} gökyüzüne baktı. Yıldızlar bir an için hep birlikte söndü.`,
        );

    // 2) Tepki
    const reactionP = reaction(age, trait);

    // 3) Çağrı
    const call = variant % 2 === 0
      ? ageText(
          age,
          {
            '3-5': `Aniden pencerenin önünde minik bir ışık belirdi. Adı Pırıl'dı ve o bir yıldız kıvılcımıydı. "Yıldız söndü," dedi. "Işığı Kayıp Gezegen'deki fenerde kaldı. Bana yardım eder misin?"`,
            '6-8': `Pencerenin önünde yumuşak bir ışık belirdi. Karşısında Pırıl duruyordu: küçük bir yıldız kıvılcımı. "Yıldızın ışığını kaybettik," dedi. "Işık Kayıp Gezegen'deki fenerde kaldı. Bana yardım eder misin, {name}?"`,
            '9-12': `Odayı ansızın yumuşak bir ışık doldurdu. Karşısında Pırıl duruyordu; küçük ama parlak bir yıldız kıvılcımı. "Yıldızın ışığı taşındı ama fener bozuldu," dedi. "Kayıp Gezegen'e gitmeden gökyüzü eskisi gibi parlamayacak. Yanıma gelir misin, {name}?"`,
          },
          `Pencerenin önünde minik bir ışık belirdi. Adı Pırıl'dı. "Yıldızın ışığı Kayıp Gezegen'deki fenerde kaldı. Bana yardım eder misin, {name}?"`,
        )
      : ageText(
          age,
          {
            '3-5': `Odaya bir ışık düştü. Bu, küçük bir yıldız kıvılcımıydı: Pırıl. "Kayıp Gezegen'e gidelim mi?" diye sordu. "Orada ışığı saklı."`,
            '6-8': `Odanın ortasında bir ışık topu belirdi. Pırıl adında küçük bir yıldız kıvılcımıydı. "Işığı Kayıp Gezegen'de saklıyoruz ama fener bozuk," dedi. "Gelir misin, {name}?"`,
            '9-12': `Odanın ortasında ışığa dönüştü. Pırıl adında bir yıldız kıvılcımıydı; yıldızların fenerini taşıyan küçük bir elçi. "Işığı Kayıp Gezegen'de saklıyorduk," dedi, "ama fener bozuldu ve gökyüzü kararıyor. Beraber gidelim mi, {name}?"`,
          },
          `Odaya bir ışık düştü: küçük bir yıldız kıvılcımı olan Pırıl. "Işığı Kayıp Gezegen'deki fenerde saklıyoruz. Gelir misin, {name}?"`,
        );

    // 4) Yolculuk
    const journey = ageText(
      age,
      {
        '3-5': `Önce küçük taşların arasından geçtiler. Sonra kocaman bir gezegenin etrafından dolaştılar. Sonunda Kayıp Gezegen'i gördüler: her yer karanlıktı.`,
        '6-8': `Önce meteor yağmurunun içinden geçtiler; taşlar sağdan soldan uçuyordu. Sonra devasa bir gezegenin etrafından dolaşıp Kayıp Gezegen'e ulaştılar. Ama ortalık simsiyahtı.`,
        '9-12': `Yolculuk kolay olmadı. Önce yoğun meteor yağmurundan geçtiler; taşlar yanlarından akıp gidiyordu. Sonra devasa bir gezegenin kütle çekimine kapılmamak için dikkatle dolaştılar. Nihayet Kayıp Gezegen'e vardılar: fener harap olmuş, ortalık simsiyahtı.`,
      },
      `Önce meteor yağmurunun içinden geçtiler, sonra Kayıp Gezegen'e ulaştılar. Her yer karanlıktı.`,
    );

    // 5) Doruk
    const climaxP = climax(age, trait);

    // 6) Kapanış
    const closing = variant % 2 === 0
      ? ageText(
          age,
          {
            '3-5': `Yıldız yeniden gökyüzüne döndü. {name} yatağına uzandı. Yıldız hâlâ parlıyordu.`,
            '6-8': `Yıldız gökyüzüne geri döndü ve {name} yatağına döndü. Penceresinden onu yeniden görebiliyordu. O geceden sonra hangi yıldızın ne anlama geldiğini kimse bilmiyordu; ama {name} biliyordu.`,
            '9-12': `Yıldız, gökyüzüne geri döndü ve {name} sessizce yatağına döndü. Penceresinden hâlâ onu görebiliyordu. Belki kimse bunu fark etmemişti ama {name} biliyordu: gökyüzünde adı bilinmeyen bir yıldız, onun sayesinde yeniden parlıyordu.`,
          },
          `Yıldız gökyüzüne geri döndü ve {name} yatağına döndü. O geceden sonra hangi yıldızın ne anlama geldiğini kimse bilmiyordu; ama {name} biliyordu.`,
        )
      : ageText(
          age,
          {
            '3-5': `Gökyüzü yeniden aydınlandı. {name} gülümsedi. Yıldızlar hep oradaydı.`,
            '6-8': `Gökyüzü yeniden aydınlandı ve Kayıp Gezegen bile küçük bir ışık noktası gibi görünmeye başladı. {name} yatağına dönerken düşündü: belki de kaybolmak, yalnızca doğru yolu bulmanın bir yoluydu.`,
            '9-12': `Gökyüzü yeniden aydınlandı; Kayıp Gezegen bile uzaktan minik ama kararlı bir ışık noktası gibi görünüyordu. {name} yatağına dönerken düşündü: belki de kaybolmak, yalnızca doğru yolu bulmanın başka bir adıydı.`,
          },
          `Gökyüzü yeniden aydınlandı. {name} gülümsedi: kaybolmak, bazen doğru yolu bulmanın bir yoludur.`,
        );

    return [opening, reactionP, call, journey, climaxP, closing].map((p) => p.replace(/\{name\}/g, name));
  },
};
