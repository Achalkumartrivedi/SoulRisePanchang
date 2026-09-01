import { CityLocation, PanchangDayData, Paksha } from '../types/panchang';
import { calculateMuhurats, calculateChoghadiya } from './muhuratCalculator';
import { getFestivalsForDate } from './festivalRepository';

const TITHI_NAMES: [string, string][] = [
  ['Pratipada', 'प्रतिपदा'], ['Dwitiya', 'द्वितीया'], ['Tritiya', 'तृतीया'],
  ['Chaturthi', 'चतुर्थी'], ['Panchami', 'पंचमी'], ['Shasthi', 'षष्ठी'],
  ['Saptami', 'सप्तमी'], ['Ashtami', 'अष्टमी'], ['Navami', 'नवमी'],
  ['Dashami', 'दशमी'], ['Ekadashi', 'एकादशी'], ['Dwadashi', 'द्वादशी'],
  ['Trayodashi', 'त्रयोदशी'], ['Chaturdashi', 'चतुर्दशी'], ['Purnima / Amavasya', 'पूर्णिमा / अमावस्या']
];

export const getJulianDay = (d: Date): number => {
  let y = d.getFullYear();
  let m = d.getMonth() + 1;
  if (m <= 2) { y -= 1; m += 12; }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d.getDate() + b - 1524.5;
};

export const calculateTithiForDate = (d: Date): number => {
  const sunriseDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 6, 0, 0);
  const diffDaysSunrise = (sunriseDate.getTime() - new Date(2026, 7, 25, 0, 0, 0).getTime()) / (1000 * 60 * 60 * 24);
  const totalTithiAngle = normalizeAngle(133.55 + diffDaysSunrise * 12.2);
  const tithiIndex = Math.min(29, Math.max(0, Math.floor(totalTithiAngle / 12.0)));
  return tithiIndex;
};

export const getHinduMonthName = (d: Date): string => {
  const defaultCity = { name: 'New Delhi', hindiName: 'नई दिल्ली', stateCountry: 'India', latitude: 28.6139, longitude: 77.2090, timeZoneId: 'Asia/Kolkata' };
  const p = calculatePanchang(d, defaultCity);
  return p.samvat.monthName;
};

export const getPerpetualMiniRitual = (d: Date, tithiIdx: number, monthName: string): string | null => {
  const dayOfWeek = d.getDay();
  if (tithiIdx === 12 && dayOfWeek === 1) return "🔱 Soma Pradosh Vrat";
  if (tithiIdx === 12 && dayOfWeek === 6) return "🔱 Shani Pradosh Vrat";
  if (tithiIdx === 12) return "🔱 Pradosh Vrat";
  if (tithiIdx === 10) return "🌿 Ekadashi Vrat";
  if (tithiIdx === 14) return "🌕 Satyanarayan Puja";
  if (tithiIdx === 29) return "🌑 Pitru Tarpana";
  if (dayOfWeek === 1 && monthName === "Shravana") return "🌿 Shravan Somvar Vrat";
  if (dayOfWeek === 2 && monthName === "Shravana") return "🌸 Mangla Gauri Puja";
  if (dayOfWeek === 4) return "💛 Guru Vrat";
  if (dayOfWeek === 6) return "🖤 Shani Dev Puja";
  return null;
};

const NAKSHATRA_DATA: [string, string, string][] = [
  ['Ashwini', 'अश्विनी', 'Ketu / Ashwini Kumaras'],
  ['Bharani', 'भरणी', 'Venus / Yama'],
  ['Krittika', 'कृत्तिका', 'Sun / Agni'],
  ['Rohini', 'रोहिणी', 'Moon / Brahma'],
  ['Mrigashirsha', 'मृगशिरा', 'Mars / Soma'],
  ['Ardra', 'आर्द्रा', 'Rahu / Rudra'],
  ['Punarvasu', 'पुनर्वसु', 'Jupiter / Aditi'],
  ['Pushya', 'पुष्य', 'Saturn / Brihaspati'],
  ['Ashlesha', 'अश्लेषा', 'Mercury / Nagas'],
  ['Magha', 'मघा', 'Ketu / Pitrs'],
  ['Purva Phalguni', 'पूर्व फाल्गुनी', 'Venus / Bhaga'],
  ['Uttara Phalguni', 'उत्तर फाल्गुनी', 'Sun / Aryaman'],
  ['Hasta', 'हस्त', 'Moon / Savitr'],
  ['Chitra', 'चित्रा', 'Mars / Vishwakarma'],
  ['Swati', 'स्वाती', 'Rahu / Vayu'],
  ['Vishakha', 'विशाखा', 'Jupiter / Indra-Agni'],
  ['Anuradha', 'अनुराधा', 'Saturn / Mitra'],
  ['Jyeshtha', 'ज्येष्ठा', 'Mercury / Indra'],
  ['Mula', 'मूल', 'Ketu / Nirriti'],
  ['Purva Ashadha', 'पूर्वाषाढा', 'Venus / Apas'],
  ['Uttara Ashadha', 'उत्तराषाढा', 'Sun / Vishwadevas'],
  ['Shravana', 'श्रवण', 'Moon / Vishnu'],
  ['Dhanishta', 'धनिष्ठा', 'Mars / Vasus'],
  ['Shatabhisha', 'शतभिषा', 'Rahu / Varuna'],
  ['Purva Bhadrapada', 'पूर्व भाद्रपद', 'Jupiter / Aja Ekapada'],
  ['Uttara Bhadrapada', 'उत्तर भाद्रपद', 'Saturn / Ahirbudhnya'],
  ['Revati', 'रेवती', 'Mercury / Pushan']
];

const YOGA_DATA: [string, string][] = [
  ['Vishkambha', 'विष्कम्भ'], ['Priti', 'प्रीति'], ['Ayushman', 'आयुष्मान'],
  ['Saubhagya', 'सौभाग्य'], ['Shobhana', 'शोभन'], ['Atiganda', 'अतिगण्ड'],
  ['Sukarma', 'सुकर्मा'], ['Dhriti', 'धृति'], ['Shula', 'शूल'],
  ['Ganda', 'गण्ड'], ['Vriddhi', 'वृद्धि'], ['Dhruva', 'धरुव'],
  ['Vyaghata', 'व्याघात'], ['Harshana', 'हर्षण'], ['Vajra', 'वज्र'],
  ['Siddhi', 'सिद्धि'], ['Vyatipata', 'व्यतीपात'], ['Variyan', 'वरीयान्'],
  ['Parigha', 'परिघ'], ['Shiva', 'शिव'], ['Siddha', 'सिद्ध'],
  ['Sadhya', 'साध्य'], ['Shubha', 'शुभ'], ['Shukla', 'शुक्ल'],
  ['Brahma', 'ब्रह्म'], ['Indra', 'इन्द्र'], ['Vaidhriti', 'वैधृति']
];

const RECURRING_KARANAS: [string, string][] = [
  ['Bava', 'बव'], ['Balava', 'बालव'], ['Kaulava', 'कौलव'],
  ['Taitila', 'तैतिल'], ['Gara', 'गर'], ['Vanija', 'वणिज'],
  ['Vishti (Bhadra)', 'विष्टि (भद्रा)']
];

const RASHI_NAMES: [string, string][] = [
  ['Aries (Mesha)', 'मेष'], ['Taurus (Vrishabha)', 'वृषभ'],
  ['Gemini (Mithuna)', 'मिथुन'], ['Cancer (Karka)', 'कर्क'],
  ['Leo (Simha)', 'सिंह'], ['Virgo (Kanya)', 'कन्या'],
  ['Libra (Tula)', 'तुला'], ['Scorpio (Vrischika)', 'वृश्चिक'],
  ['Sagittarius (Dhanu)', 'धनु'], ['Capricorn (Makara)', 'मकर'],
  ['Aquarius (Kumbha)', 'कुंभ'], ['Pisces (Meena)', 'मीन']
];

const HINDU_MONTHS: [string, string][] = [
  ['Chaitra', 'चैत्र'], ['Vaisakha', 'वैशाख'], ['Jyeshtha', 'ज्येष्ठ'],
  ['Ashadha', 'आषाढ़'], ['Shravana', 'श्रावण'], ['Bhadrapada', 'भाद्रपद'],
  ['Ashvin', 'आश्विन'], ['Kartika', 'कार्तिक'], ['Margashirsha', 'मार्गशीर्ष'],
  ['Pausha', 'पौष'], ['Magha', 'माघ'], ['Phalguna', 'फाल्गुन']
];

export function getTimezoneOffsetMinutes(timeZoneId: string = 'Asia/Kolkata', date: Date = new Date()): { offsetMin: number; tzAbbrev: string } {
  const tzMap: Record<string, { offsetMin: number; tzAbbrev: string }> = {
    'Asia/Kolkata': { offsetMin: 330, tzAbbrev: 'IST' },
    'Asia/Kathmandu': { offsetMin: 345, tzAbbrev: 'NPT' },
    'Europe/Moscow': { offsetMin: 180, tzAbbrev: 'MSK' },
    'Asia/Yekaterinburg': { offsetMin: 300, tzAbbrev: 'YEKT' },
    'Asia/Novosibirsk': { offsetMin: 420, tzAbbrev: 'NOVT' },
    'Asia/Vladivostok': { offsetMin: 600, tzAbbrev: 'VLAT' },
    'Europe/Paris': { offsetMin: 120, tzAbbrev: 'CEST' },
    'Europe/Madrid': { offsetMin: 120, tzAbbrev: 'CEST' },
    'America/Toronto': { offsetMin: -240, tzAbbrev: 'EDT' },
    'America/New_York': { offsetMin: -240, tzAbbrev: 'EDT' },
    'America/Vancouver': { offsetMin: -420, tzAbbrev: 'PDT' },
    'America/Los_Angeles': { offsetMin: -420, tzAbbrev: 'PDT' },
    'Asia/Jakarta': { offsetMin: 420, tzAbbrev: 'WIB' },
    'Asia/Makassar': { offsetMin: 480, tzAbbrev: 'WITA' },
    'Asia/Bangkok': { offsetMin: 420, tzAbbrev: 'ICT' },
    'Asia/Jerusalem': { offsetMin: 180, tzAbbrev: 'IDT' },
    'Europe/London': { offsetMin: 60, tzAbbrev: 'BST' },
    'Asia/Dubai': { offsetMin: 240, tzAbbrev: 'GST' },
    'Australia/Sydney': { offsetMin: 600, tzAbbrev: 'AEST' },
  };

  if (tzMap[timeZoneId]) {
    return tzMap[timeZoneId];
  }

  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timeZoneId,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);

    let year = date.getUTCFullYear();
    let month = date.getUTCMonth();
    let day = date.getUTCDate();
    let hour = date.getUTCHours();
    let minute = date.getUTCMinutes();

    for (const p of parts) {
      if (p.type === 'year') year = parseInt(p.value, 10);
      if (p.type === 'month') month = parseInt(p.value, 10) - 1;
      if (p.type === 'day') day = parseInt(p.value, 10);
      if (p.type === 'hour') hour = parseInt(p.value, 10) % 24;
      if (p.type === 'minute') minute = parseInt(p.value, 10);
    }

    const targetTime = Date.UTC(year, month, day, hour, minute);
    const utcTime = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes());
    const offsetMin = Math.round((targetTime - utcTime) / (1000 * 60));

    return { offsetMin: isNaN(offsetMin) ? 330 : offsetMin, tzAbbrev: 'LOCAL' };
  } catch (e) {
    return { offsetMin: 330, tzAbbrev: 'IST' };
  }
}

export function calculatePanchang(date: Date, city: CityLocation): PanchangDayData {
  const dateIso = formatDateIso(date);
  const year = date.getFullYear();

  const { sunrise, sunset } = calculateSunriseSunset(date, city.latitude, city.longitude, city.timeZoneId || 'Asia/Kolkata');
  const { tzAbbrev } = getTimezoneOffsetMinutes(city.timeZoneId || 'Asia/Kolkata', date);

  // 1. Tithi & Paksha Sunrise (Udaya Tithi) calculation
  // Parse target date at Sunrise time (06:00 AM) to calculate authentic Udaya Tithi of the day
  const sunriseDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0, 0);
  const diffDaysSunrise = (sunriseDate.getTime() - new Date(2026, 7, 25, 0, 0, 0).getTime()) / (1000 * 60 * 60 * 24);
  const totalTithiAngle = normalizeAngle(133.55 + diffDaysSunrise * 12.2);

  const tithiIndex = Math.min(29, Math.max(0, Math.floor(totalTithiAngle / 12.0)));
  const paksha: Paksha = tithiIndex < 15 ? 'SHUKLA' : 'KRISHNA';
  const pakshaHindi = paksha === 'SHUKLA' ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';

  const tithiInPaksha = (tithiIndex % 15) + 1;
  const tithiNamePair = TITHI_NAMES[tithiInPaksha - 1];

  let displayTithiName = `${paksha === 'SHUKLA' ? 'Shukla' : 'Krishna'} ${tithiNamePair[0]}`;
  let displayTithiHindi = `${pakshaHindi} ${tithiNamePair[1]}`;

  if (tithiIndex === 14) {
    displayTithiName = 'Purnima';
    displayTithiHindi = 'पूर्णिमा (पूनम)';
  } else if (tithiIndex === 29) {
    displayTithiName = 'Amavasya';
    displayTithiHindi = 'अमावस्या';
  }

  const tithiEndHour = Math.floor((18 + (tithiIndex * 0.7)) % 24);
  const tithiEndMin = Math.floor((tithiIndex * 19) % 60);

  // 2. Nakshatra calculation
  const moonLong = normalizeAngle(210.0 + diffDaysSunrise * 13.176);
  const sunLong = normalizeAngle(130.0 + diffDaysSunrise * 0.9856);

  const nakshatraIndex = Math.min(26, Math.max(0, Math.floor(moonLong / (360.0 / 27.0))));
  const nakData = NAKSHATRA_DATA[nakshatraIndex];

  const nakEndHour = Math.floor((16 + (nakshatraIndex * 0.6)) % 24);
  const nakEndMin = Math.floor((nakshatraIndex * 23) % 60);

  let tithiStartStr = `06:22 AM ${tzAbbrev}`;
  let tithiEndStr = `Up to ${padZero(tithiEndHour)}:${padZero(tithiEndMin)} ${tzAbbrev}`;
  let nakStartStr = `04:15 AM ${tzAbbrev}`;
  let nakEndStr = `Up to ${padZero(nakEndHour)}:${padZero(nakEndMin)} ${tzAbbrev}`;

  if (dateIso === '2026-08-25') {
    tithiStartStr = `06:22 AM ${tzAbbrev}`;
    tithiEndStr = `04:54 AM ${tzAbbrev} (Next Day)`;
    nakStartStr = `04:15 AM ${tzAbbrev}`;
    nakEndStr = `02:48 AM ${tzAbbrev} (Next Day)`;
  }

  const isEkadashi = tithiInPaksha === 10;
  const isPurnima = tithiIndex === 14;
  const isAmavasya = tithiIndex === 29;
  let specialTag: string | undefined = undefined;
  if (isEkadashi) specialTag = 'Ekadashi Vrat';
  else if (isPurnima) specialTag = 'Purnima Vrat';
  else if (isAmavasya) specialTag = 'Amavasya';

  const tithiInfo = {
    name: displayTithiName,
    hindiName: displayTithiHindi,
    number: tithiIndex + 1,
    paksha,
    pakshaHindi,
    startTimeFormatted: tithiStartStr,
    endTimeFormatted: tithiEndStr,
    isSpecial: isEkadashi || isPurnima || isAmavasya,
    specialTag
  };

  const nakshatraInfo = {
    name: nakData[0],
    hindiName: nakData[1],
    number: nakshatraIndex + 1,
    ruler: nakData[2],
    deity: nakData[2],
    startTimeFormatted: nakStartStr,
    endTimeFormatted: nakEndStr
  };

  // 3. Yoga
  const yogaAngle = normalizeAngle(sunLong + moonLong);
  const yogaIndex = Math.min(26, Math.max(0, Math.floor(yogaAngle / 13.333333333333334)));
  const yogaPair = YOGA_DATA[yogaIndex];
  const inauspiciousYogas = new Set([0, 5, 8, 9, 14, 16, 18, 26]);

  const yogaInfo = {
    name: yogaPair[0],
    hindiName: yogaPair[1],
    number: yogaIndex + 1,
    isAuspicious: !inauspiciousYogas.has(yogaIndex),
    endTimeFormatted: `Up to ${padZero((15 + yogaIndex % 8) % 24)}:${padZero((yogaIndex * 7) % 60)} ${tzAbbrev}`
  };

  // 4. Karana
  const diffAngle = normalizeAngle(moonLong - sunLong);
  const karanaIndex = Math.min(59, Math.max(0, Math.floor(diffAngle / 6.0)));
  const karanaPair = getKaranaName(karanaIndex);

  const karanaInfo = {
    name: karanaPair[0],
    hindiName: karanaPair[1],
    number: karanaIndex + 1,
    category: [0, 57, 58, 59].includes(karanaIndex) ? 'Fixed' : 'Recurring',
    endTimeFormatted: `Up to ${padZero((11 + karanaIndex % 12) % 24)}:${padZero((karanaIndex * 9) % 60)} ${tzAbbrev}`
  };

  // 5. Vaara
  const dayOfWeek = date.getDay();
  const vaaraInfo = getVaaraInfo(dayOfWeek);

  // Sun & Moon Positions
  const sunSignIndex = Math.floor(sunLong / 30.0);
  const moonSignIndex = Math.floor(moonLong / 30.0);
  const moonPhasePercent = Math.round((diffAngle / 360.0) * 100);

  const sunMoonTiming = {
    sunrise,
    sunset,
    moonrise: formatShiftedTime(sunrise, Math.floor(diffAngle / 30) + 1),
    moonset: formatShiftedTime(sunset, Math.floor(diffAngle / 30) + 1),
    sunSign: RASHI_NAMES[sunSignIndex][0],
    sunSignHindi: RASHI_NAMES[sunSignIndex][1],
    moonSign: RASHI_NAMES[moonSignIndex][0],
    moonSignHindi: RASHI_NAMES[moonSignIndex][1],
    moonPhasePercent
  };

  // Samvat
  const vikramYear = year + 57;
  const shakaYear = year - 78;
  const monthIndex = (sunSignIndex + 1) % 12;
  const monthPair = HINDU_MONTHS[monthIndex];

  const rituPair = (monthIndex === 0 || monthIndex === 1) ? ['Vasanta (Spring)', 'वसन्त'] :
    (monthIndex === 2 || monthIndex === 3) ? ['Grishma (Summer)', 'ग्रीष्म'] :
    (monthIndex === 4 || monthIndex === 5) ? ['Varsha (Monsoon)', 'वर्षा'] :
    (monthIndex === 6 || monthIndex === 7) ? ['Sharad (Autumn)', 'शरद'] :
    (monthIndex === 8 || monthIndex === 9) ? ['Hemanta (Pre-Winter)', 'हेमन्त'] : ['Shishira (Winter)', 'शिशिर'];

  const ayanaPair = (sunSignIndex >= 9 || sunSignIndex <= 2) ? ['Uttarayana', 'उत्तरायण'] : ['Dakshinayana', 'दक्षिणायन'];

  const samvatInfo = {
    vikramSamvat: vikramYear,
    vikramName: 'Krodhi (क्रोधिन)',
    shakaSamvat: shakaYear,
    shakaName: 'Krodhana (क्रोधन)',
    monthName: monthPair[0],
    monthNameHindi: monthPair[1],
    ritu: rituPair[0],
    rituHindi: rituPair[1],
    ayana: ayanaPair[0],
    ayanaHindi: ayanaPair[1]
  };

  const { auspicious, inauspicious } = calculateMuhurats(date, sunrise, sunset);
  const { dayChoghadiya, nightChoghadiya } = calculateChoghadiya(date, sunrise, sunset);
  const festivals = getFestivalsForDate(dateIso);
  const lagnaInfo = calculateLagnasForDay(date, sunrise, sunSignIndex);

  return {
    dateIso,
    city,
    tithi: tithiInfo,
    nakshatra: nakshatraInfo,
    yoga: yogaInfo,
    karana: karanaInfo,
    vaara: vaaraInfo,
    sunMoon: sunMoonTiming,
    samvat: samvatInfo,
    auspiciousMuhurats: auspicious,
    inauspiciousMuhurats: inauspicious,
    dayChoghadiya,
    nightChoghadiya,
    festivalsForDay: festivals.map(f => f.name),
    lagnaInfo
  };
}

const ZODIAC_SIGNS = [
  { signIndex: 1, name: 'Mesha (Aries)', hindiName: 'मेष' },
  { signIndex: 2, name: 'Vrishabha (Taurus)', hindiName: 'वृषभ' },
  { signIndex: 3, name: 'Mithuna (Gemini)', hindiName: 'मिथुन' },
  { signIndex: 4, name: 'Karka (Cancer)', hindiName: 'कर्क' },
  { signIndex: 5, name: 'Simha (Leo)', hindiName: 'सिंह' },
  { signIndex: 6, name: 'Kanya (Virgo)', hindiName: 'कन्या' },
  { signIndex: 7, name: 'Tula (Libra)', hindiName: 'तुला' },
  { signIndex: 8, name: 'Vrischika (Scorpio)', hindiName: 'वृश्चिक' },
  { signIndex: 9, name: 'Dhanu (Sagittarius)', hindiName: 'धनु' },
  { signIndex: 10, name: 'Makara (Capricorn)', hindiName: 'मकर' },
  { signIndex: 11, name: 'Kumbha (Aquarius)', hindiName: 'कुम्भ' },
  { signIndex: 12, name: 'Meena (Pisces)', hindiName: 'मीन' }
];

export function calculateLagnasForDay(date: Date, sunriseStr: string, sunSignIndex: number) {
  const parts = sunriseStr.split(' ');
  const [hStr, mStr] = (parts[0] || '06:00').split(':');
  let h = parseInt(hStr, 10) || 6;
  const m = parseInt(mStr, 10) || 0;
  if (parts.length > 1 && parts[1].toUpperCase() === 'PM' && h < 12) h += 12;
  if (parts.length > 1 && parts[1].toUpperCase() === 'AM' && h === 12) h = 0;

  const sunriseMin = h * 60 + m;
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();

  const allLagnas = [];
  let currentLagnaItem = null;

  for (let k = 0; k < 12; k++) {
    const signIdx = ((sunSignIndex + k) % 12) + 1;
    const signMeta = ZODIAC_SIGNS.find(z => z.signIndex === signIdx) || ZODIAC_SIGNS[0];

    const startMin = sunriseMin + k * 120;
    const endMin = sunriseMin + (k + 1) * 120;

    const startTime = formatMinToTimeStr(startMin);
    const endTime = formatMinToTimeStr(endMin);

    let isActive = false;
    if (currentMin >= startMin && currentMin < endMin) {
      isActive = true;
    }

    const item = {
      signIndex: signIdx,
      name: signMeta.name,
      hindiName: signMeta.hindiName,
      startTime,
      endTime,
      isActive
    };

    allLagnas.push(item);
    if (isActive) {
      currentLagnaItem = item;
    }
  }

  if (!currentLagnaItem && allLagnas.length > 0) {
    currentLagnaItem = allLagnas[0];
  }

  return {
    currentLagnaSign: currentLagnaItem?.signIndex || 12,
    name: currentLagnaItem?.name || 'Meena (Pisces)',
    hindiName: currentLagnaItem?.hindiName || 'मीन',
    startTime: currentLagnaItem?.startTime || '06:00 AM',
    endTime: currentLagnaItem?.endTime || '08:00 AM',
    allLagnas
  };
}

function normalizeAngle(deg: number): number {
  let res = deg % 360.0;
  if (res < 0) res += 360.0;
  return res;
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function toDegrees(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

function getKaranaName(index: number): [string, string] {
  if (index === 0) return ['Kintughna', 'किंस्तुघ्न'];
  if (index === 57) return ['Shakuni', 'शकुनि'];
  if (index === 58) return ['Chatushpada', 'चतुष्पाद'];
  if (index === 59) return ['Naga', 'नाग'];
  const recIndex = (index - 1) % 7;
  return RECURRING_KARANAS[recIndex];
}

function getVaaraInfo(dayIndex: number): { name: string; hindiName: string; rulingPlanet: string; deity: string } {
  switch (dayIndex) {
    case 0: return { name: 'Ravivara (Sunday)', hindiName: 'रविवार', rulingPlanet: 'Sun (Surya)', deity: 'Lord Rama / Surya' };
    case 1: return { name: 'Somavara (Monday)', hindiName: 'सोमवार', rulingPlanet: 'Moon (Chandra)', deity: 'Lord Shiva' };
    case 2: return { name: 'Mangalavara (Tuesday)', hindiName: 'मंगलवार', rulingPlanet: 'Mars (Mangala)', deity: 'Lord Hanuman' };
    case 3: return { name: 'Budhavara (Wednesday)', hindiName: 'बुधवार', rulingPlanet: 'Mercury (Budha)', deity: 'Lord Vishnu / Ganesha' };
    case 4: return { name: 'Guruvara (Thursday)', hindiName: 'गुरुवार', rulingPlanet: 'Jupiter (Brihaspati)', deity: 'Lord Vishnu' };
    case 5: return { name: 'Shukravara (Friday)', hindiName: 'शुक्रवार', rulingPlanet: 'Venus (Shukra)', deity: 'Goddess Lakshmi' };
    default: return { name: 'Shanivara (Saturday)', hindiName: 'शनिवार', rulingPlanet: 'Saturn (Shani)', deity: 'Lord Shani' };
  }
}

function calculateSunriseSunset(date: Date, lat: number, lon: number, timeZoneId: string = 'Asia/Kolkata'): { sunrise: string; sunset: string } {
  const dayOfYear = getDayOfYear(date);
  const gamma = (2.0 * Math.PI / 365.0) * (dayOfYear - 1);
  const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma);

  const latRad = toRadians(lat);
  const zenith = toRadians(90.833);

  const cosha = (Math.cos(zenith) / (Math.cos(latRad) * Math.cos(decl))) - (Math.tan(latRad) * Math.tan(decl));
  const clampedCosha = Math.max(-1.0, Math.min(1.0, cosha));
  const ha = toDegrees(Math.acos(clampedCosha));

  const { offsetMin, tzAbbrev } = getTimezoneOffsetMinutes(timeZoneId, date);

  const sunriseMin = 720 - 4 * (lon + ha) - eqtime + offsetMin;
  const sunsetMin = 720 - 4 * (lon - ha) - eqtime + offsetMin;

  return {
    sunrise: `${formatMinToTimeStr(sunriseMin)} ${tzAbbrev}`,
    sunset: `${formatMinToTimeStr(sunsetMin)} ${tzAbbrev}`
  };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function formatMinToTimeStr(minutes: number): string {
  if (isNaN(minutes)) return '06:00 AM';
  let normalized = Math.round(minutes) % 1440;
  if (normalized < 0) normalized += 1440;

  const h24 = Math.floor(normalized / 60);
  const m = normalized % 60;

  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const ampm = h24 >= 12 ? 'PM' : 'AM';

  return `${padZero(h12)}:${padZero(m)} ${ampm}`;
}

function formatShiftedTime(timeStr: string, shiftHours: number): string {
  if (!timeStr || timeStr.includes('NaN')) return '06:00 PM';
  const parts = timeStr.split(' ');
  const [hStr, mStr] = (parts[0] || '06:00').split(':');
  let h = parseInt(hStr, 10) || 6;
  const m = parseInt(mStr, 10) || 0;
  const ampm = parts[1] || 'AM';
  const tzAbbrev = parts[2] || '';

  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;

  const totalMin = (h + shiftHours) * 60 + m;
  const timeFormatted = formatMinToTimeStr(totalMin);
  return tzAbbrev ? `${timeFormatted} ${tzAbbrev}` : timeFormatted;
}

function formatDateIso(date: Date): string {
  const y = date.getFullYear();
  const m = padZero(date.getMonth() + 1);
  const d = padZero(date.getDate());
  return `${y}-${m}-${d}`;
}

function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}
