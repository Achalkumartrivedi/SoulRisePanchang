import { KundaliResult, PlanetDetail, HouseDetail } from './kundaliEngine';

export interface LalKitabRule {
  id: string;
  planet: string; // 'Surya (Sun)', 'Budha (Mercury)', etc.
  house: number; // 1 to 12
  isGoodForNative: boolean;
  isBadForFamilyOrMother: boolean;
  title: Record<string, string>;
  description: Record<string, string>;
  maternalImpact?: Record<string, string>;
  remedies: Record<string, string[]>; // Lang -> Array of Lal Kitab Totke/Upay
  pukkaGharNote?: Record<string, string>;
}

export interface LalKitabAspect {
  fromHouse: number;
  toHouse: number;
  percentage: number; // 100% or 50%
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

/**
 * Permanent Lal Kitab Pukka Ghar (Fixed House Owners)
 */
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

/**
 * Fixed Lal Kitab Aspect Rules (Lal Kitab Drishti Law)
 */
export const LAL_KITAB_ASPECT_RULES: LalKitabAspect[] = [
  {
    fromHouse: 1,
    toHouse: 7,
    percentage: 100,
    description: {
      en: 'House 1 looks 100% directly into House 7 (Full Direct Aspect)',
      hi: 'प्रथम भाव सीधे 7वें भाव को पूर्ण दृष्टि (100%) से देखता है',
      gu: 'પ્રથમ ભાવ સીધા ૭મા ભાવને પૂર્ણ દ્રષ્ટિથી જુએ છે'
    }
  },
  {
    fromHouse: 4,
    toHouse: 10,
    percentage: 100,
    description: {
      en: 'House 4 looks 100% directly into House 10 (Mother/Home affects Career)',
      hi: 'चतुर्थ भाव 10वें भाव को पूर्ण दृष्टि से देखता है (घर का प्रभाव कर्म पर)',
      gu: 'ચોથો ભાવ ૧૦મા ભાવને પૂર્ણ દ્રષ્ટિથી જુએ છે'
    }
  },
  {
    fromHouse: 8,
    toHouse: 2,
    percentage: 100,
    description: {
      en: 'House 8 looks 100% directly into House 2 (Secret debts/longevity affects wealth & family)',
      hi: 'अष्टम भाव सीधे 2रे भाव को देखता है (आयु और गुप्त धन का प्रभाव कुटुंब पर)',
      gu: 'આઠમો ભાવ બીજા ભાવને સીધી દ્રષ્ટિથી જુએ છે'
    }
  },
  {
    fromHouse: 3,
    toHouse: 9,
    percentage: 50,
    description: {
      en: 'House 3 aspects House 9 & 11 with 50% half strength',
      hi: 'तृतीय भाव 9वें और 11वें भाव को 50% दृष्टि से देखता है',
      gu: 'ત્રીજો ભાવ ૯મા અને ૧૧મા ભાવને ૫૦% દ્રષ્ટિથી જુએ છે'
    }
  },
  {
    fromHouse: 5,
    toHouse: 9,
    percentage: 50,
    description: {
      en: 'House 5 aspects House 9 with 50% half strength',
      hi: 'पंचम भाव 9वें भाव को 50% दृष्टि से देखता है',
      gu: 'પાંચમો ભાવ ૯મા ભાવને ૫૦% દ્રષ્ટિથી જુએ છે'
    }
  }
];

/**
 * Registry of Lal Kitab Rules across Planets & Houses
 */
export const LAL_KITAB_RULES_REGISTRY: LalKitabRule[] = [
  // --- 4th HOUSE MERCURY (User explicit requirement) ---
  {
    id: 'lk_mercury_h4',
    planet: 'Budha (Mercury)',
    house: 4,
    isGoodForNative: true,
    isBadForFamilyOrMother: true,
    title: {
      en: 'Lal Kitab: 4th House Mercury (Budha in Moon’s Pukka Ghar)',
      hi: 'लाल किताब: चतुर्थ भाव में बुध (माता एवं ननिहाल पर प्रभाव)',
      gu: 'લાલ કિતાબ: ચોથા ભાવમાં બુધ (માતા અને મોસાળ પર અસર)'
    },
    description: {
      en: 'In Lal Kitab, Mercury in the 4th house (Moon’s Pukka Ghar) makes the native highly intelligent, sharp in business, and intellectually gifted. However, because Mercury is inimical to Moon (4th house lord), it creates health or emotional challenges for the mother and maternal side family (Nanihal).',
      hi: 'लाल किताब के नियमानुसार चतुर्थ भाव में बुध जातक को स्वयं के लिए अत्यंत बुद्धिमान, चतुर और व्यापार में सफल बनाता है। परंतु चंद्रमा (चतुर्थ भाव का स्वामी) के साथ शत्रुता के कारण यह जातक की माता और ननिहाल पक्ष (मामा, नाना) के लिए कष्टकारी या संघर्षपूर्ण सिद्ध हो सकता है।',
      gu: 'લાલ કિતાબ મુજબ ચોથા ભાવમાં બુધ જાતકને અત્યંત બુદ્ધિશાળી અને વેપારમાં સફળ બનાવે છે. પરંતુ માતા અને મોસાળ પક્ષ (નાના, મામા) માટે શારીરિક કે માનસિક કષ્ટદાયક નીવડી શકે છે.'
    },
    maternalImpact: {
      en: '⚠️ Maternal Impact: May bring health fluctuations for mother or financial loss/challenges for maternal uncles (Mama).',
      hi: '⚠️ माता एवं ननिहाल पर प्रभाव: माता के स्वास्थ्य में उतार-चढ़ाव और मामा या ननिहाल पक्ष में संघर्ष की संभावना।',
      gu: '⚠️ મોસાળ પર અસર: માતાના સ્વાસ્થ્યમાં ઉતાર-ચઢાવ અને મોસાળમાં સંઘર્ષ.'
    },
    remedies: {
      en: [
        '💧 Keep pure rain water or river water in a solid silver container at home.',
        '🥛 Donate milk or rice at a sacred temple.',
        '🟢 Avoid keeping broad-leafed green plants inside the bedroom.'
      ],
      hi: [
        '💧 चांदी के बर्तन में शुद्ध गंगाजल या बारिश का पानी घर में रखें।',
        '🥛 धार्मिक स्थान में दूध या चावल का दान करें।',
        '🟢 बेडरूम के अंदर चौड़े पत्ते वाले हरे पौधे न रखें।'
      ],
      gu: [
        '💧 ચાંદીના પાત્રમાં શુદ્ધ વરસાદનું પાણી કે ગંગાજળ ઘરમાં રાખો.',
        '🥛 મંદિર કે ધાર્મિક સ્થાનમાં દૂધ અથવા ચોખાનું દાન કરો.',
        '🟢 બેડરૂમમાં પહોળા પાંદડાવાળા છોડ ન રાખવા.'
      ]
    },
    pukkaGharNote: {
      en: 'Moon is the natural Pukka Ghar owner of 4th House.',
      hi: 'चतुर्थ भाव का पक्का घर चंद्रमा का है।',
      gu: 'ચોથો ભાવ ચંદ્રનો પક્કો ઘર છે.'
    }
  },

  // --- SUN RULES ---
  {
    id: 'lk_sun_h1',
    planet: 'Surya (Sun)',
    house: 1,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      en: 'Lal Kitab: 1st House Sun (King in Own Pukka Ghar)',
      hi: 'लाल किताब: प्रथम भाव में सूर्य (अपने पक्के घर में राजा)',
      gu: 'લાલ કિતાબ: પ્રથમ ભાવમાં સૂર્ય (પોતાના પક્કા ઘરમાં રાજા)'
    },
    description: {
      en: 'Sun in the 1st House is in its own natural Pukka Ghar in Lal Kitab. Makes the native a royal leader, truthful, courageous, and highly respected in society.',
      hi: 'प्रथम भाव में सूर्य अपने पक्के घर में होता है। यह जातक को राजा के समान तेजस्वी, सत्यवादी और समाज में पूज्य बनाता है।',
      gu: 'પ્રથમ ભાવમાં સૂર્ય પોતાના પક્કા ઘરમાં રાજા સમાન તેજસ્વી બનાવે છે.'
    },
    remedies: {
      en: [
        '🚰 Construct a water fountain or facility for public benefit.',
        '☀️ Offer water to the rising Sun daily in a copper vessel.'
      ],
      hi: [
        '🚰 सार्वजनिक स्थान पर पीने के पानी का नल या प्याऊ लगवाएं।',
        '☀️ तांबे के लोटे से सूर्य को प्रतिदिन जल अर्पित करें।'
      ],
      gu: [
        '🚰 જાહેર સ્થાન પર પીવાના પાણીની સગવડ કરવી.',
        '☀️ દરરોજ સવારે સૂર્યનારાયણને જળ અર્પણ કરવું.'
      ]
    }
  },
  {
    id: 'lk_sun_h10',
    planet: 'Surya (Sun)',
    house: 10,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      en: 'Lal Kitab: 10th House Sun (Executive Power & Honor)',
      hi: 'लाल किताब: 10वें भाव में सूर्य (प्रशासनिक सम्मान व अधिकार)',
      gu: 'લાલ કિતાબ: ૧૦મા ભાવમાં સૂર્ય (વહીવટી સન્માન)'
    },
    description: {
      en: 'Sun in 10th house bestows high administrative authority, executive leadership, government favors, and professional dignity.',
      hi: '10वें भाव में सूर्य जातक को शासकीय सम्मान, उच्च पद, प्रशासनिक क्षमता और कर्मक्षेत्र में अपार प्रतिष्ठा प्रदान करता है।',
      gu: '૧૦મા ભાવમાં સૂર્ય સરકારી સન્માન અને ઉચ્ચ વહીવટી પદ આપે છે.'
    },
    remedies: {
      en: [
        '🪙 Throw copper coins into flowing river water.',
        '👑 Maintain high moral integrity and respect superiors.'
      ],
      hi: [
        '🪙 बहते जल में तांबे के सिक्के प्रवाहित करें।',
        '👑 सत्य और निष्ठा से कार्य करें, अधिकारियों का सम्मान करें।'
      ],
      gu: [
        '🪙 વહેતા પાણીમાં તાંબાના સિક્કા પધરાવવી.',
        '👑 સચ્ચાઈ અને નૈતિકતા જાળવવી.'
      ]
    }
  },

  // --- MOON RULES ---
  {
    id: 'lk_moon_h4',
    planet: 'Chandra (Moon)',
    house: 4,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      en: 'Lal Kitab: 4th House Moon (Ocean of Maternal Blessing)',
      hi: 'लाल किताब: चतुर्थ भाव में चंद्रमा (मातृ कृपा व सुख का महासागर)',
      gu: 'લાલ કિતાબ: ચોથા ભાવમાં ચંદ્ર (માતૃ કૃપા અને સુખ)'
    },
    description: {
      en: 'Moon in 4th house is in its supreme Pukka Ghar. Grants boundless domestic peace, financial abundance, maternal affection, and mental clarity.',
      hi: 'चतुर्थ भाव चंद्रमा का निज पक्का घर है। यह जातक को माता का असीम स्नेह, मानसिक शांति, अचल संपत्ति और अपार सुख-समृद्धि प्रदान करता है।',
      gu: 'ચોથા ભાવમાં ચંદ્ર માતૃ સુખ, માનસિક શાંતિ અને આર્થિક સમૃદ્ધિ આપે છે.'
    },
    remedies: {
      en: [
        '🥛 Serve milk or kheer to young children.',
        '🌸 Take daily morning blessings from your mother.'
      ],
      hi: [
        '🥛 बच्चों को दूध या खीर बाँटें।',
        '🌸 प्रतिदिन प्रातः अपनी माता के चरण स्पर्श कर आशीर्वाद लें।'
      ],
      gu: [
        '🥛 બાળકોને દૂધ કે ખીર વહેંચવી.',
        '🌸 માતાના આશીર્વાદ દરરોજ લેવા.'
      ]
    }
  },

  // --- MARS RULES ---
  {
    id: 'lk_mars_h3',
    planet: 'Mangala (Mars)',
    house: 3,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      en: 'Lal Kitab: 3rd House Mars (Lion-Hearted Valor)',
      hi: 'लाल किताब: तृतीय भाव में मंगल (सिंह के समान पराक्रम)',
      gu: 'લાલ કિતાબ: ત્રીજા ભાવમાં મંગળ (સિંહ સમાન પરાક્રમ)'
    },
    description: {
      en: 'Mars in 3rd house (its Pukka Ghar) makes the native immensely courageous, protective of brothers, victorious in competition, and fearless.',
      hi: 'तृतीय भाव मंगल का पक्का घर है। यह जातक को अत्यधिक साहसी, भाइयों का रक्षक, प्रतिस्पर्धियों पर विजयी और निडर बनाता है।',
      gu: 'ત્રીજા ભાવમાં મંગળ અતિ સાહસિક અને સ્પર્ધાઓમાં વિજયી બનાવે છે.'
    },
    remedies: {
      en: [
        '⚪ Keep a solid silver ball in your pocket or bag.',
        '🍯 Eat a pinch of jaggery before embarking on important work.'
      ],
      hi: [
        '⚪ ठोस चांदी की गोली अपनी जेब या बैग में रखें।',
        '🍯 शुभ कार्य पर जाने से पूर्व थोड़ा गुड़ खाएं।'
      ],
      gu: [
        '⚪ ચાંદીની નાની ગોળી પાસે રાખવી.',
        '🍯 કામ પર જતાં પહેલાં ગોળ ખાવો.'
      ]
    }
  },

  // --- JUPITER RULES ---
  {
    id: 'lk_jupiter_h9',
    planet: 'Brihaspati (Jupiter)',
    house: 9,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      en: 'Lal Kitab: 9th House Jupiter (Divine Ocean of Fortune)',
      hi: 'लाल किताब: नवम भाव में गुरु (भाग्य एवं धर्म का महासागर)',
      gu: 'લાલ કિતાબ: ૯મા ભાવમાં ગુરુ (ભાગ્ય અને ધર્મ)'
    },
    description: {
      en: 'Jupiter in 9th house resides in its primary Pukka Ghar. Bestows boundless fortune, wisdom, spiritual lineage, and divine protection in all crisis.',
      hi: 'नवम भाव गुरु का सर्वोच्च पक्का घर है। यह जातक को अद्वितीय भाग्योदय, उच्च शिक्षा, गुरु कृपा और हर संकट में ईश्वरीय रक्षा कवच देता है।',
      gu: '૯મા ભાવમાં ગુરુ ભાગ્યવૃદ્ધિ અને ઈશ્વરીય કૃપા આપે છે.'
    },
    remedies: {
      en: [
        '🟡 Apply yellow saffron (kesar) tilak on forehead daily.',
        '📚 Respect teachers, scholars, and religious places.'
      ],
      hi: [
        '🟡 माथे पर प्रतिदिन केसर का तिलक लगाएं।',
        '📚 गुरुजनों, आचार्यों और मंदिरों का सदैव आदर करें।'
      ],
      gu: [
        '🟡 કપાળ પર કેસરનું તિલક કરવું.',
        '📚 વડીલો અને ગુરુજનોનું આદર કરવું.'
      ]
    }
  },

  // --- SATURN RULES ---
  {
    id: 'lk_saturn_h8',
    planet: 'Shani (Saturn)',
    house: 8,
    isGoodForNative: false,
    isBadForFamilyOrMother: false,
    title: {
      en: 'Lal Kitab: 8th House Saturn (Eye of Mystery & Longevity)',
      hi: 'लाल किताब: अष्टम भाव में शनि (रहस्य एवं आयु का कारक)',
      gu: 'લાલ કિતાબ: આઠમા ભાવમાં શનિ (આયુષ્ય અને રહસ્ય)'
    },
    description: {
      en: 'Saturn in 8th house gives long life if the native avoids alcohol and dark deceptions, but creates unexpected delays if misdirected.',
      hi: 'अष्टम भाव का शनि जातक को लंबी आयु देता है, परंतु मदिरा या छल-कपट से दूर रहने की हिदायत देता है।',
      gu: 'આઠમા ભાવમાં શનિ દીર્ઘ આયુષ્ય આપે છે પણ દારૂ અને છળ-કપટથી દૂર રહેવું.'
    },
    remedies: {
      en: [
        '🍞 Feed dark dogs with mustard oil coated bread (roti).',
        '🏺 Bury square silver piece in a secluded clean spot.'
      ],
      hi: [
        '🍞 काले कुत्ते को सरसों का तेल लगी रोटी खिलाएं।',
        '🏺 चांदी का चौकोर टुकड़ा अपने पास रखें या दबाएं।'
      ],
      gu: [
        '🍞 કાળા કુતરાને રસોઈ કરેલી સરસવના તેલવાળી રોટલી ખવડાવવી.',
        '🏺 ચાંદીનો ચોરસ ટુકડો પાસે રાખવો.'
      ]
    }
  },
  {
    id: 'lk_saturn_h10',
    planet: 'Shani (Saturn)',
    house: 10,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      en: 'Lal Kitab: 10th House Saturn (Kingmaker in Karma Ghar)',
      hi: 'लाल किताब: 10वें भाव में शनि (कर्मक्षेत्र में किंगमेकर)',
      gu: 'લાલ કિતાબ: ૧૦મા ભાવમાં શનિ (કિંગમેકર)'
    },
    description: {
      en: 'Saturn in 10th house is in its own natural Pukka Ghar. Makes the native an industrious builder, judge, administrator, or industrial giant.',
      hi: '10वां भाव शनि का अपना निज पक्का घर है। यह जातक को न्यायप्रिय, कठोर परिश्रमी, उद्योगपति या सर्वोच्च प्रशासनिक पद पर स्थापित करता है।',
      gu: '૧૦મા ભાવમાં શનિ ઉદ્યોગ અને કર્મક્ષેત્રમાં સર્વોચ્ચ સ્થાન આપે છે.'
    },
    remedies: {
      en: [
        '🤝 Serve poor workers, laborers, and elderly people.',
        '🚫 Refrain from consuming alcohol or unrighteous earnings.'
      ],
      hi: [
        '🤝 निर्धन श्रमिकों और वृद्धों की सेवा सहायता करें।',
        '🚫 मदिरा और असत्य कमाई से पूर्ण दूरी बनाए रखें।'
      ],
      gu: [
        '🤝 ગરીબ મજૂરો અને વૃદ્ધોની સેવા કરવી.',
        '🚫 દારૂ અને અનીતિની કમાણીથી દૂર રહેવું.'
      ]
    }
  },

  // --- RAHU RULES ---
  {
    id: 'lk_rahu_h12',
    planet: 'Rahu',
    house: 12,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      en: 'Lal Kitab: 12th House Rahu (Master of Foreign Lands)',
      hi: 'लाल किताब: 12वें भाव में राहु (विदेश व शोध का स्वामी)',
      gu: 'લાલ કિતાબ: ૧૨મા ભાવમાં રાહુ (વિદેશ ગમન)'
    },
    description: {
      en: 'Rahu in 12th house resides in its primary Pukka Ghar in Lal Kitab. Excellent for foreign settlement, international trade, software/tech, and spiritual isolation.',
      hi: '12वां भाव राहु का अपना पक्का घर है। यह जातक को विदेश प्रवास, अंतरराष्ट्रीय व्यापार, सॉफ्टवेयर/तकनीकी और गहन शोध में बड़ी सफलता देता है।',
      gu: '૧૨મા ભાવમાં રાહુ વિદેશ સ્થાયી થવા અને સોફ્ટવેર ક્ષેત્રમાં સફળતા આપે છે.'
    },
    remedies: {
      en: [
        '🌾 Keep red pouch filled with saunf (fennel seeds) under your pillow.',
        '🥣 Eat food in kitchen area and maintain clean bedding.'
      ],
      hi: [
        '🌾 तकिए के नीचे लाल कपड़े में सौंफ बांधकर रखें।',
        '🥣 रसोई घर में बैठकर भोजन करें और बिस्तर स्वच्छ रखें।'
      ],
      gu: [
        '🌾 ઓશીકા નીચે લાલ કાપડમાં વરિયાળી રાખવી.',
        '🥣 રસોડામાં બેસીને જમવું.'
      ]
    }
  },

  // --- KETU RULES ---
  {
    id: 'lk_ketu_h11',
    planet: 'Ketu',
    house: 11,
    isGoodForNative: true,
    isBadForFamilyOrMother: false,
    title: {
      en: 'Lal Kitab: 11th House Ketu (Sudden Windfalls & Freedom)',
      hi: 'लाल किताब: 11वें भाव में केतु (आकस्मिक धनलाभ व स्वतंत्रता)',
      gu: 'લાલ કિતાબ: ૧૧મા ભાવમાં કેતુ (આકસ્મિક ધનલાભ)'
    },
    description: {
      en: 'Ketu in 11th house grants sudden income, independent career decisions, protection from corporate politics, and spiritual wealth.',
      hi: '11वें भाव में केतु जातक को आकस्मिक धनप्राप्ति, स्वतंत्र निर्णय क्षमता और कारपोरेट राजनीति से सुरक्षा प्रदान करता है।',
      gu: '૧૧મા ભાવમાં કેતુ અચાનક નાણાકીય લાભ અને આઝાદી આપે છે.'
    },
    remedies: {
      en: [
        '🐕 Feed two-colored (black and white) street dogs.',
        '🧣 Donate black and white blanket to needy individuals.'
      ],
      hi: [
        '🐕 दोरंगी (काले-सफेद) कुत्ते को रोटी खिलाएं।',
        '🧣 कंबल या गर्म वस्त्र असहाय लोगों को दान करें।'
      ],
      gu: [
        '🐕 કાળા અને ધોળા કૂતરાને ભોજન આપવું.',
        '🧣 જરૂરિયાતમંદોને કામળો દાન કરવો.'
      ]
    }
  }
];

export interface EvaluatedLalKitabReport {
  appliedRules: LalKitabRule[];
  aspects: LalKitabAspect[];
  pukkaGharSummary: { house: number; owner: string; occupant: string }[];
  debts: LalKitabDebt[];
}

/**
 * Calculates Lal Kitab Ancestral Debts (Pitra Rina, Matru Rina, Stree Rina, etc.)
 */
export function calculateLalKitabDebts(kundali: KundaliResult): LalKitabDebt[] {
  const sunP = kundali.planets.find(p => p.name.includes('Sun') || p.name.includes('Surya'));
  const moonP = kundali.planets.find(p => p.name.includes('Moon') || p.name.includes('Chandra'));
  const marsP = kundali.planets.find(p => p.name.includes('Mars') || p.name.includes('Mangala'));
  const venusP = kundali.planets.find(p => p.name.includes('Venus') || p.name.includes('Shukra'));
  const jupP = kundali.planets.find(p => p.name.includes('Jupiter') || p.name.includes('Brihaspati'));
  const rahuP = kundali.planets.find(p => p.name.includes('Rahu'));
  const ketuP = kundali.planets.find(p => p.name.includes('Ketu'));
  const satP = kundali.planets.find(p => p.name.includes('Saturn') || p.name.includes('Shani'));

  const debts: LalKitabDebt[] = [
    {
      id: 'pitra_rina',
      name: {
        en: '👴 Pitra Rina (Paternal/Ancestral Debt)',
        hi: '👴 पितृ ऋण (पूर्वज एवं पिता का ऋण)',
        gu: '👴 પિતૃ ઋણ (પૂર્વજોનું ઋણ)'
      },
      cause: {
        en: 'Affliction to Sun/Jupiter in 2nd, 5th, 9th, or 10th House by Rahu/Ketu/Saturn.',
        hi: 'सूर्य अथवा गुरु पर राहु/केतु या शनि का प्रतिकूल प्रभाव।',
        gu: 'સૂર્ય કે ગુરુ પર રાહુ/કેતુનો પ્રભાવ.'
      },
      impact: {
        en: 'Delayed recognition, obstacles in ancestral property, and career fluctuations.',
        hi: 'पैतृक संपत्ति में बाधा, करियर में अकारण विलंब व प्रतिष्ठा की हानि।',
        gu: 'કારકિર્દીમાં વિલંબ અને સંપત્તિમાં વિવાદ.'
      },
      remedy: {
        en: 'Collect equal copper coins or funds from all blood family members and donate to a sacred cause/temple.',
        hi: 'परिवार के सभी रक्त संबंधियों से बराबर राशि एकत्र कर मंदिर या गौशाला में गुप्त दान करें।',
        gu: 'કુટુંબના તમામ સભ્યો પાસેથી સમાન રકમ એકઠી કરી ધાર્મિક સ્થળે દાન કરવી.'
      },
      isApplicable: !!(sunP && (sunP.house === 10 || sunP.house === 6 || (rahuP && sunP.house === rahuP.house)))
    },
    {
      id: 'matru_rina',
      name: {
        en: '🤱 Matru Rina (Maternal Debt)',
        hi: '🤱 मातृ ऋण (माता एवं ननिहाल का ऋण)',
        gu: '🤱 માતૃ ઋણ (માતાનું ઋણ)'
      },
      cause: {
        en: 'Affliction to Moon in 4th house or conjunction with Rahu/Ketu/Mercury.',
        hi: 'चतुर्थ भाव में चंद्रमा पर राहु/केतु या बुध का प्रभाव।',
        gu: 'ચોથા ભાવમાં ચંદ્ર પર રાહુ અથવા બુધની અસર.'
      },
      impact: {
        en: 'Emotional restlessness, mother’s health issues, or difficulty accumulating liquid cash.',
        hi: 'माता के स्वास्थ्य में उतार-चढ़ाव, मानसिक अशान्ति व तरल धन का अभाव।',
        gu: 'માતાના સ્વાસ્થ્યમાં સમસ્યા અને માનસિક અશાંતિ.'
      },
      remedy: {
        en: 'Collect silver coins from all family members and submerge them in flowing sacred river water.',
        hi: 'परिवार के सभी सदस्यों से चांदी का एक-एक सिक्का लेकर बहती पवित्र नदी में प्रवाहित करें।',
        gu: 'પરિવારના દરેક સભ્ય પાસેથી ચાંદીનો સિક્કો લઈ નદીમાં પધરાવવો.'
      },
      isApplicable: !!(moonP && (moonP.house === 4 || moonP.house === 8 || (rahuP && moonP.house === rahuP.house)))
    },
    {
      id: 'stree_rina',
      name: {
        en: '👑 Stree Rina (Wife/Women Ancestral Debt)',
        hi: '👑 स्त्री ऋण (पत्नी व स्त्री जाति का ऋण)',
        gu: '👑 સ્ત્રી ઋણ (સ્ત્રી સન્માન ઋણ)'
      },
      cause: {
        en: 'Affliction to Venus in 2nd or 7th house by Saturn/Rahu.',
        hi: 'शुक्र पर शनि या राहु का दुष्प्रभाव।',
        gu: 'શુક્ર પર શનિ કે રાહુની આડઅસર.'
      },
      impact: {
        en: 'Obstacles in marital harmony, domestic luxuries, or delayed marriage.',
        hi: 'वैवाहिक जीवन में तालमेल की कमी, सुख-सुविधाओं में बाधा।',
        gu: 'લગ્નજીવનમાં વિલંબ અને મતભેદ.'
      },
      remedy: {
        en: 'Feed 100 cows with fresh green fodder or pure ghee roti with family support.',
        hi: 'सौ गायों को हरा चारा या शुद्ध घी लगी रोटी खिलाएं।',
        gu: '૧૦૦ ગાયોને લીલો ચારો કે ઘીવાળી રોટલી ખવડાવવી.'
      },
      isApplicable: !!(venusP && (venusP.house === 7 || venusP.house === 1 || (satP && venusP.house === satP.house)))
    },
    {
      id: 'sva_rina',
      name: {
        en: '⚡ Sva Rina (Self-Karma Debt)',
        hi: '⚡ स्व-ऋण (स्वयं का कर्म ऋण)',
        gu: '⚡ સ્વ-ઋણ (પોતાનું કર્મ ઋણ)'
      },
      cause: {
        en: 'Mars in 1st, 8th, or 10th house affected by Rahu or Ketu.',
        hi: 'प्रथम या अष्टम भाव में मंगल पर राहु/केतु का प्रभाव।',
        gu: 'પ્રથમ કે આઠમા ભાવમાં મંગળ પર રાહુની અસર.'
      },
      impact: {
        en: 'Impatience, sudden disputes, injuries, or self-inflicted career breaks.',
        hi: 'अकारण क्रोध, विवाद, चोट-चपेट या स्वयं के गलत निर्णयों से हानि।',
        gu: 'અચાનક ગુસ્સો અને ઉતાવળા નિર્ણયોથી નુકસાન.'
      },
      remedy: {
        en: 'Perform a family Havan/Yajna and offer sweet items to children and dogs.',
        hi: 'घर में हवन करवाएं और बच्चों व कुत्तों को मीठी रोटी खिलाएं।',
        gu: 'ઘરમાં હવન કરાવવો અને બાળકોને મીઠાઈ આપવી.'
      },
      isApplicable: !!(marsP && (marsP.house === 8 || marsP.house === 1 || (rahuP && marsP.house === rahuP.house)))
    }
  ];

  return debts;
}

/**
 * Evaluates Lal Kitab analysis for a birth chart
 */
export function evaluateLalKitabRules(kundali: KundaliResult): EvaluatedLalKitabReport {
  const appliedRules: LalKitabRule[] = [];

  // Match planets in houses with Lal Kitab registry
  kundali.planets.forEach((p: PlanetDetail) => {
    const matched = LAL_KITAB_RULES_REGISTRY.filter(r => {
      const pNameMatch = r.planet.toLowerCase().includes(p.name.split(' ')[0].toLowerCase());
      const houseMatch = r.house === p.house;
      return pNameMatch && houseMatch;
    });

    matched.forEach(rule => appliedRules.push(rule));
  });

  // If no explicit matched rule exists for a planet, generate a dynamic Lal Kitab baseline
  kundali.planets.forEach((p: PlanetDetail) => {
    const hasRule = appliedRules.some(r => r.house === p.house && r.planet.toLowerCase().includes(p.name.split(' ')[0].toLowerCase()));
    if (!hasRule) {
      const pukkaOwner = LAL_KITAB_PUKKA_GHAR[p.house] || 'N/A';
      appliedRules.push({
        id: `lk_dynamic_${p.name}_h${p.house}`,
        planet: p.name,
        house: p.house,
        isGoodForNative: true,
        isBadForFamilyOrMother: false,
        title: {
          en: `Lal Kitab: ${p.name} in House ${p.house}`,
          hi: `लाल किताब: ${p.hindiName} ${p.house}वें भाव में`,
          gu: `લાલ કિતાબ: ${p.hindiName} ${p.house}મા ભાવમાં`
        },
        description: {
          en: `${p.name} resides in House ${p.house}. In Lal Kitab, the natural owner (Pukka Ghar) of House ${p.house} is ${pukkaOwner}. Its energy grants distinct talents when aligned with ethical conduct and Lal Kitab principles.`,
          hi: `${p.hindiName} ${p.house}वें भाव में स्थित है। लाल किताब में ${p.house}वें भाव का पक्का घर ${pukkaOwner} का माना गया है। यह स्थान कर्म एवं पुरुषार्थ से विशेष फल प्रदान करता है।`,
          gu: `${p.hindiName} ${p.house}મા ભાવમાં છે. લાલ કિતાબમાં ${p.house}મા ભાવનું પક્કું ઘર ${pukkaOwner} નું છે. આ સ્થાન વિશેષ સફળતા આપે છે.`
        },
        remedies: {
          en: [
            `🙏 Offer daily prayers and respect elders for positive energy of ${p.name}.`,
            `🕊️ Avoid deceptive means and maintain clean surroundings at home.`
          ],
          hi: [
            `🙏 बड़े-बुजुर्गों का आशीर्वाद लें और सात्विक जीवन व्यतीत करें।`,
            `🕊️ घर में साफ-सफाई रखें और असत्य वचन से बचें।`
          ],
          gu: [
            `🙏 વડીલોના આશીર્વાદ લેવા અને સાત્વિક જીવન જીવવું.`,
            `🕊️ ઘરમાં સ્વચ્છતા રાખવી અને સત્ય બોલવું.`
          ]
        }
      });
    }
  });

  // Map Pukka Ghar status
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
