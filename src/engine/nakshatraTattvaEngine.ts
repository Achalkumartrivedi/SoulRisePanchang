import { buildFullMultiLang } from '../i18n/astrologyRuleTranslations';
import { KundaliResult } from './kundaliEngine';

export type TattvaType = 'Agni' | 'Prithvi' | 'Vayu' | 'Jala' | 'Akasha';

export interface NakshatraTattvaDetail {
  nakshatraName: string;
  primaryTattva: TattvaType;
  pentaCyclicTattva: TattvaType;
  swarodayaTattva: TattvaType;
  elementSymbol: string;
  elementHindi: string;
  elementGujarati: string;
  description: Record<string, string>;
  psychologicalDisposition: Record<string, string>;
  friendlyElements: TattvaType[];
  neutralElements: TattvaType[];
  inimicalElements: TattvaType[];
  dynamicInteraction: Record<string, string>;
}

export interface NakshatraSynastryResult {
  nativeNakshatra: string;
  partnerNakshatra?: string;
  nativeTattva: TattvaType;
  partnerTattva?: TattvaType;
  compatibilityType: 'Mitra (Friendly)' | 'Sama (Neutral)' | 'Shatru (Inimical)' | 'Akasha (Universal Void)';
  synastryImpact: Record<string, string>;
  remedies: Record<string, string[]>;
}

/**
 * 27 Nakshatras Zonal Tattva Canonical Classification
 */
export const NAKSHATRA_PRIMARY_TATTVA_MAP: Record<string, { primary: TattvaType; penta: TattvaType; swarodaya: TattvaType }> = {
  'Ashwini': { primary: 'Prithvi', penta: 'Agni', swarodaya: 'Vayu' },
  'Bharani': { primary: 'Prithvi', penta: 'Prithvi', swarodaya: 'Agni' },
  'Krittika': { primary: 'Prithvi', penta: 'Vayu', swarodaya: 'Agni' },
  'Rohini': { primary: 'Prithvi', penta: 'Akasha', swarodaya: 'Prithvi' },
  'Mrigashira': { primary: 'Prithvi', penta: 'Jala', swarodaya: 'Vayu' },
  'Ardra': { primary: 'Jala', penta: 'Agni', swarodaya: 'Jala' },
  'Punarvasu': { primary: 'Jala', penta: 'Prithvi', swarodaya: 'Vayu' },
  'Pushya': { primary: 'Jala', penta: 'Vayu', swarodaya: 'Agni' },
  'Ashlesha': { primary: 'Jala', penta: 'Akasha', swarodaya: 'Jala' },
  'Magha': { primary: 'Jala', penta: 'Jala', swarodaya: 'Agni' },
  'Purva Phalguni': { primary: 'Jala', penta: 'Agni', swarodaya: 'Agni' },
  'Uttara Phalguni': { primary: 'Agni', penta: 'Prithvi', swarodaya: 'Vayu' },
  'Hasta': { primary: 'Agni', penta: 'Vayu', swarodaya: 'Vayu' },
  'Chitra': { primary: 'Agni', penta: 'Akasha', swarodaya: 'Vayu' },
  'Swati': { primary: 'Agni', penta: 'Jala', swarodaya: 'Agni' },
  'Vishakha': { primary: 'Agni', penta: 'Agni', swarodaya: 'Vayu' },
  'Anuradha': { primary: 'Agni', penta: 'Prithvi', swarodaya: 'Prithvi' },
  'Jyeshtha': { primary: 'Vayu', penta: 'Vayu', swarodaya: 'Prithvi' },
  'Mula': { primary: 'Vayu', penta: 'Akasha', swarodaya: 'Jala' },
  'Purva Ashadha': { primary: 'Vayu', penta: 'Jala', swarodaya: 'Jala' },
  'Uttara Ashadha': { primary: 'Vayu', penta: 'Agni', swarodaya: 'Prithvi' },
  'Shravana': { primary: 'Vayu', penta: 'Prithvi', swarodaya: 'Prithvi' },
  'Dhanishta': { primary: 'Akasha', penta: 'Vayu', swarodaya: 'Prithvi' },
  'Shatabhisha': { primary: 'Akasha', penta: 'Akasha', swarodaya: 'Jala' },
  'Purva Bhadrapada': { primary: 'Akasha', penta: 'Jala', swarodaya: 'Agni' },
  'Uttara Bhadrapada': { primary: 'Akasha', penta: 'Agni', swarodaya: 'Jala' },
  'Revati': { primary: 'Akasha', penta: 'Prithvi', swarodaya: 'Jala' }
};

export function normalizeNakshatraName(rawName: string): string {
  if (!rawName) return 'Ashwini';
  const clean = rawName.trim();

  // Exact match first
  if (NAKSHATRA_PRIMARY_TATTVA_MAP[clean]) return clean;

  // Case & punctuation insensitive match
  const lowerClean = clean.toLowerCase().replace(/[\s\-_]/g, '');
  for (const key of Object.keys(NAKSHATRA_PRIMARY_TATTVA_MAP)) {
    if (key.toLowerCase().replace(/[\s\-_]/g, '') === lowerClean) {
      return key;
    }
  }

  // Prefix matching for single word nakshatras
  const firstWord = clean.split(' ')[0].trim();
  if (NAKSHATRA_PRIMARY_TATTVA_MAP[firstWord]) return firstWord;

  return 'Ashwini';
}

/**
 * Tattva Descriptions & Interactions
 */
export const TATTVA_PROPERTIES: Record<TattvaType, {
  symbol: string;
  hiName: string;
  guName: string;
  friendly: TattvaType[];
  neutral: TattvaType[];
  inimical: TattvaType[];
  interactionText: Record<string, string>;
}> = {
  Agni: {
    symbol: '🔥 Fire (अग्नि तत्व)',
    hiName: 'अग्नि तत्व',
    guName: 'અગ્નિ તત્વ',
    friendly: ['Prithvi', 'Akasha'],
    neutral: ['Agni'],
    inimical: ['Jala', 'Vayu'],
    interactionText: buildFullMultiLang(
      'Earth stabilizes Fire, turning heat into productive wealth; Ether provides space for radiant expression. Water quenches initiative. Air causes erratic, scattered burns and volatile disputes.',
      'पृथ्वी तत्व अग्नि को स्थिरता प्रदान करता है और धन में बदलता है; आकाश तत्व अनंत विस्तार देता है। जल तत्व अग्नि की पहल को बुझा देता है। वायु तत्व अत्यधिक मानसिक उत्तेजना और तनाव पैदा करता है।',
      'પૃથ્વી તત્વ અગ્નિને સ્થિરતા આપે છે અને ધનમાં ફેરવે છે; આકાશ તત્વ અનંત વિસ્તાર આપે છે. જળ તત્વ અગ્નિની પહેલને હોલવી નાખે છે. વાયુ તત્વ અતિશય માનસિક તણાવ પેદા કરે છે.'
    )
  },
  Prithvi: {
    symbol: '⛰️ Earth (पृथ्वी तत्व)',
    hiName: 'पृथ्वी तत्व',
    guName: 'પૃથ્વી તત્વ',
    friendly: ['Jala', 'Agni'],
    neutral: ['Prithvi'],
    inimical: ['Vayu'],
    interactionText: buildFullMultiLang(
      'Water softens and fertilizes Earth into abundant prosperity; Fire bakes raw clay into lasting infrastructure. Air erodes soil, disrupts concentration, and destabilizes material security.',
      'जल तत्व पृथ्वी को उपजाऊ और समृद्ध बनाता है; अग्नि कच्ची मिट्टी को मजबूत नींव में बदलती है। वायु तत्व ध्यान भंग करता है और भौतिक सुरक्षा को अस्थिर करता है।',
      'જળ તત્વ પૃથ્વીને ફળદ્રુપ બનાવે છે; અગ્નિ કાચી માટીને મજબૂત પાયામાં ફેરવે છે. વાયુ તત્વ ધ્યાન ભંગ કરે છે અને સુરક્ષા અસ્થિર કરે છે.'
    )
  },
  Vayu: {
    symbol: '💨 Air (वायु तत्व)',
    hiName: 'वायु तत्व',
    guName: 'વાયુ તત્વ',
    friendly: ['Akasha', 'Vayu'],
    neutral: ['Prithvi', 'Jala'],
    inimical: ['Agni'],
    interactionText: buildFullMultiLang(
      'Ether gives Air complete freedom of mobility. Earth acts as an unyielding barrier. Water chills and weighs down Air. Fire becomes over-stimulated and chaotic.',
      'आकाश तत्व वायु को पूर्ण स्वतंत्रता देता है। पृथ्वी तत्व रुकावट पैदा करता है। जल तत्व हवा को भारी और नम बनाता है। अग्नि के साथ अत्यधिक बेचैनी पैदा होती है।',
      'આકાશ તત્વ વાયુને સંપૂર્ણ સ્વતંત્રતા આપે છે. પૃથ્વી તત્વ રુકાવટ પેદા કરે છે. જળ તત્વ હવાને ભારે બનાવે છે.'
    )
  },
  Jala: {
    symbol: '🌊 Water (जल तत्व)',
    hiName: 'जल तत्व',
    guName: 'જળ તત્વ',
    friendly: ['Prithvi', 'Akasha'],
    neutral: ['Jala'],
    inimical: ['Agni', 'Vayu'],
    interactionText: buildFullMultiLang(
      'Earth provides riverbanks and boundaries that contain Water’s flow into devotion and wealth. Fire boils emotional stability. Air whips Water into turbulent emotional storms.',
      'पृथ्वी तत्व जल के लिए किनारे और सीमाएं बनाता है, जिससे भावनाएं भक्ति और धन में बदलती हैं। अग्नि जल को उबालती है। वायु जल में भावात्मक तूफान लाती है।',
      'પૃથ્વી તત્વ જળ માટે કિનારા અને સરહદો બનાવે છે, જેથી ભાવનાઓ ભક્તિ અને ધનમાં ફેરવાય છે. અગ્નિ જળને ઉકાળે છે.'
    )
  },
  Akasha: {
    symbol: '🌌 Ether (आकाश तत्व)',
    hiName: 'आकाश तत्व',
    guName: 'આકાશ તત્વ',
    friendly: ['Agni', 'Prithvi', 'Vayu', 'Jala'],
    neutral: ['Akasha'],
    inimical: [],
    interactionText: buildFullMultiLang(
      'Ether acts as the universal womb and omnipresent stage (Brahma-sthana) for all manifest forms; it offers zero resistance and permits maximum spiritual realization.',
      'आकाश तत्व ब्रह्मांडीय मंच (ब्रह्म-स्थान) है जो सभी तत्वों को बिना किसी बाधा के अनंत स्थान और आध्यात्मिक मोक्ष प्रदान करता है।',
      'આકાશ તત્વ બ્રહ્માંડનો મંચ છે જે તમામ તત્વોને અનંત સ્થાન અને મોક્ષ પ્રદાન કરે છે.'
    )
  }
};

/**
 * Evaluates Janma Nakshatra Tattva and Optional Synastry
 */
export function evaluateNakshatraTattva(
  nakshatraName: string,
  partnerNakshatraName?: string
): {
  detail: NakshatraTattvaDetail;
  synastry?: NakshatraSynastryResult;
} {
  const normNak = normalizeNakshatraName(nakshatraName);
  const config = NAKSHATRA_PRIMARY_TATTVA_MAP[normNak] || { primary: 'Prithvi', penta: 'Agni', swarodaya: 'Vayu' };
  const tattvaData = TATTVA_PROPERTIES[config.primary];

  const detail: NakshatraTattvaDetail = {
    nakshatraName,
    primaryTattva: config.primary,
    pentaCyclicTattva: config.penta,
    swarodayaTattva: config.swarodaya,
    elementSymbol: tattvaData.symbol,
    elementHindi: tattvaData.hiName,
    elementGujarati: tattvaData.guName,
    description: buildFullMultiLang(
      `Your birth Nakshatra (${nakshatraName}) radiates the primary energy of ${config.primary} Tattva (${tattvaData.symbol}). In the Penta-Cyclic schema, its subtle inner frequency is ${config.penta}, and in Shiva Swarodaya breath science, it vibrates with ${config.swarodaya}.`,
      `आपका जन्म नक्षत्र (${nakshatraName}) मुख्य रूप से ${tattvaData.hiName} (${tattvaData.symbol}) की ऊर्जा से संचालित होता है। पञ्च-चक्र प्रणाली में इसका सूक्ष्म आंतरिक तत्व ${config.penta} है तथा शिव स्वरोदय स्वर शास्त्र में यह ${config.swarodaya} तत्व से जुड़ा है।`,
      `તમારો જન્મ નક્ષત્ર (${nakshatraName}) મુખ્ય રીતે ${tattvaData.guName} (${tattvaData.symbol}) ની ઉર્જાથી સંચાલિત થાય છે.`
    ),
    psychologicalDisposition: buildFullMultiLang(
      `Consciousness densifies along the gradient of ${config.primary} Tattva, shaping your instinctual reactions, metabolic focus, and core emotional resilience.`,
      `आपकी चेतना का प्राथमिक स्वभाव ${tattvaData.hiName} के नियमों से संचालित होता है, जो आपकी निर्णय क्षमता, पाचन शक्ति और मानसिक स्थिरता को आकार देता है।`,
      `તમારી ચેતનાનો પ્રાથમિક સ્વભાવ ${tattvaData.guName} ના નિયમોથી સંચાલિત થાય છે.`
    ),
    friendlyElements: tattvaData.friendly,
    neutralElements: tattvaData.neutral,
    inimicalElements: tattvaData.inimical,
    dynamicInteraction: tattvaData.interactionText
  };

  let synastry: NakshatraSynastryResult | undefined;

  if (partnerNakshatraName) {
    const normPartner = normalizeNakshatraName(partnerNakshatraName);
    const partnerConfig = NAKSHATRA_PRIMARY_TATTVA_MAP[normPartner] || { primary: 'Jala', penta: 'Agni', swarodaya: 'Vayu' };
    const pTattva = partnerConfig.primary;

    let compType: NakshatraSynastryResult['compatibilityType'] = 'Sama (Neutral)';
    if (config.primary === 'Akasha' || pTattva === 'Akasha') {
      compType = 'Akasha (Universal Void)';
    } else if (tattvaData.friendly.includes(pTattva)) {
      compType = 'Mitra (Friendly)';
    } else if (tattvaData.inimical.includes(pTattva)) {
      compType = 'Shatru (Inimical)';
    }

    synastry = {
      nativeNakshatra: nakshatraName,
      partnerNakshatra: partnerNakshatraName,
      nativeTattva: config.primary,
      partnerTattva: pTattva,
      compatibilityType: compType,
      synastryImpact: buildFullMultiLang(
        `Dynamic pairing of ${config.primary} Tattva (${nakshatraName}) with ${pTattva} Tattva (${partnerNakshatraName}): ${compType}. ${TATTVA_PROPERTIES[config.primary].interactionText['en']}`,
        `${config.primary} तत्व (${nakshatraName}) और ${pTattva} तत्व (${partnerNakshatraName}) का संबंध: ${compType}। ${TATTVA_PROPERTIES[config.primary].interactionText['hi']}`,
        `${config.primary} તત્વ અને ${pTattva} તત્વનો સંબંધ: ${compType}. ${TATTVA_PROPERTIES[config.primary].interactionText['gu']}`
      ),
      remedies: {
        en: [
          '🧘 Perform Prana-Yoga and balance breath (Swarodaya) during daily interaction.',
          '🪔 Keep a Ghee lamp lit during joint decision-making to balance elemental friction.'
        ],
        hi: [
          '🧘 प्रतिदिन प्राणायाम करें और सूर्य-चंद्र स्वर का संतुलन बनाएं।',
          '🪔 महत्वपूर्ण निर्णयों के समय घी का दीपक जलाएं।'
        ],
        gu: [
          '🧘 દરરોજ પ્રાણાયામ કરવા.',
          '🪔 મહત્વના નિર્ણયો સમયે ઘીનો દીવો પ્રગટાવવો.'
        ]
      }
    };
  }

  return { detail, synastry };
}
