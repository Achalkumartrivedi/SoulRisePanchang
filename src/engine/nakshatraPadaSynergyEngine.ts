import { buildFullMultiLang } from '../i18n/astrologyRuleTranslations';

export interface NakshatraPadaSynergyResult {
  nakshatraName: string;
  pada: number;
  rashiLordName: { en: string; hi: string; gu: string };
  nakshatraLordName: { en: string; hi: string; gu: string };
  navamshaName: { en: string; hi: string; gu: string };
  navamshaLordName: { en: string; hi: string; gu: string };
  synergyTitle: Record<string, string>;
  layer1Physical: Record<string, string>;
  layer2Mental: Record<string, string>;
  layer3Destiny: Record<string, string>;
  trineSynergySummary: Record<string, string>;
  careerContext: Record<string, string>;
  mindsetContext: Record<string, string>;
  lifeProtectionContext: Record<string, string>;
}

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const NAKSHATRA_LORDS = [
  { en: 'Ketu', hi: 'केतु', gu: 'કેતુ' },
  { en: 'Shukra (Venus)', hi: 'शुक्र', gu: 'શુક્ર' },
  { en: 'Surya (Sun)', hi: 'सूर्य', gu: 'સૂર્ય' },
  { en: 'Chandra (Moon)', hi: 'चंद्र', gu: 'ચંદ્ર' },
  { en: 'Mangala (Mars)', hi: 'मंगल', gu: 'મંગળ' },
  { en: 'Rahu', hi: 'राहु', gu: 'રાહુ' },
  { en: 'Brihaspati (Jupiter)', hi: 'गुरु', gu: 'ગુરુ' },
  { en: 'Shani (Saturn)', hi: 'शनि', gu: 'શનિ' },
  { en: 'Budha (Mercury)', hi: 'बुध', gu: 'બુધ' }
];

const RASHIS = [
  { en: 'Mesha (Aries)', hi: 'मेष', gu: 'મેષ', lordEn: 'Mangala (Mars)', lordHi: 'मंगल', lordGu: 'મંગળ' },
  { en: 'Vrishabha (Taurus)', hi: 'वृषभ', gu: 'વૃષભ', lordEn: 'Shukra (Venus)', lordHi: 'शुक्र', lordGu: 'શુક્ર' },
  { en: 'Mithuna (Gemini)', hi: 'मिथुन', gu: 'મિથુન', lordEn: 'Budha (Mercury)', lordHi: 'बुध', lordGu: 'બુધ' },
  { en: 'Karka (Cancer)', hi: 'कर्क', gu: 'કર્ક', lordEn: 'Chandra (Moon)', lordHi: 'चंद्र', lordGu: 'ચંદ્ર' },
  { en: 'Simha (Leo)', hi: 'सिंह', gu: 'સિંહ', lordEn: 'Surya (Sun)', lordHi: 'सूर्य', lordGu: 'સૂર્ય' },
  { en: 'Kanya (Virgo)', hi: 'कन्या', gu: 'કન્યા', lordEn: 'Budha (Mercury)', lordHi: 'बुध', lordGu: 'બુધ' },
  { en: 'Tula (Libra)', hi: 'तुला', gu: 'તુલા', lordEn: 'Shukra (Venus)', lordHi: 'शुक्र', lordGu: 'શુક્ર' },
  { en: 'Vrischika (Scorpio)', hi: 'वृश्चिक', gu: 'વૃશ્ચિક', lordEn: 'Mangala (Mars)', lordHi: 'मंगल', lordGu: 'મંગળ' },
  { en: 'Dhanu (Sagittarius)', hi: 'धनु', gu: 'ધનુ', lordEn: 'Brihaspati (Jupiter)', lordHi: 'गुरु', lordGu: 'ગુરુ' },
  { en: 'Makara (Capricorn)', hi: 'मकर', gu: 'મકર', lordEn: 'Shani (Saturn)', lordHi: 'शनि', lordGu: 'શનિ' },
  { en: 'Kumbha (Aquarius)', hi: 'कुंभ', gu: 'કુંભ', lordEn: 'Shani (Saturn)', lordHi: 'शनि', lordGu: 'શનિ' },
  { en: 'Meena (Pisces)', hi: 'मीन', gu: 'મીન', lordEn: 'Brihaspati (Jupiter)', lordHi: 'गुरु', lordGu: 'ગુરુ' }
];

/**
 * Calculates the exact 3-Tier Nakshatra Pada & Navamsha Synergy
 * for any of the 108 Padas across 27 Nakshatras.
 */
export function evaluateNakshatraPadaSynergy(
  bornNakshatra: string,
  pada: number = 1,
  rashiName: string = 'Mesha (Aries)'
): NakshatraPadaSynergyResult {
  // Normalize Nakshatra index
  const cleanNak = bornNakshatra.trim();
  let nakIdx = NAKSHATRAS.findIndex(n => cleanNak.toLowerCase().includes(n.toLowerCase()));
  if (nakIdx < 0) nakIdx = 2; // Default to Krittika if missing

  const validPada = (pada >= 1 && pada <= 4) ? pada : 1;

  // Nakshatra Lord (Index = nakIdx % 9)
  const nakLordObj = NAKSHATRA_LORDS[nakIdx % 9];

  // Navamsha Rashi Index (Classical Formula: (nakIdx * 4 + pada - 1) % 12)
  const navamshaIdx = (nakIdx * 4 + validPada - 1) % 12;
  const navamshaRashiObj = RASHIS[navamshaIdx];

  // Rashi Lord (Deduce from rashiName or default from Navamsha)
  let rashiIdx = 0;
  const lowerRashi = rashiName.toLowerCase();
  const matchedRashiIdx = RASHIS.findIndex(r => lowerRashi.includes(r.en.toLowerCase()) || lowerRashi.includes(r.hi.toLowerCase()));
  if (matchedRashiIdx >= 0) rashiIdx = matchedRashiIdx;

  const rashiObj = RASHIS[rashiIdx];

  const synergyTitle = buildFullMultiLang(
    `🌟 3-Tier Nakshatra Pada Synergy: ${cleanNak} (Pada ${validPada})`,
    `🌟 3-स्तरीय नक्षत्र पद व नवांश त्रि-देव राजयोग: ${cleanNak} (चरण ${validPada})`,
    `🌟 3-સ્તરીય નક્ષત્ર પદ અને નવાંશ સાર્વભૌમ યોગ: ${cleanNak} (ચરણ ${validPada})`
  );

  const layer1Physical = buildFullMultiLang(
    `Layer 1 - Rashi Lord (${rashiObj.lordEn}): Governs physical body, environment, and external actions.`,
    `प्रथम परत - राशि स्वामी (${rashiObj.lordHi}): स्थूल शरीर, बाहरी वातावरण और शारीरिक कर्मों का नियंत्रण।`,
    `પ્રથમ પડ - રાશિ સ્વામી (${rashiObj.lordGu}): શારીરિક શરીર અને બાહ્ય કાર્યોનું નિયંત્રણ.`
  );

  const layer2Mental = buildFullMultiLang(
    `Layer 2 - Nakshatra Lord (${nakLordObj.en}): Governs mind, subconscious drive, and Vimshottari Mahadasha at birth.`,
    `द्वितीय परत - नक्षत्र स्वामी (${nakLordObj.hi}): सूक्ष्म शरीर, मन, अंतर्मन की प्रेरणा और जन्मकालीन विंशोत्तरी महादशा।`,
    `દ્વિતીય પડ - નક્ષત્ર સ્વામી (${nakLordObj.gu}): મન અને જન્મકાલીન મહાદશાનું નિયંત્રણ.`
  );

  const layer3Destiny = buildFullMultiLang(
    `Layer 3 - Navamsha Lord (${navamshaRashiObj.lordEn} in ${navamshaRashiObj.en} Navamsha): Governs soul destiny, inner wisdom, and higher purpose.`,
    `तृतीय परत - नवांश स्वामी (${navamshaRashiObj.lordHi} - ${navamshaRashiObj.hi} नवांश): कारण शरीर, अंतरात्मा का उद्देश्य, गुप्त ज्ञान व परम भाग्य।`,
    `તૃતીય પડ - નવાંશ સ્વામી (${navamshaRashiObj.lordGu} - ${navamshaRashiObj.gu} નવાંશ): અંતરાત્માનો ઉદ્દેશ્ય અને પરમ ભાગ્ય.`
  );

  const trineSynergySummary = buildFullMultiLang(
    `👑 Cosmic Synergy Matrix: Your chart synthesizes ${rashiObj.lordEn} (Physical Action) + ${nakLordObj.en} (Mind & Dasha) + ${navamshaRashiObj.lordEn} (Soul Destiny). This 3-way alignment creates a unique royal harmony directing your life journey.`,
    `👑 त्रि-देव राजयोग समतुल्य संयोजन: आपकी कुण्डली में ${rashiObj.lordHi} (शारीरिक कर्म) + ${nakLordObj.hi} (मन व महादशा) + ${navamshaRashiObj.lordHi} (आत्मा व भाग्य) का एक शक्तिशाली संयोजन कार्य कर रहा है।`,
    `👑 ત્રિ-દેવ યોગ સંયોજન: તમારી કુંડળીમાં ${rashiObj.lordGu} (શારીરિક કર્મ) + ${nakLordObj.gu} (મન) + ${navamshaRashiObj.lordGu} (આત્મા) નું શક્તિશાળી સંયોજન કાર્ય કરે છે.`
  );

  const careerContext = buildFullMultiLang(
    `💼 Executive & Career Context: You possess the physical drive of ${rashiObj.lordEn}, the leadership focus of ${nakLordObj.en}, and the strategic wisdom of ${navamshaRashiObj.lordEn}. You thrive as an advisor, guide, or independent leader rather than a passive employee.`,
    `💼 करियर व प्रशासनिक संदर्भ: आपके पास ${rashiObj.lordHi} का साहस, ${nakLordObj.hi} का स्वाभिमान और ${navamshaRashiObj.lordHi} की रणनीतिक बुद्धि है। आप केवल आदेश मानने वाले नहीं, बल्कि नेतृत्व व सलाह देने में सर्वश्रेष्ठ सिद्ध होते हैं।`,
    `💼 કારકિર્દી અને વહીવટી સંતર્ભ: તમારી પાસે ${rashiObj.lordGu} નું સાહસ અને ${navamshaRashiObj.lordGu} ની બુદ્ધિ છે. તમે નેતૃત્વ અને સલાહ આપવામાં શ્રેષ્ઠ સાબિત થાઓ છો.`
  );

  const mindsetContext = buildFullMultiLang(
    `🧠 Psychological & Mindset Context: ${rashiObj.lordEn}'s raw energy is refined by ${nakLordObj.en}'s dignity and guided by ${navamshaRashiObj.lordEn}'s moral law, transforming impulsive action into principled statecraft.`,
    `🧠 मानसिक व वैचारिक संदर्भ: ${rashiObj.lordHi} की ऊर्जा ${nakLordObj.hi} के आत्म-सम्मान से परिष्कृत होती है और ${navamshaRashiObj.lordHi} के धर्म व विवेक द्वारा निर्देशित होती है।`,
    `🧠 માનસિક અને વૈચારિક સંદર્ભ: ${rashiObj.lordGu} ની ઊર્જા અને ${navamshaRashiObj.lordGu} ના વિવેક દ્વારા માર્ગદર્શિત થાય છે.`
  );

  const lifeProtectionContext = buildFullMultiLang(
    `🛡️ Divine Protection Context: The harmony between ${rashiObj.lordEn}, ${nakLordObj.en}, and ${navamshaRashiObj.lordEn} acts as a cosmic shield, resolving severe life crises through courage, honor, and spiritual wisdom.`,
    `🛡️ जीवन सुरक्षा व दैवीय रक्षा संदर्भ: ${rashiObj.lordHi}, ${nakLordObj.hi} और ${navamshaRashiObj.lordHi} के बीच का सामंजस्य एक सुरक्षा कवच के रूप में कार्य करता है, जो हर संकट को विवेक व साहस से दूर करता है।`,
    `🛡️ જીવન સુરક્ષા સંદર્ભ: ${rashiObj.lordGu}, ${nakLordObj.gu} અને ${navamshaRashiObj.lordGu} નું સંયોજન એક રક્ષા કવચ તરીકે કાર્ય કરે છે.`
  );

  return {
    nakshatraName: cleanNak,
    pada: validPada,
    rashiLordName: { en: rashiObj.lordEn, hi: rashiObj.lordHi, gu: rashiObj.lordGu },
    nakshatraLordName: { en: nakLordObj.en, hi: nakLordObj.hi, gu: nakLordObj.gu },
    navamshaName: { en: navamshaRashiObj.en, hi: navamshaRashiObj.hi, gu: navamshaRashiObj.gu },
    navamshaLordName: { en: navamshaRashiObj.lordEn, hi: navamshaRashiObj.lordHi, gu: navamshaRashiObj.lordGu },
    synergyTitle,
    layer1Physical,
    layer2Mental,
    layer3Destiny,
    trineSynergySummary,
    careerContext,
    mindsetContext,
    lifeProtectionContext
  };
}
