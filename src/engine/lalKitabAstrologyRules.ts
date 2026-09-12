import { KundaliResult, PlanetDetail, HouseDetail } from './kundaliEngine';

export interface LalKitabRule {
  id: string;
  planet: string;
  house: number;
  isGoodForNative: boolean;
  isBadForFamilyOrMother: boolean;
  title: Record<string, string>;
  description: Record<string, string>;
  maternalImpact?: Record<string, string>;
  remedies: Record<string, string[]>;
  pukkaGharNote?: Record<string, string>;
}

export interface LalKitabAspect {
  fromHouse: number;
  toHouse: number;
  percentage: number;
  description: Record<string, string>;
}

export interface LalKitabDebt {
  id: string;
  name: Record<string, string>;
  cause: Record<string, string>;
  impact: Record<string, string>;
  remedy: Record<string, string>;
  isApplicable: boolean;
}

export interface EvaluatedLalKitabReport {
  appliedRules: LalKitabRule[];
  aspects: LalKitabAspect[];
  pukkaGharSummary: { house: number; owner: string; occupant: string }[];
  debts: LalKitabDebt[];
}

export const LAL_KITAB_PUKKA_GHAR: Record<number, string> = {
  1: 'Surya (Sun)',
  2: 'Brihaspati (Jupiter)',
  3: 'Mangala (Mars)',
  4: 'Chandra (Moon)',
  5: 'Brihaspati (Jupiter)',
  6: 'Budha (Mercury) & Ketu',
  7: 'Shukra (Venus) & Budha',
  8: 'Shani (Saturn) & Mangala',
  9: 'Brihaspati (Jupiter)',
  10: 'Shani (Saturn)',
  11: 'Brihaspati (Jupiter)',
  12: 'Rahu'
};

export {
  LAL_KITAB_DRISHTI,
  PASSIVE_HOUSES,
  LAL_KITAB_SPECIAL_RULES,
  HOUSE_BEHAVIOR,
  getLalKitabAspects,
  evaluateChartLalKitabAspects
} from './lalKitabDrishtiEngine';

export const LAL_KITAB_ASPECT_RULES: LalKitabAspect[] = [
  {
    fromHouse: 1,
    toHouse: 7,
    percentage: 100,
    description: {
      en: '1st house gives full direct one-way aspect to 7th (100% Full Aspect)',
      hi: 'प्रथम भाव 7वें भाव को पूर्ण एकतरफा सीधी दृष्टि (100%) प्रदान करता है',
      gu: 'પ્રથમ ભાવ ૭મા ભાવને પૂર્ણ એકતરફી દ્રષ્ટિ (૧૦૦%) આપે છે'
    }
  },
  {
    fromHouse: 4,
    toHouse: 10,
    percentage: 100,
    description: {
      en: '4th house gives full direct one-way aspect to 10th (Mother/Home affects Career - 100%)',
      hi: 'चतुर्थ भाव 10वें भाव को पूर्ण एकतरफा सीधी दृष्टि (100%) प्रदान करता है',
      gu: 'ચોથો ભાવ ૧૦મા ભાવને પૂર્ણ એકતરફી દ્રષ્ટિ (૧૦૦%) આપે છે'
    }
  },
  {
    fromHouse: 8,
    toHouse: 2,
    percentage: 100,
    description: {
      en: 'Famous Ulti Drishti (8th -> 2nd house): Always malefic reverse aspect (100%)',
      hi: 'प्रसिद्ध उल्टी दृष्टि (अष्टम से द्वितीय भाव): सदैव मंदा व कष्टकारी विपरीत प्रभाव (100%)',
      gu: 'પ્રસિદ્ધ ઉલ્ટી દ્રષ્ટિ (૮મો -> ૨જો ભાવ): અશુભ દ્રષ્ટિ (૧૦૦%)'
    }
  },
  {
    fromHouse: 3,
    toHouse: 9,
    percentage: 50,
    description: {
      en: '3rd house influences 9th house fortune with half strength (50% Half Aspect)',
      hi: 'तृतीय भाव 9वें भाव (भाग्य) को आधी शक्ति (50%) से प्रभावित करता है',
      gu: 'ત્રીજો ભાવ ૯મા ભાવને ૫૦% દ્રષ્ટિથી પ્રભાવિત કરે છે'
    }
  },
  {
    fromHouse: 3,
    toHouse: 11,
    percentage: 50,
    description: {
      en: '3rd house influences 11th house gains with half strength (50% Half Aspect)',
      hi: 'तृतीय भाव 11वें भाव (लाभ) को आधी शक्ति (50%) से प्रभावित करता है',
      gu: 'ત્રીજો ભાવ ૧૧મા ભાવને ૫૦% દ્રષ્ટિથી પ્રભાવિત કરે છે'
    }
  },
  {
    fromHouse: 5,
    toHouse: 9,
    percentage: 50,
    description: {
      en: '5th house supports 9th house fortune with half strength (50% Half Aspect)',
      hi: 'पंचम भाव 9वें भाव (भाग्य) को 50% दृष्टि से सहयोग प्रदान करता है',
      gu: 'પાંચમો ભાવ ૯મા ભાવને ૫૦% દ્રષ્ટિથી સહયોગ આપે છે'
    }
  },
  {
    fromHouse: 2,
    toHouse: 6,
    percentage: 25,
    description: {
      en: '2nd house has weak karmic influence on 6th house (25% Quarter Aspect)',
      hi: 'द्वितीय भाव 6ठे भाव (ऋण/रोग) पर मंद दृष्टि (25%) डालता है',
      gu: 'બીજો ભાવ ૬ઠ્ઠા ભાવ પર ૨૫% દ્રષ્ટિ નાખે છે'
    }
  },
  {
    fromHouse: 6,
    toHouse: 12,
    percentage: 25,
    description: {
      en: '6th house has weak karmic influence on 12th house (25% Quarter Aspect)',
      hi: '6ठा भाव 12वें भाव (मोक्ष/व्यय) पर मंद दृष्टि (25%) डालता है',
      gu: '૬ઠ્ઠો ભાવ ૧૨મા ભાવ પર ૨૫% દ્રષ્ટિ નાખે છે'
    }
  }
];

export const LAL_KITAB_RULES_REGISTRY: LalKitabRule[] = [
  {
    id: "lk_sun_h1",
    planet: "Surya (Sun)",
    house: 1,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Surya (Sun) in House 1",
      "hi": "लाल किताब: सूर्य 1वें भाव में",
      "gu": "લાલ કિતાબ: સૂર્ય 1મા ભાવમાં"
},
    description: {
      "en": "Surya (Sun) resides in House 1. Public water facility, copper vessel water to sun.",
      "hi": "सूर्य 1वें भाव में स्थित है। तांबे के लोटे से सूर्य जल अर्पित करें, सार्वजनिक प्याऊ लगवाएं।",
      "gu": "સૂર્ય 1મા ભાવમાં છે. સૂર્યનારાયણને જળ અર્પણ કરવું, પાણીની સગવડ કરવી."
},
    remedies: {
      "en": [
            "💡 Public water facility, copper vessel water to sun.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 तांबे के लोटे से सूर्य जल अर्पित करें, सार्वजनिक प्याऊ लगवाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 સૂર્યનારાયણને જળ અર્પણ કરવું, પાણીની સગવડ કરવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_sun_h2",
    planet: "Surya (Sun)",
    house: 2,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Surya (Sun) in House 2",
      "hi": "लाल किताब: सूर्य 2वें भाव में",
      "gu": "લાલ કિતાબ: સૂર્ય 2મા ભાવમાં"
},
    description: {
      "en": "Surya (Sun) resides in House 2. Donate coconut/wheat, mother/elders blessing.",
      "hi": "सूर्य 2वें भाव में स्थित है। नारियल/गेहूं दान करें, बड़े-बुजुर्गों का आशीर्वाद लें।",
      "gu": "સૂર્ય 2મા ભાવમાં છે. નારિયેળ અને ઘઉંનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Donate coconut/wheat, mother/elders blessing.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 नारियल/गेहूं दान करें, बड़े-बुजुर्गों का आशीर्वाद लें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 નારિયેળ અને ઘઉંનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_sun_h3",
    planet: "Surya (Sun)",
    house: 3,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Surya (Sun) in House 3",
      "hi": "लाल किताब: सूर्य 3वें भाव में",
      "gu": "લાલ કિતાબ: સૂર્ય 3મા ભાવમાં"
},
    description: {
      "en": "Surya (Sun) resides in House 3. Silver coin in pocket, serve younger siblings.",
      "hi": "सूर्य 3वें भाव में स्थित है। जेब में चांदी का सिक्का रखें, छोटे भाइयों का सहयोग करें।",
      "gu": "સૂર્ય 3મા ભાવમાં છે. ચાંદીનો સિક્કો ખિસ્સામાં રાખવો."
},
    remedies: {
      "en": [
            "💡 Silver coin in pocket, serve younger siblings.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 जेब में चांदी का सिक्का रखें, छोटे भाइयों का सहयोग करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચાંદીનો સિક્કો ખિસ્સામાં રાખવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_sun_h4",
    planet: "Surya (Sun)",
    house: 4,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Surya (Sun) in House 4",
      "hi": "लाल किताब: सूर्य 4वें भाव में",
      "gu": "લાલ કિતાબ: સૂર્ય 4મા ભાવમાં"
},
    description: {
      "en": "Surya (Sun) resides in House 4. Rainwater/river water in silver container at home, milk/rice on Mondays.",
      "hi": "सूर्य 4वें भाव में स्थित है। चांदी के बर्तन में बारिश का पानी रखें, सोमवार को दूध-चावल दान करें।",
      "gu": "સૂર્ય 4મા ભાવમાં છે. ચાંદીના પાત્રમાં શુદ્ધ જળ રાખવું."
},
    remedies: {
      "en": [
            "💡 Rainwater/river water in silver container at home, milk/rice on Mondays.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 चांदी के बर्तन में बारिश का पानी रखें, सोमवार को दूध-चावल दान करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચાંદીના પાત્રમાં શુદ્ધ જળ રાખવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_sun_h5",
    planet: "Surya (Sun)",
    house: 5,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Surya (Sun) in House 5",
      "hi": "लाल किताब: सूर्य 5वें भाव में",
      "gu": "લાલ કિતાબ: સૂર્ય 5મા ભાવમાં"
},
    description: {
      "en": "Surya (Sun) resides in House 5. Almonds/mustard oil at temple, avoid false promises.",
      "hi": "सूर्य 5वें भाव में स्थित है। मंदिर में बादाम या सरसों तेल दान करें, सत्य बोलें।",
      "gu": "સૂર્ય 5મા ભાવમાં છે. મંદિરમાં બદામનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Almonds/mustard oil at temple, avoid false promises.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 मंदिर में बादाम या सरसों तेल दान करें, सत्य बोलें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 મંદિરમાં બદામનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_sun_h6",
    planet: "Surya (Sun)",
    house: 6,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Surya (Sun) in House 6",
      "hi": "लाल किताब: सूर्य 6वें भाव में",
      "gu": "લાલ કિતાબ: સૂર્ય 6મા ભાવમાં"
},
    description: {
      "en": "Surya (Sun) resides in House 6. Feed wheat/jaggery to monkeys, 6 copper coins in river.",
      "hi": "सूर्य 6वें भाव में स्थित है। बंदरों को गुड़-गेहूं खिलाएं, 6 तांबे के सिक्के जल में बहाएं।",
      "gu": "સૂર્ય 6મા ભાવમાં છે. વાંદરાઓને ઘઉં અને ગોળ ખવડાવવા."
},
    remedies: {
      "en": [
            "💡 Feed wheat/jaggery to monkeys, 6 copper coins in river.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 बंदरों को गुड़-गेहूं खिलाएं, 6 तांबे के सिक्के जल में बहाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 વાંદરાઓને ઘઉં અને ગોળ ખવડાવવા.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_sun_h7",
    planet: "Surya (Sun)",
    house: 7,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Surya (Sun) in House 7",
      "hi": "लाल किताब: सूर्य 7वें भाव में",
      "gu": "લાલ કિતાબ: સૂર્ય 7મા ભાવમાં"
},
    description: {
      "en": "Surya (Sun) resides in House 7. Silver square piece in wallet, feed sweet chapatis to cows.",
      "hi": "सूर्य 7वें भाव में स्थित है। चांदी का चौकोर टुकड़ा पर्स में रखें, गाय को मीठी रोटी दें।",
      "gu": "સૂર્ય 7મા ભાવમાં છે. ચાંદીનો ચોરસ ટુકડો પાસે રાખવો."
},
    remedies: {
      "en": [
            "💡 Silver square piece in wallet, feed sweet chapatis to cows.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 चांदी का चौकोर टुकड़ा पर्स में रखें, गाय को मीठी रोटी दें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચાંદીનો ચોરસ ટુકડો પાસે રાખવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_sun_h8",
    planet: "Surya (Sun)",
    house: 8,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Surya (Sun) in House 8",
      "hi": "लाल किताब: सूर्य 8वें भाव में",
      "gu": "લાલ કિતાબ: સૂર્ય 8મા ભાવમાં"
},
    description: {
      "en": "Surya (Sun) resides in House 8. 8 copper coins in river for 8 days, refuse unearned gifts.",
      "hi": "सूर्य 8वें भाव में स्थित है। 8 तांबे के सिक्के 8 दिन बहते पानी में डालें, मुफ्त चीजें न लें।",
      "gu": "સૂર્ય 8મા ભાવમાં છે. ૮ તાંબાના સિક્કા વહેતા પાણીમાં પધરાવવા."
},
    remedies: {
      "en": [
            "💡 8 copper coins in river for 8 days, refuse unearned gifts.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 8 तांबे के सिक्के 8 दिन बहते पानी में डालें, मुफ्त चीजें न लें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ૮ તાંબાના સિક્કા વહેતા પાણીમાં પધરાવવા.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_sun_h9",
    planet: "Surya (Sun)",
    house: 9,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Surya (Sun) in House 9",
      "hi": "लाल किताब: सूर्य 9वें भाव में",
      "gu": "લાલ કિતાબ: સૂર્ય 9મા ભાવમાં"
},
    description: {
      "en": "Surya (Sun) resides in House 9. Donate brass/turmeric at temple, wear silver square piece.",
      "hi": "सूर्य 9वें भाव में स्थित है। पीतल के बर्तन या हल्दी दान करें, गले में चांदी धारण करें।",
      "gu": "સૂર્ય 9મા ભાવમાં છે. પીતળના વાસણ કે હળદરનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Donate brass/turmeric at temple, wear silver square piece.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 पीतल के बर्तन या हल्दी दान करें, गले में चांदी धारण करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 પીતળના વાસણ કે હળદરનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_sun_h10",
    planet: "Surya (Sun)",
    house: 10,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Surya (Sun) in House 10",
      "hi": "लाल किताब: सूर्य 10वें भाव में",
      "gu": "લાલ કિતાબ: સૂર્ય 10મા ભાવમાં"
},
    description: {
      "en": "Surya (Sun) resides in House 10. Copper coins in flowing river, high moral integrity.",
      "hi": "सूर्य 10वें भाव में स्थित है। तांबे के सिक्के नदी में प्रवाहित करें, सत्य निष्ठा रखें।",
      "gu": "સૂર્ય 10મા ભાવમાં છે. તાંબાના સિક્કા વહેતા પાણીમાં પધરાવવા."
},
    remedies: {
      "en": [
            "💡 Copper coins in flowing river, high moral integrity.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 तांबे के सिक्के नदी में प्रवाहित करें, सत्य निष्ठा रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 તાંબાના સિક્કા વહેતા પાણીમાં પધરાવવા.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_sun_h11",
    planet: "Surya (Sun)",
    house: 11,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Surya (Sun) in House 11",
      "hi": "लाल किताब: सूर्य 11वें भाव में",
      "gu": "લાલ કિતાબ: સૂર્ય 11મા ભાવમાં"
},
    description: {
      "en": "Surya (Sun) resides in House 11. Drink sweet water before leaving home, refrain from Sunday alcohol.",
      "hi": "सूर्य 11वें भाव में स्थित है। काम पर जाने से पूर्व मीठा पानी पिएं, रविवार को संयम रखें।",
      "gu": "સૂર્ય 11મા ભાવમાં છે. ગળ્યું પાણી પીને ઘર બહાર નીકળવું."
},
    remedies: {
      "en": [
            "💡 Drink sweet water before leaving home, refrain from Sunday alcohol.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 काम पर जाने से पूर्व मीठा पानी पिएं, रविवार को संयम रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ગળ્યું પાણી પીને ઘર બહાર નીકળવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_sun_h12",
    planet: "Surya (Sun)",
    house: 12,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Surya (Sun) in House 12",
      "hi": "लाल किताब: सूर्य 12वें भाव में",
      "gu": "લાલ કિતાબ: સૂર્ય 12મા ભાવમાં"
},
    description: {
      "en": "Surya (Sun) resides in House 12. Feed jaggery/wheat to monkeys, brass pot water at bedside.",
      "hi": "सूर्य 12वें भाव में स्थित है। बंदरों को भोजन कराएं, सिरहाने पीतल के बर्तन में पानी रखें।",
      "gu": "સૂર્ય 12મા ભાવમાં છે. પીતળના પાત્રમાં પાણી રાખી વહેલી સવારે વનસ્પતિમાં રેડવું."
},
    remedies: {
      "en": [
            "💡 Feed jaggery/wheat to monkeys, brass pot water at bedside.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 बंदरों को भोजन कराएं, सिरहाने पीतल के बर्तन में पानी रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 પીતળના પાત્રમાં પાણી રાખી વહેલી સવારે વનસ્પતિમાં રેડવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_moon_h1",
    planet: "Chandra (Moon)",
    house: 1,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Chandra (Moon) in House 1",
      "hi": "लाल किताब: चंद्रमा 1वें भाव में",
      "gu": "લાલ કિતાબ: ચંદ્ર 1મા ભાવમાં"
},
    description: {
      "en": "Chandra (Moon) resides in House 1. Blessings from mother daily, drink water in silver glass.",
      "hi": "चंद्रमा 1वें भाव में स्थित है। माता के चरण स्पर्श करें, चांदी के ग्लास में पानी पिएं।",
      "gu": "ચંદ્ર 1મા ભાવમાં છે. માતાના આશીર્વાદ લેવા, ચાંદીના ગ્લાસમાં પાણી પીવું."
},
    remedies: {
      "en": [
            "💡 Blessings from mother daily, drink water in silver glass.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 माता के चरण स्पर्श करें, चांदी के ग्लास में पानी पिएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 માતાના આશીર્વાદ લેવા, ચાંદીના ગ્લાસમાં પાણી પીવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_moon_h2",
    planet: "Chandra (Moon)",
    house: 2,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Chandra (Moon) in House 2",
      "hi": "लाल किताब: चंद्रमा 2वें भाव में",
      "gu": "લાલ કિતાબ: ચંદ્ર 2મા ભાવમાં"
},
    description: {
      "en": "Chandra (Moon) resides in House 2. Raw silver/coin from mother wrapped in white cloth, donate milk/curd.",
      "hi": "चंद्रमा 2वें भाव में स्थित है। माता से चांदी का सिक्का लेकर सफेद कपड़े में रखें, दूध दान करें।",
      "gu": "ચંદ્ર 2મા ભાવમાં છે. માતા પાસેથી ચાંદીનો સિક્કો આશીર્વાદ રૂપે લેવો."
},
    remedies: {
      "en": [
            "💡 Raw silver/coin from mother wrapped in white cloth, donate milk/curd.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 माता से चांदी का सिक्का लेकर सफेद कपड़े में रखें, दूध दान करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 માતા પાસેથી ચાંદીનો સિક્કો આશીર્વાદ રૂપે લેવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_moon_h3",
    planet: "Chandra (Moon)",
    house: 3,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Chandra (Moon) in House 3",
      "hi": "लाल किताब: चंद्रमा 3वें भाव में",
      "gu": "લાલ કિતાબ: ચંદ્ર 3મા ભાવમાં"
},
    description: {
      "en": "Chandra (Moon) resides in House 3. Donate wheat and milk at temple, avoid using house water for others.",
      "hi": "चंद्रमा 3वें भाव में स्थित है। धार्मिक स्थान पर दूध और गेहूं दान करें।",
      "gu": "ચંદ્ર 3મા ભાવમાં છે. મંદિરમાં દૂધ અને ચોખાનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Donate wheat and milk at temple, avoid using house water for others.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 धार्मिक स्थान पर दूध और गेहूं दान करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 મંદિરમાં દૂધ અને ચોખાનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_moon_h4",
    planet: "Chandra (Moon)",
    house: 4,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Chandra (Moon) in House 4",
      "hi": "लाल किताब: चंद्रमा 4वें भाव में",
      "gu": "લાલ કિતાબ: ચંદ્ર 4મા ભાવમાં"
},
    description: {
      "en": "Chandra (Moon) resides in House 4. Serve milk/kheer to young girls, daily morning blessings from mother.",
      "hi": "चंद्रमा 4वें भाव में स्थित है। कन्याओं को दूध-खीर खिलाएं, माता का आशीर्वाद लें।",
      "gu": "ચંદ્ર 4મા ભાવમાં છે. બાળકોને દૂધ કે ખીર આપવી."
},
    remedies: {
      "en": [
            "💡 Serve milk/kheer to young girls, daily morning blessings from mother.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 कन्याओं को दूध-खीर खिलाएं, माता का आशीर्वाद लें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 બાળકોને દૂધ કે ખીર આપવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_moon_h5",
    planet: "Chandra (Moon)",
    house: 5,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Chandra (Moon) in House 5",
      "hi": "लाल किताब: चंद्रमा 5वें भाव में",
      "gu": "લાલ કિતાબ: ચંદ્ર 5મા ભાવમાં"
},
    description: {
      "en": "Chandra (Moon) resides in House 5. Maintain high morality, donate milk/sugar at temple on Mondays.",
      "hi": "चंद्रमा 5वें भाव में स्थित है। सोमवार को दूध या शक्कर दान करें, सात्विक रहें।",
      "gu": "ચંદ્ર 5મા ભાવમાં છે. સોમવારે મંદિરમાં દૂધનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Maintain high morality, donate milk/sugar at temple on Mondays.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 सोमवार को दूध या शक्कर दान करें, सात्विक रहें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 સોમવારે મંદિરમાં દૂધનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_moon_h6",
    planet: "Chandra (Moon)",
    house: 6,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Chandra (Moon) in House 6",
      "hi": "लाल किताब: चंद्रमा 6वें भाव में",
      "gu": "લાલ કિતાબ: ચંદ્ર 6મા ભાવમાં"
},
    description: {
      "en": "Chandra (Moon) resides in House 6. Serve milk to father/elders, store water pot on roof.",
      "hi": "चंद्रमा 6वें भाव में स्थित है। पिता/बुजुर्गों को दूध पिलाएं, छत पर जलपात्र रखें।",
      "gu": "ચંદ્ર 6મા ભાવમાં છે. વડીલોની સેવા કરવી."
},
    remedies: {
      "en": [
            "💡 Serve milk to father/elders, store water pot on roof.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 पिता/बुजुर्गों को दूध पिलाएं, छत पर जलपात्र रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 વડીલોની સેવા કરવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_moon_h7",
    planet: "Chandra (Moon)",
    house: 7,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Chandra (Moon) in House 7",
      "hi": "लाल किताब: चंद्रमा 7वें भाव में",
      "gu": "લાલ કિતાબ: ચંદ્ર 7મા ભાવમાં"
},
    description: {
      "en": "Chandra (Moon) resides in House 7. Do not sell milk/milk products for profit, keep silver coin in pocket.",
      "hi": "चंद्रमा 7वें भाव में स्थित है। दूध का व्यावसायिक विक्रय न करें, चांदी पास रखें।",
      "gu": "ચંદ્ર 7મા ભાવમાં છે. દૂધનો વેપાર કરવો નહીં."
},
    remedies: {
      "en": [
            "💡 Do not sell milk/milk products for profit, keep silver coin in pocket.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 दूध का व्यावसायिक विक्रय न करें, चांदी पास रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 દૂધનો વેપાર કરવો નહીં.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_moon_h8",
    planet: "Chandra (Moon)",
    house: 8,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Chandra (Moon) in House 8",
      "hi": "लाल किताब: चंद्रमा 8वें भाव में",
      "gu": "લાલ કિતાબ: ચંદ્ર 8મા ભાવમાં"
},
    description: {
      "en": "Chandra (Moon) resides in House 8. Offer milk or rice at temple, avoid covered well inside house.",
      "hi": "चंद्रमा 8वें भाव में स्थित है। मंदिर में दूध-चावल अर्पित करें, घर में ढका कुआं न रखें।",
      "gu": "ચંદ્ર 8મા ભાવમાં છે. ચોખાનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Offer milk or rice at temple, avoid covered well inside house.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 मंदिर में दूध-चावल अर्पित करें, घर में ढका कुआं न रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચોખાનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_moon_h9",
    planet: "Chandra (Moon)",
    house: 9,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Chandra (Moon) in House 9",
      "hi": "लाल किताब: चंद्रमा 9वें भाव में",
      "gu": "લાલ કિતાબ: ચંદ્ર 9મા ભાવમાં"
},
    description: {
      "en": "Chandra (Moon) resides in House 9. Daily water to Shivling, keep silver pot with Ganga water in locker.",
      "hi": "चंद्रमा 9वें भाव में स्थित है। शिवलिंग पर जल चढ़ाएं, लॉकर में चांदी के बर्तन में गंगाजल रखें।",
      "gu": "ચંદ્ર 9મા ભાવમાં છે. શિવલિંગ પર જળ ચડાવવું."
},
    remedies: {
      "en": [
            "💡 Daily water to Shivling, keep silver pot with Ganga water in locker.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 शिवलिंग पर जल चढ़ाएं, लॉकर में चांदी के बर्तन में गंगाजल रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 શિવલિંગ પર જળ ચડાવવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_moon_h10",
    planet: "Chandra (Moon)",
    house: 10,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Chandra (Moon) in House 10",
      "hi": "लाल किताब: चंद्रमा 10वें भाव में",
      "gu": "લાલ કિતાબ: ચંદ્ર 10મા ભાવમાં"
},
    description: {
      "en": "Chandra (Moon) resides in House 10. Store rain water in container, donate water/milk to travelers.",
      "hi": "चंद्रमा 10वें भाव में स्थित है। बारिश का पानी संचित करें, प्यासों को पानी पिलाएं।",
      "gu": "ચંદ્ર 10મા ભાવમાં છે. વરસાદનું પાણી ઘરમાં સંગ્રહવું."
},
    remedies: {
      "en": [
            "💡 Store rain water in container, donate water/milk to travelers.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 बारिश का पानी संचित करें, प्यासों को पानी पिलाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 વરસાદનું પાણી ઘરમાં સંગ્રહવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_moon_h11",
    planet: "Chandra (Moon)",
    house: 11,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Chandra (Moon) in House 11",
      "hi": "लाल किताब: चंद्रमा 11वें भाव में",
      "gu": "લાલ કિતાબ: ચંદ્ર 11મા ભાવમાં"
},
    description: {
      "en": "Chandra (Moon) resides in House 11. Donate milk/curd to needy elders, water banyan tree root daily.",
      "hi": "चंद्रमा 11वें भाव में स्थित है। वृद्धों को दूध-दही दान करें, बरगद की जड़ में जल दें।",
      "gu": "ચંદ્ર 11મા ભાવમાં છે. વડીલોને દૂધ-દહીંનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Donate milk/curd to needy elders, water banyan tree root daily.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 वृद्धों को दूध-दही दान करें, बरगद की जड़ में जल दें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 વડીલોને દૂધ-દહીંનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_moon_h12",
    planet: "Chandra (Moon)",
    house: 12,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Chandra (Moon) in House 12",
      "hi": "लाल किताब: चंद्रमा 12वें भाव में",
      "gu": "લાલ કિતાબ: ચંદ્ર 12મા ભાવમાં"
},
    description: {
      "en": "Chandra (Moon) resides in House 12. Keep rain water in silver vessel on roof, avoid milk late at night.",
      "hi": "चंद्रमा 12वें भाव में स्थित है। छत पर चांदी के पात्र में बारिश का पानी रखें, रात में दूध न पिएं।",
      "gu": "ચંદ્ર 12મા ભાવમાં છે. રાત્રે દૂધ ન પીવું."
},
    remedies: {
      "en": [
            "💡 Keep rain water in silver vessel on roof, avoid milk late at night.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 छत पर चांदी के पात्र में बारिश का पानी रखें, रात में दूध न पिएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 રાત્રે દૂધ ન પીવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mars_h1",
    planet: "Mangala (Mars)",
    house: 1,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Mangala (Mars) in House 1",
      "hi": "लाल किताब: मंगल 1वें भाव में",
      "gu": "લાલ કિતાબ: મંગળ 1મા ભાવમાં"
},
    description: {
      "en": "Mangala (Mars) resides in House 1. Solid silver ball in pocket, pinch of jaggery before leaving home.",
      "hi": "मंगल 1वें भाव में स्थित है। जेब में ठोस चांदी की गोली रखें, घर से निकलने से पूर्व गुड़ खाएं।",
      "gu": "મંગળ 1મા ભાવમાં છે. ચાંદીની ગોળી પાસે રાખવી."
},
    remedies: {
      "en": [
            "💡 Solid silver ball in pocket, pinch of jaggery before leaving home.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 जेब में ठोस चांदी की गोली रखें, घर से निकलने से पूर्व गुड़ खाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચાંદીની ગોળી પાસે રાખવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mars_h2",
    planet: "Mangala (Mars)",
    house: 2,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Mangala (Mars) in House 2",
      "hi": "लाल किताब: मंगल 2वें भाव में",
      "gu": "લાલ કિતાબ: મંગળ 2મા ભાવમાં"
},
    description: {
      "en": "Mangala (Mars) resides in House 2. Do not quarrel with brothers, sweet tandoori rotis to dogs.",
      "hi": "मंगल 2वें भाव में स्थित है। भाइयों से विवाद न करें, कुत्ते को मीठी तंदूरी रोटी दें।",
      "gu": "મંગળ 2મા ભાવમાં છે. ભાઈઓ સાથે વિવાદ ન કરવો."
},
    remedies: {
      "en": [
            "💡 Do not quarrel with brothers, sweet tandoori rotis to dogs.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 भाइयों से विवाद न करें, कुत्ते को मीठी तंदूरी रोटी दें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ભાઈઓ સાથે વિવાદ ન કરવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mars_h3",
    planet: "Mangala (Mars)",
    house: 3,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Mangala (Mars) in House 3",
      "hi": "लाल किताब: मंगल 3वें भाव में",
      "gu": "લાલ કિતાબ: મંગળ 3મા ભાવમાં"
},
    description: {
      "en": "Mangala (Mars) resides in House 3. Solid silver ball in pocket, eat jaggery before important work.",
      "hi": "मंगल 3वें भाव में स्थित है। शुभ कार्य से पहले गुड़ खाएं, चांदी की गोली पास रखें।",
      "gu": "મંગળ 3મા ભાવમાં છે. કામ પર જતાં પહેલાં ગોળ ખાવો."
},
    remedies: {
      "en": [
            "💡 Solid silver ball in pocket, eat jaggery before important work.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 शुभ कार्य से पहले गुड़ खाएं, चांदी की गोली पास रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 કામ પર જતાં પહેલાં ગોળ ખાવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mars_h4",
    planet: "Mangala (Mars)",
    house: 4,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Mangala (Mars) in House 4",
      "hi": "लाल किताब: मंगल 4वें भाव में",
      "gu": "લાલ કિતાબ: મંગળ 4મા ભાવમાં"
},
    description: {
      "en": "Mangala (Mars) resides in House 4. Sweet tandoori rotis to dogs, wear silver ring without joint.",
      "hi": "मंगल 4वें भाव में स्थित है। कुत्तों को मीठी रोटी खिलाएं, बिना जोड़ की चांदी की अंगूठी पहनें।",
      "gu": "મંગળ 4મા ભાવમાં છે. મીઠી રોટલી કુતરાને ખવડાવવી."
},
    remedies: {
      "en": [
            "💡 Sweet tandoori rotis to dogs, wear silver ring without joint.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 कुत्तों को मीठी रोटी खिलाएं, बिना जोड़ की चांदी की अंगूठी पहनें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 મીઠી રોટલી કુતરાને ખવડાવવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mars_h5",
    planet: "Mangala (Mars)",
    house: 5,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Mangala (Mars) in House 5",
      "hi": "लाल किताब: मंगल 5वें भाव में",
      "gu": "લાલ કિતાબ: મંગળ 5મા ભાવમાં"
},
    description: {
      "en": "Mangala (Mars) resides in House 5. Water vessel at bedside overnight, pour on plants in morning.",
      "hi": "मंगल 5वें भाव में स्थित है। रात को सिरहाने पानी रखें, सुबह पौधों में डालें।",
      "gu": "મંગળ 5મા ભાવમાં છે. રાત્રે પાણી રાખી સવારે છોડમાં રેડવું."
},
    remedies: {
      "en": [
            "💡 Water vessel at bedside overnight, pour on plants in morning.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 रात को सिरहाने पानी रखें, सुबह पौधों में डालें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 રાત્રે પાણી રાખી સવારે છોડમાં રેડવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mars_h6",
    planet: "Mangala (Mars)",
    house: 6,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Mangala (Mars) in House 6",
      "hi": "लाल किताब: मंगल 6वें भाव में",
      "gu": "લાલ કિતાબ: મંગળ 6મા ભાવમાં"
},
    description: {
      "en": "Mangala (Mars) resides in House 6. Distribute sweets on birthdays, serve maternal uncle (Mama).",
      "hi": "मंगल 6वें भाव में स्थित है। जन्मदिन पर मिठाई बांटें, मामा पक्ष का आदर करें।",
      "gu": "મંગળ 6મા ભાવમાં છે. મામાનો આદર કરવો."
},
    remedies: {
      "en": [
            "💡 Distribute sweets on birthdays, serve maternal uncle (Mama).",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 जन्मदिन पर मिठाई बांटें, मामा पक्ष का आदर करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 મામાનો આદર કરવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mars_h7",
    planet: "Mangala (Mars)",
    house: 7,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Mangala (Mars) in House 7",
      "hi": "लाल किताब: मंगल 7वें भाव में",
      "gu": "લાલ કિતાબ: મંગળ 7મા ભાવમાં"
},
    description: {
      "en": "Mangala (Mars) resides in House 7. Serve brother-in-law or nephew, keep solid silver square piece.",
      "hi": "मंगल 7वें भाव में स्थित है। साले या भांजे की सेवा करें, चांदी का चौकोर टुकड़ा रखें।",
      "gu": "મંગળ 7મા ભાવમાં છે. ચાંદીનો ચોરસ ટુકડો રાખવો."
},
    remedies: {
      "en": [
            "💡 Serve brother-in-law or nephew, keep solid silver square piece.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 साले या भांजे की सेवा करें, चांदी का चौकोर टुकड़ा रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચાંદીનો ચોરસ ટુકડો રાખવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mars_h8",
    planet: "Mangala (Mars)",
    house: 8,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Mangala (Mars) in House 8",
      "hi": "लाल किताब: मंगल 8वें भाव में",
      "gu": "લાલ કિતાબ: મંગળ 8મા ભાવમાં"
},
    description: {
      "en": "Mangala (Mars) resides in House 8. Wash Masoor dal in milk and float in river, bake sweet bread for dogs.",
      "hi": "मंगल 8वें भाव में स्थित है। मसूर दाल को दूध से धोकर नदी में बहाएं, कुत्ते को मीठी रोटी दें।",
      "gu": "મંગળ 8મા ભાવમાં છે. મસૂર દાળ વહેતા પાણીમાં પધરાવવી."
},
    remedies: {
      "en": [
            "💡 Wash Masoor dal in milk and float in river, bake sweet bread for dogs.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 मसूर दाल को दूध से धोकर नदी में बहाएं, कुत्ते को मीठी रोटी दें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 મસૂર દાળ વહેતા પાણીમાં પધરાવવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mars_h9",
    planet: "Mangala (Mars)",
    house: 9,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Mangala (Mars) in House 9",
      "hi": "लाल किताब: मंगल 9वें भाव में",
      "gu": "લાલ કિતાબ: મંગળ 9મા ભાવમાં"
},
    description: {
      "en": "Mangala (Mars) resides in House 9. Red handkerchief in pocket, serve elder brothers, red flowers to Hanuman.",
      "hi": "मंगल 9वें भाव में स्थित है। लाल रुमाल रखें, बड़े भाई की सेवा करें, हनुमान जी को लाल फूल चढ़ाएं।",
      "gu": "મંગળ 9મા ભાવમાં છે. લાલ રૂમાલ પાસે રાખવો."
},
    remedies: {
      "en": [
            "💡 Red handkerchief in pocket, serve elder brothers, red flowers to Hanuman.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 लाल रुमाल रखें, बड़े भाई की सेवा करें, हनुमान जी को लाल फूल चढ़ाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 લાલ રૂમાલ પાસે રાખવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mars_h10",
    planet: "Mangala (Mars)",
    house: 10,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Mangala (Mars) in House 10",
      "hi": "लाल किताब: मंगल 10वें भाव में",
      "gu": "લાલ કિતાબ: મંગળ 10મા ભાવમાં"
},
    description: {
      "en": "Mangala (Mars) resides in House 10. Do not keep black dog, avoid leather items, sweet milk to banyan tree.",
      "hi": "मंगल 10वें भाव में स्थित है। बरगद के पेड़ में मीठा दूध चढ़ाएं, चमड़े की वस्तुओं से बचें।",
      "gu": "મંગળ 10મા ભાવમાં છે. વડના ઝાડને મીઠું દૂધ ચડાવવું."
},
    remedies: {
      "en": [
            "💡 Do not keep black dog, avoid leather items, sweet milk to banyan tree.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 बरगद के पेड़ में मीठा दूध चढ़ाएं, चमड़े की वस्तुओं से बचें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 વડના ઝાડને મીઠું દૂધ ચડાવવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mars_h11",
    planet: "Mangala (Mars)",
    house: 11,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Mangala (Mars) in House 11",
      "hi": "लाल किताब: मंगल 11वें भाव में",
      "gu": "લાલ કિતાબ: મંગળ 11મા ભાવમાં"
},
    description: {
      "en": "Mangala (Mars) resides in House 11. Mustard oil/almonds in clay pot, do not lend money on Tuesdays.",
      "hi": "मंगल 11वें भाव में स्थित है। मिट्टी के मटके में सरसों तेल रखें, मंगलवार को उधार न दें।",
      "gu": "મંગળ 11મા ભાવમાં છે. મંગળવારે ઉધાર ન આપવું."
},
    remedies: {
      "en": [
            "💡 Mustard oil/almonds in clay pot, do not lend money on Tuesdays.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 मिट्टी के मटके में सरसों तेल रखें, मंगलवार को उधार न दें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 મંગળવારે ઉધાર ન આપવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mars_h12",
    planet: "Mangala (Mars)",
    house: 12,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Mangala (Mars) in House 12",
      "hi": "लाल किताब: मंगल 12वें भाव में",
      "gu": "લાલ કિતાબ: મંગળ 12મા ભાવમાં"
},
    description: {
      "en": "Mangala (Mars) resides in House 12. Consume honey every morning, sweet red lentils to temple.",
      "hi": "मंगल 12वें भाव में स्थित है। रोज सुबह शहद का सेवन करें, मंदिर में लाल मसूर दान करें।",
      "gu": "મંગળ 12મા ભાવમાં છે. દરરોજ સવારે મધ ખાવું."
},
    remedies: {
      "en": [
            "💡 Consume honey every morning, sweet red lentils to temple.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 रोज सुबह शहद का सेवन करें, मंदिर में लाल मसूर दान करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 દરરોજ સવારે મધ ખાવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mercury_h1",
    planet: "Budha (Mercury)",
    house: 1,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Budha (Mercury) in House 1",
      "hi": "लाल किताब: बुध 1वें भाव में",
      "gu": "લાલ કિતાબ: બુધ 1મા ભાવમાં"
},
    description: {
      "en": "Budha (Mercury) resides in House 1. Green handkerchief, pierce nose/ears for silver, avoid broad leaf plants indoors.",
      "hi": "बुध 1वें भाव में स्थित है। फिटकरी से दांत साफ करें, घर में चौड़े पत्ते वाले पौधे न रखें।",
      "gu": "બુધ 1મા ભાવમાં છે. ફટકડીથી દાંત સાફ કરવા."
},
    remedies: {
      "en": [
            "💡 Green handkerchief, pierce nose/ears for silver, avoid broad leaf plants indoors.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 फिटकरी से दांत साफ करें, घर में चौड़े पत्ते वाले पौधे न रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ફટકડીથી દાંત સાફ કરવા.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mercury_h2",
    planet: "Budha (Mercury)",
    house: 2,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Budha (Mercury) in House 2",
      "hi": "लाल किताब: बुध 2वें भाव में",
      "gu": "લાલ કિતાબ: બુધ 2મા ભાવમાં"
},
    description: {
      "en": "Budha (Mercury) resides in House 2. Pierce nose and wear silver wire, donate green Moong dal at temple.",
      "hi": "बुध 2वें भाव में स्थित है। नाक छिदवाकर चांदी का तार पहनें, मूंग दाल दान करें।",
      "gu": "બુધ 2મા ભાવમાં છે. લીલી મગ દાળનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Pierce nose and wear silver wire, donate green Moong dal at temple.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 नाक छिदवाकर चांदी का तार पहनें, मूंग दाल दान करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 લીલી મગ દાળનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mercury_h3",
    planet: "Budha (Mercury)",
    house: 3,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Budha (Mercury) in House 3",
      "hi": "लाल किताब: बुध 3वें भाव में",
      "gu": "લાલ કિતાબ: બુધ 3મા ભાવમાં"
},
    description: {
      "en": "Budha (Mercury) resides in House 3. Clean teeth with alum (Fitkari), avoid south-facing house, feed green grass to cows.",
      "hi": "बुध 3वें भाव में स्थित है। फिटकरी से दांत साफ करें, गाय को हरा चारा खिलाएं।",
      "gu": "બુધ 3મા ભાવમાં છે. ગાયને લીલો ચારો ખવડાવવો."
},
    remedies: {
      "en": [
            "💡 Clean teeth with alum (Fitkari), avoid south-facing house, feed green grass to cows.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 फिटकरी से दांत साफ करें, गाय को हरा चारा खिलाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ગાયને લીલો ચારો ખવડાવવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mercury_h4",
    planet: "Budha (Mercury)",
    house: 4,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Budha (Mercury) in House 4",
      "hi": "लाल किताब: बुध 4वें भाव में",
      "gu": "લાલ કિતાબ: બુધ 4મા ભાવમાં"
},
    description: {
      "en": "Budha (Mercury) resides in House 4. Rainwater/Ganga water in solid silver vessel, donate milk/rice, avoid broad leaf plants.",
      "hi": "बुध 4वें भाव में स्थित है। चांदी के पात्र में शुद्ध गंगाजल रखें, बेडरूम में पौधे न रखें।",
      "gu": "બુધ 4મા ભાવમાં છે. ચાંદીના પાત્રમાં ગંગાજળ રાખવું."
},
    remedies: {
      "en": [
            "💡 Rainwater/Ganga water in solid silver vessel, donate milk/rice, avoid broad leaf plants.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 चांदी के पात्र में शुद्ध गंगाजल रखें, बेडरूम में पौधे न रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચાંદીના પાત્રમાં ગંગાજળ રાખવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mercury_h5",
    planet: "Budha (Mercury)",
    house: 5,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Budha (Mercury) in House 5",
      "hi": "लाल किताब: बुध 5वें भाव में",
      "gu": "લાલ કિતાબ: બુધ 5મા ભાવમાં"
},
    description: {
      "en": "Budha (Mercury) resides in House 5. Copper coin in white thread around neck, clean teeth with alum.",
      "hi": "बुध 5वें भाव में स्थित है। सफेद धागे में तांबे का सिक्का पहनें, फिटकरी से दांत साफ करें।",
      "gu": "બુધ 5મા ભાવમાં છે. તાંબાનો સિક્કો ગળામાં ધારણ કરવો."
},
    remedies: {
      "en": [
            "💡 Copper coin in white thread around neck, clean teeth with alum.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 सफेद धागे में तांबे का सिक्का पहनें, फिटकरी से दांत साफ करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 તાંબાનો સિક્કો ગળામાં ધારણ કરવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mercury_h6",
    planet: "Budha (Mercury)",
    house: 6,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Budha (Mercury) in House 6",
      "hi": "लाल किताब: बुध 6वें भाव में",
      "gu": "લાલ કિતાબ: બુધ 6મા ભાવમાં"
},
    description: {
      "en": "Budha (Mercury) resides in House 6. Bury milk/Ganga water bottle in secluded field, silver ring in middle finger.",
      "hi": "बुध 6वें भाव में स्थित है। दूध की बोतल निर्जन स्थान में दबाएं, मध्यमा में चांदी पहनें।",
      "gu": "બુધ 6મા ભાવમાં છે. ચાંદીની વીંટી પહેરવી."
},
    remedies: {
      "en": [
            "💡 Bury milk/Ganga water bottle in secluded field, silver ring in middle finger.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 दूध की बोतल निर्जन स्थान में दबाएं, मध्यमा में चांदी पहनें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચાંદીની વીંટી પહેરવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mercury_h7",
    planet: "Budha (Mercury)",
    house: 7,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Budha (Mercury) in House 7",
      "hi": "लाल किताब: बुध 7वें भाव में",
      "gu": "લાલ કિતાબ: બુધ 7મા ભાવમાં"
},
    description: {
      "en": "Budha (Mercury) resides in House 7. Avoid dry broad-leafed plants, serve cows with green fodder.",
      "hi": "बुध 7वें भाव में स्थित है। घर में सूखे पौधे न रखें, गायों को हरा चारा खिलाएं।",
      "gu": "બુધ 7મા ભાવમાં છે. ગાયોને લીલો ચારો ખવડાવવો."
},
    remedies: {
      "en": [
            "💡 Avoid dry broad-leafed plants, serve cows with green fodder.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 घर में सूखे पौधे न रखें, गायों को हरा चारा खिलाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ગાયોને લીલો ચારો ખવડાવવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mercury_h8",
    planet: "Budha (Mercury)",
    house: 8,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Budha (Mercury) in House 8",
      "hi": "लाल किताब: बुध 8वें भाव में",
      "gu": "લાલ કિતાબ: બુધ 8મા ભાવમાં"
},
    description: {
      "en": "Budha (Mercury) resides in House 8. Bake 34 sweet chapatis and feed to dogs, solid silver ring without joint.",
      "hi": "बुध 8वें भाव में स्थित है। 34 मीठी रोटियां कुत्तों को खिलाएं, बिना जोड़ की चांदी पहनें।",
      "gu": "બુધ 8મા ભાવમાં છે. કુતરાને મીઠી રોટલી ખવડાવવી."
},
    remedies: {
      "en": [
            "💡 Bake 34 sweet chapatis and feed to dogs, solid silver ring without joint.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 34 मीठी रोटियां कुत्तों को खिलाएं, बिना जोड़ की चांदी पहनें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 કુતરાને મીઠી રોટલી ખવડાવવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mercury_h9",
    planet: "Budha (Mercury)",
    house: 9,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Budha (Mercury) in House 9",
      "hi": "लाल किताब: बुध 9वें भाव में",
      "gu": "લાલ કિતાબ: બુધ 9મા ભાવમાં"
},
    description: {
      "en": "Budha (Mercury) resides in House 9. Wash green Moong dal in milk and float in river, pierce nose for silver wire.",
      "hi": "बुध 9वें भाव में स्थित है। मूंग दाल को दूध से धोकर नदी में बहाएं।",
      "gu": "બુધ 9મા ભાવમાં છે. લીલા મગ વહેતા પાણીમાં પધરાવવા."
},
    remedies: {
      "en": [
            "💡 Wash green Moong dal in milk and float in river, pierce nose for silver wire.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 मूंग दाल को दूध से धोकर नदी में बहाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 લીલા મગ વહેતા પાણીમાં પધરાવવા.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mercury_h10",
    planet: "Budha (Mercury)",
    house: 10,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Budha (Mercury) in House 10",
      "hi": "लाल किताब: बुध 10वें भाव में",
      "gu": "લાલ કિતાબ: બુધ 10મા ભાવમાં"
},
    description: {
      "en": "Budha (Mercury) resides in House 10. Wash rice in milk and float in river, refrain from alcohol/non-veg.",
      "hi": "बुध 10वें भाव में स्थित है। चावल को दूध से धोकर जल में बहाएं, सात्विक रहें।",
      "gu": "બુધ 10મા ભાવમાં છે. ચોખા વહેતા પાણીમાં પધરાવવા."
},
    remedies: {
      "en": [
            "💡 Wash rice in milk and float in river, refrain from alcohol/non-veg.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 चावल को दूध से धोकर जल में बहाएं, सात्विक रहें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચોખા વહેતા પાણીમાં પધરાવવા.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mercury_h11",
    planet: "Budha (Mercury)",
    house: 11,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Budha (Mercury) in House 11",
      "hi": "लाल किताब: बुध 11वें भाव में",
      "gu": "લાલ કિતાબ: બુધ 11મા ભાવમાં"
},
    description: {
      "en": "Budha (Mercury) resides in House 11. Wear copper coin around neck, avoid taking free emeralds/green gifts.",
      "hi": "बुध 11वें भाव में स्थित है। गले में तांबे का सिक्का पहनें, बहन-बेटी का आदर करें।",
      "gu": "બુધ 11મા ભાવમાં છે. તાંબાનો સિક્કો ધારણ કરવો."
},
    remedies: {
      "en": [
            "💡 Wear copper coin around neck, avoid taking free emeralds/green gifts.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 गले में तांबे का सिक्का पहनें, बहन-बेटी का आदर करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 તાંબાનો સિક્કો ધારણ કરવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_mercury_h12",
    planet: "Budha (Mercury)",
    house: 12,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Budha (Mercury) in House 12",
      "hi": "लाल किताब: बुध 12वें भाव में",
      "gu": "લાલ કિતાબ: બુધ 12મા ભાવમાં"
},
    description: {
      "en": "Budha (Mercury) resides in House 12. Wear solid silver ring, keep yellow handkerchief, stainless steel ring in river.",
      "hi": "बुध 12वें भाव में स्थित है। चांदी की अंगूठी पहनें, लोहे का छल्ला नदी में बहाएं।",
      "gu": "બુધ 12મા ભાવમાં છે. ચાંદીની વીંટી ધારણ કરવી."
},
    remedies: {
      "en": [
            "💡 Wear solid silver ring, keep yellow handkerchief, stainless steel ring in river.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 चांदी की अंगूठी पहनें, लोहे का छल्ला नदी में बहाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચાંદીની વીંટી ધારણ કરવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_jupiter_h1",
    planet: "Brihaspati (Jupiter)",
    house: 1,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Brihaspati (Jupiter) in House 1",
      "hi": "लाल किताब: गुरु 1वें भाव में",
      "gu": "લાલ કિતાબ: ગુરુ 1મા ભાવમાં"
},
    description: {
      "en": "Brihaspati (Jupiter) resides in House 1. Kesar/turmeric tilak on forehead and navel daily, respect gurus.",
      "hi": "गुरु 1वें भाव में स्थित है। माथे व नाभि पर केसर का तिलक लगाएं, गुरुओं का आदर करें।",
      "gu": "ગુરુ 1મા ભાવમાં છે. કેસરનું તિલક કરવું."
},
    remedies: {
      "en": [
            "💡 Kesar/turmeric tilak on forehead and navel daily, respect gurus.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 माथे व नाभि पर केसर का तिलक लगाएं, गुरुओं का आदर करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 કેસરનું તિલક કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_jupiter_h2",
    planet: "Brihaspati (Jupiter)",
    house: 2,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Brihaspati (Jupiter) in House 2",
      "hi": "लाल किताब: गुरु 2वें भाव में",
      "gu": "લાલ કિતાબ: ગુરુ 2મા ભાવમાં"
},
    description: {
      "en": "Brihaspati (Jupiter) resides in House 2. Apply saffron tilak, donate yellow chana dal/turmeric at temple.",
      "hi": "गुरु 2वें भाव में स्थित है। चने की दाल या हल्दी दान करें, पिता का सम्मान करें।",
      "gu": "ગુરુ 2મા ભાવમાં છે. ચણાની દાળનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Apply saffron tilak, donate yellow chana dal/turmeric at temple.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 चने की दाल या हल्दी दान करें, पिता का सम्मान करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચણાની દાળનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_jupiter_h3",
    planet: "Brihaspati (Jupiter)",
    house: 3,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Brihaspati (Jupiter) in House 3",
      "hi": "लाल किताब: गुरु 3वें भाव में",
      "gu": "લાલ કિતાબ: ગુરુ 3મા ભાવમાં"
},
    description: {
      "en": "Brihaspati (Jupiter) resides in House 3. Wear yellow sapphire/brass ring, respect gurus, avoid false testimony.",
      "hi": "गुरु 3वें भाव में स्थित है। पीतल/सोने की अंगूठी पहनें, असत्य वचन न बोलें।",
      "gu": "ગુરુ 3મા ભાવમાં છે. ગુરુઓનો આદર કરવો."
},
    remedies: {
      "en": [
            "💡 Wear yellow sapphire/brass ring, respect gurus, avoid false testimony.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 पीतल/सोने की अंगूठी पहनें, असत्य वचन न बोलें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ગુરુઓનો આદર કરવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_jupiter_h4",
    planet: "Brihaspati (Jupiter)",
    house: 4,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Brihaspati (Jupiter) in House 4",
      "hi": "लाल किताब: गुरु 4वें भाव में",
      "gu": "લાલ કિતાબ: ગુરુ 4મા ભાવમાં"
},
    description: {
      "en": "Brihaspati (Jupiter) resides in House 4. Respect mother and grandmothers, donate chana dal at temple, do not cut banyan/peepal.",
      "hi": "गुरु 4वें भाव में स्थित है। माता-पिता की सेवा करें, पीपल का वृक्ष न काटें।",
      "gu": "ગુરુ 4મા ભાવમાં છે. માતા-પિતાની સેવા કરવી."
},
    remedies: {
      "en": [
            "💡 Respect mother and grandmothers, donate chana dal at temple, do not cut banyan/peepal.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 माता-पिता की सेवा करें, पीपल का वृक्ष न काटें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 માતા-પિતાની સેવા કરવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_jupiter_h5",
    planet: "Brihaspati (Jupiter)",
    house: 5,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Brihaspati (Jupiter) in House 5",
      "hi": "लाल किताब: गुरु 5वें भाव में",
      "gu": "લાલ કિતાબ: ગુરુ 5મા ભાવમાં"
},
    description: {
      "en": "Brihaspati (Jupiter) resides in House 5. Serve gurus and teachers, keep gold/brass item at home, keep promises.",
      "hi": "गुरु 5वें भाव में स्थित है। गुरुओं की सेवा करें, घर में पीतल/सोना रखें।",
      "gu": "ગુરુ 5મા ભાવમાં છે. સોનું કે પીતળ પાસે રાખવું."
},
    remedies: {
      "en": [
            "💡 Serve gurus and teachers, keep gold/brass item at home, keep promises.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 गुरुओं की सेवा करें, घर में पीतल/सोना रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 સોનું કે પીતળ પાસે રાખવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_jupiter_h6",
    planet: "Brihaspati (Jupiter)",
    house: 6,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Brihaspati (Jupiter) in House 6",
      "hi": "लाल किताब: गुरु 6वें भाव में",
      "gu": "લાલ કિતાબ: ગુરુ 6મા ભાવમાં"
},
    description: {
      "en": "Brihaspati (Jupiter) resides in House 6. Water peepal tree daily without touching root, yellow sweets to priests.",
      "hi": "गुरु 6वें भाव में स्थित है। पीपल के वृक्ष में जल चढ़ाएं, पुजारियों को पीली मिठाई दें।",
      "gu": "ગુરુ 6મા ભાવમાં છે. પીપળાને જળ ચડાવવું."
},
    remedies: {
      "en": [
            "💡 Water peepal tree daily without touching root, yellow sweets to priests.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 पीपल के वृक्ष में जल चढ़ाएं, पुजारियों को पीली मिठाई दें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 પીપળાને જળ ચડાવવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_jupiter_h7",
    planet: "Brihaspati (Jupiter)",
    house: 7,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Brihaspati (Jupiter) in House 7",
      "hi": "लाल किताब: गुरु 7वें भाव में",
      "gu": "લાલ કિતાબ: ગુરુ 7મા ભાવમાં"
},
    description: {
      "en": "Brihaspati (Jupiter) resides in House 7. Respect spouse and elders, keep yellow cloth/saffron in purse.",
      "hi": "गुरु 7वें भाव में स्थित है। जीवनसाथी व बड़े-बुजुर्गों का सम्मान करें, पीला रुमाल रखें।",
      "gu": "ગુરુ 7મા ભાવમાં છે. પીળો રૂમાલ પાસે રાખવો."
},
    remedies: {
      "en": [
            "💡 Respect spouse and elders, keep yellow cloth/saffron in purse.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 जीवनसाथी व बड़े-बुजुर्गों का सम्मान करें, पीला रुमाल रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 પીળો રૂમાલ પાસે રાખવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_jupiter_h8",
    planet: "Brihaspati (Jupiter)",
    house: 8,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Brihaspati (Jupiter) in House 8",
      "hi": "लाल किताब: गुरु 8वें भाव में",
      "gu": "લાલ કિતાબ: ગુરુ 8મા ભાવમાં"
},
    description: {
      "en": "Brihaspati (Jupiter) resides in House 8. Offer turmeric/chana dal at temple, refuse free gold/brass gifts.",
      "hi": "गुरु 8वें भाव में स्थित है। मंदिर में हल्दी-चना दाल दान करें, मुफ्त सोना न लें।",
      "gu": "ગુરુ 8મા ભાવમાં છે. હળદરનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Offer turmeric/chana dal at temple, refuse free gold/brass gifts.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 मंदिर में हल्दी-चना दाल दान करें, मुफ्त सोना न लें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 હળદરનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_jupiter_h9",
    planet: "Brihaspati (Jupiter)",
    house: 9,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Brihaspati (Jupiter) in House 9",
      "hi": "लाल किताब: गुरु 9वें भाव में",
      "gu": "લાલ કિતાબ: ગુરુ 9મા ભાવમાં"
},
    description: {
      "en": "Brihaspati (Jupiter) resides in House 9. Apply Kesar tilak daily, visit temple regularly, respect spiritual gurus.",
      "hi": "गुरु 9वें भाव में स्थित है। केसर का तिलक लगाएं, नित्य धार्मिक स्थल जाएं।",
      "gu": "ગુરુ 9મા ભાવમાં છે. દરરોજ કેસરનું તિલક કરવું."
},
    remedies: {
      "en": [
            "💡 Apply Kesar tilak daily, visit temple regularly, respect spiritual gurus.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 केसर का तिलक लगाएं, नित्य धार्मिक स्थल जाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 દરરોજ કેસરનું તિલક કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_jupiter_h10",
    planet: "Brihaspati (Jupiter)",
    house: 10,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Brihaspati (Jupiter) in House 10",
      "hi": "लाल किताब: गुरु 10वें भाव में",
      "gu": "લાલ કિતાબ: ગુરુ 10મા ભાવમાં"
},
    description: {
      "en": "Brihaspati (Jupiter) resides in House 10. Water to rising sun, apply saffron tilak, avoid house construction before 34.",
      "hi": "गुरु 10वें भाव में स्थित है। सूर्य को जल दें, 34 वर्ष से पूर्व स्वयं का मकान न बनाएं।",
      "gu": "ગુરુ 10મા ભાવમાં છે. સૂર્યનારાયણને જળ અર્પણ કરવું."
},
    remedies: {
      "en": [
            "💡 Water to rising sun, apply saffron tilak, avoid house construction before 34.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 सूर्य को जल दें, 34 वर्ष से पूर्व स्वयं का मकान न बनाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 સૂર્યનારાયણને જળ અર્પણ કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_jupiter_h11",
    planet: "Brihaspati (Jupiter)",
    house: 11,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Brihaspati (Jupiter) in House 11",
      "hi": "लाल किताब: गुरु 11वें भाव में",
      "gu": "લાલ કિતાબ: ગુરુ 11મા ભાવમાં"
},
    description: {
      "en": "Brihaspati (Jupiter) resides in House 11. Wear gold/brass item, keep yellow handkerchief, donate books to poor students.",
      "hi": "गुरु 11वें भाव में स्थित है। पीला रुमाल रखें, निर्धन छात्रों को पुस्तकें दान करें।",
      "gu": "ગુરુ 11મા ભાવમાં છે. પુસ્તકોનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Wear gold/brass item, keep yellow handkerchief, donate books to poor students.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 पीला रुमाल रखें, निर्धन छात्रों को पुस्तकें दान करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 પુસ્તકોનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_jupiter_h12",
    planet: "Brihaspati (Jupiter)",
    house: 12,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Brihaspati (Jupiter) in House 12",
      "hi": "लाल किताब: गुरु 12वें भाव में",
      "gu": "લાલ કિતાબ: ગુરુ 12મા ભાવમાં"
},
    description: {
      "en": "Brihaspati (Jupiter) resides in House 12. Apply saffron tilak on forehead and throat, keep yellow pot with turmeric.",
      "hi": "गुरु 12वें भाव में स्थित है। माथे व गले पर केसर लगाएं, हल्दी का मटका घर में रखें।",
      "gu": "ગુરુ 12મા ભાવમાં છે. હળદર ઘરમાં રાખવી."
},
    remedies: {
      "en": [
            "💡 Apply saffron tilak on forehead and throat, keep yellow pot with turmeric.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 माथे व गले पर केसर लगाएं, हल्दी का मटका घर में रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 હળદર ઘરમાં રાખવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_venus_h1",
    planet: "Shukra (Venus)",
    house: 1,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shukra (Venus) in House 1",
      "hi": "लाल किताब: शुक्र 1वें भाव में",
      "gu": "લાલ કિતાબ: શુક્ર 1મા ભાવમાં"
},
    description: {
      "en": "Shukra (Venus) resides in House 1. Wear clean scented white clothes, take blessings of women, silver square piece.",
      "hi": "शुक्र 1वें भाव में स्थित है। स्वच्छ सुगंधित वस्त्र पहनें, स्त्रियों का सम्मान करें।",
      "gu": "શુક્ર 1મા ભાવમાં છે. સ્વચ્છ સુગંધીદાર વસ્ત્રો પહેરવા."
},
    remedies: {
      "en": [
            "💡 Wear clean scented white clothes, take blessings of women, silver square piece.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 स्वच्छ सुगंधित वस्त्र पहनें, स्त्रियों का सम्मान करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 સ્વચ્છ સુગંધીદાર વસ્ત્રો પહેરવા.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_venus_h2",
    planet: "Shukra (Venus)",
    house: 2,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shukra (Venus) in House 2",
      "hi": "लाल किताब: शुक्र 2वें भाव में",
      "gu": "લાલ કિતાબ: શુક્ર 2મા ભાવમાં"
},
    description: {
      "en": "Shukra (Venus) resides in House 2. Feed white cow with dough/potato, donate ghee/camphor/curd at temple.",
      "hi": "शुक्र 2वें भाव में स्थित है। सफेद गाय को आटे की लोई खिलाएं, मंदिर में कपूर-दही दान करें।",
      "gu": "શુક્ર 2મા ભાવમાં છે. સફેદ ગાયને રોટલી ખવડાવવી."
},
    remedies: {
      "en": [
            "💡 Feed white cow with dough/potato, donate ghee/camphor/curd at temple.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 सफेद गाय को आटे की लोई खिलाएं, मंदिर में कपूर-दही दान करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 સફેદ ગાયને રોટલી ખવડાવવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_venus_h3",
    planet: "Shukra (Venus)",
    house: 3,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shukra (Venus) in House 3",
      "hi": "लाल किताब: शुक्र 3वें भाव में",
      "gu": "લાલ કિતાબ: શુક્ર 3મા ભાવમાં"
},
    description: {
      "en": "Shukra (Venus) resides in House 3. Respect women, do not insult spouse, keep silver coin in purse.",
      "hi": "शुक्र 3वें भाव में स्थित है। स्त्रियों का आदर करें, पर्स में चांदी का सिक्का रखें।",
      "gu": "શુક્ર 3મા ભાવમાં છે. ચાંદીનો સિક્કો પાસે રાખવો."
},
    remedies: {
      "en": [
            "💡 Respect women, do not insult spouse, keep silver coin in purse.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 स्त्रियों का आदर करें, पर्स में चांदी का सिक्का रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચાંદીનો સિક્કો પાસે રાખવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_venus_h4",
    planet: "Shukra (Venus)",
    house: 4,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shukra (Venus) in House 4",
      "hi": "लाल किताब: शुक्र 4वें भाव में",
      "gu": "લાલ કિતાબ: શુક્ર 4મા ભાવમાં"
},
    description: {
      "en": "Shukra (Venus) resides in House 4. Do not sell mother's jewelry, feed white cow with dough, silver brick at home.",
      "hi": "शुक्र 4वें भाव में स्थित है। माता के जेवर न बेचें, सफेद गाय को रोटी दें।",
      "gu": "શુક્ર 4મા ભાવમાં છે. સફેદ ગાયની સેવા કરવી."
},
    remedies: {
      "en": [
            "💡 Do not sell mother's jewelry, feed white cow with dough, silver brick at home.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 माता के जेवर न बेचें, सफेद गाय को रोटी दें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 સફેદ ગાયની સેવા કરવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_venus_h5",
    planet: "Shukra (Venus)",
    house: 5,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shukra (Venus) in House 5",
      "hi": "लाल किताब: शुक्र 5वें भाव में",
      "gu": "લાલ કિતાબ: શુક્ર 5મા ભાવમાં"
},
    description: {
      "en": "Shukra (Venus) resides in House 5. Serve white cow, maintain clean moral character, do not insult women/artists.",
      "hi": "शुक्र 5वें भाव में स्थित है। सफेद गाय की सेवा करें, चरित्र पवित्र रखें।",
      "gu": "શુક્ર 5મા ભાવમાં છે. ચારિત્ર્ય શુદ્ધ રાખવું."
},
    remedies: {
      "en": [
            "💡 Serve white cow, maintain clean moral character, do not insult women/artists.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 सफेद गाय की सेवा करें, चरित्र पवित्र रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચારિત્ર્ય શુદ્ધ રાખવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_venus_h6",
    planet: "Shukra (Venus)",
    house: 6,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shukra (Venus) in House 6",
      "hi": "लाल किताब: शुक्र 6वें भाव में",
      "gu": "લાલ કિતાબ: શુક્ર 6મા ભાવમાં"
},
    description: {
      "en": "Shukra (Venus) resides in House 6. Feed white cow with boiled potatoes mixed with turmeric, solid silver piece.",
      "hi": "शुक्र 6वें भाव में स्थित है। गाय को हल्दी लगे उबले आलू खिलाएं, चांदी पास रखें।",
      "gu": "શુક્ર 6મા ભાવમાં છે. ગાયને બટાકા ખવડાવવા."
},
    remedies: {
      "en": [
            "💡 Feed white cow with boiled potatoes mixed with turmeric, solid silver piece.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 गाय को हल्दी लगे उबले आलू खिलाएं, चांदी पास रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ગાયને બટાકા ખવડાવવા.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_venus_h7",
    planet: "Shukra (Venus)",
    house: 7,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shukra (Venus) in House 7",
      "hi": "लाल किताब: शुक्र 7वें भाव में",
      "gu": "લાલ કિતાબ: શુક્ર 7મા ભાવમાં"
},
    description: {
      "en": "Shukra (Venus) resides in House 7. Donate bronze vessel or curd at temple, serve white cow, purity in marriage.",
      "hi": "शुक्र 7वें भाव में स्थित है। मंदिर में कांसे का बर्तन या दही दान करें।",
      "gu": "શુક્ર 7મા ભાવમાં છે. મંદિરમાં દહીંનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Donate bronze vessel or curd at temple, serve white cow, purity in marriage.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 मंदिर में कांसे का बर्तन या दही दान करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 મંદિરમાં દહીંનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_venus_h8",
    planet: "Shukra (Venus)",
    house: 8,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shukra (Venus) in House 8",
      "hi": "लाल किताब: शुक्र 8वें भाव में",
      "gu": "લાલ કિતાબ: શુક્ર 8મા ભાવમાં"
},
    description: {
      "en": "Shukra (Venus) resides in House 8. Throw 8 white flowers into river, do not accept free clothes/perfume.",
      "hi": "शुक्र 8वें भाव में स्थित है। 8 सफेद फूल नदी में प्रवाहित करें, मुफ्त इत्र न लें।",
      "gu": "શુક્ર 8મા ભાવમાં છે. સફેદ ફૂલો વહેતા પાણીમાં પધરાવવા."
},
    remedies: {
      "en": [
            "💡 Throw 8 white flowers into river, do not accept free clothes/perfume.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 8 सफेद फूल नदी में प्रवाहित करें, मुफ्त इत्र न लें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 સફેદ ફૂલો વહેતા પાણીમાં પધરાવવા.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_venus_h9",
    planet: "Shukra (Venus)",
    house: 9,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shukra (Venus) in House 9",
      "hi": "लाल किताब: शुक्र 9वें भाव में",
      "gu": "લાલ કિતાબ: શુક્ર 9મા ભાવમાં"
},
    description: {
      "en": "Shukra (Venus) resides in House 9. Bury silver square piece in secluded soil, respect mother-in-law and elders.",
      "hi": "शुक्र 9वें भाव में स्थित है। चांदी का टुकड़ा जमीन में दबाएं, सास-ससुर का आदर करें।",
      "gu": "શુક્ર 9મા ભાવમાં છે. ચાંદીનો ટુકડો જમીનમાં દાટવો."
},
    remedies: {
      "en": [
            "💡 Bury silver square piece in secluded soil, respect mother-in-law and elders.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 चांदी का टुकड़ा जमीन में दबाएं, सास-ससुर का आदर करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચાંદીનો ટુકડો જમીનમાં દાટવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_venus_h10",
    planet: "Shukra (Venus)",
    house: 10,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shukra (Venus) in House 10",
      "hi": "लाल किताब: शुक्र 10वें भाव में",
      "gu": "લાલ કિતાબ: શુક્ર 10મા ભાવમાં"
},
    description: {
      "en": "Shukra (Venus) resides in House 10. Feed white cow with dough balls daily, donate curd/white sweets.",
      "hi": "शुक्र 10वें भाव में स्थित है। सफेद गाय को रोज आटे की लोई दें, सफेद मिठाई बांटें।",
      "gu": "શુક્ર 10મા ભાવમાં છે. સફેદ મીઠાઈ વહેંચવી."
},
    remedies: {
      "en": [
            "💡 Feed white cow with dough balls daily, donate curd/white sweets.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 सफेद गाय को रोज आटे की लोई दें, सफेद मिठाई बांटें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 સફેદ મીઠાઈ વહેંચવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_venus_h11",
    planet: "Shukra (Venus)",
    house: 11,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shukra (Venus) in House 11",
      "hi": "लाल किताब: शुक्र 11वें भाव में",
      "gu": "લાલ કિતાબ: શુક્ર 11મા ભાવમાં"
},
    description: {
      "en": "Shukra (Venus) resides in House 11. Donate oil/curd at temple, wear clean scented white clothes.",
      "hi": "शुक्र 11वें भाव में स्थित है। मंदिर में तेल या दही दान करें, इत्र का प्रयोग करें।",
      "gu": "શુક્ર 11મા ભાવમાં છે. ઇતરનો ઉપયોગ કરવો."
},
    remedies: {
      "en": [
            "💡 Donate oil/curd at temple, wear clean scented white clothes.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 मंदिर में तेल या दही दान करें, इत्र का प्रयोग करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ઇતરનો ઉપયોગ કરવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_venus_h12",
    planet: "Shukra (Venus)",
    house: 12,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shukra (Venus) in House 12",
      "hi": "लाल किताब: शुक्र 12वें भाव में",
      "gu": "લાલ કિતાબ: શુક્ર 12મા ભાવમાં"
},
    description: {
      "en": "Shukra (Venus) resides in House 12. Donate cow or ghee at temple, keep solid silver piece under pillow.",
      "hi": "शुक्र 12वें भाव में स्थित है। मंदिर में शुद्ध देशी घी दान करें, तकिए के नीचे चांदी रखें।",
      "gu": "શુક્ર 12મા ભાવમાં છે. ચાંદી પાસે રાખવી."
},
    remedies: {
      "en": [
            "💡 Donate cow or ghee at temple, keep solid silver piece under pillow.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 मंदिर में शुद्ध देशी घी दान करें, तकिए के नीचे चांदी रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચાંદી પાસે રાખવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_saturn_h1",
    planet: "Shani (Saturn)",
    house: 1,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shani (Saturn) in House 1",
      "hi": "लाल किताब: शनि 1वें भाव में",
      "gu": "લાલ કિતાબ: શનિ 1મા ભાવમાં"
},
    description: {
      "en": "Shani (Saturn) resides in House 1. Feed mustard oil coated rotis to black dogs, avoid alcohol/non-veg, do not lie.",
      "hi": "शनि 1वें भाव में स्थित है। काले कुत्ते को तेल लगी रोटी दें, मदिरा-मांस से दूर रहें।",
      "gu": "શનિ 1મા ભાવમાં છે. કાળા કુતરાને તેલવાળી રોટલી ખવડાવવી."
},
    remedies: {
      "en": [
            "💡 Feed mustard oil coated rotis to black dogs, avoid alcohol/non-veg, do not lie.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 काले कुत्ते को तेल लगी रोटी दें, मदिरा-मांस से दूर रहें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 કાળા કુતરાને તેલવાળી રોટલી ખવડાવવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_saturn_h2",
    planet: "Shani (Saturn)",
    house: 2,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shani (Saturn) in House 2",
      "hi": "लाल किताब: शनि 2वें भाव में",
      "gu": "લાલ કિતાબ: શનિ 2મા ભાવમાં"
},
    description: {
      "en": "Shani (Saturn) resides in House 2. Mustard oil tilak on forehead, serve poor people, feed crows and black dogs.",
      "hi": "शनि 2वें भाव में स्थित है। माथे पर सरसों तेल का तिलक लगाएं, कौवों को रोटी दें।",
      "gu": "શનિ 2મા ભાવમાં છે. કાગડાઓને રોટલી ખવડાવવી."
},
    remedies: {
      "en": [
            "💡 Mustard oil tilak on forehead, serve poor people, feed crows and black dogs.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 माथे पर सरसों तेल का तिलक लगाएं, कौवों को रोटी दें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 કાગડાઓને રોટલી ખવડાવવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_saturn_h3",
    planet: "Shani (Saturn)",
    house: 3,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shani (Saturn) in House 3",
      "hi": "लाल किताब: शनि 3वें भाव में",
      "gu": "લાલ કિતાબ: શનિ 3મા ભાવમાં"
},
    description: {
      "en": "Shani (Saturn) resides in House 3. Keep solid silver ball in pocket, feed black dogs, do not quarrel with brothers.",
      "hi": "शनि 3वें भाव में स्थित है। जेब में चांदी की गोली रखें, भाइयों से विवाद न करें।",
      "gu": "શનિ 3મા ભાવમાં છે. ચાંદીની ગોળી પાસે રાખવી."
},
    remedies: {
      "en": [
            "💡 Keep solid silver ball in pocket, feed black dogs, do not quarrel with brothers.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 जेब में चांदी की गोली रखें, भाइयों से विवाद न करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચાંદીની ગોળી પાસે રાખવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_saturn_h4",
    planet: "Shani (Saturn)",
    house: 4,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shani (Saturn) in House 4",
      "hi": "लाल किताब: शनि 4वें भाव में",
      "gu": "લાલ કિતાબ: શનિ 4મા ભાવમાં"
},
    description: {
      "en": "Shani (Saturn) resides in House 4. Milk or sweet water to banyan tree root, feed fish with flour balls.",
      "hi": "शनि 4वें भाव में स्थित है। बरगद की जड़ में मीठा दूध चढ़ाएं, मछलियों को आटे की गोलियां दें।",
      "gu": "શનિ 4મા ભાવમાં છે. મછલીઓને લોટની ગોળીઓ આપવી."
},
    remedies: {
      "en": [
            "💡 Milk or sweet water to banyan tree root, feed fish with flour balls.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 बरगद की जड़ में मीठा दूध चढ़ाएं, मछलियों को आटे की गोलियां दें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 મછલીઓને લોટની ગોળીઓ આપવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_saturn_h5",
    planet: "Shani (Saturn)",
    house: 5,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shani (Saturn) in House 5",
      "hi": "लाल किताब: शनि 5वें भाव में",
      "gu": "લાલ કિતાબ: શનિ 5મા ભાવમાં"
},
    description: {
      "en": "Shani (Saturn) resides in House 5. Mustard oil/almonds in temple, serve elderly laborers, avoid gambling/alcohol.",
      "hi": "शनि 5वें भाव में स्थित है। मंदिर में सरसों तेल दान करें, मजदूरों की सहायता करें।",
      "gu": "શનિ 5મા ભાવમાં છે. મજૂરોની સેવા કરવી."
},
    remedies: {
      "en": [
            "💡 Mustard oil/almonds in temple, serve elderly laborers, avoid gambling/alcohol.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 मंदिर में सरसों तेल दान करें, मजदूरों की सहायता करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 મજૂરોની સેવા કરવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_saturn_h6",
    planet: "Shani (Saturn)",
    house: 6,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shani (Saturn) in House 6",
      "hi": "लाल किताब: शनि 6वें भाव में",
      "gu": "લાલ કિતાબ: શનિ 6મા ભાવમાં"
},
    description: {
      "en": "Shani (Saturn) resides in House 6. Feed black dog with oil rotis, donate black umbrella/shoes to laborers.",
      "hi": "शनि 6वें भाव में स्थित है। काले कुत्ते को रोटी दें, निर्धनों को काले जूते/छाता दान करें।",
      "gu": "શનિ 6મા ભાવમાં છે. ગરીબોને છત્રીનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Feed black dog with oil rotis, donate black umbrella/shoes to laborers.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 काले कुत्ते को रोटी दें, निर्धनों को काले जूते/छाता दान करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ગરીબોને છત્રીનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_saturn_h7",
    planet: "Shani (Saturn)",
    house: 7,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shani (Saturn) in House 7",
      "hi": "लाल किताब: शनि 7वें भाव में",
      "gu": "લાલ કિતાબ: શનિ 7મા ભાવમાં"
},
    description: {
      "en": "Shani (Saturn) resides in House 7. Respect labor workers, feed black dogs, maintain loyalty in marriage.",
      "hi": "शनि 7वें भाव में स्थित है। कर्मचारियों का सम्मान करें, दांपत्य में निष्ठा रखें।",
      "gu": "શનિ 7મા ભાવમાં છે. મજૂરોનું સન્માન કરવું."
},
    remedies: {
      "en": [
            "💡 Respect labor workers, feed black dogs, maintain loyalty in marriage.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 कर्मचारियों का सम्मान करें, दांपत्य में निष्ठा रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 મજૂરોનું સન્માન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_saturn_h8",
    planet: "Shani (Saturn)",
    house: 8,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shani (Saturn) in House 8",
      "hi": "लाल किताब: शनि 8वें भाव में",
      "gu": "લાલ કિતાબ: શનિ 8મા ભાવમાં"
},
    description: {
      "en": "Shani (Saturn) resides in House 8. Feed dark dogs with mustard oil coated bread, bury square silver piece/mustard oil.",
      "hi": "शनि 8वें भाव में स्थित है। काले कुत्ते को सरसों तेल की रोटी दें, चांदी दबाएं।",
      "gu": "શનિ 8મા ભાવમાં છે. કાળા કુતરાને તેલવાળી રોટલી ખવડાવવી."
},
    remedies: {
      "en": [
            "💡 Feed dark dogs with mustard oil coated bread, bury square silver piece/mustard oil.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 काले कुत्ते को सरसों तेल की रोटी दें, चांदी दबाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 કાળા કુતરાને તેલવાળી રોટલી ખવડાવવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_saturn_h9",
    planet: "Shani (Saturn)",
    house: 9,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shani (Saturn) in House 9",
      "hi": "लाल किताब: शनि 9वें भाव में",
      "gu": "લાલ કિતાબ: શનિ 9મા ભાવમાં"
},
    description: {
      "en": "Shani (Saturn) resides in House 9. Throw rice or milk into river, serve elderly gurus.",
      "hi": "शनि 9वें भाव में स्थित है। बहते पानी में चावल या दूध प्रवाहित करें।",
      "gu": "શનિ 9મા ભાવમાં છે. ચોખા વહેતા પાણીમાં પધરાવવા."
},
    remedies: {
      "en": [
            "💡 Throw rice or milk into river, serve elderly gurus.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 बहते पानी में चावल या दूध प्रवाहित करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચોખા વહેતા પાણીમાં પધરાવવા.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_saturn_h10",
    planet: "Shani (Saturn)",
    house: 10,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shani (Saturn) in House 10",
      "hi": "लाल किताब: शनि 10वें भाव में",
      "gu": "લાલ કિતાબ: શનિ 10મા ભાવમાં"
},
    description: {
      "en": "Shani (Saturn) resides in House 10. Feed crows with sweet rotis, donate mustard oil/iron utensil on Saturdays.",
      "hi": "शनि 10वें भाव में स्थित है। कौवों को मीठी रोटी दें, शनिवार को लोहा/तेल दान करें।",
      "gu": "શનિ 10મા ભાવમાં છે. શનિવારે તેલનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Feed crows with sweet rotis, donate mustard oil/iron utensil on Saturdays.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 कौवों को मीठी रोटी दें, शनिवार को लोहा/तेल दान करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 શનિવારે તેલનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_saturn_h11",
    planet: "Shani (Saturn)",
    house: 11,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shani (Saturn) in House 11",
      "hi": "लाल किताब: शनि 11वें भाव में",
      "gu": "લાલ કિતાબ: શનિ 11મા ભાવમાં"
},
    description: {
      "en": "Shani (Saturn) resides in House 11. Do not buy south-facing house, feed crows, mustard oil in earthenware pot on roof.",
      "hi": "शनि 11वें भाव में स्थित है। छत पर मटके में सरसों तेल रखें, दक्षिणमुखी मकान न लें।",
      "gu": "શનિ 11મા ભાવમાં છે. દક્ષિણમુખી મકાન ન લેવું."
},
    remedies: {
      "en": [
            "💡 Do not buy south-facing house, feed crows, mustard oil in earthenware pot on roof.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 छत पर मटके में सरसों तेल रखें, दक्षिणमुखी मकान न लें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 દક્ષિણમુખી મકાન ન લેવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_saturn_h12",
    planet: "Shani (Saturn)",
    house: 12,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Shani (Saturn) in House 12",
      "hi": "लाल किताब: शनि 12वें भाव में",
      "gu": "લાલ કિતાબ: શનિ 12મા ભાવમાં"
},
    description: {
      "en": "Shani (Saturn) resides in House 12. Avoid alcohol, feed black dogs, donate iron or mustard oil on Saturdays.",
      "hi": "शनि 12वें भाव में स्थित है। मदिरा का सेवन न करें, शनिवार को लोहे की वस्तुएं दान करें।",
      "gu": "શનિ 12મા ભાવમાં છે. દારૂનું સેવન કરવું નહીં."
},
    remedies: {
      "en": [
            "💡 Avoid alcohol, feed black dogs, donate iron or mustard oil on Saturdays.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 मदिरा का सेवन न करें, शनिवार को लोहे की वस्तुएं दान करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 દારૂનું સેવન કરવું નહીં.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_rahu_h1",
    planet: "Rahu",
    house: 1,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Rahu in House 1",
      "hi": "लाल किताब: राहु 1वें भाव में",
      "gu": "લાલ કિતાબ: રાહુ 1મા ભાવમાં"
},
    description: {
      "en": "Rahu resides in House 1. Silver chain around neck, float 400g raw sugar or barley in river, avoid blue clothes.",
      "hi": "राहु 1वें भाव में स्थित है। गले में चांदी की चेन पहनें, 400g जौ नदी में बहाएं।",
      "gu": "રાહુ 1મા ભાવમાં છે. ગળામાં ચાંદીની ચેઇન પહેરવી."
},
    remedies: {
      "en": [
            "💡 Silver chain around neck, float 400g raw sugar or barley in river, avoid blue clothes.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 गले में चांदी की चेन पहनें, 400g जौ नदी में बहाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ગળામાં ચાંદીની ચેઇન પહેરવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_rahu_h2",
    planet: "Rahu",
    house: 2,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Rahu in House 2",
      "hi": "लाल किताब: राहु 2वें भाव में",
      "gu": "લાલ કિતાબ: રાહુ 2મા ભાવમાં"
},
    description: {
      "en": "Rahu resides in House 2. Solid silver bullet/ball in pocket, store silver coin in purse.",
      "hi": "राहु 2वें भाव में स्थित है। जेब में ठोस चांदी की गोली या पर्स में सिक्का रखें।",
      "gu": "રાહુ 2મા ભાવમાં છે. ચાંદીનો સિક્કો પાસે રાખવો."
},
    remedies: {
      "en": [
            "💡 Solid silver bullet/ball in pocket, store silver coin in purse.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 जेब में ठोस चांदी की गोली या पर्स में सिक्का रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચાંદીનો સિક્કો પાસે રાખવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_rahu_h3",
    planet: "Rahu",
    house: 3,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Rahu in House 3",
      "hi": "लाल किताब: राहु 3वें भाव में",
      "gu": "લાલ કિતાબ: રાહુ 3મા ભાવમાં"
},
    description: {
      "en": "Rahu resides in House 3. Solid silver square piece, wear silver ring, avoid damaged electronics at home.",
      "hi": "राहु 3वें भाव में स्थित है। चांदी का टुकड़ा रखें, खराब इलेक्ट्रॉनिक सामान घर में न रखें।",
      "gu": "રાહુ 3મા ભાવમાં છે. ખરાબ ઇલેક્ટ્રોનિક્સ ઘરમાં ન રાખવું."
},
    remedies: {
      "en": [
            "💡 Solid silver square piece, wear silver ring, avoid damaged electronics at home.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 चांदी का टुकड़ा रखें, खराब इलेक्ट्रॉनिक सामान घर में न रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ખરાબ ઇલેક્ટ્રોનિક્સ ઘરમાં ન રાખવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_rahu_h4",
    planet: "Rahu",
    house: 4,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Rahu in House 4",
      "hi": "लाल किताब: राहु 4वें भाव में",
      "gu": "લાલ કિતાબ: રાહુ 4મા ભાવમાં"
},
    description: {
      "en": "Rahu resides in House 4. Float 400g coriander/almonds in river, silver pot filled with rainwater at home.",
      "hi": "राहु 4वें भाव में स्थित है। 400g धनिया या बादाम बहते पानी में बहाएं।",
      "gu": "રાહુ 4મા ભાવમાં છે. ધાણા વહેતા પાણીમાં પધરાવવા."
},
    remedies: {
      "en": [
            "💡 Float 400g coriander/almonds in river, silver pot filled with rainwater at home.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 400g धनिया या बादाम बहते पानी में बहाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ધાણા વહેતા પાણીમાં પધરાવવા.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_rahu_h5",
    planet: "Rahu",
    house: 5,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Rahu in House 5",
      "hi": "लाल किताब: राहु 5वें भाव में",
      "gu": "લાલ કિતાબ: રાહુ 5મા ભાવમાં"
},
    description: {
      "en": "Rahu resides in House 5. Silver elephant figurine at home, avoid gambling or speculation.",
      "hi": "राहु 5वें भाव में स्थित है। घर में ठोस चांदी का हाथी रखें, सट्टेबाजी से दूर रहें।",
      "gu": "રાહુ 5મા ભાવમાં છે. ચાંદીનો હાથી ઘરમાં રાખવો."
},
    remedies: {
      "en": [
            "💡 Silver elephant figurine at home, avoid gambling or speculation.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 घर में ठोस चांदी का हाथी रखें, सट्टेबाजी से दूर रहें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચાંદીનો હાથી ઘરમાં રાખવો.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_rahu_h6",
    planet: "Rahu",
    house: 6,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Rahu in House 6",
      "hi": "लाल किताब: राहु 6वें भाव में",
      "gu": "લાલ કિતાબ: રાહુ 6મા ભાવમાં"
},
    description: {
      "en": "Rahu resides in House 6. Solid silver dog or feed black & white dog, wear silver ring in middle finger.",
      "hi": "राहु 6वें भाव में स्थित है। दो-रंगी कुत्ते को रोटी दें, मध्यमा में चांदी पहनें।",
      "gu": "રાહુ 6મા ભાવમાં છે. બે રંગના કુતરાને રોટલી આપવી."
},
    remedies: {
      "en": [
            "💡 Solid silver dog or feed black & white dog, wear silver ring in middle finger.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 दो-रंगी कुत्ते को रोटी दें, मध्यमा में चांदी पहनें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 બે રંગના કુતરાને રોટલી આપવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_rahu_h7",
    planet: "Rahu",
    house: 7,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Rahu in House 7",
      "hi": "लाल किताब: राहु 7वें भाव में",
      "gu": "લાલ કિતાબ: રાહુ 7મા ભાવમાં"
},
    description: {
      "en": "Rahu resides in House 7. Float 6 coconuts in river on Saturday, avoid trading in partnership with in-laws.",
      "hi": "राहु 7वें भाव में स्थित है। शनिवार को 6 नारियल नदी में बहाएं, ससुराल पक्ष से व्यापार न करें।",
      "gu": "રાહુ 7મા ભાવમાં છે. નારિયેળ વહેતા પાણીમાં પધરાવવા."
},
    remedies: {
      "en": [
            "💡 Float 6 coconuts in river on Saturday, avoid trading in partnership with in-laws.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 शनिवार को 6 नारियल नदी में बहाएं, ससुराल पक्ष से व्यापार न करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 નારિયેળ વહેતા પાણીમાં પધરાવવા.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_rahu_h8",
    planet: "Rahu",
    house: 8,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Rahu in House 8",
      "hi": "लाल किताब: राहु 8वें भाव में",
      "gu": "લાલ કિતાબ: રાહુ 8મા ભાવમાં"
},
    description: {
      "en": "Rahu resides in House 8. Float 8 coconuts with husk in river, keep silver coin wrapped in red cloth in locker.",
      "hi": "राहु 8वें भाव में स्थित है। पानी वाला 8 नारियल नदी में बहाएं, चांदी लाल कपड़े में रखें।",
      "gu": "રાહુ 8મા ભાવમાં છે. નારિયેળ નદીમાં પધરાવવું."
},
    remedies: {
      "en": [
            "💡 Float 8 coconuts with husk in river, keep silver coin wrapped in red cloth in locker.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 पानी वाला 8 नारियल नदी में बहाएं, चांदी लाल कपड़े में रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 નારિયેળ નદીમાં પધરાવવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_rahu_h9",
    planet: "Rahu",
    house: 9,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Rahu in House 9",
      "hi": "लाल किताब: राहु 9वें भाव में",
      "gu": "લાલ કિતાબ: રાહુ 9મા ભાવમાં"
},
    description: {
      "en": "Rahu resides in House 9. Saffron tilak, wear gold/silver chain around neck, feed street dogs.",
      "hi": "राहु 9वें भाव में स्थित है। केसर का तिलक लगाएं, कुत्तों को प्रतिदिन भोजन कराएं।",
      "gu": "રાહુ 9મા ભાવમાં છે. કેસરનું તિલક કરવું."
},
    remedies: {
      "en": [
            "💡 Saffron tilak, wear gold/silver chain around neck, feed street dogs.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 केसर का तिलक लगाएं, कुत्तों को प्रतिदिन भोजन कराएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 કેસરનું તિલક કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_rahu_h10",
    planet: "Rahu",
    house: 10,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Rahu in House 10",
      "hi": "लाल किताब: राहु 10वें भाव में",
      "gu": "લાલ કિતાબ: રાહુ 10મા ભાવમાં"
},
    description: {
      "en": "Rahu resides in House 10. Blue cap or cover head outdoors, float 400g barley washed in milk in river.",
      "hi": "राहु 10वें भाव में स्थित है। बाहर जाते समय सिर ढकें, दूध से धुले जौ नदी में बहाएं।",
      "gu": "રાહુ 10મા ભાવમાં છે. જવ વહેતા પાણીમાં પધરાવવા."
},
    remedies: {
      "en": [
            "💡 Blue cap or cover head outdoors, float 400g barley washed in milk in river.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 बाहर जाते समय सिर ढकें, दूध से धुले जौ नदी में बहाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 જવ વહેતા પાણીમાં પધરાવવા.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_rahu_h11",
    planet: "Rahu",
    house: 11,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Rahu in House 11",
      "hi": "लाल किताब: राहु 11वें भाव में",
      "gu": "લાલ કિતાબ: રાહુ 11મા ભાવમાં"
},
    description: {
      "en": "Rahu resides in House 11. Solid silver ring without joint, avoid tobacco/alcohol, feed birds.",
      "hi": "राहु 11वें भाव में स्थित है। बिना जोड़ की चांदी की अंगूठी पहनें, पक्षियों को दाना दें।",
      "gu": "રાહુ 11મા ભાવમાં છે. પક્ષીઓને ચણ આપવું."
},
    remedies: {
      "en": [
            "💡 Solid silver ring without joint, avoid tobacco/alcohol, feed birds.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 बिना जोड़ की चांदी की अंगूठी पहनें, पक्षियों को दाना दें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 પક્ષીઓને ચણ આપવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_rahu_h12",
    planet: "Rahu",
    house: 12,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Rahu in House 12",
      "hi": "लाल किताब: राहु 12वें भाव में",
      "gu": "લાલ કિતાબ: રાહુ 12મા ભાવમાં"
},
    description: {
      "en": "Rahu resides in House 12. Eat meals sitting inside kitchen, float 12 coconuts in river.",
      "hi": "राहु 12वें भाव में स्थित है। रसोईघर में बैठकर भोजन करें, 12 नारियल नदी में बहाएं।",
      "gu": "રાહુ 12મા ભાવમાં છે. રસોડામાં બેસીને જમવું."
},
    remedies: {
      "en": [
            "💡 Eat meals sitting inside kitchen, float 12 coconuts in river.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 रसोईघर में बैठकर भोजन करें, 12 नारियल नदी में बहाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 રસોડામાં બેસીને જમવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_ketu_h1",
    planet: "Ketu",
    house: 1,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Ketu in House 1",
      "hi": "लाल किताब: केतु 1वें भाव में",
      "gu": "લાલ કિતાબ: કેતુ 1મા ભાવમાં"
},
    description: {
      "en": "Ketu resides in House 1. Feed two-color (black & white) dog daily, wear silver ring, do not insult maternal uncles.",
      "hi": "केतु 1वें भाव में स्थित है। दो-रंगी कुत्ते को रोटी दें, ननिहाल पक्ष का आदर करें।",
      "gu": "કેતુ 1મા ભાવમાં છે. બે રંગના કુતરાને રોટલી ખવડાવવી."
},
    remedies: {
      "en": [
            "💡 Feed two-color (black & white) dog daily, wear silver ring, do not insult maternal uncles.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 दो-रंगी कुत्ते को रोटी दें, ननिहाल पक्ष का आदर करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 બે રંગના કુતરાને રોટલી ખવડાવવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_ketu_h2",
    planet: "Ketu",
    house: 2,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Ketu in House 2",
      "hi": "लाल किताब: केतु 2वें भाव में",
      "gu": "લાલ કિતાબ: કેતુ 2મા ભાવમાં"
},
    description: {
      "en": "Ketu resides in House 2. Saffron tilak on forehead and navel, feed street dogs.",
      "hi": "केतु 2वें भाव में स्थित है। माथे व नाभि पर केसर का तिलक लगाएं, कुत्तों को रोटी दें।",
      "gu": "કેતુ 2મા ભાવમાં છે. કેસરનું તિલક કરવું."
},
    remedies: {
      "en": [
            "💡 Saffron tilak on forehead and navel, feed street dogs.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 माथे व नाभि पर केसर का तिलक लगाएं, कुत्तों को रोटी दें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 કેસરનું તિલક કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_ketu_h3",
    planet: "Ketu",
    house: 3,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Ketu in House 3",
      "hi": "लाल किताब: केतु 3वें भाव में",
      "gu": "લાલ કિતાબ: કેતુ 3મા ભાવમાં"
},
    description: {
      "en": "Ketu resides in House 3. Wear gold or brass item, keep solid silver ball, do not quarrel with brothers.",
      "hi": "केतु 3वें भाव में स्थित है। सोना या पीतल धारण करें, चांदी की गोली पास रखें।",
      "gu": "કેતુ 3મા ભાવમાં છે. સોનું કે પીતળ ધારણ કરવું."
},
    remedies: {
      "en": [
            "💡 Wear gold or brass item, keep solid silver ball, do not quarrel with brothers.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 सोना या पीतल धारण करें, चांदी की गोली पास रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 સોનું કે પીતળ ધારણ કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_ketu_h4",
    planet: "Ketu",
    house: 4,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Ketu in House 4",
      "hi": "लाल किताब: केतु 4वें भाव में",
      "gu": "લાલ કિતાબ: કેતુ 4મા ભાવમાં"
},
    description: {
      "en": "Ketu resides in House 4. Donate yellow blankets to poor/temple, saffron milk to Shivling, rainwater in silver pot.",
      "hi": "केतु 4वें भाव में स्थित है। धार्मिक स्थान पर पीले कंबल दान करें, शिवलिंग पर दूध चढ़ाएं।",
      "gu": "કેતુ 4મા ભાવમાં છે. પીળા ધાબળાનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Donate yellow blankets to poor/temple, saffron milk to Shivling, rainwater in silver pot.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 धार्मिक स्थान पर पीले कंबल दान करें, शिवलिंग पर दूध चढ़ाएं।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 પીળા ધાબળાનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_ketu_h5",
    planet: "Ketu",
    house: 5,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Ketu in House 5",
      "hi": "लाल किताब: केतु 5वें भाव में",
      "gu": "લાલ કિતાબ: કેતુ 5મા ભાવમાં"
},
    description: {
      "en": "Ketu resides in House 5. Donate sesame seeds or sour items at temple, serve sour items to young girls.",
      "hi": "केतु 5वें भाव में स्थित है। मंदिर में तिल या खट्टी चीजें दान करें, कन्याओं की सेवा करें।",
      "gu": "કેતુ 5મા ભાવમાં છે. તિલનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Donate sesame seeds or sour items at temple, serve sour items to young girls.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 मंदिर में तिल या खट्टी चीजें दान करें, कन्याओं की सेवा करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 તિલનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_ketu_h6",
    planet: "Ketu",
    house: 6,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Ketu in House 6",
      "hi": "लाल किताब: केतु 6वें भाव में",
      "gu": "લાલ કિતાબ: કેતુ 6મા ભાવમાં"
},
    description: {
      "en": "Ketu resides in House 6. Wear solid gold or brass ring, feed black/white dog daily.",
      "hi": "केतु 6वें भाव में स्थित है। सोने की अंगूठी पहनें, काले-सफेद कुत्ते को रोटी दें।",
      "gu": "કેતુ 6મા ભાવમાં છે. સોનાની વીંટી પહેરવી."
},
    remedies: {
      "en": [
            "💡 Wear solid gold or brass ring, feed black/white dog daily.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 सोने की अंगूठी पहनें, काले-सफेद कुत्ते को रोटी दें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 સોનાની વીંટી પહેરવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_ketu_h7",
    planet: "Ketu",
    house: 7,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Ketu in House 7",
      "hi": "लाल किताब: केतु 7वें भाव में",
      "gu": "લાલ કિતાબ: કેતુ 7મા ભાવમાં"
},
    description: {
      "en": "Ketu resides in House 7. Feed two-color dog daily, avoid false promises to spouse, wear silver wire in ear/toe.",
      "hi": "केतु 7वें भाव में स्थित है। दो-रंगी कुत्ते को भोजन दें, झूठे वादे न करें।",
      "gu": "કેતુ 7મા ભાવમાં છે. બે રંગના કુતરાને રોટલી આપવી."
},
    remedies: {
      "en": [
            "💡 Feed two-color dog daily, avoid false promises to spouse, wear silver wire in ear/toe.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 दो-रंगी कुत्ते को भोजन दें, झूठे वादे न करें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 બે રંગના કુતરાને રોટલી આપવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_ketu_h8",
    planet: "Ketu",
    house: 8,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Ketu in House 8",
      "hi": "लाल किताब: केतु 8वें भाव में",
      "gu": "લાલ કિતાબ: કેતુ 8મા ભાવમાં"
},
    description: {
      "en": "Ketu resides in House 8. Feed black & white dog with bread, donate black/white blanket to temple/homeless.",
      "hi": "केतु 8वें भाव में स्थित है। दो-रंगी कंबल मंदिर में दान करें, कुत्ते को रोटी दें।",
      "gu": "કેતુ 8મા ભાવમાં છે. ધાબળાનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Feed black & white dog with bread, donate black/white blanket to temple/homeless.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 दो-रंगी कंबल मंदिर में दान करें, कुत्ते को रोटी दें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ધાબળાનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_ketu_h9",
    planet: "Ketu",
    house: 9,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Ketu in House 9",
      "hi": "लाल किताब: केतु 9वें भाव में",
      "gu": "લાલ કિતાબ: કેતુ 9મા ભાવમાં"
},
    description: {
      "en": "Ketu resides in House 9. Feed street dogs daily, wear gold chain around neck, respect elders.",
      "hi": "केतु 9वें भाव में स्थित है। प्रतिदिन आवारा कुत्तों को रोटी दें, सोने की चेन पहनें।",
      "gu": "કેતુ 9મા ભાવમાં છે. કુતરાને રોટલી ખવડાવવી."
},
    remedies: {
      "en": [
            "💡 Feed street dogs daily, wear gold chain around neck, respect elders.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 प्रतिदिन आवारा कुत्तों को रोटी दें, सोने की चेन पहनें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 કુતરાને રોટલી ખવડાવવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_ketu_h10",
    planet: "Ketu",
    house: 10,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Ketu in House 10",
      "hi": "लाल किताब: केतु 10वें भाव में",
      "gu": "લાલ કિતાબ: કેતુ 10મા ભાવમાં"
},
    description: {
      "en": "Ketu resides in House 10. Silver pot filled with honey at home, feed dogs, avoid false oaths.",
      "hi": "केतु 10वें भाव में स्थित है। घर में चांदी के बर्तन में शहद रखें, कुत्तों को भोजन दें।",
      "gu": "કેતુ 10મા ભાવમાં છે. ચાંદીના પાત્રમાં મધ રાખવું."
},
    remedies: {
      "en": [
            "💡 Silver pot filled with honey at home, feed dogs, avoid false oaths.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 घर में चांदी के बर्तन में शहद रखें, कुत्तों को भोजन दें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ચાંદીના પાત્રમાં મધ રાખવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_ketu_h11",
    planet: "Ketu",
    house: 11,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Ketu in House 11",
      "hi": "लाल किताब: केतु 11वें भाव में",
      "gu": "લાલ કિતાબ: કેતુ 11મા ભાવમાં"
},
    description: {
      "en": "Ketu resides in House 11. Feed black & white dog, donate radishes or sesame seeds at temple on Saturdays.",
      "hi": "केतु 11वें भाव में स्थित है। शनिवार को मूली या तिल दान करें, कुत्ते को रोटी दें।",
      "gu": "કેતુ 11મા ભાવમાં છે. મૂળા કે તિલનું દાન કરવું."
},
    remedies: {
      "en": [
            "💡 Feed black & white dog, donate radishes or sesame seeds at temple on Saturdays.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 शनिवार को मूली या तिल दान करें, कुत्ते को रोटी दें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 મૂળા કે તિલનું દાન કરવું.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  },
  {
    id: "lk_ketu_h12",
    planet: "Ketu",
    house: 12,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      "en": "Lal Kitab: Ketu in House 12",
      "hi": "लाल किताब: केतु 12वें भाव में",
      "gu": "લાલ કિતાબ: કેતુ 12મા ભાવમાં"
},
    description: {
      "en": "Ketu resides in House 12. Worship Lord Ganesha, feed dogs daily, keep solid gold item or saffron at home.",
      "hi": "केतु 12वें भाव में स्थित है। भगवान गणेश की आराधना करें, घर में केसर रखें।",
      "gu": "કેતુ 12મા ભાવમાં છે. ગણેશજીની આરાધના કરવી."
},
    remedies: {
      "en": [
            "💡 Worship Lord Ganesha, feed dogs daily, keep solid gold item or saffron at home.",
            "🕊️ Maintain ethical conduct and clean surroundings at home."
      ],
      "hi": [
            "💡 भगवान गणेश की आराधना करें, घर में केसर रखें।",
            "🕊️ घर में साफ-सफाई रखें और सात्विक जीवन व्यतीत करें।"
      ],
      "gu": [
            "💡 ગણેશજીની આરાધના કરવી.",
            "🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું."
      ]
}
  }
];

export function calculateLalKitabDebts(kundali: KundaliResult): LalKitabDebt[] {
  const pMap: Record<string, number> = {};
  kundali.planets.forEach(p => {
    pMap[p.name.split(' ')[0]] = p.house;
  });

  const satHouse = pMap['Saturn'] || pMap['Shani'];
  const moonHouse = pMap['Moon'] || pMap['Chandra'];
  const sunHouse = pMap['Sun'] || pMap['Surya'];
  const jupHouse = pMap['Jupiter'] || pMap['Brihaspati'];
  const venHouse = pMap['Venus'] || pMap['Shukra'];
  const marsHouse = pMap['Mars'] || pMap['Mangala'];
  const rahuHouse = pMap['Rahu'];
  const ketuHouse = pMap['Ketu'];
  const mercHouse = pMap['Mercury'] || pMap['Budha'];

  const allDebts: LalKitabDebt[] = [];

  // 1. Pitru Rin (Father Debt)
  const isPitruRin = !!((satHouse && [9, 10, 11].includes(satHouse)) || (rahuHouse && [9, 5].includes(rahuHouse) && sunHouse && [9, 10, 11].includes(sunHouse)));
  if (isPitruRin) {
    allDebts.push({
      id: 'pitru_rin',
      name: { en: 'Pitru Rin (Father Debt)', hi: 'पितृ ऋण (पिता का ऋण)', gu: 'પિતૃ ઋણ' },
      cause: { en: 'Affliction to Sun/Jupiter or ancestral 9th/10th house in past lineage.', hi: 'पूर्वजों के समय सूर्य या गुरु भाव पर राहु/शनि का प्रभाव।', gu: 'સૂર્ય કે ગુરુ પર અશુભ અસર.' },
      impact: { en: 'Causes unexpected delays in career elevation, obstacles in state honors, and friction with elders.', hi: 'करियर में अकारण विलंब, पदोन्नति में बाधा और पिता या अधिकारियों से तनाव।', gu: 'કારકિર્દીમાં વિલંબ અને માન-સન્માનની હાનિ.' },
      remedy: { en: 'Collect equal money from all blood family members and donate at a sacred temple.', hi: 'परिवार के सभी सदस्यों से बराबर धन इकट्ठा करके धार्मिक स्थान पर दान करें।', gu: 'પરિવારના સભ્યો પાસેથી સરખા પૈસા એકઠા કરી દાન કરો.' },
      isApplicable: true
    });
  }

  // 2. Matru Rin (Mother Debt)
  const isMatruRin = !!((moonHouse && [6, 8, 12].includes(moonHouse)) || (ketuHouse && ketuHouse === 4));
  if (isMatruRin) {
    allDebts.push({
      id: 'matru_rin',
      name: { en: 'Matru Rin (Mother Debt)', hi: 'मातृ ऋण (माता का ऋण)', gu: 'માતૃ ઋણ' },
      cause: { en: 'Affliction to Moon or 4th house of domestic peace in family lineage.', hi: 'चंद्रमा या चतुर्थ भाव (मातृ भाव) का कष्टग्रस्त होना।', gu: 'ચંદ્ર કે ચોથા ભાવ પર અશુભ અસર.' },
      impact: { en: 'Mental anxiety, emotional stress, instability in liquid wealth, and mother’s health fluctuations.', hi: 'मानसिक अशांति, भावनात्मक तनाव, तरल धन में अस्थिरता और माता के स्वास्थ्य में उतार-चढ़ाव।', gu: 'માનસિક અશાંતિ અને નાણાકીય પ્રવાહમાં અવરોધ.' },
      remedy: { en: 'Collect equal silver coins from all family members and float them together into a flowing river.', hi: 'परिवार के सभी सदस्यों से बराबर मात्रा में चांदी के सिक्के लेकर एक साथ बहते जल में प्रवाहित करें।', gu: 'ચાંદીના સિક્કા પરિવાર પાસેથી લઈને નદીમાં પધરાવવો.' },
      isApplicable: true
    });
  }

  // 3. Stree Rin (Wife / Partner Debt)
  const isStreeRin = !!((venHouse && [6, 8].includes(venHouse)) || (rahuHouse && rahuHouse === 7));
  if (isStreeRin) {
    allDebts.push({
      id: 'stree_rin',
      name: { en: 'Stree Rin (Wife / Partner Debt)', hi: 'स्त्री ऋण (पत्नी व दांपत्य का ऋण)', gu: 'સ્ત્રી ઋણ' },
      cause: { en: 'Disrespect to female members or affliction to Venus in family lineage.', hi: 'पूर्वजों के समय स्त्रियों का अनादर या शुक्र का पीड़ित होना।', gu: 'સ્ત્રીઓ પ્રત્યે અનાદર કે શુક્ર અશુભ થવો.' },
      impact: { en: 'Marital misunderstandings, loss of luxury assets, and obstacles in happy domestic events.', hi: 'वैवाहिक जीवन में अनबन, भौतिक सुखों में कमी और शुभ कार्यों में बाधा।', gu: 'દામ્પત્ય જીવનમાં તણાવ અને સુખની હાનિ.' },
      remedy: { en: 'Collect equal money from family members and feed 100 white cows with fodder or donate at a Gaushala.', hi: 'परिवार के सभी सदस्यों से बराबर धन जुटाकर गौशाला में गौ-सेवा करें या 100 गायों को हरा चारा खिलाएं।', gu: 'ગૌશાળામાં ગાયોને ચારો ખવડાવવો.' },
      isApplicable: true
    });
  }

  // 4. Bhratri Rin (Brother / Sibling Debt)
  const isBhratriRin = !!((marsHouse && [4, 8].includes(marsHouse)) || (mercHouse && mercHouse === 3));
  if (isBhratriRin) {
    allDebts.push({
      id: 'bhratri_rin',
      name: { en: 'Bhratri Rin (Brother / Sibling Debt)', hi: 'भ्रातृ ऋण (भाई व स्वजन का ऋण)', gu: 'ભ્રાતૃ ઋણ' },
      cause: { en: 'Conflict with brothers or affliction to Mars in lineage history.', hi: 'भाइयों के साथ विवाद या मंगल का पीड़ित होना।', gu: 'ભાઈઓ સાથે વિવાદ કે મંગળ પર અશુભ અસર.' },
      impact: { en: 'Lack of physical stamina, disputes with siblings, and real estate litigation.', hi: 'साहस में कमी, भाइयों से मतभेद और जमीन-जायदाद में अड़चनें।', gu: 'ભાઈઓ સાથે વિવાદ અને જમીન-જાયદાતમાં અવરોધ.' },
      remedy: { en: 'Collect equal money from family members and donate red lentils (Masoor Dal) or sweet food at a temple.', hi: 'परिवार के सभी सदस्यों से बराबर धन इकट्ठा कर मंदिर में लाल मसूर की दाल या मीठा भोजन दान करें।', gu: 'મંદિરમાં લાલ મસૂર દાળનું દાન કરવું.' },
      isApplicable: true
    });
  }

  // 5. Dev Rin (Divine / Deity Debt)
  const isDevRin = !!((jupHouse && [6, 10].includes(jupHouse)) || (rahuHouse && rahuHouse === 5));
  if (isDevRin) {
    allDebts.push({
      id: 'dev_rin',
      name: { en: 'Dev Rin (Divine / Deity Debt)', hi: 'देव ऋण (ईश्वरीय व गुरु का ऋण)', gu: 'દેવ ઋણ' },
      cause: { en: 'Breaking religious vows or affliction to Jupiter in lineage history.', hi: 'धार्मिक संकल्प तोड़ना या गुरु ग्रह का पीड़ित होना।', gu: 'ધાર્મિક સંકલ્પ ભંગ કરવો.' },
      impact: { en: 'Lack of spiritual peace, obstacles in higher education, and progeny worries.', hi: 'मानसिक व आध्यात्मिक शांति की कमी, उच्च शिक्षा में बाधा और संतान चिंता।', gu: 'આધ્યાત્મિક શાંતિની હાનિ અને સંતાન ચિંતા.' },
      remedy: { en: 'Collect equal money from family members and donate yellow chana dal or construct a drinking water facility at a place of worship.', hi: 'परिवार के सदस्यों से बराबर धन एकत्रित कर धार्मिक स्थान पर चने की दाल दान करें या जल पीने की व्यवस्था करवाएं।', gu: 'ધાર્મિક સ્થાન પર ચણાની દાળનું દાન કરવું.' },
      isApplicable: true
    });
  }

  // 6. Pitru-Sarp Rin (Ancestral Serpent Debt)
  const isSarpRin = !!((rahuHouse && [5, 9].includes(rahuHouse)) || (ketuHouse && [5, 9].includes(ketuHouse)));
  if (isSarpRin) {
    allDebts.push({
      id: 'pitru_sarp_rin',
      name: { en: 'Pitru-Sarp Rin (Ancestral Serpent Debt)', hi: 'पितृ-सर्प ऋण (नाग व पूर्वज ऋण)', gu: 'પિતૃ-સર્પ ઋણ' },
      cause: { en: 'Rahu/Ketu placement in 5th or 9th ancestral houses.', hi: 'पंचम या नवम भाव में राहु/केतु की स्थिति।', gu: '૫મા કે ૯મા ભાવમાં રાહુ/કેતુ.' },
      impact: { en: 'Sudden unexpected career hurdles, lineage growth blockage, and repeated setbacks.', hi: 'करियर में अचानक रुकावटें, वंश वृद्धि में विलंब और बार-बार मिलने वाली असफलताएं।', gu: 'કારકિર્દીમાં અચાનક અવરોધ.' },
      remedy: { en: 'Collect equal small silver snakes from all blood family members and float them together into a flowing river.', hi: 'परिवार के सभी सदस्यों से बराबर संख्या में चांदी के छोटे नाग-नागिन बनवाकर नदी में प्रवाहित करें।', gu: 'ચાંદીના નાગ-નાગિન નદીમાં પધરાવવો.' },
      isApplicable: true
    });
  }

  return allDebts;
}

export function evaluateLalKitabRules(kundali: KundaliResult) {
  const appliedRules: LalKitabRule[] = [];

  kundali.planets.forEach((p: PlanetDetail) => {
    const matched = LAL_KITAB_RULES_REGISTRY.filter(r => {
      const pNameMatch = r.planet.toLowerCase().includes(p.name.split(' ')[0].toLowerCase());
      const houseMatch = r.house === p.house;
      return pNameMatch && houseMatch;
    });

    matched.forEach(rule => appliedRules.push(rule));
  });

  const pukkaGharSummary = Array.from({ length: 12 }, (_, idx) => {
    const houseNum = idx + 1;
    const owner = LAL_KITAB_PUKKA_GHAR[houseNum] || 'N/A';
    const occupants = kundali.planets
      .filter(p => p.house === houseNum)
      .map(p => p.name.split(' ')[0])
      .join(', ');

    return {
      house: houseNum,
      owner,
      occupant: occupants || 'Empty'
    };
  });

  const debts = calculateLalKitabDebts(kundali);

  return {
    appliedRules,
    aspects: LAL_KITAB_ASPECT_RULES,
    pukkaGharSummary,
    debts
  };
}
