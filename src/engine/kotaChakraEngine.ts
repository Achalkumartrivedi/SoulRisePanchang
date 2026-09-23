// Authentic 28-Nakshatra Kota Chakra Engine (Fortress Chart Engine)

export interface Nakshatra28Detail {
  index28: number;
  nameEng: string;
  nameHin: string;
  nameGuj: string;
  lord: string;
  isAbhijit?: boolean;
}

export const ALL_28_NAKSHATRAS: Nakshatra28Detail[] = [
  { index28: 1, nameEng: 'Ashwini', nameHin: 'अश्विनी', nameGuj: 'અશ્વિની', lord: 'Ketu' },
  { index28: 2, nameEng: 'Bharani', nameHin: 'भरणी', nameGuj: 'ભરણી', lord: 'Venus' },
  { index28: 3, nameEng: 'Krittika', nameHin: 'कृत्तिका', nameGuj: 'કૃત્તિકા', lord: 'Sun' },
  { index28: 4, nameEng: 'Rohini', nameHin: 'रोहिणी', nameGuj: 'રોહિણી', lord: 'Moon' },
  { index28: 5, nameEng: 'Mrigashira', nameHin: 'मृगशिरा', nameGuj: 'મૃગશીર્ષ', lord: 'Mars' },
  { index28: 6, nameEng: 'Ardra', nameHin: 'आर्द्रा', nameGuj: 'આર્દ્રા', lord: 'Rahu' },
  { index28: 7, nameEng: 'Punarvasu', nameHin: 'पुनर्वसु', nameGuj: 'પુનર્વસુ', lord: 'Jupiter' },
  { index28: 8, nameEng: 'Pushya', nameHin: 'पुष्य', nameGuj: 'પુષ્ય', lord: 'Saturn' },
  { index28: 9, nameEng: 'Ashlesha', nameHin: 'आश्लेषा', nameGuj: 'આશ્લેષા', lord: 'Mercury' },
  { index28: 10, nameEng: 'Magha', nameHin: 'मघा', nameGuj: 'મઘા', lord: 'Ketu' },
  { index28: 11, nameEng: 'Purva Phalguni', nameHin: 'पूर्वाफाल्गुनी', nameGuj: 'પૂર્વા ફાલ્ગુની', lord: 'Venus' },
  { index28: 12, nameEng: 'Uttara Phalguni', nameHin: 'उत्तराफाल्गुनी', nameGuj: 'ઉત્તરા ફાલ્ગુની', lord: 'Sun' },
  { index28: 13, nameEng: 'Hasta', nameHin: 'हस्त', nameGuj: 'હસ્ત', lord: 'Moon' },
  { index28: 14, nameEng: 'Chitra', nameHin: 'चित्रा', nameGuj: 'ચિત્રા', lord: 'Mars' },
  { index28: 15, nameEng: 'Swati', nameHin: 'स्वाति', nameGuj: 'સ્વાતિ', lord: 'Rahu' },
  { index28: 16, nameEng: 'Vishakha', nameHin: 'विशाखा', nameGuj: 'વિશાખા', lord: 'Jupiter' },
  { index28: 17, nameEng: 'Anuradha', nameHin: 'अनुराधा', nameGuj: 'અનુરાધા', lord: 'Saturn' },
  { index28: 18, nameEng: 'Jyeshtha', nameHin: 'ज्येष्ठा', nameGuj: 'જ્યેષ્ઠા', lord: 'Mercury' },
  { index28: 19, nameEng: 'Moola', nameHin: 'मूल', nameGuj: 'મૂળ', lord: 'Ketu' },
  { index28: 20, nameEng: 'Purva Ashadha', nameHin: 'पूर्वाषाढा', nameGuj: 'પૂર્વાષાઢા', lord: 'Venus' },
  { index28: 21, nameEng: 'Uttara Ashadha', nameHin: 'उत्तराषाढा', nameGuj: 'ઉત્તરાષાઢા', lord: 'Sun' },
  { index28: 22, nameEng: 'Abhijit', nameHin: 'अभिजित', nameGuj: 'અભિજિત', lord: 'Sun', isAbhijit: true },
  { index28: 23, nameEng: 'Shravana', nameHin: 'श्रवण', nameGuj: 'શ્રવણ', lord: 'Moon' },
  { index28: 24, nameEng: 'Dhanishta', nameHin: 'धनिष्ठा', nameGuj: 'ધનિષ્ઠા', lord: 'Mars' },
  { index28: 25, nameEng: 'Shatabhisha', nameHin: 'शतभिषा', nameGuj: 'શતભિષા', lord: 'Rahu' },
  { index28: 26, nameEng: 'Purva Bhadrapada', nameHin: 'पूर्वाभाद्रपद', nameGuj: 'પૂર્વા ભાદ્રપદ', lord: 'Jupiter' },
  { index28: 27, nameEng: 'Uttara Bhadrapada', nameHin: 'उत्तराभाद्रपद', nameGuj: 'ઉત્તરા ભાદ્રપદ', lord: 'Saturn' },
  { index28: 28, nameEng: 'Revati', nameHin: 'रेवती', nameGuj: 'રેવતી', lord: 'Mercury' }
];

export interface KotaZoneDefinition {
  zoneKey: 'STAMBHA' | 'DURGANTARA' | 'PRAKARA' | 'BAHYA';
  nameEng: string;
  nameHin: string;
  nameGuj: string;
  descEng: string;
  descHin: string;
  descGuj: string;
  colorHex: string;
}

export const KOTA_ZONES: Record<string, KotaZoneDefinition> = {
  STAMBHA: {
    zoneKey: 'STAMBHA',
    nameEng: 'Stambha (Central Core)',
    nameHin: 'स्तंभ (केंद्रीय स्तंभ)',
    nameGuj: 'સ્તંભ (કેન્દ્રીય સ્તંભ)',
    descEng: 'Core inner pillar of the fort. Malefics here indicate high vulnerability; Benefics provide solid inner strength.',
    descHin: 'दुर्ग का केंद्रीय स्तंभ। यहां क्रूर ग्रह उच्च संवेदनशीलता और सौम्य ग्रह आंतरिक शक्ति देते हैं।',
    descGuj: 'કિલ્લાનો કેન્દ્રીય સ્તંભ. અહીં ક્રૂર ગ્રહો ઉચ્ચ સંવેદનશીલતા અને સૌમ્ય ગ્રહો આંતરિક શક્તિ આપે છે.',
    colorHex: '#00838F'
  },
  DURGANTARA: {
    zoneKey: 'DURGANTARA',
    nameEng: 'Madhya / Durgantara (Inner Fort)',
    nameHin: 'मध्य / दुर्गांतर (आंतरिक दुर्ग)',
    nameGuj: 'મધ્ય / દુર્ગાંતર (આંતરિક કિલ્લો)',
    descEng: 'Inner fort ring surrounding Stambha. Protects core decisions and personal stability.',
    descHin: 'स्तंभ को घेरने वाला आंतरिक दुर्ग वलय। व्यक्तिगत स्थिरता और निर्णयों की रक्षा करता है।',
    descGuj: 'સ્તંભને ઘેરતું આંતરિક કિલ્લા વલય. વ્યક્તિગત સ્થિરતા અને નિર્ણયોનું રક્ષણ કરે છે.',
    colorHex: '#1565C0'
  },
  PRAKARA: {
    zoneKey: 'PRAKARA',
    nameEng: 'Prakara (Outer Fort Wall)',
    nameHin: 'प्राकार (प्राचीर / बाहरी दीवार)',
    nameGuj: 'પ્રાકાર (કિલ્લાની બહારની દીવાલ)',
    descEng: 'Boundary wall of the fort. Represents defense line against external challenges.',
    descHin: 'दुर्ग की बाहरी दीवार। बाहरी चुनौतियों के खिलाफ रक्षा पंक्ति का प्रतिनिधित्व करता है।',
    descGuj: 'કિલ્લાની બહારની દીવાલ. બાહ્ય પડકારો સામે રક્ષણ લાઇન દર્શાવે છે.',
    colorHex: '#2E7D32'
  },
  BAHYA: {
    zoneKey: 'BAHYA',
    nameEng: 'Bahya (Outside Territory)',
    nameHin: 'बाह्य (बाहरी क्षेत्र)',
    nameGuj: 'બાહ્ય (બહારનો વિસ્તાર)',
    descEng: 'External area outside fort wall. Safe zone for malefics to exit away from inner fort.',
    descHin: 'दुर्ग दीवार के बाहर का क्षेत्र। क्रूर ग्रहों के बाहर निकलने पर राहत का क्षेत्र।',
    descGuj: 'કિલ્લાની બહારનો વિસ્તાર. ક્રૂર ગ્રહો બહાર નીકળતા રાહતનો વિસ્તાર.',
    colorHex: '#C62828'
  }
};

export interface PlanetPositionInfo {
  planetKey: string;
  nameEng: string;
  nameHin: string;
  nameGuj: string;
  symbol: string;
  shortCode: string;
  signEng: string;
  degreeStr: string;
  nakshatra28Index: number;
  nakshatraName: string;
  pada: number;
  nakLord: string;
  isBenefic: boolean;
}

export interface KotaPathPosition {
  pathIndex: number; // 0 to 27
  displayNumber: number; // Rotated Nakshatra Number (1 to 28)
  nakshatraNameEng: string;
  nakshatraNameHin: string;
  nakshatraNameGuj: string;
  zone: 'STAMBHA' | 'DURGANTARA' | 'PRAKARA' | 'BAHYA';
  isEntry: boolean;
  pathName: string;
  natalPlanets: PlanetPositionInfo[];
  transitPlanets: PlanetPositionInfo[];
}

export type LifeImpactCategory = 'AUSPICIOUS' | 'MIXED' | 'INAUSPICIOUS';

export interface DeepKotaInsight {
  id: string;
  category: 'MOON_MOTHER' | 'MIND_EMOTION' | 'MALEFIC_SIEGE' | 'BENEFIC_PROTECTION' | 'HEALTH_CAREER';
  icon: string;
  title: { en: string; hi: string; gu: string };
  description: { en: string; hi: string; gu: string };
  severity: 'HIGH_ALERT' | 'WARNING' | 'AUSPICIOUS' | 'INFO';
}

export interface NakCategoryItem {
  pathIndex: number;
  displayNumber: number;
  nameEng: string;
  nameHin: string;
  nameGuj: string;
}

export interface KotaChakraResult {
  janmaNakshatra27Index: number;
  janmaNakshatra28Index: number;
  janmaNakshatraNameEng: string;
  janmaNakshatraNameHin: string;
  janmaNakshatraNameGuj: string;
  kotaSwami: string; // Lord of Moon Sign
  kotaPala: string;  // Guard planet ruling entry gate
  pathPositions: Record<number, KotaPathPosition>; // Keyed by pathIndex (0..27)
  
  // Categorized 28 Nakshatras lists for dynamic table
  stambhaNakshatras: NakCategoryItem[];
  madhyaEntryNakshatras: NakCategoryItem[];
  madhyaExitNakshatras: NakCategoryItem[];
  prakaraEntryNakshatras: NakCategoryItem[];
  prakaraExitNakshatras: NakCategoryItem[];
  bahyaEntryNakshatras: NakCategoryItem[];
  bahyaExitNakshatras: NakCategoryItem[];

  birthPlanets: PlanetPositionInfo[];
  transitPlanets: PlanetPositionInfo[];

  fortProtectionRating: 'EXCELLENT' | 'GOOD' | 'VULNERABLE' | 'CRITICAL';
  lifeImpactCategory: LifeImpactCategory;
  lifeImpactTitle: { en: string; hi: string; gu: string };
  lifeImpactDesc: { en: string; hi: string; gu: string };
  stambhaColorHex: string;
  remedyText: { en: string; hi: string; gu: string };
  deepInsights: DeepKotaInsight[];
}

// Convert 27-nakshatra index (1..27) to 28-nakshatra index (1..28)
export function convert27to28NakshatraIndex(nak27Index: number): number {
  if (nak27Index <= 21) {
    return nak27Index;
  }
  return nak27Index + 1; // Skips Abhijit at #22
}

export function getTransitPlanetsForDate(transitDate: Date): PlanetPositionInfo[] {
  // Epoch baseline: Jan 1, 2026 00:00 UTC
  const epoch2026 = new Date(Date.UTC(2026, 0, 1, 0, 0, 0));
  const deltaDays = (transitDate.getTime() - epoch2026.getTime()) / (1000 * 60 * 60 * 24);

  // Mean motions & base longitudes (in degrees)
  const planetsData = [
    { key: 'Sun', nameEng: 'Sun', nameHin: 'सूर्य', nameGuj: 'સૂર્ય', symbol: '☉', shortCode: 'Su', baseLong: 256.0, rate: 0.9856, isBenefic: false },
    { key: 'Moon', nameEng: 'Moon', nameHin: 'चंद्र', nameGuj: 'ચંદ્ર', symbol: '☽', shortCode: 'Mo', baseLong: 35.0, rate: 13.1764, isBenefic: true },
    { key: 'Mars', nameEng: 'Mars', nameHin: 'मंगल', nameGuj: 'મંગળ', symbol: '♂', shortCode: 'Ma', baseLong: 210.0, rate: 0.5240, isBenefic: false },
    { key: 'Mercury', nameEng: 'Mercury', nameHin: 'बुध', nameGuj: 'બુધ', symbol: '☿', shortCode: 'Me', baseLong: 240.0, rate: 1.2000, isBenefic: true },
    { key: 'Jupiter', nameEng: 'Jupiter', nameHin: 'गुरु', nameGuj: 'ગુરુ', symbol: '♃', shortCode: 'Ju', baseLong: 65.0, rate: 0.0831, isBenefic: true },
    { key: 'Venus', nameEng: 'Venus', nameHin: 'शुक्र', nameGuj: 'શુક્ર', symbol: '♀', shortCode: 'Ve', baseLong: 270.0, rate: 1.2000, isBenefic: true },
    { key: 'Saturn', nameEng: 'Saturn', nameHin: 'शनि', nameGuj: 'શનિ', symbol: '♄', shortCode: 'Sa', baseLong: 332.0, rate: 0.0335, isBenefic: false },
    { key: 'Rahu', nameEng: 'Rahu', nameHin: 'राहु', nameGuj: 'રાહુ', symbol: '☊', shortCode: 'Ra', baseLong: 338.0, rate: -0.05295, isBenefic: false },
    { key: 'Ketu', nameEng: 'Ketu', nameHin: 'केतु', nameGuj: 'કેતુ', symbol: '☋', shortCode: 'Ke', baseLong: 158.0, rate: -0.05295, isBenefic: false },
  ];

  const RASHIS_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const NAK_LORDS = ['Ket', 'Ven', 'Sun', 'Moo', 'Mar', 'Rah', 'Jup', 'Sat', 'Mer'];

  return planetsData.map(p => {
    const long = ((p.baseLong + p.rate * deltaDays) % 360 + 360) % 360;
    const rashiIdx = Math.floor(long / 30);
    const degInSign = long % 30;
    const degInt = Math.floor(degInSign);
    const minInt = Math.floor((degInSign - degInt) * 60);
    const degreeStr = `${degInt.toString().padStart(2, '0')}:${minInt.toString().padStart(2, '0')}:00`;

    // 27 Nakshatra Index (1..27)
    const nak27Idx = Math.floor(long / (360 / 27)) + 1;
    const pada = Math.floor((long % (360 / 27)) / (360 / 108)) + 1;
    const nak28Idx = convert27to28NakshatraIndex(nak27Idx);

    const nakDetail = ALL_28_NAKSHATRAS[nak28Idx - 1];
    const nakLord = NAK_LORDS[(nak27Idx - 1) % 9];

    return {
      planetKey: p.key,
      nameEng: p.nameEng,
      nameHin: p.nameHin,
      nameGuj: p.nameGuj,
      symbol: p.symbol,
      shortCode: p.shortCode,
      signEng: RASHIS_EN[rashiIdx],
      degreeStr,
      nakshatra28Index: nak28Idx,
      nakshatraName: nakDetail.nameEng,
      pada,
      nakLord,
      isBenefic: p.isBenefic
    };
  });
}

export function calculateKotaChakra(
  janmaNakshatraIndex: number,
  moonSignLord: string = 'Moon',
  customBirthPlanets?: PlanetPositionInfo[],
  customTransitPlanets?: PlanetPositionInfo[]
): KotaChakraResult {
  const janma28Idx = Math.max(1, Math.min(28, janmaNakshatraIndex));
  const janmaNak = ALL_28_NAKSHATRAS[janma28Idx - 1];

  const kotaSwami = moonSignLord || 'Moon';
  const kotaPala = janmaNak.lord;

  // Build the 28 Rotated Path Positions (pathIndex 0 to 27)
  const pathPositions: Record<number, KotaPathPosition> = {};

  for (let k = 0; k <= 27; k++) {
    // Formula from prompt: displayNumber = ((startNumber - 1 + pathIndex) mod 28) + 1
    const displayNumber = ((janma28Idx - 1 + k) % 28) + 1;
    const nakDetail = ALL_28_NAKSHATRAS[displayNumber - 1];

    let zone: 'STAMBHA' | 'DURGANTARA' | 'PRAKARA' | 'BAHYA' = 'BAHYA';
    let isEntry = false;
    let pathName = 'Upper-Left Diagonal';

    // Zone & Direction assignments according to exact 28-Nakshatra Kota Chakra 8-path rules
    if (k === 3 || k === 10 || k === 17 || k === 24) {
      zone = 'STAMBHA';
    } else if ([2, 4, 9, 11, 16, 18, 23, 25].includes(k)) {
      zone = 'DURGANTARA'; // Madhya
    } else if ([1, 5, 8, 12, 15, 19, 22, 26].includes(k)) {
      zone = 'PRAKARA';
    } else {
      zone = 'BAHYA';
    }

    if (k >= 0 && k <= 2) {
      isEntry = true; pathName = 'Upper-Left Diagonal (Inward ↙)';
    } else if (k >= 3 && k <= 6) {
      isEntry = false; pathName = 'Upper Vertical (Outward ↑)';
    } else if (k >= 7 && k <= 9) {
      isEntry = true; pathName = 'Upper-Right Diagonal (Inward ↘)';
    } else if (k >= 10 && k <= 13) {
      isEntry = false; pathName = 'Right Horizontal (Outward →)';
    } else if (k >= 14 && k <= 16) {
      isEntry = true; pathName = 'Lower-Right Diagonal (Inward ↖)';
    } else if (k >= 17 && k <= 20) {
      isEntry = false; pathName = 'Lower Vertical (Outward ↓)';
    } else if (k >= 21 && k <= 23) {
      isEntry = true; pathName = 'Lower-Left Diagonal (Inward ↗)';
    } else if (k >= 24 && k <= 27) {
      isEntry = false; pathName = 'Left Horizontal (Outward ←)';
    }

    pathPositions[k] = {
      pathIndex: k,
      displayNumber,
      nakshatraNameEng: nakDetail.nameEng,
      nakshatraNameHin: nakDetail.nameHin,
      nakshatraNameGuj: nakDetail.nameGuj,
      zone,
      isEntry,
      pathName,
      natalPlanets: [],
      transitPlanets: []
    };
  }

  // Use custom birth planets from loaded profile if provided, else fallback to sample birth planets
  const birthPlanets: PlanetPositionInfo[] = (customBirthPlanets && customBirthPlanets.length > 0)
    ? customBirthPlanets
    : [
        { planetKey: 'Ascendant', nameEng: 'Ascendant', nameHin: 'लग्न', nameGuj: 'લગ્ન', symbol: 'Asc', shortCode: 'Asc', signEng: 'Aries', degreeStr: '22:59:36', nakshatra28Index: ((janma28Idx + 12) % 28) || 1, nakshatraName: ALL_28_NAKSHATRAS[((janma28Idx + 12) % 28) || 0].nameEng, pada: 3, nakLord: 'Ven', isBenefic: true },
        { planetKey: 'Sun', nameEng: 'Sun', nameHin: 'सूर्य', nameGuj: 'સૂર્ય', symbol: '☉', shortCode: 'Su', signEng: 'Pisces', degreeStr: '13:29:53', nakshatra28Index: ((janma28Idx + 11) % 28) || 1, nakshatraName: ALL_28_NAKSHATRAS[((janma28Idx + 11) % 28) || 0].nameEng, pada: 3, nakLord: 'Jup', isBenefic: false },
        { planetKey: 'Moon', nameEng: 'Moon', nameHin: 'चंद्र', nameGuj: 'ચંદ્ર', symbol: '☽', shortCode: 'Mo', signEng: 'Libra', degreeStr: '26:55:17', nakshatra28Index: janma28Idx, nakshatraName: janmaNak.nameEng, pada: 3, nakLord: 'Jup', isBenefic: true },
        { planetKey: 'Mars', nameEng: 'Mars', nameHin: 'मंगल', nameGuj: 'મંગળ', symbol: '♂', shortCode: 'Ma', signEng: 'Cancer', degreeStr: '02:17:34', nakshatra28Index: ((janma28Idx + 19) % 28) || 1, nakshatraName: ALL_28_NAKSHATRAS[((janma28Idx + 19) % 28) || 0].nameEng, pada: 4, nakLord: 'Jup', isBenefic: false },
        { planetKey: 'Mercury', nameEng: 'Mercury', nameHin: 'बुध', nameGuj: 'બુધ', symbol: '☿', shortCode: 'Me', signEng: 'Aries', degreeStr: '01:17:26', nakshatra28Index: ((janma28Idx + 13) % 28) || 1, nakshatraName: ALL_28_NAKSHATRAS[((janma28Idx + 13) % 28) || 0].nameEng, pada: 1, nakLord: 'Ket', isBenefic: true },
        { planetKey: 'Jupiter', nameEng: 'Jupiter', nameHin: 'गुरु', nameGuj: 'ગુરુ', symbol: '♃', shortCode: 'Ju', signEng: 'Gemini', degreeStr: '04:33:55', nakshatra28Index: ((janma28Idx + 16) % 28) || 1, nakshatraName: ALL_28_NAKSHATRAS[((janma28Idx + 16) % 28) || 0].nameEng, pada: 4, nakLord: 'Mar', isBenefic: true },
        { planetKey: 'Venus', nameEng: 'Venus', nameHin: 'शुक्र', nameGuj: 'શુક્ર', symbol: '♀', shortCode: 'Ve', signEng: 'Pisces', degreeStr: '29:17:55', nakshatra28Index: ((janma28Idx + 12) % 28) || 1, nakshatraName: ALL_28_NAKSHATRAS[((janma28Idx + 12) % 28) || 0].nameEng, pada: 4, nakLord: 'Sat', isBenefic: true },
        { planetKey: 'Saturn', nameEng: 'Saturn', nameHin: 'शनि', nameGuj: 'શનિ', symbol: '♄', shortCode: 'Sa', signEng: 'Leo', degreeStr: '00:48:04', nakshatra28Index: ((janma28Idx + 22) % 28) || 1, nakshatraName: ALL_28_NAKSHATRAS[((janma28Idx + 22) % 28) || 0].nameEng, pada: 1, nakLord: 'Ket', isBenefic: false },
        { planetKey: 'Rahu', nameEng: 'Rahu', nameHin: 'राहु', nameGuj: 'રાહુ', symbol: '☊', shortCode: 'Ra', signEng: 'Virgo', degreeStr: '12:26:32', nakshatra28Index: ((janma28Idx + 25) % 28) || 1, nakshatraName: ALL_28_NAKSHATRAS[((janma28Idx + 25) % 28) || 0].nameEng, pada: 1, nakLord: 'Moo', isBenefic: false },
        { planetKey: 'Ketu', nameEng: 'Ketu', nameHin: 'केतु', nameGuj: 'કેતુ', symbol: '☋', shortCode: 'Ke', signEng: 'Pisces', degreeStr: '12:26:32', nakshatra28Index: ((janma28Idx + 11) % 28) || 1, nakshatraName: ALL_28_NAKSHATRAS[((janma28Idx + 11) % 28) || 0].nameEng, pada: 4, nakLord: 'Jup', isBenefic: false }
      ];

  // Transit Planets (Red markers - computed dynamically for selected date or fallback)
  const transitPlanets: PlanetPositionInfo[] = (customTransitPlanets && customTransitPlanets.length > 0)
    ? customTransitPlanets
    : getTransitPlanetsForDate(new Date());

  // Assign planets to dynamic path positions (k = 0..27)
  birthPlanets.forEach(bp => {
    const k = (bp.nakshatra28Index - janma28Idx + 28) % 28;
    if (pathPositions[k]) {
      pathPositions[k].natalPlanets.push(bp);
    }
  });

  transitPlanets.forEach(tp => {
    const k = (tp.nakshatra28Index - janma28Idx + 28) % 28;
    if (pathPositions[k]) {
      pathPositions[k].transitPlanets.push(tp);
    }
  });

  // Helper for Category items
  const formatCategoryItem = (k: number): NakCategoryItem => {
    const pos = pathPositions[k];
    return {
      pathIndex: k,
      displayNumber: pos.displayNumber,
      nameEng: pos.nakshatraNameEng,
      nameHin: pos.nakshatraNameHin,
      nameGuj: pos.nakshatraNameGuj
    };
  };

  const stambhaNakshatras = [formatCategoryItem(3), formatCategoryItem(10), formatCategoryItem(17), formatCategoryItem(24)];
  const madhyaEntryNakshatras = [formatCategoryItem(2), formatCategoryItem(9), formatCategoryItem(16), formatCategoryItem(23)];
  const madhyaExitNakshatras = [formatCategoryItem(4), formatCategoryItem(11), formatCategoryItem(18), formatCategoryItem(25)];
  const prakaraEntryNakshatras = [formatCategoryItem(1), formatCategoryItem(8), formatCategoryItem(15), formatCategoryItem(22)];
  const prakaraExitNakshatras = [formatCategoryItem(5), formatCategoryItem(12), formatCategoryItem(19), formatCategoryItem(26)];
  const bahyaEntryNakshatras = [formatCategoryItem(0), formatCategoryItem(7), formatCategoryItem(14), formatCategoryItem(21)];
  const bahyaExitNakshatras = [formatCategoryItem(6), formatCategoryItem(13), formatCategoryItem(20), formatCategoryItem(27)];

  // Evaluate Protection Rating & Life Impact
  const stambhaTransits = [pathPositions[3], pathPositions[10], pathPositions[17], pathPositions[24]].flatMap(pos => pos.transitPlanets);
  const maleficsInStambha = stambhaTransits.filter(p => !p.isBenefic).length;
  const beneficsInStambha = stambhaTransits.filter(p => p.isBenefic).length;
  const maleficsInMadhyaEntry = [pathPositions[2], pathPositions[9], pathPositions[16], pathPositions[23]].flatMap(pos => pos.transitPlanets).filter(p => !p.isBenefic).length;

  let fortProtectionRating: 'EXCELLENT' | 'GOOD' | 'VULNERABLE' | 'CRITICAL' = 'GOOD';
  let lifeImpactCategory: LifeImpactCategory = 'MIXED';
  let stambhaColorHex = '#EF6C00';

  if (maleficsInStambha > 0 || maleficsInMadhyaEntry >= 2) {
    fortProtectionRating = 'CRITICAL';
    lifeImpactCategory = 'INAUSPICIOUS';
    stambhaColorHex = '#C62828';
  } else if (maleficsInMadhyaEntry === 1 && beneficsInStambha === 0) {
    fortProtectionRating = 'VULNERABLE';
    lifeImpactCategory = 'MIXED';
    stambhaColorHex = '#EF6C00';
  } else if (beneficsInStambha > 0 && maleficsInStambha === 0) {
    fortProtectionRating = 'EXCELLENT';
    lifeImpactCategory = 'AUSPICIOUS';
    stambhaColorHex = '#2E7D32';
  }

  const titleMap = {
    AUSPICIOUS: {
      en: '🟢 Auspicious Protection (Fortress Safe & Prosperous)',
      hi: '🟢 शुभ सुरक्षा (दुर्ग सुरक्षित एवं मंगलकारी)',
      gu: '🟢 શુભ સુરક્ષા (કિલ્લો સુરક્ષિત અને કલ્યાણકારી)'
    },
    MIXED: {
      en: '🟠 Mixed Transit Status (Moderate Fort Defense)',
      hi: '🟠 मिश्रित गोचर स्थिति (मध्यम दुर्ग रक्षा)',
      gu: '🟠 મિશ્ર ગોચર સ્થિતિ (મધ્યમ કિલ્લા રક્ષણ)'
    },
    INAUSPICIOUS: {
      en: '🔴 Inauspicious Alert (Malefic Siege in Inner Fort)',
      hi: '🔴 अशुभ चेतावनी (आंतरिक दुर्ग में क्रूर ग्रह प्रवेश)',
      gu: '🔴 અશુભ ચેતવણી (આંતરિક કિલ્લામાં ક્રૂર ગ્રહ પ્રવેશ)'
    }
  };

  const descMap = {
    AUSPICIOUS: {
      en: 'Benefic planets or Kota Swami protect the central Stambha pillar. Excellent stability for career, health, and peace of mind.',
      hi: 'सौम्य ग्रह या कोटा स्वामी केंद्रीय स्तंभ की रक्षा कर रहे हैं। स्वास्थ्य, करियर और मानसिक शांति के लिए उत्तम सुरक्षा।',
      gu: 'સૌમ્ય ગ્રહો અથવા કોટા સ્વામી કેન્દ્રીય સ્તંભનું રક્ષણ કરી રહ્યા છે. આરોગ્ય અને કારકિર્દી માટે ઉત્તમ સુરક્ષા.'
    },
    MIXED: {
      en: 'Balanced transit forces detected. Malefics are either exiting or neutralized by protective benefics. Maintain balanced focus.',
      hi: 'ग्रह बल संतुलित हैं। क्रूर ग्रह बाहर निकल रहे हैं या सौम्य ग्रहों द्वारा नियंत्रित हैं। कार्य में संयम बनाए रखें।',
      gu: 'ગ્રહ બળ સંતુલિત છે. ક્રૂર ગ્રહો બહાર નીકળી રહ્યા છે અથવા સૌમ્ય ગ્રહો દ્વારા નિયંત્રિત છે. સંયમ જાળવો.'
    },
    INAUSPICIOUS: {
      en: 'Malefic planets (Saturn/Mars/Rahu/Sun) are transiting Stambha or inner Madhya entry pathways. Heightened risk of health distress, litigation, financial loss, or career obstacles.',
      hi: 'क्रूर ग्रह (शनि/मंगल/राहु/सूर्य) स्तंभ या दुर्गांतर प्रवेश मार्ग में गोचर कर रहे हैं। स्वास्थ्य कष्ट, विवाद, आर्थिक हानि या अचानक बाधाओं की संभावना।',
      gu: 'ક્રૂર ગ્રહો (શનિ/મંગળ/રાહુ/સૂર્ય) સ્તંભ અથવા દુર્ગાંતર પ્રવેશ માર્ગમાં ગોચર કરી રહ્યા છે. આરોગ્ય તકલીફ અથવા આર્થિક નુકસાનની શક્યતા.'
    }
  };

  const remedyMap = {
    AUSPICIOUS: {
      en: 'Offer daily prayers to Kota Swami for sustained prosperity and strength.',
      hi: 'सतत समृद्धि हेतु कोटा स्वामी एवं इष्ट देव की उपासना करें।',
      gu: 'સતત સમૃદ્ધિ માટે કોટા સ્વામી અને ઈષ્ટ દેવની ઉપાસના કરો.'
    },
    MIXED: {
      en: 'Recite Hanuman Chalisa daily and maintain steady focus during transit shifts.',
      hi: 'हनुमान चालीसा का पाठ करें एवं गोचर अवधि में संयम रखें।',
      gu: 'હનુમાન ચાલીસાનો પાઠ કરો અને સંયમ જાળવો.'
    },
    INAUSPICIOUS: {
      en: '⚡ Recommended Remedy: Recite Maha Mrityunjaya Mantra & Hanuman Chalisa daily. Offer Surya Arghya and chant Vishnu Sahasranama to pacify malefic transit affliction.',
      hi: '⚡ निवारण उपाय: प्रतिदिन महामृत्युंजय मंत्र एवं हनुमान चालीसा का पाठ करें। सूर्य अर्घ्य दें एवं विष्णु सहस्रनाम का जप करें।',
      gu: '⚡ નિવારણ ઉપાય: દરરોજ મહામૃત્યુંજય મંત્ર અને હનુમાન ચાલીસાનો પાઠ કરો. સૂર્યને અર્ઘ્ય આપો અને વિષ્ણુ સહસ્ત્રનામનો પાઠ કરો.'
    }
  };

  const deepInsights = generateDeepKotaInsights(pathPositions, transitPlanets);

  return {
    janmaNakshatra27Index: janma28Idx,
    janmaNakshatra28Index: janma28Idx,
    janmaNakshatraNameEng: janmaNak.nameEng,
    janmaNakshatraNameHin: janmaNak.nameHin,
    janmaNakshatraNameGuj: janmaNak.nameGuj,
    kotaSwami,
    kotaPala,
    pathPositions,
    stambhaNakshatras,
    madhyaEntryNakshatras,
    madhyaExitNakshatras,
    prakaraEntryNakshatras,
    prakaraExitNakshatras,
    bahyaEntryNakshatras,
    bahyaExitNakshatras,
    birthPlanets,
    transitPlanets,
    fortProtectionRating,
    lifeImpactCategory,
    lifeImpactTitle: titleMap[lifeImpactCategory],
    lifeImpactDesc: descMap[lifeImpactCategory],
    stambhaColorHex,
    remedyText: remedyMap[lifeImpactCategory],
    deepInsights
  };
}

export function generateDeepKotaInsights(
  pathPositions: Record<number, KotaPathPosition>,
  transitPlanets: PlanetPositionInfo[]
): DeepKotaInsight[] {
  const insights: DeepKotaInsight[] = [];

  // Find transit locations
  const moonPath = Object.values(pathPositions).find(p => p.transitPlanets.some(tp => tp.planetKey === 'Moon'));
  const ketuPath = Object.values(pathPositions).find(p => p.transitPlanets.some(tp => tp.planetKey === 'Ketu'));
  const saturnPath = Object.values(pathPositions).find(p => p.transitPlanets.some(tp => tp.planetKey === 'Saturn'));
  const marsPath = Object.values(pathPositions).find(p => p.transitPlanets.some(tp => tp.planetKey === 'Mars'));
  const rahuPath = Object.values(pathPositions).find(p => p.transitPlanets.some(tp => tp.planetKey === 'Rahu'));
  const jupiterPath = Object.values(pathPositions).find(p => p.transitPlanets.some(tp => tp.planetKey === 'Jupiter'));
  const sunPath = Object.values(pathPositions).find(p => p.transitPlanets.some(tp => tp.planetKey === 'Sun'));

  // 1. Moon in Stambha / Madhya (Mind & Mother's Health Impact)
  if (moonPath && (moonPath.zone === 'STAMBHA' || moonPath.zone === 'DURGANTARA')) {
    const isStambha = moonPath.zone === 'STAMBHA';
    insights.push({
      id: 'MOON_TRANSIT_CORE',
      category: 'MOON_MOTHER',
      icon: '🌙',
      severity: isStambha ? 'HIGH_ALERT' : 'WARNING',
      title: {
        en: isStambha ? '🌙 Moon in Stambha Core (Mind & Mother\'s Health Impact)' : '🌙 Moon in Madhya Inner Fort (Emotional Sensitivity)',
        hi: isStambha ? '🌙 चंद्रमा स्तंभ केंद्र में (मन एवं माताजी के स्वास्थ्य पर प्रभाव)' : '🌙 चंद्रमा मध्य दुर्ग में (भावनात्मक संवेदनशीलता)',
        gu: isStambha ? '🌙 ચંદ્ર સ્તંભ કેન્દ્રમાં (મન અને માતાજીના સ્વાસ્થ્ય પર અસર)' : '🌙 ચંદ્ર મધ્ય કિલ્લામાં (ભાવનાત્મક સંવેદનશીલતા)'
      },
      description: {
        en: `The Transit Moon is transiting the ${isStambha ? 'central Stambha pillar' : 'inner Madhya ring'} of your fort (${moonPath.nakshatraNameEng} Nakshatra). Moon governs the Mind, Emotions, Peace of Mind, Domestic Life, and Mother. During this transit, you may experience heightened emotional sensitivity, mood shifts, sleep disturbances, or health/emotional concerns regarding your Mother.`,
        hi: `गोचर चंद्रमा आपके दुर्ग के ${isStambha ? 'केंद्रीय स्तंभ' : 'आंतरिक मध्य क्षेत्र'} (${moonPath.nakshatraNameEng} नक्षत्र) में स्थित है। चंद्रमा मन, भावनाओं, मानसिक शांति, घरेलू सुख और माताजी का कारक है। इस गोचर में भावनात्मक संवेदनशीलता, अनिद्रा या माताजी के स्वास्थ्य से जुड़ी चिंताएं हो सकती हैं।`,
        gu: `ગોચર ચંદ્ર તમારા કિલ્લાના ${isStambha ? 'કેન્દ્રીય સ્તંભ' : 'આંતરિક મધ્ય વિસ્તાર'} (${moonPath.nakshatraNameEng} નક્ષત્ર) માં સ્થિત છે. ચંદ્ર મન, લાગણીઓ, માનસિક શાંતિ, ઘરેલું સુખ અને માતાજીનો કારક છે. આ ગોચરમાં ભાવનાત્મક સંવેદનશીલતા, મનની અશાંતિ અથવા માતાજીના સ્વાસ્થ્ય સંબંધિત ચિંતા થઈ શકે છે.`
      }
    });
  }

  // 2. Chandra-Ketu Affliction (Moon + Ketu Conjunction or Adjacent Pathways)
  if (moonPath && ketuPath) {
    const distance = Math.abs(moonPath.pathIndex - ketuPath.pathIndex);
    const isClose = distance <= 2 || distance >= 26;
    const isInnerFort = (moonPath.zone === 'STAMBHA' || moonPath.zone === 'DURGANTARA') || (ketuPath.zone === 'STAMBHA' || ketuPath.zone === 'DURGANTARA');

    if (isClose && isInnerFort) {
      insights.push({
        id: 'CHANDRA_KETU_GRAHAN',
        category: 'MOON_MOTHER',
        icon: '🌫️',
        severity: 'HIGH_ALERT',
        title: {
          en: '🌫️ Chandra-Ketu Affliction (Mental Isolation & Mother\'s Health Concern)',
          hi: '🌫️ चंद्र-केतु ग्रहण दोष (मानसिक अशांति एवं माताजी के स्वास्थ्य का कष्ट)',
          gu: '🌫️ ચંદ્ર-કેતુ ગ્રહણ દોષ (માનસિક અશાંતિ અને માતાજીના સ્વાસ્થ્યની ચિંતા)'
        },
        description: {
          en: `Moon is severely afflicted by Ketu in the inner fort pathways (${moonPath.nakshatraNameEng} & ${ketuPath.nakshatraNameEng}). This creates Chandra-Ketu Grahan energy, leading to sudden emotional detachment, deep anxiety, sleep disturbances, and potential health strain or emotional misunderstandings with your Mother.`,
          hi: `आंतरिक दुर्ग मार्ग में चंद्रमा पर केतु का सीधा प्रभाव है (${moonPath.nakshatraNameEng} एवं ${ketuPath.nakshatraNameEng})। यह चंद्र-केतु ग्रहण योग बनाता है, जिससे अचानक मानसिक तनाव, अकेलापन, अनिद्रा और माताजी के स्वास्थ्य में उतार-चढ़ाव या वैचारिक मतभेद हो सकते हैं।`,
          gu: `આંતરિક કિલ્લા માર્ગમાં ચંદ્ર પર કેતુનો સીધો પ્રભાવ છે (${moonPath.nakshatraNameEng} અને ${ketuPath.nakshatraNameEng}). આ ચંદ્ર-કેતુ ગ્રહણ યોગ બનાવે છે, જેનાથી અચાનક માનસિક ચિંતા, એકલવાયાપણું, અનિદ્રા અને માતાજીના સ્વાસ્થ્યમાં ઉતાર-ચઢાવ અથવા મતભેદ થઈ શકે છે.`
        }
      });
    }
  }

  // 3. Chandra-Saturn / Shani Affliction (Moon + Saturn in Inner Fort)
  if (moonPath && saturnPath) {
    const distance = Math.abs(moonPath.pathIndex - saturnPath.pathIndex);
    const isClose = distance <= 2 || distance >= 26;
    if (isClose || (saturnPath.zone === 'STAMBHA' && moonPath.zone === 'STAMBHA')) {
      insights.push({
        id: 'CHANDRA_SHANI_AFFLICTION',
        category: 'MIND_EMOTION',
        icon: '🪐',
        severity: 'WARNING',
        title: {
          en: '🪐 Chandra-Shani Transit Affliction (Heavy Heart & Domestic Delays)',
          hi: '🪐 चंद्र-शनि विष योग (उदासीनता एवं घरेलू तनाव)',
          gu: '🪐 ચંદ્ર-શનિ વિષ પ્રભાવ (ઉદાસીનતા અને કૌટુંબિક તણાવ)'
        },
        description: {
          en: `Saturn's cold restrictive energy afflicts the Moon in the fort. This brings feelings of heavy emotional responsibility, melancholy, delayed peace, and extra care needed for Mother's health and domestic comfort.`,
          hi: `चंद्रमा पर शनि का प्रभाव है। इससे मानसिक भारीपन, निराशा, कार्य में विलंब और माताजी के स्वास्थ्य व गृह शांति के लिए विशेष देखभाल की आवश्यकता होती है।`,
          gu: `ચંદ્ર પર શનિનો ગોચર પ્રભાવ છે. તેનાથી માનસિક ઉદાસીનતા, વિલંબ અને માતાજીના સ્વાસ્થ્ય તથા ઘરની શાંતિ માટે વિશેષ સંભાળની જરૂર રહે છે.`
        }
      });
    }
  }

  // 4. Chandra-Mars Affliction (Moon + Mars)
  if (moonPath && marsPath) {
    const distance = Math.abs(moonPath.pathIndex - marsPath.pathIndex);
    const isClose = distance <= 2 || distance >= 26;
    if (isClose && (moonPath.zone === 'STAMBHA' || marsPath.zone === 'STAMBHA')) {
      insights.push({
        id: 'CHANDRA_MARS_AFFLICTION',
        category: 'MIND_EMOTION',
        icon: '🔴',
        severity: 'WARNING',
        title: {
          en: '🔴 Chandra-Mangala Fire Transit (Emotional Outbursts & Family Friction)',
          hi: '🔴 चंद्र-मंगल उग्र योग (क्रोध एवं पारिवारिक कहासुनी)',
          gu: '🔴 ચંદ્ર-મંગળ ઉગ્ર પ્રભાવ (ગુસ્સો અને કૌટુંબિક ચર્ચા)'
        },
        description: {
          en: `Mars adds aggressive fire to the Moon's liquid energy. Guard against sudden anger, impulsive reactions, arguments with family/Mother, or blood-pressure fluctuations.`,
          hi: `मंगल चंद्रमा को उग्रता देता है। क्रोध, जल्दबाजी में निर्णय, माताजी या परिवार के साथ कहासुनी और रक्तचाप/मानसिक उत्तेजना से बचें।`,
          gu: `મંગળ ચંદ્રને ઉગ્રતા આપે છે. ગુસ્સો, ઉતાવળા નિર્ણયો, માતાજી અથવા પરિવાર સાથે ચર્ચા-વિચારણામાં સંયમ રાખો.`
        }
      });
    }
  }

  // 5. Malefic Fort Siege (Mars / Saturn / Rahu / Sun in Stambha or Inner Entry)
  const maleficsInCore = [saturnPath, marsPath, rahuPath, sunPath].filter(p => p && (p.zone === 'STAMBHA' || (p.zone === 'DURGANTARA' && p.isEntry)));
  if (maleficsInCore.length > 0) {
    insights.push({
      id: 'MALEFIC_FORT_SIEGE',
      category: 'MALEFIC_SIEGE',
      icon: '⚔️',
      severity: 'HIGH_ALERT',
      title: {
        en: '⚔️ Malefic Fort Siege (Workplace, Legal & Health Risk)',
        hi: '⚔️ क्रूर ग्रह दुर्ग घेराबंदी (कार्यक्षेत्र, कानूनी व स्वास्थ्य जोखिम)',
        gu: '⚔️ ક્રૂર ગ્રહ કિલ્લા ઘેરાબંધી (કારકિર્દી અને આરોગ્ય જોખમ)'
      },
      description: {
        en: 'Malefic planets (Saturn/Mars/Rahu/Sun) are transiting Stambha or inner Madhya entry pathways. Heightened risk of health distress, litigation, financial loss, or career obstacles. Practice defensive caution.',
        hi: 'क्रूर ग्रह (शनि/मंगल/राहु/सूर्य) स्तंभ या दुर्गांतर प्रवेश मार्ग में गोचर कर रहे हैं। स्वास्थ्य कष्ट, विवाद, आर्थिक हानि या अचानक बाधाओं की संभावना। सावधान रहें।',
        gu: 'ક્રૂર ગ્રહો (શનિ/મંગળ/રાહુ/સૂર્ય) સ્તંભ અથવા દુર્ગાંતર પ્રવેશ માર્ગમાં ગોચર કરી રહ્યા છે. આરોગ્ય તકલીફ અથવા આર્થિક નુકસાનની શક્યતા. સાવચેત રહો.'
      }
    });
  }

  // 6. Benefic Divine Protection Shield (Jupiter in Fort)
  if (jupiterPath && (jupiterPath.zone === 'STAMBHA' || jupiterPath.zone === 'DURGANTARA' || jupiterPath.zone === 'PRAKARA')) {
    insights.push({
      id: 'JUPITER_DIVINE_SHIELD',
      category: 'BENEFIC_PROTECTION',
      icon: '🟢',
      severity: 'AUSPICIOUS',
      title: {
        en: '🟢 Benefic Divine Shield (Jupiter Protection & Peace)',
        hi: '🟢 गुरु शुभ दिव्य कवच (ईश्वरीय रक्षा एवं शांति)',
        gu: '🟢 ગુરુ શુભ દિવ્ય કવચ (ઈશ્વરીય રક્ષણ અને શાંતિ)'
      },
      description: {
        en: `Jupiter (Brihaspati) is transiting your fort (${jupiterPath.nakshatraNameEng} Nakshatra), providing divine wisdom, protection for Mother & family, financial stability, and inner peace.`,
        hi: `गुरु आपके दुर्ग (${jupiterPath.nakshatraNameEng} नक्षत्र) में गोचर कर रहे हैं, जो माताजी एवं परिवार के लिए सुरक्षा, विवेक, आर्थिक स्थिरता और शांति प्रदान कर रहे हैं।`,
        gu: `ગુરુ તમારા કિલ્લામાં (${jupiterPath.nakshatraNameEng} નક્ષત્ર) ગોચર કરી રહ્યા છે, જે માતાજી અને પરિવાર માટે સુરક્ષા, વિવેક અને શાંતિ પ્રદાન કરી રહ્યા છે.`
      }
    });
  }

  // Fallback insight if no major afflictions
  if (insights.length === 0) {
    insights.push({
      id: 'BALANCED_STABILITY',
      category: 'HEALTH_CAREER',
      icon: '⚖️',
      severity: 'INFO',
      title: {
        en: '⚖️ Balanced Transit Energies (Normal Stability)',
        hi: '⚖️ संतुलित गोचर ऊर्जा (सामान्य स्थिरता)',
        gu: '⚖️ સંતુલિત ગોચર ઊર્જા (સામાન્ય સ્થિરતા)'
      },
      description: {
        en: 'No major malefic siege or inner fort afflictions detected for this date. Planetary energies remain balanced for routine activities and peace of mind.',
        hi: 'इस तिथि के लिए कोई बड़ा क्रूर ग्रह दबाव या आंतरिक दोष नहीं है। दैनिक गतिविधियों और मानसिक शांति के लिए ग्रह स्थिति संतुलित है।',
        gu: 'આ તારીખ માટે કોઈ મોટો ક્રૂર ગ્રહ દબાણ કે આંતરિક દોષ નથી. રોજિંદી પ્રવૃત્તિઓ અને માનસિક શાંતિ માટે ગ્રહ સ્થિતિ સંતુલિત છે.'
      }
    });
  }

  return insights;
}
