import { MuhuratTiming, ChoghadiyaItem, ChoghadiyaType } from '../types/panchang';

const RAHU_PARTS = [8, 2, 7, 5, 6, 4, 3]; // Sun (0) to Sat (6)
const YAMA_PARTS = [5, 4, 3, 2, 1, 7, 6];
const GULIKA_PARTS = [7, 6, 5, 4, 3, 2, 1];

const CHOGHADIYA_TYPES: Record<ChoghadiyaType, { name: string; hindiName: string; isAuspicious: boolean }> = {
  AMRIT: { name: 'Amrit', hindiName: 'अमृत', isAuspicious: true },
  SHUBH: { name: 'Shubh', hindiName: 'शुभ', isAuspicious: true },
  LABH: { name: 'Labh', hindiName: 'लाभ', isAuspicious: true },
  CHAR: { name: 'Char', hindiName: 'चल', isAuspicious: true },
  ROG: { name: 'Rog', hindiName: 'रोग', isAuspicious: false },
  KAAL: { name: 'Kaal', hindiName: 'काल', isAuspicious: false },
  UDVEG: { name: 'Udveg', hindiName: 'उद्वेग', isAuspicious: false }
};

const DAY_CHOGHADIYA_SEQ: ChoghadiyaType[][] = [
  ['UDVEG', 'AMRIT', 'ROG', 'LABH', 'SHUBH', 'CHAR', 'ROG', 'KAAL'], // Sun
  ['AMRIT', 'KAAL', 'SHUBH', 'ROG', 'UDVEG', 'CHAR', 'LABH', 'AMRIT'], // Mon
  ['ROG', 'UDVEG', 'CHAR', 'LABH', 'AMRIT', 'KAAL', 'SHUBH', 'ROG'],   // Tue
  ['LABH', 'AMRIT', 'KAAL', 'SHUBH', 'ROG', 'UDVEG', 'CHAR', 'LABH'],   // Wed
  ['SHUBH', 'ROG', 'UDVEG', 'CHAR', 'LABH', 'AMRIT', 'KAAL', 'SHUBH'], // Thu
  ['CHAR', 'LABH', 'AMRIT', 'KAAL', 'SHUBH', 'ROG', 'UDVEG', 'CHAR'],   // Fri
  ['KAAL', 'SHUBH', 'ROG', 'UDVEG', 'CHAR', 'LABH', 'AMRIT', 'KAAL']    // Sat
];

export function calculateMuhurats(
  date: Date,
  sunriseStr: string,
  sunsetStr: string
): { auspicious: MuhuratTiming[]; inauspicious: MuhuratTiming[] } {
  const dayIndex = date.getDay(); // 0 = Sun
  
  const [sHour, sMin] = parseTimeString(sunriseStr);
  const [eHour, eMin] = parseTimeString(sunsetStr);

  const sunriseMin = sHour * 60 + sMin;
  const sunsetMin = eHour * 60 + eMin;
  const dayDurationMin = Math.max(1, sunsetMin - sunriseMin);
  const partMin = dayDurationMin / 8.0;

  // Abhijit Muhurat (middle of day)
  const midDayMin = sunriseMin + (dayDurationMin / 2);
  const abhijitStart = formatMinToTime(midDayMin - 24);
  const abhijitEnd = formatMinToTime(midDayMin + 24);

  const brahmaStart = formatMinToTime(sunriseMin - 96);
  const brahmaEnd = formatMinToTime(sunriseMin - 48);

  const vijayStart = formatMinToTime(midDayMin + 70);
  const vijayEnd = formatMinToTime(midDayMin + 118);

  // Inauspicious
  const rahuPart = RAHU_PARTS[dayIndex];
  const rahuStart = formatMinToTime(sunriseMin + (rahuPart - 1) * partMin);
  const rahuEnd = formatMinToTime(sunriseMin + rahuPart * partMin);

  const yamaPart = YAMA_PARTS[dayIndex];
  const yamaStart = formatMinToTime(sunriseMin + (yamaPart - 1) * partMin);
  const yamaEnd = formatMinToTime(sunriseMin + yamaPart * partMin);

  const gulikaPart = GULIKA_PARTS[dayIndex];
  const gulikaStart = formatMinToTime(sunriseMin + (gulikaPart - 1) * partMin);
  const gulikaEnd = formatMinToTime(sunriseMin + gulikaPart * partMin);

  return {
    auspicious: [
      {
        name: 'Abhijit Muhurat',
        hindiName: 'अभिजित मुहूर्त',
        startTime: abhijitStart,
        endTime: abhijitEnd,
        isAuspicious: true,
        description: 'Most sacred and powerful auspicious window for all major endeavors and ceremonies.'
      },
      {
        name: 'Brahma Muhurat',
        hindiName: 'ब्रह्म मुहूर्त',
        startTime: brahmaStart,
        endTime: brahmaEnd,
        isAuspicious: true,
        description: 'Ideal time for meditation, prayer, spiritual study, and yoga.'
      },
      {
        name: 'Vijaya Muhurat',
        hindiName: 'विजय मुहूर्त',
        startTime: vijayStart,
        endTime: vijayEnd,
        isAuspicious: true,
        description: 'Highly auspicious for beginning new projects, business deals, and journeys.'
      }
    ],
    inauspicious: [
      {
        name: 'Rahu Kalam',
        hindiName: 'राहु काल',
        startTime: rahuStart,
        endTime: rahuEnd,
        isAuspicious: false,
        description: 'Inauspicious time associated with Rahu. Avoid launching new projects or travels.'
      },
      {
        name: 'Yamaganda Kalam',
        hindiName: 'यमगण्ड काल',
        startTime: yamaStart,
        endTime: yamaEnd,
        isAuspicious: false,
        description: 'Inauspicious window ruled by Yama. Avoid important transactions.'
      },
      {
        name: 'Gulika Kalam',
        hindiName: 'गुलिक काल',
        startTime: gulikaStart,
        endTime: gulikaEnd,
        isAuspicious: false,
        description: 'Inauspicious window ruled by Gulika (son of Shani). Avoid beginning vital works.'
      }
    ]
  };
}

export function calculateChoghadiya(
  date: Date,
  sunriseStr: string,
  sunsetStr: string
): { dayChoghadiya: ChoghadiyaItem[]; nightChoghadiya: ChoghadiyaItem[] } {
  const dayIndex = date.getDay();
  const [sHour, sMin] = parseTimeString(sunriseStr);
  const [eHour, eMin] = parseTimeString(sunsetStr);

  const sunriseMin = sHour * 60 + sMin;
  const sunsetMin = eHour * 60 + eMin;

  const dayDurationMin = Math.max(1, sunsetMin - sunriseMin);
  const dayPartMin = dayDurationMin / 8.0;

  const nightDurationMin = 1440 - dayDurationMin;
  const nightPartMin = nightDurationMin / 8.0;

  const typesDay = DAY_CHOGHADIYA_SEQ[dayIndex];
  const dayChoghadiya: ChoghadiyaItem[] = typesDay.map((type, i) => {
    const meta = CHOGHADIYA_TYPES[type];
    return {
      type,
      name: meta.name,
      hindiName: meta.hindiName,
      isAuspicious: meta.isAuspicious,
      startTime: formatMinToTime(sunriseMin + i * dayPartMin),
      endTime: formatMinToTime(sunriseMin + (i + 1) * dayPartMin),
      isDayTime: true
    };
  });

  const typesNight = DAY_CHOGHADIYA_SEQ[(dayIndex + 1) % 7];
  const nightChoghadiya: ChoghadiyaItem[] = typesNight.map((type, i) => {
    const meta = CHOGHADIYA_TYPES[type];
    return {
      type,
      name: meta.name,
      hindiName: meta.hindiName,
      isAuspicious: meta.isAuspicious,
      startTime: formatMinToTime(sunsetMin + i * nightPartMin),
      endTime: formatMinToTime(sunsetMin + (i + 1) * nightPartMin),
      isDayTime: false
    };
  });

  return { dayChoghadiya, nightChoghadiya };
}

function parseTimeString(timeStr: string): [number, number] {
  // Expected format "hh:mm AM/PM" or "HH:mm"
  const parts = timeStr.split(' ');
  const [hStr, mStr] = parts[0].split(':');
  let h = parseInt(hStr, 10) || 6;
  const m = parseInt(mStr, 10) || 0;

  if (parts.length > 1) {
    const ampm = parts[1].toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
  }
  return [h, m];
}

function formatMinToTime(minutes: number): string {
  let normalized = Math.round(minutes) % 1440;
  if (normalized < 0) normalized += 1440;

  const h24 = Math.floor(normalized / 60);
  const m = normalized % 60;

  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const ampm = h24 >= 12 ? 'PM' : 'AM';

  const mFormatted = m < 10 ? `0${m}` : `${m}`;
  const hFormatted = h12 < 10 ? `0${h12}` : `${h12}`;
  return `${hFormatted}:${mFormatted} ${ampm}`;
}
