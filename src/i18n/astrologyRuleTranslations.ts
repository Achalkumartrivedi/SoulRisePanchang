import { LanguageCode } from '../types/language';

export interface MultiLangText {
  en: string;
  hi: string;
  gu: string;
  hinglish: string;
  mr: string;
  bn: string;
  ta: string;
  te: string;
  ru: string;
  fr: string;
  es: string;
  he: string;
  id: string;
  th: string;
}

/**
 * Creates a complete 14-language object given the primary translations
 * and fallback generators for full coverage across all 14 languages.
 */
export function buildFullMultiLang(
  en: string,
  hi: string,
  gu: string,
  overrides: Partial<Record<LanguageCode, string>> = {}
): Record<string, string> {
  return {
    en,
    hi,
    gu,
    hinglish: overrides.hinglish || hi,
    mr: overrides.mr || hi,
    bn: overrides.bn || en,
    ta: overrides.ta || en,
    te: overrides.te || en,
    ru: overrides.ru || en,
    fr: overrides.fr || en,
    es: overrides.es || en,
    he: overrides.he || en,
    id: overrides.id || en,
    th: overrides.th || en,
    ...overrides
  };
}

/**
 * Detailed 14-Language Translations for Saturn 12 House Rules
 */
export const SATURN_12_HOUSE_TRANSLATIONS: Record<number, {
  title: Record<string, string>;
  pastLifeKarma: Record<string, string>;
  lifeChallenges: Record<string, string>;
  physicalRemedy: Record<string, string>;
}> = {
  1: {
    title: buildFullMultiLang(
      'Saturn in 1st House: Lunar Astro Karma & Physical Remedy',
      'प्रथम भाव में शनि: पूर्व जन्म कर्म एवं शारीरिक उपाय',
      'પ્રથમ ભાવમાં શનિ: પૂર્વ જન્મ કર્મ અને શારીરિક ઉપાય',
      {
        hinglish: 'First House me Shani: Past Life Karma & Physical Upay',
        mr: 'प्रथम भावात शनी: पूर्व जन्म कर्म आणि शारीरिक उपाय',
        bn: 'প্রথম ভাবে শনি: পূর্ব জন্মের কর্ম ও প্রতিকার',
        ta: '1ம் வீட்டில் சனி: பூர்வ ஜென்ம கர்மா மற்றும் பரிகாரம்',
        te: '1వ ఇంట్లో శని: పూర్వ జన్మ కర్మ మరియు పరిహారం',
        ru: 'Сатурн в 1-м доме: Карма прошлой жизни и физические средства',
        fr: 'Saturne en 1ère Maison: Karma de la vie passée et remèdes',
        es: 'Saturno en Casa 1: Karma de vida pasada y remedios',
        he: 'שבתאי בבית 1: קארמה מגלגול קודם ותיקונים',
        id: 'Saturnus di Rumah 1: Karma Kehidupan Lampau & Remediasi',
        th: 'ดาวเสาร์ในภพที่ 1: กรรมจากชาติปางก่อนและการแก้ไข'
      }
    ),
    pastLifeKarma: buildFullMultiLang(
      'Self-centeredness, dodging personal accountability, or imposing heavy burdens on others.',
      'स्वार्थी होना, व्यक्तिगत जवाबदेही से बचना, या दूसरों पर भारी बोझ डालना।',
      'સ્વાર્થી બનવું, પોતાની જવાબદારીઓથી ભાગવું અથવા અન્ય લોકો પર બોજ નાખવો.',
      {
        hinglish: 'Selfish hona, apni responsibilities se bhagna, ya dusron par bojh dalna.',
        mr: 'स्वार्थी असणे, वैयक्तिक जबाबदारी टाळणे किंवा इतरांवर ओझे टाकणे.',
        bn: 'স্বার্থপরতা, ব্যক্তিগত জবাবদিহিতা এড়ানো বা অন্যের উপর বোঝা চাপানো।',
        ta: 'சுயநலம், தனிப்பட்ட பொறுப்பைத் தவிர்த்தல் அல்லது பிறர் மீது சுமையைச் சுமத்துதல்.',
        te: 'స్వార్థపూరితంగా ఉండటం, బాధ్యతల నుండి తప్పుకోవడం లేదా ఇతరులపై భారం వేయడం.',
        ru: 'Эгоцентризм, уклонение от личной ответственности или возложение тяжелого бремени на других.',
        fr: 'Égocentrisme, esquive de la responsabilité personnelle ou imposition de lourdes charges aux autres.',
        es: 'Egocentrismo, esquivar la responsabilidad personal o imponer cargas pesadas a los demás.',
        he: 'אנוכיות, התחמקות מאחריות אישית או הטלת עומס כבד על אחרים.',
        id: 'Egosentris, menghindari tanggung jawab pribadi, atau membebani orang lain.',
        th: 'การเห็นแก่ตัว การหลีกเลี่ยงความรับผิดชอบส่วนบุคคล หรือการโยนภาระให้ผู้อื่น'
      }
    ),
    lifeChallenges: buildFullMultiLang(
      'Heavy domestic responsibilities from an early age; slow physical vitality; high personal scrutiny.',
      'कम उम्र से ही भारी घरेलू जिम्मेदारियां; धीमी शारीरिक ऊर्जा; अत्यधिक आत्म-परीक्षण।',
      'નાની ઉંમરથી જ ભારે પારિવારિક જવાબદારીઓ અને ધીમી શારીરિક ઉર્જા.',
      {
        hinglish: 'Chhoti umar se hi ghar ki zimmedariyan; kam physical energy; jyada self-criticism.',
        mr: 'लहान वयातच घरातील मोठ्या जबाबदाऱ्या; मंद शारीरिक ऊर्जा.',
        bn: 'কম বয়স থেকেই পারিবারিক দায়িত্ব; ধীর শারীরিক জীবনীশক্তি।',
        ta: 'சிறு வயதிலிருந்தே கனமான குடும்பப் பொறுப்புகள்; மெதுவான உடல் ஆற்றல்.',
        te: 'చిన్నవయస్సు నుండే బరువైన కుటుంబ బాధ్యతలు; తక్కువ శారీరక శక్తి.',
        ru: 'Тяжелые домашние обязанности с раннего возраста; замедленная физическая активность.',
        fr: 'Lourdes responsabilités domestiques dès le plus jeune âge; vitalité physique lente.',
        es: 'Responsabilidades domésticas pesadas desde temprana edad; vitalidad física lenta.',
        he: 'אחריות משפחתית כבדה מגיל צעיר; חיוניות פיזית אטית.',
        id: 'Tanggung jawab rumah tangga yang berat sejak usia muda; vitalitas fisik lambat.',
        th: 'ภาระหน้าที่ในบ้านที่หนักหน่วงตั้งแต่วัยเยาว์ ความมีชีวิตชีวาทางกายภาพช้า'
      }
    ),
    physicalRemedy: buildFullMultiLang(
      'Avoid boisterous birthday celebrations with loud drums; apply wet mud tilak or paste from Banyan tree roots; keep a dark, quiet room at home.',
      'जन्मदिन पर तेज ढोल-नगाड़ों से बचें; बरगद के पेड़ की जड़ की गीली मिट्टी का तिलक लगाएं; घर में एक शांत, अंधेरा कमरा रखें।',
      'જન્મદિવસે મોટા ઢોલ-નગારાથી બચવું; વડના વૃક્ષની જડની ભીની માટીનો તિલક કરવો; ઘરમાં એક શાંત ઓરડો રાખવો.',
      {
        hinglish: 'Birthday par loud dhol-dhamake se bachen; Banyan tree ki jadd ki geeli mitti ka tilak lagayein.',
        mr: 'वाढदिवसाला मोठ्या आवाजातील ढोल टाळा; वडाच्या झाडाच्या मुळाची भिजलेली माती लावा.',
        bn: 'জন্মদিনে উচ্চ শব্দযুক্ত ঢাক-ঢোল এড়িয়ে চলুন; বটগাছের শিকড়ের ভেজা মাটির তিলক দিন।',
        ta: 'பிறந்தநாளில் உரத்த மேள தாளங்களைத் தவிர்க்கவும்; ஆலமர வேர் மண்ணைத் திலகமாக இடவும்.',
        te: 'పుట్టినరోజున పెద్ద శబ్దాలు చేసే మేళతాళాలను నివారించండి; మర్రిచెట్టు వేరు మట్టి తిలకం ధరించండి.',
        ru: 'Избегайте шумных празднований дня рождения с громкими барабанами; наносите тилак из влажной грязи корней баньяна.',
        fr: 'Évitez les fêtes d’anniversaire bruyantes; appliquez un tilak de boue humide provenant des racines du banyan.',
        es: 'Evite las celebraciones ruidosas de cumpleaños; aplique un tilak de barro húmedo de raíces de banyan.',
        he: 'הימנע מחגיגות יום הולדת רועשות; מרח טילאק מבוץ רטוב של שורשי עץ בולבול.',
        id: 'Hindari perayaan ulang tahun yang bising; gunakan tilak lumpur basah dari akar pohon beringin.',
        th: 'งดการฉลองวันเกิดที่เอิกเกริก ทาติลักจากโคลนชุ่มน้ำของรากต้นไทร'
      }
    )
  }
};
