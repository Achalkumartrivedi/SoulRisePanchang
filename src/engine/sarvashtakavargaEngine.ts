/**
 * Classical Architecture of Sarvashtakavarga in Vedic Horoscopy
 * Based on Brihat Parashara Hora Shastra (BPHS, Chapters 66-72)
 *
 * Mathematically Invariant:
 * Sun (48) + Moon (49) + Mars (39) + Mercury (54) + Jupiter (56) + Venus (52) + Saturn (39) = 337 Bindus
 * Mean per house = 337 / 12 ≈ 28.08 Bindus
 */

import { KundaliResult } from './kundaliEngine';

export type SAVBandType = 'SHRESTHA' | 'MADHYAMA' | 'ALPA' | 'ATI_KASHTA';

export interface SAVBandConfig {
  type: SAVBandType;
  labelEn: string;
  labelHi: string;
  rangeStr: string;
  color: string;
  bgColor: string;
  borderColor: string;
  lightTextColor: string;
}

export const SAV_BANDS: Record<SAVBandType, SAVBandConfig> = {
  SHRESTHA: {
    type: 'SHRESTHA',
    labelEn: 'Shrestha (Fortified)',
    labelHi: 'श्रेष्ठ (अत्यंत शुभ)',
    rangeStr: '≥30 Points',
    color: '#2E7D32',       // Forest Green
    bgColor: '#E8F5E9',     // Light Green Tint
    borderColor: '#81C784',
    lightTextColor: '#1B5E20'
  },
  MADHYAMA: {
    type: 'MADHYAMA',
    labelEn: 'Madhyama (Moderate)',
    labelHi: 'मध्यम (संतुलित)',
    rangeStr: '25–29 Points',
    color: '#E65100',       // Amber / Deep Orange
    bgColor: '#FFF8E1',     // Light Amber Tint
    borderColor: '#FFD54F',
    lightTextColor: '#B78103'
  },
  ALPA: {
    type: 'ALPA',
    labelEn: 'Alpa / Kashta (Deficient)',
    labelHi: 'अल्प / कष्ट (मेहनत क्षेत्र)',
    rangeStr: '20–24 Points',
    color: '#D84315',       // Deep Coral Orange
    bgColor: '#FBE9E7',     // Light Coral Tint
    borderColor: '#FFAB91',
    lightTextColor: '#BF360C'
  },
  ATI_KASHTA: {
    type: 'ATI_KASHTA',
    labelEn: 'Ati-Kashta (Severe)',
    labelHi: 'अति-कष्ट (संरचनात्मक कमी)',
    rangeStr: '<20 Points',
    color: '#C62828',       // Crimson Red
    bgColor: '#FFEBEE',     // Light Red Tint
    borderColor: '#EF9A9A',
    lightTextColor: '#B71C1C'
  }
};

export function getSAVBand(points: number): SAVBandConfig {
  if (points >= 30) return SAV_BANDS.SHRESTHA;
  if (points >= 25) return SAV_BANDS.MADHYAMA;
  if (points >= 20) return SAV_BANDS.ALPA;
  return SAV_BANDS.ATI_KASHTA;
}

export interface HouseSAVDiagnostic {
  houseNumber: number;
  sanskritName: string;
  hindiName: string;
  rashiIndex: number; // 0 = Aries, 11 = Pisces
  rashiName: string;
  rashiHindi: string;
  points: number;
  band: SAVBandConfig;
  karakatva: {
    en: string;
    hi: string;
  };
  thresholds: {
    mean: number;
    optimum: string;
    minThreshold: number;
  };
  diagnostic: {
    titleEn: string;
    titleHi: string;
    textEn: string;
    textHi: string;
  };
  isProsperous: boolean;
  isEffortHeavy: boolean;
}

export interface SarvashtakavargaResult {
  totalPoints: number; // Invariant 337
  averagePerHouse: number; // 28.08
  houses: HouseSAVDiagnostic[]; // Houses 1 to 12
  signs: { rashiIndex: number; rashiName: string; rashiHindi: string; points: number; band: SAVBandConfig }[];
  bav: Record<string, number[]>; // Planet name -> 12 signs scores
  executiveSummary: {
    prosperousHouses: number[];
    balancedHouses: number[];
    effortHeavyHouses: number[];
    financialTriad: {
      karmaHouse10Points: number;
      labhaHouse11Points: number;
      vyayaHouse12Points: number;
      dhanaHouse2Points: number;
      laborMonetizationBalance: 'EXCELLENT' | 'UNRECIPROCATED_EFFORT';
      capitalRetentionBalance: 'STRONG_RETENTION' | 'CAPITAL_LEAKAGE';
      titleEn: string;
      titleHi: string;
      explanationEn: string;
      explanationHi: string;
    };
    dusthanaTriad: {
      house6Points: number;
      house8Points: number;
      house12Points: number;
      totalSum: number;
      isProtected: boolean; // sum < 76
      titleEn: string;
      titleHi: string;
      explanationEn: string;
      explanationHi: string;
    };
  };
}

// Classical Parashari BPHS Bhinnashtakavarga (BAV) Rules
// Houses counted from each reference entity (1-indexed)
const PARASHARI_BAV_RULES: Record<string, Record<string, number[]>> = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11],
    Moon: [3, 6, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [3, 5, 6, 9, 10, 11, 12],
    Jupiter: [5, 6, 9, 11],
    Venus: [6, 7, 12],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [3, 4, 6, 10, 11, 12]
  },
  Moon: {
    Sun: [3, 6, 7, 8, 10, 11],
    Moon: [1, 3, 6, 7, 10, 11],
    Mars: [2, 3, 5, 6, 9, 10, 11],
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    Jupiter: [1, 4, 7, 8, 10, 11, 12],
    Venus: [3, 4, 5, 7, 9, 10, 11],
    Saturn: [3, 5, 6, 11],
    Lagna: [3, 6, 10, 11]
  },
  Mars: {
    Sun: [3, 5, 6, 10, 11],
    Moon: [3, 6, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [3, 5, 6, 11],
    Jupiter: [6, 10, 11, 12],
    Venus: [6, 8, 11, 12],
    Saturn: [1, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 3, 6, 10, 11]
  },
  Mercury: {
    Sun: [5, 6, 9, 11, 12],
    Moon: [2, 4, 6, 8, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    Jupiter: [6, 8, 11, 12],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 2, 4, 6, 8, 10, 11]
  },
  Jupiter: {
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    Moon: [2, 5, 7, 9, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    Venus: [2, 5, 6, 9, 10, 11],
    Saturn: [3, 5, 6, 12],
    Lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11]
  },
  Venus: {
    Sun: [8, 11, 12],
    Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Mars: [3, 4, 6, 9, 11, 12],
    Mercury: [3, 5, 6, 9, 11],
    Jupiter: [5, 8, 9, 10, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    Saturn: [3, 4, 5, 8, 9, 10, 11],
    Lagna: [1, 2, 3, 4, 5, 8, 9, 11]
  },
  Saturn: {
    Sun: [1, 2, 4, 7, 8, 10, 11],
    Moon: [3, 6, 11],
    Mars: [3, 5, 6, 10, 11, 12],
    Mercury: [6, 8, 9, 10, 11, 12],
    Jupiter: [5, 6, 11, 12],
    Venus: [6, 11, 12],
    Saturn: [3, 5, 6, 11],
    Lagna: [1, 3, 4, 6, 10, 11]
  }
};

const RASHI_NAMES_EN = [
  'Aries (Mesha)', 'Taurus (Vrishabha)', 'Gemini (Mithuna)', 'Cancer (Karka)',
  'Leo (Simha)', 'Virgo (Kanya)', 'Libra (Tula)', 'Scorpio (Vrishchika)',
  'Sagittarius (Dhanu)', 'Capricorn (Makara)', 'Aquarius (Kumbha)', 'Pisces (Meena)'
];

const RASHI_NAMES_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क',
  'सिंह', 'कन्या', 'तुला', 'वृश्चिक',
  'धनु', 'मकर', 'कुंभ', 'मीन'
];

interface ClassicalHouseMeta {
  sanskritName: string;
  hindiName: string;
  karakatvaEn: string;
  karakatvaHi: string;
  optimumStr: string;
  minThreshold: number;
  sub25TitleEn: string;
  sub25TitleHi: string;
  sub25TextEn: string;
  sub25TextHi: string;
  fortifiedTitleEn: string;
  fortifiedTitleHi: string;
  fortifiedTextEn: string;
  fortifiedTextHi: string;
  moderateTitleEn: string;
  moderateTitleHi: string;
  moderateTextEn: string;
  moderateTextHi: string;
}

const CLASSICAL_HOUSE_SPEC: Record<number, ClassicalHouseMeta> = {
  1: {
    sanskritName: 'Tanu Bhava',
    hindiName: 'तनु भाव (प्रथम भाव)',
    karakatvaEn: 'Physical body, vital life-force (Ojas), self-determination, cognitive endurance, overall life trajectory.',
    karakatvaHi: 'शारीरिक गठन, ओज (प्राण शक्ति), आत्म-संकल्प, मानसिक सहनशीलता, जीवन दिशा।',
    optimumStr: '≥30',
    minThreshold: 25,
    sub25TitleEn: 'Physical Vitality & Self-Assertion Deficit',
    sub25TitleHi: 'शारीरिक शक्ति एवं आत्म-विश्वास में कमी',
    sub25TextEn: 'You may frequently experience low physical stamina or battle self-doubt. Build consistent sleep and nutrition routines, avoid chronic overexertion, and develop confidence through steady, manageable habits.',
    sub25TextHi: 'आप बार-बार शारीरिक ऊर्जा की कमी या आत्म-संदेह का अनुभव कर सकते हैं। नियमित नींद और खान-पान की दिनचर्या बनाएं, अत्यधिक तनाव से बचें और निरंतर छोटे अभ्यासों से आत्मविश्वास विकसित करें।',
    fortifiedTitleEn: 'Robust Physical Vitality & Natural Charisma',
    fortifiedTitleHi: 'प्रचुर शारीरिक ऊर्जा एवं स्वाभाविक प्रभाव',
    fortifiedTextEn: 'Strong foundational vitality and personal presence. Natural resilience against physical fatigue, healthy recovery, and strong instinctive leadership in competitive arenas.',
    fortifiedTextHi: 'मजबूत शारीरिक गठन और प्रभावशाली व्यक्तित्व। थकान से त्वरित रिकवरी और प्रतिस्पर्धी माहौल में स्वाभाविक नेतृत्व क्षमता।',
    moderateTitleEn: 'Balanced Constitution & Steady Stamina',
    moderateTitleHi: 'संतुलित स्वास्थ्य एवं निरंतर स्फूर्ति',
    moderateTextEn: 'Stable physical foundation. Health and energy directly correlate with daily habits and regular wellness routines.',
    moderateTextHi: 'स्थिर शारीरिक आधार। स्वास्थ्य और ऊर्जा आपकी दैनिक आदतों और नियमित व्यायाम के सीधे अनुपात में रहेगी।'
  },
  2: {
    sanskritName: 'Dhana Bhava',
    hindiName: 'धन भाव (द्वितीय भाव)',
    karakatvaEn: 'Liquid capital, savings retention, speech patterns, dietary habits, ancestral family harmony.',
    karakatvaHi: 'तरल धन, बचत संचय, वाणी, खान-पान, पारिवारिक सौहार्द।',
    optimumStr: '≥30',
    minThreshold: 22,
    sub25TitleEn: 'Savings Volatility & Family Friction',
    sub25TitleHi: 'बचत अस्थिरता एवं पारिवारिक तनाव',
    sub25TextEn: 'Earning income is not the issue—retaining it is. Unplanned expenses and domestic friction tend to drain your reserves. Automate your savings early and exercise patience during family discussions.',
    sub25TextHi: 'आय कमाना समस्या नहीं है—उसे बचाना मुख्य चुनौती है। अप्रत्याशित खर्च और घरेलू तनाव बचत को प्रभावित कर सकते हैं। समय रहते बचत को ऑटोमेट करें और पारिवारिक चर्चाओं में धैर्य रखें।',
    fortifiedTitleEn: 'Strong Wealth Retention & Harmonious Speech',
    fortifiedTitleHi: 'सुदृढ़ धन संचय एवं मधुर वाणी',
    fortifiedTextEn: 'Exceptional ability to preserve liquid capital and build enduring financial reserves. Family provides strong moral and material backing, and your words carry weight and credibility.',
    fortifiedTextHi: 'तरल पूंजी को संचित करने और स्थायी संपत्ति बनाने की उत्कृष्ट क्षमता। परिवार का मजबूत सहयोग और वाणी में प्रभावशीलता।',
    moderateTitleEn: 'Steady Financial Foundation & Prudent Budgeting',
    moderateTitleHi: 'स्थिर वित्तीय आधार एवं संतुलित बजट',
    moderateTextEn: 'Balanced cash flow and manageable savings. Practicing prudent financial discipline ensures consistent growth of your assets.',
    moderateTextHi: 'संतुलित आय-व्यय और स्थिर बचत। वित्तीय अनुशासन बनाए रखने से संपत्ति में निरंतर वृद्धि होगी।'
  },
  3: {
    sanskritName: 'Sahaja Bhava',
    hindiName: 'सहज / पराक्रम भाव (तृतीय भाव)',
    karakatvaEn: 'Willpower (Parakrama), calculated courage, younger siblings, manual dexterity, commercial communication.',
    karakatvaHi: 'पराक्रम, इच्छाशक्ति, साहस, छोटे भाई-बहन, व्यावसायिक संवाद।',
    optimumStr: '≥30',
    minThreshold: 29,
    sub25TitleEn: 'Execution Fatigue & Inconsistent Drive',
    sub25TitleHi: 'कार्य निष्पादन में शिथिलता एवं अस्थिर इच्छाशक्ति',
    sub25TextEn: 'You may overthink critical initiatives or lose momentum midway through projects. Relationships with siblings or immediate collaborators require conscious maintenance and clearer boundaries.',
    sub25TextHi: 'आप महत्वपूर्ण योजनाओं में अधिक सोच-विचार कर सकते हैं या बीच में गति खो सकते हैं। भाई-बहनों और सहयोगियों के साथ रिश्तों में स्पष्ट सीमाएं और निरंतर संवाद आवश्यक है।',
    fortifiedTitleEn: 'Indomitable Courage & Dynamic Initiative',
    fortifiedTitleHi: 'अदम्य साहस एवं तीव्र पहल शक्ति',
    fortifiedTextEn: 'Relentless execution power, enterprise, and persuasive communication. You thrive in pioneering ventures, and close peers or younger siblings offer dependable cooperation.',
    fortifiedTextHi: 'अथक कार्यक्षमता, उद्यमशीलता और प्रभावशाली संवाद। नई पहलों में सफलता और सहयोगियों का निरंतर साथ।',
    moderateTitleEn: 'Pragmatic Initiative & Focused Execution',
    moderateTitleHi: 'व्यावहारिक साहस एवं केंद्रित निष्पादन',
    moderateTextEn: 'Calibrated courage and consistent communication skills. Steady effort leads to the steady completion of ambitious tasks.',
    moderateTextHi: 'संतुलित साहस और कुशल संवाद। निरंतर प्रयास से योजनाएं सुचारू रूप से पूरी होती हैं।'
  },
  4: {
    sanskritName: 'Sukha Bhava',
    hindiName: 'सुख भाव (चतुर्थ भाव)',
    karakatvaEn: 'Mother, inner contentment (Sukha), fixed properties, real estate, vehicles, emotional foundations.',
    karakatvaHi: 'माता, आंतरिक सुख-शांति, अचल संपत्ति, वाहन, भावनात्मक स्थिरता।',
    optimumStr: '≥30',
    minThreshold: 24,
    sub25TitleEn: 'Inner Restlessness & Domestic Stress',
    sub25TitleHi: 'आंतरिक अशांति एवं घरेलू तनाव',
    sub25TextEn: 'You may struggle to feel truly at peace in your home environment. Exercise caution regarding real estate paperwork, budget for vehicle maintenance, and offer supportive care to your mother.',
    sub25TextHi: 'घर के माहौल में पूर्ण शांति महसूस करने में कठिनाई हो सकती है। संपत्ति के कागजी दस्तावेज़ों में सतर्कता बरतें, वाहन का ध्यान रखें और माता के स्वास्थ्य का विशेष ख्याल रखें।',
    fortifiedTitleEn: 'Deep Emotional Serenity & Fixed Asset Security',
    fortifiedTitleHi: 'गहरी आंतरिक शांति एवं संपत्ति लाभ',
    fortifiedTextEn: 'Profound peace of mind (Chitta Shuddhi), strong maternal blessings, and smooth acquisition of land, real estate, and comfortable vehicles.',
    fortifiedTextHi: 'प्रचुर मानसिक शांति, माता का विशेष स्नेह व आशीर्वाद और भूमि, भवन व वाहन का सुखद लाभ।',
    moderateTitleEn: 'Stable Domestic Life & Gradual Asset Growth',
    moderateTitleHi: 'स्थिर गृहस्थ जीवन एवं क्रमिक संपत्ति वृद्धि',
    moderateTextEn: 'Harmonious domestic environment. Consistent attention to home maintenance and emotional balance ensures ongoing peace.',
    moderateTextHi: 'सुखद घरेलू वातावरण। घर और मानसिक संतुलन पर ध्यान देने से शांति बनी रहती है।'
  },
  5: {
    sanskritName: 'Putra Bhava',
    hindiName: 'पुत्र / बुद्धि भाव (पंचम भाव)',
    karakatvaEn: 'Intellect (Buddhi), children, speculative investments, creative expression, past-life merits (Purva Punya).',
    karakatvaHi: 'बुद्धि, संतान, रचनात्मकता, शेयर/सट्टा निवेश, पूर्व पुण्य।',
    optimumStr: '≥30',
    minThreshold: 25,
    sub25TitleEn: 'Creative Blocks & Speculative Exposure',
    sub25TitleHi: 'रचनात्मक अवरोध एवं सट्टा जोखिम',
    sub25TextEn: 'Creative output requires deliberate discipline, and parenting may bring added responsibilities. Avoid volatile speculative trading and impulsive risks; focus on disciplined, long-term wealth building.',
    sub25TextHi: 'रचनात्मक कार्यों में विशेष एकाग्रता की आवश्यकता होगी और संतान के प्रति अतिरिक्त उत्तरदायित्व रहेंगे। जोखिम भरे सट्टे व शॉर्ट-टर्म ट्रेडिंग से बचें और दीर्घकालिक निवेश पर ध्यान दें।',
    fortifiedTitleEn: 'Exceptional Intellect & Abundant Purva Punya',
    fortifiedTitleHi: 'प्रखर बुद्धि एवं पूर्व-पुण्य का वरदान',
    fortifiedTextEn: 'Sharp strategic mind, creative brilliance, and auspicious blessings regarding children. Calculated investments and academic pursuits bear fruitful rewards.',
    fortifiedTextHi: 'तीक्ष्ण कूटनीतिक बुद्धि, उच्च रचनात्मकता और संतान का शुभ सुख। योजनाबद्ध निवेश और विद्या में उत्कृष्ट परिणाम।',
    moderateTitleEn: 'Logical Intelligence & Disciplined Creativity',
    moderateTitleHi: 'विवेकपूर्ण बुद्धि एवं संतुलित विचार',
    moderateTextEn: 'Clear rational thinking and steady learning abilities. Structured approaches to financial planning and education deliver reliable progress.',
    moderateTextHi: 'स्पष्ट तार्किक सोच और सीखने की क्षमता। सुनियोजित अध्ययन और योजनाबद्ध कार्यों में सफलता।'
  },
  6: {
    sanskritName: 'Ari Bhava',
    hindiName: 'अरि / रोग भाव (षष्ठ भाव)',
    karakatvaEn: 'Immunological resistance, digestive fire (Agni), workplace debts, open adversaries, daily service routines.',
    karakatvaHi: 'रोग प्रतिरोधक क्षमता, जठराग्नि, ऋण, शत्रु, दैनिक कार्य व सेवा।',
    optimumStr: '≥30',
    minThreshold: 34,
    sub25TitleEn: 'Digestive Sensitivity & Daily Burnout',
    sub25TitleHi: 'पाचन संवेदनशीलता एवं दैनिक तनाव',
    sub25TextEn: 'Your physical resilience to daily stress and digestive strain is sensitive. Maintain a structured daily routine, avoid high-interest consumer debt, and prioritize gut health.',
    sub25TextHi: 'दैनिक कार्यभार और पाचन तंत्र के प्रति सजग रहें। नियमित दिनचर्या अपनाएं, गैर-ज़रूरी कर्ज़ से बचें और खान-पान व पेट के स्वास्थ्य को प्राथमिकता दें।',
    fortifiedTitleEn: 'Formidable Competitive Edge & Robust Immunity',
    fortifiedTitleHi: 'शत्रुओं पर विजय एवं मजबूत रोग-प्रतिरोधक क्षमता',
    fortifiedTextEn: 'Exceptional resistance to illness, overwhelming power to overcome workplace adversaries, and mastery over complex problem-solving and debt elimination.',
    fortifiedTextHi: 'रोगों से लड़ने की बेहतरीन ताकत, विरोधियों पर स्वाभाविक बढ़त और जटिल समस्याओं व कर्ज़ों को सुलझाने में महारत।',
    moderateTitleEn: 'Managed Daily Work & Controlled Health Routines',
    moderateTitleHi: 'नियंत्रित दिनचर्या एवं सामान्य स्वास्थ्य',
    moderateTextEn: 'Capacity to handle routine workplace pressures. Keeping a balanced diet and steady fitness routine keeps health issues and rivalries well contained.',
    moderateTextHi: 'कार्यस्थल के तनाव को संभालने की सामान्य क्षमता। संतुलित आहार और नियमित व्यायाम से स्वास्थ्य उत्तम रहता है।'
  },
  7: {
    sanskritName: 'Kalatra Bhava',
    hindiName: 'कलत्र भाव (सप्तम भाव)',
    karakatvaEn: 'Legal marriage, spouse, commercial partners, contracts, trade negotiations, public diplomacy.',
    karakatvaHi: 'वैवाहिक जीवन, जीवनसाथी, व्यापारिक साझीदारी, अनुबंध, जनसंपर्क।',
    optimumStr: '≥30',
    minThreshold: 19,
    sub25TitleEn: 'Partnership Friction & Relational Strains',
    sub25TitleHi: 'साझेदारी में मतभेद एवं वैवाहिक चुनौतियाँ',
    sub25TextEn: 'Marriage and business partnerships require active compromise and clear communication. Avoid vague verbal agreements in business; maintain strict written contracts and mutual transparency.',
    sub25TextHi: 'विवाह और व्यापारिक साझेदारियों में विशेष समझदारी और स्पष्ट संवाद आवश्यक है। व्यापार में केवल मौखिक बातों पर भरोसा न करें; लिखित अनुबंध और पारदर्शिता बनाए रखें।',
    fortifiedTitleEn: 'Fortunate Alliances & Flourishing Partnerships',
    fortifiedTitleHi: 'सौभाग्यशाली जीवनसाथी एवं सफल साझेदारी',
    fortifiedTextEn: 'Spouse brings prosperity, emotional stability, and mutual growth. Collaborative ventures and commercial partnerships flourish with trust and lucrative joint rewards.',
    fortifiedTextHi: 'जीवनसाथी से समृद्धि और भावनात्मक संबल की प्राप्ति। व्यापारिक साझीदारी और जनसंपर्क में उच्च सफलता व प्रतिष्ठा।',
    moderateTitleEn: 'Stable Relationships & Cooperative Alliances',
    moderateTitleHi: 'सौहार्दपूर्ण संबंध एवं संतुलित साझेदारी',
    moderateTextEn: 'Fair and mutually respectful partnerships. Direct, honest communication maintains harmony in personal and professional commitments.',
    moderateTextHi: 'पारस्परिक सम्मान और सहयोग पर आधारित संबंध। स्पष्ट और ईमानदार संवाद से साझेदारी सुदृढ़ रहती है।'
  },
  8: {
    sanskritName: 'Randhra Bhava',
    hindiName: 'रन्ध्र भाव (अष्टम भाव)',
    karakatvaEn: 'Longevity, sudden upheavals, inheritances, shared assets, deep psychological crisis, occult transformation.',
    karakatvaHi: 'आयु, आकस्मिक परिवर्तन, पैतृक संपत्ति, गूढ़ ज्ञान, संकट प्रबंधन।',
    optimumStr: '≤25',
    minThreshold: 24,
    sub25TitleEn: 'Sudden Disruptions & Emotional Anxiety',
    sub25TitleHi: 'आकस्मिक परिवर्तन एवं मानसिक चिंता',
    sub25TextEn: 'Unexpected crises can trigger elevated stress. Maintain adequate health and emergency insurance, keep shared financial records transparent, and practice grounding routines to ease mental strain.',
    sub25TextHi: 'अचानक आने वाले उतार-चढ़ाव मानसिक तनाव दे सकते हैं। स्वास्थ्य और आपातकालीन बीमा दुरुस्त रखें, वित्तीय कागजात स्पष्ट रखें और मन को शांत रखने के लिए ध्यान अपनाएं।',
    fortifiedTitleEn: 'Profound Occult Insight & Crisis Resilience',
    fortifiedTitleHi: 'गूढ़ अनुसंधान शक्ति एवं संकटों से उबरने की क्षमता',
    fortifiedTextEn: 'Deep research stamina, psychological depth, and protection against catastrophic accidents. Potential for unexpected gains, insurance claims, or legacy benefits.',
    fortifiedTextHi: 'गहन अनुसंधान क्षमता, संकटों से सहज उबरने की आंतरिक शक्ति और आकस्मिक लाभ व बीमा/विरासत में सहयोग।',
    moderateTitleEn: 'Manageable Transformations & Measured Endurance',
    moderateTitleHi: 'संतुलित जीवन-परिवर्तन एवं स्थिरता',
    moderateTextEn: 'Life transitions unfold in a manageable manner. Staying prudent in joint investments and maintaining health awareness protects your longevity.',
    moderateTextHi: 'जीवन के परिवर्तन सहज रूप से व्यवस्थित रहते हैं। संयुक्त निवेश में सतर्कता और स्वास्थ्य के प्रति जागरूकता सहायक रहेगी।'
  },
  9: {
    sanskritName: 'Dharma Bhava',
    hindiName: 'धर्म / भाग्य भाव (नवम भाव)',
    karakatvaEn: 'Fortune (Bhagya), father, spiritual guides, higher philosophy, legal systems, long-distance journeys.',
    karakatvaHi: 'भाग्य, पिता, गुरु, उच्च ज्ञान, धर्म, तीर्थ यात्राएं।',
    optimumStr: '≥30',
    minThreshold: 29,
    sub25TitleEn: 'Self-Made Path & Limited Luck Support',
    sub25TitleHi: 'स्वावलंबन का मार्ग एवं पुरुषार्थ प्रधान जीवन',
    sub25TextEn: 'Luck provides few shortcuts; your progress is built entirely through personal effort. Ideological differences with mentors or your father may occur. Rely on proven competence rather than chance.',
    sub25TextHi: 'भाग्य के सहारे बैठने के बजाय आपका विकास पूरी तरह आपके व्यक्तिगत पुरुषार्थ से होगा। पिता या मार्गदर्शकों से वैचारिक मतभेद संभव हैं। अपनी योग्यता पर भरोसा रखें।',
    fortifiedTitleEn: 'Abundant Fortune & Divine Grace',
    fortifiedTitleHi: 'प्रबल भाग्योदय एवं ईश्वरीय कृपा',
    fortifiedTextEn: 'Effortless luck operates as a continuous tailwind. Auspicious paternal relationship, deep spiritual clarity, success in higher education, and rewarding foreign journeys.',
    fortifiedTextHi: 'निरंतर भाग्योदय और ईश्वरीय अनुग्रह का साथ। पिता से मधुर संबंध, उच्च शिक्षा में सफलता और दूरस्थ व आध्यात्मिक यात्राओं से लाभ।',
    moderateTitleEn: 'Earned Fortune & Righteous Principles',
    moderateTitleHi: 'संतुलित भाग्य एवं धर्म-परायणता',
    moderateTextEn: 'A fair balance where sincere effort attracts corresponding divine blessings. Respect for ethical principles and mentors yields steady personal growth.',
    moderateTextHi: 'सच्चे प्रयासों से भाग्य का साथ मिलता है। नैतिक सिद्धांतों और गुरुजनों के मार्गदर्शन से निरंतर प्रगति होती है।'
  },
  10: {
    sanskritName: 'Karma Bhava',
    hindiName: 'कर्म भाव (दशम भाव)',
    karakatvaEn: 'Career trajectory, social standing, authority figures, professional reputation, executive impact.',
    karakatvaHi: 'करियर, सामाजिक प्रतिष्ठा, पद-अधिकार, यश, कार्यक्षेत्र।',
    optimumStr: '≥30',
    minThreshold: 36,
    sub25TitleEn: 'Career Stagnation & Delayed Recognition',
    sub25TitleHi: 'करियर में विलंब एवं परिश्रम की कम पहचान',
    sub25TextEn: 'You may frequently feel overworked yet under-credited by management. Career advancement requires patience and long-term planning. Focus on developing specialized, portable skills.',
    sub25TextHi: 'आप महसूस कर सकते हैं कि मेहनत अधिक है पर उसका श्रेय देर से मिलता है। करियर में धैर्य और दूरदर्शिता रखें। अपनी विशेषज्ञता और व्यक्तिगत कौशल को निखारने पर ध्यान दें।',
    fortifiedTitleEn: 'Ascendant Career Trajectory & Eminent Authority',
    fortifiedTitleHi: 'करियर में उच्च पद एवं सामाजिक प्रतिष्ठा',
    fortifiedTextEn: 'Outstanding professional momentum, commanding executive authority, and widespread public respect. Natural ability to steer large initiatives and earn leadership roles.',
    fortifiedTextHi: 'करियर में तीव्र प्रगति, उच्च सामाजिक प्रतिष्ठा और सम्मान। बड़े प्रोजेक्ट्स और नेतृत्व के अवसरों में सहज सफलता।',
    moderateTitleEn: 'Steady Professional Progress & Solid Reputation',
    moderateTitleHi: 'निरंतर करियर विकास एवं स्थिर साख',
    moderateTextEn: 'Consistent career growth through sustained dedication. Clear communication with superiors ensures your contributions are recognized.',
    moderateTextHi: 'निरंतर निष्ठा से करियर में स्थिर प्रगति। उच्चाधिकारियों के साथ स्पष्ट संवाद से कार्यों की उचित सराहना होगी।'
  },
  11: {
    sanskritName: 'Labha Bhava',
    hindiName: 'लाभ भाव (एकादश भाव)',
    karakatvaEn: 'Revenue inflows, monetization of skills, major aspirations, elite networks, elder siblings.',
    karakatvaHi: 'धन लाभ, आय के स्रोत, मनोकामना पूर्ति, मित्र मंडली, बड़े भाई-बहन।',
    optimumStr: '≥30',
    minThreshold: 54,
    sub25TitleEn: 'Monetization Bottlenecks & Network Gaps',
    sub25TitleHi: 'आय प्रवाह में रुकावट एवं सीमित सहयोग',
    sub25TextEn: 'Converting hard work into consistent financial gains requires extra effort. Your professional network may offer limited tangible backing. Diversify your income streams cautiously.',
    sub25TextHi: 'मेहनत को नियमित वित्तीय लाभ में बदलना एक चुनौती हो सकता है। सामाजिक संपर्कों से भौतिक लाभ सीमित रह सकता है। आय के वैकल्पिक स्रोतों पर ध्यान दें।',
    fortifiedTitleEn: 'Magnificent Inflows & Expansive Social Patronage',
    fortifiedTitleHi: 'प्रचुर धन लाभ एवं प्रभावशाली मित्र मंडली',
    fortifiedTextEn: 'Effortless monetization of talents, rapid fulfillment of long-held dreams, and an influential social network that consistently opens lucrative doors.',
    fortifiedTextHi: 'कौशल से उत्तम धनोपार्जन, सभी महत्वाकांक्षाओं की पूर्ति और प्रभावशाली मित्रों व संपर्कों से निरंतर नए लाभ के अवसर।',
    moderateTitleEn: 'Reliable Cash Inflows & Supportive Circle',
    moderateTitleHi: 'नियमित आय प्रवाह एवं सहयोगी मित्र',
    moderateTextEn: 'Stable, dependable streams of income. Cultivating genuine personal and professional friendships gradually expands your prosperity.',
    moderateTextHi: 'विश्वसनीय और स्थिर आय। सच्चे मित्रों और पेशेवर संबंधों को सींचने से लाभ के नए रास्ते खुलते रहेंगे।'
  },
  12: {
    sanskritName: 'Vyaya Bhava',
    hindiName: 'व्यय भाव (द्वादश भाव)',
    karakatvaEn: 'Capital expenditure, sleep architecture, subconscious processing, foreign residence, spiritual liberation (Moksha).',
    karakatvaHi: 'व्यय, शयन सुख, अवचेतन मन, विदेश गमन, मोक्ष साधना।',
    optimumStr: '≤25',
    minThreshold: 16,
    sub25TitleEn: 'Sleep Irregularities & Sense of Isolation',
    sub25TitleHi: 'अनिद्रा की समस्या एवं अलगाव का अनुभव',
    sub25TextEn: 'You may struggle with light or irregular sleep and feel disconnected during foreign travel. Create a disciplined evening wind-down routine, limit late-night screen time, and establish grounding habits.',
    sub25TextHi: 'हल्की या अनियमित नींद की समस्या और विदेश प्रवास में अकेलापन महसूस हो सकता है। सोने से पहले शांत दिनचर्या बनाएं, देर रात स्क्रीन देखने से बचें और ध्यान का सहारा लें।',
    fortifiedTitleEn: 'Spiritual Transcendence & Foreign Prosperity',
    fortifiedTitleHi: 'आध्यात्मिक उन्नति एवं विदेश से समृद्धि',
    fortifiedTextEn: 'Deep meditative capacity, profound dream recall, and lucrative success in foreign lands, multinational enterprises, or charitable institutions. Natural detachment from material stress.',
    fortifiedTextHi: 'गहरी आध्यात्मिक रुचि, ध्यान में सहज एकाग्रता और विदेश या बहुराष्ट्रीय कार्यों से उत्तम लाभ। भौतिक चिंताओं से सहज मुक्ति।',
    moderateTitleEn: 'Controlled Expenditures & Restful Sleep',
    moderateTitleHi: 'नियंत्रित खर्च एवं संतुलित शयन सुख',
    moderateTextEn: 'Financial expenditures remain proportional to your earnings. Maintaining peaceful sleeping habits and taking occasional quiet retreats restores your energy.',
    moderateTextHi: 'खर्च आपकी आय के अनुपात में संतुलित रहते हैं। शांत नींद और समय-समय पर आत्म-चिंतन से ऊर्जा बनी रहती है।'
  }
};

/**
 * Calculates complete Sarvashtakavarga (337 Bindus) and dynamic Diagnostics from Kundali
 */
export function calculateSarvashtakavarga(kundali: KundaliResult): SarvashtakavargaResult {
  const lagnaRashi = kundali.lagnaRashiIndex;

  // Extract 7 classical planetary sign positions (0 to 11)
  const planetRashiMap: Record<string, number> = {
    Sun: 0,
    Moon: 0,
    Mars: 0,
    Mercury: 0,
    Jupiter: 0,
    Venus: 0,
    Saturn: 0,
    Lagna: lagnaRashi
  };

  kundali.planets.forEach(p => {
    if (p.name.includes('Sun') || p.name.includes('Surya')) planetRashiMap.Sun = p.rashiIndex;
    else if (p.name.includes('Moon') || p.name.includes('Chandra')) planetRashiMap.Moon = p.rashiIndex;
    else if (p.name.includes('Mars') || p.name.includes('Mangala')) planetRashiMap.Mars = p.rashiIndex;
    else if (p.name.includes('Mercury') || p.name.includes('Budha')) planetRashiMap.Mercury = p.rashiIndex;
    else if (p.name.includes('Jupiter') || p.name.includes('Brihaspati')) planetRashiMap.Jupiter = p.rashiIndex;
    else if (p.name.includes('Venus') || p.name.includes('Shukra')) planetRashiMap.Venus = p.rashiIndex;
    else if (p.name.includes('Saturn') || p.name.includes('Shani')) planetRashiMap.Saturn = p.rashiIndex;
  });

  // Calculate Bhinnashtakavarga (BAV) & Sarvashtakavarga (SAV) per sign (0..11)
  const savBySign = new Array(12).fill(0);
  const bav: Record<string, number[]> = {};

  const classicalPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const referenceEntities = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna'];

  for (const planet of classicalPlanets) {
    bav[planet] = new Array(12).fill(0);
    const planetRules = PARASHARI_BAV_RULES[planet];

    for (const ref of referenceEntities) {
      const refSign = planetRashiMap[ref];
      const beneficHouses = planetRules[ref] || [];

      for (const h of beneficHouses) {
        const targetSign = (refSign + h - 1) % 12;
        bav[planet][targetSign] += 1;
        savBySign[targetSign] += 1;
      }
    }
  }

  // Map to 12 Houses from Lagna
  const houses: HouseSAVDiagnostic[] = [];
  const prosperousHouses: number[] = [];
  const balancedHouses: number[] = [];
  const effortHeavyHouses: number[] = [];

  for (let h = 1; h <= 12; h++) {
    const signIdx = (lagnaRashi + h - 1) % 12;
    const pts = savBySign[signIdx];
    const band = getSAVBand(pts);
    const spec = CLASSICAL_HOUSE_SPEC[h];

    let diagTitleEn = spec.moderateTitleEn;
    let diagTitleHi = spec.moderateTitleHi;
    let diagTextEn = spec.moderateTextEn;
    let diagTextHi = spec.moderateTextHi;

    const isProsperous = pts >= 30;
    const isEffortHeavy = pts < 25;

    if (pts < 25) {
      diagTitleEn = spec.sub25TitleEn;
      diagTitleHi = spec.sub25TitleHi;
      diagTextEn = spec.sub25TextEn;
      diagTextHi = spec.sub25TextHi;
      effortHeavyHouses.push(h);
    } else if (pts >= 30) {
      diagTitleEn = spec.fortifiedTitleEn;
      diagTitleHi = spec.fortifiedTitleHi;
      diagTextEn = spec.fortifiedTextEn;
      diagTextHi = spec.fortifiedTextHi;
      prosperousHouses.push(h);
    } else {
      balancedHouses.push(h);
    }

    houses.push({
      houseNumber: h,
      sanskritName: spec.sanskritName,
      hindiName: spec.hindiName,
      rashiIndex: signIdx,
      rashiName: RASHI_NAMES_EN[signIdx],
      rashiHindi: RASHI_NAMES_HI[signIdx],
      points: pts,
      band,
      karakatva: {
        en: spec.karakatvaEn,
        hi: spec.karakatvaHi
      },
      thresholds: {
        mean: 28,
        optimum: spec.optimumStr,
        minThreshold: spec.minThreshold
      },
      diagnostic: {
        titleEn: diagTitleEn,
        titleHi: diagTitleHi,
        textEn: diagTextEn,
        textHi: diagTextHi
      },
      isProsperous,
      isEffortHeavy
    });
  }

  // Systemic Financial Triad Diagnostics (10th Karma, 11th Labha, 12th Vyaya, 2nd Dhana)
  const h10Pts = houses[9].points;
  const h11Pts = houses[10].points;
  const h12Pts = houses[11].points;
  const h2Pts = houses[1].points;

  const isLaborUnreciprocated = h10Pts > h11Pts;
  const isCapitalLeaking = h12Pts > h11Pts || h2Pts < 22;

  let finTitleEn = 'Balanced Financial Vector';
  let finTitleHi = 'संतुलित वित्तीय प्रवाह';
  let finExplEn = 'Healthy equilibrium between professional efforts, earnings, and asset retention.';
  let finExplHi = 'आपके कार्य, आय प्रवाह और बचत में स्वस्थ संतुलन बना हुआ है।';

  if (isLaborUnreciprocated && isCapitalLeaking) {
    finTitleEn = 'High Labor with Capital Attrition (Double Deficit)';
    finTitleHi: 'अत्यधिक श्रम व धन क्षय (दोहरी चुनौती)';
    finExplEn = `Your 10th House (${h10Pts} pts) exceeds your 11th House (${h11Pts} pts), indicating extensive visible professional exertion with delayed monetization. Additionally, your 12th House (${h12Pts} pts) exceeds your 11th, signaling recurring capital drain. Automate savings and enforce strict written terms for all commercial work.`;
    finExplHi = `आपका 10वां भाव (${h10Pts} अंक) 11वें भाव (${h11Pts} अंक) से अधिक है, जो दर्शाता है कि मेहनत अधिक है पर उसका वित्तीय प्रतिफल देर से मिलता है। साथ ही 12वां भाव (${h12Pts} अंक) 11वें से अधिक होने से अप्रत्याशित खर्च बचत को प्रभावित कर सकते हैं। समय पर बचत सुरक्षित करें।`;
  } else if (isLaborUnreciprocated) {
    finTitleEn = 'Unreciprocated Exertion Warning';
    finTitleHi = 'परिश्रम के अनुपात में विलंबित लाभ';
    finExplEn = `10th House of career labor (${h10Pts} pts) exceeds 11th House of gains (${h11Pts} pts). You tend to exert substantial professional energy, but direct monetization requires deliberate structuring and active negotiation.`;
    finExplHi = `कार्य का 10वां भाव (${h10Pts} अंक) लाभ के 11वें भाव (${h11Pts} अंक) से बड़ा है। आपकी व्यावसायिक मेहनत बहुत अधिक रहती है, परंतु उसके पूर्ण वित्तीय दोहन के लिए आपको सक्रिय मोलभाव व योजनाबद्ध प्रयास करने होंगे।`;
  } else if (isCapitalLeaking) {
    finTitleEn = 'Capital Leakage Warning';
    finTitleHi = 'पूंजी क्षय एवं व्यय सतर्कता';
    finExplEn = `12th House of expenditure (${h12Pts} pts) rivals or exceeds 11th House of gains (${h11Pts} pts). While revenue flows in, unexpected domestic or health liabilities can erode savings. Automate your investments.`;
    finExplHi = `व्यय का 12वां भाव (${h12Pts} अंक) लाभ के 11वें भाव (${h11Pts} अंक) के लगभग बराबर या अधिक है। आय तो आती है, परंतु अचानक आने वाले पारिवारिक या चिकित्सकीय खर्चे बचत को प्रभावित कर सकते हैं। बचत को पहले से सुरक्षित रखें।`;
  } else {
    finTitleEn = 'Prosperous Monetization Triad';
    finTitleHi = 'उत्कृष्ट धनोपार्जन व संचय योग';
    finExplEn = `11th House of gains (${h11Pts} pts) comfortably surpasses 10th House (${h10Pts} pts) and 12th House (${h12Pts} pts). Your professional labor converts efficiently into financial assets and sustained surplus.`;
    finExplHi = `लाभ का 11वां भाव (${h11Pts} अंक) 10वें भाव (${h10Pts} अंक) और 12वें भाव (${h12Pts} अंक) से अधिक है। आपका व्यावसायिक परिश्रम बहुत ही प्रभावशाली रूप से धन लाभ और स्थायी बचत में परिवर्तित होता है।`;
  }

  // Dusthana Triad (Houses 6, 8, 12) - Teertha Rule (Sum vs 76 points)
  const h6Pts = houses[5].points;
  const h8Pts = houses[7].points;
  const dusthanaSum = h6Pts + h8Pts + h12Pts;
  const isProtectedDusthana = dusthanaSum < 76;

  let dusthanaTitleEn = isProtectedDusthana
    ? 'Hazard Containment (Teertha Protected)'
    : 'Systemic Vulnerability Awareness';
  let dusthanaTitleHi = isProtectedDusthana
    ? 'संकट व व्याधि नियंत्रण (तीर्थ नियम सुरक्षित)'
    : 'स्वास्थ्य व तनाव के प्रति सजगता';
  let dusthanaExplEn = isProtectedDusthana
    ? `The aggregate score of your Dusthanas (6th + 8th + 12th = ${dusthanaSum} pts) is under the classical 76-point baseline. Involuntary losses, legal hurdles, and chronic illnesses are structurally suppressed and cannot easily derail you.`
    : `The aggregate score of your Dusthanas (6th + 8th + 12th = ${dusthanaSum} pts) exceeds 76 points. Chronic stress, digestive fatigue, or disputes require proactive management, disciplined health habits, and transparent contracts.`;
  let dusthanaExplHi = isProtectedDusthana
    ? `आपके त्रिक भावों (6ठे + 8वें + 12वें भाव) का कुल योग ${dusthanaSum} अंक है, जो शास्त्रीय 76-अंक की सीमा से कम है। कानूनी विवाद, अप्रत्याशित हानियाँ और लंबी बीमारियाँ आपके जीवन को आसानी से अस्थिर नहीं कर सकतीं।`
    : `आपके त्रिक भावों (6ठे + 8वें + 12वें भाव) का कुल योग ${dusthanaSum} अंक है, जो 76 अंक से अधिक है। तनाव, पाचन स्वास्थ्य और कानूनी/व्यावसायिक समझौतों में पारदर्शिता और नियमित स्वास्थ्य दिनचर्या बनाए रखना आवश्यक है।`;

  const signs = Array.from({ length: 12 }, (_, i) => ({
    rashiIndex: i,
    rashiName: RASHI_NAMES_EN[i],
    rashiHindi: RASHI_NAMES_HI[i],
    points: savBySign[i],
    band: getSAVBand(savBySign[i])
  }));

  return {
    totalPoints: 337,
    averagePerHouse: 28.08,
    houses,
    signs,
    bav,
    executiveSummary: {
      prosperousHouses,
      balancedHouses,
      effortHeavyHouses,
      financialTriad: {
        karmaHouse10Points: h10Pts,
        labhaHouse11Points: h11Pts,
        vyayaHouse12Points: h12Pts,
        dhanaHouse2Points: h2Pts,
        laborMonetizationBalance: isLaborUnreciprocated ? 'UNRECIPROCATED_EFFORT' : 'EXCELLENT',
        capitalRetentionBalance: isCapitalLeaking ? 'CAPITAL_LEAKAGE' : 'STRONG_RETENTION',
        titleEn: finTitleEn,
        titleHi: finTitleHi,
        explanationEn: finExplEn,
        explanationHi: finExplHi
      },
      dusthanaTriad: {
        house6Points: h6Pts,
        house8Points: h8Pts,
        house12Points: h12Pts,
        totalSum: dusthanaSum,
        isProtected: isProtectedDusthana,
        titleEn: dusthanaTitleEn,
        titleHi: dusthanaTitleHi,
        explanationEn: dusthanaExplEn,
        explanationHi: dusthanaExplHi
      }
    }
  };
}
