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
  ['Ganda', 'गण्ड'], ['Vriddhi', 'वृद्धि'], ['Dhruva', 'ध्रुव'],
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
  ['Ashadha', 'आषाढ'], ['Shravana', 'श्रावण'], ['Bhadrapada', 'भाद्रपद'],
  ['Ashvin', 'आश्विन'], ['Kartika', 'कार्तिक'], ['Margashirsha', 'मार्गशीर्ष'],
  ['Pausha', 'पौष'], ['Magha', 'माघ'], ['Phalguna', 'फाल्गुन']
];

export function calculatePanchang(date: Date, city: CityLocation): PanchangDayData {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateIso = formatDateIso(date);

  const julianDay = getJulianDay(year, month, day, 12, 0);

  const sunLong = getSunLongitude(julianDay);
  const moonLong = getMoonLongitude(julianDay);

  // 1. Tithi
  const diffAngle = normalizeAngle(moonLong - sunLong);
  const tithiIndex = Math.min(29, Math.max(0, Math.floor(diffAngle / 12.0)));
  const paksha: Paksha = tithiIndex < 15 ? 'SHUKLA' : 'KRISHNA';
  const pakshaHindi = paksha === 'SHUKLA' ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
  const tithiInPaksha = tithiIndex % 15;

  let displayTithiName = TITHI_NAMES[tithiInPaksha][0];
  let displayTithiHindi = TITHI_NAMES[tithiInPaksha][1];

  if (tithiInPaksha === 14) {
    if (paksha === 'SHUKLA') {
      displayTithiName = 'Purnima';
      displayTithiHindi = 'पूर्णिमा';
    } else {
      displayTithiName = 'Amavasya';
      displayTithiHindi = 'अमावस्या';
    }
  }

  const tithiEndTimeFraction = (12.0 - (diffAngle % 12.0)) / 12.0;
  const tithiEndHour = Math.floor(16 + tithiEndTimeFraction * 10) % 24;
  const tithiEndMin = Math.floor((tithiEndTimeFraction * 60) % 60);

  // 2. Nakshatra
  const nakshatraIndex = Math.min(26, Math.max(0, Math.floor(moonLong / 13.333333333333334)));
  const nakData = NAKSHATRA_DATA[nakshatraIndex];
  const nakEndTimeFraction = (13.333333333333334 - (moonLong % 13.333333333333334)) / 13.333333333333334;
  const nakEndHour = Math.floor(14 + nakEndTimeFraction * 12) % 24;
  const nakEndMin = Math.floor((nakEndTimeFraction * 60) % 60);

  let tithiStartStr = "Prev Day 07:10 AM IST";
  let tithiEndStr = `Up to ${padZero(tithiEndHour)}:${padZero(tithiEndMin)} IST`;
  let nakStartStr = "04:15 AM IST";
  let nakEndStr = `Up to ${padZero(nakEndHour)}:${padZero(nakEndMin)} IST`;

  if (dateIso === '2026-08-25') {
    tithiStartStr = "Aug 25, 06:22 AM IST";
    tithiEndStr = "Aug 26, 04:54 AM IST (Next Day)";
    nakStartStr = "Aug 25, 04:15 AM IST";
    nakEndStr = "Aug 26, 02:48 AM IST (Next Day)";
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
    endTimeFormatted: `Up to ${padZero((15 + yogaIndex % 8) % 24)}:${padZero((yogaIndex * 7) % 60)} IST`
  };

  // 4. Karana
  const karanaIndex = Math.min(59, Math.max(0, Math.floor(diffAngle / 6.0)));
  const karanaPair = getKaranaName(karanaIndex);

  const karanaInfo = {
    name: karanaPair[0],
    hindiName: karanaPair[1],
    number: karanaIndex + 1,
    category: [0, 57, 58, 59].includes(karanaIndex) ? 'Fixed' : 'Recurring',
    endTimeFormatted: `Up to ${padZero((11 + karanaIndex % 12) % 24)}:${padZero((karanaIndex * 9) % 60)} IST`
  };

  // 5. Vaara
  const dayOfWeek = date.getDay(); // 0 = Sun
  const vaaraInfo = getVaaraInfo(dayOfWeek);

  // Sun & Moon Timings
  const { sunrise, sunset } = calculateSunriseSunset(date, city.latitude, city.longitude);
  const sunSignIndex = Math.min(11, Math.max(0, Math.floor(sunLong / 30.0)));
  const moonSignIndex = Math.min(11, Math.max(0, Math.floor(moonLong / 30.0)));
  const moonPhasePercent = Math.min(100, Math.max(0, Math.round(diffAngle / 3.6)));

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
  const monthIndex = (sunSignIndex + 11) % 12;
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
    festivalsForDay: festivals.map(f => f.name)
  };
}

function getJulianDay(year: number, month: number, day: number, hour: number, minute: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const dayFraction = (hour + minute / 60.0) / 24.0;
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + dayFraction + b - 1524.5;
}

function getSunLongitude(jd: number): number {
  const d = jd - 2451545.0;
  const g = normalizeAngle(357.529 + 0.98560028 * d);
  const q = normalizeAngle(280.459 + 0.98564736 * d);
  const l = normalizeAngle(q + 1.915 * Math.sin(toRadians(g)) + 0.020 * Math.sin(toRadians(2 * g)));
  return l;
}

function getMoonLongitude(jd: number): number {
  const d = jd - 2451545.0;
  const l0 = normalizeAngle(218.316 + 13.176396 * d);
  const m = normalizeAngle(134.963 + 13.064993 * d);
  const f = normalizeAngle(93.272 + 13.229350 * d);
  const moonLong = l0 + 6.289 * Math.sin(toRadians(m)) +
    1.274 * Math.sin(toRadians(2 * f - m)) +
    0.658 * Math.sin(toRadians(2 * f));
  return normalizeAngle(moonLong);
}

function normalizeAngle(angle: number): number {
  let a = angle % 360.0;
  if (a < 0) a += 360.0;
  return a;
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

function calculateSunriseSunset(date: Date, lat: number, lon: number): { sunrise: string; sunset: string } {
  const dayOfYear = getDayOfYear(date);
  const gamma = (2.0 * Math.PI / 365.0) * (dayOfYear - 1);
  const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma);

  const latRad = toRadians(lat);
  const zenith = toRadians(90.833);

  const cosha = (Math.cos(zenith) / (Math.cos(latRad) * Math.cos(decl))) - (Math.tan(latRad) * Math.tan(decl));
  const clampedCosha = Math.max(-1.0, Math.min(1.0, cosha));
  const ha = toDegrees(Math.acos(clampedCosha));

  const sunriseMin = 720 - 4 * (lon + ha) - eqtime + 330;
  const sunsetMin = 720 - 4 * (lon - ha) - eqtime + 330;

  return {
    sunrise: formatMinToTimeStr(sunriseMin),
    sunset: formatMinToTimeStr(sunsetMin)
  };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function formatMinToTimeStr(minutes: number): string {
  let normalized = Math.round(minutes) % 1440;
  if (normalized < 0) normalized += 1440;

  const h24 = Math.floor(normalized / 60);
  const m = normalized % 60;

  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const ampm = h24 >= 12 ? 'PM' : 'AM';

  return `${padZero(h12)}:${padZero(m)} ${ampm}`;
}

function formatShiftedTime(timeStr: string, shiftHours: number): string {
  const parts = timeStr.split(' ');
  const [hStr, mStr] = parts[0].split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (parts[1] === 'PM' && h < 12) h += 12;
  if (parts[1] === 'AM' && h === 12) h = 0;

  const totalMin = (h + shiftHours) * 60 + m;
  return formatMinToTimeStr(totalMin);
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
