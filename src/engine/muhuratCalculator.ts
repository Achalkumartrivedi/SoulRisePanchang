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

export interface TimingProgress {
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
  progressPercent: number; // 0 to 100
  timeRemainingLabel: string; // e.g. "Ends in 24m", "Starts in 1h 15m", "Passed"
  isToday: boolean;
  durationMinutes: number;
}

export function parseTimeString(timeStr?: string): [number, number] {
  if (!timeStr) return [6, 0];
  // Expected format "hh:mm AM/PM" or "HH:mm"
  const clean = timeStr.replace(/\b(Today|Tomorrow|IST)\b/gi, '').trim();
  const parts = clean.split(' ');
  const [hStr, mStr] = (parts[0] || '06:00').split(':');
  let h = parseInt(hStr, 10);
  if (isNaN(h)) h = 6;
  let m = parseInt(mStr, 10);
  if (isNaN(m)) m = 0;

  if (parts.length > 1) {
    const ampm = parts[1].toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
  }
  return [h, m];
}

export function formatMinToTime(minutes: number): string {
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

export function formatMinutesRemaining(minutes: number): string {
  if (minutes <= 0) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function calculateTimingProgress(
  startTimeStr: string,
  endTimeStr: string,
  dateIso: string,
  referenceDate: Date = new Date(),
  language: string = 'en'
): TimingProgress {
  const refYear = referenceDate.getFullYear();
  const refMonth = String(referenceDate.getMonth() + 1).padStart(2, '0');
  const refDay = String(referenceDate.getDate()).padStart(2, '0');
  const todayIso = `${refYear}-${refMonth}-${refDay}`;

  const formatStatusLabel = (type: 'STARTS' | 'ENDS' | 'PASSED' | 'UPCOMING', mins?: number): string => {
    const formattedMins = mins !== undefined ? formatMinutesRemaining(mins) : '';
    if (language === 'hi') {
      if (type === 'STARTS') return `शुरू होने में ${formattedMins}`;
      if (type === 'ENDS') return `समाप्ति में ${formattedMins}`;
      if (type === 'PASSED') return 'समाप्त';
      return 'आगामी';
    }
    if (language === 'hinglish') {
      if (type === 'STARTS') return `Starts in ${formattedMins}`;
      if (type === 'ENDS') return `Ends in ${formattedMins}`;
      if (type === 'PASSED') return 'Passed';
      return 'Upcoming';
    }
    if (language === 'gu') {
      if (type === 'STARTS') return `શરૂ થવામાં ${formattedMins}`;
      if (type === 'ENDS') return `સમાપ્તિમાં ${formattedMins}`;
      if (type === 'PASSED') return 'સમાપ્ત';
      return 'આગામી';
    }
    if (language === 'mr') {
      if (type === 'STARTS') return `सुरू होण्यास ${formattedMins}`;
      if (type === 'ENDS') return `समाप्तीस ${formattedMins}`;
      if (type === 'PASSED') return 'समाप्त';
      return 'आगामी';
    }
    // Default English
    if (type === 'STARTS') return `Starts in ${formattedMins}`;
    if (type === 'ENDS') return `Ends in ${formattedMins}`;
    if (type === 'PASSED') return 'Passed';
    return 'Upcoming';
  };

  const [sH, sM] = parseTimeString(startTimeStr);
  const [eH, eM] = parseTimeString(endTimeStr);

  let startMin = sH * 60 + sM;
  let endMin = eH * 60 + eM;
  if (endMin < startMin) {
    endMin += 1440;
  }
  const durationMinutes = Math.max(1, endMin - startMin);

  if (dateIso < todayIso) {
    return {
      status: 'COMPLETED',
      progressPercent: 100,
      timeRemainingLabel: formatStatusLabel('PASSED'),
      isToday: false,
      durationMinutes,
    };
  }

  if (dateIso > todayIso) {
    return {
      status: 'UPCOMING',
      progressPercent: 0,
      timeRemainingLabel: formatStatusLabel('UPCOMING'),
      isToday: false,
      durationMinutes,
    };
  }

  // Selected date is TODAY
  let currentMin = referenceDate.getHours() * 60 + referenceDate.getMinutes();

  // If time window crosses midnight and current time is post-midnight early morning (< 6 AM)
  if (endMin > 1440 && currentMin < 360) {
    currentMin += 1440;
  }

  if (currentMin < startMin) {
    const diff = startMin - currentMin;
    return {
      status: 'UPCOMING',
      progressPercent: 0,
      timeRemainingLabel: formatStatusLabel('STARTS', diff),
      isToday: true,
      durationMinutes,
    };
  } else if (currentMin >= startMin && currentMin <= endMin) {
    const elapsed = currentMin - startMin;
    const progressPercent = Math.min(100, Math.max(1, Math.round((elapsed / durationMinutes) * 100)));
    const rem = endMin - currentMin;
    return {
      status: 'ACTIVE',
      progressPercent,
      timeRemainingLabel: formatStatusLabel('ENDS', rem),
      isToday: true,
      durationMinutes,
    };
  } else {
    return {
      status: 'COMPLETED',
      progressPercent: 100,
      timeRemainingLabel: formatStatusLabel('PASSED'),
      isToday: true,
      durationMinutes,
    };
  }
}

export interface ActiveOrPreviousTimingResult {
  timing: MuhuratTiming;
  progress: TimingProgress;
}

/**
 * Intelligent selector for Auspicious/Inauspicious card on HomeScreen:
 * 1. If any timing is ACTIVE right now (e.g. Sayahna Sandhya, Abhijit, Rahu Kalam) -> returns the active timing.
 * 2. If NONE is active, returns the PREVIOUS (most recently completed) timing today.
 * 3. If no timing has completed yet (e.g. early morning), returns the next upcoming timing.
 * 4. Fallback to preferred default (e.g. Abhijit or Rahu Kalam).
 */
export function getActiveOrPreviousTiming(
  items: MuhuratTiming[] | undefined,
  currentDateIso: string,
  now: Date = new Date(),
  language: string = 'en',
  preferredDefaultName?: string
): ActiveOrPreviousTimingResult | null {
  if (!items || items.length === 0) return null;

  const realTodayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const isSelectedDateToday = currentDateIso === realTodayIso;

  const withProgress = items.map(timing => {
    const progress = calculateTimingProgress(timing.startTime, timing.endTime, currentDateIso, now, language);
    const [sH, sM] = parseTimeString(timing.startTime);
    const [eH, eM] = parseTimeString(timing.endTime);
    let startMin = sH * 60 + sM;
    let endMin = eH * 60 + eM;
    if (endMin < startMin) endMin += 1440;
    return { timing, progress, startMin, endMin };
  });

  // Chronological sort
  withProgress.sort((a, b) => a.startMin - b.startMin);

  if (!isSelectedDateToday) {
    const found = preferredDefaultName
      ? withProgress.find(p => p.timing.name.toLowerCase().includes(preferredDefaultName.toLowerCase()))
      : null;
    const target = found || withProgress[0];
    return { timing: target.timing, progress: target.progress };
  }

  // TODAY:
  // 1. Check for currently ACTIVE timing
  const activeItem = withProgress.find(p => p.progress.status === 'ACTIVE');
  if (activeItem) {
    return { timing: activeItem.timing, progress: activeItem.progress };
  }

  // 2. Check for PREVIOUS (most recently completed) timing
  let currentMin = now.getHours() * 60 + now.getMinutes();
  const completedItems = withProgress.filter(p => p.progress.status === 'COMPLETED' || p.endMin <= currentMin);
  if (completedItems.length > 0) {
    const prevItem = completedItems[completedItems.length - 1];
    return { timing: prevItem.timing, progress: prevItem.progress };
  }

  // 3. Early morning before any has completed -> pick the first upcoming
  const upcomingItems = withProgress.filter(p => p.progress.status === 'UPCOMING');
  if (upcomingItems.length > 0) {
    return { timing: upcomingItems[0].timing, progress: upcomingItems[0].progress };
  }

  const fallback = preferredDefaultName
    ? withProgress.find(p => p.timing.name.toLowerCase().includes(preferredDefaultName.toLowerCase()))
    : null;
  const target = fallback || withProgress[0];
  return { timing: target.timing, progress: target.progress };
}

export function calculateMuhurats(
  date: Date,
  sunriseStr: string,
  sunsetStr: string
): { auspicious: MuhuratTiming[]; inauspicious: MuhuratTiming[] } {
  const dayIndex = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  
  const [sHour, sMin] = parseTimeString(sunriseStr);
  const [eHour, eMin] = parseTimeString(sunsetStr);

  const sunriseMin = sHour * 60 + sMin;
  const sunsetMin = eHour * 60 + eMin;
  const dayDurationMin = Math.max(1, sunsetMin - sunriseMin);
  const nightDurationMin = Math.max(1, 1440 - dayDurationMin);

  // 15 Muhurats in Daytime and 15 in Nighttime
  const dayMuhuratLen = dayDurationMin / 15.0;
  const nightMuhuratLen = nightDurationMin / 15.0;
  const partMin = dayDurationMin / 8.0;

  // 1. Abhijit Muhurat (8th Muhurat of daytime, centered at Midday)
  const midDayMin = sunriseMin + (dayDurationMin / 2);
  const abhijitHalf = dayMuhuratLen / 2;
  const abhijitStart = formatMinToTime(midDayMin - abhijitHalf);
  const abhijitEnd = formatMinToTime(midDayMin + abhijitHalf);
  const isWednesday = dayIndex === 3;

  // 2. Brahma Muhurat (14th Muhurat of night, 2 Muhurats before sunrise)
  const brahmaStart = formatMinToTime(sunriseMin - (2 * nightMuhuratLen));
  const brahmaEnd = formatMinToTime(sunriseMin - (1 * nightMuhuratLen));

  // 3. Pratah Sandhya (15th Muhurat of night, 1 Muhurat before sunrise till sunrise)
  const pratahSandhyaStart = formatMinToTime(sunriseMin - (1 * nightMuhuratLen));
  const pratahSandhyaEnd = formatMinToTime(sunriseMin);

  // 4. Vijaya Muhurat (11th Muhurat of day)
  const vijayStart = formatMinToTime(sunriseMin + 10 * dayMuhuratLen);
  const vijayEnd = formatMinToTime(sunriseMin + 11 * dayMuhuratLen);

  // 5. Godhuli Muhurat (Dusk twilight, 24m before to 24m after sunset)
  const godhuliStart = formatMinToTime(sunsetMin - 24);
  const godhuliEnd = formatMinToTime(sunsetMin + 24);

  // 6. Sayahna Sandhya (Sunset to 1 Muhurat after sunset)
  const sayahnaStart = formatMinToTime(sunsetMin);
  const sayahnaEnd = formatMinToTime(sunsetMin + nightMuhuratLen);

  // 7. Amrit Kaal (Auspicious nectar period - morning 4th daytime muhurat slot)
  const amritKaalStart = formatMinToTime(sunriseMin + 3 * dayMuhuratLen);
  const amritKaalEnd = formatMinToTime(sunriseMin + 4.5 * dayMuhuratLen);

  // 8. Nishita Muhurat (8th Muhurat of night, centered at midnight)
  const midnightMin = sunsetMin + (nightDurationMin / 2);
  const nishitaStart = formatMinToTime(midnightMin - (nightMuhuratLen / 2));
  const nishitaEnd = formatMinToTime(midnightMin + (nightMuhuratLen / 2));

  // --- Inauspicious Timings (Kaal) ---
  // 1. Rahu Kalam (1/8th of daytime)
  const rahuPart = RAHU_PARTS[dayIndex];
  const rahuStart = formatMinToTime(sunriseMin + (rahuPart - 1) * partMin);
  const rahuEnd = formatMinToTime(sunriseMin + rahuPart * partMin);

  // 2. Yamaganda Kalam (1/8th of daytime)
  const yamaPart = YAMA_PARTS[dayIndex];
  const yamaStart = formatMinToTime(sunriseMin + (yamaPart - 1) * partMin);
  const yamaEnd = formatMinToTime(sunriseMin + yamaPart * partMin);

  // 3. Gulika Kalam (1/8th of daytime)
  const gulikaPart = GULIKA_PARTS[dayIndex];
  const gulikaStart = formatMinToTime(sunriseMin + (gulikaPart - 1) * partMin);
  const gulikaEnd = formatMinToTime(sunriseMin + gulikaPart * partMin);

  // 4. Dur Muhurat (Day-specific unfavorable muhurat based on classical tables)
  let durMuhuratStart = '';
  let durMuhuratEnd = '';
  switch (dayIndex) {
    case 0: // Sun: 14th Muhurat
      durMuhuratStart = formatMinToTime(sunriseMin + 13 * dayMuhuratLen);
      durMuhuratEnd = formatMinToTime(sunriseMin + 14 * dayMuhuratLen);
      break;
    case 1: // Mon: 8th & 9th Muhurat
      durMuhuratStart = formatMinToTime(sunriseMin + 7 * dayMuhuratLen);
      durMuhuratEnd = formatMinToTime(sunriseMin + 8.5 * dayMuhuratLen);
      break;
    case 2: // Tue: 4th Muhurat
      durMuhuratStart = formatMinToTime(sunriseMin + 3 * dayMuhuratLen);
      durMuhuratEnd = formatMinToTime(sunriseMin + 4 * dayMuhuratLen);
      break;
    case 3: // Wed: 8th Muhurat
      durMuhuratStart = formatMinToTime(sunriseMin + 7 * dayMuhuratLen);
      durMuhuratEnd = formatMinToTime(sunriseMin + 8 * dayMuhuratLen);
      break;
    case 4: // Thu: 6th & 7th Muhurat
      durMuhuratStart = formatMinToTime(sunriseMin + 5 * dayMuhuratLen);
      durMuhuratEnd = formatMinToTime(sunriseMin + 6.5 * dayMuhuratLen);
      break;
    case 5: // Fri: 4th & 9th Muhurat
      durMuhuratStart = formatMinToTime(sunriseMin + 3.5 * dayMuhuratLen);
      durMuhuratEnd = formatMinToTime(sunriseMin + 4.5 * dayMuhuratLen);
      break;
    case 6: // Sat: 1st & 2nd Muhurat
    default:
      durMuhuratStart = formatMinToTime(sunriseMin);
      durMuhuratEnd = formatMinToTime(sunriseMin + 1.5 * dayMuhuratLen);
      break;
  }

  // 5. Varjyam (Inauspicious portion of the afternoon)
  const varjyamStart = formatMinToTime(sunriseMin + 6.2 * dayMuhuratLen);
  const varjyamEnd = formatMinToTime(sunriseMin + 7.7 * dayMuhuratLen);

  // 6. Bhadra (Vishti Karana period - inauspicious window)
  const bhadraStart = formatMinToTime(sunriseMin + 4.5 * dayMuhuratLen);
  const bhadraEnd = formatMinToTime(sunriseMin + 6.0 * dayMuhuratLen);

  return {
    auspicious: [
      {
        name: 'Abhijit Muhurat',
        hindiName: 'अभिजित मुहूर्त',
        startTime: abhijitStart,
        endTime: abhijitEnd,
        isAuspicious: true,
        description: isWednesday
          ? 'Most sacred midday window. Note: In traditional Jyotish, avoided on Wednesdays due to Rahu Kaal overlap.'
          : 'Most sacred and powerful auspicious window for all major endeavors, new ventures, and ceremonies.'
      },
      {
        name: 'Brahma Muhurat',
        hindiName: 'ब्रह्म मुहूर्त',
        startTime: brahmaStart,
        endTime: brahmaEnd,
        isAuspicious: true,
        description: 'Ideal sacred window for meditation, prayer, spiritual study, yoga, and mental clarity.'
      },
      {
        name: 'Pratah Sandhya',
        hindiName: 'प्रातः सन्ध्या',
        startTime: pratahSandhyaStart,
        endTime: pratahSandhyaEnd,
        isAuspicious: true,
        description: 'Morning twilight period dedicated to Gayatri mantra japa, solar oblations, and spiritual renewal.'
      },
      {
        name: 'Vijaya Muhurat',
        hindiName: 'विजय मुहूर्त',
        startTime: vijayStart,
        endTime: vijayEnd,
        isAuspicious: true,
        description: 'Highly auspicious for beginning new ventures, contracts, important journeys, and resolving conflicts.'
      },
      {
        name: 'Godhuli Muhurat',
        hindiName: 'गोधूलि मुहूर्त',
        startTime: godhuliStart,
        endTime: godhuliEnd,
        isAuspicious: true,
        description: 'Divine twilight hour when dusk settles. Highly auspicious for evening prayers, Griha Pravesh, and ceremonies.'
      },
      {
        name: 'Sayahna Sandhya',
        hindiName: 'सायाह्न सन्ध्या',
        startTime: sayahnaStart,
        endTime: sayahnaEnd,
        isAuspicious: true,
        description: 'Evening spiritual twilight. Auspicious for evening aarti, lamp lighting, and contemplation.'
      },
      {
        name: 'Amrit Kaal',
        hindiName: 'अमृत काल',
        startTime: amritKaalStart,
        endTime: amritKaalEnd,
        isAuspicious: true,
        description: 'Sacred nectar window endowed with divine blessings. Exceptional for important ceremonies.'
      },
      {
        name: 'Nishita Muhurat',
        hindiName: 'निशीथ मुहूर्त',
        startTime: nishitaStart,
        endTime: nishitaEnd,
        isAuspicious: true,
        description: 'Midnight sacred muhurat revered for Shiva worship, deep spiritual meditation, and esoteric practices.'
      }
    ],
    inauspicious: [
      {
        name: 'Rahu Kalam',
        hindiName: 'राहु काल',
        startTime: rahuStart,
        endTime: rahuEnd,
        isAuspicious: false,
        description: 'Inauspicious window governed by Rahu. Strictly avoid launching new projects, investments, or travels.'
      },
      {
        name: 'Yamaganda Kalam',
        hindiName: 'यमगण्ड काल',
        startTime: yamaStart,
        endTime: yamaEnd,
        isAuspicious: false,
        description: 'Inauspicious window ruled by Yama. Avoid important transactions and starting journeys.'
      },
      {
        name: 'Gulika Kalam',
        hindiName: 'गुलिक काल',
        startTime: gulikaStart,
        endTime: gulikaEnd,
        isAuspicious: false,
        description: 'Window ruled by Gulika (son of Shani). Actions initiated during Gulika tend to repeat.'
      },
      {
        name: 'Dur Muhurat',
        hindiName: 'दुर्मुहूर्त',
        startTime: durMuhuratStart,
        endTime: durMuhuratEnd,
        isAuspicious: false,
        description: 'Unfavorable astrological window based on day ruler. Avoid major auspicious tasks during this time.'
      },
      {
        name: 'Varjyam',
        hindiName: 'वर्ज्य काल',
        startTime: varjyamStart,
        endTime: varjyamEnd,
        isAuspicious: false,
        description: 'Harmful astronomical transit period. Strictly avoid weddings, Griha Pravesh, and vital beginnings.'
      },
      {
        name: 'Bhadra (Vishti)',
        hindiName: 'भद्रा काल',
        startTime: bhadraStart,
        endTime: bhadraEnd,
        isAuspicious: false,
        description: 'Vishti Karana influence. Auspicious ceremonies and travels should be avoided during Bhadra.'
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
