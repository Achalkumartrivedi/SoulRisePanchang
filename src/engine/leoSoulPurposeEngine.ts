import { KundaliResult } from './kundaliEngine';
import { buildFullMultiLang } from '../i18n/astrologyRuleTranslations';

export interface LeoSoulPurposeEvaluation {
  generalDossier: {
    title: Record<string, string>;
    subtitle: Record<string, string>;
    whatIsSun: Record<string, string>;
    significanceOfLeo: Record<string, string>;
    corePrinciple: Record<string, string>;
  };
  leoHouseDetail: {
    houseNumber: number;
    lagnaName: string;
    title: Record<string, string>;
    atmaIccha: Record<string, string>;
    karmicDrive: Record<string, string>;
  };
  sunHouseDetail: {
    houseNumber: number;
    rashiName: string;
    title: Record<string, string>;
    actionMechanism: Record<string, string>;
  };
  synthesisSummary: Record<string, string>;
}

// 12 House Leo Delineations Data
const LEO_HOUSE_DATA: Record<number, {
  lagnaName: string;
  title: Record<string, string>;
  atmaIccha: Record<string, string>;
  karmicDrive: Record<string, string>;
}> = {
  1: {
    lagnaName: 'Simha (Leo)',
    title: buildFullMultiLang(
      'Leo in 1st House: Supreme Personal Autonomy & Sovereign Presence',
      'प्रथम भाव में सिंह: परम व्यक्तिगत स्वायत्तता और संप्रभु उपस्थिति',
      'પ્રથમ ભાવમાં સિંહ: પરમ વ્યક્તિગત સ્વાયત્તતા અને સાર્વભૌમ વર્ચસ્વ'
    ),
    atmaIccha: buildFullMultiLang(
      'Core Soul Desire (Atma Iccha): Supreme personal autonomy, self-governance, direct visible leadership, and absolute physical dignity.',
      'आत्मा की मूल इच्छा (आत्मा इच्छा): परम व्यक्तिगत स्वायत्तता, स्व-शासन, प्रत्यक्ष दृश्य नेतृत्व और पूर्ण शारीरिक प्रतिष्ठा।',
      'આત્માની મૂળ ઇચ્છા (આત્મા ઇચ્છા): પરમ વ્યક્તિગત સ્વાયત્તતા, સ્વ-શાસન, પ્રત્યક્ષ દૃશ્ય નેતૃત્વ અને પૂર્ણ શારીરિક પ્રતિષ્ઠા.'
    ),
    karmicDrive: buildFullMultiLang(
      'Karmic & Psychological Drive: You cannot thrive in subservient, micromanaged, or secondary roles without suffering vitality loss. Your soul demands to be the visible figurehead. Self-respect is anchored directly to your physical presence and sovereign identity.',
      'कर्मिक और मानसिक प्रेरणा: आप अपनी जीवन शक्ति खोए बिना किसी के अधीन या सूक्ष्म-प्रबंधित भूमिकाओं में नहीं रह सकते। आपकी आत्मा प्रत्यक्ष रूप से मुख्य चेहरा बनने की मांग करती है।',
      'કર્મિક અને માનસિક પ્રેરણા: તમે તમારી જીવનશક્તિ ગુમાવ્યા વિના કોઈના તાબેદાર કે ગૌણ સ્થાન પર રહી શકતા નથી. તમારી આત્મા મુખ્ય ચહેરો બનવાની માંગ કરે છે.'
    )
  },
  2: {
    lagnaName: 'Karka (Cancer)',
    title: buildFullMultiLang(
      'Leo in 2nd House: Sovereignty over Lineage Wealth & Authoritative Speech',
      'द्वितीय भाव में सिंह: वंश धन और आधिकारिक वाणी पर संप्रभुता',
      'દ્વિતીય ભાવમાં સિંહ: વંશ ધન અને સત્તાવાર વાણી પર સાર્વભૌમત્વ'
    ),
    atmaIccha: buildFullMultiLang(
      'Core Soul Desire (Atma Iccha): Command over lineage assets, family values, accumulated wealth, and holding authoritative Vaak (speech).',
      'आत्मा की मूल इच्छा: वंश की संपत्ति, पारिवारिक मूल्यों, संचित धन और आधिकारिक वाणी (वाक्) पर अधिकार।',
      'આત્માની મૂળ ઇચ્છા: વંશની સંપત્તિ, કૌટુંબિક મૂલ્યો, એકત્રિત ધન અને સત્તાવાર વાણી પર અધિકાર.'
    ),
    karmicDrive: buildFullMultiLang(
      'Karmic & Psychological Drive: Your soul seeks to be the undisputed financial protector and patriarch/matriarch of the family lineage. Your words carry royal weight; family members must respect your fiscal stewardship.',
      'कर्मिक और मानसिक प्रेरणा: आपकी आत्मा परिवार के धन का निर्विवाद संरक्षक बनने की मांग करती है। आपके शब्दों में शाही वजन है; परिवार को आपके वित्तीय फैसलों का सम्मान करना होगा।',
      'કર્મિક અને માનસિક પ્રેરણા: તમારી આત્મા પરિવારના નાણાકીય સંરક્ષક બનવાની માંગ કરે છે. તમારા શબ્દો શાહી વજન ધરાવે છે.'
    )
  },
  3: {
    lagnaName: 'Mithuna (Gemini)',
    title: buildFullMultiLang(
      'Leo in 3rd House: Self-Made Enterprise, Creative Skill & Independent Courage',
      'तृतीय भाव में सिंह: स्व-निर्मित उद्यम, रचनात्मक कौशल और स्वतंत्र पराक्रम',
      'તૃતીય ભાવમાં સિંહ: સ્વ-નિર્મિત સાહસ, સર્જનાત્મક કૌશલ્ય અને સ્વતંત્ર પરાક્રમ'
    ),
    atmaIccha: buildFullMultiLang(
      'Core Soul Desire (Atma Iccha): Self-made status (Purushartha), sovereignty in communication, media, writing, and independent enterprise.',
      'आत्मा की मूल इच्छा: स्व-निर्मित स्थिति (पुरुषार्थ), संचार, मीडिया, लेखन और स्वतंत्र उद्यम में संप्रभुता।',
      'આત્માની મૂળ ઇચ્છા: સ્વ-નિર્મિત સ્થિતિ (પુરુષાર્થ), સંચાર, મીડિયા, લેખન અને સ્વતંત્ર સાહસમાં સાર્વભૌમત્વ.'
    ),
    karmicDrive: buildFullMultiLang(
      'Karmic & Psychological Drive: You refuse to be told how to express your skills or write your narrative. You seek total independence in courage and initiatives, earning royal respect through self-crafted talent.',
      'कर्मिक और मानसिक प्रेरणा: आप अपने कौशल या विचारों को व्यक्त करने के लिए किसी का निर्देश बर्दाश्त नहीं करते। आप अपने पराक्रम से शाही सम्मान अर्जित करते हैं।',
      'કર્મિક અને માનસિક પ્રેરણા: તમે તમારા કૌશલ્ય કે વિચારો રજૂ કરવા માટે કોઈના આદેશો સહન કરતા નથી. તમારા પરાક્રમથી શાહી સન્માન મેળવો છો.'
    )
  },
  4: {
    lagnaName: 'Vrishabha (Taurus)',
    title: buildFullMultiLang(
      'Leo in 4th House: Sovereign Domain over Home, Real Estate & Domestic Rule',
      'चतुर्थ भाव में सिंह: गृह, अचल संपत्ति और घरेलू साम्राज्य पर संप्रभुता',
      'ચતુર્થ ભાવમાં સિંહ: ઘર, સ્થાવર મિલકત અને ઘરગથ્થુ સામ્રાજ્ય પર સાર્વભૌમત્વ'
    ),
    atmaIccha: buildFullMultiLang(
      'Core Soul Desire (Atma Iccha): Undisputed rule over the home environment, real estate, vehicles, maternal lineage, and emotional peace.',
      'आत्मा की मूल इच्छा: घरेलू माहौल, अचल संपत्ति, वाहनों और माता के कुल पर निर्विवाद शासन।',
      'આત્માની મૂળ ઇચ્છા: ઘરના વાતાવરણ, મિલકતો, વાહનો અને માતાના કુળ પર નિર્વિવાદ શાસન.'
    ),
    karmicDrive: buildFullMultiLang(
      'Karmic & Psychological Drive: You must be the undisputed ruler inside your domestic fortress. Emotional security depends on holding authority over land, home decor, and family domestic decisions.',
      'कर्मिक और मानसिक प्रेरणा: आपको अपने घर के अंदर निर्विवाद शासक होना चाहिए। आपकी भावनात्मक सुरक्षा जमीन और पारिवारिक फैसलों पर अधिकार रखने पर निर्भर करती है।',
      'કર્મિક અને માનસિક પ્રેરણા: તમારા ઘરની અંદર તમારું શાસન હોવું જરૂરી છે. તમારી ભાવનાત્મક સુરક્ષા ઘરના નિર્ણયો પરના અધિકાર પર નિર્ભર છે.'
    )
  },
  5: {
    lagnaName: 'Mesha (Aries)',
    title: buildFullMultiLang(
      'Leo in 5th House: Supreme Advisory Statecraft, Intellect & Royal Progeny',
      'पंचम भाव में सिंह: परम परामर्शदात्री बुद्धि, रचनात्मक प्रतिभा और शाही संतान',
      'પંચમ ભાવમાં સિંહ: પરમ સલાહકાર બુદ્ધિ, સર્જનાત્મક પ્રતિભા અને શાહી સંતાન'
    ),
    atmaIccha: buildFullMultiLang(
      'Core Soul Desire (Atma Iccha): Recognition for master intellect, advisory statecraft, speculative genius, and royal progeny (Purva Punya).',
      'आत्मा की मूल इच्छा: मास्टर बुद्धि, सलाह देने की कला, रचनात्मक प्रतिभा और शाही संतान का सम्मान।',
      'આત્માની મૂળ ઇચ્છા: માસ્ટર બુદ્ધિ, સલાહ આપવાની કળા, સર્જનાત્મક પ્રતિભા અને શાહી સંતાનનું સન્માન.'
    ),
    karmicDrive: buildFullMultiLang(
      'Karmic & Psychological Drive: Your soul seeks recognition as a high counselor and intellectual authority. You demand absolute respect from children, students, and proteges.',
      'कर्मिक और मानसिक प्रेरणा: आपकी आत्मा एक उच्च सलाहकार और बौद्धिक अधिकारी के रूप में मान्यता चाहती है। आप बच्चों और शिष्यों से पूर्ण सम्मान की मांग करते हैं।',
      'કર્મિક અને માનસિક પ્રેરણા: તમારી આત્મા ઉચ્ચ સલાહકાર અને બૌદ્ધિક સત્તા તરીકે માન્યતા ઇચ્છે છે. બાળકો અને શિષ્યો પાસેથી સન્માન મેળવવું જરૂરી છે.'
    )
  },
  6: {
    lagnaName: 'Meena (Pisces)',
    title: buildFullMultiLang(
      'Leo in 6th House: Unconquerable Mastery over Crises, Enemies & Legal Battlefields',
      'षष्ठ भाव में सिंह: संकटों, शत्रुओं और कानूनी युद्धक्षेत्रों पर अजेय प्रभुत्व',
      'ષષ્ઠ ભાવમાં સિંહ: સંકટો, શત્રુઓ અને કાનૂની યુદ્ધક્ષેત્રો પર અજેય પ્રભુત્વ'
    ),
    atmaIccha: buildFullMultiLang(
      'Core Soul Desire (Atma Iccha): Dominance over opponents, litigation supremacy, health system operations, and crisis management command.',
      'आत्मा की मूल इच्छा: विरोधियों पर प्रभुत्व, मुकदमों में जीत, स्वास्थ्य और संकट प्रबंधन में नेतृत्व।',
      'આત્માની મૂળ ઇચ્છા: વિરોધીઓ પર પ્રભુત્વ, કોર્ટ-કચેરીમાં વિજય, આરોગ્ય અને સંકટ વ્યવસ્થાપનમાં નેતૃત્વ.'
    ),
    karmicDrive: buildFullMultiLang(
      'Karmic & Psychological Drive: You thrive in high-stress resolution, legal, or medical battlefields where others break. Your soul feels regal when imposing order upon chaos and debts.',
      'कर्मिक और मानसिक प्रेरणा: आप उच्च तनाव, कानूनी या चिकित्सीय संकटों को सुलझाने में फलते-फूलते हैं। अराजकता पर नियंत्रण पाकर आपकी आत्मा को गौरव महसूस होता है।',
      'કર્મિક અને માનસિક પ્રેરણા: તમે ભારે તણાવ, કાનૂની કે તબીબી સંકટો ઉકેલવામાં નિપુણ છો. અરાજકતા પર વિજય મેળવીને આત્મા ગૌરવ અનુભવે છે.'
    )
  },
  7: {
    lagnaName: 'Kumbha (Aquarius)',
    title: buildFullMultiLang(
      'Leo in 7th House: Public Prestige, High-Status Partnerships & Diplomatic Treaties',
      'सप्तम भाव में सिंह: सार्वजनिक प्रतिष्ठा, उच्च-स्तरीय साझेदारी और कूटनीतिक संधियाँ',
      'સપ્તમ ભાવમાં સિંહ: સાર્વજનિક પ્રતિષ્ઠા, ઉચ્ચ સ્તરીય ભાગીદારી અને રાજદ્વારી સંધિઓ'
    ),
    atmaIccha: buildFullMultiLang(
      'Core Soul Desire (Atma Iccha): High public standing, diplomatic treaties, prestige in trade, and partnering with regal or powerful figures.',
      'आत्मा की मूल इच्छा: उच्च सार्वजनिक प्रतिष्ठा, कूटनीतिक संधियाँ और प्रभावशाली व्यक्तियों के साथ साझेदारी।',
      'આત્માની મૂળ ઇચ્છા: ઉચ્ચ સાર્વજનિક પ્રતિષ્ઠા, રાજદ્વારી કરારો અને પ્રભાવશાળી લોકો સાથે ભાગીદારી.'
    ),
    karmicDrive: buildFullMultiLang(
      'Karmic & Psychological Drive: You require your spouse and business partners to honor your sovereignty. You refuse contracts that diminish your dignity in the public eye.',
      'कर्मिक और मानसिक प्रेरणा: आप चाहते हैं कि आपका जीवनसाथी और व्यावसायिक भागीदार आपकी प्रतिष्ठा का सम्मान करें। आप ऐसा कोई समझौता नहीं करते जो सम्मान घटाए।',
      'કર્મિક અને માનસિક પ્રેરણા: તમારા જીવનસાથી અને ભાગીદારો તમારું સન્માન કરે તે જરૂરી છે. પ્રતિષ્ઠા ઘટાડે તેવા કરાર તમે સ્વીકારતા નથી.'
    )
  },
  8: {
    lagnaName: 'Makara (Capricorn)',
    title: buildFullMultiLang(
      'Leo in 8th House: Confidential Wealth, Forensic Data & Backstage Sovereignty',
      'अष्टम भाव में सिंह: गोपनीय धन, फोरेंसिक अनुसंधान और गुप्त साम्राज्य',
      'અષ્ટમ ભાવમાં સિંહ: ગોપનીય ધન, ફોરેન્સિક સંશોધન અને ગુપ્ત સામ્રાજ્ય'
    ),
    atmaIccha: buildFullMultiLang(
      'Core Soul Desire (Atma Iccha): Secret backstage command, unrecorded assets, deep transformational research, and crisis control.',
      'आत्मा की मूल इच्छा: पर्दे के पीछे का गुप्त कमान, गोपनीय संपत्ति, गहन खोज और संकट प्रबंधन।',
      'આત્માની મૂળ ઇચ્છા: પડદા પાછળનું ગુપ્ત નેતૃત્વ, ગોપનીય મિલકત, ઊંડું સંશોધન અને સંકટ નિયંત્રણ.'
    ),
    karmicDrive: buildFullMultiLang(
      'Karmic & Psychological Drive: You seek quiet, absolute power behind closed doors. You govern occult wisdom, taxation, forensics, and corporate audits with hidden authority.',
      'कर्मिक और मानसिक प्रेरणा: आप बंद दरवाजों के पीछे शांत लेकिन पूर्ण अधिकार चाहते हैं। आप गूढ़ ज्ञान, कराधान और ऑडिट पर गुप्त नियंत्रण रखते हैं।',
      'કર્મિક અને માનસિક પ્રેરણા: તમે બંધ દરવાજા પાછળ શાંત પરંતુ સંપૂર્ણ સત્તા ઇચ્છો છો. ગુપ્ત જ્ઞાન અને ઓડિટ પર તમારું નિયંત્રણ રહે છે.'
    )
  },
  9: {
    lagnaName: 'Dhanu (Sagittarius)',
    title: buildFullMultiLang(
      'Leo in 9th House: Dharmic Authority, Philosophical Governance & Guru Lineage',
      'नवम भाव में सिंह: धार्मिक अधिकार, दार्शनिक शासन और गुरु परंपरा की संप्रभुता',
      'નવમ ભાવમાં સિંહ: ધાર્મિક અધિકાર, દાર્શનિક શાસન અને ગુરુ પરંપરાની સાર્વભૌમત્વ'
    ),
    atmaIccha: buildFullMultiLang(
      'Core Soul Desire (Atma Iccha): Sovereign seat of spiritual authority, higher philosophical guidance, university leadership, and dharmic governance.',
      'आत्मा की मूल इच्छा: आध्यात्मिक अधिकार का सिंहासन, उच्च दार्शनिक मार्गदर्शन और धार्मिक शासन।',
      'આત્માની મૂળ ઇચ્છા: આધ્યાત્મિક અધિકારનું સિંહાસન, ઉચ્ચ દાર્શનિક માર્ગદર્શન અને ધાર્મિક શાસન.'
    ),
    karmicDrive: buildFullMultiLang(
      'Karmic & Psychological Drive: Your soul demands sovereignty in belief systems and wisdom. You reject flawed dogma or institutions that fail to respect spiritual truth.',
      'कर्मिक और मानसिक प्रेरणा: आपकी आत्मा विचारों और ज्ञान प्रणालियों में संप्रभुता की मांग करती है। आप झूठे आडंबरों और असम्मानजनक नियमों को खारिज करते हैं।',
      'કર્મિક અને માનસિક પ્રેરણા: તમારી આત્મા વિચારો અને ધાર્મિક પ્રણાલીઓમાં સ્વતંત્રતા ઇચ્છે છે. તમે ખોટા આડંબર અને નિયમોને નકારો છો.'
    )
  },
  10: {
    lagnaName: 'Vrischika (Scorpio)',
    title: buildFullMultiLang(
      'Leo in 10th House: Apex Societal Throne, Executive Governance & Public Command',
      'दशम भाव में सिंह: सर्वोच्च सामाजिक सिंहासन, कार्यकारी शासन और सार्वजनिक कमान',
      'દશમ ભાવમાં સિંહ: સર્વોચ્ચ સામાજિક સિંહાસન, કારોબારી શાસન અને જાહેર કમાન'
    ),
    atmaIccha: buildFullMultiLang(
      'Core Soul Desire (Atma Iccha): Apex career throne, high executive office, government alignment, and public recognition.',
      'आत्मा की मूल इच्छा: करियर का सर्वोच्च सिंहासन, उच्च कार्यकारी पद, सरकारी अधिकार और सार्वजनिक सम्मान।',
      'આત્માની મૂળ ઇચ્છા: કારકિર્દીનું સર્વોચ્ચ સિંહાસન, ઉચ્ચ કારોબારી પદ, સરકારી અધિકાર અને જાહેર સન્માન.'
    ),
    karmicDrive: buildFullMultiLang(
      'Karmic & Psychological Drive: Ultimate career ambition. Your soul craves being the top figure in your industry or state, building an enduring corporate or civic legacy.',
      'कर्मिक और मानसिक प्रेरणा: सर्वोच्च करियर महत्वाकांक्षा। आपकी आत्मा उद्योग या समाज में शीर्ष स्थान पर रहने और एक स्थायी विरासत बनाने की लालसा रखती है।',
      'કર્મિક અને માનસિક પ્રેરણા: સર્વોચ્ચ કારકિર્દી મહત્વાકાંક્ષા. તમારી આત્મા તમારા ક્ષેત્રમાં મોખરે રહેવા અને મોટી વિરાસત બનાવવાની ઈચ્છા રાખે છે.'
    )
  },
  11: {
    lagnaName: 'Tula (Libra)',
    title: buildFullMultiLang(
      'Leo in 11th House: Mass Network Sovereignty & Financial Gains (Badhaka Alert)',
      'एकादश भाव में सिंह: बड़े नेटवर्क पर प्रभुत्व और वित्तीय लाभ (बाधक सचेत)',
      'એકાદશ ભાવમાં સિંહ: મોટા નેટવર્ક પર પ્રભુત્વ અને નાણાકીય લાભ (બાધક ચેતવણી)'
    ),
    atmaIccha: buildFullMultiLang(
      'Core Soul Desire (Atma Iccha): Sovereign leadership across mass networks, large organizations, gains, and influential alliances.',
      'आत्मा की मूल इच्छा: बड़े नेटवर्क, विशाल संगठनों, वित्तीय लाभ और प्रभावशाली गठबंधनों पर नेतृत्व।',
      'આત્માની મૂળ ઇચ્છા: મોટા નેટવર્ક, વિશાળ સંસ્થાઓ, નાણાકીય લાભ અને પ્રભાવશાળી જોડાણો પર નેતૃત્વ.'
    ),
    karmicDrive: buildFullMultiLang(
      'Karmic & Psychological Drive: You seek to lead collective movements. Note: Leo is Badhaka house for Libra Lagna; ego clashes within networks can sabotage your long-term profits.',
      'कर्मिक और मानसिक प्रेरणा: आप बड़े समूहों का नेतृत्व करना चाहते हैं। ध्यान दें: तुला लग्न के लिए सिंह बाधक भाव है; अहंकार की लड़ाई आपके लाभ को नुकसान पहुंचा सकती है।',
      'કર્મિક અને માનસિક પ્રેરણા: તમે વિશાળ જૂથોનું નેતૃત્વ કરવા માંગો છો. ધ્યાન આપો: અહંકારનો ઘર્ષણ તમારા લાંબા ગાળાના લાભને નુકસાન પહોંચાડી શકે છે.'
    )
  },
  12: {
    lagnaName: 'Kanya (Virgo)',
    title: buildFullMultiLang(
      'Leo in 12th House: Sovereignty in Foreign Lands, Isolation & Inner Transcendence',
      'द्वादश भाव में सिंह: विदेश, एकांत अनुसंधान और आंतरिक मोक्ष में संप्रभुता',
      'દ્વાદશ ભાવમાં સિંહ: વિદેશ, એકાંત સંશોધન અને આંતરિક મોક્ષમાં સાર્વભૌમત્વ'
    ),
    atmaIccha: buildFullMultiLang(
      'Core Soul Desire (Atma Iccha): Royalty in foreign realms, spiritual retreat governance, isolated research sanctuaries, and Moksha.',
      'आत्मा की मूल इच्छा: विदेशी भूमि में सम्मान, आध्यात्मिक आश्रमों का संचालन, एकांत अनुसंधान और मोक्ष।',
      'આત્માની મૂળ ઇચ્છા: વિદેશી ભૂમિમાં સન્માન, આધ્યાત્મિક આશ્રમોનું સંચાલન, એકાંત સંશોધન અને મોક્ષ.'
    ),
    karmicDrive: buildFullMultiLang(
      'Karmic & Psychological Drive: True royal authority is found away from your birthplace, in quiet spiritual sanctuaries, international operations, or self-mastery.',
      'कर्मिक और मानसिक प्रेरणा: आपका सच्चा शाही अधिकार जन्मस्थान से दूर, शांत आध्यात्मिक स्थानों, अंतर्राष्ट्रीय कार्यों या आत्म-नियंत्रण में मिलता है।',
      'કર્મિક અને માનસિક પ્રેરણા: તમારો સાચો શાહી અધિકાર જન્મસ્થળથી દૂર, શાંત આધ્યાત્મિક સ્થળો કે આંતરરાષ્ટ્રીય ક્ષેત્રોમાં મળે છે.'
    )
  }
};

// 12 Sun House Action Mechanisms
const SUN_HOUSE_DATA: Record<number, {
  title: Record<string, string>;
  actionMechanism: Record<string, string>;
}> = {
  1: {
    title: buildFullMultiLang(
      'Sun in 1st House: Action through Direct Sovereign Persona',
      'प्रथम भाव में सूर्य: प्रत्यक्ष संप्रभु व्यक्तित्व के माध्यम से कर्म',
      'પ્રથમ ભાવમાં સૂર્ય: પ્રત્યક્ષ સાર્વભૌમ વ્યક્તિત્વ દ્વારા કર્મ'
    ),
    actionMechanism: buildFullMultiLang(
      'Action Mechanism: You fulfill your soul purpose by physically taking charge, being visible, and stepping forward as the primary leader in all endeavors.',
      'कर्म तंत्र: आप स्वयं आगे बढ़कर, प्रत्यक्ष रूप से जिम्मेदारी लेकर और सभी प्रयासों में मुख्य नेता बनकर अपने आत्मा के उद्देश्य को पूरा करते हैं।',
      'કર્મ તંત્ર: તમે પોતે આગળ આવીને, પ્રત્યક્ષ જવાબદારી લઈને અને દરેક કાર્યમાં મુખ્ય નેતા બનીને આત્માના ઉદ્દેશ્યને પૂર્ણ કરો છો.'
    )
  },
  2: {
    title: buildFullMultiLang(
      'Sun in 2nd House: Action through Financial Stewardship & Authoritative Speech',
      'द्वितीय भाव में सूर्य: वित्तीय प्रबंधन और आधिकारिक वाणी के माध्यम से कर्म',
      'દ્વિતીય ભાવમાં સૂર્ય: નાણાકીય સંચાલન અને સત્તાવાર વાણી દ્વારા કર્મ'
    ),
    actionMechanism: buildFullMultiLang(
      'Action Mechanism: You fulfill your soul purpose by stewarding lineage wealth, guiding family assets, and communicating with unyielding authority.',
      'कर्म तंत्र: आप पारिवारिक संपत्ति का प्रबंधन करके, वित्तीय दिशा देकर और पूर्ण अधिकार के साथ संवाद करके अपना उद्देश्य सिद्ध करते हैं।',
      'કર્મ તંત્ર: તમે કૌટુંબિક સંપત્તિનું સંચાલન કરીને, નાણાકીય માર્ગદર્શન આપીને અને અધિકારપૂર્વક વાતચીત કરીને તમારો ઉદ્દેશ્ય પૂર્ણ કરો છો.'
    )
  },
  3: {
    title: buildFullMultiLang(
      'Sun in 3rd House: Action through Self-Made Enterprise & Media Initiatives',
      'तृतीय भाव में सूर्य: स्व-निर्मित उद्यम और मीडिया पहलों के माध्यम से कर्म',
      'તૃતીય ભાવમાં સૂર્ય: સ્વ-નિર્મિત સાહસ અને મીડિયા પહેલો દ્વારા કર્મ'
    ),
    actionMechanism: buildFullMultiLang(
      'Action Mechanism: You fulfill your soul purpose through relentless personal effort, writing, skills, marketing, and self-directed courage.',
      'कर्म तंत्र: आप अपने निरंतर व्यक्तिगत प्रयासों, लेखन, कौशल, विपणन और स्वतंत्र साहस के माध्यम से अपना उद्देश्य पूरा करते हैं।',
      'કર્મ તંત્ર: તમે તમારા સતત વ્યક્તિગત પ્રયાસો, લેખન, કૌશલ્ય અને સ્વતંત્ર પરાક્રમ દ્વારા તમારો ઉદ્દેશ્ય પૂર્ણ કરો છો.'
    )
  },
  4: {
    title: buildFullMultiLang(
      'Sun in 4th House: Action through Real Estate, Domestic Anchoring & Lineage Support',
      'चतुर्थ भाव में सूर्य: अचल संपत्ति, घरेलू स्थिरता और वंश समर्थन के माध्यम से कर्म',
      'ચતુર્થ ભાવમાં સૂર્ય: સ્થાવર મિલકત, ઘરગથ્થુ સ્થિરતા અને વંશ આધાર દ્વારા કર્મ'
    ),
    actionMechanism: buildFullMultiLang(
      'Action Mechanism: You fulfill your soul purpose by establishing strong domestic roots, managing property/vehicles, and supporting mother and family stability.',
      'कर्म तंत्र: आप मजबूत घरेलू जड़ें स्थापित करके, संपत्ति का प्रबंधन करके और माता व परिवार की स्थिरता का समर्थन करके कार्य करते हैं।',
      'કર્મ તંત્ર: તમે મજબૂત ઘરગથ્થુ પાયો સ્થાપીને, મિલકતનું સંચાલન કરીને અને માતા તેમજ પરિવારને આધાર આપીને કાર્ય કરો છો.'
    )
  },
  5: {
    title: buildFullMultiLang(
      'Sun in 5th House: Action through Genius Intellect, Advisory Counsel & Mentorship',
      'पंचम भाव में सूर्य: प्रखर बुद्धि, सलाहकारी ज्ञान और परामर्श के माध्यम से कर्म',
      'પંચમ ભાવમાં સૂર્ય: પ્રખર બુદ્ધિ, સલાહકાર જ્ઞાન અને માર્ગદર્શન દ્વારા કર્મ'
    ),
    actionMechanism: buildFullMultiLang(
      'Action Mechanism: You fulfill your soul purpose through strategic intellectual counsel, creative endeavors, speculative acumen, and guiding future generations.',
      'कर्म तंत्र: आप रणनीतिक बौद्धिक सलाह, रचनात्मक पहलों और नई पीढ़ी का मार्गदर्शन करके अपना उद्देश्य सिद्ध करते हैं।',
      'કર્મ તંત્ર: તમે વ્યૂહાત્મક બૌદ્ધિક સલાહ, સર્જનાત્મક કાર્યો અને નવી પેઢીનું માર્ગદર્શન કરીને તમારો ઉદ્દેશ્ય સિદ્ધ કરો છો.'
    )
  },
  6: {
    title: buildFullMultiLang(
      'Sun in 6th House: Action through Problem-Solving, Legal Mastery & Health Leadership',
      'षष्ठ भाव में सूर्य: समस्या-समाधान, कानूनी दक्षता और स्वास्थ्य नेतृत्व के माध्यम से कर्म',
      'ષષ્ઠ ભાવમાં સૂર્ય: સમસ્યા-નિવારણ, કાનૂની કુશળતા અને આરોગ્ય નેતૃત્વ દ્વારા કર્મ'
    ),
    actionMechanism: buildFullMultiLang(
      'Action Mechanism: You fulfill your soul purpose by solving complex operational disputes, overcoming rivals, legal service, and healthcare or administrative execution.',
      'कर्म तंत्र: आप जटिल विवादों को सुलझाकर, विरोधियों पर विजय प्राप्त करके और प्रशासनिक या चिकित्सा सेवा निष्पादन के माध्यम से कार्य करते हैं।',
      'કર્મ તંત્ર: તમે જટિલ વિવાદો ઉકેલીને, વિરોધીઓ પર વિજય મેળવીને અને વહીવટી કે તબીબી સેવા દ્વારા કાર્ય કરો છો.'
    )
  },
  7: {
    title: buildFullMultiLang(
      'Sun in 7th House: Action through Diplomatic Alliances & Public Contracts',
      'सप्तम भाव में सूर्य: कूटनीतिक गठबंधनों और सार्वजनिक अनुबंधों के माध्यम से कर्म',
      'સપ્તમ ભાવમાં સૂર્ય: રાજદ્વારી જોડાણો અને જાહેર કરારો દ્વારા કર્મ'
    ),
    actionMechanism: buildFullMultiLang(
      'Action Mechanism: You fulfill your soul purpose by negotiating high-stakes partnerships, public representation, and forging alliances with respected figures.',
      'कर्म तंत्र: आप महत्वपूर्ण साझेदारियों की बातचीत करके, सार्वजनिक प्रतिनिधित्व करके और सम्मानित व्यक्तियों के साथ गठजोड़ करके कार्य करते हैं।',
      'કર્મ તંત્ર: તમે મહત્વપૂર્ણ ભાગીદારીઓની વાતચીત કરીને, જાહેર પ્રતિનિધિત્વ કરીને અને પ્રતિષ્ઠિત લોકો સાથે જોડાણ કરીને કાર્ય કરો છો.'
    )
  },
  8: {
    title: buildFullMultiLang(
      'Sun in 8th House: Action through Confidential Audits, Research & Transformation',
      'अष्टम भाव में सूर्य: गोपनीय ऑडिट, गहन अनुसंधान और परिवर्तन के माध्यम से कर्म',
      'અષ્ટમ ભાવમાં સૂર્ય: ગોપનીય ઓડિટ, ઊંડું સંશોધન અને પરિવર્તન દ્વારા કર્મ'
    ),
    actionMechanism: buildFullMultiLang(
      'Action Mechanism: You fulfill your soul purpose through hidden forensic research, managing unrecorded wealth/taxes, and navigating severe crises with courage.',
      'कर्म तंत्र: आप गुप्त फोरेंसिक शोध करके, गोपनीय धन का प्रबंधन करके और गंभीर संकटों का साहसपूर्वक मुकाबला करके कार्य करते हैं।',
      'કર્મ તંત્ર: તમે ગોપનીય સંશોધન કરીને, ગુપ્ત સંપત્તિનું સંચાલન કરીને અને ગંભીર સંકટોનો હિંમતપૂર્વક સામનો કરીને કાર્ય કરો છો.'
    )
  },
  9: {
    title: buildFullMultiLang(
      'Sun in 9th House: Action through Spiritual Teaching, Higher Law & Moral Wisdom',
      'नवम भाव में सूर्य: आध्यात्मिक शिक्षण, उच्च कानून और नैतिक ज्ञान के माध्यम से कर्म',
      'નવમ ભાવમાં સૂર્ય: આધ્યાત્મિક શિક્ષણ, ઉચ્ચ કાયદો અને નૈતિક જ્ઞાન દ્વારા કર્મ'
    ),
    actionMechanism: buildFullMultiLang(
      'Action Mechanism: You fulfill your soul purpose by teaching higher principles, publishing moral truths, upholding justice, and guiding institutions.',
      'कर्म तंत्र: आप उच्च सिद्धांतों को सिखाकर, नैतिक सत्य का प्रकाशन करके, न्याय का पालन करके और संस्थानों का मार्गदर्शन करके कार्य करते हैं।',
      'કર્મ તંત્ર: તમે ઉચ્ચ સિદ્ધાંતો શીખવીને, નૈતિક સત્ય રજૂ કરીને, ન્યાય જાળવીને અને સંસ્થાઓનું માર્ગદર્શન કરીને કાર્ય કરો છો.'
    )
  },
  10: {
    title: buildFullMultiLang(
      'Sun in 10th House: Action through Executive Governance & State Authority',
      'दशम भाव में सूर्य: कार्यकारी शासन और राज्य सत्ता के माध्यम से कर्म',
      'દશમ ભાવમાં સૂર્ય: કારોબારી શાસન અને સરકારી સત્તા દ્વારા કર્મ'
    ),
    actionMechanism: buildFullMultiLang(
      'Action Mechanism: You fulfill your soul purpose by holding prominent corporate/government roles, establishing authority in career, and earning civic accolades.',
      'कर्म तंत्र: आप कॉर्पोरेट या सरकारी क्षेत्र में प्रमुख भूमिकाएं निभाकर, करियर में अधिकार स्थापित करके और सम्मान अर्जित करके कार्य करते हैं।',
      'કર્મ તંત્ર: તમે કોર્પોરેટ કે સરકારી ક્ષેત્રમાં મુખ્ય ભૂમિકા ભજવીને, કારકિર્દીમાં અધિકાર સ્થાપીને અને સન્માન મેળવીને કાર્ય કરો છો.'
    )
  },
  11: {
    title: buildFullMultiLang(
      'Sun in 11th House: Action through Network Mobilization & Collective Vision',
      'एकादश भाव में सूर्य: नेटवर्क लामबंदी और सामूहिक दृष्टि के माध्यम से कर्म',
      'એકાદશ ભાવમાં સૂર્ય: નેટવર્ક એકત્રીકરણ અને સામૂહિક વિઝન દ્વારા કર્મ'
    ),
    actionMechanism: buildFullMultiLang(
      'Action Mechanism: You fulfill your soul purpose by leading large groups, driving visionary campaigns, generating massive revenues, and organizing movements.',
      'कर्म तंत्र: आप बड़े समूहों का नेतृत्व करके, दूरदर्शी अभियानों को चलाकर, बड़ा राजस्व उत्पन्न करके और आंदोलनों को व्यवस्थित करके कार्य करते हैं।',
      'કર્મ તંત્ર: તમે મોટા જૂથોનું નેતૃત્વ કરીને, દૂરદર્શી અભિયાનો ચલાવીને, મોટો નાણાકીય લાભ મેળવીને અને ચળવળોનું સંચાલન કરીને કાર્ય કરો છો.'
    )
  },
  12: {
    title: buildFullMultiLang(
      'Sun in 12th House: Action through Foreign Realisation, Philanthropy & Inner Mastery',
      'द्वादश भाव में सूर्य: विदेशी उपलब्धि, परोपकार और आन्तरिक मोक्ष के माध्यम से कर्म',
      'દ્વાદશ ભાવમાં સૂર્ય: વિદેશી સિદ્ધિ, પરોપકાર અને આંતરિક મોક્ષ દ્વારા કર્મ'
    ),
    actionMechanism: buildFullMultiLang(
      'Action Mechanism: You fulfill your soul purpose in overseas environments, behind closed doors, through spiritual retreat, self-sacrifice, and quiet inner mastery.',
      'कर्म तंत्र: आप विदेशी परिवेश में, एकांत में, आध्यात्मिक ध्यान, आत्म-त्याग और शांत आंतरिक महारत के माध्यम से अपना उद्देश्य पूरा करते हैं।',
      'કર્મ તંત્ર: તમે વિદેશી વાતાવરણમાં, એકાંતમાં, આધ્યાત્મિક ધ્યાન અને શાંત આંતરિક પ્રભુત્વ દ્વારા તમારો ઉદ્દેશ્ય પૂર્ણ કરો છો.'
    )
  }
};

/**
 * Evaluates the complete Leo-House & Sun-Placement Soul Purpose alignment
 * according to the classical Lunar Astro Framework.
 */
export function evaluateLeoSunSoulPurpose(kundali: KundaliResult): LeoSoulPurposeEvaluation {
  // 1. Determine Leo House (Simha)
  // Default to House 1 if not explicitly matched
  let leoHouse = 1;

  // Check houseDetails in Kundali
  if (kundali.houseDetails && kundali.houseDetails.length > 0) {
    const foundHouse = kundali.houseDetails.find(
      h => h.rashiName.toLowerCase().includes('leo') || h.rashiName.toLowerCase().includes('simha')
    );
    if (foundHouse) {
      leoHouse = foundHouse.houseNumber;
    }
  } else if (kundali.lagnaRashi) {
    // Deduce from Lagna if houseDetails absent
    const lagnaLower = kundali.lagnaRashi.toLowerCase();
    if (lagnaLower.includes('mesha') || lagnaLower.includes('aries')) leoHouse = 5;
    else if (lagnaLower.includes('vrishabha') || lagnaLower.includes('taurus')) leoHouse = 4;
    else if (lagnaLower.includes('mithuna') || lagnaLower.includes('gemini')) leoHouse = 3;
    else if (lagnaLower.includes('karka') || lagnaLower.includes('cancer')) leoHouse = 2;
    else if (lagnaLower.includes('simha') || lagnaLower.includes('leo')) leoHouse = 1;
    else if (lagnaLower.includes('kanya') || lagnaLower.includes('virgo')) leoHouse = 12;
    else if (lagnaLower.includes('tula') || lagnaLower.includes('libra')) leoHouse = 11;
    else if (lagnaLower.includes('vrischika') || lagnaLower.includes('scorpio')) leoHouse = 10;
    else if (lagnaLower.includes('dhanu') || lagnaLower.includes('sagittarius')) leoHouse = 9;
    else if (lagnaLower.includes('makara') || lagnaLower.includes('capricorn')) leoHouse = 8;
    else if (lagnaLower.includes('kumbha') || lagnaLower.includes('aquarius')) leoHouse = 7;
    else if (lagnaLower.includes('meena') || lagnaLower.includes('pisces')) leoHouse = 6;
  }

  // 2. Determine Sun's Placement
  let sunHouse = 1;
  let sunRashi = 'Leo';
  if (kundali.planets && kundali.planets.length > 0) {
    const sunPlanet = kundali.planets.find(
      p => p.name.toLowerCase().includes('sun') || p.name.toLowerCase().includes('surya')
    );
    if (sunPlanet) {
      sunHouse = sunPlanet.house || 1;
      sunRashi = sunPlanet.rashiName || 'Leo';
    }
  }

  const leoData = LEO_HOUSE_DATA[leoHouse] || LEO_HOUSE_DATA[1];
  const sunData = SUN_HOUSE_DATA[sunHouse] || SUN_HOUSE_DATA[1];

  // Synthesis Summary
  const synthesisSummary = buildFullMultiLang(
    `🌟 SOUL PURPOSE ALIGNMENT (Lunar Astro Matrix):\n` +
    `• WHAT your soul craves: Leo sits in House ${leoHouse} (${leoData.lagnaName} Ascendant), demanding sovereignty and undivided respect in House ${leoHouse} affairs.\n` +
    `• HOW & WHERE to achieve it: Your Sun is positioned in House ${sunHouse} (${sunRashi}), which serves as the action engine. By taking disciplined, sovereign action in House ${sunHouse}, you unlock the ultimate honor promised by Leo in House ${leoHouse}.`,

    `🌟 आत्मा के उद्देश्य का समन्वय (लूनर एस्ट्रो मैट्रिक्स):\n` +
    `• आत्मा क्या चाहती है: सिंह आपकी कुंडली के भाव ${leoHouse} (${leoData.lagnaName} लग्न) में स्थित है, जो भाव ${leoHouse} के मामलों में संप्रभुता और पूर्ण सम्मान की मांग करता है।\n` +
    `• इसे कैसे और कहाँ प्राप्त करें: आपका सूर्य भाव ${sunHouse} (${sunRashi}) में विराजमान है, जो कर्म इंजन के रूप में कार्य करता है। भाव ${sunHouse} में अनुशासित और संप्रभु कार्य करके, आप भाव ${leoHouse} में सिंह द्वारा वादा किए गए सर्वोच्च सम्मान को प्राप्त करते हैं।`,

    `🌟 આત્માના ઉદ્દેશ્યનું સંકલન (લૂનર એસ્ટ્રો મેટ્રિક્સ):\n` +
    `• આત્મા શું ઇચ્છે છે: સિંહ તમારી કુંડળીના ભાવ ${leoHouse} માં સ્થિત છે, જે ભાવ ${leoHouse} ના બાબતોમાં સાર્વભૌમત્વ અને પૂર્ણ સન્માનની માંગ કરે છે.\n` +
    `• તેને કેવી રીતે અને ક્યાં પ્રાપ્ત કરવું: તમારો સૂર્ય ભાવ ${sunHouse} માં બિરાજમાન છે, જે કર્મ એન્જિન તરીકે કાર્ય કરે છે. ભાવ ${sunHouse} માં શાસકીય કાર્ય કરીને, તમે ભાવ ${leoHouse} માં સિંહ દ્વારા આપેલા વચનને પૂર્ણ કરો છો.`
  );

  return {
    generalDossier: {
      title: buildFullMultiLang(
        '☀️ The Soul’s Flame: Surya (Sun) & Leo (Simha) Cosmic Paradigm',
        '☀️ आत्मा की अग्नि: सूर्य और सिंह राशि का ब्रह्मांडीय सिद्धांत',
        '☀️ આત્માની અગ્નિ: સૂર્ય અને સિંહ રાશિનો બ્રહ્માંડીય સિદ્ધાંત'
      ),
      subtitle: buildFullMultiLang(
        'Naisargika Atmakaraka - Sovereign Significator of Soul, Maan-Samman & Royal Purpose',
        'नैसर्गिक आत्मकारक - आत्मा, मान-सम्मान और शाही उद्देश्य का दिव्य प्रतीक',
        'નૈસર્ગિક આત્મકારક - આત્મા, માન-સન્માન અને શાહી ઉદ્દેશ્યનું દિવ્ય પ્રતીક'
      ),
      whatIsSun: buildFullMultiLang(
        'In Vedic Astrology & the Lunar Astro Framework, Surya (Sun) is the Naisargika Atmakaraka—the natural significator of the soul. Sun represents vitality (Prana), sovereign willpower, father, self-respect, inner divine flame, and undisputed honor (Maan-Samman).',
        'वैदिक ज्योतिष और लूनर एस्ट्रो फ्रेमवर्क में, सूर्य नैसर्गिक आत्मकारक है—आत्मा का प्राकृतिक प्रतीक। सूर्य जीवन शक्ति (प्राण), संप्रभु इच्छाशक्ति, पिता, आत्म-सम्मान, आंतरिक दिव्य ज्योति और निर्विवाद मान-सम्मान का प्रतिनिधित्व करता है।',
        'વૈદિક જ્યોતિષ અને લૂનર એસ્ટ્રો ફ્રેમવર્કમાં, સૂર્ય નૈસર્ગિક આત્મકારક છે - આત્માનું કુદરતી પ્રતીક. સૂર્ય જીવનશક્તિ (પ્રાણ), આત્મ-સન્માન અને માન-સન્માનનું પ્રતિનિધિત્વ કરે છે.'
      ),
      significanceOfLeo: buildFullMultiLang(
        'Leo (Simha) is the sole domicile of the Sun and the natural 5th house of the Kalapurusha—representing the cosmic throne of the zodiac.',
        'सिंह (सिम्हा) सूर्य का एकमात्र स्वगृह है और कालपुरुष की प्राकृतिक 5वीं राशि है—जो राशि चक्र के ब्रह्मांडीय सिंहासन का प्रतिनिधित्व करती है।',
        'સિંહ (સિંહ) સૂર્યનું એકમાત્ર સ્વગૃહ છે અને કાળપુરુષની કુદરતી 5મી રાશિ છે - જે રાશિચક્રના બ્રહ્માંડીય સિંહાસનનું પ્રતિનિધિત્વ કરે છે.'
      ),
      corePrinciple: buildFullMultiLang(
        'Wherever the sign of Leo falls in a birth chart, that specific house marks where the soul seeks undisputed authority, recognition, personal sovereignty, and honor. In that house, the soul refuses subordination and anchors its sense of self-respect.',
        'आपकी कुंडली में सिंह राशि जिस भाव में बैठती है, वह भाव दर्शाता है कि आपकी आत्मा कहाँ निर्विवाद अधिकार, मान्यता, संप्रभुता और मान-सम्मान चाहती है। उस भाव में आत्मा किसी की अधीनता स्वीकार नहीं करती।',
        'તમારી કુંડળીમાં સિંહ રાશિ જે ભાવમાં આવે છે, તે ભાવ દર્શાવે છે કે તમારી આત્મા ક્યાં સાર્વભૌમત્વ અને માન-સન્માન ઇચ્છે છે. તે ભાવમાં આત્મા કોઈની તાબેદારી સ્વીકારતી નથી.'
      )
    },
    leoHouseDetail: {
      houseNumber: leoHouse,
      lagnaName: leoData.lagnaName,
      title: leoData.title,
      atmaIccha: leoData.atmaIccha,
      karmicDrive: leoData.karmicDrive
    },
    sunHouseDetail: {
      houseNumber: sunHouse,
      rashiName: sunRashi,
      title: sunData.title,
      actionMechanism: sunData.actionMechanism
    },
    synthesisSummary
  };
}
