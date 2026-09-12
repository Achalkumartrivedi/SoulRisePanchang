import { KundaliResult, PlanetDetail } from './kundaliEngine';

export interface DrishtiRule {
  from: number;
  to: number;
  strength: number; // 1.0 = FULL, 0.5 = HALF, 0.25 = QUARTER
  type: 'direct' | 'reverse' | 'supportive' | 'weak';
  oneWay?: boolean;
  alwaysMalefic?: boolean;
  description: string;
}

/**
 * Lal Kitab Drishti Rule Engine
 * House-based aspects (not planet-specific like Vedic astrology)
 */
export const LAL_KITAB_DRISHTI = {
  // ===== PRIMARY DRISHTI =====

  FULL: [
    {
      from: 1,
      to: 7,
      strength: 1.0,
      type: "direct",
      oneWay: true,
      description: "1st house gives full one-way aspect to 7th."
    },
    {
      from: 4,
      to: 10,
      strength: 1.0,
      type: "direct",
      oneWay: true,
      description: "4th house gives full one-way aspect to 10th."
    },
    {
      from: 8,
      to: 2,
      strength: 1.0,
      type: "reverse",
      oneWay: true,
      alwaysMalefic: true,
      description: "Famous Ulti Drishti (Vakri Drishti)."
    }
  ] as DrishtiRule[],

  HALF: [
    {
      from: 3,
      to: 9,
      strength: 0.5,
      type: "supportive",
      description: "3rd influences fortune."
    },
    {
      from: 3,
      to: 11,
      strength: 0.5,
      type: "supportive",
      description: "3rd influences gains."
    },
    {
      from: 5,
      to: 9,
      strength: 0.5,
      type: "supportive",
      description: "5th supports 9th."
    }
  ] as DrishtiRule[],

  QUARTER: [
    {
      from: 2,
      to: 6,
      strength: 0.25,
      type: "weak",
      description: "Weak karmic influence."
    },
    {
      from: 6,
      to: 12,
      strength: 0.25,
      type: "weak",
      description: "Weak karmic influence."
    }
  ] as DrishtiRule[]
};

/**
 * Houses that generally receive rather than cast primary drishti.
 */
export const PASSIVE_HOUSES = [7, 9, 10, 11, 12];

/**
 * SPECIAL RELATIONSHIP RULES
 */
export const LAL_KITAB_SPECIAL_RULES = {

  adjacent: [
    [1,2], [2,3], [3,4], [4,5], [5,6], [6,7],
    [7,8], [8,9], [9,10], [10,11], [11,12]
  ] as Array<[number, number]>,

  oppositeAxis: [
    [1,7], [2,8], [3,9], [4,10], [5,11], [6,12]
  ] as Array<[number, number]>,

  dharmaSupport: [
    [5,9]
  ] as Array<[number, number]>,

  ultiDrishti: {
    from: 8,
    to: 2,
    alwaysMalefic: true
  }
};

/**
 * HOUSE ACTIVATION RULES
 */
export const HOUSE_BEHAVIOR = {
  activeAspectHouses: [1,2,3,4,5,6,8],
  passiveAspectHouses: [7,9,10,11,12],
  oneWayAspectHouses: [1,4,8]
};

export function getLalKitabAspects(house: number): DrishtiRule[] {
  const result: DrishtiRule[] = [];
  for (const group of Object.values(LAL_KITAB_DRISHTI)) {
    for (const rule of group) {
      if (rule.from === house) {
        result.push(rule);
      }
    }
  }
  return result;
}

// ===== UNIVERSAL PLANET REMEDIES =====
export const UNIVERSAL_REMEDIES: Record<string, string[]> = {
  Sun: [
    "Offer water to Sun at sunrise.",
    "Donate wheat or jaggery.",
    "Respect father and government."
  ],
  Moon: [
    "Donate milk or rice.",
    "Respect mother.",
    "Avoid milk after sunset in specific Moon-afflicted cases."
  ],
  Mars: [
    "Donate red lentils.",
    "Feed monkeys.",
    "Avoid unnecessary anger."
  ],
  Mercury: [
    "Donate green moong.",
    "Feed cows.",
    "Avoid lying."
  ],
  Jupiter: [
    "Donate chana dal.",
    "Donate turmeric.",
    "Respect teachers."
  ],
  Venus: [
    "Donate white sweets.",
    "Respect women.",
    "Maintain cleanliness."
  ],
  Saturn: [
    "Feed black dogs.",
    "Help elderly and laborers.",
    "Avoid alcohol."
  ],
  Rahu: [
    "Donate black sesame.",
    "Feed stray dogs.",
    "Avoid deceit."
  ],
  Ketu: [
    "Feed dogs.",
    "Donate blankets.",
    "Respect saints."
  ]
};

// ===== ALL 9 PLANETS × 12 HOUSES REMEDIES =====
export const PLANET_HOUSE_REMEDIES: Record<string, Record<number, string>> = {
  Sun: {
    1: "Offer water to Sun daily.",
    2: "Donate wheat.",
    3: "Help younger siblings.",
    4: "Donate jaggery.",
    5: "Respect children and father.",
    6: "Offer jaggery in flowing water.",
    7: "Avoid ego in marriage.",
    8: "Donate copper.",
    9: "Respect father and guru.",
    10: "Serve government institutions.",
    11: "Donate wheat on Sunday.",
    12: "Donate red cloth."
  },
  Moon: {
    1: "Donate milk.",
    2: "Donate rice.",
    3: "Help sisters.",
    4: "Offer milk to Shiva.",
    5: "Donate white sweets.",
    6: "Offer milk in flowing water.",
    7: "Maintain emotional balance.",
    8: "Donate rice.",
    9: "Respect mother.",
    10: "Avoid milk after sunset.",
    11: "Donate silver.",
    12: "Donate white cloth."
  },
  Mars: {
    1: "Donate red lentils.",
    2: "Feed monkeys.",
    3: "Help brothers.",
    4: "Offer sindoor to Hanuman.",
    5: "Donate red cloth.",
    6: "Feed monkeys.",
    7: "Avoid anger.",
    8: "Donate red lentils.",
    9: "Respect elders.",
    10: "Serve soldiers or workers.",
    11: "Donate copper.",
    12: "Offer red flowers."
  },
  Mercury: {
    1: "Donate green moong.",
    2: "Feed cows.",
    3: "Help students.",
    4: "Donate green vegetables.",
    5: "Respect teachers.",
    6: "Donate stationery.",
    7: "Speak truth.",
    8: "Donate green moong.",
    9: "Help children.",
    10: "Donate books.",
    11: "Feed parrots where appropriate.",
    12: "Donate green cloth."
  },
  Jupiter: {
    1: "Donate turmeric.",
    2: "Donate chana dal.",
    3: "Respect guru.",
    4: "Offer yellow sweets.",
    5: "Donate books.",
    6: "Donate turmeric.",
    7: "Maintain honesty.",
    8: "Offer chana dal in a temple.",
    9: "Serve teachers.",
    10: "Donate yellow cloth.",
    11: "Donate saffron.",
    12: "Donate turmeric."
  },
  Venus: {
    1: "Donate white sweets.",
    2: "Respect women.",
    3: "Maintain cleanliness.",
    4: "Donate perfume.",
    5: "Donate white flowers.",
    6: "Avoid unnecessary luxury.",
    7: "Maintain marital harmony.",
    8: "Donate white cloth.",
    9: "Help daughters.",
    10: "Donate cosmetics.",
    11: "Donate sweets.",
    12: "Donate white rice."
  },
  Saturn: {
    1: "Feed monkeys and avoid alcohol.",
    2: "Visit temple barefoot for 43 days.",
    3: "Feed three black dogs.",
    4: "Feed crows and buffalo.",
    5: "Offer almonds in temple.",
    6: "Carry square silver.",
    7: "Keep promises.",
    8: "Donate black urad.",
    9: "Offer almonds in flowing water.",
    10: "Feed ten blind people.",
    11: "Offer oil for 43 days.",
    12: "Keep twelve almonds in black cloth inside an iron vessel."
  },
  Rahu: {
    1: "Donate black sesame.",
    2: "Feed dogs.",
    3: "Donate coconut.",
    4: "Donate mustard oil.",
    5: "Donate black cloth.",
    6: "Feed stray dogs.",
    7: "Avoid deceit.",
    8: "Donate black sesame.",
    9: "Help poor people.",
    10: "Donate coconut.",
    11: "Feed dogs.",
    12: "Donate blanket."
  },
  Ketu: {
    1: "Feed dogs.",
    2: "Donate blanket.",
    3: "Help saints.",
    4: "Donate sesame.",
    5: "Respect ancestors.",
    6: "Feed dogs.",
    7: "Avoid false promises.",
    8: "Donate blanket.",
    9: "Serve saints.",
    10: "Donate sesame.",
    11: "Feed dogs.",
    12: "Donate blanket."
  }
};

// ===== DRISHTI REMEDY RULES =====
export const DRISHTI_REMEDY_RULES = [
  {
    trigger: "8->2",
    condition: "alwaysMalefic",
    remedy: [
      "Strengthen the 2nd house planet.",
      "Donate according to the afflicted planet in House 2.",
      "Avoid harsh speech and maintain family peace."
    ]
  },
  {
    trigger: "1->7",
    condition: "enemyPlanets",
    remedy: [
      "Strengthen the weaker planet.",
      "Maintain marital harmony and avoid public ego."
    ]
  },
  {
    trigger: "4->10",
    condition: "maleficPlanet",
    remedy: [
      "Respect mother and elders.",
      "Avoid home-related disputes impacting career."
    ]
  },
  {
    trigger: "3->9",
    condition: "malefic",
    remedy: [
      "Help younger siblings.",
      "Respect guru and teachers."
    ]
  },
  {
    trigger: "3->11",
    condition: "malefic",
    remedy: [
      "Donate according to afflicted planet in 11th house."
    ]
  },
  {
    trigger: "5->9",
    condition: "malefic",
    remedy: [
      "Help children.",
      "Donate yellow items or books."
    ]
  },
  {
    trigger: "2->6",
    condition: "malefic",
    remedy: [
      "Donate according to afflicted planet in 6th house."
    ]
  },
  {
    trigger: "6->12",
    condition: "malefic",
    remedy: [
      "Strengthen the afflicted planet.",
      "Do charity before sunset."
    ]
  }
];

// ===== PLANET COMBINATION REMEDIES (HIGHEST PRIORITY) =====
export const PLANET_COMBINATION_REMEDIES: Record<string, { result: string; remedy: string }> = {
  "Sun+Saturn": { result: "Ego vs Karma conflict", remedy: "Donate wheat + serve elderly and laborers." },
  "Moon+Saturn": { result: "Emotional burden & anxiety", remedy: "Donate milk + feed crows regularly." },
  "Mars+Saturn": { result: "Property/sibling conflicts", remedy: "Donate black urad + red lentils." },
  "Jupiter+Saturn": { result: "Protective wisdom & law", remedy: "Offer chana dal + almonds in temple." },
  "Venus+Saturn": { result: "Wealth fluctuation & luxury delay", remedy: "Donate white sweets + feed black dogs." },
  "Mercury+Saturn": { result: "Business delay & intellectual burden", remedy: "Donate green moong + carry square silver." },
  "Rahu+Saturn": { result: "Heavy karmic lessons & foreign tech", remedy: "Donate black sesame + serve laborers." },
  "Ketu+Saturn": { result: "Detachment & spiritual pivot", remedy: "Feed dogs + donate black-and-white blanket." },
  "Sun+Rahu": { result: "Ego confusion & Grahan Yoga", remedy: "Donate coconut in flowing water." },
  "Moon+Rahu": { result: "Mental unrest & phobia", remedy: "Donate milk to needy people." },
  "Mars+Rahu": { result: "Aggression & Angarak Yoga", remedy: "Donate red lentils + black sesame." },
  "Jupiter+Rahu": { result: "Guru Chandal Yoga", remedy: "Donate chana dal to temple priest." },
  "Venus+Rahu": { result: "Relationship illusion & media tech", remedy: "Donate white cloth or perfume." },
  "Mercury+Rahu": { result: "Business deception & AI tech surges", remedy: "Donate green moong on Wednesday." },
  "Sun+Ketu": { result: "Ego separation & detachment", remedy: "Donate copper vessel water to Sun." },
  "Moon+Ketu": { result: "Emotional isolation & intuitive vision", remedy: "Donate rice or silver coin." },
  "Mars+Ketu": { result: "Sudden accidents & surgical skills", remedy: "Hanuman worship + offer sindoor." },
  "Jupiter+Ketu": { result: "High spiritual wisdom & research", remedy: "Donate turmeric or yellow cloth." },
  "Venus+Ketu": { result: "Relationship distance & fine arts", remedy: "Donate white sweets to young girls." },
  "Mercury+Ketu": { result: "Software coding & communication issues", remedy: "Donate green moong to students." }
};

export interface EvaluatedAspectResult {
  rule: DrishtiRule;
  fromPlanets: string[];
  toPlanets: string[];
  aspectStrengthPct: number;
  interpretation: { en: string; hi: string; gu: string };
}

export interface EvaluatedSpecialRelationship {
  type: 'ADJACENT' | 'OPPOSITE_AXIS' | 'DHARMA_SUPPORT' | 'ULTI_DRISHTI';
  houses: [number, number];
  planetsA: string[];
  planetsB: string[];
  description: { en: string; hi: string; gu: string };
}

export interface FullLalKitabRemedyResult {
  houseRemedies: Array<{ planet: string; house: number; remedy: string }>;
  drishtiRemedies: Array<{ trigger: string; remedy: string[] }>;
  combinationRemedies: Array<{ combo: string; result: string; remedy: string }>;
  universalRemedies: Array<{ planet: string; remedies: string[] }>;
}

export interface LalKitabDrishtiReport {
  activeAspects: EvaluatedAspectResult[];
  specialRelationships: EvaluatedSpecialRelationship[];
  houseBehaviorSummary: {
    activeHouses: number[];
    passiveHouses: number[];
    oneWayHouses: number[];
  };
  remedyAudit: FullLalKitabRemedyResult;
}

export function evaluateChartLalKitabAspects(kundali: KundaliResult, lang: string = 'hi'): LalKitabDrishtiReport {
  const isHi = lang === 'hi' || lang === 'hinglish';
  const isGu = lang === 'gu';

  const houseMap: Record<number, string[]> = {};
  for (let i = 1; i <= 12; i++) houseMap[i] = [];

  kundali.planets.forEach((p: PlanetDetail) => {
    const cleanName = p.name.split(' ')[0];
    if (houseMap[p.house]) {
      houseMap[p.house].push(cleanName);
    }
  });

  const activeAspects: EvaluatedAspectResult[] = [];
  const allRules: DrishtiRule[] = [
    ...LAL_KITAB_DRISHTI.FULL,
    ...LAL_KITAB_DRISHTI.HALF,
    ...LAL_KITAB_DRISHTI.QUARTER
  ];

  allRules.forEach(rule => {
    const fromPlanets = houseMap[rule.from] || [];
    const toPlanets = houseMap[rule.to] || [];

    if (fromPlanets.length > 0) {
      const pct = rule.strength * 100;
      let interpEn = `House ${rule.from} (${fromPlanets.join(', ')}) casts ${pct}% aspect on House ${rule.to}`;
      let interpHi = `भाव ${rule.from} (${fromPlanets.join(', ')}) भाव ${rule.to} को ${pct}% दृष्टि से देख रहा है`;
      let interpGu = `ભાવ ${rule.from} (${fromPlanets.join(', ')}) ભાવ ${rule.to} ને ${pct}% દ્રષ્ટિથી જુએ છે`;

      if (toPlanets.length > 0) {
        interpEn += ` impacting ${toPlanets.join(', ')}.`;
        interpHi += ` जिससे ${toPlanets.join(', ')} प्रभावित हो रहे हैं।`;
        interpGu += ` જેથી ${toPlanets.join(', ')} પ્રભાવિત થાય છે.`;
      } else {
        interpEn += ` (Empty target house).`;
        interpHi += ` (रिक्त भाव)।`;
        interpGu += ` (ખાલી ભાવ).`;
      }

      if (rule.alwaysMalefic) {
        interpEn += ` 🛑 Ulti Drishti (Reverse Aspect): Always casts malefic impact!`;
        interpHi += ` 🛑 उल्टी दृष्टि (अष्टम से द्वितीय): सदैव मंदा/कष्टकारी प्रभाव छोड़ती है!`;
        interpGu += ` 🛑 ઉલ્ટી દ્રષ્ટિ: અશુભ અસર આપે છે!`;
      }

      activeAspects.push({
        rule,
        fromPlanets,
        toPlanets,
        aspectStrengthPct: pct,
        interpretation: { en: interpEn, hi: interpHi, gu: interpGu }
      });
    }
  });

  const specialRelationships: EvaluatedSpecialRelationship[] = [];

  LAL_KITAB_SPECIAL_RULES.adjacent.forEach(([hA, hB]) => {
    const pA = houseMap[hA] || [];
    const pB = houseMap[hB] || [];
    if (pA.length > 0 && pB.length > 0) {
      specialRelationships.push({
        type: 'ADJACENT',
        houses: [hA, hB],
        planetsA: pA,
        planetsB: pB,
        description: {
          en: `Padosi Ghar (Adjacent Houses ${hA}-${hB}): ${pA.join(', ')} and ${pB.join(', ')} share mutual neighborly energy.`,
          hi: `पड़ोसी घर (भाव ${hA}-${hB}): ${pA.join(', ')} व ${pB.join(', ')} एक-दूसरे को पड़ोसी ऊर्जा प्रदान करते हैं।`,
          gu: `પાડોશી ઘર (ભાવ ${hA}-${hB}): ${pA.join(', ')} અને ${pB.join(', ')} પાડોશી ઊર્જા આપે છે.`
        }
      });
    }
  });

  LAL_KITAB_SPECIAL_RULES.oppositeAxis.forEach(([hA, hB]) => {
    const pA = houseMap[hA] || [];
    const pB = houseMap[hB] || [];
    if (pA.length > 0 && pB.length > 0) {
      specialRelationships.push({
        type: 'OPPOSITE_AXIS',
        houses: [hA, hB],
        planetsA: pA,
        planetsB: pB,
        description: {
          en: `Opposite Axis / Virtual Conjunction (Houses ${hA} & ${hB}): ${pA.join(', ')} and ${pB.join(', ')} act as if in virtual conjunction!`,
          hi: `आमने-सामने की दृष्टि / आभासी युति (भाव ${hA} व ${hB}): ${pA.join(', ')} और ${pB.join(', ')} एक साथ बैठे ग्रहों की भांति व्यवहार करते हैं!`,
          gu: `આભાસી યુતિ (ભાવ ${hA} અને ${hB}): ${pA.join(', ')} અને ${pB.join(', ')} યુતિ સમાન અસર આપે છે!`
        }
      });
    }
  });

  LAL_KITAB_SPECIAL_RULES.dharmaSupport.forEach(([hA, hB]) => {
    const pA = houseMap[hA] || [];
    const pB = houseMap[hB] || [];
    if (pA.length > 0 || pB.length > 0) {
      specialRelationships.push({
        type: 'DHARMA_SUPPORT',
        houses: [hA, hB],
        planetsA: pA,
        planetsB: pB,
        description: {
          en: `Dharma Axis Support (House 5 -> House 9): Creative intellect (5th) actively supports spiritual destiny and fortune (9th).`,
          hi: `धर्म अक्ष सहयोग (भाव 5 -> भाव 9): पूर्व पुण्य व बुद्धि (भाव 5) सीधे भाग्य (भाव 9) का संवर्धन करती है।`,
          gu: `ધર્મ અક્ષ સહયોગ: ૫મો ભાવ ૯મા ભાવનું સમર્થન કરે છે.`
        }
      });
    }
  });

  const h8Planets = houseMap[8] || [];
  const h2Planets = houseMap[2] || [];
  if (h8Planets.length > 0) {
    specialRelationships.push({
      type: 'ULTI_DRISHTI',
      houses: [8, 2],
      planetsA: h8Planets,
      planetsB: h2Planets,
      description: {
        en: `Ulti Drishti Active (House 8 -> House 2): ${h8Planets.join(', ')} in House 8 casts malefic reverse aspect on House 2 (${h2Planets.length > 0 ? h2Planets.join(', ') : 'Empty'}). Remedies required!`,
        hi: `उल्टी दृष्टि सक्रिय (भाव 8 -> भाव 2): भाव 8 के ग्रह (${h8Planets.join(', ')}) धन व कुटुंब भाव (2) को पीड़ित कर रहे हैं। विशेष उपाय आवश्यक!`,
        gu: `ઉલ્ટી દ્રષ્ટિ સક્રિય (ભાવ ૮ -> ભાવ ૨): ભાવ ૮ ના ગ્રહો (${h8Planets.join(', ')}) બીજા ભાવને પીડિત કરે છે.`
      }
    });
  }

  // ===== DECISION FLOW FOR REMEDIES =====
  const houseRemedies: Array<{ planet: string; house: number; remedy: string }> = [];
  const drishtiRemedies: Array<{ trigger: string; remedy: string[] }> = [];
  const combinationRemedies: Array<{ combo: string; result: string; remedy: string }> = [];
  const universalRemedies: Array<{ planet: string; remedies: string[] }> = [];

  // 1. House Remedies
  kundali.planets.forEach(p => {
    const pKey = Object.keys(PLANET_HOUSE_REMEDIES).find(k => p.name.toLowerCase().includes(k.toLowerCase()));
    if (pKey && PLANET_HOUSE_REMEDIES[pKey]?.[p.house]) {
      houseRemedies.push({
        planet: pKey,
        house: p.house,
        remedy: PLANET_HOUSE_REMEDIES[pKey][p.house]
      });
    }
    if (pKey && UNIVERSAL_REMEDIES[pKey]) {
      universalRemedies.push({
        planet: pKey,
        remedies: UNIVERSAL_REMEDIES[pKey]
      });
    }
  });

  // 2. Drishti Remedies
  activeAspects.forEach(aspect => {
    const trig = `${aspect.rule.from}->${aspect.rule.to}`;
    const matchedRule = DRISHTI_REMEDY_RULES.find(r => r.trigger === trig);
    if (matchedRule) {
      drishtiRemedies.push({
        trigger: trig,
        remedy: matchedRule.remedy
      });
    }
  });

  // 3. Planet Combination Remedies
  const pList = kundali.planets.map(p => p.name.split(' ')[0]);
  for (let i = 0; i < kundali.planets.length; i++) {
    for (let j = i + 1; j < kundali.planets.length; j++) {
      const p1 = kundali.planets[i];
      const p2 = kundali.planets[j];

      // Siting in same house or opposite house (Virtual Conjunction)
      const sameHouse = p1.house === p2.house;
      const oppHouse = Math.abs(p1.house - p2.house) === 6;

      if (sameHouse || oppHouse) {
        const name1 = p1.name.split(' ')[0];
        const name2 = p2.name.split(' ')[0];
        const comboKey1 = `${name1}+${name2}`;
        const comboKey2 = `${name2}+${name1}`;

        const foundCombo = PLANET_COMBINATION_REMEDIES[comboKey1] || PLANET_COMBINATION_REMEDIES[comboKey2];
        if (foundCombo) {
          combinationRemedies.push({
            combo: `${name1} + ${name2} (${sameHouse ? 'Same House' : 'Opposite Axis'})`,
            result: foundCombo.result,
            remedy: foundCombo.remedy
          });
        }
      }
    }
  }

  return {
    activeAspects,
    specialRelationships,
    houseBehaviorSummary: {
      activeHouses: HOUSE_BEHAVIOR.activeAspectHouses,
      passiveHouses: HOUSE_BEHAVIOR.passiveAspectHouses,
      oneWayHouses: HOUSE_BEHAVIOR.oneWayAspectHouses
    },
    remedyAudit: {
      houseRemedies,
      drishtiRemedies,
      combinationRemedies,
      universalRemedies
    }
  };
}
