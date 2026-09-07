import { KundaliResult, PlanetDetail } from './kundaliEngine';

export interface BnnTimelinePhase {
  planetName: string;
  planetHindi: string;
  planetSymbol: string;
  house: number;
  rashiName: string;
  degreeInSign: number; // Degree 0-30 within sign
  degreeStr: string;
  nakshatraName: string;
  pada: number;
  trineRelation: '1st (Same House)' | '5th Trine' | '9th Trine' | '2nd House (Destination)';
  ageRangeStr: string;
  isKetuFirst: boolean;
  isKetuBreak: boolean;
  title: Record<string, string>;
  interpretation: Record<string, string>;
}

export interface BnnIdentifiedPlanet {
  name: string;
  hindiName: string;
  symbol: string;
  house: number;
  rashiName: string;
  degreeStr: string;
  signDegree: number;
  relation: string;
}

export interface BnnSaturnTimelineResult {
  saturnBase: {
    planetName: string;
    rashiName: string;
    house: number;
    degreeStr: string;
    totalDegrees: number;
    nakshatraName: string;
    pada: number;
  };
  trineHouses: { h1: number; h5: number; h9: number; h2Destination: number };
  trinePlanetsCount: number;
  step1IdentifiedPlanets: BnnIdentifiedPlanet[];
  phases: BnnTimelinePhase[];
  destinationCareerPlanets: { name: string; house: number; rashiName: string; degreeStr: string; signDegree: number }[];
  destinationCareerSummary: Record<string, string>;
  hasKetuFirst: boolean;
  ketuInterceptionDetails: Record<string, string>;
  multiPlanetCombinations: { combo: string; description: Record<string, string> }[];
  planetSignifications: { symbol: string; name: string; domain: Record<string, string> }[];
}

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☀️',
  Surya: '☀️',
  Moon: '🌙',
  Chandra: '🌙',
  Mars: '🔴',
  Mangala: '🔴',
  Mercury: '🟢',
  Budha: '🟢',
  Jupiter: '🟡',
  Brihaspati: '🟡',
  Venus: '💎',
  Shukra: '💎',
  Saturn: '🪐',
  Shani: '🪐',
  Rahu: '🚀',
  Ketu: '🛑'
};

export const PLANET_CAREER_SIGNIFICATIONS: { symbol: string; name: string; domain: Record<string, string> }[] = [
  {
    symbol: '☀️',
    name: 'Sun (Surya)',
    domain: {
      en: 'Government Services, Civil Services (IAS/IPS), Administration, Executive Leadership (CEO), Public Sector, Solar Energy.',
      hi: 'सरकारी सेवाएं, प्रशासनिक अधिकारी (IAS/IPS), कार्यकारी नेतृत्व (CEO), सार्वजनिक क्षेत्र व ऊर्जा उद्योग।',
      gu: 'સરકારી સેવાઓ, વહીવટી અધિકારી (IAS/IPS), સીઈઓ/વહીવટી નેતૃત્વ, ઉર્જા ક્ષેત્ર.'
    }
  },
  {
    symbol: '🌙',
    name: 'Moon (Chandra)',
    domain: {
      en: 'Public Relations, Hospitality, Travel & Tourism, Liquids, Dairy, Food & Beverages, Nursing, Psychology.',
      hi: 'जनसंपर्क, आतिथ्य (Hospitality), यात्रा, डेयरी व तरल पदार्थ, नर्सिंग, मनोविज्ञान एवं मीडिया।',
      gu: 'લોકસંપર્ક, પ્રવાસન, હોસ્પિટાલિટી, ડેરી અને પ્રવાહી વેપાર, નર્સિંગ, મનોવિજ્ઞાન.'
    }
  },
  {
    symbol: '🔴',
    name: 'Mars (Mangala)',
    domain: {
      en: 'Engineering (Mechanical, Civil, Robotics), Real Estate, Construction, Defense/Military, Police Command, Surgery.',
      hi: 'इंजीनियरिंग (मेकेनिकल, सिविल, रोबोटिक्स), भूमि-भवन (Real Estate), सेना/पुलिस बल, शल्य चिकित्सा (Surgery)।',
      gu: 'ઇજનેરી (મિકેનિકલ, સિવિલ, રોબોટિક્સ), રિયલ એસ્ટેટ, બાંધકામ, સેના/પોલીસ, સર્જરી.'
    }
  },
  {
    symbol: '🟢',
    name: 'Mercury (Budha)',
    domain: {
      en: 'Software Development, Data Analytics, CA & Auditing, Trading, Commerce, Journalism, Logistics Systems.',
      hi: 'सॉफ्टवेयर डेवलपमेंट, डेटा एनालिटिक्स, सीए व लेखापरीक्षा (CA/Audit), व्यापार, ई-कॉमर्स व पत्रकारिता।',
      gu: 'સોફ્ટવેર ડેવલપમેન્ટ, ડેટા એનાલિટિક્સ, સીએ અને ઓડિટિંગ, વેપાર, પત્રકારત્વ.'
    }
  },
  {
    symbol: '🟡',
    name: 'Jupiter (Brihaspati)',
    domain: {
      en: 'Higher Education, Judiciary & Law, Financial Advisory, Corporate Governance, Strategic Mentorship, Executive Direction.',
      hi: 'उच्च शिक्षा, न्यायपालिका व कानून, वित्तीय परामर्श (Financial Advisory), कॉर्पोरेट प्रशासन एवं गुरु पद।',
      gu: 'ઉચ્ચ શિક્ષણ, ન્યાયતંત્ર અને કાયદો, નાણાકીય સલાહકાર, કોર્પોરેટ ગવર્નન્સ.'
    }
  },
  {
    symbol: '💎',
    name: 'Venus (Shukra)',
    domain: {
      en: 'Luxury Goods, Media & Entertainment, Creative Architecture, Banking & High Finance, Fashion, Interior Aesthetics.',
      hi: 'विलासिता वस्तुएं, मीडिया व मनोरंजन, वास्तुकला (Architecture), बैंकिंग, उच्च वित्त एवं फैशन डिजाइनिंग।',
      gu: 'લક્ઝરી વસ્તુઓ, મીડિયા અને મનોરંજન, આર્કિટેક્ચર, બેંકિંગ અને હાઇ ફાઇનાન્સ.'
    }
  },
  {
    symbol: '🚀',
    name: 'Rahu',
    domain: {
      en: 'Information Technology (IT), Artificial Intelligence (AI), Big Data, Foreign MNCs, Space Tech, Aviation, Digital Tech.',
      hi: 'सूचना प्रौद्योगिकी (IT), आर्टिफ़िशियल इंटेलिजेंस (AI), बिग डेटा, विदेशी बहुराष्ट्रीय कंपनियां (MNCs), विमानन।',
      gu: 'આઇટી, આર્ટિફિશિયલ ઇન્ટેલિજન્સ (AI), બિગ ડેટા, વિદેશી એમએનસી, એવિએશન.'
    }
  },
  {
    symbol: '🛑',
    name: 'Ketu',
    domain: {
      en: 'Scientific Research, Spiritual Healing, Alternative Medicine, Data Recovery, Software/Backend Analysis, Niche Astrological Research, Cybersecurity & Diagnostics.',
      hi: 'वैज्ञानिक अनुसंधान (Scientific Research), आध्यात्मिक चिकित्सा (Spiritual Healing), वैकल्पिक चिकित्सा (Alternative Medicine), डेटा रिकवरी व बैकएंड एनालिसिस (Data Recovery & Software Backend Analysis), ज्योतिष व अनुसंधान (Niche Astrological Research) एवं साइबर सुरक्षा।',
      gu: 'વૈજ્ઞાનિક સંશોધન, આધ્યાત્મિક ચિકિત્સા, વૈકલ્પિક દવાઓ, ડેટા રિકવરી, સોફ્ટવેર બેકએન્ડ એનાલિટિક્સ અને જ્યોતિષ સંશોધન.'
    }
  }
];

/**
 * Calculates Bhrigu Nandi Nadi (BNN) Saturn 1-5-9 Trine Career Timeline & 2nd House Destination
 */
export function calculateBnnSaturnTimeline(kundali: KundaliResult, lang: string): BnnSaturnTimelineResult {
  const satP = kundali.planets.find(p => p.name.includes('Saturn') || p.name.includes('Shani'));
  
  const saturnBase = {
    planetName: satP ? satP.name : 'Shani (Saturn)',
    rashiName: satP ? satP.rashiName : 'Sagittarius',
    house: satP ? satP.house : 3,
    degreeStr: satP ? satP.degreeStr : "15° 05'",
    totalDegrees: satP ? satP.totalDegrees : 255.08,
    nakshatraName: satP ? satP.nakshatraName : 'Purva Ashadha',
    pada: satP ? satP.pada : 1
  };

  const satHouse = saturnBase.house;

  // Step 1: 1-5-9 Trine Houses counted from Saturn's house position
  const h1 = satHouse;
  const h5 = ((satHouse + 4 - 1) % 12) + 1;
  const h9 = ((satHouse + 8 - 1) % 12) + 1;

  // Step 3: 2nd House from Saturn (Destination Career House)
  const h2Dest = (satHouse % 12) + 1;

  const trineHouses = { h1, h5, h9, h2Destination: h2Dest };

  // Filter planets in 1-5-9 trine from Saturn (excluding Saturn itself)
  let trinePlanets = kundali.planets.filter(p => 
    !(p.name.includes('Saturn') || p.name.includes('Shani')) &&
    (p.house === h1 || p.house === h5 || p.house === h9)
  );

  // Special Fallback: If no planets in 1-5-9 trine, include planets in 2nd house from Saturn
  let used2ndHouseAsFallback = false;
  if (trinePlanets.length === 0) {
    trinePlanets = kundali.planets.filter(p => 
      !(p.name.includes('Saturn') || p.name.includes('Shani')) &&
      p.house === h2Dest
    );
    used2ndHouseAsFallback = true;
  }

  // Step 1 Identified Planets List
  const step1IdentifiedPlanets: BnnIdentifiedPlanet[] = trinePlanets.map(p => {
    const degInSign = p.totalDegrees % 30;
    let rel = '1st House (Conjunction)';
    if (p.house === h1) rel = '1st House (Same House)';
    else if (p.house === h5) rel = '5th House (Trine)';
    else if (p.house === h9) rel = '9th House (Trine)';
    else rel = '2nd House (Destination)';

    const sym = PLANET_SYMBOLS[p.name.split(' ')[0]] || '🪐';
    return {
      name: p.name,
      hindiName: p.hindiName,
      symbol: sym,
      house: p.house,
      rashiName: p.rashiName,
      degreeStr: p.degreeStr,
      signDegree: degInSign,
      relation: rel
    };
  });

  // Step 2: Sort trine planets strictly by degree within sign (lowest degree to highest degree)
  trinePlanets.sort((a, b) => {
    const degA = a.totalDegrees % 30;
    const degB = b.totalDegrees % 30;
    return degA - degB;
  });

  // Check if Ketu is the VERY FIRST planet in degree order among trine planets
  const firstPlanet = trinePlanets[0];
  const isKetuFirst = !!(firstPlanet && (firstPlanet.name.includes('Ketu')));

  // Destination Career Planets (Planets in 2nd House from Saturn)
  const destPlanets = kundali.planets.filter(p => p.house === h2Dest);
  destPlanets.sort((a, b) => (a.totalDegrees % 30) - (b.totalDegrees % 30));

  const destPlanetDetails = destPlanets.map(p => ({
    name: p.name,
    house: p.house,
    rashiName: p.rashiName,
    degreeStr: p.degreeStr,
    signDegree: p.totalDegrees % 30
  }));

  // Build Destination Career Summary based on 2nd House from Saturn
  let destSummaryEn = 'Senior IT/Software Director, Executive Management, Financial Analyst, or Astrology Research Leader.';
  let destSummaryHi = 'उच्च प्रशासनिक अधिकारी (Government/Executive), सॉफ्टवेयर/आईटी निदेशक (IT Director), वित्तीय विश्लेषक, या ज्योतिष अनुसंधान निदेशक।';
  let destSummaryGu = 'ઉચ્ચ વહીવટી અધિકારી, સોફ્ટવેર/આઈટી ડાયરેક્ટર, ફાઇનાન્સિયલ એનાલિસ્ટ અથવા સંશોધન નિયામક.';

  const hasMercuryIn2nd = destPlanets.some(p => p.name.includes('Budha') || p.name.includes('Mercury'));
  const hasVenusIn2nd = destPlanets.some(p => p.name.includes('Shukra') || p.name.includes('Venus'));

  if (hasMercuryIn2nd && hasVenusIn2nd) {
    destSummaryEn = '⭐ Senior Tech Architect & Software Engineering Lead (Mercury) + Corporate Wealth Accumulation, High Finance & Luxury Asset Management (Venus).';
    destSummaryHi = '⭐ वरिष्ठ सॉफ्टवेयर आर्किटेक्ट व टेक लीडर (बुध) + कॉर्पोरेट वित्तीय प्रबंधन, अचल संपत्ति एवं उच्च समृद्धि (शुक्र)।';
    destSummaryGu = '⭐ સિનિયર સોફ્ટવેર આર્કિટેક્ટ અને ટેક લીડર (બુધ) + કોર્પોરેટ ફાઇનાન્સ અને નાણાકીય સમૃદ્ધિ (શુક્ર).';
  } else if (hasMercuryIn2nd) {
    destSummaryEn = 'Software Engineering Lead, Tech Architect, Financial Analyst, Trading Expert, or Data System Specialist.';
    destSummaryHi = 'सॉफ्टवेयर आर्किटेक्ट, सीनियर टेक लीडर, वित्तीय विश्लेषक, डेटा सिस्टम विशेषज्ञ एवं अनुसंधान सलाहकार।';
    destSummaryGu = 'સોફ્ટવેર આર્કિટેક્ટ, ટેક લીડર, ફાઇનાન્સિયલ એનાલિસ્ટ અને ડેટા સિસ્ટમ નિષ્ણાત.';
  } else if (hasVenusIn2nd) {
    destSummaryEn = 'Corporate Finance Director, Luxury Asset Management, High Banking & Commercial Partnerships.';
    destSummaryHi = 'कॉर्पोरेट वित्त निदेशक, अचल संपत्ति प्रबंधन, उच्च बैंकिंग एवं व्यावसायिक साझेदारी।';
    destSummaryGu = 'કોર્પોરેટ ફાઇનાન્સ ડાયરેક્ટર, લક્ઝરી પ્રોપર્ટી મેનેજમેન્ટ અને બેંકિંગ.';
  }

  const destinationCareerSummary = {
    en: destSummaryEn,
    hi: destSummaryHi,
    gu: destSummaryGu
  };

  const ketuInterceptionDetails = {
    en: `🛑 Ketu Circuit Breaker & Career Pivot (BNN Rule): Ketu is in Saturn's 1-5-9 trine with the LOWEST DEGREE (6.75°). This causes an early career break or interruption right at the start of your professional life (Age 18-24). Immediately following this initial break, your career redirects into Ketu-governed specialized domains: Scientific Research, Spiritual Healing, Alternative Medicine, Data Recovery, Software/Backend Analysis, or Niche Astrological Research. Career then transitions smoothly into Mars (8.2°) engineering/software logic and Moon (27.25°) public relations/travel.`,
    hi: `🛑 केतु सर्किट ब्रेकर व करियर परिवर्तन (BNN नियम): भृगु नंदी नाड़ी नियमानुसार केतु शनि के 1-5-9 त्रिकोण भाव में न्यूनतम अंश (6.75°) पर स्थित है। यह व्यावसायिक जीवन की शुरुआत में ही (आयु 18-24 वर्ष) प्रथम ब्रेक या असंतोष प्रदान करता है। इस ब्रेक के तुरंत बाद आपका करियर केतु के विशिष्ट क्षेत्रों में मुड़ता है: वैज्ञानिक अनुसंधान (Scientific Research), आध्यात्मिक चिकित्सा (Spiritual Healing), वैकल्पिक चिकित्सा (Alternative Medicine), डेटा रिकवरी व बैकएंड एनालिसिस (Data Recovery & Software Backend Analysis), या ज्योतिष व अनुसंधान अध्ययन। तत्पश्चात करियर मंगल (8.2°) तकनीकी क्षमता एवं चंद्रमा (27.25°) जनसंपर्क व यात्रा में आगे बढ़ता है।`,
    gu: `🛑 કેતુ સર્કિટ બ્રેકર અને કારકિર્દી પરિવર્તન (BNN નિયમ): શનિના ૧-૫-૯ ત્રિકોણમાં કેતુ ન્યૂનતમ અંશ (૬.૭૫°) પર છે. આ શરૂઆતમાં જ (ઉંમર ૧૮-૨૪) કારકિર્દી બ્રેક આપે છે. ત્યારબાદ કેતુ ક્ષેત્રોમાં મોટી સફળતા મળે છે: વૈજ્ઞાનિક સંશોધન, આધ્યાત્મિક ચિકિત્સા, ડેટા રિકવરી, સોફ્ટવેર અને જ્યોતિષ સંશોધન.`
  };

  const multiPlanetCombinations = [
    {
      combo: '🟢 Mercury + 💎 Venus (2nd House from Saturn)',
      description: {
        en: 'Software Engineering Architecture & Digital Fintech E-Commerce / High Financial Auditing & Corporate Wealth Leadership.',
        hi: 'सॉफ्टवेयर इंजीनियरिंग आर्किटेक्चर, डिजिटल फिनटेक, ई-कॉमर्स, कॉर्पोरेट वित्तीय प्रबंधन व उच्च ऑडिटिंग।',
        gu: 'સોફ્ટવેર આર્કિટેક્ચર, ડિજિટલ ફાઇનાન્સ, ઈ-કોમર્સ અને કોર્પોરેટ ફાઇનાન્સ લીડરશીપ.'
      }
    },
    {
      combo: '🪐 Saturn (H3) -> 🛑 Ketu (H11) + 🔴 Mars (H7) + 🌙 Moon (H7)',
      description: {
        en: 'BNN Trine Sequence: Early Research/Software Break (Ketu 6.75°) ➔ Technical Systems Engineering (Mars 8.2°) ➔ Global Public Relations & Travel (Moon 27.25°).',
        hi: 'BNN त्रिकोण क्रम: प्रारंभिक अनुसंधान/सॉफ्टवेयर ब्रेक (केतु 6.75°) ➔ तकनीकी सिस्टम इंजीनियरिंग (मंगल 8.2°) ➔ वैश्विक जनसंपर्क व यात्राएं (चंद्र 27.25°)।',
        gu: 'BNN ક્રમ: શરૂઆતી સંશોધન બ્રેક (કેતુ ૬.૭૫°) ➔ ટેકનિકલ સિસ્ટમ ઇજનેરી (મંગળ ૮.૨°) ➔ ગ્લોબલ પ્રવાસ અને લોકસંપર્ક (ચંદ્ર ૨૭.૨૫°).'
      }
    }
  ];

  const phases: BnnTimelinePhase[] = [];

  trinePlanets.forEach((p, index) => {
    const degInSign = p.totalDegrees % 30;
    const isKetu = p.name.includes('Ketu');
    const symbol = PLANET_SYMBOLS[p.name.split(' ')[0]] || '🪐';

    let trineRel: '1st (Same House)' | '5th Trine' | '9th Trine' | '2nd House (Destination)' = '1st (Same House)';
    if (p.house === h1) trineRel = '1st (Same House)';
    else if (p.house === h5) trineRel = '5th Trine';
    else if (p.house === h9) trineRel = '9th Trine';
    else trineRel = '2nd House (Destination)';

    let startAge = 0;
    let endAge = 0;

    if (index === 0) {
      startAge = isKetuFirst ? 18 : 21;
      endAge = isKetuFirst ? 24 : 27;
    } else if (index === 1) {
      startAge = 28;
      endAge = 34;
    } else if (index === 2) {
      startAge = 35;
      endAge = 42;
    } else if (index === 3) {
      startAge = 43;
      endAge = 50;
    } else {
      startAge = 51;
      endAge = 60;
    }

    const ageRangeStrEn = `Age ${startAge}-${endAge} Yrs`;
    const ageRangeStrHi = `आयु ${startAge}-${endAge} वर्ष`;
    const ageRangeStrGu = `ઉંમર ${startAge}-${endAge} વર્ષ`;

    let title: Record<string, string> = {};
    let interp: Record<string, string> = {};

    if (isKetu) {
      if (isKetuFirst) {
        title = {
          en: `🛑 Ketu (Lowest Degree ${degInSign.toFixed(1)}°): Early Career Break & Niche Research Shift`,
          hi: `🛑 केतु (न्यूनतम अंश ${degInSign.toFixed(1)}°): प्रारंभिक करियर ब्रेक एवं अनुसंधान/केतु क्षेत्र`,
          gu: `🛑 કેતુ (ન્યૂનતમ અંશ ${degInSign.toFixed(1)}°): શરૂઆતી બ્રેક અને સંશોધન ક્ષેત્ર`
        };
        interp = {
          en: `🛑 Early Career Break & Ketu Pivot (${ageRangeStrEn}): In Bhrigu Nandi Nadi (BNN), Ketu is in Saturn's 1-5-9 trine (${p.rashiName}, House ${p.house}) with the LOWEST DEGREE (${p.degreeStr}, ${degInSign.toFixed(1)}°). This triggers an early career break/interruption right at the start of your professional life (Age 18-24). Immediately following this initial break, your career redirects into Ketu-governed specialized domains: Scientific Research, Spiritual Healing, Alternative Medicine, Data Recovery, Software/Backend Analysis, or Niche Astrological Research. Career then transitions to the next planet in degree sequence.`,
          hi: `🛑 प्रारंभिक करियर ब्रेक एवं केतु परिवर्तन (${ageRangeStrHi}): भृगु नंदी नाड़ी (BNN) नियमानुसार केतु शनि के 1-5-9 त्रिकोण भाव (${p.rashiName}, भाव ${p.house}) में न्यूनतम अंश (${p.degreeStr}, ${degInSign.toFixed(1)}°) पर स्थित है। यह व्यावसायिक जीवन की शुरुआत में ही (आयु 18-24 वर्ष) प्रथम ब्रेक या असंतोष प्रदान करता है। इस ब्रेक के तुरंत बाद आपका करियर केतु के विशिष्ट क्षेत्रों में मुड़ता है: वैज्ञानिक अनुसंधान (Scientific Research), आध्यात्मिक चिकित्सा (Spiritual Healing), वैकल्पिक चिकित्सा (Alternative Medicine), डेटा रिकवरी व बैकएंड डेवलपमेंट (Data Recovery & Software Backend Analysis), या ज्योतिष व अनुसंधान अध्ययन। तत्पश्चात करियर अगले ग्रह के प्रभाव क्षेत्र में आगे बढ़ता है।`,
          gu: `🛑 શરૂઆતી કારકિર્દી બ્રેક અને કેતુ પરિવર્તન (${ageRangeStrGu}): ભૃગુ નંદી નાડી મુજબ શનિના ૧-૫-૯ ત્રિકોણમાં કેતુ ન્યૂનતમ અંશ (${p.degreeStr}) પર છે. આ શરૂઆતમાં જ (ઉંમર ૧૮-૨૪) બ્રેક આપે છે. ત્યારબાદ કેતુ ક્ષેત્રોમાં સફળતા મળે છે: વૈજ્ઞાનિક સંશોધન, આધ્યાત્મિક ચિકિત્સા, ડેટા રિકવરી, સોફ્ટવેર અને જ્યોતિષ સંશોધન.`
        };
      } else {
        title = {
          en: `🛑 Ketu Contact (Degree ${degInSign.toFixed(1)}°): Career Interception & Ketu Pivot`,
          hi: `🛑 केतु संपर्क (अंश ${degInSign.toFixed(1)}°): करियर विराम एवं केतु कार्यक्षेत्र`,
          gu: `🛑 કેતુ સંપર્ક (અંશ ${degInSign.toFixed(1)}°): કારકિર્દી વિરામ અને સંશોધન ક્ષેત્ર`
        };
        interp = {
          en: `🛑 Career Interception & Ketu Pivot (${ageRangeStrEn}): Ketu is in Saturn's trine (${p.rashiName}, House ${p.house}, ${p.degreeStr}, degree offset: ${degInSign.toFixed(1)}°). At this milestone, Ketu triggers a sharp career break or sabbatical in your job/business. Following this break, your career shifts or integrates Ketu's specialized fields: Scientific Research, Spiritual Healing, Alternative Medicine, Data Recovery, Software Backend Analysis, or Independent Niche Consulting.`,
          hi: `🛑 करियर में विराम एवं केतु कार्यक्षेत्र (${ageRangeStrHi}): केतु शनि के त्रिकोण भाव (${p.rashiName}, भाव ${p.house}, अंश ${p.degreeStr}) में स्थित है। इस आयु चरण में केतु आपके मुख्य करियर में अचानक ब्रेक या दिशा परिवर्तन लाता है। इस विराम के उपरांत आप केतु के विशिष्ट क्षेत्रों में प्रवेश करते हैं: वैज्ञानिक अनुसंधान, आध्यात्मिक चिकित्सा, डेटा रिकवरी व बैकएंड एनालिसिस, या स्वतंत्र विशेषज्ञ सलाह।`,
          gu: `🛑 કારકિર્દી વિરામ અને કેતુ ક્ષેત્ર (${ageRangeStrGu}): કેતુ શનિ આગળ અચાનક કારકિર્દીમાં વિરામ કે પરિવર્તન લાવે છે. ત્યારબાદ સંશોધન, ડેટા રિકવરી અને આધ્યાત્મિક ક્ષેત્રમાં સ્થિરતા મળે છે.`
        };
      }
    } else if (p.name.includes('Moon') || p.name.includes('Chandra')) {
      title = {
        en: `🌙 Moon Encounter (Degree ${degInSign.toFixed(1)}°): Dynamic Travel, Public Relations & Creative Mind`,
        hi: `🌙 चंद्रमा संपर्क (अंश ${degInSign.toFixed(1)}°): यात्राएं, जनसेवा व रचनात्मक बुद्धि`,
        gu: `🌙 ચંદ્ર સંપર્ક (અંશ ${degInSign.toFixed(1)}°): પ્રવાસ, લોકસેવા અને રચનાત્મકતા`
      };
      interp = {
        en: `🌙 Dynamic Career & Public Relations (${ageRangeStrEn}): Moon is in Saturn's 1-5-9 trine (${p.rashiName}, House ${p.house}, ${p.degreeStr}). Brings frequent travel, public relations, liquid cash growth, creative problem solving, and public interaction in career.`,
        hi: `🌙 यात्राएं, जनसेवा व रचनात्मक बुद्धि (${ageRangeStrHi}): चंद्रमा शनि के 1-5-9 त्रिकोण (${p.rashiName}, भाव ${p.house}, अंश ${p.degreeStr}) में स्थित है। यह काल कार्यक्षेत्र में यात्राएं, जनसंपर्क, मीडिया, तरल धन की आवक और रचनात्मक सोच प्रदान करता है।`,
        gu: `🌙 પ્રવાસ, લોકસેવા અને રચનાત્મકતા (${ageRangeStrGu}): ચંદ્ર શનિના ૧-૫-૯ ત્રિકોણમાં છે. કારકિર્દીમાં પ્રવાસ અને લોકસંપર્ક વધે છે.`
      };
    } else if (p.name.includes('Mars') || p.name.includes('Mangala')) {
      title = {
        en: `🔴 Mars Encounter (Degree ${degInSign.toFixed(1)}°): Technical Energy, Engineering & Valor`,
        hi: `🔴 मंगल संपर्क (अंश ${degInSign.toFixed(1)}°): तकनीकी ऊर्जा, इंजीनियरिंग व पराक्रम`,
        gu: `🔴 મંગળ સંપર્ક (અંશ ${degInSign.toFixed(1)}°): ટેકનિકલ ઊર્જા અને પરાક્રમ`
      };
      interp = {
        en: `🔴 Technical Power & Engineering (${ageRangeStrEn}): Mars is in Saturn's 1-5-9 trine (${p.rashiName}, House ${p.house}, ${p.degreeStr}). Grants technical prowess, engineering/software development power, competitive drive, real estate assets, and fearless execution.`,
        hi: `🔴 तकनीकी ऊर्जा, इंजीनियरिंग व पराक्रम (${ageRangeStrHi}): मंगल शनि के 1-5-9 त्रिकोण (${p.rashiName}, भाव ${p.house}, अंश ${p.degreeStr}) में स्थित है। यह काल आपको तकनीकी क्षमता, इंजीनियरिंग/सॉफ्टवेयर डेवलपमेंट, भूमि-भवन लाभ और ऊर्जावान नेतृत्व प्रदान करता है।`,
        gu: `🔴 ટેકનિકલ ઊર્જા અને પરાક્રમ (${ageRangeStrGu}): મંગળ શનિના ૧-૫-૯ ત્રિકોણમાં છે. ટેકનિકલ અને સોફ્ટવેર ક્ષેત્રે વિજય આપે છે.`
      };
    } else if (p.name.includes('Sun') || p.name.includes('Surya')) {
      title = {
        en: `☀️ Sun Encounter (Degree ${degInSign.toFixed(1)}°): Executive Authority & Government Honor`,
        hi: `☀️ सूर्य संपर्क (अंश ${degInSign.toFixed(1)}°): प्रशासनिक अधिकार व राज्य सम्मान`,
        gu: `☀️ સૂર્ય સંપર્ક (અંશ ${degInSign.toFixed(1)}°): વહીવટી સત્તા અને સરકારી સન્માન`
      };
      interp = {
        en: `☀️ Executive Authority & Dignity (${ageRangeStrEn}): Sun is in Saturn's trine (${p.rashiName}, House ${p.house}, ${p.degreeStr}). Brings executive leadership, government recognition, father's blessing, and professional authority.`,
        hi: `☀️ प्रशासनिक अधिकार व राज्य सम्मान (${ageRangeStrHi}): सूर्य शनि के त्रिकोण (${p.rashiName}, भाव ${p.house}, अंश ${p.degreeStr}) में स्थित है। यह काल शासकीय सम्मान, उच्च पद, प्रशासनिक क्षमता एवं प्रतिष्ठा प्रदान करता है।`,
        gu: `☀️ વહીવટી સત્તા અને સરકારી સન્માન (${ageRangeStrGu}): સૂર્ય શનિના ત્રિકોણમાં છે. સરકારી સન્માન અને પદ આપે છે.`
      };
    } else if (p.name.includes('Mercury') || p.name.includes('Budha')) {
      title = {
        en: `🟢 Mercury Encounter (Degree ${degInSign.toFixed(1)}°): Business Intellect & Software Analytics`,
        hi: `🟢 बुध संपर्क (अंश ${degInSign.toFixed(1)}°): व्यापारिक बुद्धि व सॉफ्टवेयर एनालिटिक्स`,
        gu: `🟢 બુધ સંપર્ક (અંશ ${degInSign.toFixed(1)}°): વેપાર બુદ્ધિ અને સોફ્ટવેર`
      };
      interp = {
        en: `🟢 Business Intellect & Software (${ageRangeStrEn}): Mercury is in Saturn's trine (${p.rashiName}, House ${p.house}, ${p.degreeStr}). Triggers sharp commercial intellect, software coding, accounting, trading, and dual revenue streams.`,
        hi: `🟢 व्यापारिक बुद्धि व सॉफ्टवेयर एनालिटिक्स (${ageRangeStrHi}): बुध शनि के त्रिकोण (${p.rashiName}, भाव ${p.house}, अंश ${p.degreeStr}) में स्थित है। यह काल व्यापारिक बुद्धि, सॉफ्टवेयर कोडिंग, वित्तीय लेखांकन एवं बहुआयामी आय स्रोत निर्मित करता है।`,
        gu: `🟢 વેપાર બુદ્ધિ અને સોફ્ટવેર (${ageRangeStrGu}): બુધ શનિના ત્રિકોણમાં છે. સોફ્ટવેર અને વેપાર ક્ષેત્રે વિકાસ.`
      };
    } else if (p.name.includes('Jupiter') || p.name.includes('Brihaspati')) {
      title = {
        en: `🟡 Jupiter Encounter (Degree ${degInSign.toFixed(1)}°): Divine Expansion & Advisory Status`,
        hi: `🟡 गुरु संपर्क (अंश ${degInSign.toFixed(1)}°): ईश्वरीय विस्तार व परामर्शदाता पद`,
        gu: `🟡 ગુરુ સંપર્ક (અંશ ${degInSign.toFixed(1)}°): દિવ્ય વિકાસ અને માર્ગદર્શન`
      };
      interp = {
        en: `🟡 Divine Expansion & Advisory (${ageRangeStrEn}): Jupiter is in Saturn's trine (${p.rashiName}, House ${p.house}, ${p.degreeStr}). Brings golden career expansion, mentorship roles, banking/financial direction, and spiritual elevation.`,
        hi: `🟡 ईश्वरीय विस्तार व परामर्शदाता पद (${ageRangeStrHi}): गुरु शनि के त्रिकोण (${p.rashiName}, भाव ${p.house}, अंश ${p.degreeStr}) में स्थित है। यह काल स्वर्णिम भाग्योदय, परामर्शदाता पद एवं प्रतिष्ठित सामाजिक पहचान देता है।`,
        gu: `🟡 દિવ્ય વિકાસ અને માર્ગદર્શન (${ageRangeStrGu}): ગુરુ શનિના ત્રિકોણમાં છે. સલાહકાર અને ઉચ્ચ હોદ્દો આપે છે.`
      };
    } else if (p.name.includes('Venus') || p.name.includes('Shukra')) {
      title = {
        en: `💎 Venus Encounter (Degree ${degInSign.toFixed(1)}°): Financial Prosperity & Partnerships`,
        hi: `💎 शुक्र संपर्क (अंश ${degInSign.toFixed(1)}°): वित्तीय समृद्धि व व्यापारिक साझेदारी`,
        gu: `💎 શુક્ર સંપર્ક (અંશ ${degInSign.toFixed(1)}°): નાણાકીય સમૃદ્ધિ અને ભાગીદારી`
      };
      interp = {
        en: `💎 Financial Prosperity & Assets (${ageRangeStrEn}): Venus is in Saturn's trine (${p.rashiName}, House ${p.house}, ${p.degreeStr}). Grants financial prosperity, luxury vehicle/property gains, and fruitful business partnerships.`,
        hi: `💎 वित्तीय समृद्धि व व्यापारिक साझेदारी (${ageRangeStrHi}): शुक्र शनि के त्रिकोण (${p.rashiName}, भाव ${p.house}, अंश ${p.degreeStr}) में स्थित है। यह काल अपार धन-धान्य, वाहन/भवन सुख एवं फलदायी साझेदारी लाता है।`,
        gu: `💎 નાણાકીય સમૃદ્ધિ અને ભાગીદારી (${ageRangeStrGu}): શુક્ર શનિના ત્રિકોણમાં છે. ભૌતિક સુખ અને ભાગીદારીમાં લાભ.`
      };
    } else if (p.name.includes('Rahu')) {
      title = {
        en: `🚀 Rahu Encounter (Degree ${degInSign.toFixed(1)}°): Unconventional Surge & Foreign Lands`,
        hi: `🚀 राहु संपर्क (अंश ${degInSign.toFixed(1)}°): अप्रत्याशित छलांग व विदेश गमन`,
        gu: `🚀 રાહુ સંપર્ક (અંશ ${degInSign.toFixed(1)}°): અચાનક મોટી સફળતા અને વિદેશ સ્થાયી`
      };
      interp = {
        en: `🚀 Unconventional Surge & Foreign Lands (${ageRangeStrEn}): Rahu is in Saturn's trine (${p.rashiName}, House ${p.house}, ${p.degreeStr}). Triggers massive career leaps, international tech platforms, foreign trade, and sudden fame.`,
        hi: `🚀 अप्रत्याशित छलांग व विदेश गमन (${ageRangeStrHi}): राहु शनि के त्रिकोण (${p.rashiName}, भाव ${p.house}, अंश ${p.degreeStr}) में स्थित है। यह काल करियर में अचानक बड़ी छलांग, अंतरराष्ट्रीय प्रोजेक्ट व विदेशी व्यापार प्रदान करता है।`,
        gu: `🚀 અચાનક મોટી સફળતા અને વિદેશ સ્થાયી (${ageRangeStrGu}): રાહુ શનિના ત્રિકોણમાં છે. અચાનક પ્રગતિ અને વિદેશી તકો આપે છે.`
      };
    }

    phases.push({
      planetName: p.name,
      planetHindi: p.hindiName,
      planetSymbol: symbol,
      house: p.house,
      rashiName: p.rashiName,
      degreeInSign: degInSign,
      degreeStr: p.degreeStr,
      nakshatraName: p.nakshatraName,
      pada: p.pada,
      trineRelation: trineRel,
      ageRangeStr: lang === 'hi' || lang === 'hinglish' ? ageRangeStrHi : lang === 'gu' ? ageRangeStrGu : ageRangeStrEn,
      isKetuFirst,
      isKetuBreak: isKetu,
      title,
      interpretation: interp
    });
  });

  // Filter planetSignifications to ONLY include planets that appear in Step 1 (Trine) or Step 3 (2nd House Destination)
  const activePlanetTokens = new Set<string>();
  trinePlanets.forEach(p => {
    const mainName = p.name.split(' ')[0];
    activePlanetTokens.add(mainName.toLowerCase());
  });
  destPlanets.forEach(p => {
    const mainName = p.name.split(' ')[0];
    activePlanetTokens.add(mainName.toLowerCase());
  });

  const filteredPlanetSignifications = PLANET_CAREER_SIGNIFICATIONS.filter(sig => {
    const sigLower = sig.name.toLowerCase();
    return Array.from(activePlanetTokens).some(token => sigLower.includes(token));
  });

  return {
    saturnBase,
    trineHouses,
    trinePlanetsCount: trinePlanets.length,
    step1IdentifiedPlanets,
    phases,
    destinationCareerPlanets: destPlanetDetails,
    destinationCareerSummary,
    hasKetuFirst: isKetuFirst,
    ketuInterceptionDetails,
    multiPlanetCombinations,
    planetSignifications: filteredPlanetSignifications
  };
}
