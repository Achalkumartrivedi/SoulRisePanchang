import { KundaliResult, PlanetDetail } from './kundaliEngine';
import { evaluateSaturnChains, SaturnChainsAudit } from './bnnSaturnTimelineEngine';

export interface SaturnHouseDetail {
  house: number;
  status: { en: string; hi: string; gu: string };
  dignityType: 'EXALTED' | 'DEBILITATED' | 'OWN_HOUSE' | 'EXCELLENT' | 'GOOD' | 'MIXED' | 'DIFFICULT' | 'CHALLENGING';
  manifestations: { en: string[]; hi: string[]; gu: string[] };
  becomesGoodWhen?: { en: string[]; hi: string[]; gu: string[] };
  becomesBadWhen?: { en: string[]; hi: string[]; gu: string[] };
  specialRules?: { en: string[]; hi: string[]; gu: string[] };
  warnings?: { en: string[]; hi: string[]; gu: string[] };
  remedies: { en: string[]; hi: string[]; gu: string[] };
}

export interface SaturnConjunctionDetail {
  planet: string;
  effect: { en: string; hi: string; gu: string };
  nature: 'BENEFIC' | 'PROTECTIVE' | 'CHALLENGING' | 'HARSH';
}

export interface SaturnSpecialRuleEvaluation {
  ruleId: string;
  ruleName: { en: string; hi: string; gu: string };
  isTriggered: boolean;
  description: { en: string; hi: string; gu: string };
}

export interface SaturnAuditReport {
  userSaturnHouse: number;
  userSaturnRashi: string;
  userSaturnDegree: string;
  saturnDignity: { en: string; hi: string; gu: string };
  houseGuide: SaturnHouseDetail;
  activeConjunctions: SaturnConjunctionDetail[];
  specialRulesEvaluated: SaturnSpecialRuleEvaluation[];
  hasActivePoisonChannel: boolean;
  poisonReleaseChannel: { en: string; hi: string; gu: string };
  ageMilestones: number[];
  threeHouseGroup: { name: string; houses: number[]; description: { en: string; hi: string; gu: string } };
  universalRemedies: { en: string[]; hi: string[]; gu: string[] };
  saturnChains: SaturnChainsAudit;
}

/**
 * Master Registry of Saturn in All 12 Houses (Classical Lal Kitab 1-12)
 */
export const SATURN_12_HOUSES_GUIDE: Record<number, SaturnHouseDetail> = {
  1: {
    house: 1,
    status: {
      en: '1ST HOUSE – DEBILITATED (Most Challenging Placement)',
      hi: 'प्रथम भाव - नीच स्थान (सर्वाधिक चुनौतीपूर्ण स्थिति)',
      gu: 'પ્રથમ ભાવ - નીચ સ્થાન (અત્યંત પડકારજનક)'
    },
    dignityType: 'DEBILITATED',
    manifestations: {
      en: [
        'Serious and reserved personality with delayed early success.',
        'Heavy childhood responsibilities and feeling of loneliness.',
        'Grants long life, but achieved through continuous perseverance and hardship.'
      ],
      hi: [
        'गंभीर व्यक्तित्व और शुरुआती जीवन में विलंब से सफलता।',
        'बचपन में पारिवारिक जिम्मेदारियां और एकाकीपन का अनुभव।',
        'कठोर परिश्रम से लंबी आयु, परंतु जीवन संघर्षपूर्ण रहता है।'
      ],
      gu: [
        'ગંભીર વ્યક્તિત્વ અને શરૂઆતમાં વિલંબથી સફળતા.',
        'બાળપણમાં જવાબદારીઓ અને એકલતા.',
        'સખત પરિશ્રમથી દીર્ઘ આયુષ્ય.'
      ]
    },
    becomesGoodWhen: {
      en: [
        'Mercury, Venus, Rahu, or Ketu occupy the 7th House.',
        'Enemy planets (Sun, Moon, Mars) do not disturb the 3rd, 7th, and 10th Houses.'
      ],
      hi: [
        'बुध, शुक्र, राहु या केतु सप्तम भाव में स्थित हों।',
        'शत्रु ग्रह (सूर्य, चंद्रमा, मंगल) 3रे, 7वें और 10वें भाव को पीड़ित न करें।'
      ],
      gu: [
        'બુધ, શુક્ર, રાહુ કે કેતુ ૭મા ભાવમાં હોય.',
        'શત્રુ ગ્રહો ૩જા, ૭મા અને ૧૦મા ભાવને પીડિત ન કરે.'
      ]
    },
    becomesBadWhen: {
      en: [
        'Sun occupies 7th, 10th, or 11th House.',
        'Excessive body hair is traditionally cited as a sign of stronger malefic influence.'
      ],
      hi: [
        'सूर्य 7वें, 10वें या 11वें भाव में स्थित हो।',
        'शरीर पर अत्यधिक बाल होना लाल किताब में मंदे प्रभाव का प्रतीक माना गया है।'
      ],
      gu: [
        'સૂર્ય ૭મા, ૧૦મા કે ૧૧મા ભાવમાં હોય.',
        'શરીર પર વધુ પડતા વાળ હોવા અશુભ સંકેત ગણાય છે.'
      ]
    },
    remedies: {
      en: [
        '🍺 Strictly avoid alcohol and non-vegetarian food.',
        '🐒 Feed monkeys with jaggery and wheat.',
        '🥛 Pour sweet milk at the roots of a Banyan (Bargad) tree.',
        '🖤 Bury black Kohl (Surma) underground in a secluded place.',
        '🎂 Avoid loud or lavish birthday celebrations.'
      ],
      hi: [
        '🍺 मदिरा एवं मांसाहार का पूर्णतः त्याग करें।',
        '🐒 बंदरों को गुड़ और गेहूं खिलाएं।',
        '🥛 बरगद की जड़ में मीठा दूध अर्पित करें।',
        '🖤 निर्जन स्थान में काला सुरमा दबाएं।',
        '🎂 जन्मदिन पर आतिशबाजी व भव्य उत्सव मनाने से बचें।'
      ],
      gu: [
        '🍺 દારૂ અને માંસાહારનો ત્યાગ કરવો.',
        '🐒 વાંદરાઓને ગોળ અને ઘઉં ખવડાવવા.',
        '🥛 વડના ઝાડની જળમાં મીઠું દૂધ અર્પણ કરવું.',
        '🖤 કાળું સૂરમા દાટવું.',
        '🎂 ભવ્ય બર્થડે ઉજવણીથી બચવું.'
      ]
    }
  },

  2: {
    house: 2,
    status: {
      en: '2ND HOUSE – GOOD (Auspicious Wealth & Justice)',
      hi: 'द्वितीय भाव - शुभ (स्थायी धन व न्यायप्रिय स्वभाव)',
      gu: 'બીજો ભાવ - શુભ (સ્થાયી સંપત્તિ)'
    },
    dignityType: 'GOOD',
    manifestations: {
      en: [
        'Grants stable wealth, financial endurance, and deep wisdom.',
        'Religious nature and strong sense of justice in speech and action.',
        'Hidden Rule: The 8th House decides whether Saturn remains fully benefic.'
      ],
      hi: [
        'स्थायी धन-धान्य, वित्तीय स्थिरता और गंभीर बुद्धिमत्ता।',
        'धार्मिक विचार और न्यायप्रिय वाणी व व्यवहार।',
        'गुप्त नियम: 8वां भाव तय करता है कि शनि पूर्ण शुभ रहेगा या नहीं।'
      ],
      gu: [
        'સ્થાયી ધન-સંપત્તિ અને ગંભીર બુદ્ધિમત્તા.',
        'ધાર્મિક અને ન્યાયપ્રિય સ્વભાવ.',
        'ગુપ્ત નિયમ: ૮મો ભાવ શનિનું ફળ નક્કી કરે છે.'
      ]
    },
    specialRules: {
      en: ['Marriage activates important karmic lessons involving in-laws and shared assets.'],
      hi: ['विवाह के पश्चात ससुराल पक्ष से जुड़े कर्म संबंध सक्रिय होते हैं।'],
      gu: ['લગ્ન પછી મોસાળ અને સાસરી પક્ષ સાથે કર્મ સંબંધો સક્રિય થાય છે.']
    },
    remedies: {
      en: [
        '🥛 Apply a tilak of fresh milk or curd on your forehead daily.',
        '👣 Visit a sacred temple barefoot for 43 consecutive days.',
        '🐍 Offer milk at a snake shrine or Peepal tree root.',
        '👵 Respect elders and maintain clean moral conduct.'
      ],
      hi: [
        '🥛 प्रतिदिन माथे पर कच्चे दूध या दही का तिलक लगाएं।',
        '👣 लगातार 43 दिन नंगे पैर मंदिर जाकर दर्शन करें।',
        '🐍 सर्प देव या पीपल की जड़ में दूध अर्पित करें।',
        '👵 बड़े-बुजुर्गों का आदर करें।'
      ],
      gu: [
        '🥛 દરરોજ દૂધનું તિલક કરવું.',
        '👣 ૪૩ દિવસ અનંત ઉઘાડા પગે મંદિરે જવું.',
        '🐍 સાપ કે પીપળાના મૂળમાં દૂધ અર્પણ કરવું.'
      ]
    }
  },

  3: {
    house: 3,
    status: {
      en: '3RD HOUSE – EXCELLENT (Valor, Intuition & Self-Made Success)',
      hi: 'तृतीय भाव - अत्यंत श्रेष्ठ (प्रचंड साहस व स्व-निर्मित सफलता)',
      gu: 'ત્રીજો ભાવ - અત્યંત ઉત્તમ (પરાક્રમ)'
    },
    dignityType: 'EXCELLENT',
    manifestations: {
      en: [
        'One of Saturn’s strongest and most victorious placements in Lal Kitab.',
        'Immense courage, strong intuition, robust health, and fierce persistence.',
        'Self-made success and dominance over all competitors.'
      ],
      hi: [
        'लाल किताब में शनि का सबसे शक्तिशाली व विजयी स्थान।',
        'असीम साहस, तीव्र अंतर्ज्ञान, उत्तम स्वास्थ्य और अटूट लगन।',
        'स्व-निर्मित सफलता और शत्रुओं पर पूर्ण दबदबा।'
      ],
      gu: [
        'લાલ કિતાબમાં શનિનું સૌથી શક્તિશાળી સ્થાન.',
        'અસીમ સાહસ, તીવ્ર અંતર્જ્ઞાન અને સ્વ-નિર્મિત સફળતા.'
      ]
    },
    specialRules: {
      en: [
        'Ketu in 3rd House makes Saturn exceptionally strong and victorious.',
        'Weakness: Money may not remain easily in cash form; re-invest in solid assets.'
      ],
      hi: [
        'यदि केतु भी 3रे भाव में हो, तो शनि अत्यंत बलवान व विजयी बनता है।',
        'कमजोरी: तरल धन हाथ में ज्यादा देर नहीं टिकता, अचल संपत्ति में निवेश करें।'
      ],
      gu: [
        'જો કેતુ ૩જા ભાવમાં હોય તો શનિ અત્યંત બળવાન બને છે.',
        'રોકડ નાણાં હાથમાં ન ટકે, મિલકતમાં રોકાણ કરવું.'
      ]
    },
    remedies: {
      en: [
        '🐕 Feed three black dogs with oil-coated rotis daily.',
        '👁️ Donate eye drops or eye medicines to needy people.',
        '🍺 Strictly refrain from consuming alcohol.'
      ],
      hi: [
        '🐕 तीन काले कुत्तों को तेल लगी रोटी खिलाएं।',
        '👁️ निर्धन रोगियों को आंखों की दवाइयां दान करें।',
        '🍺 मदिरा का सेवन बिल्कुल न करें।'
      ],
      gu: [
        '🐕 ૩ કાળા કુતરાઓને તેલવાળી રોટલી ખવડાવવી.',
        '👁️ આંખની દવાઓનું દાન કરવું.',
        '🍺 દારૂથી દૂર રહેવું.'
      ]
    }
  },

  4: {
    house: 4,
    status: {
      en: '4TH HOUSE – MIXED (Emotionally Challenging & Property Delays)',
      hi: 'चतुर्थ भाव - मिश्रित (भावनात्मक चुनौतियां व गृह क्लेश)',
      gu: 'ચોથો ભાવ - મિશ્ર (ભાવનાત્મક પડકારો)'
    },
    dignityType: 'MIXED',
    manifestations: {
      en: [
        'Deep love and responsibility toward parents, but emotional heaviness.',
        'Delays in house construction and property acquisition.',
        'Disturbed domestic peace if rules are violated.'
      ],
      hi: [
        'माता-पिता के प्रति अगाध प्रेम व जिम्मेदारी, परंतु मानसिक बोझ।',
        'मकान और अचल संपत्ति के निर्माण में अकारण विलंब।',
        'पारिवारिक शांति में उतार-चढ़ाव।'
      ],
      gu: [
        'માતા-પિતા પ્રત્યે પ્રેમ પણ માનસિક બોજ.',
        'મકાન બાંધકામમાં વિલંબ.'
      ]
    },
    warnings: {
      en: [
        '🚫 Do NOT drink milk after sunset.',
        '🚫 Avoid laying house foundation at night.',
        '🚫 Never harm or kill snakes.'
      ],
      hi: [
        '🚫 सूर्यास्त के बाद कभी दूध न पिएं।',
        '🚫 रात्रि में मकान की नींव न रखें।',
        '🚫 कभी किसी सांप को नुकसान न पहुंचाएं।'
      ],
      gu: [
        '🚫 સૂર્યાસ્ત પછી દૂધ ન પીવું.',
        '🚫 રાત્રે મકાનનું ખાતમુહૂર્ત ન કરવું.',
        '🚫 સાપને ક્યારેય નુકસાન ન પહોંચાડવું.'
      ]
    },
    remedies: {
      en: [
        '🐦 Feed crows with boiled rice or bread daily.',
        '🦬 Feed black buffaloes with mustard oil rotis.',
        '🥛 Offer milk to a natural well or snake shrine.'
      ],
      hi: [
        '🐦 कौवों को नित्य भोजन या रोटी दें।',
        '🦬 काली भैंस को सरसों तेल लगी रोटी खिलाएं।',
        '🥛 कुएं या सर्प स्थान पर दूध अर्पित करें।'
      ],
      gu: [
        '🐦 કાગડાઓને દરરોજ રોટલી આપવી.',
        '🦬 ભેંસને તેલવાળી રોટલી ખવડાવવી.',
        '🥛 કૂવામાં કે નાગ દેવને દૂધ ચડાવવું.'
      ]
    }
  },

  5: {
    house: 5,
    status: {
      en: '5TH HOUSE – DIFFICULT (Challenging Karmic Placement)',
      hi: 'पंचम भाव - चुनौतीपूर्ण (कठिन कर्म बंधन व संतान चिंता)',
      gu: 'પાંચમો ભાવ - મુશ્કેલ (કર્મ બંધન)'
    },
    dignityType: 'DIFFICULT',
    manifestations: {
      en: [
        'Sharp intellect and pride, but karmic obstacles in progeny and education.',
        'Delays in children’s settled career.',
        'Empty 10th House Rule: Vacant 10th House may trouble child development.'
      ],
      hi: [
        'तीक्ष्ण बुद्धि व स्वाभिमान, परंतु संतान और शिक्षा में कर्म बाधा।',
        'संतान के सेटलमेंट में विलंब।',
        '10वां भाव खाली होने पर संतान सुख में रुकावट आती है।'
      ],
      gu: [
        'તીવ્ર બુદ્ધિ પણ સંતાન અને શિક્ષણમાં વિલંબ.',
        '૧૦મો ભાવ ખાલી હોય તો સંતાન ચિંતા વધે.'
      ]
    },
    warnings: {
      en: ['🚫 Avoid constructing your own house before age 48.'],
      hi: ['🚫 48 वर्ष की आयु से पूर्व अपना मकान बनाने से बचें।'],
      gu: ['🚫 ૪૮ વર્ષની ઉંમર પહેલાં પોતાનું મકાન ન બનાવવું.']
    },
    remedies: {
      en: [
        '🥜 Offer almonds in a sacred temple and bring half back home to store.',
        '🏠 Keep Jupiter (gold/chana dal) and Mars (silver/red dal) items in ancestral home.'
      ],
      hi: [
        '🥜 मंदिर में बादाम चढ़ाएं और आधे बादाम वापस लाकर घर में संभाल कर रखें।',
        '🏠 पैतृक घर में गुरु (सोना/चना दाल) व मंगल (चांदी/लाल मसूर) की वस्तुएं रखें।'
      ],
      gu: [
        '🥜 મંદિરમાં બદામ ચડાવવી અને અડધી ઘર લાવવી.',
        '🏠 ઘરમાં સોનું અને ચાંદી સાચવીને રાખવા.'
      ]
    }
  },

  6: {
    house: 6,
    status: {
      en: '6TH HOUSE – CHALLENGING BUT TRANSFORMATIVE (Victory After Struggle)',
      hi: 'छठा भाव - संघर्षमय परंतु परिवर्तनकारी (शत्रुहंता योग)',
      gu: 'છઠ્ઠો ભાવ - સંઘર્ષ પછી વિજય'
    },
    dignityType: 'CHALLENGING',
    manifestations: {
      en: [
        'Service-oriented career and supreme capability to defeat enemies.',
        'Lessons involving loans, debts, and labor management.',
        'Good Conditions: Marriage after 28 years & well-placed Ketu bring great elevation.'
      ],
      hi: [
        'सेवा-आधारित करियर और शत्रुओं को परास्त करने की अद्वितीय क्षमता।',
        'ऋण, कर्ज और कर्मचारियों से जुड़े सबक।',
        '28 वर्ष के बाद विवाह व शुभ केतु होने पर अत्यधिक तरक्की होती है।'
      ],
      gu: [
        'સેવા ક્ષેત્રે સફળતા અને શત્રુઓ પર વિજય.',
        '૨૮ વર્ષ પછી લગ્ન થાય તો ભાગ્યોદય થાય છે.'
      ]
    },
    warnings: {
      en: ['🚫 Purchasing leather and heavy iron items during low periods triggers problem.'],
      hi: ['🚫 मंदी के समय चमड़ा और भारी लोहा खरीदने से समस्याएं बढ़ती हैं।'],
      gu: ['🚫 મંદીના સમયે ચામડું અને લોખંડ ન ખરીદવું.']
    },
    remedies: {
      en: [
        '⚪ Carry a solid square piece of silver in your pocket.',
        '🥛 Mix a few drops of milk in water while taking a bath.',
        '🌙 Night work or evening-based operations suit Saturn here.'
      ],
      hi: [
        '⚪ जेब में चांदी का ठोस चौकोर टुकड़ा रखें।',
        '🥛 स्नान के पानी में थोड़ा कच्चा दूध मिलाकर स्नान करें।',
        '🌙 रात्रि का कार्य या शाम के समय व्यवसाय शनि के अनुकूल रहता है।'
      ],
      gu: [
        '⚪ ચાંદીનો ચોરસ ટુકડો પાસે રાખવો.',
        '🥛 નાહવાના પાણીમાં દૂધ ઉમેરવું.',
        '🌙 રાત્રિના કામ શનિ માટે અનુકૂળ રહે છે.'
      ]
    }
  },

  7: {
    house: 7,
    status: {
      en: '7TH HOUSE – EXALTED (Supreme Raj Yoga & Business Throne)',
      hi: 'सप्तम भाव - उच्च स्थान (परम राजयोग व व्यापारिक सत्ता)',
      gu: 'સાતમો ભાવ - ઉચ્ચ સ્થાન (પરમ રાજયોગ)'
    },
    dignityType: 'EXALTED',
    manifestations: {
      en: [
        'One of the best Saturn placements in Lal Kitab (Exaltation House).',
        'Mature, dignified marriage and highly stable long-lasting business.',
        'Respect in society, durable partnerships, and grand success after initial delay.'
      ],
      hi: [
        'लाल किताब में शनि का सर्वोच्च स्थान (उच्च घर)।',
        'परिपक्व, गरिमापूर्ण वैवाहिक जीवन और दीर्घकालिक स्थिर व्यापार।',
        'समाज में सम्मान, स्थायी साझेदारी और शुरुआती विलंब के बाद महा-सफलता।'
      ],
      gu: [
        'લાલ કિતાબમાં શનિનું સર્વોચ્ચ સ્થાન.',
        'પરિપક્વ લગ્નજીવન અને સ્થાયી વેપાર.',
        'સમાજમાં સન્માન અને વિલંબ પછી મોટો વિજય.'
      ]
    },
    specialRules: {
      en: ['Delayed marriage (after age 26-28) often becomes extremely durable and fruitful.'],
      hi: ['विलंबित विवाह (26-28 वर्ष के बाद) अत्यंत सुखी व फलदायी सिद्ध होता है।'],
      gu: ['વિલંબિત લગ્ન અત્યંત સુખી નીવડે છે.']
    },
    remedies: {
      en: [
        '🤝 Keep all written promises and business agreements.',
        '⚖️ Maintain absolute honesty in financial and marital dealings.',
        '👑 Avoid unnecessary ego or arrogance with subordinates.'
      ],
      hi: [
        '🤝 अपने वचनों और व्यापारिक अनुबंधों का पालन करें।',
        '⚖️ वित्तीय व वैवाहिक मामलों में पूर्ण सत्यनिष्ठा रखें।',
        '👑 अधीनस्थों और कर्मचारियों के साथ अहंकार न करें।'
      ],
      gu: [
        '🤝 આપેલા વચનો પાળવા.',
        '⚖️ વેપારમાં પ્રામાણિકતા રાખવી.'
      ]
    }
  },

  8: {
    house: 8,
    status: {
      en: '8TH HOUSE – GOOD BUT SECRETIVE (Longevity & Deep Research)',
      hi: 'अष्टम भाव - शुभ परंतु गूढ़ (दीर्घायु व शोध क्षमता)',
      gu: 'આઠમો ભાવ - શુભ પણ ગૂઢ'
    },
    dignityType: 'GOOD',
    manifestations: {
      en: [
        'Highly favorable in Lal Kitab if ethics are maintained.',
        'Grants long life, research capacity, occult knowledge, and sudden gains.',
        'Bad Manifestation: Machinery losses and property disputes if alcohol is used.'
      ],
      hi: [
        'नैतिकता बनाए रखने पर लाल किताब में अत्यंत शुभ।',
        'दीर्घायु, शोध क्षमता, गूढ़ ज्ञान और अचानक धन लाभ।',
        'मंदा प्रभाव: मदिरा सेवन से मशीनरी नुकसान व अचल संपत्ति विवाद।'
      ],
      gu: [
        'દીર્ઘ આયુષ્ય, શ્રદ્ધા અને ગૂઢ જ્ઞાન.',
        'દારૂના સેવનથી મશીનરીમાં નુકસાન થાય.'
      ]
    },
    remedies: {
      en: [
        '🖤 Donate black Urad dal or black sesame seeds on Saturdays.',
        '⚪ Carry a square piece of solid silver in your wallet.',
        '👣 Avoid remaining barefoot inside the house.'
      ],
      hi: [
        '🖤 शनिवार को काली उड़द की दाल या काले तिल का दान करें।',
        '⚪ पर्स में चांदी का ठोस चौकोर टुकड़ा रखें।',
        '👣 घर के अंदर नंगे पैर घूमने से बचें।'
      ],
      gu: [
        '🖤 શનિવારે અડદનું દાન કરવું.',
        '⚪ ચાંદીનો ચોરસ ટુકડો પાસે રાખવો.',
        '👣 ઘરમાં ઉઘાડા પગે ન ફરવું.'
      ]
    }
  },

  9: {
    house: 9,
    status: {
      en: '9TH HOUSE – FORTUNE BUILDER (Lucky Lineage & Property Wealth)',
      hi: 'नवम भाव - भाग्य विधाता (पैतृक भाग्योदय व संपत्ति योग)',
      gu: '૯મો ભાવ - ભાગ્ય વિધાતા'
    },
    dignityType: 'EXCELLENT',
    manifestations: {
      en: [
        'One of the luckiest Saturn placements in Lal Kitab.',
        'Fortune built through steady effort, land ownership, long life, and spiritual maturity.',
        'Powerful Rule: Living with three generations strengthens Saturn immensely.'
      ],
      hi: [
        'लाल किताब में शनि के सबसे भाग्यशाली स्थानों में से एक।',
        'सतत प्रयास से भाग्योदय, अचल संपत्ति, लंबी आयु और आध्यात्मिक परिपक्वता।',
        'शक्तिशाली नियम: तीन पीढ़ियों के साथ एक घर में रहने से शनि महा-बली बनता है।'
      ],
      gu: [
        'લાલ કિતાબમાં શનિનું અત્યંત ભાગ્યશાળી સ્થાન.',
        'જમીન-સંપત્તિ અને આધ્યાત્મિક પરિપક્વતા.',
        'ત્રણ પેઢીઓ સાથે રહેવાથી શનિ અત્યંત મજબૂત બને છે.'
      ]
    },
    remedies: {
      en: [
        '🥜 Offer almonds at a temple and float raw rice in flowing water.',
        '🎓 Respect teachers, father, and spiritual gurus unconditionally.',
        '🤝 Always honor written and verbal promises.'
      ],
      hi: [
        '🥜 मंदिर में बादाम चढ़ाएं और बहते पानी में कच्चे चावल प्रवाहित करें।',
        '🎓 गुरुजनों, पिता व अध्यापकों का पूर्ण सम्मान करें।',
        '🤝 अपने वचनों का सदा पालन करें।'
      ],
      gu: [
        '🥜 મંદિરમાં બદામ ચડાવવી અને ચોખા વહેતા પાણીમાં પધરાવવા.',
        '🎓 ગુરુજનો અને પિતાનો આદર કરવો.'
      ]
    }
  },

  10: {
    house: 10,
    status: {
      en: '10TH HOUSE – OWN HOUSE (Saturn’s Sovereign Kingdom)',
      hi: 'दशम भाव - निज पक्का घर (शनि का राज-सिंहासन)',
      gu: '૧૦મો ભાવ - પોતાનું ઘર (શનિનું સિવાયન)'
    },
    dignityType: 'OWN_HOUSE',
    manifestations: {
      en: [
        'Saturn’s natural Pucca Ghar and supreme kingdom.',
        'State honors, administrative power, career peak, immense wealth, and leadership.',
        'Discipline and hard work yield unshakeable professional dignity.'
      ],
      hi: [
        'शनि का निज पक्का घर और सर्वोच्च राज-सिंहासन।',
        'शासकीय सम्मान, प्रशासनिक शक्ति, करियर की पराकाष्ठा और नेतृत्व क्षमता।',
        'अनुशासन और परिश्रम से अटूट व्यावसायिक प्रतिष्ठा।'
      ],
      gu: [
        'શનિનું પોતાનું પક્કું ઘર અને રાજ-સિંઘાસન.',
        'સરકારી સન્માન, વહીવટી સત્તા અને કારકિર્દીની ટોચ.'
      ]
    },
    warnings: {
      en: ['🚫 Avoid constructing your own house too early in life; wait for settled career.'],
      hi: ['🚫 बहुत कम उम्र में अपना मकान बनाने से बचें।'],
      gu: ['🚫 ખૂબ નાની ઉંમરે પોતાનું ઘર ન બનાવવું.']
    },
    remedies: {
      en: [
        '👁️ Feed ten blind or visually impaired people with sweet food.',
        '🍺 Strictly avoid alcohol and non-vegetarian food.',
        '🛕 Worship regularly and maintain clean moral conduct at workplace.'
      ],
      hi: [
        '👁️ दस दृष्टिहीन व्यक्तियों को भोजन कराएं।',
        '🍺 मदिरा व मांस का पूर्ण त्याग करें।',
        '🛕 कार्यस्थल पर सात्विकता व नियमित पूजा बनाए रखें।'
      ],
      gu: [
        '👁️ પ્રજ્ઞાચક્ષુ લોકોને ભોજન કરાવવું.',
        '🍺 દારૂ-માસનો ત્યાગ કરવો.'
      ]
    }
  },

  11: {
    house: 11,
    status: {
      en: '11TH HOUSE – DELAYED GAINS (Profitable After Maturity & Age 48)',
      hi: 'एकादश भाव - विलंबित महालाभ (48 वर्ष पश्चात महा-भाग्योदय)',
      gu: '૧૧મો ભાવ - વિલંબિત મહા લાભ'
    },
    dignityType: 'GOOD',
    manifestations: {
      en: [
        'Continuous income streams, influential social network, and fulfilled desires after maturity.',
        'Special Rule: Age 48 becomes a major turning point of grand prosperity.',
        'Results depend greatly upon the positions of Rahu and Ketu in the chart.'
      ],
      hi: [
        'परिपक्वता के बाद निरंतर आय, शक्तिशाली सामाजिक संबंध व मनोरथ सिद्धि।',
        'विशेष नियम: 48वां वर्ष महा-समृद्धि का मुख्य टर्निंग पॉइंट बनता है।',
        'परिणाम काफी हद तक राहु और केतु की स्थिति पर निर्भर करते हैं।'
      ],
      gu: [
        'આવકના સ્ત્રોતો અને મિત્રોનો સહયોગ.',
        '૪૮મું વર્ષ મોટો ટર્નિંગ પોઈન્ટ બને છે.'
      ]
    },
    remedies: {
      en: [
        '🥤 Keep a vessel of clean water before starting any important work.',
        '🛢️ Offer drops of mustard oil on earth or roots for 43 consecutive days.',
        '👑 Maintain solid moral character and avoid corrupt shortcuts.'
      ],
      hi: [
        '🥤 महत्वपूर्ण कार्य से पूर्व जलपात्र सामने रखें।',
        '🛢️ लगातार 43 दिन सरसों तेल की बूंदें भूमि पर अर्पित करें।',
        '👑 नैतिक चरित्र बनाए रखें और भ्रष्टाचार से बचें।'
      ],
      gu: [
        '🥤 અગત્યના કામ પહેલાં પાણી પાસે રાખવું.',
        '🛢️ ૪૩ દિવસ સરસવના તેલનું અર્પણ કરવું.'
      ]
    }
  },

  12: {
    house: 12,
    status: {
      en: '12TH HOUSE – HIDDEN TREASURE (Strongest Placement & Foreign Success)',
      hi: 'द्वादश भाव - गुप्त खजाना (अत्यंत बली स्थान व वैदेशिक वैभव)',
      gu: '૧૨મો ભાવ - ગુપ્ત ખજાનો'
    },
    dignityType: 'EXCELLENT',
    manifestations: {
      en: [
        'One of Saturn’s strongest and most victorious placements in Lal Kitab.',
        'Immense wealth, foreign trade/settlement success, lack of effective enemies, multiple properties.',
        'Powerful Rule: Friendly planets (Venus/Mercury) in 2nd House greatly strengthen Saturn.'
      ],
      hi: [
        'लाल किताब में शनि के सबसे शक्तिशाली व विजयी स्थानों में से एक।',
        'अपार संपत्ति, विदेश व्यापार/बसने में सफलता, शत्रुओं का अभाव और कई मकान।',
        'शक्तिशाली नियम: 2रे भाव में मित्र ग्रह (शुक्र/बुध) होने पर शनि महा-समृद्ध बनाता है।'
      ],
      gu: [
        'અપાર સંપત્તિ અને વિદેશી સફળતા.',
        'બીજા ભાવમાં મિત્ર ગ્રહો હોય તો શનિ અત્યંત ધનવાન બનાવે છે.'
      ]
    },
    warnings: {
      en: [
        '⚠️ Biggest Warning: Traditional texts advise NEVER disturbing the prescribed dark room.',
        '🚫 Avoid alcohol or non-vegetarian habits strictly if utilizing Saturn remedies.'
      ],
      hi: [
        '⚠️ सबसे बड़ी चेतावनी: अंधेरी कोठरी/डार्क रूम में रखी वस्तुओं से छेड़छाड़ न करें।',
        '🚫 मदिरा या मांसाहार का सेवन करने पर शनि का उपाय विपरीत फल दे सकता है।'
      ],
      gu: [
        '⚠️ અંધારી ઓરડીમાં રાખેલી વસ્તુઓને ન છેડવી.',
        '🚫 દારૂ-માસથી બચવું.'
      ]
    },
    remedies: {
      en: [
        '🥜 Keep 12 almonds wrapped in a black cloth inside a dark room in an iron vessel.',
        '🐟 Feed fish with flour balls regularly.',
        '🖤 Keep your dark storage room unbothered and clean.'
      ],
      hi: [
        '🥜 12 बादाम काले कपड़े में बांधकर लोहे के बर्तन में अंधेरे कमरे में रखें।',
        '🐟 मछलियों को आटे की गोलियां खिलाएं।',
        '🖤 अंधेरी कोठरी को स्वच्छ व शांत रखें।'
      ],
      gu: [
        '🥜 ૧૨ બદામ કાળા કપડામાં લોખંડના વાસણમાં અંધારી ઓરડીમાં રાખવી.',
        '🐟 માછલીઓને લોટની ગોળીઓ ખવડાવવી.'
      ]
    }
  }
};

/**
 * Saturn Conjunction Rules (Saturn + Other Planets)
 */
export const SATURN_CONJUNCTION_RULES: Record<string, SaturnConjunctionDetail> = {
  Sun: {
    planet: 'Sun (Surya)',
    nature: 'BENEFIC',
    effect: {
      en: '☀️ Saturn + Sun: Saturn’s poison reduces significantly. Grants administrative authority, state recognition, and tempered ambition.',
      hi: '☀️ शनि + सूर्य: शनि का विष काफी कम हो जाता है। प्रशासनिक अधिकार, सरकारी मान्यता और नियंत्रित महत्वाकांक्षा देता है।',
      gu: '☀️ શનિ + સૂર્ય: શનિનું વિષ ઘટે છે. સરકારી સન્માન આપે છે.'
    }
  },
  Moon: {
    planet: 'Moon (Chandra)',
    nature: 'CHALLENGING',
    effect: {
      en: '🌙 Saturn + Moon (Vish Yoga): Emotional heaviness, domestic disturbances, mental anxiety, and fluctuating peace of mind.',
      hi: '🌙 शनि + चंद्रमा (विष योग): मानसिक तनाव, भावनात्मक अशांति, घरेलू चिंताएं और मन में उतार-चढ़ाव।',
      gu: '🌙 શનિ + ચંદ્ર (વિષ યોગ): માનસિક અશાંતિ અને ભાવનાત્મક તણાવ.'
    }
  },
  Mars: {
    planet: 'Mars (Mangala)',
    nature: 'HARSH',
    effect: {
      en: '🔴 Saturn + Mars: Harsh karmic conflicts, fiery disputes, risk of accidents/injuries, requiring patience and cooling remedies.',
      hi: '🔴 शनि + मंगल: कठोर कर्म संघर्ष, विवाद, चोट/दुर्घटना की संभावना। धैर्य और ठंडे शांत उपायों की आवश्यकता।',
      gu: '🔴 શનિ + મંગળ: સખત સંઘર્ષ અને અકસ્માતનો ભય.'
    }
  },
  Jupiter: {
    planet: 'Jupiter (Brihaspati)',
    nature: 'PROTECTIVE',
    effect: {
      en: '🟡 Saturn + Jupiter (Brahma Yoga): Highly protective combination. Wisdom increases, financial security matures, and gurus guide native.',
      hi: '🟡 शनि + गुरु (ब्रह्म योग): अत्यंत रक्षात्मक संयोजन। बुद्धिमत्ता बढ़ती है, वित्तीय सुरक्षा मजबूत होती है और गुरु कृपा मिलती है।',
      gu: '🟡 શનિ + ગુરુ: અત્યંત રક્ષણાત્મક અને જ્ઞાનવર્ધક યોગ.'
    }
  },
  Venus: {
    planet: 'Venus (Shukra)',
    nature: 'BENEFIC',
    effect: {
      en: '💎 Saturn + Venus: Wealth accumulation, luxury assets, creative business, material comforts combined with practical lessons.',
      hi: '💎 शनि + शुक्र: धन संचय, लग्जरी गाड़ियां/मकान, कलात्मक व्यवसाय और व्यावहारिक पाठों के साथ भौतिक सुख।',
      gu: '💎 શનિ + શુક્ર: ધન અને ભૌતિક સુખ-સમૃદ્ધિ આપે છે.'
    }
  },
  Rahu: {
    planet: 'Rahu',
    nature: 'BENEFIC',
    effect: {
      en: '🚀 Saturn + Rahu: Strong worldly ambition, massive foreign IT/tech platforms, and unusual high success after initial struggle.',
      hi: '🚀 शनि + राहु: प्रचंड सांसारिक महत्वाकांक्षा, IT/वैश्विक प्लेटफॉर्म्स और शुरुआती संघर्ष के बाद अप्रत्याशित बड़ी सफलता।',
      gu: '🚀 શનિ + રાહુ: અચાનક મોટી સફળતા અને વિદેશી પ્રોજેક્ટ્સ.'
    }
  }
};

/**
 * Universal Safe Saturn Remedies
 */
export const UNIVERSAL_SATURN_REMEDIES = {
  en: [
    '👷 Serve poor labor workers and physical laborers with food and respect.',
    '👵 Respect elderly people and fatherly figures unconditionally.',
    '🐕 Feed street black dogs with mustard oil coated bread (roti).',
    '👁️ Help blind or visually impaired people with medicines and food.',
    '🤝 Always keep written and verbal promises.',
    '🚫 Avoid cruelty to animals, birds, or innocent creatures.',
    '🍺 Strictly avoid alcohol and non-veg consumption on Saturdays.',
    '🧘 Maintain workplace discipline, punctuality, and truthfulness.',
    '💎 Do NOT wear Saturn gemstones (Neelam / Blue Sapphire) without deep chart analysis.'
  ],
  hi: [
    '👷 निर्धन श्रमिकों और मजदूरों को भोजन कराएं व आदर दें।',
    '👵 वृद्धजनों व पिता तुल्य व्यक्तियों का पूर्ण सम्मान करें।',
    '🐕 काले कुत्तों को सरसों तेल से चुपड़ी रोटी खिलाएं।',
    '👁️ दृष्टिहीन व्यक्तियों को दवाइयां व भोजन दान करें।',
    '🤝 अपने वचनों और समझौतों का सदैव पालन करें।',
    '🚫 पशु-पक्षियों व बेजुबानों पर किसी प्रकार की क्रूरता न करें।',
    '🍺 शनिवार के दिन मदिरा व मांसाहार से पूर्ण परहेज रखें।',
    '🧘 कार्यस्थल पर अनुशासन, समयबद्धता और सत्यनिष्ठा रखें।',
    '💎 बिना विशेषज्ञ सलाह के नीलम रत्न धारण न करें।'
  ],
  gu: [
    '👷 ગરીબ મજૂરોને ભોજન કરાવવું અને આદર આપવો.',
    '👵 વડીલોનું સન્માન કરવું.',
    '🐕 કાળા કુતરાઓને તેલવાળી રોટલી ખવડાવવી.',
    '👁️ પ્રજ્ઞાચક્ષુ લોકોને મદદ કરવી.',
    '🤝 વચનો પાળવા.',
    '🍺 શનિવારે દારૂ-માસ ન લેવું.'
  ]
};

/**
 * Classical 7 Golden Rules of Lal Kitab Saturn Overview
 */
export const LAL_KITAB_7_GOLDEN_RULES = [
  {
    num: 1,
    title: { en: '1. Cosmic Karma Inspector & Judge (कर्म का न्यायाधीश)', hi: '1. कर्म का ब्रह्मांडीय न्यायाधीश', gu: '૧. કર્મનો ન્યાયાધીશ' },
    desc: {
      en: 'Saturn rewards labor, truth, and humility while severely penalizing deceit, arrogance, and animal cruelty.',
      hi: 'शनि श्रम, सत्य व नम्रता का पुरस्कार देता है, तथा छल, अहंकार व पशु क्रूरता का कठोर दंड देता है।',
      gu: 'શનિ પરિશ્રમનું શ્રેષ્ઠ ફળ અને કપટનો દંડ આપે છે.'
    }
  },
  {
    num: 2,
    title: { en: '2. Ketu Preceding Saturn Law (केतु पूर्व भाव नियम)', hi: '2. केतु पूर्व भाव नियम', gu: '૨. કેતુ શનિથી આગળ' },
    desc: {
      en: 'When Ketu precedes Saturn, Saturn turns highly benefic, conferring sudden unexpected wealth and protection.',
      hi: 'केतु शनि से पूर्व भाव में हो तो शनि अत्यंत शुभ होकर अपार धन व रक्षा प्रदान करता है।',
      gu: 'કેતુ શનિથી આગળ હોય તો શનિ અત્યંત શ્રેષ્ઠ ફળ આપે છે.'
    }
  },
  {
    num: 3,
    title: { en: '3. Saturn Preceding Sun Law (शनि सूर्य पूर्व नियम)', hi: '3. शनि सूर्य पूर्व नियम', gu: '૩. શનિ સૂર્યથી આગળ' },
    desc: {
      en: 'Saturn placed before Sun neutralizes malefic planetary afflictions and protects father/career.',
      hi: 'सूर्य से पूर्व स्थित शनि अपने दुर्योग शांत कर पिता व आजीविका की रक्षा करता है।',
      gu: 'સૂર્યથી આગળ રહેલો શનિ અશુભ ફળ ઘટાડે છે.'
    }
  },
  {
    num: 4,
    title: { en: '4. Empty 10th House Vacuum (दशम भाव खाली नियम)', hi: '4. दशम भाव खाली नियम', gu: '૪. ૧૦મો ભાવ ખાલી નિયમ' },
    desc: {
      en: 'An empty 10th House (Saturn Pucca Ghar) lets Saturn in Houses 1–7 grant sudden career elevation.',
      hi: '10वां भाव खाली होने पर 1-7 भाव का शनि बिना बाधा के करियर में अप्रत्याशित उछाल देता है।',
      gu: '૧૦મો ભાવ ખાલી હોય તો શનિ અચાનક મોટી સફળતા આપે છે.'
    }
  },
  {
    num: 5,
    title: { en: '5. Mars + Mercury Imitation Rule (मंगल-बुध युति नियम)', hi: '5. मंगल-बुध युति नियम', gu: '૫. મંગળ-બુધ યુતિ નિયમ' },
    desc: {
      en: 'Mars & Mercury together act like Saturn, releasing Saturn to act like Rahu (sudden MNC/tech growth).',
      hi: 'मंगल व बुध की युति शनि का कार्य संभालती है, और शनि राहु की भांति चमत्कारी सफलता देता है।',
      gu: 'મંગળ-બુધ ભેગા હોય તો શનિ રાહુ જેવા ચમત્કારો આપે છે.'
    }
  },
  {
    num: 6,
    title: { en: '6. 8th House Control on 2nd House Wealth (8वां भाव नियंत्रण)', hi: '6. 8वां भाव नियंत्रण', gu: '૬. ૮મા ભાવનું નિયંત્રણ' },
    desc: {
      en: 'Planets in the 8th House dictate whether 2nd House Saturn treasury remains permanent or fluctuates.',
      hi: '8वें भाव के ग्रह यह तय करते हैं कि 2रे भाव के शनि का खजाना स्थायी रहेगा या नहीं।',
      gu: '૮મા ભાવના ગ્રહો શનિની સંપત્તિ નક્કી કરે છે.'
    }
  },
  {
    num: 7,
    title: { en: '7. Poison Release Channel (विष निकास मार्ग)', hi: '7. विष निकास मार्ग', gu: '૭. વિષ નિકાસ માર્ગ' },
    desc: {
      en: 'Saturn discharges its heavy karmic load into linked houses (Mars, Moon, Sun) for balance.',
      hi: 'शनि अपना कर्म भार स्थिति के अनुसार विशेष ग्रहों (मंगल, चंद्र, सूर्य) पर विष के रूप में निकालता है।',
      gu: 'શનિનું ભારે ફળ સંબંધી ગ્રહો પર નીકળે છે.'
    }
  }
];

/**
 * Evaluate Complete Lal Kitab Saturn Audit for a Birth Kundali
 */
export function evaluateLalKitabSaturn(kundali: KundaliResult, lang: string = 'en'): SaturnAuditReport {
  // Find Saturn in kundali
  const satP = kundali.planets.find(p => p.name.includes('Saturn') || p.name.includes('Shani'));
  const satHouse = satP ? satP.house : 10;
  const satRashi = satP ? satP.rashiName : 'Capricorn';
  const satDegreeStr = satP ? satP.degreeStr : '15° 00\'';

  const pMap: Record<string, PlanetDetail> = {};
  kundali.planets.forEach(p => {
    const mainName = p.name.split(' ')[0];
    pMap[mainName] = p;
  });

  const satInfo = SATURN_12_HOUSES_GUIDE[satHouse] || SATURN_12_HOUSES_GUIDE[10];

  // Evaluate Dignity Label
  let dignityLabel = { en: 'Good Placement', hi: 'शुभ स्थिति', gu: 'શુભ સ્થિતિ' };
  if (satInfo.dignityType === 'EXALTED') {
    dignityLabel = { en: '🏆 Exalted (Uchcha - 7th House)', hi: '🏆 उच्च स्थान (7वां भाव)', gu: '🏆 ઉચ્ચ સ્થાન (૭મો ભાવ)' };
  } else if (satInfo.dignityType === 'DEBILITATED') {
    dignityLabel = { en: '⚠️ Debilitated (Neecha - 1st House)', hi: '⚠️ नीच स्थान (1ला भाव)', gu: '⚠️ નીચ સ્થાન (૧લો ભાવ)' };
  } else if (satInfo.dignityType === 'OWN_HOUSE') {
    dignityLabel = { en: '👑 Own Sovereign House (Pucca Ghar - 10th House)', hi: '👑 निज पक्का घर (10वां भाव)', gu: '👑 નિજ પક્કું ઘર (૧૦મો ભાવ)' };
  } else if (satInfo.dignityType === 'EXCELLENT') {
    dignityLabel = { en: '🌟 Excellent Placement', hi: '🌟 अत्यंत श्रेष्ठ स्थान', gu: '🌟 અત્યંત ઉત્તમ સ્થાન' };
  } else if (satInfo.dignityType === 'MIXED') {
    dignityLabel = { en: '⚖️ Mixed Placement (Emotional Test)', hi: '⚖️ मिश्रित स्थिति (भावनात्मक परीक्षा)', gu: '⚖️ મિશ્ર સ્થિતિ' };
  } else if (satInfo.dignityType === 'DIFFICULT') {
    dignityLabel = { en: '⚡ Difficult Karmic Placement', hi: '⚡ चुनौतीपूर्ण कर्म स्थान', gu: '⚡ મુશ્કેલ સ્થિતિ' };
  }

  // Active Conjunctions Check
  const activeConjunctions: SaturnConjunctionDetail[] = [];
  kundali.planets.forEach(p => {
    const mainName = p.name.split(' ')[0];
    if (p.house === satHouse && mainName !== 'Saturn' && mainName !== 'Shani') {
      if (SATURN_CONJUNCTION_RULES[mainName]) {
        activeConjunctions.push(SATURN_CONJUNCTION_RULES[mainName]);
      }
    }
  });

  // Evaluate Special Rules
  const specialRulesEvaluated: SaturnSpecialRuleEvaluation[] = [];

  // Rule 1: Ketu Before Saturn Rule
  const ketuP = pMap['Ketu'];
  const isKetuBefore = ketuP ? (ketuP.house < satHouse || (ketuP.house === satHouse && (ketuP.totalDegrees % 30) < (satP ? (satP.totalDegrees % 30) : 0))) : false;
  specialRulesEvaluated.push({
    ruleId: 'ketu_before_saturn',
    ruleName: {
      en: '1. Ketu Before Saturn Rule',
      hi: '1. केतु आगे / पूर्व भाव नियम (Ketu Before Saturn)',
      gu: '૧. કેતુ શનિથી આગળ નિયમ'
    },
    isTriggered: isKetuBefore,
    description: {
      en: isKetuBefore
        ? `✅ TRIGGERED: Ketu (House ${ketuP?.house}) occupies an earlier house than Saturn (House ${satHouse}). In Lal Kitab, Saturn becomes HIGHLY BENEFIC and bestows unexpected gains & protection!`
        : `ℹ️ Ketu (House ${ketuP?.house}) is placed after Saturn (House ${satHouse}). Saturn operates through standard house & degree karmic rules.`,
      hi: isKetuBefore
        ? `✅ सक्रिय: केतु (भाव ${ketuP?.house}) शनि (भाव ${satHouse}) से पूर्व भाव में स्थित है। लाल किताब के अनुसार शनि अत्यंत शुभ व फलदायी बनकर अपार सुरक्षा व लाभ प्रदान करता है!`
        : `ℹ️ केतु (भाव ${ketuP?.house}) शनि के बाद स्थित है। शनि सामान्य भाव व अंश नियमों से कार्य करता है।`,
      gu: isKetuBefore
        ? `✅ સક્રિય: કેતુ શનિથી પહેલાંના ભાવમાં છે. શનિ અત્યંત શુભ ફળ આપે છે!`
        : `ℹ️ કેતુ શનિ પછી છે.`
    }
  });

  // Rule 2: Saturn Before Sun Rule
  const sunP = pMap['Sun'] || pMap['Surya'];
  const isSaturnBeforeSun = sunP ? (satHouse < sunP.house || (satHouse === sunP.house && (satP ? (satP.totalDegrees % 30) : 0) < (sunP.totalDegrees % 30))) : false;
  specialRulesEvaluated.push({
    ruleId: 'saturn_before_sun',
    ruleName: {
      en: '2. Saturn Before Sun Rule',
      hi: '2. शनि सूर्य से पूर्व भाव नियम (Saturn Before Sun)',
      gu: '૨. શનિ સૂર્યથી પહેલાં નિયમ'
    },
    isTriggered: isSaturnBeforeSun,
    description: {
      en: isSaturnBeforeSun
        ? `✅ TRIGGERED: Saturn (House ${satHouse}) appears before Sun (House ${sunP?.house}). Lal Kitab Rule: Harmful effects of Saturn are significantly reduced!`
        : `ℹ️ Sun (House ${sunP?.house}) appears before Saturn (House ${satHouse}). Standard planetary aspect rules apply.`,
      hi: isSaturnBeforeSun
        ? `✅ सक्रिय: शनि (भाव ${satHouse}) सूर्य (भाव ${sunP?.house}) से पूर्व भाव में स्थित है। लाल किताब नियम: शनि के दुर्योग व मंदे प्रभाव काफी हद तक घट जाते हैं!`
        : `ℹ️ सूर्य (भाव ${sunP?.house}) शनि से पूर्व स्थित है।`,
      gu: isSaturnBeforeSun
        ? `✅ સક્રિય: શનિ સૂર્યથી આગળ છે. શનિનો અશુભ પ્રભાવ ઘટે છે!`
        : `ℹ️ સૂર્ય શનિથી આગળ છે.`
    }
  });

  // Rule 3: Empty 10th House Rule
  const house10Occupants = kundali.planets.filter(p => p.house === 10);
  const is10thEmpty = house10Occupants.length === 0;
  const isSaturnBetween1and7 = satHouse >= 1 && satHouse <= 7;
  const is10thRuleTriggered = isSaturnBetween1and7 && is10thEmpty;

  specialRulesEvaluated.push({
    ruleId: 'empty_10th_house',
    ruleName: {
      en: '3. Empty 10th House Rule (Pucca Ghar Vacuum)',
      hi: '3. दशम भाव खाली होने का नियम (Empty 10th House)',
      gu: '૩. ૧૦મો ભાવ ખાલી નિયમ'
    },
    isTriggered: is10thRuleTriggered,
    description: {
      en: is10thRuleTriggered
        ? `✅ TRIGGERED: Saturn is placed in House ${satHouse} (between 1st-7th) and the 10th House (Saturn's Pucca Ghar) is EMPTY! Lal Kitab Rule: Saturn receives unexpected direct support and bestows sudden career elevation!`
        : is10thEmpty
        ? `ℹ️ 10th House is empty, but Saturn is in House ${satHouse}.`
        : `ℹ️ 10th House is occupied by ${house10Occupants.map(p => p.name.split(' ')[0]).join(', ')}.`,
      hi: is10thRuleTriggered
        ? `✅ सक्रिय: शनि भाव ${satHouse} (1 से 7 के मध्य) में स्थित है और 10वां भाव पूरी तरह खाली है! लाल किताब नियम: शनि को अप्रत्याशित सीधा सहयोग मिलता है और करियर में अचानक उछाल आता है!`
        : is10thEmpty
        ? `ℹ️ 10वां भाव खाली है, परंतु शनि भाव ${satHouse} में है।`
        : `ℹ️ 10वें भाव में ${house10Occupants.map(p => p.name.split(' ')[0]).join(', ')} स्थित हैं।`,
      gu: is10thRuleTriggered
        ? `✅ સક્રિય: શનિ ૧-૭ ભાવમાં છે અને ૧૦મો ભાવ ખાલી છે. અચાનક મોટી કારકિર્દી સફળતા મળે છે!`
        : `ℹ️ ૧૦મો ભાવ ભરેલો છે.`
    }
  });

  // Rule 5: Mars + Mercury Imitation Rule
  const marsP = pMap['Mars'] || pMap['Mangala'];
  const mercP = pMap['Mercury'] || pMap['Budha'];
  const isMarsMercTogether = marsP && mercP && (marsP.house === mercP.house);

  specialRulesEvaluated.push({
    ruleId: 'mars_mercury_imitation',
    ruleName: {
      en: '5. Mars + Mercury Conjunction Rare Rule',
      hi: '5. मंगल + बुध दुर्लभ युति नियम (Mars + Mercury Combination)',
      gu: '૫. મંગળ + બુધ યુતિ નિયમ'
    },
    isTriggered: isMarsMercTogether,
    description: {
      en: isMarsMercTogether
        ? `💎 RARE LAL KITAB SECRET TRIGGERED: Mars and Mercury sit together in House ${marsP?.house}! They imitate Saturn's behavior, while Saturn in House ${satHouse} behaves more like Rahu (sudden tech surges & foreign MNC platforms)!`
        : `ℹ️ Mars (House ${marsP?.house}) and Mercury (House ${mercP?.house}) are in different houses. Saturn operates as Karma Karaka.`,
      hi: isMarsMercTogether
        ? `💎 अत्यंत दुर्लभ लाल किताब रहस्य सक्रिय: मंगल व बुध भाव ${marsP?.house} में एक साथ बैठे हैं! वे शनि की तरह व्यवहार करते हैं, जबकि आपका शनि (भाव ${satHouse}) राहु की भांति अप्रत्याशित बड़ी छलांग व वैदेशिक IT अवसर प्रदान करता है!`
        : `ℹ️ मंगल व बुध अलग-अलग भावों में हैं।`,
      gu: isMarsMercTogether
        ? `💎 દુર્લભ લાલ કિતાબ રહસ્ય સક્રિય! મંગળ+બુધ શનિનું ફળ આપે છે અને શનિ રાહુ જેવા ચમત્કારો આપે છે.`
        : `ℹ️ મંગળ અને બુધ અલગ છે.`
    }
  });

  // Poison Release Channel
  const poisonMap: Record<number, { en: string; hi: string; gu: string }> = {
    1: { en: 'Mars (Mangala) - Affects blood, physical energy, and younger brothers.', hi: 'मंगल - रक्त, शारीरिक ऊर्जा और भाइयों पर प्रभाव छोड़ता है।', gu: 'મંગળ પર અસર.' },
    3: { en: 'Mars (Mangala) - Affects physical stamina and sibling harmony.', hi: 'मंगल - शारीरिक साहस और भ्रातृ प्रेम पर प्रभाव छोड़ता है।', gu: 'મંગળ પર અસર.' },
    4: { en: 'Moon (Chandra) - Affects mental peace, liquid cash, and mother.', hi: 'चंद्रमा - मानसिक शांति, तरल धन और माता पर प्रभाव छोड़ता है।', gu: 'ચંદ્ર પર અસર.' },
    5: { en: 'Sun (Surya) - Affects state honors, administrative fame, and father.', hi: 'सूर्य - शासकीय सम्मान, प्रशासनिक साख और पिता पर प्रभाव छोड़ता है।', gu: 'સૂર્ય પર અસર.' }
  };

  const hasActivePoisonChannel = Boolean(poisonMap[satHouse]);
  const poisonReleaseChannel = poisonMap[satHouse] || {
    en: '',
    hi: '',
    gu: ''
  };

  // Three House Group
  let threeHouseGroup = {
    name: '3-5-9-10 (Career, Wisdom & Dharma Lineage)',
    houses: [3, 5, 9, 10],
    description: {
      en: 'Focuses on personal courage (3), creative intellect (5), fortune (9), and professional throne (10).',
      hi: 'व्यक्तिगत साहस (3), बुद्धि (5), भाग्य (9) और कर्म सिंहासन (10) को नियंत्रित करता है।',
      gu: 'સાહસ, બુદ્ધિ, ભાગ્ય અને કારકિર્દીને નિયંત્રિત કરે છે.'
    }
  };

  if ([1, 7, 8, 11].includes(satHouse)) {
    threeHouseGroup = {
      name: '1-7-8-11 (Self, Marriage, Longevity & Apex Gains)',
      houses: [1, 7, 8, 11],
      description: {
        en: 'Controls personal vitality (1), business/marriage (7), longevity (8), and massive income (11).',
        hi: 'आरोग्य (1), दांपत्य/व्यापार (7), आयु (8) और अपार लाभ (11) को नियंत्रित करता है।',
        gu: 'આરોગ્ય, લગ્ન, આયુષ્ય અને લાભને નિયંત્રિત કરે છે.'
      }
    };
  } else if ([2, 6, 8, 12].includes(satHouse)) {
    threeHouseGroup = {
      name: '2-6-8-12 (Wealth, Debts, Transformation & Foreign Secret Assets)',
      houses: [2, 6, 8, 12],
      description: {
        en: 'Controls treasury (2), service/loans (6), research/longevity (8), and foreign/spiritual wealth (12).',
        hi: 'कोष (2), सेवा/कर्ज (6), शोध/आयु (8) और वैदेशिक/गुप्त धन (12) को नियंत्रित करता है।',
        gu: 'સંપત્તિ, સેવા, આયુષ્ય અને વિદેશી ધનને નિયંત્રિત કરે છે.'
      }
    };
  }

  return {
    userSaturnHouse: satHouse,
    userSaturnRashi: satRashi,
    userSaturnDegree: satDegreeStr,
    saturnDignity: dignityLabel,
    houseGuide: satInfo,
    activeConjunctions,
    specialRulesEvaluated,
    hasActivePoisonChannel,
    poisonReleaseChannel,
    ageMilestones: [7, 14, 21, 28, 36, 42, 48, 60],
    threeHouseGroup,
    universalRemedies: UNIVERSAL_SATURN_REMEDIES,
    saturnChains: evaluateSaturnChains(kundali)
  };
}
