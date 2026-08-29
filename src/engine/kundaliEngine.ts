export interface PlanetDetail {
  name: string;
  hindiName: string;
  symbol: string;
  rashiIndex: number; // 0 = Aries, 11 = Pisces
  rashiName: string;
  rashiHindi: string;
  degreeStr: string;
  totalDegrees: number;
  isRetrograde: boolean;
  nakshatraName: string;
  pada: number;
  house: number; // 1 to 12
}

export interface BirthPanchangParticulars {
  bornTithi: string;
  bornPaksha: string;
  bornNakshatra: string;
  bornPada: number;
  bornYoga: string;
  bornKarana: string;
  bornVaara: string;
  varna: string;
  vashya: string;
  yoni: string;
  gana: string;
  nadi: string;
  paya: string;
}

export interface WesternNatalData {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  sunElement: 'Fire' | 'Earth' | 'Air' | 'Water';
  sunModality: 'Cardinal' | 'Fixed' | 'Mutable';
  majorAspects: { p1: string; p2: string; aspectName: string; angle: string }[];
}

export interface RussianCosmogramData {
  lunarDayNumber: number; // 1-30
  lunarDayMeaning: string;
  dominantElement: string;
  cosmicRuler: string;
}

export interface ThaiSuryayatraData {
  lakkhanaRashi: string;
  naksatraName: string;
  pada: number;
  bhava12: { bhavaName: string; rashiName: string }[];
}

export interface IndonesianPawukonData {
  wukuName: string;
  wukuDeity: string;
  triwara: string;
  sadwara: string;
  saptawara: string;
}

export interface HouseDetail {
  houseNumber: number;
  rashiName: string;
  rashiHindi: string;
  rashiLord: string;
  planets: string[];
  significations: string;
}

export interface KundaliDivisionalChart {
  chartType: 'D1' | 'MOON' | 'SUN' | 'D2' | 'D9' | 'D10' | 'WESTERN' | 'RUSSIAN' | 'THAI' | 'INDONESIAN';
  title: string;
  hindiTitle: string;
  houses: { houseNumber: number; rashiName: string; planets: string[] }[];
}

export interface KundaliResult {
  birthInfo: {
    name: string;
    dobStr: string;
    tobStr: string;
    city: string;
    lat: number;
    lng: number;
  };
  lagnaRashi: string;
  lagnaDegree: string;
  planets: PlanetDetail[];
  particulars: BirthPanchangParticulars;
  westernNatal: WesternNatalData;
  russianCosmogram: RussianCosmogramData;
  thaiSuryayatra: ThaiSuryayatraData;
  indonesianPawukon: IndonesianPawukonData;
  divisionalCharts: Record<string, KundaliDivisionalChart>;
  houseDetails: HouseDetail[];
}

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

const RASHI_LORDS = [
  'Mars (Mangala)', 'Venus (Shukra)', 'Mercury (Budha)', 'Moon (Chandra)',
  'Sun (Surya)', 'Mercury (Budha)', 'Venus (Shukra)', 'Mars (Mangala)',
  'Jupiter (Brihaspati)', 'Saturn (Shani)', 'Saturn (Shani)', 'Jupiter (Brihaspati)'
];

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const THAI_BHAVA_NAMES = [
  'ตนุ (Tanuk - Self)', 'กดุมภะ (Kadumbha - Wealth)', 'สหัชชะ (Sahajja - Siblings)',
  'พันธุ์ (Bhandhu - Home/Mother)', 'ปุตตะ (Putta - Children)', 'อริ (Ari - Obstacles)',
  'ปัตนิ (Patni - Spouse)', 'มรณะ (Marana - Longevity)', 'ศุภะ (Subha - Fortune)',
  'กัมมะ (Kamma - Action/Career)', 'ลาภะ (Labha - Gains)', 'วินาศ (Vinasa - Loss)'
];

const INDONESIAN_WUKU_NAMES = [
  'Sinta', 'Landep', 'Ukir', 'Kulantir', 'Tolu', 'Gumbreg', 'Wariga', 'Warigade',
  'Julungwangi', 'Sungsang', 'Dungulan', 'Kuningan', 'Langkir', 'Medangsia', 'Pujut',
  'Pahang', 'Krulut', 'Merrakih', 'Tambir', 'Medangkungan', 'Matal', 'Uye', 'Menail',
  'Prangbakat', 'Bala', 'Ugu', 'Wayang', 'Kulawu', 'Dukut', 'Watugunung'
];

const VARNA_MAP = ['Kshatriya', 'Vaishya', 'Shudra', 'Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Brahmin', 'Brahmin', 'Kshatriya', 'Vaishya', 'Shudra'];
const VASHYA_MAP = ['Quadruped (Chatushpada)', 'Quadruped', 'Human (Dwipada)', 'Watery (Jalachara)', 'Wild (Vanachara)', 'Human', 'Human', 'Insect (Keeta)', 'Human', 'Watery', 'Human', 'Watery'];
const GANA_MAP = ['Deva', 'Manushya', 'Rakshasa', 'Manushya', 'Deva', 'Helpless', 'Deva', 'Deva', 'Rakshasa', 'Rakshasa', 'Manushya', 'Manushya', 'Deva', 'Rakshasa', 'Deva', 'Rakshasa', 'Deva', 'Rakshasa', 'Rakshasa', 'Manushya', 'Manushya', 'Deva', 'Rakshasa', 'Rakshasa', 'Manushya', 'Uttara', 'Deva'];
const NADI_MAP = ['Adi (Begin)', 'Madhya (Middle)', 'Antya (End)', 'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya', 'Adi', 'Madhya', 'Antya', 'Adi', 'Madhya', 'Antya', 'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya', 'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya'];

const HOUSE_SIGNIFICATIONS = [
  'Self, Physical Appearance, Health, Character, Vitality',
  'Wealth, Family, Speech, Assets, Eyesight',
  'Courage, Siblings, Communication, Short Journeys, Skill',
  'Mother, Home, Land, Vehicles, Mind & Happiness',
  'Children, Education, Intelligence, Creativity, Speculation',
  'Health, Debts, Enemies, Service, Daily Work Routines',
  'Spouse, Marriage, Business Partnerships, Public Image',
  'Longevity, Transformation, Occult, Research, Unexpected Gains',
  'Dharma, Fortune, Higher Learning, Father, Spiritual Journeys',
  'Career, Profession, Fame, Social Status, Leadership',
  'Income, Gains, Elders, Friendships, Fulfilling Desires',
  'Moksha, Losses, Foreign Lands, Expenses, Spiritual Retreat'
];

export function calculateBirthKundali(
  name: string,
  dob: Date,
  tobHours: number,
  tobMinutes: number,
  cityName: string,
  lat: number,
  lng: number
): KundaliResult {
  const dayOfYear = Math.floor((dob.getTime() - new Date(dob.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const timeInFraction = (tobHours + tobMinutes / 60) / 24;

  // Approximate Ascendant (Lagna) Rashi Index (0-11)
  const lagnaRashiIndex = Math.floor((dayOfYear * 12 / 365 + timeInFraction * 12 + lng / 15) % 12);
  const lagnaDegreeVal = Math.floor((tobMinutes * 60 + timeInFraction * 100) % 30);
  const lagnaDegreeStr = `${lagnaDegreeVal}° ${(lagnaDegreeVal * 17) % 60}'`;

  // Calculate positions for 9 Planets
  const planetBaseOffsets = [0, 4, 2, 0.5, 9, 1, 10, 8, 2];
  const planetSymbols = ['☀️', '🌙', '♂️', '☿', '♃', '♀', '♄', '☊', '☋'];
  const planetNames = [
    { en: 'Surya (Sun)', hi: 'सूर्य' },
    { en: 'Chandra (Moon)', hi: 'चंद्र' },
    { en: 'Mangala (Mars)', hi: 'मंगल' },
    { en: 'Budha (Mercury)', hi: 'बुध' },
    { en: 'Brihaspati (Jupiter)', hi: 'गुरु' },
    { en: 'Shukra (Venus)', hi: 'शुक्र' },
    { en: 'Shani (Saturn)', hi: 'शनि' },
    { en: 'Rahu', hi: 'राहु' },
    { en: 'Ketu', hi: 'केतु' }
  ];

  const planets: PlanetDetail[] = planetBaseOffsets.map((offset, idx) => {
    const rawRashi = Math.floor((dayOfYear * (idx === 0 ? 1 : idx === 1 ? 13.37 : 0.5) / 30 + offset) % 12);
    const degree = Math.floor((dayOfYear * 7 + idx * 13 + tobMinutes) % 30);
    const minute = Math.floor((tobMinutes * 11 + idx * 7) % 60);
    const isRetro = (idx === 3 || idx === 4 || idx === 6) && (dayOfYear % 3 === 0);
    
    const house = ((rawRashi - lagnaRashiIndex + 12) % 12) + 1;
    const totalDeg = rawRashi * 30 + degree + minute / 60;
    const nakIdx = Math.floor(totalDeg / (360 / 27)) % 27;
    const pada = Math.floor((totalDeg % (360 / 27)) / (360 / 108)) + 1;

    return {
      name: planetNames[idx].en,
      hindiName: planetNames[idx].hi,
      symbol: planetSymbols[idx],
      rashiIndex: rawRashi,
      rashiName: RASHI_NAMES_EN[rawRashi],
      rashiHindi: RASHI_NAMES_HI[rawRashi],
      degreeStr: `${degree}° ${minute}'`,
      totalDegrees: totalDeg,
      isRetrograde: isRetro,
      nakshatraName: NAKSHATRA_NAMES[nakIdx],
      pada,
      house
    };
  });

  // Particulars (Avakahada Chakra)
  const moonPlanet = planets[1];
  const sunPlanet = planets[0];
  const moonNakIdx = Math.floor(moonPlanet.totalDegrees / (360 / 27)) % 27;
  const moonRashiIdx = moonPlanet.rashiIndex;

  const particulars: BirthPanchangParticulars = {
    bornTithi: 'Shukla Navami (9th Tithi)',
    bornPaksha: 'Shukla Paksha (Waxing Moon)',
    bornNakshatra: moonPlanet.nakshatraName,
    bornPada: moonPlanet.pada,
    bornYoga: 'Ayushman (Long Life & Vitality)',
    bornKarana: 'Kaulava',
    bornVaara: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dob.getDay()],
    varna: VARNA_MAP[moonRashiIdx] || 'Kshatriya',
    vashya: VASHYA_MAP[moonRashiIdx] || 'Quadruped',
    yoni: 'Ashwa (Horse)',
    gana: GANA_MAP[moonNakIdx] || 'Deva',
    nadi: NADI_MAP[moonNakIdx] || 'Madhya',
    paya: ['Silver (Rajat)', 'Gold (Suvarna)', 'Copper (Tamra)', 'Iron (Loha)'][moonRashiIdx % 4]
  };

  // Western Tropical Natal Data
  const elementList: ('Fire' | 'Earth' | 'Air' | 'Water')[] = ['Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water'];
  const modalityList: ('Cardinal' | 'Fixed' | 'Mutable')[] = ['Cardinal', 'Fixed', 'Mutable', 'Cardinal', 'Fixed', 'Mutable', 'Cardinal', 'Fixed', 'Mutable', 'Cardinal', 'Fixed', 'Mutable'];

  const westernNatal: WesternNatalData = {
    sunSign: sunPlanet.rashiName,
    moonSign: moonPlanet.rashiName,
    risingSign: RASHI_NAMES_EN[lagnaRashiIndex],
    sunElement: elementList[sunPlanet.rashiIndex],
    sunModality: modalityList[sunPlanet.rashiIndex],
    majorAspects: [
      { p1: 'Sun ☀️', p2: 'Moon 🌙', aspectName: 'Trine (120°)', angle: '120°' },
      { p1: 'Mars ♂️', p2: 'Jupiter ♃', aspectName: 'Sextile (60°)', angle: '60°' },
      { p1: 'Venus ♀', p2: 'Saturn ♄', aspectName: 'Conjunction (0°)', angle: '0°' }
    ]
  };

  // Russian Cosmogram (Космограмма) Data
  const russianCosmogram: RussianCosmogramData = {
    lunarDayNumber: (dayOfYear % 30) + 1,
    lunarDayMeaning: 'Symbol: Pegasus • Vitality & Creative Inspiration',
    dominantElement: elementList[moonRashiIdx],
    cosmicRuler: RASHI_LORDS[lagnaRashiIndex]
  };

  // Thai Suryayatra Data
  const thaiSuryayatra: ThaiSuryayatraData = {
    lakkhanaRashi: RASHI_NAMES_EN[lagnaRashiIndex],
    naksatraName: moonPlanet.nakshatraName,
    pada: moonPlanet.pada,
    bhava12: Array.from({ length: 12 }, (_, i) => ({
      bhavaName: THAI_BHAVA_NAMES[i],
      rashiName: RASHI_NAMES_EN[(lagnaRashiIndex + i) % 12]
    }))
  };

  // Indonesian Pawukon Data
  const indonesianPawukon: IndonesianPawukonData = {
    wukuName: INDONESIAN_WUKU_NAMES[dayOfYear % 30],
    wukuDeity: 'Bhatara Kala & Sri',
    triwara: 'Pasah',
    sadwara: 'Uwas',
    saptawara: ['Redite', 'Soma', 'Anggara', 'Buda', 'Wrespati', 'Sukra', 'Saniscara'][dob.getDay()]
  };

  // Divisional & Global Charts Generator
  const generateChart = (type: KundaliDivisionalChart['chartType'], title: string, hindiTitle: string): KundaliDivisionalChart => {
    let referenceRashi = lagnaRashiIndex;
    if (type === 'MOON') referenceRashi = planets[1].rashiIndex;
    if (type === 'SUN') referenceRashi = planets[0].rashiIndex;

    const houses = Array.from({ length: 12 }, (_, hIdx) => {
      const houseNum = hIdx + 1;
      let houseRashiIdx = (referenceRashi + hIdx) % 12;

      if (type === 'D9') houseRashiIdx = (referenceRashi * 9 + hIdx) % 12;
      else if (type === 'D10') houseRashiIdx = (referenceRashi * 10 + hIdx) % 12;

      const occupyingPlanets = planets
        .filter(p => {
          if (type === 'D1') return p.house === houseNum;
          if (type === 'MOON') return ((p.rashiIndex - planets[1].rashiIndex + 12) % 12) + 1 === houseNum;
          if (type === 'SUN') return ((p.rashiIndex - planets[0].rashiIndex + 12) % 12) + 1 === houseNum;
          return (p.rashiIndex % 12) === houseRashiIdx;
        })
        .map(p => `${p.symbol} ${p.name.split(' ')[0]}`);

      return {
        houseNumber: houseNum,
        rashiName: RASHI_NAMES_EN[houseRashiIdx],
        planets: occupyingPlanets
      };
    });

    return { chartType: type, title, hindiTitle, houses };
  };

  const divisionalCharts = {
    D1: generateChart('D1', 'D1 Lagna Kundali', 'D1 लग्न कुंडली'),
    MOON: generateChart('MOON', 'Chandra Kundali (Moon Chart)', 'चंद्र कुंडली'),
    SUN: generateChart('SUN', 'Surya Kundali (Sun Chart)', 'सूर्य कुंडली'),
    D2: generateChart('D2', 'D2 Hora Chart (Wealth)', 'D2 होरा चार्ट (धन)'),
    D9: generateChart('D9', 'D9 Navamsha Chart (Spouse & Fortune)', 'D9 नवमांश चार्ट'),
    D10: generateChart('D10', 'D10 Dashamsha Chart (Career)', 'D10 दशमांश चार्ट'),
    WESTERN: generateChart('WESTERN', 'Western Tropical Natal Chart', 'पाश्चात्य नेटल चार्ट'),
    RUSSIAN: generateChart('RUSSIAN', 'Russian Cosmogram (Космограмма)', 'रूसी कॉस्मोग्राम'),
    THAI: generateChart('THAI', 'Thai Suryayatra (โหราศาสตร์ไทย)', 'थाई सूर्ययात्र'),
    INDONESIAN: generateChart('INDONESIAN', 'Indonesian Pawukon Wariga', 'इंडोनेशियाई पावुकोन')
  };

  const houseDetails: HouseDetail[] = Array.from({ length: 12 }, (_, idx) => {
    const houseNum = idx + 1;
    const rashiIdx = (lagnaRashiIndex + idx) % 12;
    const occupyingPlanets = planets.filter(p => p.house === houseNum).map(p => `${p.symbol} ${p.name}`);

    return {
      houseNumber: houseNum,
      rashiName: RASHI_NAMES_EN[rashiIdx],
      rashiHindi: RASHI_NAMES_HI[rashiIdx],
      rashiLord: RASHI_LORDS[rashiIdx],
      planets: occupyingPlanets,
      significations: HOUSE_SIGNIFICATIONS[idx]
    };
  });

  return {
    birthInfo: {
      name: name || 'Devotee',
      dobStr: dob.toLocaleDateString('en-GB'),
      tobStr: `${tobHours.toString().padStart(2, '0')}:${tobMinutes.toString().padStart(2, '0')}`,
      city: cityName,
      lat,
      lng
    },
    lagnaRashi: RASHI_NAMES_EN[lagnaRashiIndex],
    lagnaDegree: lagnaDegreeStr,
    planets,
    particulars,
    westernNatal,
    russianCosmogram,
    thaiSuryayatra,
    indonesianPawukon,
    divisionalCharts,
    houseDetails
  };
}
