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

export interface PurusharthaTrikonaItem {
  id: 'DHARMA' | 'ARTHA' | 'KAMA' | 'MOKSHA';
  nameEn: string;
  nameHi: string;
  nameGu: string;
  houses: number[];
  elementEn: string;
  elementHi: string;
  elementGu: string;
  directionEn: string;
  directionHi: string;
  directionGu: string;
  points: number;
  benchmark: number; // 84
  diffFromBenchmark: number;
  percentage: number;
  status: 'DOMINANT' | 'BALANCED' | 'DEFICIENT';
  descriptionEn: string;
  descriptionHi: string;
  descriptionGu: string;
}

export interface DirectionalRelocationAnalysis {
  eastPoints: number;
  southPoints: number;
  westPoints: number;
  northPoints: number;
  bestDirection: 'EAST' | 'SOUTH' | 'WEST' | 'NORTH';
  bestDirectionEn: string;
  bestDirectionHi: string;
  bestDirectionGu: string;
  vulnerableDirection: 'EAST' | 'SOUTH' | 'WEST' | 'NORTH';
  vulnerableDirectionEn: string;
  vulnerableDirectionHi: string;
  vulnerableDirectionGu: string;
  citySectorRecommendationEn: string;
  citySectorRecommendationHi: string;
  citySectorRecommendationGu: string;
  vastuRecommendationEn: string;
  vastuRecommendationHi: string;
  vastuRecommendationGu: string;
}

export interface SadeSatiSAVPhase {
  phaseNumber: 1 | 2 | 3;
  titleEn: string;
  titleHi: string;
  titleGu: string;
  relativeHouseEn: string;
  relativeHouseHi: string;
  houseNumber: number;
  rashiIndex: number;
  rashiNameEn: string;
  rashiNameHi: string;
  rashiNameGu: string;
  savPoints: number;
  saturnBavPoints: number;
  statusEn: string;
  statusHi: string;
  isVulnerable: boolean;
}

export interface SadeSatiSAVAnalysis {
  moonHouse: number;
  moonRashiIndex: number;
  moonRashiNameEn: string;
  moonRashiNameHi: string;
  moonRashiNameGu: string;
  phases: SadeSatiSAVPhase[];
  total3SignPoints: number;
  benchmark: number; // 84
  classification: 'CONSTRUCTIVE_ELEVATION' | 'MODERATE_PROGRESS' | 'HIGH_FRICTION_RESTRUCTURING';
  titleEn: string;
  titleHi: string;
  titleGu: string;
  descriptionEn: string;
  descriptionHi: string;
  descriptionGu: string;
}

export interface LifeVerticalsAnalysis {
  jobVsBusiness: {
    h6Points: number;
    h10Points: number;
    verdict: 'EMPLOYMENT_PREFERRED' | 'BUSINESS_PREFERRED' | 'HYBRID_CAPABLE';
    titleEn: string;
    titleHi: string;
    titleGu: string;
    descriptionEn: string;
    descriptionHi: string;
    descriptionGu: string;
  };
  executionVsLuck: {
    h9Points: number;
    h10Points: number;
    verdict: 'SELF_EFFORT_DRIVEN' | 'LUCK_SUPPORTED' | 'BALANCED';
    titleEn: string;
    titleHi: string;
    titleGu: string;
    descriptionEn: string;
    descriptionHi: string;
    descriptionGu: string;
  };
  wealthLock: {
    h2Points: number;
    h11Points: number;
    isLocked: boolean;
    titleEn: string;
    titleHi: string;
    titleGu: string;
    descriptionEn: string;
    descriptionHi: string;
    descriptionGu: string;
  };
  marriageAgency: {
    h1Points: number;
    h7Points: number;
    h2Points: number;
    h7RangeStatus: 'HEALTHY' | 'INSTABILITY_RISK' | 'OVER_EXPANDED';
    relationalAgency: 'SELF_AUTONOMY' | 'PARTNER_DOMINANT' | 'EQUAL_PARTNERSHIP';
    isTransactionalWarning: boolean;
    titleEn: string;
    titleHi: string;
    titleGu: string;
    descriptionEn: string;
    descriptionHi: string;
    descriptionGu: string;
  };
  domesticAndYogas: {
    h4Points: number;
    h5Points: number;
    h6Points: number;
    h12Points: number;
    hasDomesticPeace: boolean;
    hasTripleCrownYoga: boolean;
    titleEn: string;
    titleHi: string;
    titleGu: string;
    descriptionEn: string;
    descriptionHi: string;
    descriptionGu: string;
  };
}

export interface QuantumJumpTransition {
  fromHouse: number;
  toHouse: number;
  fromPoints: number;
  toPoints: number;
  delta: number;
  type: 'ROCKET' | 'CLIFF';
  titleEn: string;
  titleHi: string;
  titleGu: string;
  descriptionEn: string;
  descriptionHi: string;
  descriptionGu: string;
}

export interface EighthFromStabilityItem {
  referenceHouse: number;
  referenceNameEn: string;
  referenceNameHi: string;
  referencePoints: number;
  vulnerabilityHouse: number;
  vulnerabilityNameEn: string;
  vulnerabilityNameHi: string;
  vulnerabilityPoints: number;
  deltaStability: number;
  status: 'STABLE_SHIELDED' | 'NEUTRAL' | 'CRITICAL_VULNERABILITY';
  destabilizingFactorEn: string;
  destabilizingFactorHi: string;
  recommendationEn: string;
  recommendationHi: string;
}

export type SAVTradition = 'BPHS' | 'BRIHAT_JATAKA';

export interface ThreePartsOfLifeItem {
  partNumber: 1 | 2 | 3;
  titleEn: string;
  titleHi: string;
  titleGu: string;
  spanEn: string;
  spanHi: string;
  spanGu: string;
  points: number;
  benchmark: number; // 112.33
  percentage: number;
  isPeak: boolean;
  isLeast: boolean;
  status: 'EXCELLENT' | 'MODERATE' | 'VULNERABLE';
  descriptionEn: string;
  descriptionHi: string;
  descriptionGu: string;
}

export interface ThreePartsOfLifeAnalysis {
  method1RashiKhandas: {
    parts: ThreePartsOfLifeItem[];
    peakPart: ThreePartsOfLifeItem;
    leastPart: ThreePartsOfLifeItem;
    titleEn: string;
    titleHi: string;
    titleGu: string;
    descriptionEn: string;
    descriptionHi: string;
    descriptionGu: string;
  };
  method2BhavaKhandas: {
    parts: ThreePartsOfLifeItem[];
    peakPart: ThreePartsOfLifeItem;
    leastPart: ThreePartsOfLifeItem;
    titleEn: string;
    titleHi: string;
    titleGu: string;
    descriptionEn: string;
    descriptionHi: string;
    descriptionGu: string;
  };
  synthesizedVerdict: {
    goldenPhaseEn: string;
    goldenPhaseHi: string;
    goldenPhaseGu: string;
    counselEn: string;
    counselHi: string;
    counselGu: string;
  };
}

export interface MaterialSpiritualNatureAnalysis {
  antarbhagaPoints: number;
  antarbhagaPercentage: number;
  antarbhagaHouses: number[]; // [1, 4, 5, 7, 9, 10]
  bahirbhagaPoints: number;
  bahirbhagaPercentage: number;
  bahirbhagaHouses: number[]; // [2, 3, 6, 8, 11, 12]
  verdict: 'SPIRITUAL_DOMINANT' | 'MATERIAL_DOMINANT' | 'BALANCED_HARMONY';
  titleEn: string;
  titleHi: string;
  titleGu: string;
  subtitleEn: string;
  subtitleHi: string;
  subtitleGu: string;
  descriptionEn: string;
  descriptionHi: string;
  descriptionGu: string;
  antarbhagaSignificationsEn: string;
  antarbhagaSignificationsHi: string;
  antarbhagaSignificationsGu: string;
  bahirbhagaSignificationsEn: string;
  bahirbhagaSignificationsHi: string;
  bahirbhagaSignificationsGu: string;
}

export interface MisfortuneQuotientCalculation {
  id: string;
  titleEn: string;
  titleHi: string;
  titleGu: string;
  fromEntity: string;
  toEntity: string;
  housesIncluded: number[];
  sumPoints: number;
  formulaStr: string;
  quotientAge: number;
  exactAgeStr: string;
  significationEn: string;
  significationHi: string;
  significationGu: string;
  afflictionType: 'CHRONIC_DISEASE' | 'ENDURANCE_TEST' | 'SURGERY_TRAUMA' | 'VITALITY_CRISIS';
}

export interface MaleficHouseAgeItem {
  planetEn: string;
  planetHi: string;
  planetGu: string;
  symbol: string;
  houseNumber: number;
  rashiNameEn: string;
  rashiNameHi: string;
  rashiNameGu: string;
  savPoints: number;
  age: number;
  threatTypeEn: string;
  threatTypeHi: string;
  threatTypeGu: string;
  warningEn: string;
  warningHi: string;
  warningGu: string;
}

export interface MisfortuneYearsAnalysis {
  quotientCalculations: MisfortuneQuotientCalculation[];
  maleficHouseAges: MaleficHouseAgeItem[];
  remedialTipsEn: string[];
  remedialTipsHi: string[];
  remedialTipsGu: string[];
}

export interface SarvashtakavargaResult {
  tradition: SAVTradition;
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
  purusharthaTrikonas: PurusharthaTrikonaItem[];
  directionalRelocation: DirectionalRelocationAnalysis;
  sadeSatiAnalysis: SadeSatiSAVAnalysis;
  lifeVerticals: LifeVerticalsAnalysis;
  quantumJumps: QuantumJumpTransition[];
  eighthFromStability: EighthFromStabilityItem[];
  threePartsOfLife: ThreePartsOfLifeAnalysis;
  materialSpiritualNature: MaterialSpiritualNatureAnalysis;
  misfortuneYears: MisfortuneYearsAnalysis;
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

// Acharya Varahamihira (Brihat Jataka / Phaladeepika) Variant Rules:
// Mars gives to Venus in the 5th house instead of the 4th house.
const BRIHAT_JATAKA_BAV_RULES: Record<string, Record<string, number[]>> = {
  ...PARASHARI_BAV_RULES,
  Venus: {
    ...PARASHARI_BAV_RULES.Venus,
    Mars: [3, 5, 6, 9, 11, 12]
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

const RASHI_NAMES_GU = [
  'મેષ', 'વૃષભ', 'મિથુન', 'કર્ક',
  'સિંહ', 'કન્યા', 'તુલા', 'વૃશ્ચિક',
  'ધન', 'મકર', 'કુંભ', 'મીન'
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
export function calculateSarvashtakavarga(
  kundali: KundaliResult,
  tradition: SAVTradition = 'BPHS'
): SarvashtakavargaResult {
  const lagnaRashi = kundali.lagnaRashiIndex;
  const ruleset = tradition === 'BRIHAT_JATAKA' ? BRIHAT_JATAKA_BAV_RULES : PARASHARI_BAV_RULES;

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
    const planetRules = ruleset[planet];

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

  // 1. Purushartha Trikonas & Directional Vector
  const dharmaPoints = houses[0].points + houses[4].points + houses[8].points; // 1, 5, 9
  const arthaPoints = houses[1].points + houses[5].points + houses[9].points; // 2, 6, 10
  const kamaPoints = houses[2].points + houses[6].points + houses[10].points; // 3, 7, 11
  const mokshaPoints = houses[3].points + houses[7].points + houses[11].points; // 4, 8, 12

  const purusharthaTrikonas: PurusharthaTrikonaItem[] = [
    {
      id: 'DHARMA',
      nameEn: 'Dharma Trikona (Self & Ethics)',
      nameHi: 'धर्म त्रिकोण (आदर्श, विवेक व भाग्य)',
      nameGu: 'ધર્મ ત્રિકોણ (આદર્શ, વિવેક અને ભાગ્ય)',
      houses: [1, 5, 9],
      elementEn: 'Fire',
      elementHi: 'अग्नि तत्व',
      elementGu: 'અગ્નિ તત્વ',
      directionEn: 'East',
      directionHi: 'पूर्व',
      directionGu: 'પૂર્વ',
      points: dharmaPoints,
      benchmark: 84,
      diffFromBenchmark: dharmaPoints - 84,
      percentage: Math.round((dharmaPoints / 337) * 1000) / 10,
      status: dharmaPoints >= 88 ? 'DOMINANT' : dharmaPoints >= 80 ? 'BALANCED' : 'DEFICIENT',
      descriptionEn: dharmaPoints >= 84
        ? `Robust moral compass, intuitive intellect, and protective Purva Punya (+${dharmaPoints - 84} pts vs benchmark).`
        : `Requires deliberate ethical grounding and active cultivation of spiritual mentorship (${dharmaPoints} pts).`,
      descriptionHi: dharmaPoints >= 84
        ? `उच्च नैतिक बल, दूरदर्शी बुद्धि और पूर्व-पुण्य का स्वाभाविक संरक्षण (मानक से +${dharmaPoints - 84} अंक अधिक)।`
        : `आदर्शों, विवेक और आध्यात्मिक मार्गदर्शन को सचेत रूप से सुदृढ़ करने की आवश्यकता (${dharmaPoints} अंक)।`,
      descriptionGu: dharmaPoints >= 84
        ? `ઉચ્ચ નૈતિક બળ, દીર્ઘદ્રષ્ટિ અને પૂર્વ પુણ્યનું કુદરતી રક્ષણ (માનકથી +${dharmaPoints - 84} અંક વધુ).`
        : `વિવેક અને આધ્યાત્મિક માર્ગદર્શનને સજાગતાથી મજબૂત કરવાની જરૂર (${dharmaPoints} અંક).`
    },
    {
      id: 'ARTHA',
      nameEn: 'Artha Trikona (Wealth & Career)',
      nameHi: 'अर्थ त्रिकोण (धन, कर्म व साधन)',
      nameGu: 'અર્થ ત્રિકોણ (ધન, કર્મ અને સાધન)',
      houses: [2, 6, 10],
      elementEn: 'Earth',
      elementHi: 'पृथ्वी तत्व',
      elementGu: 'પૃથ્વી તત્વ',
      directionEn: 'South',
      directionHi: 'दक्षिण',
      directionGu: 'દક્ષિણ',
      points: arthaPoints,
      benchmark: 84,
      diffFromBenchmark: arthaPoints - 84,
      percentage: Math.round((arthaPoints / 337) * 1000) / 10,
      status: arthaPoints >= 88 ? 'DOMINANT' : arthaPoints >= 80 ? 'BALANCED' : 'DEFICIENT',
      descriptionEn: arthaPoints >= 84
        ? `High economic efficiency, disciplined enterprise, and sustained professional stamina (+${arthaPoints - 84} pts).`
        : `Financial consolidation requires systematic effort, budget automation, and resilience (${arthaPoints} pts).`,
      descriptionHi: arthaPoints >= 84
        ? `प्रबल आर्थिक क्षमता, व्यावहारिक कार्यशैली और सतत व्यावसायिक स्थिरता (मानक से +${arthaPoints - 84} अंक अधिक)।`
        : `वित्तीय संचय व व्यावसायिक स्थायित्व के लिए सुनियोजित बजट और निरंतर अनुशासन जरूरी (${arthaPoints} अंक)।`,
      descriptionGu: arthaPoints >= 84
        ? `પ્રબળ આર્થિક ક્ષમતા અને સતત વ્યાવસાયિક સ્થિરતા (માનકથી +${arthaPoints - 84} અંક વધુ).`
        : `નાણાકીય બચત અને વ્યાવસાયિક સ્થિરતા માટે આયોજનબદ્ધ શિસ્ત જરૂરી (${arthaPoints} અંક).`
    },
    {
      id: 'KAMA',
      nameEn: 'Kama Trikona (Desire & Network)',
      nameHi: 'काम त्रिकोण (आकांक्षा, संबंध व लाभ)',
      nameGu: 'કામ ત્રિકોણ (આકાંક્ષા, સંબંધ અને લાભ)',
      houses: [3, 7, 11],
      elementEn: 'Air',
      elementHi: 'वायु तत्व',
      elementGu: 'વાયુ તત્વ',
      directionEn: 'West',
      directionHi: 'पश्चिम',
      directionGu: 'પશ્ચિમ',
      points: kamaPoints,
      benchmark: 84,
      diffFromBenchmark: kamaPoints - 84,
      percentage: Math.round((kamaPoints / 337) * 1000) / 10,
      status: kamaPoints >= 88 ? 'DOMINANT' : kamaPoints >= 80 ? 'BALANCED' : 'DEFICIENT',
      descriptionEn: kamaPoints >= 84
        ? `Strong social influence, entrepreneurial courage, and fruitful relationship monetization (+${kamaPoints - 84} pts).`
        : `Partnerships and commercial ambitions require structured negotiations and patient nurturing (${kamaPoints} pts).`,
      descriptionHi: kamaPoints >= 84
        ? `सशक्त सामाजिक प्रभाव, व्यावसायिक साहस और संपर्कों से प्रचुर लाभ (मानक से +${kamaPoints - 84} अंक अधिक)।`
        : `साझेदारी और महत्वाकांक्षाओं में धैर्यपूर्वक अनुबंध और संबंधों को समय देने की आवश्यकता (${kamaPoints} अंक)।`,
      descriptionGu: kamaPoints >= 84
        ? `મજબૂત સામાજિક પ્રભાવ અને ભાગીદારીથી ઉત્તમ લાભ (માનકથી +${kamaPoints - 84} અંક વધુ).`
        : `સંબંધો અને આકાંક્ષાઓમાં ધીરજપૂર્વક યોજના બનાવવી જરૂરી (${kamaPoints} અંક).`
    },
    {
      id: 'MOKSHA',
      nameEn: 'Moksha Trikona (Peace & Liberation)',
      nameHi: 'मोक्ष त्रिकोण (शांति, साधना व वैराग्य)',
      nameGu: 'મોક્ષ ત્રિકોણ (શાંતિ, સાધના અને મુક્તિ)',
      houses: [4, 8, 12],
      elementEn: 'Water',
      elementHi: 'जल तत्व',
      elementGu: 'જળ તત્વ',
      directionEn: 'North',
      directionHi: 'उत्तर',
      directionGu: 'ઉત્તર',
      points: mokshaPoints,
      benchmark: 84,
      diffFromBenchmark: mokshaPoints - 84,
      percentage: Math.round((mokshaPoints / 337) * 1000) / 10,
      status: mokshaPoints >= 88 ? 'DOMINANT' : mokshaPoints >= 80 ? 'BALANCED' : 'DEFICIENT',
      descriptionEn: mokshaPoints >= 84
        ? `Deep psychological tranquility, natural intuition, restorative sleep, and peaceful later life (+${mokshaPoints - 84} pts).`
        : `Prioritize stress detox, mindfulness, quality rest, and emotional boundary setting (${mokshaPoints} pts).`,
      descriptionHi: mokshaPoints >= 84
        ? `गहरी आंतरिक शांति, तीव्र अंतर्ज्ञान, सुखद निद्रा और आध्यात्मिक संतोष (मानक से +${mokshaPoints - 84} अंक अधिक)।`
        : `तनाव मुक्ति, ध्यान और भावनात्मक सीमाओं के संरक्षण पर विशेष ध्यान देना श्रेयस्कर रहेगा (${mokshaPoints} अंक)।`,
      descriptionGu: mokshaPoints >= 84
        ? `ઊંડી આંતરિક શાંતિ, ઉત્તમ ઊંઘ અને આધ્યાત્મિક સંતોષ (માનકથી +${mokshaPoints - 84} અંક વધુ).`
        : `માનસિક શાંતિ અને નિયમિત આરામ પર ધ્યાન આપવું હિતાવહ રહેશે (${mokshaPoints} અંક).`
    }
  ];

  // 2. Spatial Directional Alignment & Astro-Cartography
  const dirScores: {
    dir: 'EAST' | 'SOUTH' | 'WEST' | 'NORTH';
    en: string;
    hi: string;
    gu: string;
    pts: number;
    trineEn: string;
    trineHi: string;
  }[] = [
    { dir: 'EAST', en: 'East', hi: 'पूर्व', gu: 'પૂર્વ', pts: dharmaPoints, trineEn: 'Dharma', trineHi: 'धर्म' },
    { dir: 'SOUTH', en: 'South', hi: 'दक्षिण', gu: 'દક્ષિણ', pts: arthaPoints, trineEn: 'Artha', trineHi: 'अर्थ' },
    { dir: 'WEST', en: 'West', hi: 'पश्चिम', gu: 'પશ્ચિમ', pts: kamaPoints, trineEn: 'Kama', trineHi: 'काम' },
    { dir: 'NORTH', en: 'North', hi: 'उत्तर', gu: 'ઉત્તર', pts: mokshaPoints, trineEn: 'Moksha', trineHi: 'मोक्ष' }
  ];

  const sortedDirs = [...dirScores].sort((a, b) => b.pts - a.pts);
  const bestDir = sortedDirs[0];
  const vulnerableDir = sortedDirs[sortedDirs.length - 1];

  const directionalRelocation: DirectionalRelocationAnalysis = {
    eastPoints: dharmaPoints,
    southPoints: arthaPoints,
    westPoints: kamaPoints,
    northPoints: mokshaPoints,
    bestDirection: bestDir.dir,
    bestDirectionEn: bestDir.en,
    bestDirectionHi: bestDir.hi,
    bestDirectionGu: bestDir.gu,
    vulnerableDirection: vulnerableDir.dir,
    vulnerableDirectionEn: vulnerableDir.en,
    vulnerableDirectionHi: vulnerableDir.hi,
    vulnerableDirectionGu: vulnerableDir.gu,
    citySectorRecommendationEn: `Your ${bestDir.en} direction is the most fruitful for you. Whichever place you choose to work, establish a business, or reside in your life—choosing the ${bestDir.en} sector of your chosen/staying/working city will be exceptionally beneficial, prosperous, and smooth for you.`,
    citySectorRecommendationHi: `आपके लिए ${bestDir.hi} दिशा सर्वाधिक फलदायी और शुभ है। आप अपने जीवन में जिस भी शहर में काम, व्यवसाय या निवास चुनते हैं—उस शहर के ${bestDir.hi} क्षेत्र (${bestDir.en} Sector) को चुनना आपके लिए अत्यंत लाभकारी, समृद्ध और निर्बाध सफलता प्रदान करने वाला रहेगा।`,
    citySectorRecommendationGu: `તમારા માટે ${bestDir.gu} દિશા સૌથી વધુ ફળદાયી અને શુભ છે. તમે તમારા જીવનમાં જે પણ શહેરમાં કામ, વ્યવસાય કે રહેવાનું પસંદ કરો છો—તે શહેરના ${bestDir.gu} ભાગ (${bestDir.en} Sector) ને પસંદ કરવો તમારા માટે અત્યંત લાભદાયી, સમૃદ્ધ અને અતિ ઉત્તમ રહેશે.`,
    vastuRecommendationEn: `Position your primary work desk and bed in the ${bestDir.en} quadrant, face ${bestDir.en} during strategic work or study, and avoid key contracts or investments aligned strictly towards ${vulnerableDir.en} (${vulnerableDir.pts} pts).`,
    vastuRecommendationHi: `कार्य या अध्ययन के समय अपना मुख ${bestDir.hi} की ओर रखें, अपने निवास या कार्यालय में प्रमुख केबिन ${bestDir.hi} भाग में बनाएं, तथा ${vulnerableDir.hi} दिशा (${vulnerableDir.pts} अंक) में महत्वपूर्ण वित्तीय निर्णयों से बचें।`,
    vastuRecommendationGu: `કાર્ય કે અભ્યાસ કરતી વખતે મુખ ${bestDir.gu} તરફ રાખો, અને ઓફિસ/ઘરમાં મુખ્ય બેઠક ${bestDir.gu} ભાગમાં રાખો.`
  };

  // 3. Sade Sati SAV Stress-Test via Natal Moon
  const moonRashi = planetRashiMap.Moon;
  const moonHouseNum = ((moonRashi - lagnaRashi + 12) % 12) + 1;

  const phase1Rashi = (moonRashi + 11) % 12;
  const phase1House = ((moonHouseNum - 2 + 12) % 12) + 1;
  const phase1Sav = savBySign[phase1Rashi];
  const phase1SaturnBav = bav['Saturn'] ? bav['Saturn'][phase1Rashi] : 4;

  const phase2Rashi = moonRashi;
  const phase2House = moonHouseNum;
  const phase2Sav = savBySign[phase2Rashi];
  const phase2SaturnBav = bav['Saturn'] ? bav['Saturn'][phase2Rashi] : 4;

  const phase3Rashi = (moonRashi + 1) % 12;
  const phase3House = (moonHouseNum % 12) + 1;
  const phase3Sav = savBySign[phase3Rashi];
  const phase3SaturnBav = bav['Saturn'] ? bav['Saturn'][phase3Rashi] : 4;

  const total3SignPoints = phase1Sav + phase2Sav + phase3Sav;

  let ssClassification: 'CONSTRUCTIVE_ELEVATION' | 'MODERATE_PROGRESS' | 'HIGH_FRICTION_RESTRUCTURING' = 'MODERATE_PROGRESS';
  let ssTitleEn = 'Moderate & Productive Transit';
  let ssTitleHi = 'संतुलित एवं श्रमसाध्य साढ़ेसाती';
  let ssTitleGu = 'સંતુલિત અને પરિશ્રમજન્ય સાડાસાતી';
  let ssDescEn = `The 3 signs around your Moon hold ${total3SignPoints} points (Benchmark: 84). Saturn requires disciplined routines, but normal efforts yield consistent progress without acute crises.`;
  let ssDescHi = `चंद्रमा के तीनों भावों का कुल योग ${total3SignPoints} बिंदु है (मानक: 84)। शनि आपसे नियमित अनुशासन की अपेक्षा करते हैं, पर सामान्य प्रयास से काम में निरंतर प्रगति बनी रहती है।`;
  let ssDescGu = `ચંદ્રના ત્રણ ભાવોનો સરવાળો ${total3SignPoints} બિંદુ છે (માનક: 84). શનિ શિસ્તની અપેક્ષા રાખે છે અને સામાન્ય પ્રયાસોથી પ્રગતિ શક્ય બને છે.`;

  if (total3SignPoints >= 88) {
    ssClassification = 'CONSTRUCTIVE_ELEVATION';
    ssTitleEn = 'Constructive Elevation & Asset Growth (Fortified)';
    ssTitleHi = 'कल्याणकारी व पदोन्नति प्रदाता साढ़ेसाती (सुरक्षित)';
    ssTitleGu = 'કલ્યાણકારી અને પદોન્નતિ આપનાર સાડાસાતી';
    ssDescEn = `Exceptional 3-sign score of ${total3SignPoints} points (>>84 benchmark). Saturn acts as a constructive builder—bringing institutional leadership, durable property acquisition, and public maturity rather than hardships.`;
    ssDescHi = `चंद्रमा के तीनों भावों का कुल योग ${total3SignPoints} अंक अत्यंत श्रेष्ठ है (मानक 84 से बहुत अधिक)। शनि यहाँ कष्ट देने के बजाय प्रशासनिक सम्मान, स्थायी संपत्ति और अधिकार प्रदान करते हैं।`;
    ssDescGu = `ચંદ્રના ત્રણ ભાવોનો સરવાળો ${total3SignPoints} અંક અત્યંત શ્રેષ્ઠ છે. શનિ અહીં કષ્ટને બદલે વહીવટી સન્માન અને સ્થાયી સંપત્તિ આપે છે.`;
  } else if (total3SignPoints <= 77 || phase1Sav <= 22 || phase2Sav <= 22 || phase3Sav <= 22) {
    ssClassification = 'HIGH_FRICTION_RESTRUCTURING';
    ssTitleEn = 'Vulnerable Stress-Test (Restructuring Phase)';
    ssTitleHi = 'संवेदनशील व सतर्कता योग्य साढ़ेसाती';
    ssTitleGu = 'સંવેદનશીલ અને સાવધાની રાખવા જેવી સાડાસાતી';
    ssDescEn = `Score of ${total3SignPoints} points (<80 baseline) or specific sign deficiency. Saturn demands defensive pacing, health vigilance, debt avoidance, and spiritual remedies to buffer against acute stress.`;
    ssDescHi = `कुल योग ${total3SignPoints} अंक (मानक 84 से कम) या किसी भाव में कमी है। शनि के इस गोचर में स्वास्थ्य, कर्ज से बचाव और धैर्यवान रक्षात्मक नीति अपनाना अत्यंत अनिवार्य है।`;
    ssDescGu = `સરવાળો ${total3SignPoints} અંક ઓછો છે. શનિના આ ગોચરમાં સ્વાસ્થ્ય અને ધીરજ રાખવી અનિવાર્ય છે.`;
  }

  const sadeSatiAnalysis: SadeSatiSAVAnalysis = {
    moonHouse: moonHouseNum,
    moonRashiIndex: moonRashi,
    moonRashiNameEn: RASHI_NAMES_EN[moonRashi],
    moonRashiNameHi: RASHI_NAMES_HI[moonRashi],
    moonRashiNameGu: RASHI_NAMES_GU[moonRashi],
    phases: [
      {
        phaseNumber: 1,
        titleEn: 'Rising Phase (1st Dhaiya - 12th from Moon)',
        titleHi: 'उदय चरण (प्रथम ढैय्या - चंद्र से 12वां भाव)',
        titleGu: 'પ્રથમ ઢૈય્યા (ચંદ્રથી 12મો ભાવ)',
        relativeHouseEn: '12th from Moon',
        relativeHouseHi: 'चंद्र से 12वां',
        houseNumber: phase1House,
        rashiIndex: phase1Rashi,
        rashiNameEn: RASHI_NAMES_EN[phase1Rashi],
        rashiNameHi: RASHI_NAMES_HI[phase1Rashi],
        rashiNameGu: RASHI_NAMES_GU[phase1Rashi],
        savPoints: phase1Sav,
        saturnBavPoints: phase1SaturnBav,
        statusEn: phase1Sav >= 30 ? 'Protected' : phase1Sav >= 25 ? 'Moderate' : 'High Friction',
        statusHi: phase1Sav >= 30 ? 'श्रेष्ठ / सुरक्षित' : phase1Sav >= 25 ? 'मध्यम' : 'कठिन / सतर्क',
        isVulnerable: phase1Sav <= 22 || phase1SaturnBav <= 2
      },
      {
        phaseNumber: 2,
        titleEn: 'Peak Phase (2nd Dhaiya - Moon Sign / 1st House)',
        titleHi: 'शिखर चरण (द्वितीय ढैय्या - जन्म चंद्र राशि)',
        titleGu: 'દ્વિતીય ઢૈય્યા (જન્મ ચંદ્ર રાશિ)',
        relativeHouseEn: '1st (Natal Moon)',
        relativeHouseHi: 'जन्म चंद्र राशि',
        houseNumber: phase2House,
        rashiIndex: phase2Rashi,
        rashiNameEn: RASHI_NAMES_EN[phase2Rashi],
        rashiNameHi: RASHI_NAMES_HI[phase2Rashi],
        rashiNameGu: RASHI_NAMES_GU[phase2Rashi],
        savPoints: phase2Sav,
        saturnBavPoints: phase2SaturnBav,
        statusEn: phase2Sav >= 30 ? 'Protected' : phase2Sav >= 25 ? 'Moderate' : 'High Friction',
        statusHi: phase2Sav >= 30 ? 'श्रेष्ठ / सुरक्षित' : phase2Sav >= 25 ? 'मध्यम' : 'कठिन / सतर्क',
        isVulnerable: phase2Sav <= 22 || phase2SaturnBav <= 2
      },
      {
        phaseNumber: 3,
        titleEn: 'Setting Phase (3rd Dhaiya - 2nd from Moon)',
        titleHi: 'अस्त चरण (तृतीय ढैय्या - चंद्र से 2रा भाव)',
        titleGu: 'તૃતીય ઢૈય્યા (ચંદ્રથી 2જો ભાવ)',
        relativeHouseEn: '2nd from Moon',
        relativeHouseHi: 'चंद्र से 2रा',
        houseNumber: phase3House,
        rashiIndex: phase3Rashi,
        rashiNameEn: RASHI_NAMES_EN[phase3Rashi],
        rashiNameHi: RASHI_NAMES_HI[phase3Rashi],
        rashiNameGu: RASHI_NAMES_GU[phase3Rashi],
        savPoints: phase3Sav,
        saturnBavPoints: phase3SaturnBav,
        statusEn: phase3Sav >= 30 ? 'Protected' : phase3Sav >= 25 ? 'Moderate' : 'High Friction',
        statusHi: phase3Sav >= 30 ? 'श्रेष्ठ / सुरक्षित' : phase3Sav >= 25 ? 'मध्यम' : 'कठिन / सतर्क',
        isVulnerable: phase3Sav <= 22 || phase3SaturnBav <= 2
      }
    ],
    total3SignPoints,
    benchmark: 84,
    classification: ssClassification,
    titleEn: ssTitleEn,
    titleHi: ssTitleHi,
    titleGu: ssTitleGu,
    descriptionEn: ssDescEn,
    descriptionHi: ssDescHi,
    descriptionGu: ssDescGu
  };

  // 4. Life Verticals & Structural Ratios
  const h1Pts = houses[0].points;
  const h4Pts = houses[3].points;
  const h5Pts = houses[4].points;
  const h7Pts = houses[6].points;
  const h9Pts = houses[8].points;

  // 4A. Job vs Business (6th vs 10th)
  let jvbVerdict: 'EMPLOYMENT_PREFERRED' | 'BUSINESS_PREFERRED' | 'HYBRID_CAPABLE' = 'HYBRID_CAPABLE';
  let jvbTitleEn = 'Versatile Hybrid Potential';
  let jvbTitleHi = 'नौकरी एवं स्वतंत्र उद्यम में समान सामर्थ्य';
  let jvbTitleGu = 'નોકરી અને વ્યવસાયમાં સમાન ક્ષમતા';
  let jvbDescEn = `Both 6th House (${h6Pts} pts) and 10th House (${h10Pts} pts) have equal bindu capacity. You can thrive in corporate leadership as well as independent consulting.`;
  let jvbDescHi = `आपके 6ठे भाव (${h6Pts} अंक) और 10वें भाव (${h10Pts} अंक) दोनों में समान बिंदु हैं। आप संस्थागत सेवा और स्वतंत्र परामर्श दोनों में सफल हो सकते हैं।`;
  let jvbDescGu = `તમારા 6ઠા અને 10મા ભાવ બંનેમાં સમાન બિંદુ છે. તમે બંને ક્ષેત્રોમાં સફળ થઈ શકો છો.`;

  if (h6Pts > h10Pts) {
    jvbVerdict = 'EMPLOYMENT_PREFERRED';
    jvbTitleEn = 'Corporate Employment & Service Excellence';
    jvbTitleHi = 'संस्थागत सेवा, नौकरी व प्रतियोगिता में श्रेष्ठ';
    jvbTitleGu = 'નોકરી અને સ્પર્ધાત્મક ક્ષેત્રે શ્રેષ્ઠ';
    jvbDescEn = `6th House of service & competitive execution (${h6Pts} pts) surpasses 10th House (${h10Pts} pts). You excel when backed by an institutional infrastructure, corporate ladder, or structured organization.`;
    jvbDescHi = `सेवा व प्रतियोगिता का 6ठा भाव (${h6Pts} अंक) 10वें भाव (${h10Pts} अंक) से अधिक है। किसी बड़ी कंपनी, सरकारी सेवा या संगठित तंत्र में कार्य करना आपके लिए अधिक फलदायी रहेगा।`;
    jvbDescGu = `સેવા અને નોકરીનો 6ઠ્ઠો ભાવ 10મા ભાવ કરતાં વધારે છે. મોટી સંસ્થામાં કામ કરવું વધુ ફળદાયી રહેશે.`;
  } else if (h10Pts > h6Pts) {
    jvbVerdict = 'BUSINESS_PREFERRED';
    jvbTitleEn = 'Independent Business & Executive Leadership';
    jvbTitleHi = 'स्वतंत्र व्यवसाय, उद्यमिता व नेतृत्व में श्रेष्ठ';
    jvbTitleGu = 'સ્વતંત્ર વ્યવસાય અને નેતૃત્વમાં શ્રેષ્ઠ';
    jvbDescEn = `10th House of status & autonomous initiative (${h10Pts} pts) exceeds 6th House (${h6Pts} pts). You possess high capacity for independent entrepreneurship, direct decision-making, and executive authority.`;
    jvbDescHi = `कर्म व स्वायत्त निर्णय का 10वां भाव (${h10Pts} अंक) 6ठे भाव (${h6Pts} अंक) से बड़ा है। आपका सामर्थ्य स्वयं के व्यवसाय, निर्णय लेने और स्वतंत्र नेतृत्व में सर्वाधिक खिलता है।`;
    jvbDescGu = `10મો ભાવ 6ઠા ભાવ કરતાં મોટો છે. સ્વતંત્ર વ્યવસાય અને નિર્ણય લેવાની ક્ષમતા તમારામાં ઉત્તમ છે.`;
  }

  // 4B. Execution vs Luck (10th vs 9th)
  let evlVerdict: 'SELF_EFFORT_DRIVEN' | 'LUCK_SUPPORTED' | 'BALANCED' = 'BALANCED';
  let evlTitleEn = 'Harmonious Karma-Bhagya Alignment';
  let evlTitleHi = 'कर्म और भाग्य का संतुलित योग';
  let evlTitleGu = 'કર્મ અને ભાગ્યનો સંતુલિત યોગ';
  let evlDescEn = `Balanced interplay between 10th House (${h10Pts} pts) and 9th House (${h9Pts} pts). Your diligent execution is met with timely divine luck.`;
  let evlDescHi = `10वें भाव (${h10Pts} अंक) और 9वें भाव (${h9Pts} अंक) में संतुलन है। आपके कठिन परिश्रम को समय पर ईश्वरीय कृपा व भाग्य का सहयोग मिलता है।`;
  let evlDescGu = `10મા અને 9મા ભાવ વચ્ચે સંતુલન છે. તમારા પરિશ્રમને ભાગ્યનો સાથ મળશે.`;

  if (h10Pts > h9Pts) {
    evlVerdict = 'SELF_EFFORT_DRIVEN';
    evlTitleEn = 'Self-Execution Driven Success (Purushartha)';
    evlTitleHi = 'स्व-प्रयास व उद्यम-आधारित सफलता (कर्म प्रधान)';
    evlTitleGu = 'સ્વ-પ્રયાસ આધારિત સફળતા';
    evlDescEn = `10th House (${h10Pts} pts) exceeds 9th House of fortune (${h9Pts} pts). You achieve success through proactive execution and discipline rather than passive reliance on chance.`;
    evlDescHi = `कर्म का 10वां भाव (${h10Pts} अंक) भाग्य के 9वें भाव (${h9Pts} अंक) से बड़ा है। आपकी सफलता केवल भाग्य के भरोसे नहीं, बल्कि आपकी निरंतर सक्रियता और कार्यकुशलता से निर्मित होती है।`;
    evlDescGu = `10મો ભાવ 9મા ભાવથી મોટો છે. સફળતા તમારા પોતાના પરિશ્રમથી જ મળશે.`;
  } else if (h9Pts > h10Pts + 2) {
    evlVerdict = 'LUCK_SUPPORTED';
    evlTitleEn = 'Providential Luck & Divine Grace';
    evlTitleHi = 'प्रबल भाग्य व दैवीय अनुग्रह';
    evlTitleGu = 'પ્રબળ ભાગ્ય અને ઈશ્વરીય કૃપા';
    evlDescEn = `9th House of fortune (${h9Pts} pts) notably exceeds 10th House (${h10Pts} pts). Doors open effortlessly through fortuitous timing; ensure consistent daily execution to capitalize on luck.`;
    evlDescHi = `भाग्य का 9वां भाव (${h9Pts} अंक) 10वें भाव (${h10Pts} अंक) से अधिक है। आपको अनुकूल अवसर अनायास प्राप्त होते हैं; इन अवसरों को स्थायी बनाने के लिए नियमित कर्मठता बनाए रखें।`;
    evlDescGu = `ભાગ્યનો 9મો ભાવ વધારે છે. તમને સારા અવસરો આપોઆપ મળશે.`;
  }

  // 4C. Lifelong Wealth Lock (2nd >= 31 and 11th >= 31)
  const isWealthLocked = h2Pts >= 31 && h11Pts >= 31;
  const wealthLock = {
    h2Points: h2Pts,
    h11Points: h11Pts,
    isLocked: isWealthLocked,
    titleEn: isWealthLocked ? 'Lifelong Wealth Lock (Akhanda Dhana Yoga)' : 'Wealth Building in Progress',
    titleHi: isWealthLocked ? 'अखंड धन संचय योग (सुरक्षित समृद्धि)' : 'प्रगतिशील धन संचय',
    titleGu: isWealthLocked ? 'અખંડ ધન સંચય યોગ' : 'ધન સંચય પ્રગતિમાં છે',
    descriptionEn: isWealthLocked
      ? `Both 2nd House (${h2Pts} pts) and 11th House (${h11Pts} pts) meet the classical 31+ threshold. Enduring lifelong wealth accumulation, asset retention, and commercial expansion are structurally assured.`
      : `2nd House (${h2Pts} pts) and 11th House (${h11Pts} pts). Wealth generation is active; focus on asset retention to build long-term multi-generational wealth.`,
    descriptionHi: isWealthLocked
      ? `दूसरे भाव (${h2Pts} अंक) और 11वें भाव (${h11Pts} अंक) दोनों 31 अंक से अधिक हैं! यह शास्त्रीय अखंड धन योग है, जो जीवनपर्यंत स्थायी संपत्ति, बचत और निरंतर धन आगमन की गारंटी देता है।`
      : `धन का 2रा भाव (${h2Pts} अंक) और लाभ का 11वां भाव (${h11Pts} अंक)। नियमित आय को दीर्घकालिक स्थायी निवेश में परिवर्तित करने पर ध्यान केंद्रित करें।`,
    descriptionGu: isWealthLocked
      ? `2જા અને 11મા બંને ભાવોમાં 31થી વધુ અંક છે. આ અખંડ ધન સંચય યોગ છે.`
      : `આવકને સ્થાયી સંપત્તિમાં રોકાણ કરવા પર ધ્યાન આપો.`
  };

  // 4D. Marriage & Relationship Agency (1st vs 7th, 7th range, and 2nd vs 7th transactional check)
  const h7RangeStatus: 'HEALTHY' | 'INSTABILITY_RISK' | 'OVER_EXPANDED' =
    h7Pts < 22 ? 'INSTABILITY_RISK' : h7Pts <= 30 ? 'HEALTHY' : 'OVER_EXPANDED';
  const isTransactionalWarning = (h2Pts - h7Pts >= 8);
  let relAgency: 'SELF_AUTONOMY' | 'PARTNER_DOMINANT' | 'EQUAL_PARTNERSHIP' = 'EQUAL_PARTNERSHIP';
  let mrgTitleEn = 'Equal & Harmonious Partnership';
  let mrgTitleHi = 'समान एवं संतुलित वैवाहिक साझेदारी';
  let mrgTitleGu = 'સમાન અને સંતુલિત દાંપત્ય જીવન';
  let mrgDescEn = `Healthy equilibrium between 1st House (${h1Pts} pts) and 7th House (${h7Pts} pts). Mutual respect and co-equal decision making prevail.`;
  let mrgDescHi = `प्रथम भाव (${h1Pts} अंक) और सप्तम भाव (${h7Pts} अंक) में सुंदर संतुलन है। आपसी सम्मान और मिलकर निर्णय लेने की प्रवृत्ति बनी रहती है।`;
  let mrgDescGu = `પ્રથમ અને સાતમા ભાવ વચ્ચે ઉત્તમ સંતુલન છે. પરસ્પર આદર જળવાઈ રહેશે.`;

  if (h7Pts - h1Pts >= 5) {
    relAgency = 'PARTNER_DOMINANT';
    mrgTitleEn = 'Partner Dominance Dynamics';
    mrgTitleHi = 'जीवनसाथी / साझेदार का प्रभावी प्रभाव';
    mrgTitleGu = 'જીવનસાથીનો વિશેષ પ્રભાવ';
    mrgDescEn = `7th House (${h7Pts} pts) exceeds 1st House (${h1Pts} pts) by 5+ points. Your spouse or business partner naturally wields stronger sway in negotiations; maintain clear personal boundaries.`;
    mrgDescHi = `7वां भाव (${h7Pts} अंक) लग्न (${h1Pts} अंक) से 5 या अधिक अंक बड़ा है। जीवनसाथी या व्यापारिक साझेदार का प्रभाव अधिक रहता है; व्यक्तिगत स्वतंत्रता और सौहार्दपूर्ण संवाद बनाए रखें।`;
    mrgDescGu = `સાતમો ભાવ લગ્ન ભાવ કરતાં મોટો હોવાથી જીવનસાથીનો પ્રભાવ વધુ રહેશે.`;
  } else if (h1Pts > h7Pts) {
    relAgency = 'SELF_AUTONOMY';
    mrgTitleEn = 'Personal Autonomy in Relationships';
    mrgTitleHi = 'संबंधों में स्वायत्तता एवं आत्म-नियंत्रण';
    mrgTitleGu = 'સંબંધોમાં આત્મનિર્ભરતા';
    mrgDescEn = `1st House (${h1Pts} pts) exceeds 7th House (${h7Pts} pts). You retain personal agency and leadership within marriage; practice active listening to nurture emotional closeness.`;
    mrgDescHi = `लग्न भाव (${h1Pts} अंक) सप्तम भाव (${h7Pts} अंक) से बड़ा है। वैवाहिक जीवन में आपका निर्णय व नेतृत्व प्रमुख रहता है; परस्पर संवेदनशीलता बनाए रखना शुभ रहेगा।`;
    mrgDescGu = `લગ્ન ભાવ સાતમા ભાવ કરતાં મોટો હોવાથી તમારો નિર્ણય પ્રમુખ રહેશે.`;
  }

  if (isTransactionalWarning) {
    mrgDescEn += ` Note: 2nd House (${h2Pts} pts) heavily exceeds 7th House (${h7Pts} pts) by ≥8 points—avoid overly transactional or material expectations in romantic/marital matters.`;
    mrgDescHi += ` सतर्कता: धन भाव (${h2Pts} अंक) सप्तम भाव (${h7Pts} अंक) से 8+ अंक अधिक होने से वैवाहिक रिश्तों में अत्यधिक आर्थिक अपेक्षाओं या हिसाब-किताब से बचना चाहिए।`;
  }

  const marriageAgency = {
    h1Points: h1Pts,
    h7Points: h7Pts,
    h2Points: h2Pts,
    h7RangeStatus,
    relationalAgency: relAgency,
    isTransactionalWarning,
    titleEn: mrgTitleEn,
    titleHi: mrgTitleHi,
    titleGu: mrgTitleGu,
    descriptionEn: mrgDescEn,
    descriptionHi: mrgDescHi,
    descriptionGu: mrgDescGu
  };

  // 4E. Domestic Peace & Triple Crown Yoga (4th, 5th, 6th >= 31)
  const hasDomesticPeace = h4Pts >= 28 && h4Pts > h12Pts;
  const hasTripleCrown = h4Pts >= 31 && h5Pts >= 31 && h6Pts >= 31;
  const domesticAndYogas = {
    h4Points: h4Pts,
    h5Points: h5Pts,
    h6Points: h6Pts,
    h12Points: h12Pts,
    hasDomesticPeace,
    hasTripleCrownYoga: hasTripleCrown,
    titleEn: hasTripleCrown ? 'Triple Fortified Raj Yoga (Houses 4-5-6 ≥ 31)' : hasDomesticPeace ? 'Fortified Domestic Peace & Property' : 'Dynamic Domestic Focus',
    titleHi: hasTripleCrown ? 'त्रिविध राजयोग (भाव 4, 5, 6 में 31+ अंक)' : hasDomesticPeace ? 'गृह सुख, वाहन व आंतरिक शांति' : 'पारिवारिक संतुलन की आवश्यकता',
    titleGu: hasTripleCrown ? 'ત્રિવિધ રાજયોગ (4, 5, 6 ભાવોમાં 31+ અંક)' : hasDomesticPeace ? 'ગૃહ સુખ અને સંપત્તિ' : 'કૌટુંબિક સંતુલનની જરૂર',
    descriptionEn: hasTripleCrown
      ? `Rare classical configuration: Houses 4 (${h4Pts} pts), 5 (${h5Pts} pts), and 6 (${h6Pts} pts) simultaneously exceed 31 points. Associated with public acclaim, administrative honors, and institutional recognition.`
      : hasDomesticPeace
      ? `4th House (${h4Pts} pts) exceeds 28 baseline and surpasses 12th House of expenditure (${h12Pts} pts), blessing you with solid property acquisition, maternal blessings, and mental peace.`
      : `4th House has ${h4Pts} points. Prioritize emotional stability, peaceful domestic environment, and mindful property acquisitions.`,
    descriptionHi: hasTripleCrown
      ? `दुर्लभ शास्त्रीय योग: 4थे (${h4Pts} अंक), 5वें (${h5Pts} अंक) और 6ठे भाव (${h6Pts} अंक) तीनों में 31 से अधिक बिंदु हैं! यह सामाजिक मान-सम्मान, राजकीय पुरस्कार और व्यापक प्रतिष्ठा प्रदान करता है।`
      : hasDomesticPeace
      ? `4था भाव (${h4Pts} अंक) 28 के मानक से अधिक है और 12वें भाव (${h12Pts} अंक) से बड़ा है। यह भूमि, वाहन सुख, मातृ सुख और मानसिक शांति का स्पष्ट संकेत है।`
      : `4थे भाव में ${h4Pts} बिंदु हैं। घर के वातावरण को शांत रखने और भावनात्मक संतुलन पर ध्यान देना हितकर रहेगा।`,
    descriptionGu: hasTripleCrown
      ? `દુર્લભ શાસ્ત્રીય રાજયોગ: 4, 5 અને 6 ત્રણેય ભાવોમાં 31થી વધુ અંક છે. આ સામાજિક માન-સન્માન અને પ્રતિષ્ઠા અપાવે છે.`
      : hasDomesticPeace
      ? `4થો ભાવ (${h4Pts} અંક) શ્રેષ્ઠ છે જે સુખ અને સ્થાયી સંપત્તિ દર્શાવે છે.`
      : `માનસિક શાંતિ જાળવી રાખવી જરૂરી છે.`
  };

  const lifeVerticals: LifeVerticalsAnalysis = {
    jobVsBusiness: {
      h6Points: h6Pts,
      h10Points: h10Pts,
      verdict: jvbVerdict,
      titleEn: jvbTitleEn,
      titleHi: jvbTitleHi,
      titleGu: jvbTitleGu,
      descriptionEn: jvbDescEn,
      descriptionHi: jvbDescHi,
      descriptionGu: jvbDescGu
    },
    executionVsLuck: {
      h9Points: h9Pts,
      h10Points: h10Pts,
      verdict: evlVerdict,
      titleEn: evlTitleEn,
      titleHi: evlTitleHi,
      titleGu: evlTitleGu,
      descriptionEn: evlDescEn,
      descriptionHi: evlDescHi,
      descriptionGu: evlDescGu
    },
    wealthLock,
    marriageAgency,
    domesticAndYogas
  };

  // 5. Quantum Jump Transitions (Adjacent House Differential |Delta| >= 10)
  const quantumJumps: QuantumJumpTransition[] = [];
  for (let i = 0; i < 12; i++) {
    const fromH = houses[i];
    const toH = houses[(i + 1) % 12];
    const delta = toH.points - fromH.points;

    if (delta >= 10) {
      quantumJumps.push({
        fromHouse: fromH.houseNumber,
        toHouse: toH.houseNumber,
        fromPoints: fromH.points,
        toPoints: toH.points,
        delta,
        type: 'ROCKET',
        titleEn: `Rocket Transition (House ${fromH.houseNumber} ➔ ${toH.houseNumber})`,
        titleHi: `तीव्र उत्थान संक्रमण (भाव ${fromH.houseNumber} ➔ भाव ${toH.houseNumber})`,
        titleGu: `તીવ્ર પ્રગતિ સંક્રમણ (ભાવ ${fromH.houseNumber} ➔ ભાવ ${toH.houseNumber})`,
        descriptionEn: `Steep surge of +${delta} points when planets move from House ${fromH.houseNumber} (${fromH.points} pts) into House ${toH.houseNumber} (${toH.points} pts). Transiting planets bring sudden breakthroughs, rapid expansion, and immediate relief upon entry.`,
        descriptionHi: `भाव ${fromH.houseNumber} (${fromH.points} अंक) से भाव ${toH.houseNumber} (${toH.points} अंक) में प्रवेश पर +${delta} अंकों की तीव्र वृद्धि! गोचर ग्रह जब यहाँ प्रवेश करेंगे तो अचानक सफलता, अप्रत्याशित लाभ और कार्यों में तीव्र गति मिलेगी।`,
        descriptionGu: `ભાવ ${fromH.houseNumber} થી ભાવ ${toH.houseNumber} માં પ્રવેશ પર +${delta} અંકનો ઉછાળો! ગોચર ગ્રહો અહીં અચાનક સફળતા અને પ્રગતિ આપશે.`
      });
    } else if (delta <= -10) {
      quantumJumps.push({
        fromHouse: fromH.houseNumber,
        toHouse: toH.houseNumber,
        fromPoints: fromH.points,
        toPoints: toH.points,
        delta,
        type: 'CLIFF',
        titleEn: `Cliff Transition (House ${fromH.houseNumber} ➔ ${toH.houseNumber})`,
        titleHi: `तीव्र ढलान / अवरोध संक्रमण (भाव ${fromH.houseNumber} ➔ भाव ${toH.houseNumber})`,
        titleGu: `અવરોધ સંક્રમણ (ભાવ ${fromH.houseNumber} ➔ ભાવ ${toH.houseNumber})`,
        descriptionEn: `Sharp drop of ${delta} points from House ${fromH.houseNumber} (${fromH.points} pts) down to House ${toH.houseNumber} (${toH.points} pts). The supportive environment drops abruptly upon planetary ingress; brace with defensive planning and patient pacing.`,
        descriptionHi: `भाव ${fromH.houseNumber} (${fromH.points} अंक) से भाव ${toH.houseNumber} (${toH.points} अंक) में ${Math.abs(delta)} अंकों की तीव्र गिरावट! इस भाव में गोचर ग्रह के प्रवेश पर अचानक सहयोग कम हो सकता है; धैर्य और सावधानी रखें।`,
        descriptionGu: `ભાવ ${fromH.houseNumber} થી ${toH.houseNumber} માં ${Math.abs(delta)} અંકનો ઘટાડો. સાવધાની રાખવી.`
      });
    }
  }

  // 6. 8th-From Structural Stability Audit (Bhavat Bhavam)
  const eighthFromPairs = [
    {
      refH: 1,
      refEn: '1st House (Vitality & Self)',
      refHi: 'प्रथम भाव (स्वास्थ्य व व्यक्तित्व)',
      vulnH: 8,
      vulnEn: '8th House (Chronic Crises & Accidents)',
      vulnHi: '8वां भाव (संकट व बाधाएं)',
      destabEn: 'Physical exhaustion, sudden vitality drain, or accidents',
      destabHi: 'अचानक शारीरिक कमजोरी, दुर्घटना या दीर्घकालिक स्वास्थ्य समस्या',
      recEn: 'Protect daily routine; avoid reckless physical risks if vulnerable.',
      recHi: 'नियमित दिनचर्या रखें; स्वास्थ्य के प्रति निरंतर सजग रहें।'
    },
    {
      refH: 2,
      refEn: '2nd House (Accumulated Wealth)',
      refHi: 'द्वितीय भाव (संचित धन व परिवार)',
      vulnH: 9,
      vulnEn: '9th House (Ideological & Foreign Drain)',
      vulnHi: '9वां भाव (वैचारिक व विदेशी व्यय)',
      destabEn: 'Misguided ideological donations or speculative foreign ventures',
      destabHi: 'अति-उदारता, वैचारिक दान या विदेश से जुड़े अवास्तविक निवेश',
      recEn: 'Maintain written financial audits; avoid unvetted speculative funding.',
      recHi: 'वित्तीय हिसाब-किताब लिखित रखें; बिना जांचे धन न लगाएं।'
    },
    {
      refH: 4,
      refEn: '4th House (Fixed Assets & Inner Peace)',
      refHi: 'चतुर्थ भाव (गृह सुख, वाहन व शांति)',
      vulnH: 11,
      vulnEn: '11th House (Social Ambition Over-expansion)',
      vulnHi: '11वां भाव (अति-महत्वाकांक्षा व सामाजिक खिंचाव)',
      destabEn: 'Uncontrolled social obligations pulling focus away from home peace',
      destabHi: 'अत्यधिक सामाजिक जिम्मेदारियाँ जो घरेलू शांति को भंग कर सकती हैं',
      recEn: 'Set firm boundaries between public networking and domestic sanctuary.',
      recHi: 'सामाजिक जीवन और पारिवारिक शांति के बीच स्पष्ट संतुलन बनाएं।'
    },
    {
      refH: 7,
      refEn: '7th House (Marriage & Alliances)',
      refHi: 'सप्तम भाव (विवाह व साझेदारी)',
      vulnH: 2,
      vulnEn: '2nd House (Family & Monetary Disputes)',
      vulnHi: 'द्वितीय भाव (पारिवारिक हस्तक्षेप व धन विवाद)',
      destabEn: 'Family interference or transactional money conflicts in relationship',
      destabHi: 'पारिवारिक हस्तक्षेप या संबंधों में धन संबंधी विवाद',
      recEn: 'Keep marital discussions private; resolve financial matters transparently.',
      recHi: 'वैवाहिक निर्णयों में गोपनीयता और धन के मामलों में पारदर्शिता रखें।'
    },
    {
      refH: 10,
      refEn: '10th House (Career & Public Status)',
      refHi: 'दशम भाव (आजीविका, पद व सम्मान)',
      vulnH: 5,
      vulnEn: '5th House (Speculative Gambles & Diversions)',
      vulnHi: 'पंचम भाव (सट्टा, भावुकता व ध्यान भटकाव)',
      destabEn: 'Emotional gambles, creative diversions, or impulsive career breaks',
      destabHi: 'सट्टेबाजी, अत्यधिक भावुक निर्णय या करियर से ध्यान भटकना',
      recEn: 'Stick to core executive duties; avoid speculative disruptions.',
      recHi: 'अपने मुख्य कार्य पर केंद्रित रहें; जल्दबाजी में करियर न बदलें।'
    },
    {
      refH: 11,
      refEn: '11th House (Gains & Cashflow)',
      refHi: 'एकादश भाव (आय, लाभ व मित्र)',
      vulnH: 6,
      vulnEn: '6th House (Debts, Disputes & Legal Fees)',
      vulnHi: 'षष्ठ भाव (ऋण, विवाद व कानूनी खर्च)',
      destabEn: 'Lingering commercial liabilities, litigation, or vendor disputes',
      destabHi: 'पुराने कर्ज, व्यावसायिक विवाद या साझेदारों से मतभेद',
      recEn: 'Keep contracts ironclad; clear liabilities promptly.',
      recHi: 'समझौते स्पष्ट रखें; अनावश्यक कर्ज और विवादों से दूर रहें।'
    }
  ];

  const eighthFromStability: EighthFromStabilityItem[] = eighthFromPairs.map(pair => {
    const refPts = houses[pair.refH - 1].points;
    const vulnPts = houses[pair.vulnH - 1].points;
    const deltaStability = refPts - vulnPts;

    let status: 'STABLE_SHIELDED' | 'NEUTRAL' | 'CRITICAL_VULNERABILITY' = 'NEUTRAL';
    if (deltaStability >= 5) status = 'STABLE_SHIELDED';
    else if (deltaStability <= -5) status = 'CRITICAL_VULNERABILITY';

    return {
      referenceHouse: pair.refH,
      referenceNameEn: pair.refEn,
      referenceNameHi: pair.refHi,
      referencePoints: refPts,
      vulnerabilityHouse: pair.vulnH,
      vulnerabilityNameEn: pair.vulnEn,
      vulnerabilityNameHi: pair.vulnHi,
      vulnerabilityPoints: vulnPts,
      deltaStability,
      status,
      destabilizingFactorEn: pair.destabEn,
      destabilizingFactorHi: pair.destabHi,
      recommendationEn: pair.recEn,
      recommendationHi: pair.recHi
    };
  });

  const signs = Array.from({ length: 12 }, (_, i) => ({
    rashiIndex: i,
    rashiName: RASHI_NAMES_EN[i],
    rashiHindi: RASHI_NAMES_HI[i],
    points: savBySign[i],
    band: getSAVBand(savBySign[i])
  }));

  // ==========================================
  // 7. Judging Three Parts of Life (Avastha Analysis)
  // ==========================================
  // Method 1: Rashi Khandas (Pisces-Gemini, Cancer-Libra, Scorpio-Aquarius)
  // Part 1: Pisces (11), Aries (0), Taurus (1), Gemini (2)
  const m1Part1Pts = savBySign[11] + savBySign[0] + savBySign[1] + savBySign[2];
  // Part 2: Cancer (3), Leo (4), Virgo (5), Libra (6)
  const m1Part2Pts = savBySign[3] + savBySign[4] + savBySign[5] + savBySign[6];
  // Part 3: Scorpio (7), Sagittarius (8), Capricorn (9), Aquarius (10)
  const m1Part3Pts = savBySign[7] + savBySign[8] + savBySign[9] + savBySign[10];

  const m1Max = Math.max(m1Part1Pts, m1Part2Pts, m1Part3Pts);
  const m1Min = Math.min(m1Part1Pts, m1Part2Pts, m1Part3Pts);

  const m1Parts: ThreePartsOfLifeItem[] = [
    {
      partNumber: 1,
      titleEn: 'First Part (Early Life & Youth)',
      titleHi: 'प्रथम काल (बाल्यावस्था एवं युवावस्था)',
      titleGu: 'પ્રથમ ભાગ (બાળપણ અને યુવાની)',
      spanEn: 'Pisces to Gemini (Signs 12, 1, 2, 3)',
      spanHi: 'मीन से मिथुन (राशि १२, १, २, ३)',
      spanGu: 'મીન થી મિથુન (રાશિ ૧૨, ૧, ૨, ૩)',
      points: m1Part1Pts,
      benchmark: 112.33,
      percentage: Number(((m1Part1Pts / 337) * 100).toFixed(1)),
      isPeak: m1Part1Pts === m1Max,
      isLeast: m1Part1Pts === m1Min,
      status: m1Part1Pts >= 115 ? 'EXCELLENT' : m1Part1Pts >= 108 ? 'MODERATE' : 'VULNERABLE',
      descriptionEn:
        m1Part1Pts >= 112.33
          ? 'Blessed childhood and formative youth with supportive parental environment, quick learning curve, and healthy vitality.'
          : 'Early foundational years require greater parental patience, careful health nurturing, and disciplined schooling.',
      descriptionHi:
        m1Part1Pts >= 112.33
          ? 'बाल्यावस्था व प्रारंभिक शिक्षा में उत्तम सहयोग, पारिवारिक सुरक्षा एवं सीखने की तीव्र क्षमता।'
          : 'प्रारंभिक वर्षों में स्वास्थ्य व एकाग्रता के प्रति विशेष सजगता तथा निरंतर मार्गदर्शन की आवश्यकता।',
      descriptionGu:
        m1Part1Pts >= 112.33
          ? 'બાળપણ અને શિક્ષણમાં ઉત્તમ પારિવારિક સુખ અને સરળ શરૂઆત.'
          : 'શરૂઆતી વર્ષોમાં સ્વાસ્થ્ય અને અભ્યાસ માટે વિશેષ પ્રયાસો જરૂરી.'
    },
    {
      partNumber: 2,
      titleEn: 'Second Part (Middle Life & Enterprise)',
      titleHi: 'मध्यम काल (युवावस्था से परिपक्वता / कर्म काल)',
      titleGu: 'મધ્ય ભાગ (યુવાવસ્થાથી પ્રૌઢાવસ્થા / કર્મ કાળ)',
      spanEn: 'Cancer to Libra (Signs 4, 5, 6, 7)',
      spanHi: 'कर्क से तुला (राशि ४, ५, ६, ७)',
      spanGu: 'કર્ક થી તુલા (રાશિ ૪, ૫, ૬, ૭)',
      points: m1Part2Pts,
      benchmark: 112.33,
      percentage: Number(((m1Part2Pts / 337) * 100).toFixed(1)),
      isPeak: m1Part2Pts === m1Max,
      isLeast: m1Part2Pts === m1Min,
      status: m1Part2Pts >= 115 ? 'EXCELLENT' : m1Part2Pts >= 108 ? 'MODERATE' : 'VULNERABLE',
      descriptionEn:
        m1Part2Pts >= 112.33
          ? 'Core productive chapter marked by strong professional trajectory, marital establishment, and robust material compounding.'
          : 'Middle career years demand relentless perseverance and defensive financial planning to overcome market friction.',
      descriptionHi:
        m1Part2Pts >= 112.33
          ? 'कैरियर, आजीविका और पारिवारिक निर्माण का स्वर्णिમ काल; प्रयासों का प्रचुर व निरंतर फल।'
          : 'कार्यक्षेत्र में निरंतर परिश्रम, धैर्य और वित्तीय सुरक्षा पर विशेष ध्यान देने का समय।',
      descriptionGu:
        m1Part2Pts >= 112.33
          ? 'કારકિર્દી અને પરિવાર નિર્માણનો સુવર્ણ કાળ; પ્રચુર સફળતા.'
          : 'મધ્યકાળમાં ધીરજ અને નાણાકીય આયોજન સાથે આગળ વધવું.'
    },
    {
      partNumber: 3,
      titleEn: 'Last Part (Mature Age & Spiritual Legacy)',
      titleHi: 'अंतिम काल (प्रौढ़ावस्था, संचित यश एवं साधना)',
      titleGu: 'અંતિમ ભાગ (પરિપક્વ વય, યશ અને સાધના)',
      spanEn: 'Scorpio to Aquarius (Signs 8, 9, 10, 11)',
      spanHi: 'वृश्चिक से कुंभ (राशि ८, ९, १०, ११)',
      spanGu: 'વૃશ્ચિક થી કુંભ (રાશિ ૮, ૯, ૧૦, ૧૧)',
      points: m1Part3Pts,
      benchmark: 112.33,
      percentage: Number(((m1Part3Pts / 337) * 100).toFixed(1)),
      isPeak: m1Part3Pts === m1Max,
      isLeast: m1Part3Pts === m1Min,
      status: m1Part3Pts >= 115 ? 'EXCELLENT' : m1Part3Pts >= 108 ? 'MODERATE' : 'VULNERABLE',
      descriptionEn:
        m1Part3Pts >= 112.33
          ? 'Serene, venerated senior years filled with accumulated wealth, spiritual peace, respected leadership, and familial contentment.'
          : 'Mature years advise gradual transition towards contemplative pursuits, health mindfulness, and delegating worldly stresses.',
      descriptionHi:
        m1Part3Pts >= 112.33
          ? 'जीवन का अंतिम चरण अत्यंत सुखद, मान-सम्मान, संचित संपत्ति और आध्यात्मिक शांति से परिपूर्ण।'
          : 'परिपक्व उम्र में स्वास्थ्य का नियमित ध्यान रखें और भौतिक जिम्मेदारियों को अगली पीढ़ी को सौंपें।',
      descriptionGu:
        m1Part3Pts >= 112.33
          ? 'જીવનનો ઉત્તરાર્ધ અત્યંત સુખમય, માન-સન્માન અને આધ્યાત્મિક શાંતિથી પરિપૂર્ણ.'
          : 'ઉત્તરાર્ધમાં સ્વાસ્થ્ય અને સંતોષમય જીવનશૈલી પર ધ્યાન કેન્દ્રિત કરવું.'
    }
  ];

  // Method 2: Bhava Khandas (Kendra, Panaphara, Apoklima)
  const m2Part1Pts = houses[0].points + houses[3].points + houses[6].points + houses[9].points; // 1, 4, 7, 10
  const m2Part2Pts = houses[1].points + houses[4].points + houses[7].points + houses[10].points; // 2, 5, 8, 11
  const m2Part3Pts = houses[2].points + houses[5].points + houses[8].points + houses[11].points; // 3, 6, 9, 12

  const m2Max = Math.max(m2Part1Pts, m2Part2Pts, m2Part3Pts);
  const m2Min = Math.min(m2Part1Pts, m2Part2Pts, m2Part3Pts);

  const m2Parts: ThreePartsOfLifeItem[] = [
    {
      partNumber: 1,
      titleEn: 'First Part (Kendra Houses: 1, 4, 7, 10)',
      titleHi: 'प्रथम काल (केन्द्र भाव: १, ४, ७, १०)',
      titleGu: 'પ્રથમ ભાગ (કેન્દ્ર ભાવ: ૧, ૪, ૭, ૧૦)',
      spanEn: 'Pillars of Self, Home, Spouse & Action',
      spanHi: 'तनु, सुख, जाया एवं कर्म भाव',
      spanGu: 'તન, સુખ, પત્ની અને કર્મ ભાવ',
      points: m2Part1Pts,
      benchmark: 112.33,
      percentage: Number(((m2Part1Pts / 337) * 100).toFixed(1)),
      isPeak: m2Part1Pts === m2Max,
      isLeast: m2Part1Pts === m2Min,
      status: m2Part1Pts >= 115 ? 'EXCELLENT' : m2Part1Pts >= 108 ? 'MODERATE' : 'VULNERABLE',
      descriptionEn:
        m2Part1Pts >= 112.33
          ? 'Strong foundational pillars provide early momentum, family backing, and high executive initiative.'
          : 'Early stages require conscious self-reinvention and resilient courage to establish basic pillars.',
      descriptionHi:
        m2Part1Pts >= 112.33
          ? 'केन्द्र भावों की शक्ति से प्रारंभिक जीवन में स्वतः सुरक्षा, आत्मविश्वास और दिशा मिलती है।'
          : 'प्रारंभिक दौर में आत्म-विश्वास व स्थिर आधार बनाने के लिए अधिक लगन की आवश्यकता।',
      descriptionGu:
        m2Part1Pts >= 112.33
          ? 'કેન્દ્ર બળ મજબૂત હોવાથી શરૂઆતથી જ દૃઢ આધાર અને પ્રગતિ.'
          : 'શરૂઆતના સમયમાં સ્થિરતા મેળવવા ધીરજ જરૂરી.'
    },
    {
      partNumber: 2,
      titleEn: 'Second Part (Panaphara Houses: 2, 5, 8, 11)',
      titleHi: 'मध्यम काल (पणफर भाव: २, ५, ८, ११)',
      titleGu: 'મધ્ય ભાગ (પણફર ભાવ: ૨, ૫, ૮, ૧૧)',
      spanEn: 'Sustenance, Intellect, Wealth & Gains',
      spanHi: 'धन, सुत, आयु एवं लाभ भाव',
      spanGu: 'ધન, સંતાન, આયુ અને લાભ ભાવ',
      points: m2Part2Pts,
      benchmark: 112.33,
      percentage: Number(((m2Part2Pts / 337) * 100).toFixed(1)),
      isPeak: m2Part2Pts === m2Max,
      isLeast: m2Part2Pts === m2Min,
      status: m2Part2Pts >= 115 ? 'EXCELLENT' : m2Part2Pts >= 108 ? 'MODERATE' : 'VULNERABLE',
      descriptionEn:
        m2Part2Pts >= 112.33
          ? 'Peak earning and resource-compounding phase. Intellect and investments blossom into durable wealth assets.'
          : 'Middle stage requires disciplined cashflow management and defensive risk posture.',
      descriptionHi:
        m2Part2Pts >= 112.33
          ? 'धन संचय, संतान सुख एवं लाभ अर्जन का चरम काल; बौद्धिक कौशल से वित्तीय समृद्धि।'
          : 'मध्यम अवस्था में खर्चों पर नियंत्रण और वित्तीय समझदारी सर्वोपरि रहेगी।',
      descriptionGu:
        m2Part2Pts >= 112.33
          ? 'સંપત્તિ સંગ્રહ અને લાભનો શ્રેષ્ઠ સમય; બુદ્ધિબળથી ધન વૃદ્ધિ.'
          : 'આ સમયમાં નાણાકીય સાવચેતી રાખવી.'
    },
    {
      partNumber: 3,
      titleEn: 'Last Part (Apoklima Houses: 3, 6, 9, 12)',
      titleHi: 'अंतिम काल (आपोक्लिम भाव: ३, ६, ९, १२)',
      titleGu: 'અંતિમ ભાગ (આપોક્લિમ ભાવ: ૩, ૬, ૯, ૧૨)',
      spanEn: 'Courage, Service, Dharma & Liberation',
      spanHi: 'सहज, शत्रु, धर्म एवं मोक्ष भाव',
      spanGu: 'પરાક્રમ, સેવા, ધર્મ અને મોક્ષ ભાવ',
      points: m2Part3Pts,
      benchmark: 112.33,
      percentage: Number(((m2Part3Pts / 337) * 100).toFixed(1)),
      isPeak: m2Part3Pts === m2Max,
      isLeast: m2Part3Pts === m2Min,
      status: m2Part3Pts >= 115 ? 'EXCELLENT' : m2Part3Pts >= 108 ? 'MODERATE' : 'VULNERABLE',
      descriptionEn:
        m2Part3Pts >= 112.33
          ? 'Exalted spiritual maturity, virtuous philanthropic reputation, inner serenity, and honorable legacy.'
          : 'Later years counsel letting go of competitive worldly frictions and embracing quiet spiritual devotion.',
      descriptionHi:
        m2Part3Pts >= 112.33
          ? 'अत्युत्तम आध्यात्मिक उन्नति, धर्म-कर्म में यश, शांतिपूर्ण जीवन और स्थायी पारिवारिक सम्मान।'
          : 'अंतिम दौर में विवादों व प्रतिस्पर्धा से दूर रहकर ईश्वरीय भक्ति व शांति का चयन करें।',
      descriptionGu:
        m2Part3Pts >= 112.33
          ? 'આધ્યાત્મિક ઊંચાઈ, પરોપકાર અને સમાજમાં કાયમી આદર-સન્માન.'
          : 'શાંતિ અને ભક્તિભાવથી જીવન જીવવું.'
    }
  ];

  const peakM1 = m1Parts.find(p => p.isPeak) || m1Parts[0];
  const leastM1 = m1Parts.find(p => p.isLeast) || m1Parts[2];
  const peakM2 = m2Parts.find(p => p.isPeak) || m2Parts[0];
  const leastM2 = m2Parts.find(p => p.isLeast) || m2Parts[2];

  const threePartsOfLife: ThreePartsOfLifeAnalysis = {
    method1RashiKhandas: {
      parts: m1Parts,
      peakPart: peakM1,
      leastPart: leastM1,
      titleEn: 'Method 1: Rashi Khandas (Classical Zodiacal Triad)',
      titleHi: 'विधि १: राशि खंड (शास्त्रीय राशि त्रिखंड)',
      titleGu: 'પદ્ધતિ ૧: રાશિ ખંડ (શાસ્ત્રીય ત્રિભાગ)',
      descriptionEn: `Highest bindus in ${peakM1.titleEn} (${peakM1.points} pts) indicates your most harmonious and prosperous life chapter.`,
      descriptionHi: `${peakM1.titleHi} (${peakM1.points} अंक) में सर्वाधिक बिंदु आपके जीवन के सबसे सुगम, समृद्ध व आनंदमयी काल को दर्शाते हैं।`,
      descriptionGu: `${peakM1.titleGu} માં સૌથી વધુ બિંદુ જીવનનો સૌથી સુખદ સમય દર્શાવે છે.`
    },
    method2BhavaKhandas: {
      parts: m2Parts,
      peakPart: peakM2,
      leastPart: leastM2,
      titleEn: 'Method 2: Bhava Khandas (Kendra, Panaphara & Apoklima)',
      titleHi: 'विधि २: भाव खंड (केन्द्र, पणफर एवं आपोक्लिम)',
      titleGu: 'પદ્ધતિ ૨: ભાવ ખંડ (કેન્દ્ર, પણફર અને આપોક્લિમ)',
      descriptionEn: `The ${peakM2.titleEn} dominates with ${peakM2.points} pts, confirming sustained growth and structural endurance.`,
      descriptionHi: `${peakM2.titleHi} (${peakM2.points} अंक) में अधिकतम बल यह सुनिश्चित करता है कि जीवन के इस पड़ाव पर आपके संसाधन और सुख शीर्ष पर रहेंगे।`,
      descriptionGu: `${peakM2.titleGu} માં ઉત્તમ બળ હોવાથી આ સમયમાં ઉત્તરોત્તર પ્રગતિ થશે.`
    },
    synthesizedVerdict: {
      goldenPhaseEn: `🌟 Golden Phase of Life: ${peakM1.titleEn} (Rashi: ${peakM1.points} pts) & ${peakM2.titleEn} (Bhava: ${peakM2.points} pts)`,
      goldenPhaseHi: `🌟 जीवन का स्वर्ण काल: ${peakM1.titleHi} (${peakM1.points} अंक) एवं ${peakM2.titleHi} (${peakM2.points} अंक)`,
      goldenPhaseGu: `🌟 જીવનનો સુવર્ણ તબક્કો: ${peakM1.titleGu} અને ${peakM2.titleGu}`,
      counselEn: `Classical Ashtakavarga states that life steadily unfolds its best gifts as you mature. Utilize periods of lower bindus for conscious discipline, and let the golden phase elevate your family and spiritual standing.`,
      counselHi: `शास्त्रीय सर्वाष्टकवर्ग के अनुसार जीवन आगे बढ़ने के साथ अपने श्रेष्ठ वरदान प्रकट करता है। अल्प बिंदु वाले काल में संयम रखें और श्रेष्ठ काल में अपने कर्मों से स्थायी कीर्ति अर्जित करें।`,
      counselGu: `જીવન જેમ પરિપક્વ થાય છે તેમ ઉત્તમ ફળ આપે છે. સુવર્ણ કાળમાં પૂરા ઉત્સાહથી કાર્ય કરવું.`
    }
  };

  // ==========================================
  // 8. Judging Materialistic vs Spiritualistic Nature
  // ==========================================
  const antarbhagaHouses = [1, 4, 5, 7, 9, 10]; // Kona (5, 9) + Kendra (1, 4, 7, 10)
  const bahirbhagaHouses = [2, 3, 6, 8, 11, 12]; // Other houses

  const antarbhagaPoints = antarbhagaHouses.reduce((acc, h) => acc + houses[h - 1].points, 0);
  const bahirbhagaPoints = bahirbhagaHouses.reduce((acc, h) => acc + houses[h - 1].points, 0);

  const antarbhagaPercentage = Number(((antarbhagaPoints / 337) * 100).toFixed(1));
  const bahirbhagaPercentage = Number(((bahirbhagaPoints / 337) * 100).toFixed(1));

  let natureVerdict: 'SPIRITUAL_DOMINANT' | 'MATERIAL_DOMINANT' | 'BALANCED_HARMONY' = 'BALANCED_HARMONY';
  let natureTitleEn = 'Balanced Harmony (Antarbhaga & Bahirbhaga Balanced)';
  let natureTitleHi = 'संतुलित समन्वय (आंतरिक एवं बाह्य संतुलन)';
  let natureTitleGu = 'સંતુલિત સમન્વય (આંતરિક અને બાહ્ય સંતુલન)';
  let natureSubEn = 'Healthy equilibrium between worldly obligations and inner spiritual peace.';
  let natureSubHi = 'सांसारिक कर्तव्यों एवं अंतर्मुखी चेतना के बीच संतुलित समन्वय।';
  let natureSubGu = 'સંસારી ફરજો અને આધ્યાત્મિક શાંતિ વચ્ચે ઉત્તમ સંતુલન.';
  let natureDescEn =
    'Your chart maintains a close symmetry between Antarbhaga (inner soul core) and Bahirbhaga (outer achievements). You can pursue wealth and career success without sacrificing your inner ethics and family peace.';
  let natureDescHi =
    'आपकी कुंडली में अंतर्भाग और बहिर्भाग में अद्भुत संतुलन है। आप सांसारिक धन और पद की प्राप्ति करते हुए भी अपने नैतिक मूल्यों और आंतरिक शांति को सहजता से बनाए रखने में सक्षम हैं।';
  let natureDescGu =
    'તમારી કુંડળીમાં અંતર્ભાગ અને બહિર્ભાગ વચ્ચે ઉત્તમ મેળ છે. તમે પ્રગતિ સાથે આંતરિક શાંતિ જાળવી શકશો.';

  if (antarbhagaPoints - bahirbhagaPoints >= 6) {
    natureVerdict = 'SPIRITUAL_DOMINANT';
    natureTitleEn = 'Antarbhaga Dominant (Introspective & Dharmic Soul)';
    natureTitleHi = 'अंतर्भाग प्रधान (आत्मोन्मुखी एवं धर्म-प्रेरित प्रकृति)';
    natureTitleGu = 'અંતર્ભાગ પ્રધાન (આધ્યાત્મિક અને ધર્મપ્રેમી પ્રકૃતિ)';
    natureSubEn = 'Natural inclination towards contemplation, introspection, philanthropy, and simple noble living.';
    natureSubHi = 'आत्म-चिंतन, सादगी, परोपकार, धर्म और आंतरिक संतुष्टि की ओर स्वाभाविक झुकाव।';
    natureSubGu = 'આત્મચિંતન, સાદગી, પરોપકાર અને ધર્મ પ્રત્યે વિશેષ આકર્ષણ.';
    natureDescEn =
      'Kendra and Trikona houses dominate your energy. Worldly power and vanity hold limited appeal; your greatest fulfillment springs from ethical purpose, intellectual knowledge, family values, and spiritual devotion.';
    natureDescHi =
      'केन्द्र व त्रिकोण भावों का प्रभाव अधिक होने से भौतिक दिखावे की अपेक्षा आंतरिक शांति, ज्ञान अर्जन, परोपकार और धार्मिक आचरण में अधिक आनंद मिलता है।';
    natureDescGu =
      'આધ્યાત્મિક સુખ, જ્ઞાન અને સદાચારમાં વધુ રસ રહેશે.';
  } else if (bahirbhagaPoints - antarbhagaPoints >= 6) {
    natureVerdict = 'MATERIAL_DOMINANT';
    natureTitleEn = 'Bahirbhaga Dominant (Worldly & Material Enterprise)';
    natureTitleHi = 'बहिर्भाग प्रधान (भौतिक एवं सांसारिक पुरुषार्थ)';
    natureTitleGu = 'બહિર્ભાગ પ્રધાન (ભૌતિક અને વ્યવસાયિક ઉત્સાહ)';
    natureSubEn = 'Driven by external accomplishments, commercial expansion, wealth acquisition, and tangible assets.';
    natureSubHi = 'व्यावसायिक विस्तार, धन संचय, भौतिक प्रतिष्ठा और व्यावहारिक सफलता के प्रति दृढ़ संकल्प।';
    natureSubGu = 'વ્યવસાયિક સફળતા, ધન પ્રાપ્તિ અને સામાજિક પ્રતિષ્ઠા માટે વિશેષ પરિશ્રમ.';
    natureDescEn =
      'The secondary and growth houses carry the strongest bindus. You thrive in competitive environments, enterprise management, negotiating transactions, and building durable financial empires.';
    natureDescHi =
      'बहिर्भाग के भावों में अधिक बिंदु होने के कारण आप व्यावहारिक जगत में अत्यंत कुशल, रणनीतिक विचारक और धन व संसाधनों के कुशल निर्माता हैं।';
    natureDescGu =
      'વેપાર, આર્થિક વ્યવહારો અને વ્યવહારિક ક્ષેત્રોમાં અગ્રેસર રહેશો.';
  }

  const materialSpiritualNature: MaterialSpiritualNatureAnalysis = {
    antarbhagaPoints,
    antarbhagaPercentage,
    antarbhagaHouses,
    bahirbhagaPoints,
    bahirbhagaPercentage,
    bahirbhagaHouses,
    verdict: natureVerdict,
    titleEn: natureTitleEn,
    titleHi: natureTitleHi,
    titleGu: natureTitleGu,
    subtitleEn: natureSubEn,
    subtitleHi: natureSubHi,
    subtitleGu: natureSubGu,
    descriptionEn: natureDescEn,
    descriptionHi: natureDescHi,
    descriptionGu: natureDescGu,
    antarbhagaSignificationsEn: 'Core Identity (H1), Mental Peace (H4), Intellect & Punya (H5), Partnership (H7), Fortune (H9), Career Authority (H10).',
    antarbhagaSignificationsHi: 'लग्न (१), सुख (४), बुद्धि व पूर्वपुण्य (५), जाया (७), भाग्य (९), कर्म सत्ता (१०)।',
    antarbhagaSignificationsGu: 'લગ્ન (૧), સુખ (૪), બુદ્ધિ (૫), પત્ની (૭), ભાગ્ય (૯), કર્મ (૧૦).',
    bahirbhagaSignificationsEn: 'Liquid Wealth (H2), Courage (H3), Debt & Routine (H6), Transformation (H8), Cashflow & Social Circles (H11), Moksha & Foreign (H12).',
    bahirbhagaSignificationsHi: 'धन (२), पराक्रम (३), ऋण व सेवा (६), गूढ़ ज्ञान (८), लाभ (११), व्यय व मोक्ष (१२)।',
    bahirbhagaSignificationsGu: 'ધન (૨), પરાક્રમ (૩), સેવા (૬), રહસ્ય (૮), લાભ (૧૧), મોક્ષ (૧૨).'
  };

  // ==========================================
  // 9. Judging Years of Misfortune (7/27 Rule & Malefic House Ages)
  // ==========================================
  const saturnPlanet = kundali.planets.find(p => p.name.includes('Saturn') || p.name.includes('Shani'));
  const marsPlanet = kundali.planets.find(p => p.name.includes('Mars') || p.name.includes('Mangala'));
  const rahuPlanet = kundali.planets.find(p => p.name.includes('Rahu'));

  const saturnRashi = saturnPlanet ? saturnPlanet.rashiIndex : 8;
  const marsRashi = marsPlanet ? marsPlanet.rashiIndex : 0;
  const rahuRashi = rahuPlanet ? rahuPlanet.rashiIndex : 10;

  function sumRangeInclusive(startSign: number, targetSign: number): { sum: number; houses: number[] } {
    let sum = 0;
    const houseList: number[] = [];
    let cur = startSign;
    while (true) {
      sum += savBySign[cur];
      const hNum = ((cur - lagnaRashi + 12) % 12) + 1;
      houseList.push(hNum);
      if (cur === targetSign) break;
      cur = (cur + 1) % 12;
    }
    return { sum, houses: houseList };
  }

  // 1. Ascendant to Saturn
  const lToSat = sumRangeInclusive(lagnaRashi, saturnRashi);
  const qAge1 = Math.floor((lToSat.sum * 7) / 27);
  const exactAge1 = ((lToSat.sum * 7) / 27).toFixed(1);

  // 2. Saturn to Ascendant
  const satToL = sumRangeInclusive(saturnRashi, lagnaRashi);
  const qAge2 = Math.floor((satToL.sum * 7) / 27);
  const exactAge2 = ((satToL.sum * 7) / 27).toFixed(1);

  // 3. Ascendant to Mars
  const lToMar = sumRangeInclusive(lagnaRashi, marsRashi);
  const qAge3 = Math.floor((lToMar.sum * 7) / 27);
  const exactAge3 = ((lToMar.sum * 7) / 27).toFixed(1);

  // 4. Mars to Ascendant
  const marToL = sumRangeInclusive(marsRashi, lagnaRashi);
  const qAge4 = Math.floor((marToL.sum * 7) / 27);
  const exactAge4 = ((marToL.sum * 7) / 27).toFixed(1);

  const quotientCalculations: MisfortuneQuotientCalculation[] = [
    {
      id: 'L_TO_SATURN',
      titleEn: 'Ascendant ➔ Saturn (Age Quotient)',
      titleHi: 'लग्न से शनि (संकट / रोग वर्ष)',
      titleGu: 'લગ્ન થી શનિ (રોગ / કષ્ટ વય)',
      fromEntity: 'Ascendant (Lagna)',
      toEntity: 'Saturn (Shani)',
      housesIncluded: lToSat.houses,
      sumPoints: lToSat.sum,
      formulaStr: `(${lToSat.sum} × 7) ÷ 27 = ${exactAge1}`,
      quotientAge: qAge1,
      exactAgeStr: exactAge1,
      afflictionType: 'CHRONIC_DISEASE',
      significationEn:
        'Indicates a sensitive life window for bodily fatigue, joint/bone stiffness, or mental burden. Maintain disciplined health and bone wellness.',
      significationHi:
        'आयु के इस वर्ष में शारीरिक थकान, जोड़ों के दर्द अथवा दीर्घकालिक मानसिक दबाव की संभावना रहती है। स्वास्थ्य के प्रति विशेष सावधानी रखें।',
      significationGu:
        'આ વયમાં શારીરિક થાક કે સાંધાના દુખાવા અંગે સાવધાની રાખવી.'
    },
    {
      id: 'SATURN_TO_L',
      titleEn: 'Saturn ➔ Ascendant (Karmic Endurance)',
      titleHi: 'शनि से लग्न (कर्म परीक्षण वर्ष)',
      titleGu: 'શનિ થી લગ્ન (કર્મ કસોટી વય)',
      fromEntity: 'Saturn (Shani)',
      toEntity: 'Ascendant (Lagna)',
      housesIncluded: satToL.houses,
      sumPoints: satToL.sum,
      formulaStr: `(${satToL.sum} × 7) ÷ 27 = ${exactAge2}`,
      quotientAge: qAge2,
      exactAgeStr: exactAge2,
      afflictionType: 'ENDURANCE_TEST',
      significationEn:
        'Karmic testing phase requiring patience, structural restructuring, and resisting hasty shortcuts.',
      significationHi:
        'धैर्य और सहनशीलता का समय; इस वर्ष में कार्यक्षेत्र में देरी या अधिक परिश्रम का सामना हो सकता है।',
      significationGu:
        'આ સમયમાં ધીરજ અને સખત મહેનત જરૂરી.'
    },
    {
      id: 'L_TO_MARS',
      titleEn: 'Ascendant ➔ Mars (Surgery / Trauma Alert)',
      titleHi: 'लग्न से मंगल (शल्य / दुर्घटना वर्ष)',
      titleGu: 'લગ્ન થી મંગળ (શસ્ત્રક્રિયા / ઈજા વય)',
      fromEntity: 'Ascendant (Lagna)',
      toEntity: 'Mars (Mangala)',
      housesIncluded: lToMar.houses,
      sumPoints: lToMar.sum,
      formulaStr: `(${lToMar.sum} × 7) ÷ 27 = ${exactAge3}`,
      quotientAge: qAge3,
      exactAgeStr: exactAge3,
      afflictionType: 'SURGERY_TRAUMA',
      significationEn:
        'Classical window for surgical procedures, blood/bile vitality imbalances, cuts, burns, or acute athletic trauma. Exercise defensive driving.',
      significationHi:
        'आयु के इस वर्ष में शल्य चिकित्सा (ऑपरेशन), चोट, रक्त विकार या आकस्मिक दुर्घटना की संभावना; वाहन चलाने में सावधानी बरतें।',
      significationGu:
        'આ વયમાં ઓપરેશન, વાગવા કે અકસ્માતથી સાવચેત રહેવું.'
    },
    {
      id: 'MARS_TO_L',
      titleEn: 'Mars ➔ Ascendant (Vitality Flare-up)',
      titleHi: 'मंगल से लग्न (ऊर्जा / पित्त प्रकोप वर्ष)',
      titleGu: 'મંગળ થી લગ્ન (પિત્ત પ્રકોપ વય)',
      fromEntity: 'Mars (Mangala)',
      toEntity: 'Ascendant (Lagna)',
      housesIncluded: marToL.houses,
      sumPoints: marToL.sum,
      formulaStr: `(${marToL.sum} × 7) ÷ 27 = ${exactAge4}`,
      quotientAge: qAge4,
      exactAgeStr: exactAge4,
      afflictionType: 'VITALITY_CRISIS',
      significationEn:
        'High metabolic heat, impulsive decisions, or sudden arguments. Channel energy into rigorous physical fitness and meditation.',
      significationHi:
        'अत्यधिक क्रोध, जल्दबाजी के निर्णय अथवा पित्त जनित समस्याओं से बचाव रखें; नियमित व्यायाम से ऊर्जा संतुलित करें।',
      significationGu:
        'ક્રોધ અને ઉતાવળા નિર્ણયોથી બચવું.'
    }
  ];

  // Malefic House Occupancy Bindu Ages
  const rahuHouse = ((rahuRashi - lagnaRashi + 12) % 12) + 1;
  const marsHouse = ((marsRashi - lagnaRashi + 12) % 12) + 1;
  const saturnHouse = ((saturnRashi - lagnaRashi + 12) % 12) + 1;

  const rahuSavPts = houses[rahuHouse - 1].points;
  const marsSavPts = houses[marsHouse - 1].points;
  const saturnSavPts = houses[saturnHouse - 1].points;

  const maleficHouseAges: MaleficHouseAgeItem[] = [
    {
      planetEn: 'Rahu',
      planetHi: 'राहु',
      planetGu: 'રાહુ',
      symbol: '☊',
      houseNumber: rahuHouse,
      rashiNameEn: RASHI_NAMES_EN[rahuRashi],
      rashiNameHi: RASHI_NAMES_HI[rahuRashi],
      rashiNameGu: RASHI_NAMES_GU[rahuRashi],
      savPoints: rahuSavPts,
      age: rahuSavPts,
      threatTypeEn: 'Toxic Exposure, Food Allergies & Phobias',
      threatTypeHi: 'विषाक्तता, एलर्जी, भ्रांति एवं आकस्मिक संकट',
      threatTypeGu: 'ઝેરી તત્વો, એલર્જી અને ભ્રમણા',
      warningEn: `In life year ${rahuSavPts} (matching House ${rahuHouse} points: ${rahuSavPts}), exercise caution regarding dietary purity, unverified medications, and deceptive schemes.`,
      warningHi: `जीवन के ${rahuSavPts}वें वर्ष में (राहु स्थित भाव ${rahuHouse} के बिंदु: ${rahuSavPts}) खान-पान की स्वच्छता, अज्ञात दवाओं और धोखाधड़ी से सतर्क रहें।`,
      warningGu: `જીવનના ${rahuSavPts}મા વર્ષે ખોરાકની શુદ્ધતા અને છેતરપિંડીથી સાવધાન રહેવું.`
    },
    {
      planetEn: 'Mars (Mangala)',
      planetHi: 'मंगल',
      planetGu: 'મંગળ',
      symbol: '♂️',
      houseNumber: marsHouse,
      rashiNameEn: RASHI_NAMES_EN[marsRashi],
      rashiNameHi: RASHI_NAMES_HI[marsRashi],
      rashiNameGu: RASHI_NAMES_GU[marsRashi],
      savPoints: marsSavPts,
      age: marsSavPts,
      threatTypeEn: 'Surgical Operations, Burns & Mechanical Injuries',
      threatTypeHi: 'शल्य क्रिया (ऑपरेशन), चोट, अग्नि व रक्त विकार',
      threatTypeGu: 'શસ્ત્રક્રિયા, દાઝવું અને રક્ત વિકાર',
      warningEn: `In life year ${marsSavPts} (matching House ${marsHouse} points: ${marsSavPts}), guard against sports injuries, heat exhausts, and surgical interventions.`,
      warningHi: `जीवन के ${marsSavPts}वें वर्ष में (मंगल स्थित भाव ${marsHouse} के बिंदु: ${marsSavPts}) चोट, कटने-जलने अथवा सर्जरी के प्रति सचेत रहें।`,
      warningGu: `જીવનના ${marsSavPts}મા વર્ષે ઈજા કે શસ્ત્રક્રિયા અંગે સાવચેતી રાખવી.`
    },
    {
      planetEn: 'Saturn (Shani)',
      planetHi: 'शनि',
      planetGu: 'શનિ',
      symbol: '♄',
      houseNumber: saturnHouse,
      rashiNameEn: RASHI_NAMES_EN[saturnRashi],
      rashiNameHi: RASHI_NAMES_HI[saturnRashi],
      rashiNameGu: RASHI_NAMES_GU[saturnRashi],
      savPoints: saturnSavPts,
      age: saturnSavPts,
      threatTypeEn: 'Chronic Ailments, Fatigue & Career Obstacles',
      threatTypeHi: 'दीर्घकालिक रोग, अवसाद, कार्य बाधा व थकान',
      threatTypeGu: 'લાંબી માંદગી, થાક અને કામમાં અડચણો',
      warningEn: `In life year ${saturnSavPts} (matching House ${saturnHouse} points: ${saturnSavPts}), prioritize joint mobility, spine health, and patient steady pacing.`,
      warningHi: `जीवन के ${saturnSavPts}वें वर्ष में (शनि स्थित भाव ${saturnHouse} के बिंदु: ${saturnSavPts}) जोड़ों के दर्द, मानसिक तनाव और काम में देरी से धैर्य न खोएं।`,
      warningGu: `જીવનના ${saturnSavPts}મા વર્ષે સ્વાસ્થ્ય અને ધૈર્ય જાળવવું.`
    }
  ];

  const misfortuneYears: MisfortuneYearsAnalysis = {
    quotientCalculations,
    maleficHouseAges,
    remedialTipsEn: [
      'Recite the Maha Mrityunjaya Mantra (ॐ त्र्यम्बकं यजामहे) daily during Saturn-related sensitivity years.',
      'Chant the Hanuman Chalisa or Mangal Kavach on Tuesdays during Mars-related surgery/injury windows.',
      'Avoid unverified chemical medications, extreme intoxicants, or impulsive nocturnal risks during Rahu years.',
      'Practice regular Pranayama and maintain seasonal Ayurvedic detoxification (Panchakarma) to neutralize latent vata/pitta imbalances.'
    ],
    remedialTipsHi: [
      'शनि के संवेदनशील वर्षों में प्रतिदिन महामृत्युंजय मंत्र का जप करें अथवा भगवान शिव का जलाभिषेक करें।',
      'मंगल के शल्य/चोट वर्षों में मंगलवार को हनुमान चालीसा का पाठ करें और सिंदूर अर्पित करें।',
      'राहु वर्ष में अज्ञात दवाओं, अत्यधिक बासी भोजन और जोखिम भरे रात के सफर से बचें।',
      'प्राणायाम और संतुलित दिनचर्या अपनाएं जिससे वात व पित्त का प्रकोप शांत रहे।'
    ],
    remedialTipsGu: [
      'શનિ સંબંધિત વર્ષોમાં મહામૃત્યુંજય મંત્રનો જાપ કરવો.',
      'મંગળ સંબંધિત વર્ષોમાં હનુમાન ચાલીસાનો પાઠ કરવો.',
      'રાહુ સંબંધિત વર્ષોમાં ખોરાક અને મુસાફરીમાં સાવચેત રહેવું.',
      'પ્રાણાયામ અને સાત્વિક આહાર રાખવો.'
    ]
  };

  return {
    tradition,
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
    },
    purusharthaTrikonas,
    directionalRelocation,
    sadeSatiAnalysis,
    lifeVerticals,
    quantumJumps,
    eighthFromStability,
    threePartsOfLife,
    materialSpiritualNature,
    misfortuneYears
  };
}
