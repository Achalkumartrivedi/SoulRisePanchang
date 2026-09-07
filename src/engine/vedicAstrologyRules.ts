import { KundaliResult, PlanetDetail, HouseDetail } from './kundaliEngine';
import { buildFullMultiLang } from '../i18n/astrologyRuleTranslations';

export interface AstrologyRule {
  id: string;
  category: 'SOUL_PURPOSE' | 'HEALTH' | 'CAREER' | 'RELATIONSHIPS' | 'PLANET' | 'HOUSE';
  planet?: string; // 'Surya (Sun)', 'Shani (Saturn)', etc.
  house?: number; // 1 - 12
  sign?: number; // 0 - 11 (Aries to Pisces)
  title: Record<string, string>; // Language code -> string
  description: Record<string, string>;
  remedy?: Record<string, string>;
  system: 'VEDIC' | 'KP' | 'BNN' | 'BPHS';
  pastLifeKarma?: Record<string, string>;
  lifeChallenges?: Record<string, string>;
  physicalRemedy?: Record<string, string>;
}

/**
 * Registry of Vedic, BPHS, KP, BNN, and Lunar Astro Rules.
 * Easily extensible when user provides new rules.
 */
export const VEDIC_RULES_REGISTRY: AstrologyRule[] = [
  // --- SATURN (SHANI) HOUSE-BY-HOUSE LUNAR ASTRO KARMA & REMEDIES (1st to 12th House) ---
  {
    id: 'lunar_saturn_h1',
    category: 'PLANET',
    planet: 'Shani (Saturn)',
    house: 1,
    system: 'VEDIC',
    title: {
      en: 'Saturn in 1st House: Lunar Astro Karma & Remedies',
      hi: 'प्रथम भाव में शनि: पूर्व जन्म कर्म एवं शारीरिक उपाय',
      gu: 'પ્રથમ ભાવમાં શનિ: પૂર્વ જન્મ કર્મ અને શારીરિક ઉપાય'
    },
    description: {
      en: 'Saturn in the 1st House reflects karma of personal accountability and self-scrutiny.',
      hi: 'प्रथम भाव में शनि आत्म-जवाबदेही और अनुशासन सीखने की प्रेरणा देता है।',
      gu: 'પ્રથમ ભાવમાં શનિ આત્મ-જવાબદારીનો પાઠ શીખવે છે.'
    },
    pastLifeKarma: {
      en: 'Self-centeredness, dodging personal accountability, or imposing heavy burdens on others.',
      hi: 'स्वार्थी होना, व्यक्तिगत जवाबदेही से बचना, या दूसरों पर भारी बोझ डालना।',
      gu: 'સ્વાર્થી બનવું, પોતાની જવાબદારીઓથી ભાગવું અથવા અન્ય લોકો પર બોજ નાખવો.'
    },
    lifeChallenges: {
      en: 'Heavy domestic responsibilities from an early age; slow physical vitality; high personal scrutiny.',
      hi: 'कम उम्र से ही भारी घरेलू जिम्मेदारियां; धीमी शारीरिक ऊर्जा; अत्यधिक आत्म-परीक्षण।',
      gu: 'નાની ઉંમરથી જ ભારે પારિવારિક જવાબદારીઓ અને ધીમી શારીરિક ઉર્જા.'
    },
    physicalRemedy: {
      en: 'Avoid boisterous birthday celebrations with loud drums; apply wet mud tilak or paste from Banyan tree roots; keep a dark, quiet room at home.',
      hi: 'जन्मदिन पर तेज ढोल-नगाड़ों और धूम-धड़ाके से बचें; बरगद (वट) के पेड़ की जड़ की गीली मिट्टी या लेप का तिलक लगाएं; घर में एक शांत, अंधेरा कमरा रखें।',
      gu: 'જન્મદિવસે મોટા ઢોલ-નગારા અને કોલાહલથી બચવું; વડના વૃક્ષની જડની ભીની માટીનો તિલક કરવો; ઘરમાં એક શાંત ઓરડો રાખવો.'
    }
  },
  {
    id: 'lunar_saturn_h2',
    category: 'PLANET',
    planet: 'Shani (Saturn)',
    house: 2,
    system: 'VEDIC',
    title: {
      en: 'Saturn in 2nd House: Speech Karma & Lineage Wealth',
      hi: 'द्वितीय भाव में शनि: वाणी कर्म एवं कुल संपत्ति',
      gu: 'બીજા ભાવમાં શનિ: વાણી કર્મ અને કુળ સંપત્તિ'
    },
    description: {
      en: 'Saturn in the 2nd House impacts speech integrity and liquidity of family wealth.',
      hi: 'द्वितीय भाव में शनि वाणी की सत्यता और पारिवारिक संपत्ति के प्रबंधन पर बल देता है।',
      gu: 'બીજા ભાવમાં શનિ વાણીની સત્યતા અને કૌટુંબિક સંપત્તિના સંચાલન પર ભાર મૂકે છે.'
    },
    pastLifeKarma: {
      en: 'Harsh, wounding speech (Kali Zuban); hoarding or mismanaging lineage wealth.',
      hi: 'कड़वी या आहत करने वाली वाणी (काली जुबान); कुल संपत्ति का दुरुपयोग या संचय करना।',
      gu: 'કડવી કે દુઃખદાયી વાણી; કુળ સંપત્તિનો દુરુપયોગ કરવો.'
    },
    lifeChallenges: {
      en: 'Sudden swings in liquid capital; vocal harshness that creates bitter family rifts.',
      hi: 'नकद धन में अचानक उतार-चढ़ाव; वाणी की कठोरता जिससे पारिवारिक संबंधों में दरार आए।',
      gu: 'નાણાકીય સ્થિતિમાં અચાનક ઉતાર-ચઢાવ અને વાણીની કઠોરતાથી પરિવારમાં વિવાદ.'
    },
    physicalRemedy: {
      en: 'Maintain absolute integrity in speech; strictly avoid foul language or backbiting; manage ancestral assets conservatively; avoid alcohol.',
      hi: 'वाणी में पूर्ण सत्यता रखें; गाली-गलौज या चुगली से पूरी तरह बचें; पैतृक संपत्ति का विवेकपूर्ण प्रबंधन करें; मदिरापान से बचें।',
      gu: 'વાણીમાં સંપૂર્ણ સત્યતા રાખવી; ગાળો કે નિંદાથી બચવું; મધ્યપાનથી દૂર રહેવું.'
    }
  },
  {
    id: 'lunar_saturn_h3',
    category: 'PLANET',
    planet: 'Shani (Saturn)',
    house: 3,
    system: 'VEDIC',
    title: {
      en: 'Saturn in 3rd House: Laborer Karma & Physical Effort',
      hi: 'तृतीय भाव में शनि: परिश्रम एवं भ्राता कर्म',
      gu: 'ત્રીજા ભાવમાં શનિ: પરિશ્રમ અને ભાઈઓનો કર્મ'
    },
    description: {
      en: 'Saturn in the 3rd House requires genuine physical effort and respect for subordinates.',
      hi: 'तृतीय भाव में शनि वास्तविक शारीरिक श्रम और सहकर्मियों के सम्मान की मांग करता है।',
      gu: 'ત્રીજા ભાવમાં શનિ વાસ્તવિક શારીરિક મહેનત અને કામદારોના સન્માનની માંગ કરે છે.'
    },
    pastLifeKarma: {
      en: 'Exploiting laborers, neglecting siblings, or refusing to do physical, rigorous work.',
      hi: 'मजदूरों/श्रमिकों का शोषण करना, भाई-बहनों की उपेक्षा करना, या कठिन परिश्रम से भागना।',
      gu: 'કામદારોનું શોષણ કરવું, ભાઈ-બહેનોની ઉપેક્ષા કરવી અથવા પરિશ્રમથી ભાગવું.'
    },
    lifeChallenges: {
      en: 'High-friction communication; heavy administrative or technical labor; strained sibling relations.',
      hi: 'संचार में तनाव; अत्यधिक कठिन तकनीकी या प्रशासनिक परिश्रम; भाई-बहनों से संबंध खिंचे रहना।',
      gu: 'વાતચીતમાં મનમુટાવ; ભારે પરિશ્રમ અને ભાઈ-બહેનો સાથે સંબંધોમાં તણાવ.'
    },
    physicalRemedy: {
      en: 'Perform manual labor regularly; donate mechanical tools, footwear, or doormats to laborers; lubricate the body with oil baths.',
      hi: 'नियमित रूप से स्वयं शारीरिक श्रम करें; मजदूरों को यांत्रिक औजार, जूते-चप्पल या पायदान दान करें; शरीर पर तेल मालिश (स्नान) करें।',
      gu: 'નિયમિત શારીરિક શ્રમ કરવો; કામદારોને ઔજારો, પગરખાં કે ચટાઈ દાન કરવી; તેલ માલિશ કરવી.'
    }
  },
  {
    id: 'lunar_saturn_h4',
    category: 'PLANET',
    planet: 'Shani (Saturn)',
    house: 4,
    system: 'VEDIC',
    title: {
      en: 'Saturn in 4th House: Ancestral Roots & Domestic Karma',
      hi: 'चतुर्थ भाव में शनि: मातृ सुख एवं गृह स्थान',
      gu: 'ચોથા ભાવમાં શનિ: માતૃ સુખ અને ગૃહ સ્થાન'
    },
    description: {
      en: 'Saturn in the 4th House tests domestic peace, property roots, and care for maternal lineage.',
      hi: 'चतुर्थ भाव में शनि घर की शांति, पैतृक संपत्ति और माता की सेवा की परीक्षा लेता है।',
      gu: 'ચોથા ભાવમાં શનિ ઘરની શાંતિ, મિલકત અને માતાની સેવા પર ભાર મૂકે છે.'
    },
    pastLifeKarma: {
      en: 'Neglecting domestic roots, maternal comfort, or degrading the family home.',
      hi: 'अपने पैतृक घर, माता के आराम और पारिवारिक जड़ों की उपेक्षा करना।',
      gu: 'પોતાના ઘર, માતાના સુખ અને પારિવારિક મૂળિયાંઓની ઉપેક્ષા કરવી.'
    },
    lifeChallenges: {
      en: 'Lack of domestic warmth; feeling emotionally constrained inside one’s home; delayed property acquisition.',
      hi: 'घर में आत्मीयता की कमी; घर के अंदर भावनात्मक घुटन महसूस होना; वाहन/मकान प्राप्ति में देरी।',
      gu: 'ઘરમાં હૂંફનો અભાવ; ભાવનાત્મક ગૂંગળામણ અને મિલકત મેળવવામાં વિલંબ.'
    },
    physicalRemedy: {
      en: 'Refrain from hastily selling ancestral land; maintain a dark, undisturbed storage room in the house; serve elderly women and care for cows.',
      hi: 'पैतृक जमीन-जायदाद को जल्दबाजी में न बेचें; घर में एक अंधेरा, शांत स्टोर रूम रखें; वृद्ध महिलाओं और गौ माता की सेवा करें।',
      gu: 'પৈতૃક જમીન ઉતાવળમાં ન વેચવી; ઘરમાં શાંત સ્ટોર રૂમ રાખવો; વૃદ્ધ મહિલાઓ અને ગાયની સેવા કરવી.'
    }
  },
  {
    id: 'lunar_saturn_h5',
    category: 'PLANET',
    planet: 'Shani (Saturn)',
    house: 5,
    system: 'VEDIC',
    title: {
      en: 'Saturn in 5th House: Progeny Promise & Intellectual Discipline',
      hi: 'पंचम भाव में शनि: संतान कर्म एवं बुद्धि अनुशासन',
      gu: 'પાંચમા ભાવમાં શનિ: સંતાન કર્મ અને બુદ્ધિ શિસ્ત'
    },
    description: {
      en: 'Saturn in the 5th House requires fulfilling sacred promises to children and humble wisdom.',
      hi: 'पंचम भाव में शनि बच्चों के प्रति दिए वचन पूरा करने और ज्ञान में नम्रता रखने का संदेश देता है।',
      gu: 'પાંચમા ભાવમાં શનિ સંતાનો પ્રત્યેના વચનો પાળવા અને વિનમ્ર જ્ઞાન મેળવવાનો બોધ આપે છે.'
    },
    pastLifeKarma: {
      en: 'Breaking promises to children; artistic or intellectual arrogance; abusing past authority.',
      hi: 'बच्चों से किए वादे तोड़ना; कलात्मक या बौद्धिक अहंकार; पूर्व अधिकारों का दुरुपयोग।',
      gu: 'સંતાનોના વચનો ભંગ કરવા; બૌદ્ધિક અહંકાર અને ભૂતકાળના અધિકારનો દુરુપયોગ.'
    },
    lifeChallenges: {
      en: 'Delays or complications regarding progeny; restricted creative freedom; gaining recognition only during crises.',
      hi: 'संतान प्राप्ति में देरी या चिंता; रचनात्मक स्वतंत्रता में बाधा; केवल संकट काल में पहचान मिलना।',
      gu: 'સંતાન પ્રાપ્તિમાં વિલંબ; સર્જનાત્મક સ્વતંત્રતામાં રુકાવટ અને મુશ્કેલીઓ.'
    },
    physicalRemedy: {
      en: 'Do not distribute sweets on your children’s birthdays; donate green clothing or school supplies to underprivileged girls near schools; feed milk to snakes.',
      hi: 'अपने बच्चों के जन्मदिन पर मिठाइयां न बांटें; गरीब कन्याओं को हरे वस्त्र या पढ़ाई की सामग्री दान करें; सांपों को दूध पिलाएं/सेवा करें।',
      gu: 'પોતાના બાળકના જન્મદિવસે મીઠાઈ ન વહેંચવી; ગરીબ કન્યાઓને લીલા વસ્ત્રો કે ભણતરની વસ્તુઓ દાન કરવી.'
    }
  },
  {
    id: 'lunar_saturn_h6',
    category: 'PLANET',
    planet: 'Shani (Saturn)',
    house: 6,
    system: 'VEDIC',
    title: {
      en: 'Saturn in 6th House: Subordinate Service & Debt Resolution',
      hi: 'छठे भाव में शनि: सेवा कर्म एवं ऋण निवारण',
      gu: 'છઠ્ઠા ભાવમાં શનિ: સેવા કર્મ અને ઋણ નિવારણ'
    },
    description: {
      en: 'Saturn in the 6th House rewards selfless service to society and resolving ancient debts.',
      hi: 'छठे भाव में शनि समाज के सफाई कर्मचारियों की सेवा और पुराने ऋणों को चुकता करने से शुभ फल देता है।',
      gu: 'છઠ્ઠા ભાવમાં શનિ નિઃસ્વાર્થ સેવા અને જૂના ઋણ ચૂકવવાથી ઉત્તમ ફળ આપે છે.'
    },
    pastLifeKarma: {
      en: 'Neglecting or mistreating subordinates; accumulating unresolved debts (Rina).',
      hi: 'अधीनस्थ कर्मचारियों/सेवकों से दुर्व्यवहार करना; अनसुलझे कर्ज/ऋण छोड़ देना।',
      gu: 'કામદારો સાથે ખરાબ વર્તન કરવું અને ઋણ ચુકવણી ન કરવી.'
    },
    lifeChallenges: {
      en: 'Entanglement in prolonged workplace conflicts; taking on other people\'s burdens without thanks.',
      hi: 'कार्यस्थल पर लंबे समय तक विवादों में फंसना; बिना किसी आभार के दूसरों का बोझ उठाना।',
      gu: 'કામકાજના સ્થળે લાંબા વિવાદો અને વગર આભાર માન્યે અન્યનો ભાર ઉપાડવો.'
    },
    physicalRemedy: {
      en: 'Serve municipal sweepers and sanitation staff; drop whole almonds (sabut badam) in flowing water; engage in selfless social work (seva).',
      hi: 'सफाई कर्मचारियों और नगर निगम सेवकों की सेवा करें; बहते जल में साबुत बादाम बहाएं; निष्काम सामाजिक सेवा करें।',
      gu: 'સફાઈ કર્મચારીઓની સેવા કરવી; વહેતા પાણીમાં આખા બદામ પધરાવવા; નિઃસ્વાર્થ સમાજ સેવા કરવી.'
    }
  },
  {
    id: 'lunar_saturn_h7',
    category: 'PLANET',
    planet: 'Shani (Saturn)',
    house: 7,
    system: 'VEDIC',
    title: {
      en: 'Saturn in 7th House: Partnership Integrity & Marital Trust',
      hi: 'सप्तम भाव में शनि: दांपत्य एवं व्यापारिक सत्यता',
      gu: 'સાતમા ભાવમાં શનિ: દંપતી અને વ્યાપારી સત્યતા'
    },
    description: {
      en: 'Saturn in the 7th House establishes serious, practical business and marital contracts.',
      hi: 'सप्तम भाव में शनि व्यापारिक और वैवाहिक संबंधों में पूर्ण ईमानदारी की मांग करता है।',
      gu: 'સાતમા ભાવમાં શનિ વ્યાપારિક અને દંપતી સંબંધોમાં સંપૂર્ણ પ્રમાણિકતા ઈચ્છે છે.'
    },
    pastLifeKarma: {
      en: 'Betraying trust in contractual commitments or commercial and marital partnerships.',
      hi: 'व्यापारिक समझौतों, वादों या वैवाहिक संबंधों में विश्वासघात करना।',
      gu: 'ભાગીદારી કે વૈવાહિક સંબંધોમાં વિશ્વાસઘાત કરવો.'
    },
    lifeChallenges: {
      en: 'Delayed marriage; practical, non-romantic unions; heavy contractual or business liabilities.',
      hi: 'विवाह में देरी; केवल व्यावहारिक/गंभीर संबंध; व्यापारिक समझौतों में भारी जिम्मेदारी।',
      gu: 'લગ્નમાં વિલંબ; વ્યવહારિક સંબંધો અને ભારે કાનૂની જોખમ.'
    },
    physicalRemedy: {
      en: 'Gift a gold hair accessory to your spouse; bury a clay pot filled with honey in secluded ground; avoid dishonest commercial partnerships.',
      hi: 'अपने जीवनसाथी को सोने का हेयर क्लिप/गहना भेंट करें; एक मिट्टी के बर्तन (मटकी) में शहद भरकर सुनसान जगह में दबाएं; बेईमान साझेदारी से बचें।',
      gu: 'જીવનસાથીને સોનાની હેરપિન કે આભૂષણ ભેટ આપવું; માટીના વાસણમાં મધ ભરીને કોઈ વિજન જગ્યાએ દાટવું.'
    }
  },
  {
    id: 'lunar_saturn_h8',
    category: 'PLANET',
    planet: 'Shani (Saturn)',
    house: 8,
    system: 'VEDIC',
    title: {
      en: 'Saturn in 8th House: Ancestral Rites & Kantak Shani Alignment',
      hi: 'अष्टम भाव में शनि: पितृ ऋण एवं कंठक शनि शांति',
      gu: 'આઠમા ભાવમાં શનિ: પિતૃ ઋણ અને કંટક શનિ શાંતિ'
    },
    description: {
      en: 'Saturn in the 8th House transforms life through ancestral debt repayment and solitary discipline.',
      hi: 'अष्टम भाव में शनि पितृ ऋण चुकाने और गंभीर एकांत साधना से जीवन को बदलता है।',
      gu: 'આઠમા ભાવમાં શનિ પિતૃ ઋણ ચૂકવવાથી અને ગંભીર શિસ્તથી જીવન બદલે છે.'
    },
    pastLifeKarma: {
      en: 'Neglecting funeral rites; evasion of ancestral mortality debts (Pitra Rina).',
      hi: 'अंतिम संस्कार/श्राद्ध कर्म की उपेक्षा करना; पितृ ऋणों से भागना।',
      gu: 'અંતિમ સંસ્કાર અને શ્રાદ્ધ વિધિની ઉપેક્ષા કરવી.'
    },
    lifeChallenges: {
      en: 'Abrupt transformations; chronic ailments; intense structural friction (Kantak Shani).',
      hi: 'अचानक जीवन में बड़े बदलाव; पुरानी बीमारियां; कंठक शनि का भारी प्रभाव।',
      gu: 'અચાનક ફેરફારો; જૂના રોગો અને ભારે આંતરિક સંઘર્ષ.'
    },
    physicalRemedy: {
      en: 'Donate construction trolleys, concrete, or wood to cremation grounds; donate an iron cot to crematorium workers; bathe while seated on a stone stool.',
      hi: 'श्मशान घाट में निर्माण सामग्री (लकड़ी, सीमेंट, ठेला) दान करें; श्मशान सेवकों को लोहे की खाट/चारपाई दान करें; पत्थर की चौकी पर बैठकर स्नान करें।',
      gu: 'સ્મશાનમાં લાકડા કે બાંધકામ સામગ્રી દાન કરવી; સ્મશાનના કર્મચારીને લોખંડનો ખાટલો દાન કરવો; પથ્થરની ચોકી પર બેસીને સ્નાન કરવું.'
    }
  },
  {
    id: 'lunar_saturn_h9',
    category: 'PLANET',
    planet: 'Shani (Saturn)',
    house: 9,
    system: 'VEDIC',
    title: {
      en: 'Saturn in 9th House: Guru Devotion & Arduous Pilgrimages',
      hi: 'नवम भाव में शनि: गुरु भक्ति एवं पैदल यात्रा',
      gu: 'નવમા ભાવમાં શનિ: ગુરુ ભક્તિ અને પદયાત્રા'
    },
    description: {
      en: 'Saturn in the 9th House demands humility before tradition, spiritual teachers, and traditional ethics.',
      hi: 'नवम भाव में शनि गुरुजनों, शास्त्रों और परंपराओं के प्रति नतमस्तक होने का संदेश देता है।',
      gu: 'નવમા ભાવમાં શનિ ગુરુજનો અને શાસ્ત્રો પ્રત્યે વિનમ્ર બનવાનું શીખવે છે.'
    },
    pastLifeKarma: {
      en: 'Disrespecting spiritual gurus, ancestral traditions, or ethical codes.',
      hi: 'धर्म गुरुओं, ऋषि परंपराओं या नैतिक नियमों का अनादर करना।',
      gu: 'ધર્મગુરુઓ અને પરંપરાઓનો અનાદર કરવો.'
    },
    lifeChallenges: {
      en: 'Rigid dogma; clashes with academic or institutional leaders; delayed spiritual fruition.',
      hi: 'अत्यधिक कट्टरता; गुरुओं या संस्थागत प्रमुखों से वैचारिक मतभेद; आध्यात्मिक फल मिलने में देरी।',
      gu: 'કટ્ટરતા, ગુરુજનો સાથે મતભેદ અને આત્મ-જ્ઞાનમાં વિલંબ.'
    },
    physicalRemedy: {
      en: 'Donate yellow clothing and iron fittings to traditional schools or spiritual organizations; undertake arduous pilgrimages on foot.',
      hi: 'गुरुकुल या धार्मिक संस्थानों में पीले वस्त्र और लोहे की सामग्री दान करें; धार्मिक स्थलों की पैदल यात्रा (पदयात्रा) करें।',
      gu: 'ધાર્મિક સંસ્થાઓમાં પીળા વસ્ત્રો અને લોખંડનું દાન કરવું; ધાર્મિક સ્થળોની પદયાત્રા કરવી.'
    }
  },
  {
    id: 'lunar_saturn_h10',
    category: 'PLANET',
    planet: 'Shani (Saturn)',
    house: 10,
    system: 'VEDIC',
    title: {
      en: 'Saturn in 10th House: Executive Duty & Serving Visually Impaired',
      hi: 'दशम भाव में शनि: निष्काम कर्मयोग एवं नेत्रहीन सेवा',
      gu: 'દશમા ભાવમાં શનિ: નિષ્કામ કર્મયોગ અને અંધ સેવા'
    },
    description: {
      en: 'Saturn in the 10th House rewards dedicated work without public arrogance or abuse of authority.',
      hi: 'दशम भाव में शनि बिना अंहकार के समाज का नेतृत्व और नेत्रहीन व्यक्तियों की सेवा से भाग्य चमकाता है।',
      gu: 'દશમા ભાવમાં શનિ અહંકાર વગર સમાજનું નેતૃત્વ કરવાથી મહાન સફળતા આપે છે.'
    },
    pastLifeKarma: {
      en: 'Abusing executive power, exploiting subordinates, or professional arrogance.',
      hi: 'उच्च पद का दुरुपयोग करना, कर्मचारियों का शोषण करना, या कार्यस्थल पर अहंकार।',
      gu: 'હોદ્દાનો દુરુપયોગ કરવો અને હાથ નીચેના માણસોનું શોષણ.'
    },
    lifeChallenges: {
      en: 'Career delays; immense performance pressure; continuous public scrutiny.',
      hi: 'करियर की शुरुआत में देरी; कार्यस्थल पर अत्यधिक दबाव; लगातार कड़ा सार्वजनिक परीक्षण।',
      gu: 'કારકિર્દીમાં વિલંબ; ભારે કામનું દબાણ અને સતત જાહેર પરીક્ષણ.'
    },
    physicalRemedy: {
      en: 'Feed 10 visually impaired individuals on Saturdays; keep head covered when exposed to harsh elements; fund electrical repairs in public shelters.',
      hi: 'शनिवार को 10 नेत्रहीन व्यक्तियों को भोजन कराएं; धूप/कठिन मौसम में सिर ढककर रखें; सार्वजनिक रैन बसेरों में बिजली की मरम्मत का खर्च उठाएं।',
      gu: 'શનિવારે ૧૦ અંધ વ્યક્તિઓને ભોજન કરાવવું; કડક તડકામાં માથું ઢાંકીને રાખવું; જાહેર સ્થળોએ લાઈટ-લાઈનનું દાન કરવું.'
    }
  },
  {
    id: 'lunar_saturn_h11',
    category: 'PLANET',
    planet: 'Shani (Saturn)',
    house: 11,
    system: 'VEDIC',
    title: {
      en: 'Saturn in 11th House: Community Upkeep & Open Soil Remedy',
      hi: 'एकादश भाव में शनि: समाज कल्याण एवं कच्ची भूमि उपाय',
      gu: '૧૧મા ભાવમાં શનિ: સમાજ કલ્યાણ અને કાચી જમીન ઉપાય'
    },
    description: {
      en: 'Saturn in the 11th House insists on returning profits back to the community and avoiding south-facing houses.',
      hi: '11वें भाव में शनि अपने लाभ का कुछ हिस्सा समाज कल्याण और मंदिर की मरम्मत में लगाने का निर्देश देता है।',
      gu: '૧૧મા ભાવમાં શનિ કમાણીનો અમુક હિસ્સો સમાજ કલ્યાણમાં વાપરવાનો આદેશ આપે છે.'
    },
    pastLifeKarma: {
      en: 'Exploiting collective community networks; taking benefits without giving back.',
      hi: 'सामूहिक संगठनों या मित्रों का फायदा उठाना; बिना कुछ दिए केवल लाभ लेना।',
      gu: 'સમાજ કે મિત્રોનો દુરુપયોગ કરવો અને કશું પાછું ન આપવું.'
    },
    lifeChallenges: {
      en: 'Cynicism toward friendships; delayed accrual of substantial profits; social alienation.',
      hi: 'मित्रों के प्रति उदासीनता; धन लाभ में अत्यधिक देरी; समाज से कटाव महसूस होना।',
      gu: 'મિત્રતામાં કડવાશ, નફામાં વિલંબ અને સમાજથી એકલતા.'
    },
    physicalRemedy: {
      en: 'Help fund electrical maintenance and structural upkeep in local temples; pour 43 drops of mustard oil into open soil on Saturdays; avoid south-facing houses.',
      hi: 'स्थानीय मंदिरों में बिजली और बुनियादी मरम्मत में आर्थिक सहयोग दें; शनिवार को कच्ची जमीन में सरसों के तेल की 43 बूंदें टपकाएं; दक्षिणमुखी मकान में रहने से बचें।',
      gu: 'મંદિરોમાં લાઈટ અને સમારકામનું દાન કરવું; શનિવારે કાચી જમીન પર સરસવના તેલના ૪૩ ટીપાં પાડવા; દક્ષિણમુખી ઘરમાં રહેવાનું ટાળવું.'
    }
  },
  {
    id: 'lunar_saturn_h12',
    category: 'PLANET',
    planet: 'Shani (Saturn)',
    house: 12,
    system: 'VEDIC',
    title: {
      en: 'Saturn in 12th House: Quiet Charity & Feeding Aquatic Life',
      hi: 'द्वादश भाव में शनि: गुप्त दान एवं जलचर सेवा',
      gu: '૧૨મા ભાવમાં શનિ: ગુપ્ત દાન અને જળચર સેવા'
    },
    description: {
      en: 'Saturn in the 12th House turns solitude into spiritual liberation through anonymous charity.',
      hi: '12वें भाव में शनि गुप्त दान, आश्रमों में सेवा और मछलियों को आटा खिलाने से मोक्ष का मार्ग प्रशस्त करता है।',
      gu: '૧૨મા ભાવમાં શનિ ગુપ્ત દાન અને માછલીઓને લોટની ગોળીઓ ખવડાવવાથી મોક્ષ આપે છે.'
    },
    pastLifeKarma: {
      en: 'Spiritual hypocrisy; withholding charity during acute crises ("Too little, too late").',
      hi: 'आध्यात्मिक पाखंड; संकट के समय दान रोकने की प्रवृत्ति।',
      gu: 'આધ્યાત્મિક ઢોંગ અને મુશ્કેલીના સમયે દાન અટકાવવું.'
    },
    lifeChallenges: {
      en: 'Career ambiguity; subconscious fatigue; sudden expenditures; isolation.',
      hi: 'करियर में अनिश्चितता; मानसिक थकान; अचानक बड़े खर्चे; एकाकीपन।',
      gu: 'કારકિર્દીમાં અસ્પષ્ટતા, આંતરિક થાક અને અચાનક ખર્ચ.'
    },
    physicalRemedy: {
      en: 'Build iron boundary gates or priest quarters (kutirs) in ashrams/temples; feed aquatic creatures (atta balls); provide fuel donations quietly.',
      hi: 'आश्रमों/मंदिरों में लोहे के मुख्य द्वार या कुटीर का निर्माण कराएं; मछलियों/जलचरों को आटे की गोलियां खिलाएं; चुपचाप ईंधन या गैस दान करें।',
      gu: 'આશ્રમ કે મંદિરમાં લોખંડના દરવાજા કે કુટીર બનાવવી; માછલીઓને લોટની ગોળીઓ ખવડાવવી; ગુપ્ત ઈંધણ દાન કરવું.'
    }
  },

  // --- SOUL PURPOSE ON EARTH (SUN PLACEMENT & ATMAKARAKA) ---
  {
    id: 'vedic_sun_h1',
    category: 'SOUL_PURPOSE',
    planet: 'Surya (Sun)',
    house: 1,
    system: 'VEDIC',
    title: {
      en: 'Soul Purpose: Sovereign Self-Expression & Leadership',
      hi: 'आत्मा का उद्देश्य: स्वतंत्र नेतृत्व और आत्म-सम्मान',
      gu: 'આત્માનો હેતુ: આત્મ-વિશ્વાસ અને સ્વાભિમાન'
    },
    description: {
      en: 'Sun in the 1st House indicates your soul incarnated on Earth to master individuality, self-confidence, and dignified leadership. Your inner flame drives you to forge your own path without relying on validation.',
      hi: 'प्रथम भाव में सूर्य दर्शाता है कि आपकी आत्मा इस धरती पर आत्म-सम्मान, स्वावलंबन और नेतृत्व की कला सीखने आई है। आपका आंतरिक प्रकाश आपको अपना मार्ग स्वयं बनाने की प्रेरणा देता है।',
      gu: 'પ્રથમ ભાવમાં સૂર્ય દર્શાવે છે કે તમારી આત્મા આ પૃથ્વી પર નેતૃત્વ અને આત્મ-વિશ્વાસ શીખવા આવી છે.'
    }
  },
  {
    id: 'vedic_sun_h4',
    category: 'SOUL_PURPOSE',
    planet: 'Surya (Sun)',
    house: 4,
    system: 'VEDIC',
    title: {
      en: 'Soul Purpose: Emotional Sanctuary & Ancestral Wisdom',
      hi: 'आत्मा का उद्देश्य: मानसिक शांति और मातृ-सेवा',
      gu: 'આત્માનો હેતુ: માનસિક શાંતિ અને ઘરની સેવા'
    },
    description: {
      en: 'Sun in the 4th House reveals your soul seeks inner peace, emotional strength, and anchoring your family lineage. Your true purpose is establishing an unshakeable inner sanctuary.',
      hi: 'चतुर्थ भाव में सूर्य दर्शाता है कि आपकी आत्मा का मुख्य उद्देश्य आंतरिक शांति, माता की सेवा और परिवार को शक्ति प्रदान करना है।',
      gu: 'ચોથા ભાવમાં સૂર્ય આંતરિક શાંતિ અને કૌટુંબિક સુરક્ષાનો આત્મા હેતુ દર્શાવે છે.'
    }
  },
  {
    id: 'vedic_sun_h5',
    category: 'SOUL_PURPOSE',
    planet: 'Surya (Sun)',
    house: 5,
    system: 'VEDIC',
    title: {
      en: 'Soul Purpose: Creative Genius & Divine Knowledge',
      hi: 'आत्मा का उद्देश्य: बुद्धि, रचनात्मकता और ज्ञान',
      gu: 'આત્માનો હેતુ: બુદ્ધિ, જ્ઞાન અને સર્જનાત્મકતા'
    },
    description: {
      en: 'Sun in the 5th House signifies a soul born with Purva Punya (past life merit) to shine through creative expression, mantric wisdom, education, and guiding the next generation.',
      hi: 'पंचम भाव में सूर्य पूर्व पुण्य और उच्च ज्ञान का प्रतीक है। आपकी आत्मा का उद्देश्य विद्या, रचनात्मकता और परामर्श द्वारा दूसरों का मार्गदर्शन करना है।',
      gu: 'પાંચમા ભાવમાં સૂર્ય પૂર્વ પુણ્ય અને ઉચ્ચ જ્ઞાનનો સૂર્ય આત્મ-હેતુ દર્શાવે છે.'
    }
  },
  {
    id: 'vedic_sun_h7',
    category: 'SOUL_PURPOSE',
    planet: 'Surya (Sun)',
    house: 7,
    system: 'VEDIC',
    title: {
      en: 'Soul Purpose: Mastering Partnerships & Social Mirroring',
      hi: 'आत्मा का उद्देश्य: संबंधों में संतुलन और जन-सेवा',
      gu: 'આત્માનો હેતુ: સંબંધોમાં સંતુલન અને જાહેર જીવન'
    },
    description: {
      en: 'Sun in the 7th House means your soul learns its deepest lessons through the mirror of marriage, business partnerships, and public dealings. Balancing ego with empathy is your core evolution.',
      hi: 'सप्तम भाव में सूर्य का अर्थ है कि आपकी आत्मा साझेदारी, विवाह और जन-संपर्क के माध्यम से आत्म-ज्ञान प्राप्त करती है।',
      gu: 'સાતમા ભાવમાં સૂર્ય વિવાહ અને ભાગીદારી દ્વારા આત્મ-જ્ઞાન મેળવવાનો હેતુ દર્શાવે છે.'
    }
  },
  {
    id: 'vedic_sun_h10',
    category: 'SOUL_PURPOSE',
    planet: 'Surya (Sun)',
    house: 10,
    system: 'BPHS',
    title: {
      en: 'Soul Purpose: Dig Bala Authority & Public Service',
      hi: 'आत्मा का उद्देश्य: कर्मयोग, अधिकार और समाज-सेवा',
      gu: 'આત્માનો હેતુ: કર્માધિકાર અને સમાજ સેવા'
    },
    description: {
      en: 'Sun obtains Dig Bala (directional strength) in the 10th House. Your soul came to Earth to achieve career mastery, erect lasting institutions, and uplift society through righteous authority.',
      hi: 'दशम भाव में सूर्य दिग्बली होता है। आपकी आत्मा का उद्देश्य उच्च कर्मयोग, समाज में प्रतिष्ठा प्राप्त करना और संगठन का नेतृत्व करना है।',
      gu: 'દશમા ભાવમાં સૂર્ય ઉત્તમ કર્મયોગ અને સમાજમાં પ્રતિષ્ઠા પ્રાપ્ત કરવાનો હેતુ દર્શાવે છે.'
    }
  },

  // --- HEALTH & WELLBEING ---
  {
    id: 'vedic_health_sun_h6',
    category: 'HEALTH',
    planet: 'Surya (Sun)',
    house: 6,
    system: 'VEDIC',
    title: {
      en: 'High Immunity & Victory over Diseases (Shatru Hanta)',
      hi: 'रोग प्रतिरोधक क्षमता और शत्रुओं पर विजय',
      gu: 'રોગ પ્રતિકારક શક્તિ અને શત્રુ વિજય'
    },
    description: {
      en: 'Sun in the 6th House acts as Shatru Hanta (destroyer of foes and illnesses). Gives robust immunity, strong digestion (Jatharagni), and ability to overcome health obstacles through discipline.',
      hi: 'छठे भाव में सूर्य शत्रुओं और रोगों का नाश करता है। यह उत्तम पाचन शक्ति, रोग प्रतिरोधक क्षमता और अनुशासित दिनचर्या प्रदान करता है।',
      gu: 'છઠ્ઠા ભાવમાં સૂર્ય રોગો અને શત્રુઓનો નાશ કરે છે અને ઉત્તમ આરોગ્ય આપે છે.'
    }
  },
  {
    id: 'vedic_health_mars_h1',
    category: 'HEALTH',
    planet: 'Mangala (Mars)',
    house: 1,
    system: 'VEDIC',
    title: {
      en: 'High Vitality & Physical Stamina',
      hi: 'उच्च ऊर्जा, शारीरिक बल और साहस',
      gu: 'ઉચ્ચ શારીરિક ઉર્જા અને સાહસ'
    },
    description: {
      en: 'Mars in the 1st House bestows immense physical stamina, athletic drive, and quick recovery. Watch out for head injuries, heat imbalance, or rash impatience.',
      hi: 'प्रथम भाव में मंगल अपार शारीरिक ऊर्जा और साहस देता है। सिर की चोट या अत्यधिक क्रोध/गर्मी से बचना चाहिए।',
      gu: 'પ્રથમ ભાવમાં મંગળ અતિશય સાહસ અને શારીરિક શક્તિ આપે છે.'
    }
  },

  // --- CAREER & WEALTH ---
  {
    id: 'vedic_career_ju_h11',
    category: 'CAREER',
    planet: 'Brihaspati (Jupiter)',
    house: 11,
    system: 'VEDIC',
    title: {
      en: 'Dhana Yoga: Abundant Wealth & Continuous Income',
      hi: 'धन योग: निरंतर आय और प्रचुर लाभ',
      gu: 'ધન યોગ: અવિરત આવક અને મહાન લાભ'
    },
    description: {
      en: 'Jupiter in the 11th House is one of the highest wealth indicators in Vedic astrology. Ensures steady financial gains, influential mentors, and fulfilment of all major life desires.',
      hi: 'ग्यारहवें भाव में गुरु महा धन योग बनाता है। यह निरंतर आय, उच्च मित्रों का सहयोग और मनोकामनाओं की पूर्ति कराता है।',
      gu: '૧૧મા ભાવમાં ગુરુ અવિરત આવક અને તમામ ઈચ્છાઓ પૂર્ણ કરવાનો ધન યોગ બનાવે છે.'
    }
  },

  // --- RELATIONSHIPS & FAMILY ---
  {
    id: 'vedic_rel_ve_h7',
    category: 'RELATIONSHIPS',
    planet: 'Shukra (Venus)',
    house: 7,
    system: 'VEDIC',
    title: {
      en: 'Harmonious Marriage & Attractive Partner',
      hi: 'सुखद विवाह और कलात्मक जीवनसाथी',
      gu: 'સુખી લગ્નજીવન અને સુંદર જીવનસાથી'
    },
    description: {
      en: 'Venus in its own Karaka house (7th) grants a loving, cultured, and charming spouse. Enhances diplomatic skills, romantic harmony, and prosperous partnerships.',
      hi: 'सातवें भाव में शुक्र प्रेमपूर्ण, संस्कारी और आकर्षक जीवनसाथी प्रदान करता है। दांपत्य जीवन में मधुरता बनी रहती है।',
      gu: 'સાતમા ભાવમાં શુક્ર પ્રેમપૂર્વક અને સુંદર જીવનસાથી અને સુખી દંપતી જીવન આપે છે.'
    }
  }
];

export interface EvaluatedVedicReport {
  soulPurpose: AstrologyRule[];
  health: AstrologyRule[];
  career: AstrologyRule[];
  relationships: AstrologyRule[];
  planetRulesMap: Record<string, AstrologyRule[]>;
  houseRulesMap: Record<number, AstrologyRule[]>;
}

/**
 * Add a new custom Vedic rule provided by user
 */
export function addVedicRule(rule: AstrologyRule): void {
  VEDIC_RULES_REGISTRY.push(rule);
}

/**
 * Evaluates all applicable Vedic rules for a given Kundali Result
 */
export function evaluateVedicRules(kundali: KundaliResult): EvaluatedVedicReport {
  const soulPurpose: AstrologyRule[] = [];
  const health: AstrologyRule[] = [];
  const career: AstrologyRule[] = [];
  const relationships: AstrologyRule[] = [];
  const planetRulesMap: Record<string, AstrologyRule[]> = {
    'Surya (Sun)': [],
    'Chandra (Moon)': [],
    'Mangala (Mars)': [],
    'Budha (Mercury)': [],
    'Brihaspati (Jupiter)': [],
    'Shukra (Venus)': [],
    'Shani (Saturn)': [],
    'Rahu': [],
    'Ketu': []
  };
  const houseRulesMap: Record<number, AstrologyRule[]> = {};

  for (let h = 1; h <= 12; h++) {
    houseRulesMap[h] = [];
  }

  // Iterate over planets in birth chart
  kundali.planets.forEach((p: PlanetDetail) => {
    const matchingRules = VEDIC_RULES_REGISTRY.filter(r => {
      let planetMatch = !r.planet || r.planet.toLowerCase().includes(p.name.split(' ')[0].toLowerCase());
      let houseMatch = !r.house || r.house === p.house;
      let signMatch = r.sign === undefined || r.sign === p.rashiIndex;
      return planetMatch && houseMatch && signMatch;
    });

    matchingRules.forEach(rule => {
      if (rule.category === 'SOUL_PURPOSE') soulPurpose.push(rule);
      else if (rule.category === 'HEALTH') health.push(rule);
      else if (rule.category === 'CAREER') career.push(rule);
      else if (rule.category === 'RELATIONSHIPS') relationships.push(rule);

      if (p.name && planetRulesMap[p.name]) {
        planetRulesMap[p.name].push(rule);
      }
      if (p.house && houseRulesMap[p.house]) {
        houseRulesMap[p.house].push(rule);
      }
    });
  });

  // Default fallback for Sun Soul Purpose if specific house rule isn't in registry yet
  const sunPlanet = kundali.planets.find(p => p.name.includes('Surya') || p.name.includes('Sun'));
  if (sunPlanet && soulPurpose.length === 0) {
    soulPurpose.push({
      id: `sun_fallback_${sunPlanet.house}`,
      category: 'SOUL_PURPOSE',
      planet: 'Surya (Sun)',
      house: sunPlanet.house,
      system: 'VEDIC',
      title: {
        en: `Soul Purpose: Solar Evolution in House ${sunPlanet.house}`,
        hi: `आत्मा का उद्देश्य: ${sunPlanet.house}वें भाव में सूर्य प्रकाश`,
        gu: `આત્માનો હેતુ: ${sunPlanet.house}મા સ્થાનમાં સૂર્ય પ્રકાશ`
      },
      description: {
        en: `Sun placed in House ${sunPlanet.house} (${sunPlanet.rashiName}) indicates your soul came to focus its core vitality, ambition, and identity on the matters of House ${sunPlanet.house}.`,
        hi: `सूर्य का ${sunPlanet.house}वें भाव में होना दर्शाता है कि आपकी आत्मा इस जन्म में ${sunPlanet.house}वें भाव के कार्यों द्वारा आत्म-साक्षात्कार प्राप्त करने आई है।`,
        gu: `સૂર્યનું ${sunPlanet.house}મા સ્થાનમાં હોવું દર્શાવે છે કે આત્માનું આ જન્મે મુખ્ય કાર્ય આ ભાવનું છે.`
      }
    });
  }

  return {
    soulPurpose,
    health,
    career,
    relationships,
    planetRulesMap,
    houseRulesMap
  };
}
